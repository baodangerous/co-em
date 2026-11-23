/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BỘ GÁC CỔNG VĂN HÓA & CẢNH BÁO LỆCH CHUẨN (CULTURAL GUARDIAN & WARNING)
 * Đồng bộ hệ thống 3 cỡ chữ (text-lg, text-sm, text-xs) và 3 kiểu chữ.
 */

import React from "react";
import { danhGiaVanHoaGenZ } from "../data/genzRemixData";
import { ShieldCheck, AlertTriangle, Sparkles, BookOpen } from "lucide-react";
import { openGiuChuanVanHoa } from "../lib/giuChuan";

interface CulturalWarningCardProps {
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  giayId: string;
  phongCachId: string;
  className?: string;
}

export default function CulturalWarningCard({
  trangPhucId,
  mauId,
  phuKienIds,
  giayId,
  phongCachId,
  className = "",
}: CulturalWarningCardProps) {
  const warning = danhGiaVanHoaGenZ(trangPhucId, mauId, phuKienIds, giayId, phongCachId);

  const isWarning = warning.mucDo === "can_can_nhac";
  const isRemix = warning.mucDo === "remix_van_minh";

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all ${
        isWarning
          ? "bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600"
          : isRemix
          ? "bg-teal-50/80 dark:bg-teal-950/30 border-teal-400 dark:border-teal-700"
          : "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`p-1.5 rounded-xl shrink-0 ${
              isWarning
                ? "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100"
                : isRemix
                ? "bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100"
                : "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100"
            }`}
          >
            {isWarning ? (
              <AlertTriangle className="w-4 h-4" />
            ) : isRemix ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </span>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white m-0 truncate">
            {warning.tieuDe}
          </h4>
        </div>

        <button
          type="button"
          onClick={() => openGiuChuanVanHoa()}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer bg-transparent border-0 p-0 shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quy chuẩn</span>
        </button>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 m-0 mb-2">
        {warning.noiDung}
      </p>

      <div className="pt-2 border-t border-black/10 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-semibold text-emerald-800 dark:text-emerald-300">Gợi ý: </span>
        <span>{warning.goiYKhacPhuc}</span>
      </div>
    </div>
  );
}
