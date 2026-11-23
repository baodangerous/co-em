/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { StyleProfileInfo } from "../lib/styleProfile";
import { VungId } from "../data/vung";
import { Sparkles } from "lucide-react";

interface Props {
  profile: StyleProfileInfo;
  onSelectVung?: (vungId: VungId) => void;
  onSelectCostume?: (trangPhucId: string) => void;
}

export default function StyleProfileCard({
  profile,
  onSelectVung,
  onSelectCostume,
}: Props) {
  if (!profile.hienThiKhoi) {
    return null;
  }

  return (
    <aside
      className="my-3 p-3.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs transition-all"
      aria-label="Phong cách của bạn"
    >
      <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2 className="font-serif text-lg font-bold text-[var(--nen-toi)] m-0">
            Phong Cách Của Bạn
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-semibold">
            {profile.tongBoDaLuu} bộ đã lưu
          </span>
        </div>

        {profile.boDoLuuGanNhat && onSelectCostume && (
          <button
            type="button"
            onClick={() => onSelectCostume(profile.boDoLuuGanNhat!.id)}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Mở {profile.boDoLuuGanNhat.ten} →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2.5">
        <div className="p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
          <span className="text-xs text-[var(--tro-tram)] block">Tông màu</span>
          <p className="text-sm font-semibold text-[var(--nen-toi)] m-0">
            {profile.tongMauHayChon || (profile.mauNhieuNhat ? `Sắc ${profile.mauNhieuNhat}` : "Đa dạng")}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
          <span className="text-xs text-[var(--tro-tram)] block">Vùng yêu thích</span>
          <p className="text-sm font-semibold text-[var(--nen-toi)] m-0">
            {profile.vungQuanTamNhat
              ? `${profile.vungQuanTamNhat.ten} (${profile.vungQuanTamNhat.soBo})`
              : "Đa vùng miền"}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
          <span className="text-xs text-[var(--tro-tram)] block">Xu hướng</span>
          <p className="text-sm font-semibold text-[var(--nen-toi)] m-0">
            {profile.nhanRemix || "Hài hòa"}
          </p>
        </div>
      </div>

      {profile.cauGoiYVung && (
        <div className="p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex items-center justify-between gap-2 text-xs">
          <span className="text-[var(--tro-tram)]">{profile.cauGoiYVung}</span>
          {profile.vungChuaThu.length > 0 && onSelectVung && (
            <button
              type="button"
              onClick={() => onSelectVung(profile.vungChuaThu[0].id)}
              className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 cursor-pointer"
            >
              Khám phá {profile.vungChuaThu[0].ten}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
