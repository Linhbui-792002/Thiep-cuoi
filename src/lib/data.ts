import { connectDB } from "@/lib/mongodb";
import { SECTION_DEFINITIONS, DEFAULT_SITE_CONFIG } from "@/lib/constants";
import {
  SECTION_GROUPS,
  getDefaultContent,
} from "@/lib/sections";
import { loadSiteConfig } from "@/lib/site-config-store";
import { normalizeTheme } from "@/lib/theme";
import type { InvitationData, InvitationSide, PageSectionData } from "@/types";
import { configForSide } from "@/lib/invitation-side";
import ContentSection from "@/models/ContentSection";
import PageSection from "@/models/PageSection";
import Wish from "@/models/Wish";

function mapContent(raw: unknown): Record<string, string> {
  if (!raw) return {};
  if (raw instanceof Map) return Object.fromEntries(raw.entries());
  if (typeof raw === "object") return raw as Record<string, string>;
  return {};
}

export async function getSiteConfig() {
  try {
    return await loadSiteConfig();
  } catch (error) {
    console.error("getSiteConfig error:", error);
    return {
      ...DEFAULT_SITE_CONFIG,
      theme: normalizeTheme(DEFAULT_SITE_CONFIG.theme),
    };
  }
}

export async function getContentSections() {
  try {
    await connectDB();
    const sections = await ContentSection.find().sort({ key: 1 }).lean();

    const sectionMap = new Map(sections.map((s) => [s.key, s]));

    return SECTION_DEFINITIONS.map((def) => {
      const existing = sectionMap.get(def.key);
      return {
        key: def.key,
        title: existing?.title || def.title,
        images: existing?.images?.sort((a: { order: number }, b: { order: number }) => a.order - b.order) || [],
      };
    });
  } catch {
    return SECTION_DEFINITIONS.map((def) => ({
      key: def.key,
      title: def.title,
      images: [],
    }));
  }
}

export async function getPageSections(): Promise<PageSectionData[]> {
  try {
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
      const content = { ...defaults, ...mapContent(saved?.content) };

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
  } catch {
    return SECTION_GROUPS.map((group) => ({
      key: group.key,
      title: group.title,
      description: group.description,
      order: group.order,
      enabled: true,
      content: getDefaultContent(group.key),
      fields: group.fields,
      imageKeys: group.imageKeys,
      images: undefined,
    }));
  }
}

export async function getWishes(limit = 50) {
  try {
    await connectDB();
    const wishes = await Wish.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(wishes));
  } catch {
    return [];
  }
}

export async function loadInvitationData(side: InvitationSide): Promise<InvitationData> {
  const [config, sections, pageSections, wishes] = await Promise.all([
    getSiteConfig(),
    getContentSections(),
    getPageSections(),
    getWishes(),
  ]);

  return {
    config: configForSide(config, side),
    sections,
    pageSections,
    wishes,
    side,
  };
}

export function getImagesByKey(
  sections: Awaited<ReturnType<typeof getContentSections>>,
  key: string,
) {
  return sections.find((s) => s.key === key)?.images || [];
}
