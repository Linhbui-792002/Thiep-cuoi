"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

interface RsvpItem {
  _id: string;
  name: string;
  attending: boolean;
  guestCount: number;
  createdAt: string;
}

export default function AdminRsvpPage() {
  const [items, setItems] = useState<RsvpItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const attending = items.filter((i) => i.attending);
  const totalGuests = attending.reduce((sum, i) => sum + i.guestCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 font-display text-3xl text-olive">Xác nhận tham dự</h1>
        <p className="mb-6 text-gray-500">
          {attending.length} khách xác nhận · {totalGuests} người tham dự
        </p>

        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : items.length === 0 ? (
          <div className="admin-card text-center text-gray-400">Chưa có xác nhận nào</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="admin-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-olive">{item.name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.attending
                        ? `Sẽ tham dự · ${item.guestCount} người`
                        : "Không tham dự được"}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
