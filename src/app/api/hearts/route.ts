import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HeartCount, { HEART_KEY } from "@/models/HeartCount";

function asCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export async function GET() {
  try {
    await connectDB();
    const doc = await HeartCount.findOne({ key: HEART_KEY }).lean();
    return NextResponse.json({ count: asCount(doc?.count) });
  } catch (error) {
    console.error("GET hearts error:", error);
    return NextResponse.json({ error: "Không thể tải lượt tim" }, { status: 500 });
  }
}

export async function POST() {
  try {
    await connectDB();
    const doc = await HeartCount.findOneAndUpdate(
      { key: HEART_KEY },
      { $inc: { count: 1 }, $setOnInsert: { key: HEART_KEY } },
      { upsert: true, returnDocument: "after" },
    );
    return NextResponse.json({ count: asCount(doc?.count) });
  } catch (error) {
    console.error("POST heart error:", error);
    return NextResponse.json({ error: "Không thể bắn tim" }, { status: 500 });
  }
}
