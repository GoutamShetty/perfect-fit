import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { HomeContent } from "@/models/HomeContent";
import { getAdminFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    let content = await HomeContent.findOne({ key: "singleton" }).lean();
    if (!content) {
      const created = await HomeContent.create({ key: "singleton" });
      content = created.toObject();
    }
    return NextResponse.json({ content });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load home content";
    return NextResponse.json({ error: message, content: null }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const body = await req.json();
    delete body._id;
    delete body.key;
    const content = await HomeContent.findOneAndUpdate({ key: "singleton" }, body, {
      new: true,
      upsert: true,
    }).lean();
    return NextResponse.json({ content });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update home content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
