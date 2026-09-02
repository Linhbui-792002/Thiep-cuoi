import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import PageSection from "@/models/PageSection";
import ContentSection from "@/models/ContentSection";
import {
  SECTION_GROUPS,
  getDefaultContent,
} from "@/lib/sections";
import type { PageSectionData } from "@/types";
import { revalidateInvitation } from "@/lib/revalidate";

function mapContent(raw: unknown): Record<string, string> {
  if (!raw) return {};
  if (raw instanceof Map) return Object.fromEntries(raw.entries());
  if (typeof raw === "object") return raw as Record<string, string>;
  return {};
}

async function buildPageSections(): Promise<PageSectionData[]> {
  await connectDB();
  const [pageDocs, imageDocs] = await Promise.all([
    PageSection.find().lean(),
    ContentSection.find().lean(),
  ]);

  const pageMap = new Map(pageDocs.map((d) => [d.key, d]));
  const imageMap = new Map(imageDocs.map((d) => [d.key, d]));

  return SECTION_GROUPS.map((group) => {
    const saved = pageMap.get(group.key);
    const defaults = getDefaultContent(group.key);
    const savedContent = mapContent(saved?.content);
    const content = { ...defaults, ...savedContent };

    const images: PageSectionData["images"] = {};
    for (const imgKey of group.imageKeys || []) {
      const doc = imageMap.get(imgKey);
      images[imgKey] =
        doc?.images
          ?.sort((a: { order: number }, b: { order: number }) => a.order - b.order)
          .map((img: { _id?: unknown; url: string; alt: string; order: number }) => ({
            _id: img._id ? String(img._id) : undefined,
            url: img.url,
            alt: img.alt,
            order: img.order,
          })) || [];
    }

    return {
      key: group.key,
      title: group.title,
      description: group.description,
      order: group.order,
      enabled: saved?.enabled !== false,
      content,
      fields: group.fields,
      imageKeys: group.imageKeys,
      images: Object.keys(images).length > 0 ? images : undefined,
    };
  }).sort((a, b) => a.order - b.order);
}

export async function GET() {
  try {
    const sections = await buildPageSections();
    return NextResponse.json(sections);
  } catch (error) {
    console.error("GET sections error:", error);
    return NextResponse.json({ error: "Không thể tải sections" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, content, enabled } = body;

    if (!key) {
      return NextResponse.json({ error: "Thiếu key section" }, { status: 400 });
    }

    const group = SECTION_GROUPS.find((g) => g.key === key);
    if (!group) {
      return NextResponse.json({ error: "Section không hợp lệ" }, { status: 400 });
    }

    await connectDB();

    const update: Record<string, unknown> = {};
    if (content !== undefined) update.content = content;
    if (enabled !== undefined) update.enabled = enabled;
    update.order = group.order;

    await PageSection.findOneAndUpdate({ key }, update, {
      upsert: true,
      returnDocument: "after",
    });

    const sections = await buildPageSections();
    revalidateInvitation();
    return NextResponse.json(sections.find((s) => s.key === key));
  } catch (error) {
    console.error("PUT sections error:", error);
    return NextResponse.json({ error: "Không thể cập nhật" }, { status: 500 });
  }
}
