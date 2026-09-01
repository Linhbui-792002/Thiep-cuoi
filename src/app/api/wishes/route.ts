import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Wish from "@/models/Wish";

export async function GET() {
  try {
    await connectDB();
    const wishes = await Wish.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(wishes);
  } catch (error) {
    console.error("GET wishes error:", error);
    return NextResponse.json({ error: "Không thể tải lời chúc" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const message = body.message?.trim();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ tên và lời chúc" },
        { status: 400 },
      );
    }

    if (name.length > 100 || message.length > 500) {
      return NextResponse.json({ error: "Nội dung quá dài" }, { status: 400 });
    }

    await connectDB();
    const wish = await Wish.create({ name, message });
    return NextResponse.json(wish, { status: 201 });
  } catch (error) {
    console.error("POST wish error:", error);
    return NextResponse.json({ error: "Không thể gửi lời chúc" }, { status: 500 });
  }
}
