import type { Metadata } from "next";
import type { InvitationSide, SiteConfig } from "@/types";
import { INVITATION_SIDES } from "@/lib/invitation-side";
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

export function pageMetadata(
  config: SiteConfig,
  options: { path: string; title: string; description: string },
): Metadata {
  const names = coupleTitle(config);
  const fullTitle = `${options.title} | ${names}`;
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
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: options.description,
    },
  };
}
