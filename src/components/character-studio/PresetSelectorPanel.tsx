/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG CHỌN KHUÔN MẪU CÓ SẴN (PRESET SELECTOR PANEL)
 * - Đồng nhất 1 font chữ duy nhất: font-sans (Be Vietnam Pro)
 * - Hiển thị rõ Giới tính, Dáng người, Màu da của từng khuôn mẫu
 * - Hỗ trợ lọc nhanh theo giới tính (Tất cả / Nữ / Nam)
 */

import React, { useState, useMemo } from "react";
import { Check } from "lucide-react";
import { NhanVatConfig } from "../../characters/types";
import { HeritagePreset } from "../../characters/presets/heritagePresets";
import { SILK_SKIN_TONES } from "../../characters/domain/silkSkinTones";

export interface PresetSelectorPanelProps {
  presets: HeritagePreset[];
  config: NhanVatConfig;
  onApplyPreset: (preset: HeritagePreset) => void;
}

export function PresetSelectorPanel({
  presets,
  config,
  onApplyPreset,
}: PresetSelectorPanelProps) {
  const [filterGender, setFilterGender] = useState<"all" | "nu" | "nam">("all");

  const filteredPresets = useMemo(() => {
    if (filterGender === "all") return presets;
    return presets.filter((p) => p.config.gioi === filterGender);
  }, [presets, filterGender]);

  const getVocDangLabel = (vd: string) => {
    switch (vd) {
      case "manh": return "Mảnh mai";
      case "day_dan": return "Đầy đặn";
      case "dam_nguoi": return "Đậm người";
      default: return "Cân đối";
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5 font-sans select-none">
      
      {/* BỘ LỌC GIỚI TÍNH NHANH CHO KHUÔN MẪU */}
      <div className="flex items-center gap-1 p-0.5 bg-amber-100/60 dark:bg-slate-800 rounded-lg border border-amber-200/50 dark:border-slate-700 text-xs font-sans">
        <button
          type="button"
          onClick={() => setFilterGender("all")}
          className={`flex-1 py-1 px-2 rounded-md font-semibold text-[11px] transition-all cursor-pointer font-sans ${
            filterGender === "all"
              ? "bg-amber-700 text-white shadow-xs"
              : "text-amber-900 dark:text-amber-200 hover:text-amber-950"
          }`}
        >
          Tất cả ({presets.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterGender("nu")}
          className={`flex-1 py-1 px-2 rounded-md font-semibold text-[11px] transition-all cursor-pointer font-sans ${
            filterGender === "nu"
              ? "bg-amber-700 text-white shadow-xs"
              : "text-amber-900 dark:text-amber-200 hover:text-amber-950"
          }`}
        >
          ♀ Nữ ({presets.filter((p) => p.config.gioi === "nu").length})
        </button>
        <button
          type="button"
          onClick={() => setFilterGender("nam")}
          className={`flex-1 py-1 px-2 rounded-md font-semibold text-[11px] transition-all cursor-pointer font-sans ${
            filterGender === "nam"
              ? "bg-amber-700 text-white shadow-xs"
              : "text-amber-900 dark:text-amber-200 hover:text-amber-950"
          }`}
        >
          ♂ Nam ({presets.filter((p) => p.config.gioi === "nam").length})
        </button>
      </div>

      {/* DANH SÁCH THẺ KHUÔN MẪU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filteredPresets.map((preset) => {
          const isSelected =
            config.tuoi === preset.config.tuoi &&
            config.gioi === preset.config.gioi &&
            config.vocDang === preset.config.vocDang &&
            config.tongDa === preset.config.tongDa &&
            config.toc === preset.config.toc;

          const skin = SILK_SKIN_TONES[preset.config.tongDa] || SILK_SKIN_TONES[2];

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`preset-card p-2.5 rounded-xl border text-left flex items-start justify-between gap-2 cursor-pointer transition-all font-sans ${
                isSelected
                  ? "preset-card--active ring-1 ring-amber-600 border-amber-600 bg-amber-50/90 dark:bg-amber-950/60"
                  : "bg-white/80 dark:bg-slate-800/80 border-amber-200/60 dark:border-slate-700 hover:bg-amber-50/40"
              }`}
            >
              <div className="min-w-0 flex-1 flex flex-col gap-1">
                <div className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-50 truncate font-sans">
                  {preset.ten}
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium truncate font-sans">
                  {preset.vungMien} · {preset.config.gioi === "nu" ? "♀ Nữ" : "♂ Nam"}
                </div>
                
                {/* THÔNG SỐ ĐẶC TRƯNG: GIỚI TÍNH · DÁNG NGƯỜI · MÀU DA */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-sans mt-0.5">
                  <span className="font-medium">{getVocDangLabel(preset.config.vocDang)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0 inline-block"
                      style={{ background: skin.swatchGrad }}
                    />
                    <span>{skin.ten}</span>
                  </span>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                  isSelected
                    ? "bg-amber-600 text-white"
                    : "border border-amber-300 dark:border-slate-600 text-transparent"
                }`}
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PresetSelectorPanel;
