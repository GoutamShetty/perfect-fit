import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";
import { getAdminFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const coupons = await Coupon.find().sort("-createdAt").lean();
    return NextResponse.json({ coupons });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load coupons";
    return NextResponse.json({ error: message, coupons: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const body = await req.json();
    if (!body.code || !body.type || body.value == null) {
      return NextResponse.json({ error: "Code, type and value are required" }, { status: 400 });
    }
    const coupon = await Coupon.create({
      code: String(body.code).toUpperCase().trim(),
      type: body.type,
      value: Number(body.value),
      minCart: Number(body.minCart) || 0,
      maxDiscount: Number(body.maxDiscount) || 0,
      active: body.active !== false,
      expiresAt: body.expiresAt || undefined,
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create coupon";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete coupon";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
