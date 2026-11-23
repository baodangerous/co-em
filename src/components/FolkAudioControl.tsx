/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ ĐIỀU KHIỂN ÂM THANH DÂN TỘC (FOLK AUDIO CONTROL)
 * - Tinh tế trên TopBar: Nút bật/tắt nhanh & bảng tuỳ chỉnh âm sắc dân gian
 * - Đàn Tranh, Sáo Trúc, T'rưng, Tiếng lụa, Tiếng bước guốc, Tiếng chim hót
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Music,
  Sliders,
  Sparkles,
  Bird,
  Footprints,
  Layers,
  Check,
} from "lucide-react";
import {
  isAudioEnabled,
  setAudioEnabled,
  getAudioVolume,
  setAudioVolume,
  getFolkInstrument,
  setFolkInstrument,
  isBirdAmbienceEnabled,
  setBirdAmbienceEnabled,
  playFolkPluck,
  playDanTranhGlissando,
  playSaoTrucMelody,
  playSilkRustleSound,
  playFootstepSound,
  playBirdChirpSound,
  EVENT_AUDIO_CHANGE,
  type FolkInstrumentType,
  initAudioOnFirstTouch,
} from "../lib/audio";
import Tooltip from "./Tooltip";

const INSTRUMENTS: Array<{
  id: FolkInstrumentType;
  name: string;
  sub: string;
  icon: string;
}> = [
  {
    id: "dan_tranh",
    name: "Đàn Tranh (16 dây)",
    sub: "Âm vang ngũ cung trong trẻo, thanh cao",
    icon: "🪕",
  },
  {
    id: "sao_truc",
    name: "Sáo Trúc đồng quê",
    sub: "Dìu dặt, luyến láy như làn gió mát bên rặng tre",
    icon: "🎋",
  },
  {
    id: "trung",
    name: "Đàn T'rưng Tây Nguyên",
    sub: "Gõ ống tre giòn giã, tươi vui núi rừng",
    icon: "🪵",
  },
];

export default function FolkAudioControl() {
  const [enabled, setEnabled] = useState(isAudioEnabled);
  const [volume, setVolume] = useState(getAudioVolume);
  const [instrument, setInstrument] = useState<FolkInstrumentType>(getFolkInstrument);
  const [birdAmbience, setBirdAmbience] = useState(isBirdAmbienceEnabled);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAudioEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        if (detail.enabled !== undefined) setEnabled(detail.enabled);
        if (detail.volume !== undefined) setVolume(detail.volume);
        if (detail.instrument !== undefined) setInstrument(detail.instrument);
        if (detail.birdAmbience !== undefined) setBirdAmbience(detail.birdAmbience);
      } else {
        setEnabled(isAudioEnabled());
        setVolume(getAudioVolume());
        setInstrument(getFolkInstrument());
        setBirdAmbience(isBirdAmbienceEnabled());
      }
    };

    window.addEventListener(EVENT_AUDIO_CHANGE, handleAudioEvent);
    return () => window.removeEventListener(EVENT_AUDIO_CHANGE, handleAudioEvent);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggleMaster = () => {
    initAudioOnFirstTouch();
    const next = !enabled;
    setEnabled(next);
    setAudioEnabled(next);
    if (next) {
      window.setTimeout(() => playFolkPluck(), 50);
    }
  };

  const handleChangeVolume = (newVal: number) => {
    setVolume(newVal);
    setAudioVolume(newVal);
  };

  const handleSelectInstrument = (inst: FolkInstrumentType) => {
    setInstrument(inst);
    setFolkInstrument(inst);
    window.setTimeout(() => playFolkPluck(), 30);
  };

  const handleToggleBirdAmbience = () => {
    const next = !birdAmbience;
    setBirdAmbience(next);
    setBirdAmbienceEnabled(next);
    if (next) {
      playBirdChirpSound();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <Tooltip
        title="Âm thanh dân tộc"
        content={
          enabled
            ? `Đang bật: ${
                instrument === "dan_tranh"
                  ? "Đàn Tranh"
                  : instrument === "sao_truc"
                  ? "Sáo Trúc"
                  : "Đàn T'rưng"
              } (${Math.round(volume * 100)}%)`
            : "Bấm để bật âm thanh nhạc cụ dân gian & tiếng vải lụa"
        }
        shortcut="Âm sắc"
        position="bottom"
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-9 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold font-sans border transition cursor-pointer whitespace-nowrap ${
            enabled
              ? "bg-[var(--vang-nhe)] hover:opacity-95 text-[var(--chu-chinh)] border-[var(--vang-chinh)]"
              : "bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-[var(--xanh-la)]"
          }`}
          aria-label="Cài đặt âm thanh nhạc cụ dân gian"
        >
          {enabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="hidden md:inline leading-none">
                {instrument === "dan_tranh" ? "Đàn Tranh" : instrument === "sao_truc" ? "Sáo Trúc" : "T'rưng"}
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[var(--chu-phu)] shrink-0" />
              <span className="hidden md:inline leading-none">Âm thanh</span>
            </>
          )}
        </button>
      </Tooltip>

      {/* Bảng tuỳ chỉnh âm sắc dân gian */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-300/40 dark:border-amber-500/30 text-slate-800 dark:text-slate-100 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🪕</span>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white font-serif text-sm">
                  Âm Sắc Việt Phục
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Nhạc cụ truyền thống & tiếng động chạm đồ
                </p>
              </div>
            </div>

            {/* Công tắc Bật/Tắt chính */}
            <button
              type="button"
              onClick={handleToggleMaster}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                enabled
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {enabled ? "Đang Bật" : "Đã Tắt"}
            </button>
          </div>

          {/* Chọn Nhạc cụ dân tộc xuyên suốt */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-amber-600" />
                Nhạc cụ dân gian xuyên suốt:
              </span>
            </div>

            <div className="space-y-1.5">
              {INSTRUMENTS.map((inst) => {
                const isSelected = instrument === inst.id;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => handleSelectInstrument(inst.id)}
                    className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? "bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-100 shadow-2xs font-semibold"
                        : "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{inst.icon}</span>
                      <div>
                        <div className="text-xs font-bold leading-tight">{inst.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {inst.sub}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Âm lượng thanh thoát */}
          <div className="mb-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                Âm lượng dịu êm:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={volume}
              onChange={(e) => handleChangeVolume(parseFloat(e.target.value))}
              disabled={!enabled}
              className="w-full accent-amber-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          {/* Tiếng chim hót Quê Nhà */}
          <div className="mb-3.5 flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50">
            <div className="flex items-center gap-2">
              <Bird className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="font-bold text-emerald-950 dark:text-emerald-200">
                  Tiếng chim hót quê nhà
                </p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  Ríu rít đồng quê khi ở bối cảnh Quê Nhà
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleBirdAmbience}
              disabled={!enabled}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                birdAmbience && enabled
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {birdAmbience && enabled ? "Bật" : "Tắt"}
            </button>
          </div>

          {/* Nghe thử nhanh các âm sắc */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Nghe thử mẫu âm thanh:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  initAudioOnFirstTouch();
                  playDanTranhGlissando();
                }}
                className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition cursor-pointer flex items-center justify-center gap-1"
              >
                <span>🪕</span> Vuốt Đàn Tranh
              </button>
              <button
                type="button"
                onClick={() => {
                  initAudioOnFirstTouch();
                  playSilkRustleSound();
                }}
                className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Layers className="w-3 h-3 text-amber-600" /> Tiếng Vải Lụa
              </button>
              <button
                type="button"
                onClick={() => {
                  initAudioOnFirstTouch();
                  playFootstepSound("guoc_moc");
                }}
                className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Footprints className="w-3 h-3 text-emerald-600" /> Bước Guốc Mộc
              </button>
              <button
                type="button"
                onClick={() => {
                  initAudioOnFirstTouch();
                  playBirdChirpSound();
                }}
                className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Bird className="w-3 h-3 text-sky-500" /> Chim Hót Ríu Rít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
