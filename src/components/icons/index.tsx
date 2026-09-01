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
    <Heart
      size={size}
      className={`fill-[var(--primary)] text-[var(--primary)] ${className}`}
      strokeWidth={0}
    />
  );
}
