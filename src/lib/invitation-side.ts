import type { Event, InvitationSide, SiteConfig } from "@/types";

export type { InvitationSide };

export const INVITATION_SIDES: Record<
  InvitationSide,
  { path: string; label: string; ceremony: string; eventLabel: string }
> = {
  bride: {
    path: "/nha-gai",
    label: "Nhà gái",
    ceremony: "Lễ vu quy",
    eventLabel: "Tham dự tiệc mừng lễ vu quy của",
  },
  groom: {
    path: "/nha-trai",
    label: "Nhà trai",
    ceremony: "Lễ thành hôn",
    eventLabel: "Tham dự tiệc mừng lễ thành hôn của",
  },
};

export function eventsForSide(events: Event[], side: InvitationSide): Event[] {
  const tagged = events.filter((event) => event.side === side);
  if (tagged.length > 0) return tagged;
  return side === "bride" ? events.slice(0, 1) : events.slice(1);
}

export function configForSide(config: SiteConfig, side: InvitationSide): SiteConfig {
  return { ...config, events: eventsForSide(config.events, side) };
}
