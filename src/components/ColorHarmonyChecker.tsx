/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BỘ KIỂM TRA SỰ HÀI HÒA CỦA MÀU SẮC (COLOR HARMONY & FIVE ELEMENTS CHECKER)
 * Đồng bộ hệ thống 3 cỡ chữ (text-lg, text-sm, text-xs) và 3 kiểu chữ.
 */

import React from "react";
import { kiemTraHaiHoaMauSac, MAU_NGU_HANH } from "../data/genzRemixData";
import { Palette } from "lucide-react";

interface ColorHarmonyCheckerProps {
  selectedColorId: string;
  selectedAccessoryColorId?: string;
  className?: string;
}

export default function ColorHarmonyChecker({
  selectedColorId,
  selectedAccessoryColorId,
  className = "",
}: ColorHarmonyCheckerProps) {
  const result = kiemTraHaiHoaMauSac(selectedColorId, selectedAccessoryColorId);
  const aoInfo = MAU_NGU_HANH[selectedColorId] || MAU_NGU_HANH["m_do"];

  return (
    <div
      className={`p-3.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs text-[var(--nen-toi)] ${className}`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Palette className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-semibold text-[var(--nen-toi)] m-0">
            Hài Hòa Ngũ Hành
          </h3>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-semibold text-xs">
          {result.diemSo}/100
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div className="p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg border border-black/15 shrink-0"
            style={{ backgroundColor: aoInfo.hex }}
          />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold block truncate">{aoInfo.tenMau}</span>
            <span className="text-xs text-[var(--tro-tram)]">
              {aoInfo.hanh}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex flex-col justify-center">
          <span className="text-xs font-semibold text-[var(--nen-toi)] truncate">
            {result.quanHeNguHanh}
          </span>
          <span className="text-xs text-emerald-700 dark:text-emerald-400">
            {result.nhan}
          </span>
        </div>
      </div>

      <p className="text-xs text-[var(--tro-tram)] m-0">
        {result.phanTich} {result.loiKhuyenGenZ}
      </p>
    </div>
  );
}
