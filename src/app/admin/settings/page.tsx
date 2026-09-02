"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminToast } from "@/components/admin/AdminToast";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { SiteConfig, ThemeConfig, GiftConfig } from "@/types";
import { DEFAULT_SITE_CONFIG } from "@/lib/constants";
import { DEFAULT_THEME } from "@/lib/theme";
import { extractYoutubeId } from "@/lib/youtube";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [toastError, setToastError] = useState(false);

  function showToast(text: string, error = false) {
    setToastError(error);
    setToast("");
    window.setTimeout(() => setToast(text), 0);
  }

  useEffect(() => {
    fetch("/api/site-config")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Không thể tải cấu hình");
        setConfig({
          ...data,
          theme: data.theme || DEFAULT_THEME,
          youtubeMusicUrl: data.youtubeMusicUrl ?? "",
          gift: {
            ...DEFAULT_SITE_CONFIG.gift,
            ...data.gift,
          },
        });
      })
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Không thể tải cấu hình", true);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!config) return;

    setSaving(true);

    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lưu thất bại");

      setConfig(data);
      showToast("Đã lưu thành công!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lưu thất bại", true);
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

  function updateGift(field: keyof GiftConfig, value: string) {
    if (!config) return;
    setConfig({
      ...config,
      gift: { ...DEFAULT_SITE_CONFIG.gift, ...config.gift, [field]: value },
    });
  }

  async function uploadQr(files: FileList | null) {
    if (!files?.[0] || !config) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload QR thất bại");
      setConfig({
        ...config,
        gift: { ...DEFAULT_SITE_CONFIG.gift, ...config.gift, qrImageUrl: uploadData.url },
      });
      showToast("Đã thêm ảnh QR. Nhớ bấm Lưu thay đổi.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload QR thất bại", true);
    } finally {
      setSaving(false);
    }
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
          lunarDate: "",
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
      <AdminShell title="Thông tin thiệp">
        <p className="text-gray-500">Đang tải...</p>
      </AdminShell>
    );
  }

  const gift = config.gift ?? DEFAULT_SITE_CONFIG.gift;

  return (
    <AdminShell
      title="Thông tin thiệp"
      description="Tên, ngày cưới, và sự kiện nhà trai / nhà gái"
    >
        <AdminToast message={toast} error={toastError} />

        <form onSubmit={handleSave} className="space-y-6">
          <ThemeEditor theme={config.theme} onChange={updateTheme} />

          <div className="admin-card space-y-4">
            <h2 className="font-serif text-lg text-olive">Cặp đôi</h2>
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
              <label className="mb-1 block text-xs text-gray-500">
                Ngày âm lịch mặc định
              </label>
              <input
                className="admin-input"
                value={config.lunarDate}
                onChange={(e) => updateField("lunarDate", e.target.value)}
                placeholder="Dùng khi sự kiện chưa nhập ngày âm riêng"
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
            <h2 className="font-serif text-lg text-olive">Nhạc nền YouTube</h2>
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
            <h2 className="font-serif text-lg text-olive">Gửi quà mừng</h2>
            <p className="text-sm text-gray-500">
              Khách bấm icon quà trên thiệp sẽ thấy mã QR và thông tin chuyển khoản.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Ngân hàng</label>
                <input
                  className="admin-input"
                  placeholder="Vietcombank"
                  value={gift.bankName}
                  onChange={(e) => updateGift("bankName", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Chủ tài khoản</label>
                <input
                  className="admin-input"
                  placeholder="NGUYEN VAN A"
                  value={gift.accountName}
                  onChange={(e) => updateGift("accountName", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Số tài khoản</label>
              <input
                className="admin-input"
                placeholder="0123456789"
                value={gift.accountNumber}
                onChange={(e) => updateGift("accountNumber", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Ghi chú</label>
              <input
                className="admin-input"
                placeholder="Nội dung CK: Tên khách + Mừng cưới"
                value={gift.note}
                onChange={(e) => updateGift("note", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Ảnh QR</label>
              <div className="flex flex-wrap items-center gap-4">
                {gift.qrImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={gift.qrImageUrl}
                    alt="QR"
                    className="h-28 w-28 rounded-lg border border-gray-200 object-contain bg-white"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400">
                    Chưa có QR
                  </div>
                )}
                <div className="space-y-2">
                  <label className="admin-btn inline-block cursor-pointer text-xs">
                    {gift.qrImageUrl ? "Đổi ảnh QR" : "Upload ảnh QR"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadQr(e.target.files)}
                    />
                  </label>
                  {gift.qrImageUrl ? (
                    <button
                      type="button"
                      className="block text-xs text-red-500"
                      onClick={() => updateGift("qrImageUrl", "")}
                    >
                      Xóa QR
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card space-y-4">
            <h2 className="font-serif text-lg text-olive">Gia đình</h2>
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
                <h2 className="font-serif text-lg text-olive">
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
                  placeholder="Ngày dương"
                  value={event.date}
                  onChange={(e) => updateEvent(i, "date", e.target.value)}
                />
              </div>
              <input
                className="admin-input"
                placeholder="Ngày âm (riêng sự kiện này)"
                value={event.lunarDate ?? ""}
                onChange={(e) => updateEvent(i, "lunarDate", e.target.value)}
              />
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

          <button type="submit" disabled={saving} className="admin-btn w-full sm:w-auto">
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
    </AdminShell>
  );
}
