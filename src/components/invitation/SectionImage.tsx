"use client";

import Image from "next/image";
import { ImageItem } from "@/types";
import { Flower2, ImageIcon } from "@/components/icons";

interface Props {
  images: ImageItem[];
  fallback?: React.ReactNode;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function SectionImage({
  images,
  fallback,
  className = "",
  imageClassName = "object-cover",
  priority = false,
}: Props) {
  const src = images[0]?.url;

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-[var(--background)] ${className}`}>
        {fallback || (
          <ImageIcon size={32} className="text-[var(--primary)]/25" strokeWidth={1.25} />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={images[0]?.alt || "Wedding photo"}
        fill
        className={imageClassName}
        priority={priority}
        unoptimized={src.startsWith("/api/")}
        sizes="(max-width: 768px) 100vw, 480px"
      />
    </div>
  );
}

export function PlaceholderImage({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-[var(--background)] to-white text-[var(--primary)]/30 ${className}`}
    >
      <Flower2 size={36} strokeWidth={1.25} />
      {label && (
        <span className="mt-2 font-label text-[10px] uppercase tracking-widest">{label}</span>
      )}
    </div>
  );
}
