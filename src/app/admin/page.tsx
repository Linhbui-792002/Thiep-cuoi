"use client";

import { AdminNav } from "@/components/admin/AdminNav";
import Link from "next/link";

export default function AdminDashboard() {
  const cards = [
    {
      href: "/admin/content",
      title: "Quản lý Sections",
      desc: "Nội dung text, ảnh và bật/tắt từng section trên thiệp",
      icon: "📑",
    },
    {
      href: "/admin/settings",
      title: "Thông tin thiệp",
      desc: "Chỉnh sửa tên, ngày cưới, địa điểm, gia đình",
      icon: "⚙️",
    },
    {
      href: "/admin/wishes",
      title: "Lời chúc",
      desc: "Xem danh sách lời chúc từ khách mời",
      icon: "💌",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 font-display text-3xl text-olive">Tổng quan</h1>
        <p className="mb-8 text-gray-500">Quản lý thiệp cưới điện tử của bạn</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="admin-card transition hover:shadow-md"
            >
              <span className="text-3xl">{card.icon}</span>
              <h2 className="mt-3 font-display text-xl text-olive">{card.title}</h2>
              <p className="mt-2 text-sm text-gray-500">{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
