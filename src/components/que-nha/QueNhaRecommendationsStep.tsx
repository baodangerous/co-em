/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { domdom } from "../../copy/coem";
import { nhom } from "../../data/nhom";
import CostumeCardPreview from "../CostumeCardPreview";
import { GoiYPhanTichBoiCanh } from "../../lib/gemini";
import { GoiYQueNhaItem } from "../../lib/rules";
import {
  ArrowRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Palette,
  Shirt,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface QueNhaRecommendationsStepProps {
  currentDips: string[];
  camHungIds: string[];
  currentPhongCachs: string[];
  aiResult: GoiYPhanTichBoiCanh | null;
  tongQuanLoiKhuyen: string;
  topRecommendations: GoiYQueNhaItem[];
  onResetToStep1: () => void;
  onBackToStep3: () => void;
  onTryRecommendedCostume: (item: GoiYQueNhaItem) => void;
  onFinishToCollection: () => void;
}

export default function QueNhaRecommendationsStep({
  currentDips,
  camHungIds,
  currentPhongCachs,
  aiResult,
  tongQuanLoiKhuyen,
  topRecommendations,
  onResetToStep1,
  onBackToStep3,
  onTryRecommendedCostume,
  onFinishToCollection,
}: QueNhaRecommendationsStepProps) {
  return (
    <section className="que-nha__card" aria-labelledby="cau-4-heading">
      <header className="que-nha__card-header">
        <div className="que-nha__question-row">
          <h1 id="cau-4-heading" className="que-nha__question">
            Gợi Ý Trang Phục Cho Bạn
          </h1>
          <button
            type="button"
            onClick={onResetToStep1}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Chọn lại</span>
          </button>
        </div>

        {/* Dải tóm tắt các lựa chọn của người dùng */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {currentDips.length > 0 ? (
            currentDips.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-400/50"
              >
                <Calendar size={12} />
                <span>
                  {domdom.queNha.cau1.danhSach[
                    d as keyof typeof domdom.queNha.cau1.danhSach
                  ] || d}
                </span>
              </span>
            ))
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
              <Calendar size={12} />
              <span>Mọi dịp tự do</span>
            </span>
          )}

          {camHungIds.length > 0 ? (
            camHungIds.map((id) => {
              const tenNhom = nhom.find((n) => n.id === id)?.ten || id;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-400/50"
                >
                  <MapPin size={12} />
                  <span>{tenNhom}</span>
                </span>
              );
            })
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-300">
              <MapPin size={12} />
              <span>Đa vùng miền</span>
            </span>
          )}

          {currentPhongCachs.length > 0 &&
            currentPhongCachs.map((pc) => (
              <span
                key={pc}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100/80 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 border border-purple-400/40"
              >
                <Palette size={12} />
                <span>
                  {domdom.queNha.cau3.danhSach[
                    pc as keyof typeof domdom.queNha.cau3.danhSach
                  ] || pc}
                </span>
              </span>
            ))}
        </div>

        {/* Hộp lời khuyên tổng quan từ Cò Em */}
        <div className="que-nha__subline mt-1" role="note">
          <span className="text-lg flex-shrink-0">🎋</span>
          <div className="space-y-1">
            <p className="m-0 font-medium text-sm">
              {aiResult ? aiResult.tongQuan : tongQuanLoiKhuyen.replace(/\*\*/g, "")}
            </p>
            {aiResult && (
              <p className="m-0 text-xs opacity-90">
                💡 <strong>Lưu ý văn hóa:</strong> {aiResult.luuYVanHoa}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* LƯỚI 6 TRANG PHỤC GỢI Ý HÀNG ĐẦU CÓ MINH HỌA TRỰC QUAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
        {topRecommendations.map((item, index) => (
          <article
            key={item.trangPhuc.id}
            className={`flex flex-col justify-between rounded-2xl border transition-all overflow-hidden bg-white dark:bg-slate-900/95 shadow-sm hover:shadow-md ${
              index === 0
                ? "border-2 border-amber-500 ring-2 ring-amber-400/30"
                : "border-stone-200 dark:border-slate-700/80 hover:border-amber-500/60"
            }`}
          >
            <div>
              {/* Minh họa trang phục trên mannequin */}
              <div
                onClick={() => onTryRecommendedCostume(item)}
                className="relative cursor-pointer overflow-hidden"
                title={`Thử phối ngay ${item.trangPhuc.ten}`}
              >
                <CostumeCardPreview trangPhucId={item.trangPhuc.id} />
                {index === 0 && (
                  <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Gợi ý số 1 cho bạn</span>
                  </span>
                )}
              </div>

              <div className="p-3.5">
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 m-0 mb-1">
                  {item.trangPhuc.ten}
                </h3>

                {/* Lý do vì sao hợp bối cảnh */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.lyDoGoiY.map((lyDo, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50"
                    >
                      ✓ {lyDo}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 m-0 mb-2.5 leading-relaxed">
                  {item.trangPhuc.moTaNgan}
                </p>

                {/* Gợi ý sắc màu & phụ kiện */}
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200/80 dark:border-slate-700 text-[11px] space-y-1">
                  <div className="text-slate-700 dark:text-slate-200">
                    <strong className="text-amber-800 dark:text-amber-300">
                      🎨 Phối sắc:
                    </strong>{" "}
                    {item.goiYPhoiMau}
                  </div>
                  <div className="text-slate-700 dark:text-slate-200">
                    <strong className="text-emerald-800 dark:text-emerald-300">
                      👒 Phụ kiện:
                    </strong>{" "}
                    {item.goiYPhuKien}
                  </div>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="p-3.5 pt-0">
              <button
                type="button"
                onClick={() => onTryRecommendedCostume(item)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shirt size={14} />
                <span>Phối Bộ Này</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <footer className="que-nha__actions">
        <button
          type="button"
          onClick={onBackToStep3}
          className="que-nha__btn que-nha__btn--sub"
        >
          <ChevronLeft size={16} />
          <span>Đổi phong cách</span>
        </button>
        <button
          type="button"
          onClick={onFinishToCollection}
          className="que-nha__btn que-nha__btn--pri"
        >
          <span>Khám phá Bộ Sưu Tập</span>
          <ArrowRight size={16} />
        </button>
      </footer>
    </section>
  );
}
