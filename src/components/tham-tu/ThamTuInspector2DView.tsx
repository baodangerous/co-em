/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { CaThamTuMoRong, VungKiemTraThamTu } from "../../data/tham_tu";
import { trangPhuc as trangPhucChinh } from "../../data/trangphuc";
import { phuKien } from "../../data/phukien";
import AvatarSVG from "../AvatarSVG";
import {
  CulturalPatternsDefs,
  renderGarmentLayers,
} from "../GarmentLayers";
import { NhanVatConfig, tinhSoDo } from "../../lib/avatar";
import { Check, X, Search, Shuffle } from "lucide-react";

export const OPTION_GAME_THEMES = [
  {
    letter: "A",
    accentBorder: "border-l-4 border-l-emerald-500",
    keycap: "bg-emerald-600 text-white shadow-xs",
    hover:
      "hover:border-emerald-500 hover:bg-emerald-500/10 hover:-translate-y-0.5 hover:shadow-md",
  },
  {
    letter: "B",
    accentBorder: "border-l-4 border-l-amber-500",
    keycap: "bg-amber-500 text-slate-950 shadow-xs",
    hover:
      "hover:border-amber-500 hover:bg-amber-500/10 hover:-translate-y-0.5 hover:shadow-md",
  },
  {
    letter: "C",
    accentBorder: "border-l-4 border-l-sky-500",
    keycap: "bg-sky-600 text-white shadow-xs",
    hover:
      "hover:border-sky-500 hover:bg-sky-500/10 hover:-translate-y-0.5 hover:shadow-md",
  },
  {
    letter: "D",
    accentBorder: "border-l-4 border-l-violet-500",
    keycap: "bg-violet-600 text-white shadow-xs",
    hover:
      "hover:border-violet-500 hover:bg-violet-500/10 hover:-translate-y-0.5 hover:shadow-md",
  },
];

export const DETECTIVE_ZONE_THEMES: Array<{
  zone: VungKiemTraThamTu;
  label: string;
  keycap: string;
  accent: string;
}> = [
  {
    zone: "headwear",
    label: "Lỗi Nón / Khăn",
    keycap: "1",
    accent:
      "border-l-4 border-l-amber-500 hover:border-amber-500 hover:bg-amber-500/10",
  },
  {
    zone: "garment",
    label: "Lỗi Phom Áo",
    keycap: "2",
    accent:
      "border-l-4 border-l-sky-500 hover:border-sky-500 hover:bg-sky-500/10",
  },
  {
    zone: "accessories",
    label: "Lỗi Phụ Kiện",
    keycap: "3",
    accent:
      "border-l-4 border-l-violet-500 hover:border-violet-500 hover:bg-violet-500/10",
  },
  {
    zone: "pattern",
    label: "Lỗi Họa Tiết",
    keycap: "4",
    accent:
      "border-l-4 border-l-rose-500 hover:border-rose-500 hover:bg-rose-500/10",
  },
];

export function Mannequin2DPreview({
  trangPhucId,
  mauHex,
  phuKienIds,
  gioi = "nu",
  toc = "bui_cao",
}: {
  trangPhucId: string;
  mauHex: string;
  phuKienIds: string[];
  gioi?: "nu" | "nam" | "trung_tinh";
  toc?: string;
}) {
  const nhanVat: NhanVatConfig = useMemo(
    () => ({
      tuoi: "nguoi_lon",
      gioi: gioi === "nam" ? "nam" : "nu",
      vocDang: "trung_binh",
      tongDa: 3,
      toc,
      huongNhin: "truoc",
    }),
    [gioi, toc]
  );

  const soDo = useMemo(() => tinhSoDo(nhanVat), [nhanVat]);

  const garmentLayers = useMemo(
    () =>
      renderGarmentLayers({
        trangPhucId,
        soDo,
        mauHex,
        phuKienIds,
        huongNhin: "truoc",
      }),
    [trangPhucId, soDo, mauHex, phuKienIds]
  );

  return (
    <AvatarSVG
      nhanVat={nhanVat}
      scalePreset="md"
      customViewBox="80 -65 240 780"
      className="w-full h-full drop-shadow-sm"
      childrenDefs={<CulturalPatternsDefs />}
      childrenVayQuan={garmentLayers.childrenVayQuan}
      childrenAo={garmentLayers.childrenAo}
      childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
      childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
    />
  );
}

interface ThamTuInspector2DViewProps {
  danhSachCaThamTu: CaThamTuMoRong[];
  currentIndex: number;
  solvedCaseIds: string[];
  selectedZone: VungKiemTraThamTu | null;
  isCorrectCase: boolean | null;
  casePointMessage: string | null;
  onSelectCaseIndex: (idx: number) => void;
  onShuffleCases: () => void;
  onSelectZone: (zone: VungKiemTraThamTu) => void;
  onNextCase: () => void;
}

export default function ThamTuInspector2DView({
  danhSachCaThamTu,
  currentIndex,
  solvedCaseIds,
  selectedZone,
  isCorrectCase,
  casePointMessage,
  onSelectCaseIndex,
  onShuffleCases,
  onSelectZone,
  onNextCase,
}: ThamTuInspector2DViewProps) {
  const currentCa = danhSachCaThamTu[currentIndex] || danhSachCaThamTu[0];
  const tp = trangPhucChinh.find(
    (t) => t.id === currentCa.boPhoi.trangPhucId
  );
  const pks = phuKien.filter((p) =>
    currentCa.boPhoi.phuKienIds.includes(p.id)
  );

  return (
    <div className="flex-1 flex flex-col gap-3.5">
      <div className="bg-[var(--nen-the)] px-3.5 py-2.5 rounded-2xl border border-[var(--vien-the)] shadow-[var(--shadow-the)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {danhSachCaThamTu.map((ca, idx) => {
            const isSolved = solvedCaseIds.includes(ca.id);
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={ca.id}
                type="button"
                onClick={() => onSelectCaseIndex(idx)}
                className={`py-1 px-2.5 rounded-lg font-semibold text-xs border transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-2xs"
                    : isSolved
                      ? "bg-[var(--xanh-nhe)] text-[var(--xanh-chinh)] border-[var(--xanh-la)]"
                      : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-[var(--xanh-la)]"
                }`}
              >
                <span>#{idx + 1}</span>
                {isSolved && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onShuffleCases}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] text-xs font-semibold text-[var(--chu-chinh)] cursor-pointer transition"
        >
          <Shuffle className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
          <span>Trộn ca</span>
        </button>
      </div>

      <div
        key={`${currentCa.id}-${currentIndex}`}
        className="tham-tu-question-enter grid grid-cols-1 lg:grid-cols-2 gap-4 items-start"
      >
        <div className="bg-[var(--nen-the)] rounded-2xl border border-[var(--vien-the)] shadow-[var(--shadow-the)] p-4 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="w-full flex justify-between items-center mb-2.5 text-xs font-bold">
            <span className="text-[var(--chu-chinh)]">
              {currentCa.tenCa}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[var(--xanh-nhe)] text-[var(--xanh-chinh)]">
              {currentCa.capDo} · +{currentCa.diemThuong}đ
            </span>
          </div>

          <div className="relative w-full h-[360px] flex items-center justify-center bg-gradient-to-b from-[var(--nen-the-phu)] to-[var(--nen-the)] rounded-xl border border-[var(--vien-the)] overflow-hidden p-3">
            <Mannequin2DPreview
              trangPhucId={currentCa.boPhoi.trangPhucId}
              mauHex={currentCa.mauHex || "#9E2A2B"}
              phuKienIds={currentCa.boPhoi.phuKienIds}
              gioi={currentCa.gioi || "nu"}
              toc={currentCa.toc || "bui_cao"}
            />

            <button
              type="button"
              onClick={() => onSelectZone("headwear")}
              className={`absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg border flex items-center gap-1 font-semibold text-xs shadow-xs transition cursor-pointer ${
                selectedZone === "headwear"
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-[var(--nen-the)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-amber-500"
              }`}
            >
              <Search className="w-3 h-3 text-amber-500" />
              <span>Nón / Khăn</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectZone("garment")}
              className={`absolute top-1/3 left-3 px-2.5 py-1 rounded-lg border flex items-center gap-1 font-semibold text-xs shadow-xs transition cursor-pointer ${
                selectedZone === "garment"
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-[var(--nen-the)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-sky-500"
              }`}
            >
              <Search className="w-3 h-3 text-sky-500" />
              <span>Phom Áo</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectZone("accessories")}
              className={`absolute top-1/2 right-3 px-2.5 py-1 rounded-lg border flex items-center gap-1 font-semibold text-xs shadow-xs transition cursor-pointer ${
                selectedZone === "accessories"
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-[var(--nen-the)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-violet-500"
              }`}
            >
              <Search className="w-3 h-3 text-violet-500" />
              <span>Phụ Kiện</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectZone("pattern")}
              className={`absolute bottom-5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg border flex items-center gap-1 font-semibold text-xs shadow-xs transition cursor-pointer ${
                selectedZone === "pattern"
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-[var(--nen-the)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-rose-500"
              }`}
            >
              <Search className="w-3 h-3 text-rose-500" />
              <span>Họa Tiết</span>
            </button>
          </div>
        </div>

        <div className="bg-[var(--nen-the)] rounded-2xl border border-[var(--vien-the)] shadow-[var(--shadow-the)] p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500" />
          <div>
            <div className="space-y-2 mb-4 text-xs text-[var(--chu-phu)] bg-gradient-to-br from-[var(--nen-the-phu)] to-[var(--nen-the)] p-4 rounded-2xl border-2 border-[var(--vien-the)]">
              <div className="flex justify-between">
                <span className="font-semibold text-[var(--chu-chinh)]">
                  Trang phục:
                </span>
                <span className="font-bold text-[var(--xanh-chinh)]">
                  {tp?.ten || currentCa.boPhoi.trangPhucId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[var(--chu-chinh)]">
                  Phụ kiện:
                </span>
                <span className="font-medium text-[var(--chu-chinh)]">
                  {pks.map((p) => p.ten).join(", ") || "Không có"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[var(--chu-chinh)]">
                  Họa tiết:
                </span>
                <span className="font-medium text-[var(--chu-chinh)]">
                  {currentCa.tenHoaTiet}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {DETECTIVE_ZONE_THEMES.map((item) => {
                const isPicked = selectedZone === item.zone;
                const isRightZone = currentCa.vungDung === item.zone;

                let btnClass = `bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border-[var(--vien-the)] ${item.accent} hover:-translate-y-0.5`;
                if (isPicked) {
                  btnClass = isRightZone
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md scale-[1.01]"
                    : "tham-tu-shake bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400 shadow-md";
                }

                return (
                  <button
                    key={item.zone}
                    type="button"
                    onClick={() => onSelectZone(item.zone)}
                    className={`p-3.5 rounded-xl border font-bold text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${btnClass}`}
                  >
                    <span>{item.label}</span>
                    {isPicked &&
                      (isRightZone ? (
                        <Check className="w-4 h-4 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 shrink-0" />
                      ))}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onSelectZone("all_good")}
                className={`col-span-2 p-3.5 rounded-xl border font-bold text-center text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedZone === "all_good"
                    ? currentCa.vungDung === "all_good"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md scale-[1.01]"
                      : "tham-tu-shake bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400 shadow-md"
                    : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border-[var(--vien-the)] border-l-4 border-l-emerald-500 hover:border-emerald-500 hover:bg-emerald-500/10 hover:-translate-y-0.5"
                }`}
              >
                <span>Bộ phối chuẩn văn hóa</span>
                {selectedZone === "all_good" &&
                  (currentCa.vungDung === "all_good" ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 shrink-0" />
                  ))}
              </button>
            </div>
          </div>

          {selectedZone && (
            <div
              className={`tham-tu-reveal-enter p-4 rounded-xl border ${
                isCorrectCase
                  ? "bg-[var(--xanh-nhe)] border-[var(--xanh-la)]"
                  : "bg-rose-500/10 border-rose-500/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  {isCorrectCase ? (
                    <Check className="w-4 h-4 text-[var(--xanh-chinh)] shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <h4 className="font-bold text-xs text-[var(--chu-chinh)] m-0">
                    {isCorrectCase ? "Chính xác!" : "Chưa chính xác"}
                  </h4>
                </div>
                {casePointMessage && (
                  <span className="tham-tu-score-pop text-xs font-extrabold text-[var(--xanh-chinh)]">
                    {casePointMessage}
                  </span>
                )}
              </div>

              {isCorrectCase && currentCa.loiSai && (
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                  {currentCa.loiSai}
                </div>
              )}

              <p className="text-xs text-[var(--chu-phu)] leading-relaxed m-0 mb-3">
                {isCorrectCase ? currentCa.lyDo : currentCa.goiYKhiSai}
              </p>

              {isCorrectCase && (
                <button
                  type="button"
                  onClick={onNextCase}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-xs transition cursor-pointer text-xs"
                >
                  Ca tiếp theo →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
