/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ThuDoAIScreen — Trung Tâm Thử Đồ AI Trên Ảnh Thật & Bóc Tách Di Sản 3D/AR
 */

import React, { useState, useMemo } from "react";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import VirtualTryOnModal from "../components/VirtualTryOnModal";
import DigitalHeritageInspectorModal, {
  HERITAGE_CRAFT_DB,
} from "../components/DigitalHeritageInspectorModal";
import AppFooter from "../components/AppFooter";
import { playFolkPluck, playSilkRustleSound } from "../lib/audio";
import {
  Camera,
  Layers,
  Sparkles,
  Palette,
  Shirt,
  ArrowRight,
} from "lucide-react";

interface ThuDoAIScreenProps {
  initialTrangPhucId?: string;
  onOpenStudio2D: (trangPhucId: string) => void;
  onOpenChoPhien?: () => void;
  onBackToCollection?: () => void;
}

const DEFAULT_COLOR_BY_COSTUME: Record<string, string> = {
  aodai: "m_do",
  ngu_than: "m_vang",
  ao_tac: "m_lam",
  ao_giao_linh: "m_do",
  tu_than: "m_nau",
  ba_ba: "m_luc",
  muong_vay: "m_trang",
  co_thai: "m_trang",
  mong_lanh: "m_cham",
  dao_do: "m_cham",
  tay_cham: "m_cham",
  lo_lo_hoa: "m_do",
  ha_nhi: "m_cham",
  pa_then: "m_do",
  ede_tho_cam: "m_den",
  bana_tho_cam: "m_den",
  caho_tho_cam: "m_trang",
  champa_tho_cam: "m_vang",
  sampot: "m_vang",
};

const FABRIC_OPTIONS = [
  "Lụa tơ tằm Vạn Phúc",
  "Gấm hoa văn Triều Nguyễn",
  "Lãnh Mỹ A Tân Châu",
  "Vải lanh vẽ sáp ong",
  "Thổ cẩm dệt tay truyền thống",
];

export default function ThuDoAIScreen({
  initialTrangPhucId = "aodai",
  onOpenStudio2D,
  onOpenChoPhien,
}: ThuDoAIScreenProps) {
  const [selectedId, setSelectedId] = useState<string>(initialTrangPhucId || "aodai");
  const [activeMode, setActiveMode] = useState<"try_on" | "inspector_3d">("try_on");
  const [selectedMauId, setSelectedMauId] = useState<string>(
    DEFAULT_COLOR_BY_COSTUME[initialTrangPhucId] || "m_do"
  );
  const [selectedFabric, setSelectedFabric] = useState<string>(
    HERITAGE_CRAFT_DB[initialTrangPhucId]?.material || FABRIC_OPTIONS[0]
  );

  const currentCostume = useMemo(
    () => trangPhuc.find((t) => t.id === selectedId) || trangPhuc[0],
    [selectedId]
  );

  const craftMeta = useMemo(
    () => HERITAGE_CRAFT_DB[currentCostume.id] || HERITAGE_CRAFT_DB.aodai,
    [currentCostume.id]
  );

  const handleSelectCostume = (tpId: string) => {
    playSilkRustleSound();
    setSelectedId(tpId);
    if (DEFAULT_COLOR_BY_COSTUME[tpId]) {
      setSelectedMauId(DEFAULT_COLOR_BY_COSTUME[tpId]);
    }
    if (HERITAGE_CRAFT_DB[tpId]?.material) {
      setSelectedFabric(HERITAGE_CRAFT_DB[tpId].material);
    }
  };

  return (
    <main className="thu-do-ai-screen min-h-screen text-[var(--nen-toi)] pb-16">
      <div className="w-full max-w-5xl mx-auto py-2.5 space-y-2.5">
        {/* 1. THANH TIÊU ĐỀ & CHUYỂN CHẾ ĐỘ GỌN GÀNG */}
        <header className="px-3.5 py-2.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="font-serif text-lg font-bold text-[var(--nen-toi)] m-0">
                Thử Đồ AI
              </h1>
              <span className="text-xs text-[var(--tro-tram)]">
                · {currentCostume.ten}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setActiveMode("try_on");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeMode === "try_on"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs"
                  : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-amber-500/50"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Ghép Ảnh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setActiveMode("inspector_3d");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeMode === "inspector_3d"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs"
                  : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-emerald-500/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bóc Tách 3D</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSilkRustleSound();
                onOpenStudio2D(currentCostume.id);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-emerald-500 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition cursor-pointer"
            >
              <span>Phối 2D</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* 2. THANH CHỌN TRANG PHỤC & MÀU SẮC TINH GỌN */}
        <section className="p-2.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-xs font-semibold text-[var(--tro-tram)] shrink-0 flex items-center gap-1 pr-1">
              <Shirt className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trang phục:</span>
            </span>
            {trangPhuc.map((tp) => {
              const isSelected = tp.id === currentCostume.id;
              return (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => handleSelectCostume(tp.id)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-emerald-500/40"
                  }`}
                >
                  {tp.ten}
                </button>
              );
            })}
          </div>

          {activeMode === "try_on" && (
            <div className="pt-1.5 border-t border-[var(--vien-the)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-[var(--tro-tram)] flex items-center gap-1 mr-0.5">
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  <span>Màu:</span>
                </span>
                {mauSac.map((m) => {
                  const isActiveColor = m.id === selectedMauId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        playFolkPluck();
                        setSelectedMauId(m.id);
                      }}
                      title={m.ten}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs transition cursor-pointer border ${
                        isActiveColor
                          ? "bg-amber-50 dark:bg-amber-950/70 border-amber-500 text-amber-950 dark:text-amber-200 font-semibold"
                          : "bg-[var(--nen-the-phu)] border-transparent text-[var(--tro-tram)] hover:text-[var(--nen-toi)]"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: m.hex }}
                      />
                      {isActiveColor && <span>{m.ten}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <select
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[var(--nen-toi)] cursor-pointer"
                  aria-label="Chọn chất liệu vải"
                >
                  {FABRIC_OPTIONS.map((fab) => (
                    <option key={fab} value={fab}>
                      {fab}
                    </option>
                  ))}
                  {!FABRIC_OPTIONS.includes(selectedFabric) && (
                    <option value={selectedFabric}>{selectedFabric}</option>
                  )}
                </select>
              </div>
            </div>
          )}
        </section>

        {/* 3. KHÔNG GIAN CHÍNH */}
        {activeMode === "try_on" ? (
          <VirtualTryOnModal
            isOpen={true}
            embedded={true}
            currentTrangPhuc={currentCostume}
            selectedMauId={selectedMauId}
            selectedPhuKienIds={craftMeta.phuKienIds}
            selectedFabricName={selectedFabric}
          />
        ) : (
          <DigitalHeritageInspectorModal
            isOpen={true}
            embedded={true}
            trangPhuc={currentCostume}
            onClose={() => {}}
            onOpenStudio={(tpId) => onOpenStudio2D(tpId)}
            onOpenTryOn={() => setActiveMode("try_on")}
            onOpenChoPhien={onOpenChoPhien}
          />
        )}
      </div>

      <AppFooter />
    </main>
  );
}
