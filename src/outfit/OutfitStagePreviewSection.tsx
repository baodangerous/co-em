/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Sân khấu Xem Trước 2D & Dải Nút Tác Vụ của Xưởng Phối Đồ (S4).
 */

import React from "react";
import AvatarSVG from "../components/AvatarSVG";
import { CulturalPatternsDefs } from "../components/GarmentLayers";
import { NhanVatConfig } from "../lib/avatar";
import { domdom } from "../copy/coem";
import { ArrowRightLeft, Sparkles, Camera } from "lucide-react";

interface OutfitStagePreviewSectionProps {
  isPerforming: boolean;
  completedMoment: boolean;
  nhanVat: NhanVatConfig;
  computedViewBox: string;
  garmentLayers: {
    childrenVayQuan: React.ReactNode;
    childrenAo: React.ReactNode;
    childrenPhuKienThan: React.ReactNode;
    childrenTocTruocKhanNon: React.ReactNode;
  };
  costumeName: string;
  colorName: string;
  tenNhomHoaVan: string | null;
  colorBadgeLabel: string;
  remixBadgeLabel: string;
  onOpenViSao: () => void;
  onFinishOutfit: () => void;
  onOpenCatGui: () => void;
  onOpenAIAnd3D: () => void;
  onOpenLookbook: () => void;
  onOpenCompare: () => void;
  onOpenChoPhien?: () => void;
}

export default function OutfitStagePreviewSection({
  isPerforming,
  completedMoment,
  nhanVat,
  computedViewBox,
  garmentLayers,
  costumeName,
  colorName,
  tenNhomHoaVan,
  colorBadgeLabel,
  remixBadgeLabel,
  onOpenViSao,
  onFinishOutfit,
  onOpenCatGui,
  onOpenAIAnd3D,
  onOpenLookbook,
  onOpenCompare,
  onOpenChoPhien,
}: OutfitStagePreviewSectionProps) {
  return (
    <section className="outfit-screen__preview-section">
      <div
        className={`outfit-screen__stage ${
          isPerforming ? "outfit-screen__stage--performing" : ""
        }`}
      >
        {isPerforming && (
          <div className="outfit-screen__firefly-trace" aria-hidden="true">
            <span className="outfit-screen__firefly-sparkle" />
          </div>
        )}

        <AvatarSVG
          nhanVat={nhanVat}
          customViewBox={computedViewBox}
          className="outfit-screen__avatar-svg"
          childrenDefs={<CulturalPatternsDefs />}
          childrenVayQuan={garmentLayers.childrenVayQuan}
          childrenAo={garmentLayers.childrenAo}
          childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
          childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
        />
      </div>

      <div className="outfit-screen__stage-meta">
        <span className="outfit-screen__stage-tag">
          {costumeName} · {colorName}
        </span>
        {tenNhomHoaVan && (
          <span className="outfit-screen__stage-badge">
            ✦ Hoa văn {tenNhomHoaVan}
          </span>
        )}
      </div>

      {/* CHỈ BÁO TINH GỌN */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-[420px] w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{colorBadgeLabel}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <span>✨</span>
          <span>{remixBadgeLabel}</span>
        </div>

        <button
          type="button"
          onClick={onOpenViSao}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--vang-chinh)] text-xs font-semibold hover:border-[var(--vang-chinh)] cursor-pointer transition"
        >
          <span>💡 Giải nghĩa</span>
        </button>
      </div>

      {/* NÚT THAO TÁC CHÍNH TRÊN SÂN KHẤU */}
      <div className="w-full max-w-[320px] space-y-2 mt-1">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onFinishOutfit}
            disabled={isPerforming}
            className="outfit-screen__finish-btn w-full h-10 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <span>✦ {domdom.s4.hoanTatBoNay}</span>
          </button>

          <button
            type="button"
            onClick={onOpenCatGui}
            className="outfit-screen__cat-gui-btn w-full h-10 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <span>🎒 {domdom.guiKyUc.nutCatVaoGui}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onOpenAIAnd3D}
            className="w-full h-9 px-2 rounded-xl inline-flex items-center justify-center gap-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">AI & 3D</span>
          </button>

          <button
            type="button"
            onClick={onOpenLookbook}
            className="w-full h-9 px-2 rounded-xl inline-flex items-center justify-center gap-1 bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-amber-500 text-[var(--nen-toi)] font-semibold text-xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Lookbook</span>
          </button>

          <button
            type="button"
            onClick={onOpenCompare}
            className="w-full h-9 px-2 rounded-xl inline-flex items-center justify-center gap-1 bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-emerald-500 text-[var(--nen-toi)] font-semibold text-xs transition cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">So sánh</span>
          </button>
        </div>
      </div>

      {completedMoment && !isPerforming && (
        <div className="outfit-screen__completed-toast flex items-center justify-between gap-2 max-w-[320px] w-full">
          <span className="font-semibold text-xs text-emerald-800 dark:text-emerald-300">
            ✨ {domdom.s4.chucMung}
          </span>
          {onOpenChoPhien && (
            <button
              type="button"
              onClick={onOpenChoPhien}
              className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              Đem ra Chợ Phiên →
            </button>
          )}
        </div>
      )}
    </section>
  );
}
