"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { SiteConfig, ThemeConfig } from "@/types";
import { DEFAULT_THEME } from "@/lib/theme";
import { extractYoutubeId } from "@/lib/youtube";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/site-config")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Không thể tải cấu hình");
        setConfig({
          ...data,
          theme: data.theme || DEFAULT_THEME,
          youtubeMusicUrl: data.youtubeMusicUrl ?? "",
        });
      })
      .catch((err) => {
        setMessage(err instanceof Error ? err.message : "Không thể tải cấu hình");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu thất bại");

      setConfig(data);
      setMessage("Đã lưu thành công!");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }

  function updateTheme(theme: ThemeConfig) {
    if (!config) return;
    setConfig({ ...config, theme });
  }

  function updateField(field: keyof SiteConfig, value: string) {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  }

  function updateFamily(
    side: "groomFamily" | "brideFamily",
    field: "father" | "mother",
    value: string,
  ) {
    if (!config) return;
    setConfig({
      ...config,
      [side]: { ...config[side], [field]: value },
    });
  }

  function updateEvent(index: number, field: string, value: string) {
    if (!config) return;
    const events = [...config.events];
    events[index] = { ...events[index], [field]: value };
    setConfig({ ...config, events });
  }

  function addEvent(side: "bride" | "groom") {
    if (!config) return;
    setConfig({
      ...config,
      events: [
        ...config.events,
        {
          side,
          title: side === "bride" ? "Tham dự lễ vu quy" : "Tham dự lễ thành hôn",
          time: "",
          date: "",
          location: "",
          address: "",
          mapUrl: "",
        },
      ],
    });
  }

  function removeEvent(index: number) {
    if (!config || config.events.length <= 1) return;
    setConfig({ ...config, events: config.events.filter((_, i) => i !== index) });
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-gray-500">Đang tải...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 font-display text-3xl text-olive">Thông tin thiệp</h1>
        <p className="mb-6 text-gray-500">Chỉnh sửa nội dung hiển thị trên thiệp cưới</p>

        {message && (
          <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <ThemeEditor theme={config.theme} onChange={updateTheme} />

          <div className="admin-card space-y-4">
            <h2 className="font-display text-lg text-olive">Cặp đôi</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Tên cô dâu</label>
                <input
                  className="admin-input"
                  value={config.brideName}
                  onChange={(e) => updateField("brideName", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Tên chú rể</label>
                <input
                  className="admin-input"
                  value={config.groomName}
                  onChange={(e) => updateField("groomName", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Ngày cưới</label>
                <input
                  type="date"
                  className="admin-input"
                  value={config.weddingDate}
                  onChange={(e) => updateField("weddingDate", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Monogram</label>
                <input
                  className="admin-input"
                  value={config.monogram}
                  onChange={(e) => updateField("monogram", e.target.value)}
                  maxLength={3}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Ngày âm lịch</label>
              <input
                className="admin-input"
                value={config.lunarDate}
                onChange={(e) => updateField("lunarDate", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Lời quote</label>
              <textarea
                className="admin-input"
                rows={3}
                value={config.quote}
                onChange={(e) => updateField("quote", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card space-y-4">
            <h2 className="font-display text-lg text-olive">Nhạc nền YouTube</h2>
            <p className="text-sm text-gray-500">
              Dán link YouTube. Giá trị được lưu trên MongoDB và phát khi khách bấm nút nhạc trên
              thiệp.
            </p>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Link YouTube</label>
              <input
                className="admin-input"
                placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                value={config.youtubeMusicUrl}
                onChange={(e) => updateField("youtubeMusicUrl", e.target.value)}
              />
              {config.youtubeMusicUrl.trim() ? (
                extractYoutubeId(config.youtubeMusicUrl) ? (
                  <p className="mt-1.5 text-xs text-green-600">Đã nhận diện video, sẵn sàng phát.</p>
                ) : (
                  <p className="mt-1.5 text-xs text-red-500">
                    Link chưa hợp lệ. Dùng watch, youtu.be, shorts hoặc embed.
                  </p>
                )
              ) : (
                <p className="mt-1.5 text-xs text-gray-400">Để trống nếu không phát nhạc.</p>
              )}
            </div>
          </div>

          <div className="admin-card space-y-4">
            <h2 className="font-display text-lg text-olive">Gia đình</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Nhà trai</p>
                <input
                  className="admin-input"
                  placeholder="Ông..."
                  value={config.groomFamily.father}
                  onChange={(e) => updateFamily("groomFamily", "father", e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Bà..."
                  value={config.groomFamily.mother}
                  onChange={(e) => updateFamily("groomFamily", "mother", e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Nhà gái</p>
                <input
                  className="admin-input"
                  placeholder="Ông..."
                  value={config.brideFamily.father}
                  onChange={(e) => updateFamily("brideFamily", "father", e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Bà..."
                  value={config.brideFamily.mother}
                  onChange={(e) => updateFamily("brideFamily", "mother", e.target.value)}
                />
              </div>
            </div>
          </div>

          {config.events.map((event, i) => (
            <div key={i} className="admin-card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg text-olive">
                  {event.side === "groom" ? "Nhà trai" : "Nhà gái"}: {event.title || "Sự kiện"}
                </h2>
                {config.events.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-red-500"
                    onClick={() => removeEvent(i)}
                  >
                    Xóa
                  </button>
                )}
              </div>
              <select
                className="admin-input"
                value={event.side}
                onChange={(e) => updateEvent(i, "side", e.target.value)}
              >
                <option value="bride">Nhà gái · Lễ vu quy · /nha-gai</option>
                <option value="groom">Nhà trai · Lễ thành hôn · /nha-trai</option>
              </select>
              <input
                className="admin-input"
                placeholder="Tiêu đề"
                value={event.title}
                onChange={(e) => updateEvent(i, "title", e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="admin-input"
                  placeholder="Giờ"
                  value={event.time}
                  onChange={(e) => updateEvent(i, "time", e.target.value)}
                />
                <input
                  className="admin-input"
                  placeholder="Ngày hiển thị"
                  value={event.date}
                  onChange={(e) => updateEvent(i, "date", e.target.value)}
                />
              </div>
              <input
                className="admin-input"
                placeholder="Địa điểm"
                value={event.location}
                onChange={(e) => updateEvent(i, "location", e.target.value)}
              />
              <textarea
                className="admin-input"
                placeholder="Địa chỉ"
                rows={2}
                value={event.address}
                onChange={(e) => updateEvent(i, "address", e.target.value)}
              />
              <input
                className="admin-input"
                placeholder="Link Google Maps"
                value={event.mapUrl}
                onChange={(e) => updateEvent(i, "mapUrl", e.target.value)}
              />
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
              onClick={() => addEvent("bride")}
            >
              + Sự kiện nhà gái
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
              onClick={() => addEvent("groom")}
            >
              + Sự kiện nhà trai
            </button>
          </div>

          <button type="submit" disabled={saving} className="admin-btn">
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </main>
    </div>
  );
}
