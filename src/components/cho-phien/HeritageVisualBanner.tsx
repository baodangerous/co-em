/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HeritageVisualBanner — Khung hình minh họa trực quan trang phục Làng nghề & Workshop
 */

import React, { useMemo } from "react";
import { mauSac } from "../../data/mausac";
import { tinhSoDo, type NhanVatConfig } from "../../lib/avatar";
import type { CraftTheme } from "../../lib/adminStore";
import AvatarSVG from "../AvatarSVG";
import {
  renderGarmentLayers,
  CulturalPatternsDefs,
} from "../GarmentLayers";

export const SHOWCASE_AVATAR_FEMALE: NhanVatConfig = {
  tuoi: "nguoi_lon",
  gioi: "nu",
  vocDang: "trung_binh",
  tongDa: 2,
  toc: "bui_cao",
  huongNhin: "truoc",
};

/**
 * Minh họa nền nghệ thuật thủ công cho thẻ Làng Nghề & Workshop
 */
export function CraftBackdropArtwork({ theme }: { theme: CraftTheme }) {
  if (theme === "lua_gam") {
    return (
      <svg
        viewBox="0 0 400 200"
        className="absolute inset-0 w-full h-full object-cover opacity-85"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bg-lua" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF7ED" />
            <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FED7AA" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#bg-lua)" />
        <path
          d="M-20,140 C90,70 190,190 420,90 L420,200 L-20,200 Z"
          fill="#F59E0B"
          fillOpacity="0.16"
        />
        <path
          d="M-20,90 C110,160 240,30 420,130"
          fill="none"
          stroke="#D97706"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.35"
        />
        <g transform="translate(28, 42)" opacity="0.55">
          <ellipse
            cx="36"
            cy="24"
            rx="28"
            ry="12"
            fill="#B45309"
            fillOpacity="0.2"
            stroke="#B45309"
            strokeWidth="1.5"
          />
          <circle cx="36" cy="24" r="5" fill="#D97706" />
          <line
            x1="8"
            y1="54"
            x2="85"
            y2="54"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          <line
            x1="16"
            y1="66"
            x2="75"
            y2="66"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          <line
            x1="24"
            y1="78"
            x2="65"
            y2="78"
            stroke="#92400E"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    );
  }

  if (theme === "lanh_cham") {
    return (
      <svg
        viewBox="0 0 400 200"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bg-cham" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="55%" stopColor="#DBEAFE" />
            <stop offset="100%" stopColor="#C7D2FE" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#bg-cham)" />
        <g
          transform="translate(55, 68)"
          stroke="#1E3A8A"
          strokeWidth="1.8"
          fill="none"
          opacity="0.32"
        >
          <circle cx="0" cy="0" r="34" />
          <circle cx="0" cy="0" r="24" strokeDasharray="4 3" />
          <circle cx="0" cy="0" r="14" />
          <circle cx="0" cy="0" r="5" fill="#1E3A8A" />
        </g>
        <path
          d="M0,165 L40,140 L80,165 L120,140 L160,165 L200,140 L240,165 L280,140 L320,165 L360,140 L400,165"
          fill="none"
          stroke="#1D4ED8"
          strokeWidth="2"
          opacity="0.25"
        />
      </svg>
    );
  }

  if (theme === "theu_cung_dinh") {
    return (
      <svg
        viewBox="0 0 400 200"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bg-cungdinh" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF2F2" />
            <stop offset="50%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#bg-cungdinh)" />
        <g transform="translate(56, 72)" opacity="0.38">
          <circle
            cx="0"
            cy="0"
            r="38"
            fill="none"
            stroke="#B91C1C"
            strokeWidth="2.5"
          />
          <circle
            cx="0"
            cy="0"
            r="31"
            fill="none"
            stroke="#D97706"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <path
            d="M-18,0 Q0,-20 18,0 Q0,20 -18,0 Z"
            fill="#DC2626"
            fillOpacity="0.25"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    );
  }

  if (theme === "tho_cam") {
    return (
      <svg
        viewBox="0 0 400 200"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bg-thocam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF1F2" />
            <stop offset="50%" stopColor="#FFEDD5" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill="url(#bg-thocam)" />
        <g
          transform="translate(24, 34)"
          opacity="0.35"
          stroke="#9A3412"
          strokeWidth="1.8"
          fill="none"
        >
          <polygon points="32,0 64,28 32,56 0,28" />
          <polygon
            points="32,10 52,28 32,46 12,28"
            fill="#EA580C"
            fillOpacity="0.2"
          />
          <polygon points="32,68 56,90 32,112 8,90" />
        </g>
        <rect
          x="0"
          y="176"
          width="400"
          height="8"
          fill="#B91C1C"
          fillOpacity="0.2"
        />
        <rect
          x="0"
          y="186"
          width="400"
          height="6"
          fill="#1E293B"
          fillOpacity="0.2"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 400 200"
      className="absolute inset-0 w-full h-full object-cover opacity-90"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bg-non" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="55%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#bg-non)" />
      <g
        transform="translate(58, 74)"
        opacity="0.35"
        stroke="#047857"
        fill="none"
      >
        <circle cx="0" cy="0" r="40" strokeWidth="2" />
        <circle
          cx="0"
          cy="0"
          r="28"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <circle cx="0" cy="0" r="14" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export default function HeritageVisualBanner({
  costumeId,
  mauId,
  phuKienIds,
  theme,
  topLeftBadge,
  topRightBadge,
  bottomBadge,
  heightClass = "h-48",
}: {
  costumeId: string;
  mauId: string;
  phuKienIds: string[];
  theme: CraftTheme;
  topLeftBadge?: React.ReactNode;
  topRightBadge?: React.ReactNode;
  bottomBadge?: React.ReactNode;
  heightClass?: string;
}) {
  const soDo = useMemo(() => tinhSoDo(SHOWCASE_AVATAR_FEMALE), []);
  const mauObj = useMemo(
    () => mauSac.find((m) => m.id === mauId) || mauSac[0],
    [mauId]
  );
  const garmentLayers = useMemo(
    () =>
      renderGarmentLayers({
        trangPhucId: costumeId,
        soDo,
        mauHex: mauObj.hex,
        phuKienIds,
        huongNhin: "truoc",
      }),
    [costumeId, soDo, mauObj.hex, phuKienIds]
  );

  return (
    <div
      className={`relative w-full ${heightClass} rounded-xl border border-[var(--vien-the)] overflow-hidden flex items-center justify-center bg-amber-50/40 dark:bg-slate-900`}
    >
      <CraftBackdropArtwork theme={theme} />

      <svg
        viewBox="0 15 400 440"
        className="relative z-10 w-full h-full object-contain drop-shadow-xs"
        aria-hidden="true"
      >
        <AvatarSVG
          nhanVat={SHOWCASE_AVATAR_FEMALE}
          childrenDefs={<CulturalPatternsDefs />}
          childrenVayQuan={garmentLayers.childrenVayQuan}
          childrenAo={garmentLayers.childrenAo}
          childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
          childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
        />
      </svg>

      {topLeftBadge && (
        <div className="absolute top-2.5 left-2.5 z-20">{topLeftBadge}</div>
      )}
      {topRightBadge && (
        <div className="absolute top-2.5 right-2.5 z-20">{topRightBadge}</div>
      )}
      {bottomBadge && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2">
          {bottomBadge}
        </div>
      )}
    </div>
  );
}
