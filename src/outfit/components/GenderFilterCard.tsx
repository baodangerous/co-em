/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * THẺ TÙY CHỈNH NHÂN VẬT TRỰC TIẾP (CHARACTER QUICK CUSTOMIZER CARD)
 * - Tinh gọn, trực quan, thao tác 1-chạm
 * - Chọn Giới tính (Nữ / Nam)
 * - Chọn Dáng người (Mảnh mai / Cân đối / Đầy đặn / Đậm người)
 * - Chọn Màu da di sản (6 tông da tơ lụa Việt Nam)
 * - Chuyển sang Xưởng Tạo Dáng chi tiết nếu muốn
 */

import React from "react";
import { Check, Sparkles, User, Palette, Scissors, Clock } from "lucide-react";
import { NhanVatConfig, Gioi, VocDang, TongDa, Tuoi } from "../../characters/types";
import { SILK_SKIN_TONES } from "../../characters/domain/silkSkinTones";

interface GenderFilterCardProps {
  currentGender?: "nam" | "nu";
  onSelectGender?: (gender: "nam" | "nu") => void;
  config?: NhanVatConfig;
  onUpdateConfig?: (config: NhanVatConfig) => void;
  onOpenFullAtelier?: () => void;
  className?: string;
}

export default function GenderFilterCard({
  currentGender,
  onSelectGender,
  config,
  onUpdateConfig,
  onOpenFullAtelier,
  className = "",
}: GenderFilterCardProps) {
  const activeGender = config?.gioi || currentGender || "nu";
  const activeVocDang = config?.vocDang || "trung_binh";
  const activeTongDa = config?.tongDa || 2;
  const activeToc = config?.toc || (activeGender === "nam" ? "side_part" : "bui_thap");
  const activeTuoi = config?.tuoi || "nguoi_lon";

  const handleGenderChange = (newGioi: Gioi) => {
    if (onSelectGender) {
      onSelectGender(newGioi);
    }
    if (config && onUpdateConfig) {
      const nextToc =
        newGioi === "nam"
          ? (config.toc === "bui_thap" || config.toc === "dai_xoa" || config.toc === "bui_cao" ? "side_part" : config.toc)
          : (config.toc === "side_part" || config.toc === "short_crop" ? "bui_thap" : config.toc);
      onUpdateConfig({
        ...config,
        gioi: newGioi,
        toc: nextToc,
      });
    }
  };

  const handleVocDangChange = (newVd: VocDang) => {
    if (config && onUpdateConfig) {
      onUpdateConfig({
        ...config,
        vocDang: newVd,
      });
    }
  };

  const handleTongDaChange = (newTd: TongDa) => {
    if (config && onUpdateConfig) {
      onUpdateConfig({
        ...config,
        tongDa: newTd,
      });
    }
  };

  const handleTocChange = (newToc: string) => {
    if (config && onUpdateConfig) {
      onUpdateConfig({
        ...config,
        toc: newToc,
      });
    }
  };

  const handleTuoiChange = (newTuoi: Tuoi) => {
    if (config && onUpdateConfig) {
      onUpdateConfig({
        ...config,
        tuoi: newTuoi,
      });
    }
  };

  const genderOptions = [
    {
      id: "nu" as const,
      label: "Nữ",
      icon: "♀",
      sub: "Duyên dáng · Mềm mại",
    },
    {
      id: "nam" as const,
      label: "Nam",
      icon: "♂",
      sub: "Đĩnh đạc · Vững chãi",
    },
  ];

  const vocDangOptions: { id: VocDang; label: string }[] = [
    { id: "manh", label: "Mảnh mai" },
    { id: "trung_binh", label: "Cân đối" },
    { id: "day_dan", label: "Đầy đặn" },
    { id: "dam_nguoi", label: "Đậm người" },
  ];

  const currentSkinInfo = SILK_SKIN_TONES[activeTongDa] || SILK_SKIN_TONES[2];

  const hairOptions = activeGender === "nam" ? [
    { id: "side_part", label: "Rẽ ngôi lịch lãm" },
    { id: "short_crop", label: "Cắt ngắn nam tính" },
    { id: "ngan", label: "Tóc ngắn tân thời" },
    { id: "bac_bui", label: "Hoa râm phúc hậu" },
  ] : [
    { id: "bui_thap", label: "Búi thấp thanh lịch" },
    { id: "dai_xoa", label: "Tóc dài buông xõa" },
    { id: "bui_cao", label: "Búi cài trâm ngọc" },
    { id: "ngan", label: "Tóc ngắn tân thời" },
  ];

  return (
    <div className={`gender-filter-card space-y-3.5 font-sans select-none ${className}`}>
      
      {/* 1. CHỌN GIỚI TÍNH */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--nen-toi)] uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
            <span>1. Giới tính nhân vật</span>
          </span>
          <span className="text-[11px] font-medium text-[var(--chu-mo)]">
            {activeGender === "nu" ? "Mẫu nữ" : "Mẫu nam"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {genderOptions.map((opt) => {
            const isSelected = activeGender === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleGenderChange(opt.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-left font-sans ${
                  isSelected
                    ? "border-[var(--xanh-la)] bg-[var(--xanh-nhe)] ring-1 ring-[var(--xanh-la)] shadow-xs"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-[var(--xanh-la)] hover:bg-[var(--xanh-nhe)]/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold leading-none">{opt.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-[var(--nen-toi)]">{opt.label}</div>
                    <div className="text-[10px] text-[var(--chu-mo)]">{opt.sub}</div>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--xanh-chinh)] text-white font-semibold shrink-0">
                    Chọn
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHỌN DÁNG NGƯỜI */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--nen-toi)] uppercase tracking-wider">
            2. Dáng người & Vóc dáng
          </span>
          <span className="text-[11px] font-medium text-[var(--chu-mo)] lowercase">
            {activeVocDang === "manh"
              ? "mảnh mai"
              : activeVocDang === "trung_binh"
              ? "cân đối"
              : activeVocDang === "day_dan"
              ? "đầy đặn"
              : "đậm người"}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {vocDangOptions.map((vd) => {
            const isSelected = activeVocDang === vd.id;
            return (
              <button
                key={vd.id}
                type="button"
                onClick={() => handleVocDangChange(vd.id)}
                className={`py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer font-sans text-xs font-semibold ${
                  isSelected
                    ? "border-[var(--xanh-la)] bg-[var(--xanh-nhe)] text-[var(--nen-toi)] ring-1 ring-[var(--xanh-la)] shadow-xs font-bold"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--chu-mo)] hover:text-[var(--nen-toi)] hover:bg-[var(--xanh-nhe)]/30"
                }`}
              >
                {vd.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CHỌN MÀU DA DI SẢN */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--nen-toi)] uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>3. Màu da di sản</span>
          </span>
          <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
            {currentSkinInfo.ten}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {([1, 2, 3, 4, 5, 6] as TongDa[]).map((td) => {
            const skin = SILK_SKIN_TONES[td];
            const isSelected = activeTongDa === td;
            return (
              <button
                key={td}
                type="button"
                onClick={() => handleTongDaChange(td)}
                className={`p-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer font-sans text-xs ${
                  isSelected
                    ? "border-amber-600 bg-amber-100/70 dark:bg-amber-950/60 ring-1 ring-amber-600 shadow-xs"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-amber-400/50"
                }`}
                title={skin.yNghia}
              >
                <div
                  className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0 flex items-center justify-center"
                  style={{ background: skin.swatchGrad }}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-amber-950 stroke-[3]" />}
                </div>
                <span className="text-[11px] font-semibold text-[var(--nen-toi)] truncate">
                  {skin.ten}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[10.5px] text-[var(--chu-mo)] italic px-0.5 leading-tight">
          {currentSkinInfo.yNghia}
        </p>
      </div>

      {/* 4. CHỌN KIỂU TÓC */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--nen-toi)] uppercase tracking-wider flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-amber-600" />
            <span>4. Kiểu tóc</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {hairOptions.map((item) => {
            const isSelected = activeToc === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTocChange(item.id)}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer font-sans text-xs ${
                  isSelected
                    ? "border-amber-600 bg-amber-100/80 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 ring-1 ring-amber-600 shadow-xs font-bold"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--chu-mo)] hover:text-[var(--nen-toi)] hover:bg-amber-50/50"
                }`}
              >
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. CHỌN ĐỘ TUỔI */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--nen-toi)] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>5. Độ tuổi</span>
          </span>
          <span className="text-[11px] font-medium text-[var(--chu-mo)] lowercase">
            {activeTuoi === "tre_em" ? "trẻ em" : activeTuoi === "nguoi_cao_tuoi" ? "cao tuổi" : "người lớn"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "tre_em" as Tuoi, label: "Trẻ em" },
            { id: "nguoi_lon" as Tuoi, label: "Người lớn" },
            { id: "nguoi_cao_tuoi" as Tuoi, label: "Cao tuổi" },
          ].map((item) => {
            const isSelected = activeTuoi === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTuoiChange(item.id)}
                className={`py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer font-sans text-xs ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-600 shadow-xs font-bold"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--chu-mo)] hover:text-[var(--nen-toi)] hover:bg-emerald-50/30"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* NÚT MỞ XƯỞNG TẠO DÁNG CHUYÊN SÂU */}
      {onOpenFullAtelier && (
        <button
          type="button"
          onClick={onOpenFullAtelier}
          className="w-full mt-2 py-2 px-3 rounded-xl border border-amber-300/70 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100/80 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 font-sans"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Mở Xưởng Tạo Dáng Nhân Vật 2D Chuyên Sâu</span>
          <span className="font-bold">→</span>
        </button>
      )}

    </div>
  );
}
