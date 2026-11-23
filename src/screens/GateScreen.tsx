/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GateScreen — Trang Chủ (Toàn Cảnh Làng Quê Sống Động & Cò Em)
 * - Khung cảnh sống: Làng quê truyền thống với luỹ tre, hoa cỏ và ngày đêm luân chuyển
 * - Vòng ngày đêm luân chuyển 300 giây (5 phút)
 * - Các nút thao tác tinh gọn, trực quan, nổi bật, dễ hiểu
 */

import React, { useState, useEffect } from "react";
import HeritageVillageScene from "../components/nature/HeritageVillageScene";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { initAudioOnFirstTouch } from "../lib/audio";
import { layThemeHienTai, THEME_CHANGE_EVENT } from "../lib/theme";
import { Compass, Palette, Camera, Store, ShieldCheck, ArrowUpRight } from "lucide-react";
import Tooltip from "../components/Tooltip";

type Props = {
  onEnter: () => void;
  onEnterQueNha?: () => void;
  onSkip?: () => void;
  onOpenChaoBan?: () => void;
  onOpenStudio?: () => void;
  onOpenThuDoAI?: () => void;
  onOpenChoPhien?: () => void;
  onOpenChat?: () => void;
  onOpenCharacter?: () => void;
};

export default function GateScreen({
  onEnter,
  onOpenStudio,
  onOpenThuDoAI,
  onOpenChoPhien,
}: Props) {
  const [isDark, setIsDark] = useState(() => layThemeHienTai() === "dark");

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      if (customEvent.detail?.theme) {
        setIsDark(customEvent.detail.theme === "dark");
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const handleEnterOutfits = () => {
    initAudioOnFirstTouch();
    onEnter();
  };

  const handleOpenStudio = () => {
    initAudioOnFirstTouch();
    if (onOpenStudio) onOpenStudio();
    else onEnter();
  };

  return (
    <main className="gate gate-screen min-h-screen text-[var(--chu-chinh)] flex flex-col items-center relative px-4 select-none pb-24">
      <style>{`
        .gate-screen {
          background: transparent;
        }
        html[data-theme="dark"] .gate-sun-element,
        html.theme-dark .gate-sun-element,
        html.dark .gate-sun-element,
        [data-theme="dark"] .gate-sun-element,
        .dark .gate-sun-element {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `}</style>

      {/* 1. TIÊU ĐỀ NGHỆ THUẬT: MẶT TRỜI BÌNH MINH + CHỮ CÒ EM THƯ PHÁP */}
      <header className="relative z-10 text-center w-full max-w-4xl mx-auto pt-3 sm:pt-5 md:pt-7 pb-1 flex flex-col items-center">
        <div className="relative flex flex-col items-center select-none w-full">
          {!isDark && (
            <div className="gate-sun-element relative -mb-5 sm:-mb-7 md:-mb-9 pointer-events-none flex items-center justify-center z-0">
              <div className="absolute w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full blur-3xl bg-amber-300/35" />
              <div className="absolute w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full blur-xl bg-orange-200/40" />
              <div
                className="absolute -inset-3 sm:-inset-4 rounded-full border border-amber-400/30 animate-pulse"
                style={{ animationDuration: "5s" }}
              />
              <div className="relative w-15 h-15 sm:w-19 sm:h-19 md:w-22 md:h-22 rounded-full bg-gradient-to-tr from-[#EA580C] via-[#F59E0B] to-[#FEF08A] shadow-[0_0_40px_rgba(245,158,11,0.5),_inset_0_0_14px_rgba(255,255,255,0.85)]" />
            </div>
          )}

          <div className="relative inline-flex flex-col items-center">
            <h1
              className="gate-hero-logo relative z-10 font-normal tracking-normal m-0 leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#2A1205] via-[#5C2409] to-[#8C3B10] dark:from-[#FFFBEB] dark:via-[#FDE68A] dark:to-[#F59E0B] drop-shadow-[0_6px_20px_rgba(36,16,5,0.2)] select-none"
              style={{
                fontFamily: "var(--font-thu-phap, 'Charm', cursive)",
                fontSize: "clamp(5.2rem, 11.5vw, 9.2rem)",
                padding: "0.06em 0.35em 0.12em",
                lineHeight: 1.08,
              }}
            >
              Cò Em
            </h1>

            <div className="relative z-10 mt-1 inline-flex items-center gap-2.5 px-3.5 py-1 rounded-xl bg-[var(--nen-the)]/85 backdrop-blur-md border border-[var(--vien-the)] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--xanh-chinh)]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[var(--chu-chinh)]">
                Việt Phục Remix
              </span>
              <span className="text-[var(--vien-the)]">·</span>
              <span className="text-xs font-medium text-[var(--chu-phu)]">
                Bảo Tàng Số & Xưởng Phối Cổ Phục
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SÂN KHẤU LINH VẬT CÒ EM & THANH TRẢI NGHIỆM NỔI BẬT */}
      <section className="relative z-10 w-full max-w-4xl px-2 sm:px-4 my-auto flex-1 flex flex-col items-center justify-center">
        <HeritageVillageScene onMascotClick={handleEnterOutfits} />

        {/* Thanh 4 Trải Nghiệm Chính: Thiết kế bắt mắt, có chiều sâu */}
        <div className="mt-3 w-full max-w-3xl p-2 rounded-2xl bg-[var(--nen-the)]/90 backdrop-blur-md border border-[var(--vien-the)] shadow-[var(--shadow-dock)] grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={handleEnterOutfits}
            className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border border-emerald-400/30"
          >
            <span className="flex items-center gap-2 truncate">
              <Compass className="w-4 h-4 text-emerald-200 shrink-0" />
              <span className="truncate">Bộ Sưu Tập</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </button>

          <button
            type="button"
            onClick={handleOpenStudio}
            className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-[var(--chu-chinh)] bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Palette className="w-4 h-4 text-[var(--xanh-chinh)] shrink-0" />
              <span className="truncate">Phối Đồ 2D</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--chu-phu)] group-hover:text-[var(--xanh-chinh)] transition-colors shrink-0" />
          </button>

          {onOpenThuDoAI && (
            <button
              type="button"
              onClick={() => {
                initAudioOnFirstTouch();
                onOpenThuDoAI();
              }}
              className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border border-amber-400/30"
            >
              <span className="flex items-center gap-2 truncate">
                <Camera className="w-4 h-4 text-amber-100 shrink-0" />
                <span className="truncate">Thử Đồ AI & 3D</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </button>
          )}

          {onOpenChoPhien && (
            <button
              type="button"
              onClick={() => {
                initAudioOnFirstTouch();
                onOpenChoPhien();
              }}
              className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-[var(--chu-chinh)] bg-[var(--nen-the-phu)] hover:bg-[var(--vang-nhe)] border border-[var(--vien-the)] hover:border-[var(--vang-chinh)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <Store className="w-4 h-4 text-[var(--vang-chinh)] shrink-0" />
                <span className="truncate">Chợ Phiên</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--chu-phu)] group-hover:text-[var(--vang-chinh)] transition-colors shrink-0" />
            </button>
          )}
        </div>
      </section>

      {/* 3. CHÂN TRANG DI SẢN TINH GỌN */}
      <footer className="relative z-10 flex items-center justify-between w-full max-w-4xl text-xs text-[var(--chu-phu)] pt-3 pb-2 border-t border-[var(--vien-the)] gap-2 mb-4">
        <Tooltip
          title="Tư liệu khảo cứu"
          content="Nguyên tắc phục dựng di sản"
          position="top"
        >
          <button
            type="button"
            onClick={() => openGiuChuanVanHoa()}
            className="inline-flex items-center gap-1.5 text-[var(--xanh-chinh)] hover:text-[var(--vang-chinh)] font-semibold transition-colors bg-transparent border-0 p-0 cursor-pointer text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Nguyên tắc khảo cứu di sản</span>
          </button>
        </Tooltip>

        <span className="text-xs font-medium opacity-80">
          Cò Em · Không gian Di sản Việt Phục
        </span>
      </footer>
    </main>
  );
}
