import { loadInvitationData } from "@/lib/data";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export const dynamic = "force-dynamic";

export default async function NhaGaiPage() {
  const data = await loadInvitationData("bride");
  return <InvitationPage data={data} />;
}
