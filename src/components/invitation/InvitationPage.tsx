"use client";

import { InvitationData } from "@/types";
import { isSectionEnabled } from "@/lib/sections";
import { ThemeProvider } from "./ThemeProvider";
import {
  HeroSection,
  CalendarSection,
  InviteSection,
  FamilySection,
  EventSection,
  RsvpIntroSection,
  GallerySection,
  BottomSection,
  ThankYouSection,
} from "./CineloveSections";
import { RsvpSection } from "./RsvpSection";
import { FloatingUI } from "./FloatingUI";

interface Props {
  data: InvitationData;
}

export function InvitationPage({ data }: Props) {
  const { config, sections, pageSections, wishes } = data;
  const coverImage =
    sections.find((s) => s.key === "hero")?.images[0]?.url ||
    sections.find((s) => s.key === "envelope")?.images[0]?.url;

  return (
    <ThemeProvider theme={config.theme} className="cinelove-page">
      <div className="cinelove-scroll">
        {isSectionEnabled(pageSections, "hero") && (
          <HeroSection config={config} sections={sections} pageSections={pageSections} />
        )}
        {isSectionEnabled(pageSections, "calendar") && (
          <CalendarSection config={config} sections={sections} pageSections={pageSections} />
        )}
        {isSectionEnabled(pageSections, "invite") && (
          <InviteSection
            config={config}
            sections={sections}
            pageSections={pageSections}
            side={data.side}
          />
        )}
        {isSectionEnabled(pageSections, "family") && (
          <FamilySection config={config} pageSections={pageSections} />
        )}
        {isSectionEnabled(pageSections, "events") && (
          <EventSection config={config} pageSections={pageSections} />
        )}
        {isSectionEnabled(pageSections, "thankyou") && (
          <ThankYouSection pageSections={pageSections} />
        )}
        {isSectionEnabled(pageSections, "rsvp_intro") && (
          <RsvpIntroSection pageSections={pageSections} />
        )}
        <RsvpSection side={data.side} />
        {isSectionEnabled(pageSections, "gallery") && (
          <GallerySection sections={sections} pageSections={pageSections} />
        )}
        {isSectionEnabled(pageSections, "bottom") && (
          <BottomSection config={config} sections={sections} pageSections={pageSections} />
        )}
      </div>

      <FloatingUI
        initialWishes={wishes}
        brideName={config.brideName}
        groomName={config.groomName}
        coverImage={coverImage}
        youtubeMusicUrl={config.youtubeMusicUrl}
      />
    </ThemeProvider>
  );
}
