/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHỤ KIỆN THÂN MÌNH (BODY ACCESSORIES RENDERER)
 * - Vòng bạc / kiềng bạc
 * - Khăn rằn Nam Bộ
 * - Túi vải thổ cẩm / tote
 */

import { SoDoNhanVat } from "../types";
import { CroquisBodyType } from "../croquis/BodyPartLayering";

export function renderBodyAccessories(
  soDo: SoDoNhanVat,
  phuKienIds: string[],
  bodyType: CroquisBodyType = "adult"
) {
  const hasVongBac =
    phuKienIds.includes("vong_bac") ||
    phuKienIds.includes("kieng_bac") ||
    phuKienIds.includes("vong_co_bac");
  const hasKhanRan = phuKienIds.includes("khan_ran");
  const hasTote = phuKienIds.includes("tote");
  const hasTuiThoCam = phuKienIds.includes("tui_tho_cam");
  const hasQuatGiay = phuKienIds.includes("quat_giay");

  if (!hasVongBac && !hasKhanRan && !hasTote && !hasTuiThoCam && !hasQuatGiay) return null;

  const kNeckRingRadius = bodyType === "child" ? soDo.neckHalfWidth + 6 : soDo.neckHalfWidth + 9;
  const kNeckRingWidth = bodyType === "child" ? "2.6" : "3.2";
  const khanRanBottomY = bodyType === "child" ? soDo.hipY + 8 : soDo.hipY + 18;

  return (
    <g id="common-phu-kien-than" className={`body-acc-${bodyType}`}>
      {hasVongBac && (
        <g id="acc-kieng-bac">
          <path
            d={`M ${200 - kNeckRingRadius} ${soDo.neckY + 5} A ${kNeckRingRadius} 7.5 0 0 0 ${200 + kNeckRingRadius} ${soDo.neckY + 5}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={kNeckRingWidth}
            strokeLinecap="round"
          />
          <circle cx={200} cy={soDo.neckY + 13} r="2.2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
        </g>
      )}
      {hasKhanRan && (
        <path
          d={`
            M ${200 - soDo.neckHalfWidth - 4} ${soDo.neckY + 4}
            C ${200 - 16} ${soDo.shoulderY + 10}, ${200 - 18} ${soDo.waistY}, ${200 - 14} ${khanRanBottomY}
            L ${200 - 5} ${khanRanBottomY}
            L ${200 - 3} ${soDo.neckY + 8}
            L ${200 + 3} ${soDo.neckY + 8}
            L ${200 + 5} ${khanRanBottomY}
            L ${200 + 14} ${khanRanBottomY}
            C ${200 + 18} ${soDo.waistY}, ${200 + 16} ${soDo.shoulderY + 10}, ${200 + soDo.neckHalfWidth + 4} ${soDo.neckY + 4}
            Z
          `}
          fill="url(#hoa-van-kn)"
          stroke="#1e293b"
          strokeWidth="1.2"
        />
      )}
      {hasTuiThoCam && (
        <g id="common-tui-tho-cam">
          <line
            x1={200 - soDo.vai + 8}
            y1={soDo.shoulderY + 2}
            x2={200 + soDo.hong + 10}
            y2={soDo.hipY + 6}
            stroke="#991b1b"
            strokeWidth="2.4"
          />
          <rect
            x={200 + soDo.hong - 2}
            y={soDo.hipY + 4}
            width="28"
            height="32"
            fill="#b91c1c"
            stroke="#7f1d1d"
            strokeWidth="1.2"
            rx="4"
          />
          <line
            x1={200 + soDo.hong}
            y1={soDo.hipY + 14}
            x2={200 + soDo.hong + 24}
            y2={soDo.hipY + 14}
            stroke="#facc15"
            strokeWidth="2.2"
            strokeDasharray="3 2"
          />
          <line
            x1={200 + soDo.hong}
            y1={soDo.hipY + 24}
            x2={200 + soDo.hong + 24}
            y2={soDo.hipY + 24}
            stroke="#fde047"
            strokeWidth="1.5"
          />
        </g>
      )}
      {hasTote && !hasTuiThoCam && (
        <g id="common-tote-bag">
          <line
            x1={200 + soDo.vai - 6}
            y1={soDo.shoulderY + 4}
            x2={200 + soDo.hong + 14}
            y2={soDo.hipY + 8}
            stroke="#475569"
            strokeWidth="2"
          />
          <rect
            x={200 + soDo.hong + 4}
            y={soDo.hipY + 8}
            width="36"
            height="44"
            fill="#f1f5f9"
            stroke="#64748b"
            strokeWidth="1.5"
            rx="3"
          />
          <line
            x1={200 + soDo.hong + 8}
            y1={soDo.hipY + 18}
            x2={200 + soDo.hong + 36}
            y2={soDo.hipY + 18}
            stroke="#bd4b3b"
            strokeWidth="2"
          />
        </g>
      )}
      {hasQuatGiay && (
        <g id="common-quat-giay">
          <path
            d={`M ${200 + 22} ${soDo.waistY + 18} L ${200 + 6} ${soDo.waistY - 4} A 26 26 0 0 1 ${200 + 38} ${soDo.waistY - 4} Z`}
            fill="#fef3c7"
            stroke="#b45309"
            strokeWidth="1.2"
          />
          <line x1={200 + 22} y1={soDo.waistY + 18} x2={200 + 14} y2={soDo.waistY - 6} stroke="#d97706" strokeWidth="0.8" />
          <line x1={200 + 22} y1={soDo.waistY + 18} x2={200 + 22} y2={soDo.waistY - 8} stroke="#d97706" strokeWidth="0.8" />
          <line x1={200 + 22} y1={soDo.waistY + 18} x2={200 + 30} y2={soDo.waistY - 6} stroke="#d97706" strokeWidth="0.8" />
        </g>
      )}
    </g>
  );
}
