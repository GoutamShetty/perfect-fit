import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { computeCouponDiscount } from "@/lib/coupon";
import { computeShipping } from "@/lib/config";
import { getRazorpay } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

type IncomingItem = { productId: string; size?: string; color?: string; qty: number };

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { items, customer, couponCode, paymentMethod } = body as {
      items: IncomingItem[];
      customer: Record<string, string>;
      couponCode?: string;
      paymentMethod: "razorpay" | "cod";
    };

    if (!items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json({ error: "Name, phone and address are required" }, { status: 400 });
    }
    if (!["razorpay", "cod"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    // Re-price on the server against the DB (never trust client prices).
    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const map = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const p = map.get(String(item.productId));
      if (!p) return NextResponse.json({ error: "A product in your cart is unavailable" }, { status: 400 });
      const qty = Math.max(1, Number(item.qty) || 1);
      const price = p.price.selling;
      subtotal += price * qty;
      orderItems.push({
        productId: String(p._id),
        name: p.name,
        image: p.images?.[0] || "",
        size: item.size || "",
        color: item.color || "",
        qty,
        price,
      });
    }

    let discount = 0;
    let appliedCode = "";
    if (couponCode) {
      const result = await computeCouponDiscount(couponCode, subtotal);
      if (result.valid) {
        discount = result.discount;
        appliedCode = result.code || "";
      }
    }

    const afterDiscount = subtotal - discount;
    const shipping = computeShipping(afterDiscount);
    const amount = afterDiscount + shipping;

    const order = await Order.create({
      items: orderItems,
      customer,
      subtotal,
      discount,
      shipping,
      amount,
      couponCode: appliedCode,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "COD_PENDING" : "PENDING",
      status: paymentMethod === "cod" ? "CONFIRMED" : "PENDING",
    });

    // For online payments, create a Razorpay order if configured.
    if (paymentMethod === "razorpay") {
      const rzp = getRazorpay();
      if (!rzp) {
        await Order.findByIdAndDelete(order._id);
        return NextResponse.json(
          { error: "Online payment is not configured. Please choose Cash on Delivery." },
          { status: 400 }
        );
      }
      const rzpOrder = await rzp.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: order.orderId,
      });
      order.razorpay = { orderId: rzpOrder.id, paymentId: "", signature: "" };
      await order.save();
      return NextResponse.json({
        order: JSON.parse(JSON.stringify(order)),
        razorpay: {
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
        },
      });
    }

    return NextResponse.json({ order: JSON.parse(JSON.stringify(order)) }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to place order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  // Admin listing is handled in /api/admin/orders.
  return NextResponse.json({ error: "Not available" }, { status: 404 });
}
