import type { Metadata } from "next";
import { getCachedInvitationData, getCachedSiteConfig } from "@/lib/data";
import { InvitationPage } from "@/components/invitation/InvitationPage";
import { WeddingJsonLd } from "@/components/invitation/WeddingJsonLd";
import { INVITATION_SIDES } from "@/lib/invitation-side";
import { getSeoImageUrl, invitationDescription, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [config, imageUrl] = await Promise.all([
    getCachedSiteConfig(),
    getSeoImageUrl(),
  ]);
  const { label, ceremony, path } = INVITATION_SIDES.bride;
  return pageMetadata(config, {
    path,
    title: `${label} · ${ceremony}`,
    description: invitationDescription(config, "bride"),
    imageUrl,
  });
}

export default async function NhaGaiPage() {
  const [data, imageUrl] = await Promise.all([
    getCachedInvitationData("bride"),
    getSeoImageUrl(),
  ]);
  return (
    <>
      <WeddingJsonLd config={data.config} side="bride" imageUrl={imageUrl} />
      <InvitationPage data={data} />
    </>
  );
}
