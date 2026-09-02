"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Wish } from "@/types";
import {
  MessageCircle,
  Sparkles,
  Gift,
  ThumbsUp,
  Music,
  X,
  Gem,
  FloatingHeart,
} from "@/components/icons";
import { extractYoutubeId, youtubeEmbedUrl } from "@/lib/youtube";

interface Props {
  initialWishes: Wish[];
  brideName: string;
  groomName: string;
  coverImage?: string;
  youtubeMusicUrl?: string;
  showGift?: boolean;
  onGiftClick?: () => void;
}

type FlyingWish = {
  id: string;
  name: string;
  message: string;
  side: "left" | "right";
};

type FlyingHeart = {
  id: number;
  x: number;
  drift: string;
  size: number;
  duration: string;
  color: string;
  spin: string;
};

const HEART_COLORS = ["#ff1a4a", "#ff2d55", "#ff3d6e", "#e01248"];

function clip(text: string, max: number) {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

export function FloatingUI({
  initialWishes,
  brideName,
  groomName,
  coverImage,
  youtubeMusicUrl,
  showGift = false,
  onGiftClick,
}: Props) {
  const videoId = extractYoutubeId(youtubeMusicUrl || "");
  const [hearts, setHearts] = useState<FlyingHeart[]>([]);
  const [flyingWishes, setFlyingWishes] = useState<FlyingWish[]>([]);
  const [wishOpen, setWishOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(Boolean(videoId));
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [wishError, setWishError] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const wishesRef = useRef(wishes);
  const laneRef = useRef(0);
  const wishIndexRef = useRef(0);
  wishesRef.current = wishes;

  const spawnWish = useCallback((wish: { name: string; message: string }, force = false) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const side: "left" | "right" = laneRef.current++ % 2 === 0 ? "left" : "right";
    setFlyingWishes((prev) => {
      if (
        !force &&
        prev.some((item) => item.name === wish.name && item.message === wish.message)
      ) {
        return prev;
      }
      return [...prev, { id, name: wish.name, message: wish.message, side }].slice(-2);
    });
    window.setTimeout(() => {
      setFlyingWishes((prev) => prev.filter((item) => item.id !== id));
    }, 5200);
  }, []);

  const spawnHearts = useCallback((count = 7) => {
    const burst: FlyingHeart[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + Math.random() + i,
      x: 16 + Math.random() * 68,
      drift: `${Math.round((Math.random() - 0.5) * 72)}px`,
      size: 18 + Math.round(Math.random() * 14),
      duration: `${(1.85 + Math.random() * 0.85).toFixed(2)}s`,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      spin: `${Math.round((Math.random() - 0.5) * 42)}deg`,
    }));
    setHearts((prev) => [...prev, ...burst].slice(-16));
    burst.forEach((h) => {
      window.setTimeout(() => {
        setHearts((prev) => prev.filter((item) => item.id !== h.id));
      }, 2900);
    });
  }, []);

  const shootHeart = useCallback(() => {
    spawnHearts(8);
    setLikeCount((n) => (n ?? 0) + 1);
    void fetch("/api/hearts", { method: "POST" })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as { count?: number } | null;
        if (res.ok && typeof data?.count === "number") {
          const saved = data.count;
          setLikeCount((n) => Math.max(n ?? 0, saved));
          return;
        }
        setLikeCount((n) => Math.max(0, (n ?? 0) - 1));
      })
      .catch(() => {
        setLikeCount((n) => Math.max(0, (n ?? 0) - 1));
      });
  }, [spawnHearts]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/hearts")
      .then((res) => res.json())
      .then((data: { count?: number }) => {
        if (cancelled || typeof data.count !== "number") return;
        const saved = data.count;
        setLikeCount((n) => Math.max(n ?? 0, saved));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!videoId || !musicPlaying) return;
    const play = () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*",
      );
    };
    document.addEventListener("pointerdown", play, { once: true });
    return () => document.removeEventListener("pointerdown", play);
  }, [videoId, musicPlaying]);

  useEffect(() => {
    if (wishOpen) return;
    const list = wishesRef.current;
    if (list.length === 0) return;

    const tick = () => {
      const current = wishesRef.current;
      if (current.length === 0) return;
      const wish = current[wishIndexRef.current % current.length];
      wishIndexRef.current += 1;
      spawnWish(wish);
    };

    const start = window.setTimeout(tick, 2000);
    const interval = window.setInterval(tick, 5600);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [wishOpen, spawnWish]);

  const autoHearts = (likeCount ?? 0) > 0;
  useEffect(() => {
    if (!autoHearts) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tick = () => spawnHearts(7);
    const start = window.setTimeout(tick, 2400);
    const interval = window.setInterval(tick, 5200);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [autoHearts, spawnHearts]);

  function toggleMusic() {
    if (!videoId) return;
    setMusicPlaying((playing) => !playing);
  }

  async function submitWish(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setWishError("Vui lòng nhập họ tên và lời chúc");
      return;
    }

    setLoading(true);
    setWishError("");

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");

      setWishes((prev) => [data, ...prev]);
      spawnWish(data, true);
      spawnHearts(6);
      setName("");
      setMessage("");
      setWishOpen(false);
    } catch (err) {
      setWishError(err instanceof Error ? err.message : "Gửi thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {videoId && musicPlaying && (
        <iframe
          ref={iframeRef}
          className="yt-bg-player"
          src={youtubeEmbedUrl(videoId, true)}
          allow="autoplay; encrypted-media"
          title="Nhạc nền thiệp cưới"
        />
      )}

      {videoId && (
        <button
          className="music-btn"
          onClick={toggleMusic}
          aria-label={musicPlaying ? "Tắt nhạc" : "Bật nhạc"}
        >
          <Music size={17} className={musicPlaying ? "music-playing" : ""} strokeWidth={1.75} />
        </button>
      )}

      <p className="side-watermark text-vertical font-label">Gift by Linh Bún</p>

      <div className="fx-layer" aria-hidden>
        {flyingWishes.map((w) => (
          <div key={w.id} className={`wish-float ${w.side}`}>
            <p className="font-label text-[10px] font-medium leading-tight text-[var(--primary)]">
              {clip(w.name, 14)}
            </p>
            <p className="mt-0.5 font-label text-[10px] leading-snug text-gray-600">
              {clip(w.message, 36)}
            </p>
          </div>
        ))}
        {hearts.map((h) => (
          <div
            key={h.id}
            className="heart-float"
            style={{
              left: `${h.x}%`,
              color: h.color,
              ["--drift" as string]: h.drift,
              ["--dur" as string]: h.duration,
              ["--spin" as string]: h.spin,
            }}
          >
            <FloatingHeart size={h.size} />
          </div>
        ))}
      </div>

      <div className="float-bar">
        <button className="float-wish-btn" onClick={() => setWishOpen(true)}>
          <MessageCircle size={17} strokeWidth={1.75} />
          <span>Gửi lời chúc...</span>
        </button>

        <button className="float-action-btn" onClick={shootHeart} type="button">
          <Sparkles size={15} strokeWidth={1.75} />
          <span>Bắn tim</span>
        </button>

        {showGift ? (
          <button className="float-action-btn icon-only" onClick={onGiftClick} aria-label="Gửi quà mừng">
            <Gift size={17} strokeWidth={1.75} />
          </button>
        ) : null}

        <button
          className="float-action-btn icon-only relative"
          type="button"
          onClick={shootHeart}
          aria-label={`Bắn tim, ${likeCount ?? 0} lượt`}
        >
          <ThumbsUp size={17} strokeWidth={1.75} />
          {likeCount !== null ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-medium text-white">
              {likeCount}
            </span>
          ) : null}
        </button>
      </div>

      {wishOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setWishOpen(false)}
        >
          <div
            className="wish-modal w-full max-w-[430px] rounded-t-2xl bg-white p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center gap-3">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-[var(--primary)]/20"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  <Gem size={18} strokeWidth={1.75} />
                </div>
              )}
              <div className="flex-1">
                <p className="font-name text-base font-medium text-[var(--primary)]">
                  {brideName} & {groomName}
                </p>
                <p className="font-label text-xs text-gray-400">Gửi lời chúc</p>
              </div>
              <button
                onClick={() => setWishOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                aria-label="Đóng"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={submitWish} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Họ và tên"
                className="input-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 font-label text-sm"
                maxLength={100}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi lời chúc..."
                rows={3}
                className="input-primary w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 font-label text-sm"
                maxLength={500}
              />

              {wishError && <p className="font-label text-sm text-red-500">{wishError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full rounded-lg py-3 font-label text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Đang gửi..." : "Gửi lời chúc"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
