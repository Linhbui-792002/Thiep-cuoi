import { getCachedInvitationData } from "@/lib/data";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export const revalidate = 60;

export default async function NhaGaiPage() {
  const data = await getCachedInvitationData("bride");
  return <InvitationPage data={data} />;
}
