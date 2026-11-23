/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Vai } from "../types";
import { vai as allVaiList } from "../data/vai";
import { nguon } from "../data/nguon";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { taoGhiChuChoVai } from "../lib/ghiChuChatLieu";
import { ExternalLink } from "lucide-react";

interface Props {
  vai: Vai;
  onSelectVai?: (selected: Vai) => void;
  className?: string;
}

export default function GhiChuChatLieuCard({ vai, onSelectVai, className = "" }: Props) {
  const [ghiChuText, setGhiChuText] = useState<string>(() => vai.suThat.join(" "));

  useEffect(() => {
    let isCancelled = false;
    setGhiChuText(vai.suThat.join(" "));

    taoGhiChuChoVai(vai).then((res) => {
      if (!isCancelled) {
        setGhiChuText(res.text);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [vai.id]);

  const nguonItems = vai.nguonIds
    .map((id) => nguon.find((n) => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n));

  return (
    <aside
      className={`p-3.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xs transition-all ${className}`}
      aria-label="Chất liệu & Làng nghề"
    >
      <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-[var(--vien-the)]">
        <h3 className="font-serif text-lg font-bold text-[var(--nen-toi)] m-0">
          Chất Liệu & Làng Nghề
        </h3>
        <button
          type="button"
          onClick={() => openGiuChuanVanHoa(`Chất liệu: ${vai.ten}`)}
          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
        >
          Quy chuẩn →
        </button>
      </div>

      {/* Chọn nhanh 5 chất liệu */}
      <div className="flex flex-wrap gap-1.5 mb-2.5" role="tablist">
        {allVaiList.map((v) => {
          const isCurrent = v.id === vai.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVai && onSelectVai(v)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isCurrent
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border-[var(--vien-the)] hover:border-emerald-500/40"
              }`}
            >
              {v.ten}
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-[var(--nen-toi)]">{vai.ten}</span>
          <span className="text-xs text-[var(--tro-tram)]">· {vai.langNghe}</span>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            · {vai.kyThuat}
          </span>
        </div>

        <p className="text-sm text-[var(--nen-toi)] m-0">
          {ghiChuText}
        </p>

        {nguonItems.length > 0 && (
          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-[var(--tro-tram)]">Nguồn:</span>
            {nguonItems.map((n) => (
              <a
                key={n.id}
                href={n.url || "#"}
                target={n.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-emerald-500 text-xs font-semibold text-emerald-700 dark:text-emerald-400 no-underline"
                title={n.chuThich}
              >
                <span>{n.ten}</span>
                {n.url && <ExternalLink className="w-3 h-3 shrink-0" />}
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
