import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { DOC_TYPES, MONGODB_COLLECTION } from "@/lib/db-config";

function asBytes(data: unknown): Uint8Array | null {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return new Uint8Array(data);
  if (data instanceof Uint8Array) return data;
  if (typeof data === "object" && "buffer" in data) {
    const buf = (data as { buffer: ArrayBuffer | Uint8Array }).buffer;
    return buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const conn = await connectDB();
    const col = conn.connection.db!.collection(MONGODB_COLLECTION);
    const doc = await col.findOne({
      _id: new mongoose.Types.ObjectId(id),
      docType: DOC_TYPES.UPLOAD,
    });

    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const bytes = asBytes(doc.data);
    if (!bytes) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": (doc.mimeType as string) || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET image error:", error);
    return NextResponse.json({ error: "Không thể tải ảnh" }, { status: 500 });
  }
}
