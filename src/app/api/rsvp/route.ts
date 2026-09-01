import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Rsvp from "@/models/Rsvp";

export async function GET() {
  try {
    await connectDB();
    const items = await Rsvp.find().sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET rsvp error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const attending = Boolean(body.attending);
    const guestCount = attending ? Math.min(10, Math.max(1, body.guestCount || 1)) : 0;
    const side = body.side === "groom" ? "groom" : "bride";

    if (!name) {
      return NextResponse.json({ error: "Vui lòng nhập họ tên" }, { status: 400 });
    }

    await connectDB();
    const rsvp = await Rsvp.create({ name, attending, guestCount, side });
    return NextResponse.json(rsvp, { status: 201 });
  } catch (error) {
    console.error("POST rsvp error:", error);
    return NextResponse.json({ error: "Không thể gửi xác nhận" }, { status: 500 });
  }
}
