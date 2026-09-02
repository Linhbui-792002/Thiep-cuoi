import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { INVITATION_SIDES } from "@/lib/invitation-side";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  return [
    { url: site, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${site}${INVITATION_SIDES.bride.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site}${INVITATION_SIDES.groom.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
