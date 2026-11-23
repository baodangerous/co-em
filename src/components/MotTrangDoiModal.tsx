/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { TrangPhuc } from "../types";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";
import { nguon } from "../data/nguon";
import { domdom } from "../copy/coem";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { ExternalLink, ShieldCheck, X } from "lucide-react";

interface Props {
  trangPhucId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface GopYEntry {
  id: string;
  trangPhucId: string;
  tenTrangPhuc: string;
  noiDung: string;
  thoiGian: string;
}

const STORAGE_GOP_Y_KEY = "vpr:gop_y";

export default function MotTrangDoiModal({ trangPhucId, isOpen, onClose }: Props) {
  const item: TrangPhuc = useMemo(() => {
    return trangPhuc.find((t) => t.id === trangPhucId) ?? trangPhuc[0];
  }, [trangPhucId]);

  const nhomNames = useMemo(() => {
    return item.nhomIds
      .map((id) => nhom.find((n) => n.id === id)?.ten ?? id)
      .join(", ");
  }, [item]);

  const nguonItems = useMemo(() => {
    return item.nguonIds
      .map((id) => nguon.find((n) => n.id === id))
      .filter((n): n is NonNullable<typeof n> => Boolean(n));
  }, [item]);

  const [showGopY, setShowGopY] = useState<boolean>(false);
  const [gopYText, setGopYText] = useState<string>("");
  const [gopYSuccess, setGopYSuccess] = useState<boolean>(false);

  const handleGuiGopY = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = gopYText.trim();
    if (!trimmed) return;

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const existingRaw = window.localStorage.getItem(STORAGE_GOP_Y_KEY);
        const existing: GopYEntry[] = existingRaw ? JSON.parse(existingRaw) : [];

        const newEntry: GopYEntry = {
          id: `gopy_${Date.now()}`,
          trangPhucId: item.id,
          tenTrangPhuc: item.ten,
          noiDung: trimmed,
          thoiGian: new Date().toLocaleString("vi-VN"),
        };

        existing.unshift(newEntry);
        window.localStorage.setItem(STORAGE_GOP_Y_KEY, JSON.stringify(existing));
      }
      setGopYSuccess(true);
      setGopYText("");
      setTimeout(() => {
        setGopYSuccess(false);
        setShowGopY(false);
      }, 2000);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Tư liệu di sản — ${item.ten}`}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] p-5 text-[var(--nen-toi)] shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 pb-2.5 border-b border-[var(--vien-the)]">
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              {domdom.motTrangDoi.tieuDe} · {nhomNames}
            </span>
            <h1 className="font-serif text-lg font-bold text-[var(--nen-toi)] m-0 mt-0.5">
              {item.ten}
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[var(--tro-tram)] hover:text-rose-600 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Nội dung cốt lõi */}
        <div className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] space-y-2">
          <p className="text-sm font-semibold text-[var(--nen-toi)] m-0">
            {item.moTaNgan}
          </p>
          {item.suThat && item.suThat.length > 0 && (
            <ul className="space-y-1.5 m-0 pl-4 text-sm text-[var(--nen-toi)]">
              {item.suThat.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Dịp mặc */}
        <div>
          <span className="text-xs font-semibold text-[var(--tro-tram)] block mb-1.5">
            {domdom.s2.dipPhuHop}:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {item.dip.map((d) => (
              <span
                key={d}
                className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold"
              >
                {(domdom.s2.tenDip as Record<string, string>)[d] || d}
              </span>
            ))}
          </div>
        </div>

        {/* Nguồn khảo cứu ngắn gọn */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--tro-tram)]">
              {domdom.motTrangDoi.nguonKhaoCuu}:
            </span>
            <button
              type="button"
              onClick={() => openGiuChuanVanHoa(item.ten)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{domdom.giuChuanVanHoa.tieuDe}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {nguonItems.map((ng) => (
              <div
                key={ng.id}
                className="p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[var(--nen-toi)] truncate">
                    {ng.ten}
                  </div>
                  {ng.chuThich && (
                    <div className="text-xs text-[var(--tro-tram)] truncate">
                      {ng.chuThich}
                    </div>
                  )}
                </div>
                {ng.url && (
                  <a
                    href={ng.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold no-underline shrink-0"
                  >
                    <span>Tra cứu</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-2.5 border-t border-[var(--vien-the)] space-y-2">
          <div className="flex items-center justify-between gap-2">
            {!showGopY && (
              <button
                type="button"
                onClick={() => setShowGopY(true)}
                className="px-3 py-1.5 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)] text-xs font-semibold text-[var(--nen-toi)] cursor-pointer"
              >
                {domdom.motTrangDoi.baoGopY}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
            >
              {domdom.motTrangDoi.dongTrangSach}
            </button>
          </div>

          {showGopY && (
            <form onSubmit={handleGuiGopY} className="space-y-2">
              <textarea
                rows={2}
                value={gopYText}
                onChange={(e) => setGopYText(e.target.value)}
                placeholder={domdom.motTrangDoi.placeholderGopY}
                className="w-full p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-sm text-[var(--nen-toi)]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGopY(false)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--vien-the)] text-xs font-semibold cursor-pointer"
                >
                  {domdom.motTrangDoi.dongGopY}
                </button>
                <button
                  type="submit"
                  disabled={!gopYText.trim()}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {domdom.motTrangDoi.guiGopY}
                </button>
              </div>
            </form>
          )}

          {gopYSuccess && (
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              ✓ {domdom.motTrangDoi.camOnGopY}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
