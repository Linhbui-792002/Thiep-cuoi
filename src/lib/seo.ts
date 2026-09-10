import type { Metadata } from "next";
import type { InvitationSide, SiteConfig } from "@/types";
import { INVITATION_SIDES } from "@/lib/invitation-side";
import { getContentSections } from "@/lib/data";
import { formatDateSlash } from "@/lib/images";

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function coupleTitle(config: SiteConfig) {
  return `${config.brideName} & ${config.groomName}`;
}

export function invitationDescription(config: SiteConfig, side?: InvitationSide) {
  const date = formatDateSlash(config.weddingDate);
  const names = coupleTitle(config);
  if (!side) {
    return `Thiệp cưới điện tử của ${names} — ${date}. Mời bạn chọn thiệp nhà gái hoặc nhà trai.`;
  }
  const { ceremony } = INVITATION_SIDES[side];
  return `Trân trọng kính mời bạn tham dự ${ceremony.toLowerCase()} của ${names} vào ngày ${date}.`;
}

/** Ảnh SEO/OG = ảnh cạnh lịch (calendar). */
export async function getSeoImageUrl(): Promise<string | undefined> {
  const sections = await getContentSections();
  const url = sections.find((s) => s.key === "calendar")?.images?.[0]?.url;
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${getSiteUrl()}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function pageMetadata(
  config: SiteConfig,
  options: {
    path: string;
    title: string;
    description: string;
    imageUrl?: string;
  },
): Metadata {
  const names = coupleTitle(config);
  const fullTitle = `${options.title} | ${names}`;
  const images = options.imageUrl
    ? [{ url: options.imageUrl, alt: names }]
    : undefined;
  return {
    title: { absolute: fullTitle },
    description: options.description,
    alternates: { canonical: options.path },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: options.path,
      siteName: names,
      title: fullTitle,
      description: options.description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: options.description,
      ...(options.imageUrl ? { images: [options.imageUrl] } : {}),
    },
  };
}
