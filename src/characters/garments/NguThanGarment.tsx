/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ÁO NGŨ THÂN LẬP LĨNH TAY CHẼN (NGU THAN GARMENT RENDERER)
 * Đặc trưng: 5 thân vải, cổ đứng cao, tay chẽn ôm vừa, vạt dài qua gối, cài 5 khuy cúc
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

export function renderNguThanGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const pantsFill = "#f5f0e6";
  const buttonFill = "#d9a441";
  const pantsPath = buildTraditionalPantsPath(soDo);

  const childrenVayQuan = (
    <g id="nguthan-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path
        d={pantsPath}
        fill={pantsFill}
        stroke="#d1c7b7"
        strokeWidth="1.2"
      />
      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const tunicPath = buildTunicOverHipPath(soDo, 635, 2, 5, 4);

  const childrenAo = (
    <g id="nguthan-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo chẽn trái & phải ôm chuẩn cánh tay */}
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

      {/* 2. Thân áo ngũ thân phủ trọn hông và buông qua gối */}
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

      {/* 3. Cổ đứng cao trang nghiêm (Cổ lập lĩnh) */}
      <path
        d={`
          M ${200 - m.neckSeamX} 148
          L ${200 - (m.neckSeamX - 1.5)} 134
          Q 200 136, ${200 + (m.neckSeamX - 1.5)} 134
          L ${200 + m.neckSeamX} 148
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.1"
      />

      {/* 4. Đường trung phùng & vạt đè chéo sang sườn phải + 5 khuy đồng */}
      <line x1="200" y1="148" x2="200" y2="635" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
      <path
        d={`
          M 200 144
          Q ${200 + 14} 154, ${200 + m.chestHalf - 6} 195
          L ${200 + m.waistHalf} 285
          L ${200 + m.hipHalf + 2} 630
        `}
        fill="none"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.2"
      />
      {[
        { x: 200, y: 144 },
        { x: 200 + 14, y: 158 },
        { x: 200 + m.chestHalf - 7, y: 194 },
        { x: 200 + m.waistHalf - 2, y: 240 },
        { x: 200 + m.waistHalf, y: 285 },
      ].map((btn, idx) => (
        <circle
          key={idx}
          cx={btn.x}
          cy={btn.y}
          r="2.6"
          fill={buttonFill}
          stroke="#92400e"
          strokeWidth="0.8"
        />
      ))}
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
