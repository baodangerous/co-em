/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TRANG PHỤC THỔ CẨM CHĂM (CHAM GARMENT RENDERER)
 * Đặc trưng: áo dài chui đầu kín đáo (Aw Tah), thắt lưng Talei Ka-in, hoa văn tháp Chăm
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import {
  getAnatomicalLandmarks,
  buildFittedSleeves,
  buildTunicOverHipPath,
  buildFittedTubeSkirtPath,
} from "./anatomicalPaths";

export function renderChamGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtFill = "#1e1b4b";
  const sashFill = "#dc2626";

  // Váy trong (khan) ôm gọn dưới lớp áo dài Chăm, lộ ra thanh lịch ở phần cổ chân
  const skirtPath = buildFittedTubeSkirtPath(soDo, m.isMale ? 58 : 49, 745);

  const childrenVayQuan = (
    <g id="champa-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path
        d={skirtPath}
        fill={skirtFill}
        stroke="#0f172a"
        strokeWidth="1.2"
      />
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  // Áo dài Aw Tah phủ trùm lên váy ở vùng hông (hipExtra=2.5) và dài xuống gần cổ chân (Y=715)
  const tunicPath = buildTunicOverHipPath(soDo, 715, 2.5, 4, 12);

  const childrenAo = (
    <g id="champa-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo dài Chăm ôm chuẩn cánh tay */}
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

      {/* 2. Thân áo dài Chăm buông trùm kín hông xuống gần cổ chân */}
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

      {/* 3. Dải khăn vắt chéo ngực & Thắt lưng Talei Ka-in dệt thổ cẩm Mỹ Nghiệp */}
      <path
        d={`
          M ${200 - m.neckSeamX - 4} 156
          L ${200 - m.neckSeamX + 8} 156
          L ${200 + m.waistHalf} 284
          L ${200 + m.waistHalf - 12} 284
          Z
        `}
        fill="url(#hoa-van-champa)"
        stroke="#b45309"
        strokeWidth="0.9"
      />
      <rect
        x={200 - m.waistHalf - 1.5}
        y="280"
        width={(m.waistHalf + 1.5) * 2}
        height="10"
        fill={sashFill}
        stroke="#991b1b"
        strokeWidth="1"
        rx="2"
      />
      {/* Dải thắt lưng rủ bên hông */}
      <path
        d={`
          M ${200 + m.waistHalf - 10} 290
          L ${200 + m.waistHalf - 6} 410
          L ${200 + m.waistHalf + 2} 410
          L ${200 + m.waistHalf - 2} 290
          Z
        `}
        fill="url(#hoa-van-champa)"
        stroke="#991b1b"
        strokeWidth="0.9"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
