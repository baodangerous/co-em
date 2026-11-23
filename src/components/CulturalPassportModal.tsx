/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CulturalPassportModal — Sổ Thông Hành Di Sản 54 Dân Tộc (Cultural Passport)
 * Hiển thị bộ sưu tập 54 Con Dấu Triện Son kết nối giữa Khám phá 54 dân tộc,
 * Xem Hồ sơ Trang phục và Giải đố Thám Tử Văn Hóa.
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  DAN_TOC_54,
  DAN_HSACH_HE_NGON_NGU,
  type DanToc54Item,
  type HeNgonNgu54,
} from "../data/dan_toc_54";
import {
  docSoThongHanh,
  dongDauDanToc,
  layDanhHieuSoThongHanh,
  PASSPORT_CHANGE_EVENT,
  type CulturalPassportData,
} from "../data/le_hoi_di_san";
import { playFolkPluck, playSilverBell } from "../lib/audio";
import {
  Award,
  CheckCircle2,
  Compass,
  Lock,
  MapPin,
  Sparkles,
  Stamp,
  Trophy,
  X,
} from "lucide-react";

interface CulturalPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDanToc?: (danToc: DanToc54Item) => void;
  onOpenThamTu?: () => void;
}

export default function CulturalPassportModal({
  isOpen,
  onClose,
  onSelectDanToc,
  onOpenThamTu,
}: CulturalPassportModalProps) {
  const [passport, setPassport] = useState<CulturalPassportData>(() =>
    docSoThongHanh()
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "stamped" | "unstamped">("all");
  const [activeHe, setActiveHe] = useState<"all" | HeNgonNgu54>("all");
  const [selectedStampDt, setSelectedStampDt] = useState<DanToc54Item | null>(null);
  const [justStampedId, setJustStampedId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setPassport(docSoThongHanh());
    window.addEventListener(PASSPORT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(PASSPORT_CHANGE_EVENT, sync);
  }, []);

  const stampedCount = useMemo(
    () => Object.keys(passport.stamps).length,
    [passport.stamps]
  );

  const rank = useMemo(
    () => layDanhHieuSoThongHanh(stampedCount),
    [stampedCount]
  );

  const filteredList = useMemo(() => {
    let list = DAN_TOC_54;
    if (activeHe !== "all") {
      list = list.filter((d) => d.heNgonNgu === activeHe);
    }
    if (filterStatus === "stamped") {
      list = list.filter((d) => Boolean(passport.stamps[d.id]));
    } else if (filterStatus === "unstamped") {
      list = list.filter((d) => !passport.stamps[d.id]);
    }
    return list;
  }, [activeHe, filterStatus, passport.stamps]);

  if (!isOpen) return null;

  const handleClickStampCard = (dt: DanToc54Item) => {
    const isAlreadyStamped = Boolean(passport.stamps[dt.id]);
    if (!isAlreadyStamped) {
      const res = dongDauDanToc(dt.id, "kham_pha");
      setPassport(res.data);
      setJustStampedId(dt.id);
      playSilverBell();
      window.setTimeout(() => setJustStampedId(null), 1600);
    } else {
      playFolkPluck();
    }
    setSelectedStampDt(dt);
  };

  const progressPct = Math.min(100, Math.round((stampedCount / 54) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="passport-modal-title"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-[var(--nen-the)] border-2 border-[var(--vien-the)] shadow-2xl overflow-hidden text-[var(--chu-chinh)] font-sans">
        {/* Dải viền thổ cẩm đầu sổ */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-600 shrink-0" />

        {/* HEADER SỔ THÔNG HÀNH */}
        <div className="p-4 sm:p-5 border-b border-[var(--vien-the)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--nen-the-phu)]/60 shrink-0">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 text-white flex flex-col items-center justify-center shadow-sm shrink-0">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Sổ Thông Hành Di Sản · Cultural Passport
                </span>
                <span className="text-xs text-[var(--chu-phu)]">·</span>
                <span className="text-xs font-semibold text-[var(--xanh-chinh)]">
                  Danh hiệu: {rank.danhHieu}
                </span>
              </div>
              <h2
                id="passport-modal-title"
                className="font-serif text-lg sm:text-xl font-bold text-[var(--chu-chinh)] m-0"
              >
                Bộ Sưu Tập 54 Con Dấu Sắc Phục Dân Tộc Việt Nam
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {onOpenThamTu && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenThamTu();
                }}
                className="h-9 inline-flex items-center gap-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Giải đố săn dấu</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-9 inline-flex items-center gap-1 px-3 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] text-xs font-semibold text-[var(--chu-chinh)] cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Đóng</span>
            </button>
          </div>
        </div>

        {/* THANH TIẾN ĐỘ & BỘ LỌC */}
        <div className="px-4 sm:px-5 py-3 border-b border-[var(--vien-the)] bg-[var(--nen-the)] space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-semibold text-[var(--chu-chinh)]">
                Đã đóng dấu: {stampedCount}/54 dân tộc ({progressPct}%)
              </span>
              <span className="text-[var(--chu-phu)] hidden md:inline">
                — {rank.moTa}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: "all", label: `Tất cả (54)` },
                  { id: "stamped", label: `Đã có dấu (${stampedCount})` },
                  { id: "unstamped", label: `Chưa mở (${54 - stampedCount})` },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    filterStatus === st.id
                      ? "bg-[var(--xanh-chinh)] text-white"
                      : "bg-[var(--nen-the-phu)] text-[var(--chu-phu)] border border-[var(--vien-the)] hover:text-[var(--chu-chinh)]"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-[var(--nen-the-phu)] border border-[var(--vien-the)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Lọc theo hệ ngôn ngữ */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {DAN_HSACH_HE_NGON_NGU.map((he) => (
              <button
                key={he.id}
                type="button"
                onClick={() => setActiveHe(he.id)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  activeHe === he.id
                    ? "bg-rose-600 text-white"
                    : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-rose-500/40"
                }`}
              >
                {he.label}
              </button>
            ))}
          </div>
        </div>

        {/* NỘI DUNG CUỘN: LƯỚI 54 CON DẤU TRIỆN SON + CHI TIẾT DÂN TỘC ĐANG CHỌN */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {selectedStampDt && (
            <div className="p-4 rounded-2xl bg-[var(--nen-the-phu)] border-2 border-rose-500/45 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã đóng dấu Triện Son</span>
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
                    Dân tộc {selectedStampDt.ten}
                  </h3>
                  <span className="text-xs text-[var(--chu-phu)]">
                    · Hệ {selectedStampDt.heNgonNgu} · {selectedStampDt.vungVanHoa}
                  </span>
                </div>
                <p className="text-xs text-[var(--chu-chinh)] leading-relaxed m-0">
                  {selectedStampDt.dacTrungTrangPhuc}
                </p>
                <p className="text-[11px] text-[var(--chu-phu)] m-0 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>Địa bàn: {selectedStampDt.diaBanChinh}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onSelectDanToc && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDanToc(selectedStampDt);
                      onClose();
                    }}
                    className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    Xem {selectedStampDt.trangPhucIds.length} bộ trang phục →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Lưới 54 ô đóng dấu */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {filteredList.map((dt) => {
              const stampInfo = passport.stamps[dt.id];
              const isStamped = Boolean(stampInfo);
              const isJustStamped = justStampedId === dt.id;
              const isSelected = selectedStampDt?.id === dt.id;

              return (
                <button
                  key={dt.id}
                  type="button"
                  onClick={() => handleClickStampCard(dt)}
                  className={`group relative p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between min-h-[104px] ${
                    isSelected
                      ? "ring-2 ring-rose-500 bg-[var(--nen-the-phu)] border-rose-500"
                      : isStamped
                      ? "bg-[var(--nen-the-phu)]/90 border-rose-500/35 hover:border-rose-500"
                      : "bg-[var(--nen-the-phu)]/35 border-dashed border-[var(--vien-the)] hover:border-[var(--xanh-la)] opacity-80 hover:opacity-100"
                  } ${isJustStamped ? "scale-105" : ""}`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 border border-black/15"
                      style={{ backgroundColor: dt.mauChuDao[0] }}
                    />
                    {isStamped ? (
                      <span
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-rose-600/60 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[10px] font-bold tracking-tight rotate-[-4deg]"
                        title={`Đã đóng dấu ngày ${stampInfo.stampedAt}`}
                      >
                        <Stamp className="w-2.5 h-2.5" />
                        <span>ĐÃ ẤN CHỨNG</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[var(--chu-phu)]">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Chạm để mở</span>
                      </span>
                    )}
                  </div>

                  <div className="my-1.5">
                    <div className="font-serif text-sm font-bold text-[var(--chu-chinh)] truncate">
                      {dt.ten}
                    </div>
                    <div className="text-[10px] text-[var(--chu-phu)] truncate">
                      {dt.heNgonNgu}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-[var(--vien-the)]/60">
                    <span className="text-[var(--chu-phu)] font-medium">
                      {dt.trangPhucIds.length} sắc phục
                    </span>
                    <span
                      className={`font-semibold ${
                        isStamped
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-[var(--xanh-chinh)]"
                      }`}
                    >
                      {isStamped ? "Xem →" : "+Đóng dấu"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FOOTER HƯỚNG DẪN */}
        <div className="px-4 sm:px-5 py-2.5 border-t border-[var(--vien-the)] bg-[var(--nen-the-phu)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--chu-phu)] shrink-0">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
            <span>
              Mẹo: Bấm vào bất kỳ ô dân tộc nào để đóng dấu khám phá hoặc trả lời đúng câu hỏi trong{" "}
              <strong className="text-[var(--chu-chinh)]">Thám Tử Văn Hóa</strong> để nhận dấu thưởng!
            </span>
          </div>
          <span className="font-semibold text-[var(--chu-chinh)]">
            {stampedCount}/54 Con Dấu Triện Son
          </span>
        </div>
      </div>
    </div>
  );
}
