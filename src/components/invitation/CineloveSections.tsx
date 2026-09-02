"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SiteConfig, ContentSection, PageSectionData } from "@/types";
import { getFieldValue } from "@/lib/sections";
import {
  getImageAt,
  getSectionImages,
  parseISODate,
  formatDateSlash,
  buildMonthGrid,
} from "@/lib/images";
import { ChevronLeft, ChevronRight, Heart, Maximize2 } from "lucide-react";
import { SectionImage, PlaceholderImage } from "./SectionImage";
import { DaisyBouquet, TulipBouquet, HeartBouquet, EnvelopeBody, EnvelopeFront, EnvelopeFlap, WaxSeal } from "./Decorations";
import type { InvitationSide } from "@/types";

export type IntroPhase = "mist" | "open" | "envelope" | "done";

interface Props {
  config: SiteConfig;
  sections: ContentSection[];
  pageSections: PageSectionData[];
  side?: InvitationSide;
  introPhase?: IntroPhase;
}

type TextProps = { pageSections: PageSectionData[] };

function ticketStub(groomName: string, brideName: string) {
  const last = (value: string) => value.trim().split(/\s+/).pop() || value;
  return `${last(groomName)} & ${last(brideName)}`.toUpperCase();
}

function useInView() {
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = el.closest(".cinelove-scroll");

    const visible = () => {
      const box = el.getBoundingClientRect();
      const frame =
        root instanceof Element
          ? root.getBoundingClientRect()
          : { top: 0, bottom: window.innerHeight };
      return box.bottom > frame.top + 24 && box.top < frame.bottom - 24;
    };

    if (visible()) {
      setOn(true);
      return;
    }

    const onScroll = () => {
      if (visible()) {
        setOn(true);
        cleanup();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          cleanup();
        }
      },
      { root: root instanceof Element ? root : null, threshold: 0.08 },
    );
    io.observe(el);
    root?.addEventListener("scroll", onScroll, { passive: true });

    function cleanup() {
      io.disconnect();
      root?.removeEventListener("scroll", onScroll);
    }

    return cleanup;
  }, []);

  return { ref, on };
}

/* ─────────────── HERO ─────────────── */
export function HeroSection({ config, sections, pageSections, introPhase = "done" }: Props) {
  const leftImg = getImageAt(sections, "hero", 0);
  const rightImg = getImageAt(sections, "hero", 1);
  const dateDots = formatDateSlash(config.weddingDate);

  const scriptTitle = getFieldValue(pageSections, "hero", "scriptTitle");
  const cardTitle = getFieldValue(pageSections, "hero", "cardTitle");
  const cardSubtitle = getFieldValue(pageSections, "hero", "cardSubtitle");

  const opened = introPhase === "envelope" || introPhase === "done";

  return (
    <section className={`hero-stage relative px-4 pb-6 pt-10 ${opened ? "is-open" : "is-closed"}`}>
      <p className="relative z-10 text-center font-script text-[21px] font-medium leading-none text-olive">
        {scriptTitle}
      </p>

      <div className="hero-3d relative mx-auto mt-1 h-[400px] w-full max-w-[360px]">
        <div className="hero-envelope">
          <DaisyBouquet className="anim-sway env-daisy" />

          <div className="env-body">
            <EnvelopeBody className="h-full w-full" uid="hero-body" />
          </div>

          <div className="env-contents">
            <div className="polaroid polaroid-in-left">
              {leftImg ? (
                <SectionImage images={[leftImg]} className="h-[168px] w-full" priority />
              ) : (
                <PlaceholderImage className="h-[168px] w-full" />
              )}
            </div>
            <div className="polaroid polaroid-in-right">
              {rightImg ? (
                <SectionImage images={[rightImg]} className="h-[186px] w-full" priority />
              ) : (
                <PlaceholderImage className="h-[186px] w-full" />
              )}
            </div>
            <div className="invitation-card">
              <div className="ticket-stub">
                <span>{ticketStub(config.groomName, config.brideName)}</span>
              </div>
              <div className="ticket-body">
                <p className="font-script text-[14px] leading-none text-olive">{cardTitle}</p>
                <p className="mt-1 font-serif text-[14px] font-semibold tracking-wide text-olive">
                  {dateDots.replaceAll("/", " . ")}
                </p>
                <p className="mt-0.5 font-script text-[12px] leading-none text-olive/80">
                  {cardSubtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="env-front">
            <EnvelopeFront className="h-full w-full" uid="hero-front" />
          </div>

          <div className="env-flap">
            <EnvelopeFlap className="h-full w-full" uid="hero-flap" />
          </div>

          <WaxSeal className="wax-on-flap" monogram={config.monogram || "TL"} />
          <TulipBouquet className="anim-sway env-tulip" />
        </div>
      </div>

      <div className="mt-8 text-center">
        <h1 className="font-name text-[38px] font-normal leading-none text-olive">
          {config.brideName}
          <span className="mx-1.5 font-name font-normal">&</span>
          {config.groomName}
        </h1>
        <p className="mt-3 font-serif text-sm tracking-[0.2em] text-gray-600">{dateDots}</p>
      </div>
    </section>
  );
}

/* ─────────────── CALENDAR ─────────────── */
export function CalendarSection({ config, sections, pageSections }: Props) {
  const sideImg = getImageAt(sections, "calendar", 0);
  const weddingDate = parseISODate(config.weddingDate);
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const weddingDay = weddingDate.getDate();
  const cells = buildMonthGrid(year, month);

  const monthPrefix = getFieldValue(pageSections, "calendar", "monthPrefix");
  const monthLabel = `${monthPrefix} ${String(month + 1).padStart(2, "0")}.${year}`;

  return (
    <section className="anim-fade-up px-3 pb-8">
      <div className="mx-auto grid max-w-[380px] grid-cols-2 gap-2">
        <div className="relative overflow-hidden rounded-sm">
          {sideImg ? (
            <SectionImage images={[sideImg]} className="aspect-[3/4] w-full" />
          ) : (
            <PlaceholderImage className="aspect-[3/4] w-full" label="Lịch" />
          )}
          <div className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1">
            <p className="font-serif text-xs font-semibold text-olive">
              {formatDateSlash(config.weddingDate)}
            </p>
          </div>
        </div>

        <div className="flex aspect-[3/4] flex-col rounded-sm bg-olive p-2.5 text-white">
          <p className="mb-2 text-center font-label text-[10px] font-medium uppercase tracking-widest">
            {monthLabel}
          </p>
          <div className="cal-grid mb-1">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <span key={d} className="text-center font-label text-[8px] opacity-70">
                {d}
              </span>
            ))}
          </div>
          <div className="cal-grid flex-1 content-start">
            {cells.map((d, i) => (
              <span
                key={i}
                className={`cal-day font-label ${d === weddingDay ? "is-wedding" : "text-[10px]"}`}
              >
                {d === weddingDay ? (
                  <span className="cal-heart-wrap">
                    <Heart
                      size={16}
                      strokeWidth={0}
                      className="cal-heart-icon"
                      aria-hidden
                    />
                    <span className="cal-heart-num">{d}</span>
                  </span>
                ) : (
                  (d ?? "")
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── INVITE ─────────────── */
export function InviteSection({ config, sections, pageSections, side = "bride" }: Props) {
  const brideImg = getImageAt(sections, "bride", 0);
  const groomImg = getImageAt(sections, "groom", 0);
  const { ref, on } = useInView();

  const greeting = getFieldValue(pageSections, "invite", "greeting");
  const guestTitle = getFieldValue(pageSections, "invite", "guestTitle");
  const eventLabel =
    side === "groom"
      ? getFieldValue(pageSections, "invite", "eventLabelGroom")
      : getFieldValue(pageSections, "invite", "eventLabel");
  const quoteOverride = getFieldValue(pageSections, "invite", "quote");
  const quoteText = quoteOverride.trim() || config.quote;
  const quoteLines = quoteText.split("\n").filter(Boolean);

  return (
    <section ref={ref} className={`invite-section ${on ? "is-in" : ""}`}>
      <p className="invite-greeting text-caps text-olive">{greeting}</p>
      <p className="invite-guest font-serif text-olive">{guestTitle}</p>
      <p className="invite-event text-caps text-gray-500">{eventLabel}</p>

      <div className="invite-names">
        <p className="invite-name invite-name-bride font-hand text-olive">{config.brideName}</p>
        <HeartBouquet className="invite-name-heart" />
        <p className="invite-name invite-name-groom font-hand text-olive">{config.groomName}</p>
      </div>

      <div className="invite-photos">
        <div className="invite-quote-bar">
          {quoteLines[0] ? (
            <p className="invite-quote-line font-serif">{quoteLines[0]}</p>
          ) : null}
          <div className="invite-quote-hearts" aria-hidden>
            <Heart size={12} className="fill-[#e8a0ae] text-[#e8a0ae]" strokeWidth={0} />
            <Heart size={11} className="fill-[#f0c4cc] text-[#f0c4cc]" strokeWidth={0} />
            <Heart size={12} className="fill-[#e8a0ae] text-[#e8a0ae]" strokeWidth={0} />
          </div>
          {quoteLines[1] ? (
            <p className="invite-quote-line font-serif">{quoteLines[1]}</p>
          ) : null}
        </div>

        <div className="invite-photo invite-photo-left">
          <SectionImage
            images={brideImg ? [brideImg] : []}
            className="h-full w-full"
            fallback={<PlaceholderImage className="h-full w-full" label="Cô dâu" />}
          />
        </div>
        <div className="invite-photo invite-photo-right">
          <SectionImage
            images={groomImg ? [groomImg] : []}
            className="h-full w-full"
            fallback={<PlaceholderImage className="h-full w-full" label="Chú rể" />}
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FAMILY ─────────────── */
export function FamilySection({
  config,
  pageSections,
}: {
  config: SiteConfig;
  pageSections: PageSectionData[];
}) {
  const groomLabel = getFieldValue(pageSections, "family", "groomLabel");
  const brideLabel = getFieldValue(pageSections, "family", "brideLabel");

  return (
    <section className="px-6 py-8">
      <div className="mx-auto grid max-w-[340px] grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-caps mb-3 text-olive">{groomLabel}</p>
          <p className="font-serif text-[13px] leading-relaxed">{config.groomFamily.father}</p>
          <p className="font-serif text-[13px] leading-relaxed">{config.groomFamily.mother}</p>
        </div>
        <div>
          <p className="text-caps mb-3 text-olive">{brideLabel}</p>
          <p className="font-serif text-[13px] leading-relaxed">{config.brideFamily.father}</p>
          <p className="font-serif text-[13px] leading-relaxed">{config.brideFamily.mother}</p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── EVENTS ─────────────── */
export function EventSection({
  config,
  pageSections,
}: {
  config: SiteConfig;
  pageSections: PageSectionData[];
}) {
  const timeLabel = getFieldValue(pageSections, "events", "timeLabel");
  const mapLabel = getFieldValue(pageSections, "events", "mapLabel");

  return (
    <section>
      {config.events.map((event, i) => (
        <div key={i} className="event-block">
          <p className="text-caps text-white/90">{event.title}</p>
          <p className="mt-5 font-serif text-sm text-white/80">{timeLabel}</p>
          <p className="mt-1 font-serif text-lg tracking-wide">{event.time}</p>
          <p className="mt-3 font-serif text-2xl font-semibold tracking-wider">{event.date}</p>
          {(event.lunarDate || config.lunarDate) && (
            <p className="mt-2 font-serif text-xs text-white/70">
              {event.lunarDate || config.lunarDate}
            </p>
          )}
          <p className="mt-8 font-script text-[42px] leading-none text-white">{event.location}</p>

          {event.address.includes("\n") ? (
            event.address.split("\n").map((line, j) => (
              <p key={j} className="mt-1 font-serif text-[13px] text-white/85">
                {line}
              </p>
            ))
          ) : (
            <p className="mt-3 font-serif text-[13px] text-white/85">{event.address}</p>
          )}

          {event.mapUrl && (
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full border border-white/70 px-8 py-2.5 font-label text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
            >
              {mapLabel}
            </a>
          )}

          {i < config.events.length - 1 && (
            <div className="mx-auto mt-10 h-px w-16 bg-white/30" />
          )}
        </div>
      ))}
    </section>
  );
}

/* ─────────────── RSVP INTRO ─────────────── */
export function RsvpIntroSection({ pageSections }: TextProps) {
  return (
    <section className="bg-olive px-6 py-10 text-center text-white">
      <p className="font-serif text-[15px] leading-relaxed">
        {getFieldValue(pageSections, "rsvp_intro", "line1")}
      </p>
      <p className="font-serif text-[15px] leading-relaxed">
        {getFieldValue(pageSections, "rsvp_intro", "line2")}
      </p>
      <p className="mt-6 font-serif text-[13px] leading-relaxed text-white/85">
        {getFieldValue(pageSections, "rsvp_intro", "line3")}
      </p>
      <p className="mt-4 font-serif text-[13px] italic text-white/85">
        {getFieldValue(pageSections, "rsvp_intro", "signature")}
      </p>
      <p className="mt-6 font-label text-[9px] uppercase tracking-widest text-white/50">
        {getFieldValue(pageSections, "rsvp_intro", "footer")}
      </p>
    </section>
  );
}

/* ─────────────── GALLERY ─────────────── */
export function GallerySection({
  sections,
  pageSections,
}: {
  sections: ContentSection[];
  pageSections: PageSectionData[];
}) {
  const images = getSectionImages(sections, "gallery");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const startX = useRef<number | null>(null);

  if (images.length === 0) return null;

  const current = images[Math.min(index, images.length - 1)];
  const linkText = getFieldValue(pageSections, "gallery", "linkText");

  function go(dir: number) {
    setIndex((i) => (i + dir + images.length) % images.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (dx > 40) go(-1);
    if (dx < -40) go(1);
  }

  return (
    <section className="album-slider">
      {linkText ? (
        <p className="mb-3 text-center font-script text-[22px] text-olive">{linkText}</p>
      ) : null}

      <div
        className="album-stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={current.url}
          alt={current.alt || `Photo ${index + 1}`}
          fill
          className="object-contain"
          sizes="430px"
          unoptimized={current.url.startsWith("/api/")}
          priority={index === 0}
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              className="album-nav album-nav-prev"
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="album-nav album-nav-next"
              onClick={() => go(1)}
              aria-label="Ảnh sau"
            >
              <ChevronRight size={18} />
            </button>
          </>
        ) : null}

        <button
          type="button"
          className="album-expand"
          onClick={() => setOpen(true)}
          aria-label="Xem lớn"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {images.length > 1 ? (
        <div className="album-thumbs">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              className={`album-thumb ${i === index ? "is-on" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Ảnh ${i + 1}`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                sizes="62px"
                unoptimized={img.url.startsWith("/api/")}
              />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt || "Album"}
            className="max-h-[88dvh] max-w-full object-contain"
          />
        </div>
      ) : null}
    </section>
  );
}

/* ─────────────── THANK YOU ─────────────── */
export function ThankYouSection({ pageSections }: TextProps) {
  return (
    <section className="bg-cream px-6 py-10 text-center">
      <p className="font-serif text-lg font-semibold text-olive">
        {getFieldValue(pageSections, "thankyou", "title")}
      </p>
      <p className="mt-4 font-serif text-[14px] leading-relaxed text-gray-600">
        {getFieldValue(pageSections, "thankyou", "body")}
      </p>
    </section>
  );
}
