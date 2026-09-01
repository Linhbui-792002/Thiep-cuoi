"use client";

import { useState } from "react";
import { Gift, X } from "@/components/icons";
import type { GiftConfig } from "@/types";

export function isGiftConfigured(gift?: GiftConfig | null) {
  if (!gift) return false;
  return Boolean(gift.qrImageUrl.trim() || gift.accountNumber.trim());
}

export function GiftSection({
  gift,
  onOpen,
}: {
  gift: GiftConfig;
  onOpen: () => void;
}) {
  if (!isGiftConfigured(gift)) return null;

  return (
    <section className="px-8 py-6">
      <button type="button" className="gift-cta" onClick={onOpen}>
        <Gift size={28} strokeWidth={1.5} />
        <span>Gửi Quà Mừng</span>
      </button>
    </section>
  );
}

export function GiftModal({
  gift,
  open,
  onClose,
  coupleName,
}: {
  gift: GiftConfig;
  open: boolean;
  onClose: () => void;
  coupleName: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!open || !isGiftConfigured(gift)) return null;

  async function copyAccount() {
    if (!gift.accountNumber.trim()) return;
    try {
      await navigator.clipboard.writeText(gift.accountNumber.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[160] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="wish-modal w-full max-w-[430px] rounded-t-2xl bg-white p-6 pb-10 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-name text-lg text-[var(--primary)]">{coupleName}</p>
            <p className="font-label text-xs text-gray-400">Gửi quà mừng</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
            aria-label="Đóng"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {gift.qrImageUrl ? (
          <div className="mx-auto mb-4 w-[220px] overflow-hidden rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gift.qrImageUrl} alt="Mã QR chuyển khoản" className="h-auto w-full" />
          </div>
        ) : null}

        <div className="space-y-1.5 text-center">
          {gift.bankName ? (
            <p className="font-label text-xs uppercase tracking-[0.18em] text-gray-400">
              {gift.bankName}
            </p>
          ) : null}
          {gift.accountName ? (
            <p className="font-serif text-base text-olive">{gift.accountName}</p>
          ) : null}
          {gift.accountNumber ? (
            <button
              type="button"
              onClick={copyAccount}
              className="font-label text-lg font-semibold tracking-wide text-gray-800"
            >
              {gift.accountNumber}
            </button>
          ) : null}
          {gift.note ? (
            <p className="pt-1 font-label text-xs leading-relaxed text-gray-500">{gift.note}</p>
          ) : null}
        </div>

        {gift.accountNumber ? (
          <button type="button" className="btn-primary mt-5 w-full rounded-lg py-3 font-label text-sm" onClick={copyAccount}>
            {copied ? "Đã sao chép STK" : "Sao chép số tài khoản"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
