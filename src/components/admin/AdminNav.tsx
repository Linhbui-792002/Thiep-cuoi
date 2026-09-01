"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: "🏠" },
  { href: "/admin/content", label: "Sections", icon: "📑" },
  { href: "/admin/settings", label: "Thông tin", icon: "⚙️" },
  { href: "/admin/wishes", label: "Lời chúc", icon: "💌" },
  { href: "/admin/rsvp", label: "Xác nhận", icon: "✅" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-xl text-olive">
            Admin
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  pathname === item.href
                    ? "bg-olive text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-sm text-olive hover:underline"
          >
            Xem thiệp →
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-4 pb-3 sm:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm ${
              pathname === item.href
                ? "bg-olive text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
