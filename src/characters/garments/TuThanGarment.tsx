/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ÁO TỨ THÂN YẾM ĐÀO (TU THAN GARMENT RENDERER)
 * Đặc trưng: yếm lụa trong, 4 thân ngoài, thắt vạt bụng, váy đụp đen
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import {
  getAnatomicalLandmarks,
  buildFittedSleeves,
  buildTunicOverHipPath,
  buildFlaredSkirtPath,
} from "./anatomicalPaths";

export function renderTuThanGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtFill = "#18181b";
  const yemFill = "#e11d48";
  const daiLietFill = "#d9a441";
  const skirtPath = buildFlaredSkirtPath(soDo, m.isMale ? 74 : 68, 738);

  const childrenVayQuan = (
    <g id="tuthan-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path
        d={skirtPath}
        fill={skirtFill}
        stroke="#09090b"
        strokeWidth="1.2"
      />
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const outerTunicPath = buildTunicOverHipPath(soDo, 610, 2, 5, 10);

  const childrenAo = (
    <g id="tuthan-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo trái & phải ôm chuẩn cánh tay */}
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

      {/* 2. Thân áo tứ thân bao trọn ngực, eo, hông */}
      <path
        d={outerTunicPath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.2"
      />

      {patternFill && (
        <path
          d={outerTunicPath}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 3. Yếm lụa đào bên trong cổ chữ V */}
      <path
        d={`
          M ${200 - m.neckSeamX} 148
          L 200 282
          L ${200 + m.neckSeamX} 148
          Q 200 156, ${200 - m.neckSeamX} 148
          Z
        `}
        fill={yemFill}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1"
      />

      {/* 4. Dải thắt lưng bao tượng & nút buộc vạt trước bụng */}
      <rect
        x={200 - m.waistHalf - 1.5}
        y="280"
        width={(m.waistHalf + 1.5) * 2}
        height="11"
        fill={daiLietFill}
        stroke="#b45309"
        strokeWidth="1"
        rx="2"
      />
      <path
        d={`
          M 200 291
          L 188 415
          L 196 418
          L 200 305
          L 204 418
          L 212 415
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
