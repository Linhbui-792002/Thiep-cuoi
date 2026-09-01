"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Wish } from "@/types";

export default function AdminWishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then(setWishes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell title="Lời chúc" description={`${wishes.length} lời chúc từ khách mời`}>
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : wishes.length === 0 ? (
        <div className="admin-card text-center text-gray-400">Chưa có lời chúc nào</div>
      ) : (
        <div className="space-y-3">
          {wishes.map((wish) => (
            <div key={wish._id} className="admin-card">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <p className="font-medium text-olive">{wish.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">{wish.message}</p>
                </div>
                <time className="shrink-0 text-xs text-gray-400">
                  {new Date(wish.createdAt).toLocaleString("vi-VN")}
                </time>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
