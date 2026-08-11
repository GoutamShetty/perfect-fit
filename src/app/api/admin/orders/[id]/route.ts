import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getAdminFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { id } = await params;
    const { status, paymentStatus } = await req.json();
    const update: Record<string, unknown> = {};
    if (status) {
      if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      update.status = status;
    }
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const order = await Order.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
