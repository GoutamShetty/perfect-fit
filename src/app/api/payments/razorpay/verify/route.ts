import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const valid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    const order = await Order.findOne({ "razorpay.orderId": razorpay_order_id });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!valid) {
      order.paymentStatus = "FAILED";
      await order.save();
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    order.paymentStatus = "PAID";
    order.status = "CONFIRMED";
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;
    await order.save();

    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
