/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  X,
  Share2,
  Bookmark,
  Check,
  Download,
  Feather,
  ShieldCheck,
} from "lucide-react";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { MAU_NGU_HANH, kiemTraHaiHoaMauSac } from "../data/genzRemixData";
import { HoSo } from "../lib/hoSo";

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  footwearId: string;
  activeHoSo: HoSo;
  onSaveToGui?: () => void;
}

export default function LookbookModal({
  isOpen,
  onClose,
  trangPhucId,
  mauId,
  phuKienIds,
  footwearId,
  activeHoSo,
  onSaveToGui,
}: LookbookModalProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const currentTrangPhuc =
    trangPhuc.find((t) => t.id === trangPhucId) || trangPhuc[0];
  const currentColor = mauSac.find((m) => m.id === mauId) || mauSac[0];
  const colorNguHanh = MAU_NGU_HANH[mauId] || MAU_NGU_HANH["m_do"];
  const harmony = kiemTraHaiHoaMauSac(mauId, phuKienIds[0]);

  const footwearTitle =
    footwearId === "sneaker"
      ? "Sneaker trắng Gen Z"
      : footwearId === "hai_theu"
      ? "Hài thêu cung đình"
      : footwearId === "dep_da_co"
      ? "Dép da cổ truyền"
      : "Guốc mộc truyền thống";

  const accessoriesList =
    phuKienIds
      .map((id) => phuKien.find((p) => p.id === id)?.ten || id)
      .join(" · ") || "Nguyên bản tinh giản";

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const params = new URLSearchParams();
    params.set("screen", "s4");
    params.set("tp", trangPhucId);
    params.set("m", mauId);
    if (phuKienIds.length > 0) {
      params.set("pk", phuKienIds.join(","));
    }
    params.set("fw", footwearId);
    params.set("author", activeHoSo.tenHienThi);
    return `${origin}${pathname}?${params.toString()}`;
  };

  const getShareText = () => {
    return `✨ Lookbook Việt Phục: "${currentTrangPhuc.ten} — Sắc ${currentColor.ten}"\n🎨 Điểm Ngũ Hành: ${harmony.diemSo}/100 (${harmony.nhan})\n🌿 Thiết kế bởi: ${activeHoSo.tenHienThi}`;
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lookbook Việt Phục: ${currentTrangPhuc.ten}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleDownloadImage = () => {
    setIsExporting(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsExporting(false);
        return;
      }

      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1500);
      bgGrad.addColorStop(0, "#FBF9F5");
      bgGrad.addColorStop(1, "#F3EDE2");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 1500);

      ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, 1128, 1428);

      ctx.fillStyle = "#B45309";
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillText("VIỆT PHỤC REMIX · GEN Z HERITAGE", 70, 110);

      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 64px Georgia, serif";
      ctx.fillText(currentTrangPhuc.ten, 70, 190);

      ctx.fillStyle = "#64748B";
      ctx.font = "20px system-ui, sans-serif";
      ctx.fillText("BỘ SƯU TẬP DI SẢN 2026 · CÒ EM", 70, 230);

      const boxGrad = ctx.createLinearGradient(70, 290, 1130, 750);
      boxGrad.addColorStop(0, "#FFFFFF");
      boxGrad.addColorStop(1, "#FAFAF9");
      ctx.fillStyle = boxGrad;
      ctx.beginPath();
      ctx.roundRect(70, 290, 1060, 480, 24);
      ctx.fill();

      ctx.fillStyle = currentColor.hex;
      ctx.beginPath();
      ctx.arc(600, 520, 150, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.beginPath();
      ctx.arc(600, 520, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 26px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(currentColor.ten, 600, 515);
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillStyle = "#B45309";
      ctx.fillText(`Hành: ${colorNguHanh.hanh}`, 600, 545);
      ctx.textAlign = "left";

      ctx.fillStyle = "#1E293B";
      ctx.font = "24px Georgia, serif";
      ctx.fillText(`"${currentTrangPhuc.moTaNgan}"`, 70, 830);

      ctx.fillStyle = "#065F46";
      ctx.font = "bold 26px system-ui, sans-serif";
      ctx.fillText(`✦ ĐIỂM HÀI HÒA: ${harmony.diemSo} / 100 ĐIỂM`, 70, 930);

      ctx.fillStyle = "#64748B";
      ctx.font = "22px system-ui, sans-serif";
      ctx.fillText(`Thiết kế bởi: ${activeHoSo.tenHienThi}`, 70, 1395);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `VietPhuc_Lookbook_${currentTrangPhuc.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Fallback
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    if (onSaveToGui) {
      onSaveToGui();
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Thẻ Lookbook Việt phục"
    >
      <div className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-300/60 dark:border-amber-600/40 text-slate-800 dark:text-slate-100 p-5 sm:p-6 overflow-hidden max-h-[94vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer z-10"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="lookbook-magazine-card flex-1 overflow-y-auto p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-amber-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between custom-scrollbar">
          <div className="border-b border-amber-200/70 dark:border-slate-700 pb-3 mb-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-semibold text-amber-700 dark:text-amber-400 block">
                VIỆT PHỤC REMIX · GEN Z
              </span>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mt-0.5 mb-0">
                {currentTrangPhuc.ten}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">BỘ SƯU TẬP</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                2026 ✦ Di Sản
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-3">
            <p className="text-sm text-slate-600 dark:text-slate-300 m-0">
              "{currentTrangPhuc.moTaNgan}"
            </p>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 dark:from-slate-900/80 dark:to-slate-800/80 border border-amber-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl border-2 border-white shadow-md flex items-center justify-center text-white font-serif font-bold text-lg"
                  style={{ backgroundColor: currentColor.hex }}
                >
                  ✦
                </div>
                <div>
                  <span className="text-xs uppercase font-semibold text-amber-800 dark:text-amber-300 block">
                    Nếp Áo Chủ Đạo
                  </span>
                  <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white m-0">
                    Sắc {currentColor.ten}
                  </h4>
                  <span className="text-xs text-slate-500">
                    Ngũ hành: {colorNguHanh.hanh}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Hài hòa</span>
                <span className="font-serif text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {harmony.diemSo}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                <span className="text-xs text-amber-800 dark:text-amber-400 block font-semibold">
                  Phụ kiện:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {accessoriesList}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40">
                <span className="text-xs text-teal-800 dark:text-teal-400 block font-semibold">
                  Giày dép:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {footwearTitle}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-900 dark:text-emerald-200 font-semibold">
                  {harmony.nhan}
                </span>
              </div>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                Chuẩn di sản ✦
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Thiết kế: <strong className="font-semibold">{activeHoSo.tenHienThi}</strong>
              </span>
            </div>
            <span className="font-serif font-bold">Cò Em Di Sản</span>
          </div>
        </div>

        <div className="mt-3.5">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-full shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Đã chép!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Chia sẻ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-full shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isExporting ? "Đang xuất..." : "Tải ảnh"}</span>
            </button>

            {onSaveToGui && (
              <button
                type="button"
                onClick={handleSave}
                className="py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs rounded-full shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Đã cất!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-white" />
                    <span>Cất vào Gùi</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
