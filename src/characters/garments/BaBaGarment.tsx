/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ÁO BÀ BA NAM BỘ (BA BA GARMENT RENDERER)
 * Đặc trưng: dáng gọn cổ tròn, xẻ tà ngắn hai bên hông, 2 túi vuông trước bụng
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";
import {
  getAnatomicalLandmarks,
  buildFittedSleeves,
  buildTunicOverHipPath,
  buildTraditionalPantsPath,
} from "./anatomicalPaths";

export function renderBaBaGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const pantsFill = "#18181b";
  const pantsPath = buildTraditionalPantsPath(soDo);

  const childrenVayQuan = (
    <g id="baba-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path
        d={pantsPath}
        fill={pantsFill}
        stroke="#09090b"
        strokeWidth="1.2"
      />
      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const tunicPath = buildTunicOverHipPath(soDo, 382, 1.5, 2, 12);

  const childrenAo = (
    <g id="baba-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo bà ba trái & phải ôm chuẩn cánh tay */}
      <path
        d={leftSleevePath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />
      <path
        d={rightSleevePath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />

      {/* 2. Thân áo bà ba: ôm ngực, thắt eo và phủ trọn phần hông trên */}
      <path
        d={tunicPath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {patternFill && (
        <path
          d={tunicPath}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 3. Hàng cúc áo bà ba phía trước ngực */}
      <line
        x1="200"
        y1="160"
        x2="200"
        y2="382"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.2"
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const cy = 172 + i * 44;
        return (
          <circle
            key={i}
            cx="200"
            cy={cy}
            r="2.1"
            fill="#ffffff"
            stroke="#64748b"
            strokeWidth="0.8"
          />
        );
      })}

      {/* 4. Hai túi vuông nổi đặc trưng phía trước vạt áo */}
      <rect
        x={200 - m.waistHalf + 4}
        y="318"
        width="24"
        height="26"
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
        rx="2"
      />
      <rect
        x={200 + m.waistHalf - 28}
        y="318"
        width="24"
        height="26"
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
        rx="2"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
