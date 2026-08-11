import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getAdminFromRequest } from "@/lib/auth";
import { slugify } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const includeInactive = searchParams.get("all") === "true" && getAdminFromRequest(req);
    const sort = searchParams.get("sort") || "-createdAt";

    const query: Record<string, unknown> = {};
    if (!includeInactive) query.isActive = true;
    if (category && category !== "All") query.category = category;
    if (featured === "true") query.featured = true;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query).sort(sort).lean();
    return NextResponse.json({ products });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load products";
    return NextResponse.json({ error: message, products: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.price?.selling) {
      return NextResponse.json({ error: "Name and selling price are required" }, { status: 400 });
    }
    const slug = `${slugify(body.name)}-${Math.random().toString(36).slice(2, 6)}`;
    const product = await Product.create({
      ...body,
      slug,
      price: {
        mrp: Number(body.price.mrp) || Number(body.price.selling),
        selling: Number(body.price.selling),
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
