/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * THANH TAB ĐIỀU KHIỂN PHỐI ĐỒ 2D (OUTFIT CONTROL TABS)
 * Rút gọn từ 9 tab xuống 5 nhóm trực quan, không chồng chéo:
 * 1. Màu & Chất vải
 * 2. Phụ kiện & Giày
 * 3. Hoa văn & Phong cách
 * 4. Nhân vật
 * 5. Gợi ý phối sẵn
 */

import React from "react";
import { OutfitTab } from "../types";

interface OutfitControlTabsProps {
  activeTab: OutfitTab;
  onSelectTab: (tab: OutfitTab) => void;
  className?: string;
}

export const OUTFIT_TABS: {
  id: OutfitTab;
  label: string;
}[] = [
  {
    id: "mau_sac",
    label: "1. Màu & Chất vải",
  },
  {
    id: "phu_kien",
    label: "2. Phụ kiện & Giày",
  },
  {
    id: "hoa_tiet",
    label: "3. Hoa văn & Kiểu",
  },
  {
    id: "gioi_tinh",
    label: "4. Nhân vật",
  },
  {
    id: "su_kien",
    label: "5. Gợi ý phối sẵn",
  },
];

export default function OutfitControlTabs({
  activeTab,
  onSelectTab,
  className = "",
}: OutfitControlTabsProps) {
  return (
    <div
      className={`outfit-control-tabs flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none ${className}`}
    >
      {OUTFIT_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs"
                : "border border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--nen-toi)] hover:border-emerald-500/40"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
