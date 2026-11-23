/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ÁO YẾM LỤA ĐÀO & VÁY LĨNH KINH BẮC (YEM GARMENT RENDERER)
 * Đồng bộ 100% hệ tọa độ giải phẫu (AnatomicalLandmarks):
 * - Ôm chuẩn cổ (Y=148), bầu ngực (Y=210, chestHalf=48.5) và thắt eo (Y=285, waistHalf=37.5)
 * - Váy lĩnh đen bao trọn hoàn toàn đỉnh hông (Y=367, hipHalf=62.5), không lộ viền hông
 * - Phối dải thắt lưng lụa bao và họa tiết hoa sen cổ truyền
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { getAnatomicalLandmarks, buildFlaredSkirtPath } from "./anatomicalPaths";

export function renderYemGarment({
  soDo,
  mauHex,
  patternFill,
  huongNhin = "truoc",
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtFill = "#18181b";
  const yemColor = mauHex || "#DC2626";
  const sashColor = "#0D9488"; // Dải lụa xanh lý / ngọc bích Kinh Bắc
  const goldTrim = "#F59E0B";

  const skirtPath = buildFlaredSkirtPath(soDo, m.isMale ? 74 : 68, 742);
  const wHalf = m.waistHalf + 1;
  const cHalf = m.chestHalf - 1.5;

  // Đường dẫn thân Áo Yếm ôm khít ngực & eo ma-nơ-canh
  const yemBodicePath = `
    M ${200 - m.neckSeamX} 148
    C ${200 - (m.neckSeamX + 10)} 166, ${200 - (cHalf + 1)} 190, ${200 - cHalf} 212
    C ${200 - (cHalf - 1)} 238, ${200 - (wHalf + 2)} 262, ${200 - wHalf} 285
    Q 200 291, ${200 + wHalf} 285
    C ${200 + (wHalf + 2)} 262, ${200 + (cHalf - 1)} 238, ${200 + cHalf} 212
    C ${200 + (cHalf + 1)} 190, ${200 + (m.neckSeamX + 10)} 166, ${200 + m.neckSeamX} 148
    Q 200 156, ${200 - m.neckSeamX} 148
    Z
  `;

  const childrenVayQuan = (
    <g id="yem-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      {/* Váy lĩnh lụa đen bao trọn đỉnh hông và xòe mềm tới cổ chân */}
      <path
        d={skirtPath}
        fill={skirtFill}
        stroke="#09090b"
        strokeWidth="1.2"
      />
      {/* Nếp gấp lụa mềm mại trên thân váy lĩnh */}
      <path
        d={`
          M 182 292 L 166 738
          M 200 292 L 200 742
          M 218 292 L 234 738
        `}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.1"
        fill="none"
      />
      {/* Viền gấu váy lĩnh thêu chỉ vàng kim thanh nhã */}
      <path
        d={`M ${200 - (m.isMale ? 73 : 67)} 734 Q 200 742, ${200 + (m.isMale ? 73 : 67)} 734`}
        stroke="rgba(245, 158, 11, 0.35)"
        strokeWidth="2"
        fill="none"
      />
    </g>
  );

  const childrenAo =
    huongNhin === "sau" ? (
      <g id="yem-ao-sau" className="garment-transition">
        <style>{COMMON_GARMENT_STYLE}</style>
        {/* Dây yếm buộc sau gáy */}
        <path
          d={`
            M ${200 - m.neckSeamX} 148
            Q 200 154, ${200 + m.neckSeamX} 148
            M 200 151 L 194 188
            M 200 151 L 206 192
          `}
          fill="none"
          stroke={yemColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Dải yếm ôm ngang lưng dưới và thắt lưng lụa */}
        <path
          d={`
            M ${200 - cHalf + 4} 222
            Q 200 232, ${200 + cHalf - 4} 222
            L ${200 + wHalf} 285
            Q 200 290, ${200 - wHalf} 285
            Z
          `}
          fill={yemColor}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1.2"
        />
        <rect
          x={200 - wHalf - 1.5}
          y="279"
          width={(wHalf + 1.5) * 2}
          height="11"
          fill={sashColor}
          stroke="#0F766E"
          strokeWidth="1"
          rx="3"
        />
      </g>
    ) : (
      <g id="yem-ao" className="garment-transition">
        <style>{COMMON_GARMENT_STYLE}</style>

        {/* 1. Dây yếm quàng cổ thanh mảnh */}
        <path
          d={`
            M ${200 - m.neckSeamX + 1} 149
            Q 200 142, ${200 + m.neckSeamX - 1} 149
          `}
          fill="none"
          stroke={goldTrim}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* 2. Thân yếm đào ôm trọn khuôn ngực và thắt eo */}
        <path
          d={yemBodicePath}
          fill={yemColor}
          stroke="rgba(0,0,0,0.22)"
          strokeWidth="1.2"
        />

        {/* 3. Hoa văn phủ trên yếm nếu có */}
        {patternFill && (
          <path
            d={yemBodicePath}
            fill={patternFill}
            style={{ mixBlendMode: "screen" }}
          />
        )}

        {/* 4. Viền kim tuyến & họa tiết liên hoa thêu giữa ngực yếm */}
        <path
          d={`
            M ${200 - m.neckSeamX + 2} 152
            C ${200 - (m.neckSeamX + 8)} 168, ${200 - (cHalf - 4)} 190, ${200 - (cHalf - 4)} 212
            M ${200 + m.neckSeamX - 2} 152
            C ${200 + (m.neckSeamX + 8)} 168, ${200 + (cHalf - 4)} 190, ${200 + (cHalf - 4)} 212
          `}
          fill="none"
          stroke="rgba(253, 224, 71, 0.55)"
          strokeWidth="1.2"
          strokeDasharray="3 2"
        />
        <circle
          cx="200"
          cy="206"
          r="9"
          fill="none"
          stroke="rgba(253, 224, 71, 0.65)"
          strokeWidth="1.2"
        />
        <path
          d="M 200 199 L 203 206 L 200 213 L 197 206 Z"
          fill="rgba(253, 224, 71, 0.65)"
        />

        {/* 5. Dải thắt lưng bao (lụa xanh lý & viền hoàng kim) kèm dải buông mềm mại */}
        <rect
          x={200 - wHalf - 1.5}
          y="279"
          width={(wHalf + 1.5) * 2}
          height="11"
          fill={sashColor}
          stroke="#0F766E"
          strokeWidth="1"
          rx="3"
        />
        <line
          x1={200 - wHalf}
          y1="284.5"
          x2={200 + wHalf}
          y2="284.5"
          stroke="rgba(253, 224, 71, 0.6)"
          strokeWidth="1.2"
        />
        {/* Hai dải lụa đào & xanh lý buông rủ bên hông váy */}
        <path
          d={`
            M 186 290
            Q 179 345, 176 410
            L 184 412
            Q 187 348, 192 290
            Z
          `}
          fill={sashColor}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="0.9"
        />
        <path
          d={`
            M 193 290
            Q 190 342, 188 395
            L 195 397
            Q 197 345, 199 290
            Z
          `}
          fill={goldTrim}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="0.9"
        />
      </g>
    );

  return { childrenVayQuan, childrenAo };
}

