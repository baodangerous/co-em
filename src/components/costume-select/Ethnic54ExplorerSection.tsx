/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Ethnic54ExplorerSection — Module Tra cứu Sắc phục 54 Dân Tộc Việt Nam
 * Tách riêng từ CostumeSelectScreen để code gọn gàng, dễ mở rộng và tái sử dụng.
 */

import React from "react";
import {
  DAN_HSACH_HE_NGON_NGU,
  type DanToc54Item,
  type HeNgonNgu54,
} from "../../data/dan_toc_54";
import type { CulturalPassportData } from "../../data/le_hoi_di_san";
import { playFolkPluck } from "../../lib/audio";
import { MapPin, Palette, Search, Sparkles, Users, X } from "lucide-react";

interface Ethnic54ExplorerSectionProps {
  filteredDanTocList: DanToc54Item[];
  activeHeNgonNgu: "all" | HeNgonNgu54;
  onChangeHeNgonNgu: (he: "all" | HeNgonNgu54) => void;
  danTocQuery: string;
  onChangeDanTocQuery: (q: string) => void;
  searchQuery: string;
  selectedDanToc: DanToc54Item | null;
  selectedDanTocId: string | null;
  onSelectDanToc: (dt: DanToc54Item) => void;
  onClearSelectedDanToc: () => void;
  passportData: CulturalPassportData;
}

export default function Ethnic54ExplorerSection({
  filteredDanTocList,
  activeHeNgonNgu,
  onChangeHeNgonNgu,
  danTocQuery,
  onChangeDanTocQuery,
  searchQuery,
  selectedDanToc,
  selectedDanTocId,
  onSelectDanToc,
  onClearSelectedDanToc,
  passportData,
}: Ethnic54ExplorerSectionProps) {
  return (
    <section className="p-4 sm:p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--xanh-chinh)]" />
          <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--chu-chinh)] m-0">
            Tra Cứu Sắc Phục 54 Dân Tộc Việt Nam
          </h2>
        </div>

        {/* Ô tìm kiếm nhanh trong 54 dân tộc */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-3.5 h-3.5 text-[var(--chu-phu)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={danTocQuery}
            onChange={(e) => onChangeDanTocQuery(e.target.value)}
            placeholder="Tìm dân tộc (VD: H'Mông, Cơ Tu, Chăm...)"
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[var(--chu-chinh)] placeholder:text-[var(--chu-phu)]/60 focus:outline-none focus:border-[var(--xanh-chinh)]"
          />
          {danTocQuery && (
            <button
              type="button"
              onClick={() => onChangeDanTocQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--chu-phu)] hover:text-[var(--chu-chinh)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bộ lọc Hệ Ngôn Ngữ (đã lược bỏ con số tĩnh để gọn mắt) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {DAN_HSACH_HE_NGON_NGU.map((he) => {
          const isActive = activeHeNgonNgu === he.id;
          const cleanLabel = he.label.replace(/\s*\(\d+\)/g, "");
          return (
            <button
              key={he.id}
              type="button"
              onClick={() => {
                playFolkPluck();
                onChangeHeNgonNgu(he.id);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? "bg-[var(--xanh-chinh)] text-white shadow-2xs"
                  : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)]"
              }`}
            >
              {cleanLabel}
            </button>
          );
        })}
      </div>

      {/* Lưới 54 dân tộc */}
      {filteredDanTocList.length === 0 ? (
        <div className="py-6 text-center rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
          <p className="text-xs text-[var(--chu-phu)] mb-2">
            Không tìm thấy dân tộc khớp với từ khóa &ldquo;
            {danTocQuery || searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              onChangeDanTocQuery("");
              onChangeHeNgonNgu("all");
            }}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-[var(--xanh-chinh)] text-white cursor-pointer"
          >
            Hiện tất cả dân tộc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {filteredDanTocList.map((dt) => {
            const isSelected = selectedDanTocId === dt.id;
            const isStamped = Boolean(passportData.stamps[dt.id]);
            return (
              <button
                key={dt.id}
                type="button"
                onClick={() => onSelectDanToc(dt)}
                title={`Dân tộc ${dt.ten}${
                  dt.tenGoiKhac ? ` (${dt.tenGoiKhac})` : ""
                } — ${dt.diaBanChinh}`}
                className={`group flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-transparent shadow-xs scale-[1.02]"
                    : "bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-[var(--xanh-la)]"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 border border-black/15 dark:border-white/40"
                    style={{ backgroundColor: dt.mauChuDao[0] }}
                  />
                  <span className="text-xs font-semibold truncate">{dt.ten}</span>
                </div>
                {isSelected ? (
                  <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-bold text-white leading-none">
                    {dt.trangPhucIds.length} bộ
                  </span>
                ) : isStamped ? (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"
                    title="Đã đóng dấu trong Sổ Thông Hành"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {/* HỒ SƠ SẮC PHỤC KHI CHỌN 1 DÂN TỘC */}
      {selectedDanToc && (
        <div className="p-4 rounded-xl bg-[var(--nen-the-phu)] border-2 border-[var(--xanh-la)] space-y-3 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[var(--vien-the)]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold">
                Dân tộc {selectedDanToc.ten}
              </span>
              {selectedDanToc.tenGoiKhac && (
                <span className="text-xs text-[var(--chu-phu)]">
                  ({selectedDanToc.tenGoiKhac})
                </span>
              )}
              <div className="flex items-center gap-1 ml-1">
                {selectedDanToc.mauChuDao.map((hex, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-[var(--vien-the)]"
                    style={{ backgroundColor: hex }}
                    title={`Màu chủ đạo: ${hex}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onClearSelectedDanToc}
              className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-[var(--xanh-chinh)] text-xs font-semibold text-[var(--chu-chinh)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bỏ chọn dân tộc</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] space-y-1">
              <div className="font-semibold text-[var(--xanh-chinh)] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Hệ ngôn ngữ & Địa bàn</span>
              </div>
              <p className="text-[var(--chu-chinh)] font-medium m-0">
                Hệ {selectedDanToc.heNgonNgu} · {selectedDanToc.vungVanHoa}
              </p>
              <p className="text-[var(--chu-phu)] m-0 leading-relaxed">
                {selectedDanToc.diaBanChinh}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] space-y-1">
              <div className="font-semibold text-[var(--vang-chinh)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đặc trưng sắc phục</span>
              </div>
              <p className="text-[var(--chu-chinh)] m-0 leading-relaxed">
                {selectedDanToc.dacTrungTrangPhuc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] space-y-1">
              <div className="font-semibold text-[var(--xanh-chinh)] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Chất liệu & Kỹ thuật</span>
              </div>
              <p className="text-[var(--chu-chinh)] m-0 leading-relaxed">
                {selectedDanToc.chatLieuKyThuat}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
