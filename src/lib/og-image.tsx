import mongoose from "mongoose";
import { ImageResponse } from "next/og";
import { getCachedSiteConfig } from "@/lib/data";
import { connectDB } from "@/lib/mongodb";
import { DOC_TYPES, MONGODB_COLLECTION } from "@/lib/db-config";
import { formatDateSlash } from "@/lib/images";
import { getSeoImageUrl } from "@/lib/seo";
import { INVITATION_SIDES, type InvitationSide } from "@/lib/invitation-side";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

function asBytes(data: unknown): Buffer | null {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (typeof data === "object" && "buffer" in data) {
    const buf = (data as { buffer: ArrayBuffer | Uint8Array }).buffer;
    return Buffer.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf));
  }
  return null;
}

async function loadCalendarPhoto(seoImageUrl: string | undefined): Promise<Buffer | null> {
  if (!seoImageUrl) return null;
  const idMatch = /\/api\/images\/([a-f0-9]{24})/i.exec(seoImageUrl);
  if (idMatch && mongoose.Types.ObjectId.isValid(idMatch[1])) {
    try {
      const conn = await connectDB();
      const doc = await conn.connection.db!.collection(MONGODB_COLLECTION).findOne({
        _id: new mongoose.Types.ObjectId(idMatch[1]),
        docType: DOC_TYPES.UPLOAD,
      });
      return asBytes(doc?.data);
    } catch {
      return null;
    }
  }
  try {
    const res = await fetch(seoImageUrl);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function invitationOgImage(side?: InvitationSide) {
  const [config, seoImageUrl] = await Promise.all([
    getCachedSiteConfig(),
    getSeoImageUrl(),
  ]);
  const names = `${config.brideName}  &  ${config.groomName}`;
  const date = formatDateSlash(config.weddingDate);
  const kicker = side
    ? `${INVITATION_SIDES[side].label} · ${INVITATION_SIDES[side].ceremony}`
    : "Thiệp cưới";
  const { primary, background, accent } = config.theme;
  const photoData = await loadCalendarPhoto(seoImageUrl);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: primary,
        }}
      >
        {photoData ? (
          // eslint-disable-next-line @next/next/no-img-element -- next/og ImageResponse
          <img
            src={photoData}
            width={1200}
            height={630}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              photoData != null
                ? "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)"
                : "transparent",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
              backgroundColor: photoData ? "transparent" : background,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 26,
                letterSpacing: 6,
                color: photoData ? "#ffffff" : accent,
              }}
            >
              {kicker}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 64,
                color: photoData ? "#ffffff" : primary,
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
                color: photoData ? "#ffffff" : primary,
              }}
            >
              {date}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
