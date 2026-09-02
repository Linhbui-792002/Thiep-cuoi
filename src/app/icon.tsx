import { ImageResponse } from "next/og";
import { getCachedSiteConfig } from "@/lib/data";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default async function Icon() {
  const { theme } = await getCachedSiteConfig();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.primary,
          color: theme.background,
          fontSize: 28,
        }}
      >
        ♥
      </div>
    ),
    { ...size, emoji: "twemoji" },
  );
}
