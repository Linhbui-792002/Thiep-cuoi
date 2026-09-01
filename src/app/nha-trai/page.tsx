import { loadInvitationData } from "@/lib/data";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export const dynamic = "force-dynamic";

export default async function NhaTraiPage() {
  const data = await loadInvitationData("groom");
  return <InvitationPage data={data} />;
}
