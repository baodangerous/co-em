/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BỘ CHỌN SỰ KIỆN & NHU CẦU GEN Z (GEN Z EVENT & OCCASION SELECTOR)
 * Đồng bộ hệ thống 3 cỡ chữ (text-lg, text-sm, text-xs) và 3 kiểu chữ.
 */

import React from "react";
import { SU_KIEN_GENZ, SuKienGenZ } from "../data/genzRemixData";
import { Sparkles, Check, ArrowRight, Compass } from "lucide-react";

interface GenzEventSelectorProps {
  selectedEventId: string | null;
  onSelectEvent: (event: SuKienGenZ) => void;
  onApplyRecommendation: (event: SuKienGenZ) => void;
}

export default function GenzEventSelector({
  selectedEventId,
  onSelectEvent,
  onApplyRecommendation,
}: GenzEventSelectorProps) {
  const currentEvent = SU_KIEN_GENZ.find((e) => e.id === selectedEventId) || SU_KIEN_GENZ[0];

  return (
    <div className="p-3.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs text-[var(--nen-toi)]">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Compass className="w-4 h-4" />
        </span>
        <h3 className="text-sm font-semibold text-[var(--nen-toi)] m-0">
          Dịp Sử Dụng & Gợi Ý Nhanh
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
        {SU_KIEN_GENZ.map((ev) => {
          const isSelected = ev.id === selectedEventId;
          return (
            <button
              key={ev.id}
              type="button"
              onClick={() => onSelectEvent(ev)}
              className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-1.5 ${
                isSelected
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100"
                  : "bg-[var(--nen-the-phu)] border-[var(--vien-the)] hover:border-emerald-400/60"
              }`}
            >
              <span className="text-xs font-semibold truncate">
                {ev.bieuTuong} {ev.ten}
              </span>
              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      {currentEvent && (
        <div className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="text-sm font-semibold text-[var(--nen-toi)]">
              {currentEvent.bieuTuong} {currentEvent.ten}
            </div>
            <p className="text-xs text-[var(--tro-tram)] m-0">
              {currentEvent.loiKhuyenVanHoa}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onApplyRecommendation(currentEvent)}
            className="w-full sm:w-auto py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Áp dụng gợi ý</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
