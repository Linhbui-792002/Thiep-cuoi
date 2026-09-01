import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import ContentSection from "@/models/ContentSection";
import { SECTION_DEFINITIONS } from "@/lib/constants";

export async function GET() {
  try {
    await connectDB();
    const sections = await ContentSection.find().sort({ key: 1 }).lean();
    const sectionMap = new Map(sections.map((s) => [s.key, s]));

    const result = SECTION_DEFINITIONS.map((def) => {
      const existing = sectionMap.get(def.key);
      return {
        key: def.key,
        title: existing?.title || def.title,
        description: def.description,
        images: existing?.images?.sort((a: { order: number }, b: { order: number }) => a.order - b.order) || [],
        _id: existing?._id,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET content error:", error);
    return NextResponse.json({ error: "Không thể tải nội dung" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, images, title } = body;

    if (!key) {
      return NextResponse.json({ error: "Thiếu key section" }, { status: 400 });
    }

    await connectDB();
    const section = await ContentSection.findOneAndUpdate(
      { key },
      {
        key,
        title: title || SECTION_DEFINITIONS.find((s) => s.key === key)?.title,
        images: images || [],
      },
      { upsert: true, returnDocument: "after" },
    );

    return NextResponse.json(section);
  } catch (error) {
    console.error("PUT content error:", error);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const imageId = searchParams.get("imageId");

    if (!key || !imageId) {
      return NextResponse.json({ error: "Thiếu tham số" }, { status: 400 });
    }

    await connectDB();
    const section = await ContentSection.findOne({ key });
    if (!section) {
      return NextResponse.json({ error: "Không tìm thấy section" }, { status: 404 });
    }

    section.images = section.images.filter(
      (img: { _id?: unknown }) => String(img._id) !== imageId,
    );
    await section.save();

    return NextResponse.json(section);
  } catch (error) {
    console.error("DELETE content error:", error);
    return NextResponse.json({ error: "Không thể xóa ảnh" }, { status: 500 });
  }
}
