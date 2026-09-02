"use client";

import { useEffect, useRef, useState } from "react";
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
  type IntroPhase,
} from "./CineloveSections";
import { RsvpSection } from "./RsvpSection";
import { FloatingUI } from "./FloatingUI";
import { GiftModal, GiftSection, isGiftConfigured } from "./GiftSection";
import { OpeningOverlay } from "./OpeningOverlay";

interface Props {
  data: InvitationData;
}

export function InvitationPage({ data }: Props) {
  const { config, sections, pageSections, wishes } = data;
  const [giftOpen, setGiftOpen] = useState(false);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("mist");
  const scrollRef = useRef<HTMLDivElement>(null);
  const coverImage = sections.find((s) => s.key === "hero")?.images[0]?.url;
  const gift = config.gift ?? DEFAULT_SITE_CONFIG.gift;
  const showGift = isGiftConfigured(gift);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroPhase("done");
      return;
    }

    let openTimer = 0;
    let envelopeTimer = 0;
    let doneTimer = 0;
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        openTimer = window.setTimeout(() => setIntroPhase("open"), 360);
        envelopeTimer = window.setTimeout(() => setIntroPhase("envelope"), 1280);
        doneTimer = window.setTimeout(() => setIntroPhase("done"), 3300);
      });
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(openTimer);
      window.clearTimeout(envelopeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (introPhase !== "done") return;
    const el = scrollRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let running = false;
    let raf = 0;
    let leftover = 0;
    let last = 0;
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };
    const tick = (now: number) => {
      if (!running) return;
      if (last) leftover += (now - last) * 0.024;
      last = now;
      const step = Math.floor(leftover);
      if (step > 0) {
        el.scrollTop += step;
        leftover -= step;
      }
      if (el.scrollTop >= el.scrollHeight - el.clientHeight - 2) {
        stop();
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    const startTimer = window.setTimeout(() => {
      running = true;
      last = performance.now();
      raf = window.requestAnimationFrame(tick);
    }, 400);

    el.addEventListener("pointerdown", stop, { passive: true });
    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchstart", stop, { passive: true });
    el.addEventListener("keydown", stop);

    return () => {
      window.clearTimeout(startTimer);
      stop();
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("keydown", stop);
    };
  }, [introPhase]);

  return (
    <ThemeProvider theme={config.theme} className="cinelove-page">
      {(introPhase === "mist" || introPhase === "open") && (
        <OpeningOverlay parting={introPhase !== "mist"} />
      )}

      <div
        ref={scrollRef}
        className={`cinelove-scroll ${introPhase !== "done" ? "is-intro-locked" : ""}`}
      >
        {isSectionEnabled(pageSections, "hero") && (
          <HeroSection
            config={config}
            sections={sections}
            pageSections={pageSections}
            introPhase={introPhase}
          />
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
        {isSectionEnabled(pageSections, "rsvp_intro") && (
          <RsvpIntroSection pageSections={pageSections} />
        )}
        <RsvpSection side={data.side} />
        {showGift && <GiftSection gift={gift} onOpen={() => setGiftOpen(true)} />}
        {isSectionEnabled(pageSections, "gallery") && (
          <GallerySection sections={sections} pageSections={pageSections} />
        )}
        {isSectionEnabled(pageSections, "thankyou") && (
          <ThankYouSection pageSections={pageSections} />
        )}
        <div className="h-24" />
      </div>

      {introPhase === "done" && (
        <FloatingUI
          initialWishes={wishes}
          brideName={config.brideName}
          groomName={config.groomName}
          coverImage={coverImage}
          youtubeMusicUrl={config.youtubeMusicUrl}
          showGift={showGift}
          onGiftClick={() => setGiftOpen(true)}
        />
      )}

      <GiftModal
        gift={gift}
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        coupleName={`${config.brideName} & ${config.groomName}`}
      />
    </ThemeProvider>
  );
}
