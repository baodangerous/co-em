/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ÁO CỎM VÁY THÁI (CO THAI GARMENT RENDERER)
 * Đặc trưng: áo ngắn ôm khít eo, cạp váy thổ cẩm, cúc bướm bạc (Mák Pém)
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";
import {
  getAnatomicalLandmarks,
  buildFittedSleeves,
  buildShortFittedBodicePath,
  buildFittedTubeSkirtPath,
} from "./anatomicalPaths";

export function renderCoThaiGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtFill = "#111827";
  const skirtPath = buildFittedTubeSkirtPath(soDo, m.isMale ? 58 : 48, 745);

  const childrenVayQuan = (
    <g id="cothai-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path
        d={skirtPath}
        fill={skirtFill}
        stroke="#030712"
        strokeWidth="1.2"
      />
      {/* Cạp váy dệt thổ cẩm Thái rực rỡ */}
      <rect
        x={200 - m.waistHalf - 1.5}
        y="279"
        width={(m.waistHalf + 1.5) * 2}
        height="14"
        fill="#b91c1c"
        stroke="#7f1d1d"
        strokeWidth="1"
        rx="2"
      />
      <line
        x1={200 - m.waistHalf}
        y1="286"
        x2={200 + m.waistHalf}
        y2="286"
        stroke="#facc15"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const bodicePath = buildShortFittedBodicePath(soDo, 285, 12);

  const childrenAo = (
    <g id="cothai-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo cóm trái & phải ôm khít cánh tay */}
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

      {/* 2. Thân áo cóm: ôm khít vòng eo */}
      <path
        d={bodicePath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.2"
      />

      {patternFill && (
        <path
          d={bodicePath}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 3. Hàng cúc bướm bạc (Mák Pém) tinh xảo */}
      <line
        x1="200"
        y1="160"
        x2="200"
        y2="282"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 166 + i * 22;
        return (
          <g key={i} transform={`translate(200, ${y})`}>
            <circle cx="-3" cy="0" r="2" fill="#f1f5f9" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="3" cy="0" r="2" fill="#f1f5f9" stroke="#64748b" strokeWidth="0.8" />
            <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#475569" strokeWidth="1" />
          </g>
        );
      })}
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
