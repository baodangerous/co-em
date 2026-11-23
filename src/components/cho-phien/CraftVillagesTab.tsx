/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CraftVillagesTab — Phân khu 2: Chợ Phiên Làng Nghề & Nghệ Nhân Di Sản
 */

import React, { useState, useMemo } from "react";
import {
  addVillageOrder,
  type CraftVillageItem,
} from "../../lib/adminStore";
import HeritageVisualBanner from "./HeritageVisualBanner";
import { ModalShell } from "../common/SharedUI";
import { playSilkRustleSound, playFolkPluck } from "../../lib/audio";
import { MapPin, Send } from "lucide-react";

interface CraftVillagesTabProps {
  villages: CraftVillageItem[];
  onShowToast: (msg: string) => void;
  onOpenStudioWithCostume?: (
    trangPhucId: string,
    mauId?: string,
    phuKienIds?: string[]
  ) => void;
}

export default function CraftVillagesTab({
  villages,
  onShowToast,
  onOpenStudioWithCostume,
}: CraftVillagesTabProps) {
  const [regionFilter, setRegionFilter] = useState<
    "all" | "bac" | "trung" | "nam"
  >("all");
  const [selectedVillageForOrder, setSelectedVillageForOrder] =
    useState<CraftVillageItem | null>(null);
  const [orderName, setOrderName] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const filteredVillages = useMemo(() => {
    if (regionFilter === "all") return villages;
    return villages.filter((v) => v.region === regionFilter);
  }, [villages, regionFilter]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVillageForOrder || !orderName.trim()) return;
    addVillageOrder({
      villageId: selectedVillageForOrder.id,
      villageName: selectedVillageForOrder.name,
      costumeName: selectedVillageForOrder.costumeName,
      customerName: orderName.trim(),
      customerPhone: orderName.trim(),
      note: orderNote.trim(),
    });
    playFolkPluck();
    onShowToast(
      `Đã gửi yêu cầu kết nối đặt may tới ${selectedVillageForOrder.name}!`
    );
    setSelectedVillageForOrder(null);
    setOrderName("");
    setOrderNote("");
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ["all", "Tất cả vùng miền"],
              ["bac", "Bắc Bộ"],
              ["trung", "Trung Bộ & Tây Nguyên"],
              ["nam", "Nam Bộ"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setRegionFilter(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                regionFilter === id
                  ? "bg-amber-600 text-white"
                  : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-[var(--vien-the)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVillages.map((village) => (
          <article
            key={village.id}
            className="p-3.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-amber-500/50 shadow-xs flex flex-col justify-between gap-3 transition"
          >
            <div className="space-y-2.5">
              <HeritageVisualBanner
                costumeId={village.costumeId}
                mauId={village.mauId}
                phuKienIds={village.phuKienIds}
                theme={village.theme}
                heightClass="h-52"
                topLeftBadge={
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/75 text-white text-xs font-medium backdrop-blur-xs">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{village.regionLabel}</span>
                  </span>
                }
                topRightBadge={
                  <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/85 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    {village.priceRange}
                  </span>
                }
                bottomBadge={
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-200 text-xs font-medium">
                    {village.costumeName}
                  </span>
                }
              />

              <div>
                <h2 className="font-serif text-lg font-bold text-[var(--nen-toi)] m-0">
                  {village.name}
                </h2>
                <p className="text-xs text-[var(--tro-tram)] m-0 mt-0.5 line-clamp-1">
                  {village.specialty} · {village.artisan}
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--vien-the)] flex items-center gap-2">
              {onOpenStudioWithCostume && (
                <button
                  type="button"
                  onClick={() => {
                    playSilkRustleSound();
                    onOpenStudioWithCostume(
                      village.costumeId,
                      village.mauId,
                      village.phuKienIds
                    );
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
                >
                  Mặc thử {village.costumeName}
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedVillageForOrder(village)}
                className="py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 text-amber-900 dark:text-amber-200 border border-amber-500/40 text-xs font-semibold transition cursor-pointer"
              >
                Đặt may
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* MODAL LIÊN HỆ ĐẶT MAY LÀNG NGHỀ */}
      <ModalShell
        isOpen={Boolean(selectedVillageForOrder)}
        onClose={() => setSelectedVillageForOrder(null)}
        title={`Kết nối ${selectedVillageForOrder?.name || ""}`}
        subtitle={
          selectedVillageForOrder
            ? `${selectedVillageForOrder.artisan} · ${selectedVillageForOrder.specialty}`
            : undefined
        }
      >
        <form onSubmit={handleSubmitOrder} className="space-y-3">
          <div className="space-y-2">
            <input
              type="text"
              required
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              placeholder="Tên hoặc số điện thoại liên hệ của bạn..."
              className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-sm text-[var(--nen-toi)]"
            />
            <textarea
              rows={3}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder={`Ghi chú nhu cầu đặt may ${selectedVillageForOrder?.costumeName || ""}, số đo...`}
              className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-sm text-[var(--nen-toi)]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedVillageForOrder(null)}
              className="px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] text-xs font-semibold cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi yêu cầu</span>
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}
