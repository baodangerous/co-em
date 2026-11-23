/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modal giải nghĩa văn hóa của Cò Em tại Xưởng Phối Đồ 2D (S4).
 */

import React from "react";
import { domdom } from "../copy/coem";

interface OutfitViSaoModalProps {
  isOpen: boolean;
  loading: boolean;
  text: string;
  onClose: () => void;
}

export default function OutfitViSaoModal({
  isOpen,
  loading,
  text,
  onClose,
}: OutfitViSaoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[var(--nen-the)] border border-[var(--vien-the)] rounded-xl p-6 text-[var(--nen-toi)] shadow-xl"
        style={{ borderRadius: "var(--vien-lech-a)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="font-serif text-base font-bold text-[var(--vang-chinh)] m-0">
              Cố vấn văn hóa Cò Em · Ý nghĩa nếp áo
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--nen-the-phu)] hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-[var(--chu-phu)] border border-[var(--vien-the)] cursor-pointer transition-colors shadow-xs"
            aria-label="Đóng"
          >
            ✕ Đóng
          </button>
        </div>

        <div className="min-h-[80px]">
          {loading ? (
            <div className="flex items-center gap-2.5 py-6 text-[var(--vang-chinh)] text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--vang-chinh)] animate-ping" />
              <span>{domdom.chat.dangTim}</span>
            </div>
          ) : (
            <div className="text-sm leading-relaxed text-[var(--nen-toi)] space-y-3">
              <p className="m-0">{text}</p>
              <div className="text-xs text-[var(--tro-tram)] pt-2 border-t border-[var(--vien-the)]">
                <span>
                  ✦ Nguồn đối chiếu: Phục trang và chuẩn mực truyền thống các dân
                  tộc Việt Nam.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-5">
          <button
            type="button"
            onClick={onClose}
            className="bg-[var(--vang-nghe)] text-[#1A3022] font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer hover:brightness-105 shadow-sm border-0"
            style={{ borderRadius: "var(--vien-lech-a)" }}
          >
            Đã hiểu, tiếp tục phối đồ
          </button>
        </div>
      </div>
    </div>
  );
}
