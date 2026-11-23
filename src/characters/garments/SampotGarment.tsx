/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TRANG PHỤC KHMER SAMPOT (SAMPOT GARMENT RENDERER)
 * Đặc trưng: vải quấn quanh hông, xếp nếp giữa bụng, dải khăn chéo vai (Sbai)
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

export function renderSampotGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const sampotGoldBorder = "#d97706";
  const skirtPath = buildFittedTubeSkirtPath(soDo, m.isMale ? 58 : 49, 695);

  const childrenVayQuan = (
    <g id="sampot-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-sampot-skirt">
          <path d={skirtPath} />
        </clipPath>
      </defs>

      {/* Sampot Khmer quấn hông, ôm trọn vùng hông buông xuống bắp chân */}
      <path
        d={skirtPath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      <g clipPath="url(#clip-sampot-skirt)">
        {/* Đường xếp nếp tinh tế chính giữa Sampot */}
        <path
          d="M 200 285 L 191 698 L 209 698 Z"
          fill="rgba(0,0,0,0.14)"
        />
        <line
          x1="200"
          y1="285"
          x2="200"
          y2="698"
          stroke={sampotGoldBorder}
          strokeWidth="1.5"
        />

        {/* Viền chỉ vàng và hoa văn sen ở gấu Sampot */}
        <rect
          x="120"
          y="678"
          width="160"
          height="16"
          fill="url(#hoa-van-khmer)"
          stroke={sampotGoldBorder}
          strokeWidth="1"
        />
      </g>

      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const bodicePath = buildShortFittedBodicePath(soDo, 287, 12);

  const childrenAo = (
    <g id="sampot-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo tầm vông ôm chuẩn cánh tay */}
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

      {/* 2. Thân áo ôm vừa chạm cạp thắt lưng */}
      <path
        d={bodicePath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {patternFill && (
        <path
          d={bodicePath}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 3. Dải khăn Sbai vắt chéo từ vai trái qua ngực xuống eo phải */}
      <path
        d={`
          M ${200 - m.neckSeamX - 10} 155
          L ${200 - m.neckSeamX + 8} 152
          L ${200 + m.waistHalf + 1} 284
          L ${200 + m.waistHalf - 14} 284
          Z
        `}
        fill="url(#hoa-van-khmer)"
        stroke={sampotGoldBorder}
        strokeWidth="1.2"
      />

      {/* 4. Thắt lưng kim loại vàng quấn eo */}
      <rect
        x={200 - m.waistHalf - 1.5}
        y="281"
        width={(m.waistHalf + 1.5) * 2}
        height="8"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="1"
        rx="2"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
