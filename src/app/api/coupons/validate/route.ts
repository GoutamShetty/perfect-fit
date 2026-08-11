import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { computeCouponDiscount } from "@/lib/coupon";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, subtotal } = await req.json();
    const result = await computeCouponDiscount(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to validate coupon";
    return NextResponse.json({ valid: false, discount: 0, message }, { status: 500 });
  }
}
