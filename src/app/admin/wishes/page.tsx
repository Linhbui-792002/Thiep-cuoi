"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
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
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 font-display text-3xl text-olive">Lời chúc</h1>
        <p className="mb-6 text-gray-500">
          {wishes.length} lời chúc từ khách mời
        </p>

        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : wishes.length === 0 ? (
          <div className="admin-card text-center text-gray-400">
            Chưa có lời chúc nào
          </div>
        ) : (
          <div className="space-y-4">
            {wishes.map((wish) => (
              <div key={wish._id} className="admin-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-olive">{wish.name}</p>
                    <p className="mt-2 text-gray-700">{wish.message}</p>
                  </div>
                  <time className="shrink-0 text-xs text-gray-400">
                    {new Date(wish.createdAt).toLocaleString("vi-VN")}
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
