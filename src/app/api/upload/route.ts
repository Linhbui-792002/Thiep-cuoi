import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/mongodb";
import { DOC_TYPES, MONGODB_COLLECTION } from "@/lib/db-config";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không có file" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)" },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File quá lớn (tối đa 5MB)" }, { status: 400 });
    }

    const conn = await connectDB();
    const col = conn.connection.db!.collection(MONGODB_COLLECTION);
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await col.insertOne({
      docType: DOC_TYPES.UPLOAD,
      filename: file.name,
      mimeType: file.type,
      data: bytes,
      createdAt: new Date(),
    });

    return NextResponse.json({
      url: `/api/images/${result.insertedId}`,
      filename: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
