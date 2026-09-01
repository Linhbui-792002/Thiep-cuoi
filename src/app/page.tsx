import { getSiteConfig, getContentSections, getPageSections, getWishes } from "@/lib/data";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [config, sections, pageSections, wishes] = await Promise.all([
    getSiteConfig(),
    getContentSections(),
    getPageSections(),
    getWishes(),
  ]);

  return (
    <InvitationPage
      data={{
        config,
        sections,
        pageSections,
        wishes,
      }}
    />
  );
}
