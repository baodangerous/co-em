/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * LeHoiVanHoaScreen — Không Gian Lễ Hội & Sự Kiện Văn Hóa Việt Nam (Tách riêng tại Sidebar)
 * Thiết kế trực quan, giàu hình ảnh minh họa trang phục, tinh giản chữ:
 * - Chọn mùa lễ hội / sự kiện văn hóa trong năm
 * - Xem quy tắc mặc chuẩn văn hóa ngắn gọn, dễ nhìn
 * - Trải nghiệm ngay các bộ cổ phục & sắc phục dân tộc phù hợp với dịp lễ đó
 */

import { useState, useMemo, useEffect } from "react";
import {
  LE_HOI_VIET_NAM,
  docSoThongHanh,
  PASSPORT_CHANGE_EVENT,
  type LeHoiVanHoaItem,
  type CulturalPassportData,
} from "../data/le_hoi_di_san";
import { getAllManagedCostumes, ADMIN_DATA_CHANGE_EVENT } from "../lib/adminStore";
import { DAN_TOC_54, type DanToc54Item } from "../data/dan_toc_54";
import CostumeCardPreview from "../components/CostumeCardPreview";
import CulturalPassportModal from "../components/CulturalPassportModal";
import AppFooter from "../components/AppFooter";
import { playFolkPluck, playSilkRustleSound } from "../lib/audio";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Palette,
  Camera,
  BookOpen,
  Stamp,
  Sparkles,
} from "lucide-react";

interface LeHoiVanHoaScreenProps {
  onSelectTrangPhuc: (trangPhucId: string, directToS4?: boolean) => void;
  onOpenThuDoAI?: (trangPhucId?: string) => void;
  onOpenThamTu?: () => void;
  onBackToCollection?: () => void;
}

export default function LeHoiVanHoaScreen({
  onSelectTrangPhuc,
  onOpenThuDoAI,
  onOpenThamTu,
  onBackToCollection,
}: LeHoiVanHoaScreenProps) {
  const [selectedLeHoiId, setSelectedLeHoiId] = useState<string>(
    LE_HOI_VIET_NAM[0].id
  );
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [passportData, setPassportData] = useState<CulturalPassportData>(() =>
    docSoThongHanh()
  );
  const [allCostumes, setAllCostumes] = useState(() => getAllManagedCostumes());

  useEffect(() => {
    const syncPassport = () => setPassportData(docSoThongHanh());
    const syncCostumes = () => setAllCostumes(getAllManagedCostumes());
    window.addEventListener(PASSPORT_CHANGE_EVENT, syncPassport);
    window.addEventListener(ADMIN_DATA_CHANGE_EVENT, syncCostumes);
    return () => {
      window.removeEventListener(PASSPORT_CHANGE_EVENT, syncPassport);
      window.removeEventListener(ADMIN_DATA_CHANGE_EVENT, syncCostumes);
    };
  }, []);

  const selectedLeHoi: LeHoiVanHoaItem = useMemo(
    () =>
      LE_HOI_VIET_NAM.find((lh) => lh.id === selectedLeHoiId) ||
      LE_HOI_VIET_NAM[0],
    [selectedLeHoiId]
  );

  const matchingCostumes = useMemo(
    () =>
      allCostumes.filter((tp) => selectedLeHoi.trangPhucIds.includes(tp.id)),
    [allCostumes, selectedLeHoi]
  );

  const costumeToDanTocMap = useMemo(() => {
    const map: Record<string, DanToc54Item[]> = {};
    for (const dt of DAN_TOC_54) {
      for (const tpId of dt.trangPhucIds) {
        if (!map[tpId]) map[tpId] = [];
        map[tpId].push(dt);
      }
    }
    return map;
  }, []);

  const stampedCount = Object.keys(passportData.stamps).length;
  const rulesList: string[] = Array.isArray(selectedLeHoi.quyTacDanhSach)
    ? selectedLeHoi.quyTacDanhSach
    : [selectedLeHoi.quyTacMacChuan];

  return (
    <main className="min-h-screen bg-[var(--nen-bright)] text-[var(--chu-chinh)] pb-14 font-sans">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* 1. HEADER KHÔNG GIAN LỄ HỘI */}
        <header className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-600" />
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--vang-chinh)] mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Lịch Lễ Hội</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[var(--chu-chinh)] m-0">
              Lễ Hội Văn Hóa Việt Nam
            </h1>
            <p className="text-xs text-[var(--chu-phu)] mt-0.5 mb-0">
              Chọn mùa lễ để xem trang phục gợi ý & quy chuẩn mặc
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onBackToCollection && (
              <button
                type="button"
                onClick={onBackToCollection}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] border border-[var(--vien-the)] text-[var(--chu-chinh)] text-xs font-semibold transition cursor-pointer"
              >
                <span>Bộ Sưu Tập</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setShowPassportModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition cursor-pointer"
            >
              <Stamp className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Sổ Thông Hành</span>
              <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold leading-none">
                {stampedCount}/54
              </span>
            </button>
          </div>
        </header>

        {/* 2. DẢI THẺ CHỌN DỊP LỄ HỘI CÓ MINH HỌA TRANG PHỤC TRỰC QUAN */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {LE_HOI_VIET_NAM.map((lh) => {
            const isSelected = lh.id === selectedLeHoi.id;
            const previewCostumeId = lh.trangPhucIds[0] || "aodai";

            return (
              <div
                key={lh.id}
                onClick={() => {
                  playFolkPluck();
                  setSelectedLeHoiId(lh.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    playFolkPluck();
                    setSelectedLeHoiId(lh.id);
                  }
                }}
                className={`group relative flex items-center gap-3.5 p-3 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? "bg-[var(--nen-the)] border-2 border-[var(--vang-chinh)] shadow-md ring-2 ring-[var(--vang-chinh)]/20"
                    : "bg-[var(--nen-the)] hover:bg-[var(--nen-the-phu)] border-[var(--vien-the)] hover:border-[var(--vang-chinh)]/60"
                }`}
              >
                {/* Khung hình minh họa trang phục đại diện lễ hội */}
                <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 border border-[var(--vien-the)] bg-[var(--nen-the-phu)]">
                  <CostumeCardPreview
                    trangPhucId={previewCostumeId}
                    enableFlip={false}
                    className="!h-24 !rounded-xl pointer-events-none"
                  />
                </div>

                {/* Thông tin lễ hội tinh gọn */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--vang-chinh)]">
                    <span>{lh.thoiGian}</span>
                  </div>
                  <h2 className="font-serif text-sm sm:text-base font-bold text-[var(--chu-chinh)] group-hover:text-[var(--xanh-chinh)] m-0 leading-snug line-clamp-2">
                    {lh.ten}
                  </h2>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--chu-phu)] truncate">
                    <MapPin className="w-3 h-3 text-[var(--xanh-chinh)] shrink-0" />
                    <span className="truncate">{lh.khongGian}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* 3. BANNER CHI TIẾT LỄ HỘI ĐANG CHỌN & QUY TẮC MẶC CHUẨN VĂN HÓA */}
        <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--vien-the)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${selectedLeHoi.gradientClass} text-white text-xs font-bold`}
                >
                  {selectedLeHoi.thoiGian}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--chu-phu)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
                  <span>{selectedLeHoi.khongGian}</span>
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--chu-chinh)] m-0">
                {selectedLeHoi.ten}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--chu-phu)] m-0 leading-relaxed">
                {selectedLeHoi.moTaNgan}
              </p>
            </div>
          </div>

          {/* 3 Quy tắc mặc đúng chuẩn văn hóa */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[var(--xanh-chinh)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
              <span>Lưu ý & Quy tắc mặc chuẩn văn hóa trong dịp lễ:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {rulesList.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex items-start gap-2.5 text-xs text-[var(--chu-chinh)] leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-[var(--xanh-chinh)] shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LƯỚI TRANG PHỤC GỢI Ý CHO LỄ HỘI ĐANG CHỌN */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
              Trang phục truyền thống phù hợp cho {selectedLeHoi.tenViTat || selectedLeHoi.ten}
            </h3>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs font-semibold text-[var(--chu-phu)]">
              {matchingCostumes.length} trang phục gợi ý
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchingCostumes.map((item) => {
              const relatedDanToc = costumeToDanTocMap[item.id] || [];
              return (
                <article
                  key={item.id}
                  className="group flex flex-col bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] rounded-2xl shadow-[var(--shadow-the)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div
                    onClick={() => {
                      playSilkRustleSound();
                      onSelectTrangPhuc(item.id, true);
                    }}
                    className="relative cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--nen-the)]/90 backdrop-blur-xs border border-[var(--vien-the)] text-[11px] font-semibold text-[var(--chu-chinh)] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--vang-chinh)]" />
                      <span>{selectedLeHoi.tenViTat || selectedLeHoi.ten}</span>
                    </div>

                    <CostumeCardPreview
                      trangPhucId={item.id}
                      enableFlip={true}
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3 border-t border-[var(--vien-the)]/60">
                    <div>
                      <h4
                        onClick={() => {
                          playSilkRustleSound();
                          onSelectTrangPhuc(item.id, true);
                        }}
                        className="font-serif text-lg font-bold text-[var(--chu-chinh)] group-hover:text-[var(--xanh-chinh)] transition-colors cursor-pointer m-0 truncate"
                      >
                        {item.ten}
                      </h4>

                      <p className="text-xs text-[var(--chu-phu)] line-clamp-2 mt-1 mb-0 leading-relaxed">
                        {item.moTaNgan}
                      </p>

                      {relatedDanToc.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap mt-2.5">
                          <span className="text-[10px] font-semibold text-[var(--chu-phu)]">
                            Dân tộc:
                          </span>
                          {relatedDanToc.slice(0, 4).map((dt) => (
                            <span
                              key={dt.id}
                              className="px-2 py-0.5 rounded-md bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[10px] font-semibold text-[var(--chu-chinh)]"
                            >
                              {dt.ten}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-2.5 border-t border-[var(--vien-the)]">
                      <button
                        type="button"
                        onClick={() => {
                          playSilkRustleSound();
                          onSelectTrangPhuc(item.id, true);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Phối 2D</span>
                      </button>

                      {onOpenThuDoAI && (
                        <button
                          type="button"
                          onClick={() => {
                            playSilkRustleSound();
                            onOpenThuDoAI(item.id);
                          }}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-[var(--nen-the-phu)] hover:bg-[var(--vang-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--vang-chinh)] text-xs font-semibold transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
                          <span>AI & 3D</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          playFolkPluck();
                          onSelectTrangPhuc(item.id, false);
                        }}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] text-[var(--chu-chinh)] text-xs font-semibold transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
                        <span>Hồ sơ</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <AppFooter />

      <CulturalPassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        onSelectDanToc={(dt) => {
          const firstTpId = dt.trangPhucIds?.[0];
          if (firstTpId) {
            onSelectTrangPhuc(firstTpId, false);
          } else {
            onBackToCollection?.();
          }
        }}
        onOpenThamTu={onOpenThamTu}
      />
    </main>
  );
}
