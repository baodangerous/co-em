/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared UI Primitives (SharedUI.tsx)
 * Các thành phần giao diện dùng chung trên toàn hệ thống giúp đồng bộ phong cách thiết kế,
 * giảm trùng lặp code và dễ bảo trì mở rộng.
 */

import React from "react";
import { CheckCircle2, Sparkles, X } from "lucide-react";

/**
 * Thông báo trạng thái nổi (Toast Banner) dùng chung
 */
export function ToastBanner({
  message,
  onClose,
  variant = "emerald",
}: {
  message: string | null;
  onClose: () => void;
  variant?: "emerald" | "amber";
}) {
  if (!message) return null;
  const bgClass =
    variant === "amber" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white";

  return (
    <div
      role="status"
      className={`p-3 rounded-xl ${bgClass} text-xs font-semibold flex items-center justify-between shadow-md`}
    >
      <span className="flex items-center gap-2">
        {variant === "amber" ? (
          <Sparkles className="w-4 h-4 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        )}
        <span>{message}</span>
      </span>
      <button
        type="button"
        onClick={onClose}
        className="text-white/80 hover:text-white cursor-pointer px-1"
        aria-label="Đóng thông báo"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Khung cửa sổ Modal (ModalShell) dùng chung cho các hộp thoại, biểu mẫu
 */
export function ModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  maxWidthClass = "max-w-md",
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  maxWidthClass?: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidthClass} rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] p-5 text-[var(--chu-chinh)] shadow-2xl space-y-3.5 max-h-[92vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-[var(--vien-the)]">
          <div>
            {badge && <div className="mb-1">{badge}</div>}
            <h3 className="font-serif text-lg font-bold m-0 text-[var(--chu-chinh)]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--nen-the-phu)] text-[var(--chu-phu)] hover:text-[var(--chu-chinh)] cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Thanh chuyển đổi tab con (SubNavTabs) cho các cụm màn hình trong App.tsx
 */
export function SubNavTabs<T extends string>({
  activeId,
  items,
  onSelect,
}: {
  activeId: T;
  items: ReadonlyArray<{ id: T; label: string }>;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 pt-3 pb-1 flex items-center justify-center">
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs flex-wrap justify-center">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[var(--xanh-chinh)] text-white"
                  : "bg-transparent text-[var(--chu-chinh)] hover:bg-[var(--nen-the-phu)]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Trạng thái đang tải màn hình nhẹ nhàng cho React.lazy + Suspense
 */
export function ScreenLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="px-5 py-3.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs flex items-center gap-3 text-xs font-semibold text-[var(--chu-chinh)]">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
        <span>Đang mở không gian di sản Việt Phục...</span>
      </div>
    </div>
  );
}
