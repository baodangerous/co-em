/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TRANG PHỤC THỔ CẨM Ê ĐÊ (EDE GARMENT RENDERER)
 * Đặc trưng: áo chui đầu cổ thuyền/chữ U, váy tấm quấn thân, sọc chỉ đỏ vàng Tây Nguyên
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

export function renderEDeGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtFill = "#0f172a";
  const skirtPath = buildFittedTubeSkirtPath(soDo, m.isMale ? 58 : 48, 745);

  const childrenVayQuan = (
    <g id="ede-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-ede-skirt">
          <path d={skirtPath} />
        </clipPath>
      </defs>

      {/* Váy tấm Ê Đê quấn ôm thân, bao trọn hông buông dài xuống mắt cá */}
      <path
        d={skirtPath}
        fill={skirtFill}
        stroke="#020617"
        strokeWidth="1.2"
      />

      {/* Dải hoa văn thổ cẩm sọc chỉ đỏ vàng Tây Nguyên ở cạp và gấu váy */}
      <g clipPath="url(#clip-ede-skirt)">
        <rect
          x="120"
          y="718"
          width="160"
          height="20"
          fill="url(#hoa-van-ede)"
          stroke="#dc2626"
          strokeWidth="1"
        />
      </g>

      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const bodicePath = buildShortFittedBodicePath(soDo, 287, 14);

  const childrenAo = (
    <g id="ede-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-ede-bodice">
          <path d={bodicePath} />
        </clipPath>
      </defs>

      {/* 1. Tay áo trái & phải ôm chuẩn giải phẫu */}
      <path
        d={leftSleevePath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1"
      />
      <line
        x1={200 - m.wristOutX}
        y1="386"
        x2={200 - m.wristInX}
        y2="385"
        stroke="#ef4444"
        strokeWidth="2.8"
      />

      <path
        d={rightSleevePath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1"
      />
      <line
        x1={200 + m.wristInX}
        y1="385"
        x2={200 + m.wristOutX}
        y2="386"
        stroke="#ef4444"
        strokeWidth="2.8"
      />

      {/* 2. Thân áo chui đầu ôm khít ngực & eo */}
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

      {/* 3. Viền cổ thuyền đỏ & Dải thổ cẩm ngang ngực cắt gọn trong thân áo */}
      <g clipPath="url(#clip-ede-bodice)">
        <rect
          x="130"
          y="188"
          width="140"
          height="14"
          fill="url(#hoa-van-ede)"
          stroke="#dc2626"
          strokeWidth="0.9"
        />
        <rect
          x="130"
          y="279"
          width="140"
          height="7"
          fill="#dc2626"
        />
      </g>
      <path
        d={`M ${200 - m.neckSeamX} 148 Q 200 162, ${200 + m.neckSeamX} 148`}
        fill="none"
        stroke="#ef4444"
        strokeWidth="2.5"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
