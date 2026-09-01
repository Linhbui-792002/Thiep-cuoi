"use client";

import { useState } from "react";

export function RsvpSection() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Vui lòng nhập họ tên");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending: attending === "yes",
          guestCount: parseInt(guestCount, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gửi thất bại");

      setSuccess(true);
      setName("");
      setAttending("yes");
      setGuestCount("1");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gửi thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-primary px-4 py-8" id="rsvp-section">
      <form onSubmit={handleSubmit} className="rsvp-card mx-auto max-w-[360px]">
        <h3 className="mb-5 text-center font-serif text-xl font-semibold text-gray-800">
          Xác nhận tham dự
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block font-label text-xs font-medium text-gray-600">
              Họ và tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn"
              className="input-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 font-label text-sm"
              maxLength={100}
            />
          </div>

          <div>
            <label className="mb-2 block font-label text-xs font-medium text-gray-600">
              Bạn sẽ tham dự chứ?
            </label>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name="attending"
                  checked={attending === "yes"}
                  onChange={() => setAttending("yes")}
                  className="rsvp-radio"
                />
                <span className="font-label text-sm text-gray-700">Có, tôi sẽ tham dự</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name="attending"
                  checked={attending === "no"}
                  onChange={() => setAttending("no")}
                  className="rsvp-radio"
                />
                <span className="font-label text-sm text-gray-700">
                  Tôi bận, rất tiếc không thể tham dự
                </span>
              </label>
            </div>
          </div>

          {attending === "yes" && (
            <div>
              <label className="mb-1.5 block font-label text-xs font-medium text-gray-600">
                Số lượng người tham dự
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="rsvp-select font-label"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} người
                  </option>
                ))}
              </select>
            </div>
          )}

          {message && <p className="text-center font-label text-sm text-red-500">{message}</p>}
          {success && (
            <p className="text-center font-label text-sm text-green-600">
              Cảm ơn bạn! Xác nhận đã được ghi nhận.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-lg py-3 font-label text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi xác nhận"}
          </button>
        </div>
      </form>
    </section>
  );
}
