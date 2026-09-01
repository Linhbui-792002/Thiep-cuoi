"use client";

import { ThemeConfig } from "@/types";
import { THEME_PRESETS } from "@/lib/theme";

interface Props {
  theme: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
}

export function ThemeEditor({ theme, onChange }: Props) {
  function update(field: keyof ThemeConfig, value: string) {
    onChange({ ...theme, [field]: value });
  }

  function applyPreset(preset: ThemeConfig) {
    onChange({ ...preset });
  }

  const isPresetActive = (preset: ThemeConfig) =>
    preset.primary === theme.primary && preset.background === theme.background;

  return (
    <div className="admin-card space-y-5">
      <div>
        <h2 className="font-serif text-lg text-primary">Giao diện & Theme</h2>
        <p className="mt-1 text-sm text-gray-500">
          Đổi màu primary, nền và accent — áp dụng ngay trên thiệp
        </p>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Preset nhanh
        </p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-6">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              title={preset.name}
              className={`theme-swatch ${isPresetActive(preset) ? "active" : ""}`}
              style={{
                background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.background} 50%)`,
              }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          {THEME_PRESETS.find(isPresetActive)?.name || "Tùy chỉnh"}
        </p>
      </div>

      <div
        className="overflow-hidden rounded-xl border border-gray-200"
        style={{ background: theme.background }}
      >
        <div className="px-4 py-3" style={{ background: theme.primary, color: "white" }}>
          <p className="font-serif text-lg">Preview Theme</p>
        </div>
        <div className="px-4 py-4">
          <p className="font-script text-2xl" style={{ color: theme.primary }}>
            We got married
          </p>
          <p className="mt-2 font-serif text-sm text-gray-600">Hương Ly & Mạnh Thắng</p>
          <span
            className="mt-3 inline-block rounded-full px-4 py-1 text-xs text-white"
            style={{ background: theme.accent }}
          >
            Accent
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs text-gray-500">Màu primary</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.primary}
              onChange={(e) => update("primary", e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-gray-200"
            />
            <input
              className="admin-input font-mono text-xs"
              value={theme.primary}
              onChange={(e) => update("primary", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-gray-500">Màu nền</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.background}
              onChange={(e) => update("background", e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-gray-200"
            />
            <input
              className="admin-input font-mono text-xs"
              value={theme.background}
              onChange={(e) => update("background", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-gray-500">Màu accent</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={theme.accent}
              onChange={(e) => update("accent", e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-gray-200"
            />
            <input
              className="admin-input font-mono text-xs"
              value={theme.accent}
              onChange={(e) => update("accent", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
