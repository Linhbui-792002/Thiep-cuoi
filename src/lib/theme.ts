export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
}

export const DEFAULT_THEME: ThemeConfig = {
  primary: "#465c3d",
  background: "#f1f0ef",
  accent: "#c4a962",
};

export const THEME_PRESETS: (ThemeConfig & { name: string })[] = [
  { name: "Olive Classic", primary: "#465c3d", background: "#f1f0ef", accent: "#c4a962" },
  { name: "Rose Blush", primary: "#8b5a6b", background: "#faf5f2", accent: "#c9a87c" },
  { name: "Navy Elegance", primary: "#2c3e50", background: "#f4f6f8", accent: "#b8976a" },
  { name: "Burgundy Wine", primary: "#6b2737", background: "#faf7f5", accent: "#d4af37" },
  { name: "Sage Garden", primary: "#5a7247", background: "#f2f4f0", accent: "#c8b896" },
  { name: "Dusty Blue", primary: "#4a6670", background: "#f3f6f7", accent: "#b8a99a" },
  { name: "Gold Luxe", primary: "#8a6d3b", background: "#faf8f3", accent: "#d4af37" },
  { name: "Pastel Pink", primary: "#b8838b", background: "#fff5f7", accent: "#e8b4bc" },
  { name: "Emerald", primary: "#2d6a4f", background: "#f0f7f4", accent: "#95d5b2" },
  { name: "Lavender", primary: "#6b5b95", background: "#f8f6fc", accent: "#c4b5fd" },
  { name: "Terracotta", primary: "#b85c38", background: "#faf6f0", accent: "#e8a87c" },
  { name: "Classic Noir", primary: "#2a2a2a", background: "#f5f5f5", accent: "#c9a962" },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function darkenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - amount / 100;
  return rgbToHex(r * factor, g * factor, b * factor);
}

export function lightenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const factor = amount / 100;
  return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor);
}

export function themeToCssVars(theme: ThemeConfig): Record<string, string> {
  const primaryDark = darkenHex(theme.primary, 18);
  const primaryLight = lightenHex(theme.primary, 22);

  return {
    "--primary": theme.primary,
    "--primary-dark": primaryDark,
    "--primary-light": primaryLight,
    "--primary-rgb": (() => {
      const { r, g, b } = hexToRgb(theme.primary);
      return `${r} ${g} ${b}`;
    })(),
    "--background": theme.background,
    "--accent": theme.accent,
    "--cream": theme.background,
    "--olive": theme.primary,
    "--olive-dark": primaryDark,
  };
}

export function normalizeTheme(theme?: Partial<ThemeConfig> | null): ThemeConfig {
  return {
    primary: theme?.primary || DEFAULT_THEME.primary,
    background: theme?.background || DEFAULT_THEME.background,
    accent: theme?.accent || DEFAULT_THEME.accent,
  };
}
