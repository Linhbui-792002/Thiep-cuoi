"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { INVITATION_SIDES, type InvitationSide } from "@/lib/invitation-side";

interface RsvpItem {
  _id: string;
  name: string;
  attending: boolean;
  guestCount: number;
  side?: InvitationSide;
  createdAt: string;
}

type Filter = "all" | InvitationSide;

function sideOf(item: RsvpItem): InvitationSide {
  return item.side === "groom" ? "groom" : "bride";
}

export default function AdminRsvpPage() {
  const [items, setItems] = useState<RsvpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetch("/api/rsvp")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const group = (side: InvitationSide) => {
      const list = items.filter((i) => sideOf(i) === side);
      const yes = list.filter((i) => i.attending);
      return {
        count: list.length,
        yes: yes.length,
        guests: yes.reduce((sum, i) => sum + i.guestCount, 0),
      };
    };
    return { bride: group("bride"), groom: group("groom") };
  }, [items]);

  const visible = items.filter((item) => filter === "all" || sideOf(item) === filter);

  return (
    <AdminShell
      title="Xác nhận tham dự"
      description="Tách riêng khách nhà gái (lễ vu quy) và nhà trai (lễ thành hôn)"
    >
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Nhà gái"
          hint="Lễ vu quy"
          value={`${stats.bride.guests} khách`}
          sub={`${stats.bride.yes} xác nhận`}
          active={filter === "bride"}
          onClick={() => setFilter("bride")}
        />
        <StatCard
          label="Nhà trai"
          hint="Lễ thành hôn"
          value={`${stats.groom.guests} khách`}
          sub={`${stats.groom.yes} xác nhận`}
          active={filter === "groom"}
          onClick={() => setFilter("groom")}
        />
        <StatCard
          className="col-span-2 sm:col-span-1"
          label="Tổng"
          hint="Cả hai bên"
          value={`${stats.bride.guests + stats.groom.guests} khách`}
          sub={`${stats.bride.yes + stats.groom.yes} xác nhận`}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
      </div>

      <div className="rsvp-side-switch mb-4">
        <button type="button" className={filter === "all" ? "is-on" : ""} onClick={() => setFilter("all")}>
          Tất cả
        </button>
        <button type="button" className={filter === "bride" ? "is-on" : ""} onClick={() => setFilter("bride")}>
          Nhà gái
        </button>
        <button type="button" className={filter === "groom" ? "is-on" : ""} onClick={() => setFilter("groom")}>
          Nhà trai
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : visible.length === 0 ? (
        <div className="admin-card text-center text-gray-400">Chưa có xác nhận nào</div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Khách</th>
                  <th className="px-4 py-3 font-medium">Bên</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => {
                  const side = sideOf(item);
                  return (
                    <tr key={item._id} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-olive">{item.name}</td>
                      <td className="px-4 py-3">
                        <SideBadge side={side} />
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.attending ? `Sẽ tham dự · ${item.guestCount} người` : "Không tham dự"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {visible.map((item) => {
              const side = sideOf(item);
              return (
                <div key={item._id} className="admin-card">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-olive">{item.name}</p>
                    <SideBadge side={side} />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.attending ? `Sẽ tham dự · ${item.guestCount} người` : "Không tham dự được"}
                  </p>
                  <time className="mt-2 block text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </time>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AdminShell>
  );
}

function StatCard({
  label,
  hint,
  value,
  sub,
  className = "",
  active = false,
  onClick,
}: {
  label: string;
  hint: string;
  value: string;
  sub: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`admin-card text-left ${className} ${active ? "ring-2 ring-olive" : ""}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 font-serif text-xl text-olive sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-gray-500">
        {hint} · {sub}
      </p>
    </button>
  );
}

function SideBadge({ side }: { side: InvitationSide }) {
  const meta = INVITATION_SIDES[side];
  return (
    <span className="inline-flex rounded-full bg-olive/10 px-2.5 py-1 text-[11px] font-medium text-olive">
      {meta.label} · {meta.ceremony}
    </span>
  );
}
