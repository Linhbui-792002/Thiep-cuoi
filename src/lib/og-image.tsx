import { ImageResponse } from "next/og";
import { getCachedSiteConfig } from "@/lib/data";
import { formatDateSlash } from "@/lib/images";
import { INVITATION_SIDES, type InvitationSide } from "@/lib/invitation-side";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export async function invitationOgImage(side?: InvitationSide) {
  const config = await getCachedSiteConfig();
  const names = `${config.brideName}  &  ${config.groomName}`;
  const date = formatDateSlash(config.weddingDate);
  const kicker = side
    ? `${INVITATION_SIDES[side].label} · ${INVITATION_SIDES[side].ceremony}`
    : "Thiệp cưới";
  const { primary, background, accent } = config.theme;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: primary,
        }}
      >
        <div
          style={{
            width: 1128,
            height: 558,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: background,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              color: accent,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 64,
              color: primary,
            }}
          >
            {names}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              letterSpacing: 4,
              color: primary,
            }}
          >
            {date}
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
