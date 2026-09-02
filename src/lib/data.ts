import { unstable_cache } from "next/cache";
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
import { INVITATION_CACHE_TAG } from "@/lib/revalidate";
import ContentSection from "@/models/ContentSection";
import PageSection from "@/models/PageSection";
import Wish from "@/models/Wish";

type LeanImage = { _id?: unknown; url: string; alt: string; order: number };
type LeanContent = { key: string; title?: string; images?: LeanImage[] };
type LeanPage = { key: string; enabled?: boolean; content?: unknown };

function mapContent(raw: unknown): Record<string, string> {
  if (!raw) return {};
  if (raw instanceof Map) return Object.fromEntries(raw.entries());
  if (typeof raw === "object") return raw as Record<string, string>;
  return {};
}

function mapImages(images: LeanImage[] | undefined) {
  return [...(images || [])]
    .sort((a, b) => a.order - b.order)
    .map((img) => ({
      _id: img._id ? String(img._id) : undefined,
      url: img.url,
      alt: img.alt,
      order: img.order,
    }));
}

function mapContentSections(sections: LeanContent[]) {
  const sectionMap = new Map(sections.map((s) => [s.key, s]));

  return SECTION_DEFINITIONS.map((def) => {
    const existing = sectionMap.get(def.key);
    return {
      key: def.key,
      title: existing?.title || def.title,
      images: mapImages(existing?.images),
    };
  });
}

function mapPageSections(pageDocs: LeanPage[], imageDocs: LeanContent[]): PageSectionData[] {
  const pageMap = new Map(pageDocs.map((d) => [d.key, d]));
  const imageMap = new Map(imageDocs.map((d) => [d.key, d]));

  return SECTION_GROUPS.map((group) => {
    const saved = pageMap.get(group.key);
    const defaults = getDefaultContent(group.key);
    const content = { ...defaults, ...mapContent(saved?.content) };

    const images: PageSectionData["images"] = {};
    for (const imgKey of group.imageKeys || []) {
      images[imgKey] = mapImages(imageMap.get(imgKey)?.images);
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
    return mapContentSections(sections as LeanContent[]);
  } catch (error) {
    console.error("getContentSections error:", error);
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
    return mapPageSections(pageDocs as LeanPage[], imageDocs as LeanContent[]);
  } catch (error) {
    console.error("getPageSections error:", error);
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

export async function getWishes(limit = 24) {
  try {
    await connectDB();
    const wishes = await Wish.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("name message createdAt")
      .lean();
    return JSON.parse(JSON.stringify(wishes));
  } catch (error) {
    console.error("getWishes error:", error);
    return [];
  }
}

export async function loadInvitationData(side: InvitationSide): Promise<InvitationData> {
  try {
    await connectDB();
    const [config, contentDocs, pageDocs, wishes] = await Promise.all([
      getSiteConfig(),
      ContentSection.find().lean().exec().catch(() => []),
      PageSection.find().lean().exec().catch(() => []),
      Wish.find()
        .sort({ createdAt: -1 })
        .limit(24)
        .select("name message createdAt")
        .lean()
        .exec()
        .catch(() => []),
    ]);

    return {
      config: configForSide(config, side),
      sections: mapContentSections(contentDocs as LeanContent[]),
      pageSections: mapPageSections(pageDocs as LeanPage[], contentDocs as LeanContent[]),
      wishes: JSON.parse(JSON.stringify(wishes)),
      side,
    };
  } catch (error) {
    console.error("loadInvitationData error:", error);
    return {
      config: configForSide(
        { ...DEFAULT_SITE_CONFIG, theme: normalizeTheme(DEFAULT_SITE_CONFIG.theme) },
        side,
      ),
      sections: SECTION_DEFINITIONS.map((def) => ({
        key: def.key,
        title: def.title,
        images: [],
      })),
      pageSections: SECTION_GROUPS.map((group) => ({
        key: group.key,
        title: group.title,
        description: group.description,
        order: group.order,
        enabled: true,
        content: getDefaultContent(group.key),
        fields: group.fields,
        imageKeys: group.imageKeys,
        images: undefined,
      })),
      wishes: [],
      side,
    };
  }
}

export const getCachedSiteConfig = unstable_cache(
  async () => getSiteConfig(),
  ["site-config"],
  { tags: [INVITATION_CACHE_TAG], revalidate: 60 },
);

export const getCachedInvitationData = unstable_cache(
  async (side: InvitationSide) => loadInvitationData(side),
  ["invitation-data"],
  { tags: [INVITATION_CACHE_TAG], revalidate: 60 },
);

export function getImagesByKey(
  sections: Awaited<ReturnType<typeof getContentSections>>,
  key: string,
) {
  return sections.find((s) => s.key === key)?.images || [];
}
