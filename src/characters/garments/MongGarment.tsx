/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TRANG PHỤC H'MÔNG VÁY LANH (MONG GARMENT RENDERER)
 * Đặc trưng: dệt lanh sáp ong, váy xòe rộng xếp nếp nón cụt, tạp dề trước, xà cạp
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";
import {
  getAnatomicalLandmarks,
  buildFittedSleeves,
  buildShortFittedBodicePath,
  buildFlaredSkirtPath,
} from "./anatomicalPaths";

export function renderMongGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtFill = "#1e293b";
  const apronFill = "#0f172a";
  const skirtPath = buildFlaredSkirtPath(soDo, m.isMale ? 78 : 74, 728);

  const childrenVayQuan = (
    <g id="mong-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-mong-skirt">
          <path d={skirtPath} />
        </clipPath>
      </defs>

      {/* Váy lanh Mông xòe xếp ly rộng bao trọn hông */}
      <path
        d={skirtPath}
        fill={skirtFill}
        stroke="#0f172a"
        strokeWidth="1.2"
      />

      {/* Dải hoa văn thổ cẩm sáp ong viền gấu váy */}
      <g clipPath="url(#clip-mong-skirt)">
        <rect
          x="105"
          y="698"
          width="190"
          height="24"
          fill="url(#hoa-van-mong)"
          stroke="#b91c1c"
          strokeWidth="1"
        />
      </g>

      {/* Tạp dề trước (vải buông che trước bụng) */}
      <path
        d={`
          M ${200 - m.waistHalf * 0.55} 286
          L ${200 - m.waistHalf * 0.72} 695
          L ${200 + m.waistHalf * 0.72} 695
          L ${200 + m.waistHalf * 0.55} 286
          Z
        `}
        fill={apronFill}
        stroke="#334155"
        strokeWidth="1"
      />

      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const bodicePath = buildShortFittedBodicePath(soDo, 287, 18);

  const childrenAo = (
    <g id="mong-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-mong-left-sleeve">
          <path d={leftSleevePath} />
        </clipPath>
        <clipPath id="clip-mong-right-sleeve">
          <path d={rightSleevePath} />
        </clipPath>
      </defs>

      {/* Tay áo trái & phải ôm chuẩn cánh tay */}
      <path
        d={leftSleevePath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />
      <g clipPath="url(#clip-mong-left-sleeve)">
        <rect x="90" y="376" width="110" height="14" fill="#dc2626" />
      </g>

      <path
        d={rightSleevePath}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />
      <g clipPath="url(#clip-mong-right-sleeve)">
        <rect x="200" y="376" width="110" height="14" fill="#dc2626" />
      </g>

      {/* Thân áo Mông vạt đắp chéo cổ chữ V thêu thổ cẩm */}
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

      {/* Nẹp cổ thêu hoa văn sặc sỡ */}
      <path
        d={`
          M ${200 - m.neckSeamX} 148
          L 200 205
          L ${200 + m.neckSeamX} 148
        `}
        fill="none"
        stroke="#dc2626"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Thắt lưng vải đỏ to bản quấn eo */}
      <rect
        x={200 - m.waistHalf - 2}
        y="280"
        width={(m.waistHalf + 2) * 2}
        height="12"
        fill="#b91c1c"
        stroke="#7f1d1d"
        strokeWidth="1"
        rx="2"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
