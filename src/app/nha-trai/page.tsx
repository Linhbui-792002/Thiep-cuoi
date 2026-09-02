import type { Metadata } from "next";
import { getCachedInvitationData, getCachedSiteConfig } from "@/lib/data";
import { InvitationPage } from "@/components/invitation/InvitationPage";
import { WeddingJsonLd } from "@/components/invitation/WeddingJsonLd";
import { INVITATION_SIDES } from "@/lib/invitation-side";
import { invitationDescription, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCachedSiteConfig();
  const { label, ceremony, path } = INVITATION_SIDES.groom;
  return pageMetadata(config, {
    path,
    title: `${label} · ${ceremony}`,
    description: invitationDescription(config, "groom"),
  });
}

export default async function NhaTraiPage() {
  const data = await getCachedInvitationData("groom");
  return (
    <>
      <WeddingJsonLd config={data.config} side="groom" />
      <InvitationPage data={data} />
    </>
  );
}
