"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { INVITATION_SIDES } from "@/lib/invitation-side";

const NAV_ITEMS = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/content", label: "Nội dung" },
  { href: "/admin/settings", label: "Thông tin" },
  { href: "/admin/wishes", label: "Lời chúc" },
  { href: "/admin/rsvp", label: "Xác nhận" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/admin" className="shrink-0 font-serif text-lg text-olive sm:text-xl">
          Admin
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                isActive(pathname, item.href)
                  ? "bg-olive text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-full border border-gray-200 px-3 py-1.5 text-xs text-olive sm:text-sm [&::-webkit-details-marker]:hidden">
              Xem thiệp
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              <Link href="/" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Trang chọn
              </Link>
              <Link
                href={INVITATION_SIDES.bride.path}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Nhà gái · Lễ vu quy
              </Link>
              <Link
                href={INVITATION_SIDES.groom.path}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Nhà trai · Lễ thành hôn
              </Link>
            </div>
          </details>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 sm:text-sm"
          >
            Thoát
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`min-h-10 shrink-0 rounded-full px-3.5 py-2 text-sm ${
              isActive(pathname, item.href)
                ? "bg-olive text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
