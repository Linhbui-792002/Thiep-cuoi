"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { INVITATION_SIDES } from "@/lib/invitation-side";
import Link from "next/link";

export default function AdminDashboard() {
  const cards = [
    {
      href: "/admin/content",
      title: "Nội dung & ảnh",
      desc: "Chữ, ảnh polaroid, bật/tắt từng phần trên thiệp",
    },
    {
      href: "/admin/settings",
      title: "Thông tin thiệp",
      desc: "Tên, ngày, nhà trai / nhà gái, giờ và địa điểm từng lễ",
    },
    {
      href: "/admin/rsvp",
      title: "Xác nhận tham dự",
      desc: "Khách nhà gái (vu quy) và nhà trai (thành hôn) tách riêng",
    },
    {
      href: "/admin/wishes",
      title: "Lời chúc",
      desc: "Lời chúc gửi từ khách trên thiệp",
    },
  ];

  return (
    <AdminShell title="Tổng quan" description="Quản lý thiệp cưới điện tử" wide>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <PreviewLink
          href={INVITATION_SIDES.bride.path}
          title="Thiệp nhà gái"
          subtitle={INVITATION_SIDES.bride.ceremony}
        />
        <PreviewLink
          href={INVITATION_SIDES.groom.path}
          title="Thiệp nhà trai"
          subtitle={INVITATION_SIDES.groom.ceremony}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="admin-card block transition hover:shadow-md">
            <h2 className="font-serif text-lg text-olive">{card.title}</h2>
            <p className="mt-1.5 text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}

function PreviewLink({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl bg-olive px-4 py-4 text-white sm:px-5"
    >
      <span>
        <span className="block font-serif text-lg">{title}</span>
        <span className="mt-0.5 block text-xs text-white/75">{subtitle}</span>
      </span>
      <span className="text-sm text-white/80">Xem →</span>
    </Link>
  );
}
