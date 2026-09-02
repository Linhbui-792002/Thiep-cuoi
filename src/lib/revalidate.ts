import { revalidatePath, revalidateTag } from "next/cache";

export const INVITATION_CACHE_TAG = "invitation";

export function revalidateInvitation() {
  revalidateTag(INVITATION_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/nha-gai");
  revalidatePath("/nha-trai");
}
