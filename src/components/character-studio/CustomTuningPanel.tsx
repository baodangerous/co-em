/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG TÙY CHỈNH THÔNG SỐ NHÂN VẬT (CUSTOM TUNING PANEL)
 * - Tinh chỉnh đầy đủ: Giới tính, Dáng người & Thể trạng, Màu da di sản, Độ tuổi, Kiểu tóc
 * - Tối ưu hóa kích thước nút nhỏ gọn (h-8 hoặc h-8.5, text-[11px]) để nhường không gian tối đa cho người mẫu
 * - Hiển thị số đo thể trạng trực quan thời gian thực khi đổi dáng người
 * - Bảng chọn màu da tơ lụa di sản Việt Nam với swatch trực quan và ý nghĩa văn hóa
 */

import React from "react";
import { Sparkles, Check, Activity } from "lucide-react";
import {
  NhanVatConfig,
  Gioi,
  Tuoi,
  VocDang,
  TongDa,
} from "../../characters/types";
import { SILK_SKIN_TONES } from "../../characters/domain/silkSkinTones";
import { tinhSoDo } from "../../characters/dimensions/proportions";

export interface CustomTuningPanelProps {
  config: NhanVatConfig;
  updateField: <K extends keyof NhanVatConfig>(field: K, val: NhanVatConfig[K]) => void;
}

export function CustomTuningPanel({ config, updateField }: CustomTuningPanelProps) {
  // Tiêu đề các nhóm thuộc tính
  const labelClass = "text-[11px] font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300 font-sans flex items-center justify-between";
  
  // Font nút tùy chọn
  const optionTextClass = "text-[11px] font-semibold font-sans whitespace-nowrap";

  const handleGenderChange = (newGioi: Gioi) => {
    if (newGioi === config.gioi) return;
    updateField("gioi", newGioi);
    // Tự động đồng bộ kiểu tóc tương thích giới tính
    if (newGioi === "nam") {
      if (!config.toc || config.toc === "bui_thap" || config.toc === "dai_xoa" || config.toc === "bui_cao" || config.toc === "low_bun") {
        updateField("toc", "side_part");
      }
    } else {
      if (!config.toc || config.toc === "side_part" || config.toc === "short_crop") {
        updateField("toc", "bui_thap");
      }
    }
  };

  const soDo = tinhSoDo(config);
  const currentSkin = SILK_SKIN_TONES[config.tongDa] || SILK_SKIN_TONES[2];

  return (
    <div className="w-full flex flex-col gap-3 font-sans select-none">
      
      {/* 1. GIỚI TÍNH NHÂN VẬT */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          <span>1. Giới tính</span>
          <span className="text-[10px] font-medium text-amber-700/80 dark:text-amber-400/80 lowercase">
            {config.gioi === "nu" ? "hình mẫu thiếu nữ" : "hình mẫu nam nhân"}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "nu" as Gioi, label: "Nữ", sub: "Duyên dáng · Mềm mại", icon: "♀" },
            { id: "nam" as Gioi, label: "Nam", sub: "Đĩnh đạc · Vững chãi", icon: "♂" },
          ].map((item) => {
            const isSelected = config.gioi === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleGenderChange(item.id)}
                className={`h-9 px-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between font-sans ${
                  isSelected
                    ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs ring-1 ring-amber-600 text-amber-950 dark:text-amber-200"
                    : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold leading-none shrink-0">{item.icon}</span>
                  <div className="flex flex-col min-w-0">
                    <span className={`${optionTextClass} font-bold leading-tight`}>{item.label}</span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-3 h-3 text-amber-700 dark:text-amber-300 shrink-0 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DÁNG NGƯỜI & VÓC DÁNG */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          <span>2. Dáng người & Thể trạng</span>
          <span className="text-[10px] font-medium text-amber-700/80 dark:text-amber-400/80 lowercase">
            {config.vocDang === "manh"
              ? "mảnh mai"
              : config.vocDang === "trung_binh"
              ? "cân đối"
              : config.vocDang === "day_dan"
              ? "đầy đặn"
              : "đậm người"}
          </span>
        </label>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: "manh" as VocDang, label: "Mảnh mai", sub: "Thanh thoát" },
            { id: "trung_binh" as VocDang, label: "Cân đối", sub: "Chuẩn mực" },
            { id: "day_dan" as VocDang, label: "Đầy đặn", sub: "Phúc hậu" },
            { id: "dam_nguoi" as VocDang, label: "Đậm người", sub: "Vững chãi" },
          ].map((item) => {
            const isSelected = config.vocDang === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateField("vocDang", item.id)}
                className={`h-8 px-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center font-sans ${
                  isSelected
                    ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600 font-bold"
                    : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
                }`}
                title={item.sub}
              >
                <span className={optionTextClass}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* THÔNG SỐ SỐ ĐO TRỰC QUAN THỜI GIAN THỰC */}
        <div className="w-full bg-amber-50/60 dark:bg-slate-800/50 rounded-lg p-1.5 border border-amber-200/40 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-amber-900/80 dark:text-amber-200/80 font-sans">
          <span className="flex items-center gap-1 font-medium">
            <Activity className="w-2.5 h-2.5 text-amber-600 shrink-0" />
            <span>Tỉ lệ:</span>
          </span>
          <span className="font-semibold">
            Vai: {Math.round(soDo.vai * 2)} · Ngực: {Math.round(soDo.nguc * 2)} · Eo: {Math.round(soDo.eo * 2)} · Hông: {Math.round(soDo.hong * 2)}
          </span>
        </div>
      </div>

      {/* 3. MÀU DA (TÔNG DA DI SẢN) */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          <span>3. Màu da</span>
          <span className="text-[10px] font-medium text-amber-700/80 dark:text-amber-400/80">
            {currentSkin.ten}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {([1, 2, 3, 4, 5, 6] as TongDa[]).map((td) => {
            const info = SILK_SKIN_TONES[td];
            const isSelected = config.tongDa === td;
            return (
              <button
                key={td}
                type="button"
                onClick={() => updateField("tongDa", td)}
                className={`h-8 px-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer font-sans ${
                  isSelected
                    ? "border-amber-600 bg-amber-100 dark:bg-amber-950/70 shadow-xs ring-1 ring-amber-600"
                    : "border-amber-200/50 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-amber-50/50"
                }`}
                title={info.yNghia}
              >
                <div
                  className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0 flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: info.swatchGrad }}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-amber-950 stroke-[3]" />}
                </div>
                <span className={`${optionTextClass} text-amber-950 dark:text-amber-100 truncate`}>
                  {info.ten}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-amber-800/75 dark:text-amber-300/70 italic px-0.5 leading-tight font-sans">
          {currentSkin.yNghia}
        </p>
      </div>

      {/* 4. ĐỘ TUỔI */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          <span>4. Độ tuổi</span>
          <span className="text-[10px] font-medium text-amber-700/80 dark:text-amber-400/80 lowercase">
            {config.tuoi === "tre_em" ? "trẻ em" : config.tuoi === "nguoi_cao_tuoi" ? "cao tuổi" : "người lớn"}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "tre_em" as Tuoi, label: "Trẻ em" },
            { id: "nguoi_lon" as Tuoi, label: "Người lớn" },
            { id: "nguoi_cao_tuoi" as Tuoi, label: "Cao tuổi" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateField("tuoi", item.id)}
              className={`h-8 px-1.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center font-sans ${
                config.tuoi === item.id
                  ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600 font-bold"
                  : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
              }`}
            >
              <span className={optionTextClass}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. KIỂU TÓC */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          <span>5. Kiểu tóc</span>
        </label>

        {config.gioi === "nam" ? (
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "side_part", label: "Rẽ ngôi lịch lãm" },
              { id: "short_crop", label: "Cắt ngắn nam tính" },
              { id: "ngan", label: "Tóc ngắn tân thời" },
              { id: "bac_bui", label: "Hoa râm phúc hậu" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateField("toc", item.id)}
                className={`h-8 px-2 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center font-sans ${
                  config.toc === item.id
                    ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600 font-bold"
                    : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
                }`}
              >
                <span className={optionTextClass}>{item.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Búi thấp thanh lịch (chuẩn mẫu) chiếm trọn 1 hàng */}
            <button
              type="button"
              onClick={() => updateField("toc", "bui_thap")}
              className={`h-8 px-2.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 font-sans ${
                config.toc === "bui_thap" || config.toc === "low_bun"
                  ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600 font-bold"
                  : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className={optionTextClass}>Búi thấp thanh lịch (Chuẩn mẫu)</span>
            </button>

            {/* 4 kiểu tóc truyền thống xếp lưới 2x2 vuông vắn */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "dai_xoa", label: "Tóc dài buông xõa" },
                { id: "bui_cao", label: "Búi cài trâm ngọc" },
                { id: "ngan", label: "Tóc ngắn tân thời" },
                { id: "bac_bui", label: "Tóc hoa râm" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateField("toc", item.id)}
                  className={`h-8 px-2 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center font-sans ${
                    config.toc === item.id
                      ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600 font-bold"
                    : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
                  }`}
                >
                  <span className={optionTextClass}>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}

export default CustomTuningPanel;
