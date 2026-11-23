/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CostumeDetailScreen (S3) — Hồ Sơ Khảo Cứu & Trực Quan Trang Phục
 * Thiết kế 2 cột chuẩn triển lãm bảo tàng:
 * - Cột trái: Tranh minh họa trực quan (xoay Mặt trước / Mặt sau), bảng màu sắc phục, chất liệu & kỹ thuật chế tác
 * - Cột phải: Tư liệu khảo cứu văn hóa, đặc trưng dân tộc (54 dân tộc), điểm nhấn lịch sử & bộ sưu tập liên quan có hình ảnh
 */

import { useState, useMemo, useEffect } from "react";
import { domdom } from "../copy/coem";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";
import { nguon } from "../data/nguon";
import { DAN_TOC_54 } from "../data/dan_toc_54";
import {
  layLeHoiTheoTrangPhuc,
  dongDauTheoTrangPhuc,
  docSoThongHanh,
  PASSPORT_CHANGE_EVENT,
  type CulturalPassportData,
} from "../data/le_hoi_di_san";
import { HERITAGE_CRAFT_DB } from "../components/DigitalHeritageInspectorModal";
import CostumeCardPreview from "../components/CostumeCardPreview";
import CulturalPassportModal from "../components/CulturalPassportModal";
import MotTrangDoiModal from "../components/MotTrangDoiModal";
import AppFooter from "../components/AppFooter";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { playSilkRustleSound, playFolkPluck } from "../lib/audio";
import {
  ArrowLeft,
  Palette,
  Camera,
  BookOpen,
  History,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Users,
  Calendar,
  Stamp,
} from "lucide-react";

type Props = {
  trangPhucId: string;
  onBackToCostumes: () => void;
  onProceedToS4?: (trangPhucId: string) => void;
  onOpenThuDoAI?: (trangPhucId: string) => void;
  onSelectAnotherCostume?: (trangPhucId: string) => void;
  onOpenDongThoiGian?: () => void;
  onOpenThamTu?: () => void;
};

export default function CostumeDetailScreen({
  trangPhucId,
  onBackToCostumes,
  onProceedToS4,
  onOpenThuDoAI,
  onSelectAnotherCostume,
  onOpenDongThoiGian,
  onOpenThamTu,
}: Props) {
  const [showMotTrangDoi, setShowMotTrangDoi] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [passportData, setPassportData] = useState<CulturalPassportData>(() =>
    docSoThongHanh()
  );

  const item = useMemo(
    () => trangPhuc.find((tp) => tp.id === trangPhucId) ?? trangPhuc[0],
    [trangPhucId]
  );

  // Tự động đóng dấu Sổ Thông Hành khi mở hồ sơ trang phục
  useEffect(() => {
    dongDauTheoTrangPhuc(item.id, "ho_so");
    setPassportData(docSoThongHanh());
  }, [item.id]);

  useEffect(() => {
    const syncPassport = () => setPassportData(docSoThongHanh());
    window.addEventListener(PASSPORT_CHANGE_EVENT, syncPassport);
    return () => window.removeEventListener(PASSPORT_CHANGE_EVENT, syncPassport);
  }, []);

  const stampedCount = Object.keys(passportData.stamps).length;

  const matchingFestivals = useMemo(
    () => layLeHoiTheoTrangPhuc(item.id),
    [item.id]
  );

  const craftMeta = useMemo(
    () => HERITAGE_CRAFT_DB[item.id] || HERITAGE_CRAFT_DB.aodai,
    [item.id]
  );

  const nhomNames = useMemo(
    () =>
      item.nhomIds
        .map((id) => nhom.find((n) => n.id === id)?.ten ?? id)
        .join(", "),
    [item.nhomIds]
  );

  const nguonList = useMemo(
    () =>
      item.nguonIds
        .map((id) => nguon.find((ng) => ng.id === id))
        .filter(Boolean),
    [item.nguonIds]
  );

  // Các dân tộc trong 54 dân tộc Việt Nam gắn với trang phục này
  const relatedDanToc = useMemo(
    () => DAN_TOC_54.filter((dt) => dt.trangPhucIds.includes(item.id)),
    [item.id]
  );

  const primaryDanToc = relatedDanToc[0] || DAN_TOC_54[0];

  // Các trang phục liên quan cùng nhóm văn hóa hoặc cùng dân tộc (kèm hình minh họa)
  const relatedCostumes = useMemo(() => {
    const sameGroup = trangPhuc.filter(
      (tp) =>
        tp.id !== item.id &&
        (tp.nhomIds.some((nid) => item.nhomIds.includes(nid)) ||
          (primaryDanToc && primaryDanToc.trangPhucIds.includes(tp.id)))
    );
    if (sameGroup.length >= 3) return sameGroup.slice(0, 4);
    const others = trangPhuc.filter(
      (tp) => tp.id !== item.id && !sameGroup.some((s) => s.id === tp.id)
    );
    return [...sameGroup, ...others].slice(0, 4);
  }, [item.id, item.nhomIds, primaryDanToc]);

  const gioiTinhText =
    item.gioiTinh === "nu"
      ? domdom.s3.gioiTinhNu
      : item.gioiTinh === "nam"
      ? domdom.s3.gioiTinhNam
      : domdom.s3.gioiTinhChung;

  const mucRemixText =
    item.mucRemix === "tu_do"
      ? domdom.s3.remixTuDo
      : item.mucRemix === "co_dieu_kien"
      ? domdom.s3.remixCoDieuKien
      : domdom.s3.remixGiuNguyen;

  return (
    <main className="min-h-screen bg-[var(--nen-bright)] text-[var(--chu-chinh)] pb-14 font-sans">
      {/* Thanh điều hướng đầu trang */}
      <header className="sticky top-[56px] z-20 bg-[var(--nen-the)]/90 backdrop-blur-md border-b border-[var(--vien-the)] px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToCostumes}
              className="h-9 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] transition cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
              <span>{domdom.s3.veS2}</span>
            </button>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-[var(--chu-phu)] truncate">
                {domdom.s3.tieuDe} · {primaryDanToc ? `Dân tộc ${primaryDanToc.ten}` : nhomNames}
              </div>
              <h1 className="font-serif text-base sm:text-lg font-bold text-[var(--chu-chinh)] m-0 truncate">
                {item.ten}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setShowPassportModal(true);
              }}
              className="h-9 inline-flex items-center gap-1.5 px-3 rounded-xl bg-rose-600/10 hover:bg-rose-600/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition cursor-pointer"
              title="Đã đóng dấu dân tộc này vào Sổ Thông Hành"
            >
              <Stamp className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline">Sổ Thông Hành</span>
              <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold leading-none">
                {stampedCount}/54
              </span>
            </button>

            {onProceedToS4 && (
              <button
                type="button"
                onClick={() => {
                  playSilkRustleSound();
                  onProceedToS4(item.id);
                }}
                className="h-9 inline-flex items-center gap-1.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{domdom.s3.sangS4}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Nội dung chính: Bố cục 2 cột (Trực quan Hình ảnh + Hồ sơ Khảo cứu) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI (5/12): KHUNG HÌNH MINH HỌA TRANG PHỤC & CHẤT LIỆU */}
          <div className="lg:col-span-5 lg:sticky lg:top-[120px] space-y-4">
            <div className="rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] overflow-hidden">
              {/* Khung hình minh họa trang phục kích thước lớn, xoay Trước/Sau */}
              <div className="relative">
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--nen-the)]/90 backdrop-blur-xs border border-[var(--vien-the)] text-xs font-semibold text-[var(--chu-chinh)] shadow-2xs">
                    Dân tộc {primaryDanToc.ten}
                  </span>
                  {item.daKiemChung && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-[11px] font-semibold shadow-2xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{domdom.s3.daKiemChung}</span>
                    </span>
                  )}
                </div>

                <CostumeCardPreview
                  trangPhucId={item.id}
                  enableFlip={true}
                  className="!h-[360px] sm:!h-[410px]"
                />
              </div>

              {/* Bảng màu sắc phục & Chất liệu truyền thống */}
              <div className="p-4 border-t border-[var(--vien-the)] space-y-3 bg-[var(--nen-the)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[var(--chu-phu)]">
                    Bảng sắc độ truyền thống:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {primaryDanToc.mauChuDao.map((hex, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[11px] font-medium text-[var(--chu-chinh)]"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/15"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--vang-chinh)]">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Chất liệu & Kỹ thuật</span>
                  </div>
                  <p className="m-0 text-[var(--chu-chinh)] font-medium">
                    {craftMeta.material} · {craftMeta.technique}
                  </p>
                  <p className="m-0 text-[var(--chu-phu)] leading-relaxed">
                    Hoạ tiết đặc trưng: {craftMeta.motifMeaning}
                  </p>
                </div>

                {/* Cụm nút hành động trực quan ngay dưới ảnh */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {onProceedToS4 && (
                    <button
                      type="button"
                      onClick={() => {
                        playSilkRustleSound();
                        onProceedToS4(item.id);
                      }}
                      className="h-10 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                    >
                      <Palette className="w-4 h-4" />
                      <span>{domdom.s3.sangS4}</span>
                    </button>
                  )}

                  {onOpenThuDoAI && (
                    <button
                      type="button"
                      onClick={() => {
                        playSilkRustleSound();
                        onOpenThuDoAI(item.id);
                      }}
                      className="h-10 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[var(--nen-the-phu)] hover:bg-[var(--vang-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--vang-chinh)] text-xs font-semibold transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[var(--vang-chinh)]" />
                      <span>Thử đồ AI & 3D</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playFolkPluck();
                      setShowMotTrangDoi(true);
                    }}
                    className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] text-xs font-semibold transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
                    <span>{domdom.motTrangDoi.nutDocCauChuyen}</span>
                  </button>

                  {item.id === "aodai" && onOpenDongThoiGian && (
                    <button
                      type="button"
                      onClick={onOpenDongThoiGian}
                      className="h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[var(--vang-nhe)] text-[var(--chu-chinh)] border border-[var(--vang-chinh)] text-xs font-semibold transition cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
                      <span>{domdom.dongThoiGian.tieuDe}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (7/12): HỒ SƠ VĂN HÓA, ĐẶC TRƯNG DÂN TỘC & BỘ SƯU TẬP LIÊN QUAN */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. TỔNG QUAN & THÔNG SỐ TRANG PHỤC */}
            <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--xanh-chinh)] font-semibold">
                  <span>Hồ sơ Di sản Việt Phục</span>
                  <span>·</span>
                  <span>{primaryDanToc.vungVanHoa}</span>
                  {item.baoTon && (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{item.baoTon.muc || domdom.s2.nguyCap}</span>
                      </span>
                    </>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--chu-chinh)] m-0">
                  {item.ten}
                </h2>

                <p className="text-sm text-[var(--chu-chinh)] leading-relaxed m-0 pt-1">
                  {item.moTaNgan}
                </p>
              </div>

              {/* Lưới thông tin định danh */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--vien-the)] text-xs">
                <div className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
                  <div className="text-[var(--chu-phu)] font-medium mb-1">
                    {domdom.s2.nhomVung}
                  </div>
                  <div className="font-semibold text-[var(--chu-chinh)]">
                    {nhomNames}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
                  <div className="text-[var(--chu-phu)] font-medium mb-1">
                    {domdom.s3.gioiTinh}
                  </div>
                  <div className="font-semibold text-[var(--chu-chinh)]">
                    {gioiTinhText}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
                  <div className="text-[var(--chu-phu)] font-medium mb-1">
                    {domdom.s3.mucRemix}
                  </div>
                  <div className="font-semibold text-[var(--xanh-chinh)]">
                    {mucRemixText}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. ĐẶC TRƯNG SẮC PHỤC THEO DÂN TỘC (TỪ CƠ SỞ DỮ LIỆU 54 DÂN TỘC) */}
            {primaryDanToc && (
              <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--xanh-chinh)]" />
                    <span>Dân tộc {primaryDanToc.ten}</span>
                  </h3>
                  <span className="text-xs font-semibold text-[var(--chu-phu)]">
                    Hệ {primaryDanToc.heNgonNgu}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--chu-chinh)] leading-relaxed m-0">
                  {primaryDanToc.dacTrungTrangPhuc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] space-y-1">
                    <div className="font-semibold text-[var(--xanh-chinh)] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Địa bàn cư trú</span>
                    </div>
                    <p className="m-0 text-[var(--chu-phu)] leading-relaxed">
                      {primaryDanToc.diaBanChinh}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] space-y-1">
                    <div className="font-semibold text-[var(--vang-chinh)] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Chất liệu & Dệt</span>
                    </div>
                    <p className="m-0 text-[var(--chu-phu)] leading-relaxed">
                      {primaryDanToc.chatLieuKyThuat}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 3. ĐIỂM NHẤN VĂN HÓA & LỊCH SỬ */}
            <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3">
              <h3 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
                {domdom.s3.suThatVui}
              </h3>

              <ul className="m-0 p-0 list-none space-y-2.5">
                {item.suThat.map((fact, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs sm:text-sm text-[var(--chu-chinh)] leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-[var(--xanh-nhe)] text-[var(--xanh-chinh)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3B. DỊP LỄ HỘI & QUY TẮC MẶC CHUẨN VĂN HÓA */}
            {matchingFestivals.length > 0 && (
              <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--vang-chinh)]" />
                    <span>Dịp Lễ Hội & Sự Kiện Phù Hợp</span>
                  </h3>
                  <span className="text-xs font-semibold text-[var(--vang-chinh)]">
                    Quy tắc mặc chuẩn văn hóa
                  </span>
                </div>

                <div className="space-y-2.5">
                  {matchingFestivals.map((lh) => (
                    <div
                      key={lh.id}
                      className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="font-serif text-sm font-bold text-[var(--chu-chinh)]">
                          {lh.ten}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-[var(--vang-nhe)] text-[var(--vang-chinh)] text-[11px] font-semibold">
                          {lh.thoiGian}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--chu-phu)] m-0 leading-relaxed">
                        {lh.moTaNgan}
                      </p>
                      <div className="pt-1 space-y-1">
                        {lh.quyTacDanhSach.slice(0, 2).map((rule, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-xs text-[var(--chu-chinh)]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--xanh-chinh)] shrink-0 mt-0.5" />
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. TRANG PHỤC CÙNG NHÓM VĂN HÓA / DÂN TỘC (KÈM HÌNH ẢNH TRỰC QUAN) */}
            {relatedCostumes.length > 0 && (
              <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
                    Trang phục liên quan
                  </h3>
                  <button
                    type="button"
                    onClick={onBackToCostumes}
                    className="text-xs font-semibold text-[var(--xanh-chinh)] hover:underline cursor-pointer"
                  >
                    Xem tất cả ({trangPhuc.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedCostumes.map((rc) => (
                    <div
                      key={rc.id}
                      onClick={() => {
                        playSilkRustleSound();
                        if (onSelectAnotherCostume) {
                          onSelectAnotherCostume(rc.id);
                        } else if (onProceedToS4) {
                          onProceedToS4(rc.id);
                        }
                      }}
                      className="group rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      <CostumeCardPreview
                        trangPhucId={rc.id}
                        enableFlip={false}
                        className="!h-[155px] !rounded-t-xl"
                      />
                      <div className="p-2.5 border-t border-[var(--vien-the)]">
                        <div className="font-serif text-xs font-bold text-[var(--chu-chinh)] group-hover:text-[var(--xanh-chinh)] truncate">
                          {rc.ten}
                        </div>
                        <div className="text-[10px] text-[var(--chu-phu)] truncate mt-0.5">
                          Xem hồ sơ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. NGUỒN TƯ LIỆU KHẢO CỨU */}
            {nguonList.length > 0 && (
              <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3">
                <h3 className="font-serif text-base font-bold text-[var(--chu-chinh)] m-0">
                  {domdom.s3.nguonKhaoCuu}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nguonList.map((ng, i) => (
                    <div
                      key={i}
                      onClick={() => openGiuChuanVanHoa(item.ten)}
                      role="button"
                      tabIndex={0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] text-xs font-medium text-[var(--chu-chinh)] cursor-pointer transition"
                    >
                      <span>{ng?.ten}</span>
                      {ng?.url && (
                        <a
                          href={ng.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--xanh-chinh)] hover:opacity-80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Chân trang Giữ chuẩn văn hóa */}
      <AppFooter currentCostumeName={item.ten} />

      {/* Modal Một Trang Đời */}
      <MotTrangDoiModal
        trangPhucId={item.id}
        isOpen={showMotTrangDoi}
        onClose={() => setShowMotTrangDoi(false)}
      />

      {/* Modal Sổ Thông Hành Di Sản 54 Dân Tộc */}
      <CulturalPassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        onSelectDanToc={(dt) => {
          const firstTpId = dt.trangPhucIds?.[0];
          if (firstTpId && onSelectAnotherCostume) {
            onSelectAnotherCostume(firstTpId);
          } else {
            onBackToCostumes();
          }
        }}
        onOpenThamTu={onOpenThamTu}
      />
    </main>
  );
}
