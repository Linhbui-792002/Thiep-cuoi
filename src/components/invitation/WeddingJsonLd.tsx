import type { InvitationSide, SiteConfig } from "@/types";
import { INVITATION_SIDES } from "@/lib/invitation-side";
import { coupleTitle, getSiteUrl } from "@/lib/seo";

export function WeddingJsonLd({
  config,
  side,
}: {
  config: SiteConfig;
  side: InvitationSide;
}) {
  const event = config.events[0];
  const meta = INVITATION_SIDES[side];
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${meta.ceremony} — ${coupleTitle(config)}`,
    description: `Trân trọng kính mời bạn tham dự ${meta.ceremony.toLowerCase()} của ${coupleTitle(config)}.`,
    startDate: config.weddingDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    inLanguage: "vi",
    url: `${getSiteUrl()}${meta.path}`,
    organizer: {
      "@type": "Person",
      name: coupleTitle(config),
    },
    ...(event
      ? {
          location: {
            "@type": "Place",
            name: event.location,
            address: event.address,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
