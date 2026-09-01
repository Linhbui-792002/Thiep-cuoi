"use client";

import { useState } from "react";
import { InvitationData } from "@/types";
import { isSectionEnabled } from "@/lib/sections";
import { DEFAULT_SITE_CONFIG } from "@/lib/constants";
import { ThemeProvider } from "./ThemeProvider";
import {
  HeroSection,
  CalendarSection,
  InviteSection,
  FamilySection,
  EventSection,
  RsvpIntroSection,
  GallerySection,
  ThankYouSection,
} from "./CineloveSections";
import { RsvpSection } from "./RsvpSection";
import { FloatingUI } from "./FloatingUI";
import { GiftModal, GiftSection, isGiftConfigured } from "./GiftSection";

interface Props {
  data: InvitationData;
}

export function InvitationPage({ data }: Props) {
  const { config, sections, pageSections, wishes } = data;
  const [giftOpen, setGiftOpen] = useState(false);
  const coverImage = sections.find((s) => s.key === "hero")?.images[0]?.url;
  const gift = config.gift ?? DEFAULT_SITE_CONFIG.gift;
  const showGift = isGiftConfigured(gift);

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
        {showGift && <GiftSection gift={gift} onOpen={() => setGiftOpen(true)} />}
        <div className="h-24" />
      </div>

      <FloatingUI
        initialWishes={wishes}
        brideName={config.brideName}
        groomName={config.groomName}
        coverImage={coverImage}
        youtubeMusicUrl={config.youtubeMusicUrl}
        showGift={showGift}
        onGiftClick={() => setGiftOpen(true)}
      />

      <GiftModal
        gift={gift}
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        coupleName={`${config.brideName} & ${config.groomName}`}
      />
    </ThemeProvider>
  );
}
