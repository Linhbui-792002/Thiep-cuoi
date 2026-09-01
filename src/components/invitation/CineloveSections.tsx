"use client";

import Image from "next/image";
import { SiteConfig, ContentSection, ImageItem, PageSectionData } from "@/types";
import { getFieldValue } from "@/lib/sections";
import {
  getImageAt,
  getSectionImages,
  parseISODate,
  formatDateSlash,
  buildMonthGrid,
} from "@/lib/images";
import { Heart } from "lucide-react";
import { SectionImage, PlaceholderImage } from "./SectionImage";
import { DaisyBouquet, TulipBouquet, HeartBouquet, EnvelopeBack, EnvelopeFront, SealBadge } from "./Decorations";
import type { InvitationSide } from "@/types";

interface Props {
  config: SiteConfig;
  sections: ContentSection[];
  pageSections: PageSectionData[];
  side?: InvitationSide;
}

type TextProps = { pageSections: PageSectionData[] };

function ticketStub(groomName: string, brideName: string) {
  const last = (value: string) => value.trim().split(/\s+/).pop() || value;
  return `${last(groomName)} & ${last(brideName)}`.toUpperCase();
}

/* ─────────────── HERO ─────────────── */
export function HeroSection({ config, sections, pageSections }: Props) {
  const leftImg = getImageAt(sections, "hero", 0);
  const rightImg = getImageAt(sections, "hero", 1);
  const dateDots = formatDateSlash(config.weddingDate);

  const scriptTitle = getFieldValue(pageSections, "hero", "scriptTitle");
  const cardTitle = getFieldValue(pageSections, "hero", "cardTitle");
  const cardSubtitle = getFieldValue(pageSections, "hero", "cardSubtitle");

  const ringText = `${scriptTitle}  •  ${config.brideName} & ${config.groomName}`;

  return (
    <section className="relative px-4 pb-6 pt-10">
      <p className="anim-fade-up relative z-10 text-center font-script text-[21px] font-medium leading-none text-olive">
        {scriptTitle}
      </p>

      <div className="relative mx-auto mt-1 h-[400px] w-full max-w-[360px]">
        <DaisyBouquet className="anim-sway absolute left-1 top-[68px] z-[8] h-[170px] w-[110px] opacity-95" />

        <div className="absolute left-1/2 top-[62px] z-0 h-[250px] w-[270px] -translate-x-1/2">
          <EnvelopeBack className="envelope-svg envelope-back-svg h-full w-full" uid="hero-back" />
        </div>

        <div className="absolute bottom-[36px] left-1/2 z-[1] h-[188px] w-[300px] -translate-x-1/2">
          <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
            <polygon points="4,14 160,128 316,14" fill="var(--background)" />
          </svg>
        </div>

        <div className="polaroid polaroid-in-left absolute left-[22px] top-[70px] z-10 w-[118px]">
          {leftImg ? (
            <SectionImage images={[leftImg]} className="h-[168px] w-full" priority />
          ) : (
            <PlaceholderImage className="h-[168px] w-full" />
          )}
        </div>

        <div className="polaroid polaroid-in-right absolute right-[12px] top-[58px] z-[3] w-[132px]">
          {rightImg ? (
            <SectionImage images={[rightImg]} className="h-[186px] w-full" priority />
          ) : (
            <PlaceholderImage className="h-[186px] w-full" />
          )}
        </div>

        <div className="invitation-card absolute left-1/2 top-[188px] z-[11] w-[168px] -translate-x-1/2">
          <div className="ticket-stub">
            <span>{ticketStub(config.groomName, config.brideName)}</span>
          </div>
          <div className="ticket-body">
            <p className="font-script text-[15px] leading-none text-olive">{cardTitle}</p>
            <p className="mt-1.5 font-serif text-[15px] font-semibold tracking-wide text-olive">
              {dateDots.replaceAll("/", " . ")}
            </p>
            <p className="mt-1 font-script text-[13px] leading-none text-olive/80">
              {cardSubtitle}
            </p>
          </div>
        </div>

        <div className="absolute bottom-[36px] left-1/2 z-[12] h-[188px] w-[300px] -translate-x-1/2">
          <EnvelopeFront className="envelope-svg h-full w-full" uid="hero-front" />
          <SealBadge
            className="seal-on-envelope"
            monogram={config.monogram}
            ringText={ringText}
            uid="hero"
          />
        </div>

        <TulipBouquet className="anim-sway absolute bottom-2 right-[-2px] z-[20] h-16 w-14" />
      </div>

      <div className="anim-fade-up anim-delay-4 mt-8 text-center">
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
  const coupleImages = getSectionImages(sections, "couple");

  const greeting = getFieldValue(pageSections, "invite", "greeting");
  const guestTitle = getFieldValue(pageSections, "invite", "guestTitle");
  const eventLabel =
    side === "groom"
      ? getFieldValue(pageSections, "invite", "eventLabelGroom")
      : getFieldValue(pageSections, "invite", "eventLabel");
  const quoteOverride = getFieldValue(pageSections, "invite", "quote");
  const quoteText = quoteOverride.trim() || config.quote;
  const quoteLines = quoteText.split("\n");
  const monoLeft = getFieldValue(pageSections, "invite", "monogramLeft");
  const monoRight = getFieldValue(pageSections, "invite", "monogramRight");

  return (
    <section className="anim-fade-up relative px-4 py-10">
      <div className="text-center">
        <p className="text-caps text-olive">{greeting}</p>
        <p className="mt-3 font-serif text-[33px] font-medium leading-none text-olive">
          {guestTitle}
        </p>
        <p className="mt-4 text-caps text-gray-500">{eventLabel}</p>
      </div>

      <div className="relative mx-auto mt-8 max-w-[340px]">
        <div className="text-center">
          <p className="font-name text-[30px] font-medium leading-[40px] text-olive">
            {config.brideName}
          </p>
          <div className="my-1 flex items-center justify-center gap-2">
            <HeartBouquet className="h-10 w-8" />
            <span className="font-name text-[28px] font-medium text-olive">&</span>
            <HeartBouquet className="h-10 w-8 scale-x-[-1]" />
          </div>
          <p className="font-name text-[30px] font-medium leading-[40px] text-olive">
            {config.groomName}
          </p>
        </div>

        <div className="relative mt-8 flex items-center justify-center gap-0">
          <div className="relative z-10 -mr-4 mt-8 w-[110px] shrink-0">
            <SectionImage
              images={brideImg ? [brideImg] : []}
              className="aspect-[3/4] w-full shadow-lg"
              fallback={<PlaceholderImage className="aspect-[3/4] w-full" label="Cô dâu" />}
            />
          </div>

          <div className="relative z-20 flex w-[80px] shrink-0 flex-col items-center bg-olive py-6 text-white">
            <span className="font-script text-4xl opacity-80">{monoLeft}</span>
            <div className="my-3 space-y-1 text-center">
              {quoteLines.map((line, i) => (
                <p
                  key={i}
                  className="text-vertical font-serif text-[11px] leading-relaxed opacity-90"
                  style={{ maxHeight: "120px" }}
                >
                  {line}
                </p>
              ))}
            </div>
            <span className="font-script text-4xl opacity-80">{monoRight}</span>
          </div>

          <div className="relative z-10 -ml-4 -mt-6 w-[110px] shrink-0">
            <SectionImage
              images={groomImg ? [groomImg] : []}
              className="aspect-[3/4] w-full shadow-lg"
              fallback={<PlaceholderImage className="aspect-[3/4] w-full" label="Chú rể" />}
            />
          </div>
        </div>

        {coupleImages.length > 0 && (
          <div className="mt-6 flex justify-center gap-2 overflow-x-auto">
            {coupleImages.map((img, i) => (
              <div key={img.url} className="relative h-28 w-20 shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={img.url}
                  alt={img.alt || `Couple ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={img.url.startsWith("/api/")}
                />
              </div>
            ))}
          </div>
        )}
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
          <p className="mt-2 font-serif text-xs text-white/70">{config.lunarDate}</p>
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
  if (images.length === 0) return null;

  const linkText = getFieldValue(pageSections, "gallery", "linkText");
  const rows: ImageItem[][] = [];
  for (let i = 0; i < images.length; i += 3) {
    rows.push(images.slice(i, i + 3));
  }

  return (
    <section className="pb-4 pt-6">
      {rows.map((row, ri) => (
        <div key={ri} className={row.length === 1 ? "px-0" : "gallery-grid-3 px-0"}>
          {row.map((img) => (
            <div
              key={img.url}
              className={`relative overflow-hidden ${row.length === 1 ? "aspect-[4/3] w-full" : "aspect-[3/4]"}`}
            >
              <Image
                src={img.url}
                alt={img.alt || "Gallery"}
                fill
                className="object-cover"
                sizes="(max-width: 430px) 33vw"
                unoptimized={img.url.startsWith("/api/")}
              />
            </div>
          ))}
        </div>
      ))}

      {linkText && (
        <div className="mt-4 text-center">
          <span className="font-serif text-sm italic text-olive/70">{linkText}</span>
        </div>
      )}
    </section>
  );
}

/* ─────────────── BOTTOM ENVELOPE ─────────────── */
export function BottomSection({ config, sections, pageSections }: Props) {
  const img1 = getImageAt(sections, "envelope", 0);
  const img2 = getImageAt(sections, "envelope", 1);
  const venue = config.events[config.events.length - 1];

  const scriptTitle = getFieldValue(pageSections, "bottom", "scriptTitle");
  const venueLabelOverride = getFieldValue(pageSections, "bottom", "venueLabel");
  const venueLabel = venueLabelOverride.trim() || venue?.location || "Trung tâm hội nghị tiệc cưới";
  const floorLabel = getFieldValue(pageSections, "bottom", "floorLabel");

  return (
    <section className="relative overflow-hidden px-4 pb-32 pt-10">
      <p className="text-center font-script text-[21px] font-medium text-olive">{scriptTitle}</p>

      <div className="relative mx-auto mt-6 h-[300px] w-full max-w-[320px]">
        {img1 && (
          <div
            className="polaroid absolute left-0 top-4 z-10 w-[118px]"
            style={{ transform: "rotate(-8deg)" }}
          >
            <SectionImage images={[img1]} className="h-[140px] w-full" />
          </div>
        )}
        {img2 && (
          <div
            className="polaroid absolute right-0 top-0 z-[3] w-[122px]"
            style={{ transform: "rotate(7deg)" }}
          >
            <SectionImage images={[img2]} className="h-[148px] w-full" />
          </div>
        )}

        <div className="absolute bottom-0 left-1/2 z-[12] h-[158px] w-[250px] -translate-x-1/2">
          <EnvelopeFront className="envelope-svg h-full w-full" uid="bottom-front" />
          <div className="pointer-events-none absolute bottom-7 left-1/2 z-10 w-[70%] -translate-x-1/2 text-center text-white">
            <p className="font-label text-[8px] uppercase tracking-widest opacity-80">
              {venueLabel}
            </p>
            <p className="font-label text-[8px] uppercase tracking-widest opacity-60">
              {floorLabel}
            </p>
            <p className="mt-1 font-serif text-sm">{formatDateSlash(config.weddingDate)}</p>
          </div>
          <SealBadge
            className="seal-on-envelope seal-on-envelope-sm"
            monogram={config.monogram}
            ringText={`${scriptTitle}  •  ${config.brideName} & ${config.groomName}`}
            uid="bottom"
          />
        </div>
      </div>
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
