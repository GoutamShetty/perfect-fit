import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId, phone } = await req.json();
    if (!orderId || !phone) {
      return NextResponse.json({ error: "Order ID and phone are required" }, { status: 400 });
    }
    const order = await Order.findOne({
      orderId: String(orderId).toUpperCase().trim(),
      "customer.phone": String(phone).trim(),
    }).lean();
    if (!order) {
      return NextResponse.json({ error: "No order found for those details" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to track order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
