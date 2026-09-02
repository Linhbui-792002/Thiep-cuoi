import {
  MessageCircle,
  Heart,
  Gift,
  ThumbsUp,
  Music,
  X,
  Sparkles,
  Gem,
  Flower2,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";

export { MessageCircle, Heart, Gift, ThumbsUp, Music, X, Sparkles, Gem, Flower2, ImageIcon };
export type { LucideIcon };

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ icon: IconComponent, size = 18, className = "", strokeWidth = 1.75 }: IconProps) {
  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
}

export function FloatingHeart({
  className = "",
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-1.2 -1.2 26.4 26.4"
      className={className}
      aria-hidden
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="currentColor"
        stroke="#fff"
        strokeWidth="2.05"
        strokeLinejoin="round"
      />
      <path
        d="M8.05 6.35c-1.45.18-2.55 1.2-2.85 2.45"
        fill="none"
        stroke="#fff"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.72"
      />
    </svg>
  );
}
