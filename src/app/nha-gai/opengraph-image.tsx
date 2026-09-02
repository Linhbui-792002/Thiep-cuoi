import { invitationOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Thiệp cưới nhà gái";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return invitationOgImage("bride");
}
