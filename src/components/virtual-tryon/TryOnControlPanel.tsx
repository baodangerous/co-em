/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Sparkles,
  Check,
  Sliders,
  MoveVertical,
  MoveHorizontal,
  Maximize2,
  Crown,
  RotateCcw,
  ScanFace,
  AlertTriangle,
  Sun,
  Layers,
  RotateCw,
} from "lucide-react";
import { playFolkPluck } from "../../lib/audio";
import { BLEND_MODELS, BlendModelId } from "./portraitScanner";

interface TryOnControlPanelProps {
  blendModel: BlendModelId;
  onChangeBlendModel: (model: BlendModelId) => void;
  activeControlTab: "geometry" | "lighting";
  onChangeControlTab: (tab: "geometry" | "lighting") => void;
  offsetYPercent: number;
  onChangeOffsetY: (val: number) => void;
  offsetXPercent: number;
  onChangeOffsetX: (val: number) => void;
  scaleMultiplier: number;
  onChangeScale: (val: number) => void;
  rotationDeg: number;
  onChangeRotation: (val: number) => void;
  neckShadowIntensity: number;
  onChangeNeckShadow: (val: number) => void;
  photoBrightness: number;
  onChangeBrightness: (val: number) => void;
  photoContrast: number;
  onChangeContrast: (val: number) => void;
  garmentOpacity: number;
  onChangeGarmentOpacity: (val: number) => void;
  showKeypoints: boolean;
  onToggleKeypoints: () => void;
  showHeadwear: boolean;
  onToggleHeadwear: () => void;
  onResetFineTuning: () => void;
  onReScanTryOn: () => void;
  isProcessing: boolean;
  errorMsg: string | null;
}

export default function TryOnControlPanel({
  blendModel,
  onChangeBlendModel,
  activeControlTab,
  onChangeControlTab,
  offsetYPercent,
  onChangeOffsetY,
  offsetXPercent,
  onChangeOffsetX,
  scaleMultiplier,
  onChangeScale,
  rotationDeg,
  onChangeRotation,
  neckShadowIntensity,
  onChangeNeckShadow,
  photoBrightness,
  onChangeBrightness,
  photoContrast,
  onChangeContrast,
  garmentOpacity,
  onChangeGarmentOpacity,
  showKeypoints,
  onToggleKeypoints,
  showHeadwear,
  onToggleHeadwear,
  onResetFineTuning,
  onReScanTryOn,
  isProcessing,
  errorMsg,
}: TryOnControlPanelProps) {
  const activeModelMeta =
    BLEND_MODELS.find((m) => m.id === blendModel) || BLEND_MODELS[1];

  return (
    <div className="lg:col-span-5 flex flex-col gap-3">
      {/* 1. Chọn Mô hình ghép (Segmented 3 nút ngắn gọn) */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mô hình ghép</span>
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Ảnh đạt chuẩn</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {BLEND_MODELS.map((model) => {
            const isSelected = blendModel === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  playFolkPluck();
                  onChangeBlendModel(model.id);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition cursor-pointer text-center border ${
                  isSelected
                    ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400"
                }`}
              >
                {model.shortName}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
          {activeModelMeta.desc}
        </p>
      </div>

      {/* 2. Tinh chỉnh thông số (Vị trí & Cỡ | Ánh sáng) */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between gap-1.5">
          <div className="grid grid-cols-2 gap-1 bg-slate-200/70 dark:bg-slate-900 p-1 rounded-xl w-full">
            <button
              type="button"
              onClick={() => onChangeControlTab("geometry")}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-1 transition ${
                activeControlTab === "geometry"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>Vị trí & Cỡ</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeControlTab("lighting")}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-1 transition ${
                activeControlTab === "lighting"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Ánh sáng</span>
            </button>
          </div>
        </div>

        {activeControlTab === "geometry" ? (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="flex flex-col gap-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <MoveVertical className="w-3 h-3" /> Cổ áo
                </span>
                <span>{offsetYPercent > 0 ? `+${offsetYPercent}` : offsetYPercent}%</span>
              </span>
              <input
                type="range"
                min={-25}
                max={25}
                step={0.5}
                value={offsetYPercent}
                onChange={(e) => onChangeOffsetY(Number(e.target.value))}
                className="accent-amber-600 h-1.5 cursor-pointer"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Maximize2 className="w-3 h-3" /> Cỡ vai
                </span>
                <span>{Math.round(scaleMultiplier * 100)}%</span>
              </span>
              <input
                type="range"
                min={0.55}
                max={1.6}
                step={0.02}
                value={scaleMultiplier}
                onChange={(e) => onChangeScale(Number(e.target.value))}
                className="accent-amber-600 h-1.5 cursor-pointer"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <MoveHorizontal className="w-3 h-3" /> Dịch ngang
                </span>
                <span>{offsetXPercent > 0 ? `+${offsetXPercent}` : offsetXPercent}%</span>
              </span>
              <input
                type="range"
                min={-25}
                max={25}
                step={0.5}
                value={offsetXPercent}
                onChange={(e) => onChangeOffsetX(Number(e.target.value))}
                className="accent-amber-600 h-1.5 cursor-pointer"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <RotateCw className="w-3 h-3" /> Góc vai
                </span>
                <span>{rotationDeg > 0 ? `+${rotationDeg}` : rotationDeg}°</span>
              </span>
              <input
                type="range"
                min={-15}
                max={15}
                step={0.5}
                value={rotationDeg}
                onChange={(e) => onChangeRotation(Number(e.target.value))}
                className="accent-amber-600 h-1.5 cursor-pointer"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="flex flex-col gap-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="font-semibold">Bóng cổ áo</span>
                <span>{neckShadowIntensity}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={neckShadowIntensity}
                onChange={(e) => onChangeNeckShadow(Number(e.target.value))}
                className="accent-amber-600 h-1.5 cursor-pointer"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="font-semibold">Độ sáng</span>
                <span>{photoBrightness}%</span>
              </span>
              <input
                type="range"
                min={80}
                max={125}
                step={1}
                value={photoBrightness}
                onChange={(e) => onChangeBrightness(Number(e.target.value))}
                className="accent-amber-600 h-1.5 cursor-pointer"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="font-semibold">Tương phản</span>
                <span>{photoContrast}%</span>
              </span>
              <input
                type="range"
                min={85}
                max={125}
                step={1}
                value={photoContrast}
                onChange={(e) => onChangeContrast(Number(e.target.value))}
                className="accent-amber-600 h-1.5 cursor-pointer"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="font-semibold">Độ đậm vải</span>
                <span>{garmentOpacity}%</span>
              </span>
              <input
                type="range"
                min={75}
                max={100}
                step={1}
                value={garmentOpacity}
                onChange={(e) => onChangeGarmentOpacity(Number(e.target.value))}
                className="accent-amber-600 h-1.5 cursor-pointer"
              />
            </label>
          </div>
        )}

        {/* Dải nút bật/tắt nhanh */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-1.5 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleKeypoints}
              className={`px-2.5 py-1 rounded-lg font-semibold border cursor-pointer flex items-center gap-1 ${
                showKeypoints
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
              }`}
            >
              <ScanFace className="w-3.5 h-3.5" />
              <span>Khung AI</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                onToggleHeadwear();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold border cursor-pointer flex items-center gap-1 ${
                showHeadwear
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Nón/Khăn</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onResetFineTuning}
              className="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer inline-flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>

            <button
              type="button"
              onClick={onReScanTryOn}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 cursor-pointer inline-flex items-center gap-1 font-semibold disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              <span>Tự căn lại</span>
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
