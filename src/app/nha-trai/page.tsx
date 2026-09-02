import { getCachedInvitationData } from "@/lib/data";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export const revalidate = 60;

export default async function NhaTraiPage() {
  const data = await getCachedInvitationData("groom");
  return <InvitationPage data={data} />;
}
