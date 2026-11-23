/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BỘ DỰNG HÌNH SVG 10 TRANG PHỤC DÂN TỘC & CỔ PHỤC MỞ RỘNG (CHUẨN TỶ LỆ GIẢI PHẪU CROQUIS)
 * Gồm: Áo Tấc, Áo Giao Lĩnh, Dao Đỏ, Tày, Mường, Lô Lô Hoa, Hà Nhì, Pà Thẻn, Ba Na, Cơ Ho.
 * - Ôm chuẩn 100% đường cong cơ delta, khuỷu tay, cổ tay, vòng ngực, vòng eo và vòng hông.
 * - Mọi dải hoa văn ngang đều được cắt theo đường biên trang phục (clipPath), không bao giờ tràn ra ngoài.
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import {
  getAnatomicalLandmarks,
  buildFittedSleeves,
  buildWideSleeves,
  buildShortFittedBodicePath,
  buildSleevelessBodicePath,
  buildTunicOverHipPath,
  buildTraditionalPantsPath,
  buildFittedTubeSkirtPath,
  buildFlaredSkirtPath,
} from "./anatomicalPaths";

// 1. ÁO TẤC (NGŨ THÂN TAY THỤNG)
export function renderAoTacGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const pantsFill = soDo.isMale ? "#f8fafc" : "#fdfbf7";
  const pantsPath = buildTraditionalPantsPath(soDo);

  const childrenVayQuan = (
    <g id="ao-tac-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={pantsPath} fill={pantsFill} stroke="#cbd5e1" strokeWidth="1.2" />
    </g>
  );

  const { leftWideSleevePath, rightWideSleevePath } = buildWideSleeves(soDo, 425);
  const tunicPath = buildTunicOverHipPath(soDo, 695, 2, 7, 4);

  const childrenAo = (
    <g id="ao-tac-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      {/* Tay thụng rộng hai bên */}
      <path d={leftWideSleevePath} fill={mauHex} stroke="rgba(0,0,0,0.24)" strokeWidth="1.1" />
      <path d={rightWideSleevePath} fill={mauHex} stroke="rgba(0,0,0,0.24)" strokeWidth="1.1" />

      {/* Thân áo ngũ thân phủ qua hông xuống quá gối */}
      <path d={tunicPath} fill={mauHex} stroke="rgba(0,0,0,0.28)" strokeWidth="1.2" />
      {patternFill && <path d={tunicPath} fill={patternFill} opacity="0.38" style={{ mixBlendMode: "screen" }} />}

      {/* Cổ đứng lập lĩnh */}
      <path
        d={`
          M ${200 - m.neckSeamX} 148
          L ${200 - (m.neckSeamX - 1.5)} 134
          Q 200 136, ${200 + (m.neckSeamX - 1.5)} 134
          L ${200 + m.neckSeamX} 148
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.32)"
        strokeWidth="1.1"
      />

      {/* Đường trung phùng & vạt cài bên phải kèm 5 khuy đồng */}
      <line x1="200" y1="148" x2="200" y2="695" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
      <path
        d={`M 200 146 Q ${200 + 18} 156, ${200 + m.chestHalf - 6} 195 L ${200 + m.waistHalf} 285 L ${200 + m.hipHalf + 2} 690`}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
      />
      {[
        [200, 144],
        [200 + 14, 158],
        [200 + m.chestHalf - 7, 194],
        [200 + m.waistHalf - 2, 240],
        [200 + m.waistHalf, 285],
      ].map(([cx, cy], idx) => (
        <circle key={idx} cx={cx} cy={cy} r="2.6" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
      ))}
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 2. ÁO GIAO LĨNH (CỔ CHÉO THỜI LÝ - TRẦN - LÊ)
export function renderAoGiaoLinhGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtPath = buildFlaredSkirtPath(soDo, m.isMale ? 76 : 68, 745);

  const childrenVayQuan = (
    <g id="giao-linh-thuong" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={skirtPath} fill="#fef3c7" stroke="#b45309" strokeWidth="1.2" />
      {[-32, -16, 0, 16, 32].map((dx) => (
        <line
          key={dx}
          x1={200 + dx * 0.65}
          y1="300"
          x2={200 + dx * 1.3}
          y2="742"
          stroke="rgba(180,83,9,0.22)"
          strokeWidth="1"
        />
      ))}
    </g>
  );

  const { leftWideSleevePath, rightWideSleevePath } = buildWideSleeves(soDo, 405);
  const robePath = buildTunicOverHipPath(soDo, 635, 3, 8, 8);

  const childrenAo = (
    <g id="giao-linh-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={leftWideSleevePath} fill={mauHex} stroke="rgba(0,0,0,0.24)" strokeWidth="1.1" />
      <path d={rightWideSleevePath} fill={mauHex} stroke="rgba(0,0,0,0.24)" strokeWidth="1.1" />
      <path d={robePath} fill={mauHex} stroke="rgba(0,0,0,0.28)" strokeWidth="1.2" />
      {patternFill && <path d={robePath} fill={patternFill} opacity="0.38" style={{ mixBlendMode: "screen" }} />}

      {/* Cổ giao lĩnh chữ Y vạt trái đè vạt phải */}
      <path
        d={`
          M ${200 - m.neckSeamX} 148
          L ${200 + 20} 278
          M ${200 + m.neckSeamX} 148
          L 200 212
        `}
        stroke="#fef9c3"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Đai lưng lụa thắt ngang eo đúng chuẩn waistHalf */}
      <rect
        x={200 - m.waistHalf - 2}
        y="278"
        width={(m.waistHalf + 2) * 2}
        height="12"
        rx="3"
        fill="#991b1b"
        stroke="#f59e0b"
        strokeWidth="1"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 3. TRANG PHỤC DAO ĐỎ
export function renderDaoDoGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const baseIndigo = mauHex === "#DC2626" ? "#1e293b" : mauHex;
  const pantsPath = buildTraditionalPantsPath(soDo);
  const ankleOuterHalf = m.isMale ? 60 : 52;
  const ankleInnerHalf = m.isMale ? 10 : 8;

  const childrenVayQuan = (
    <g id="dao-do-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-dao-pants">
          <path d={pantsPath} />
        </clipPath>
      </defs>
      <path d={pantsPath} fill="#0f172a" stroke="#020617" strokeWidth="1.2" />
      {/* Gấu quần thêu hoa văn đỏ rực nằm gọn trong ống quần */}
      <g clipPath="url(#clip-dao-pants)">
        <rect
          x={200 - ankleOuterHalf - 4}
          y="715"
          width={ankleOuterHalf - ankleInnerHalf + 8}
          height="28"
          fill="#dc2626"
        />
        <rect
          x={200 + ankleInnerHalf - 4}
          y="715"
          width={ankleOuterHalf - ankleInnerHalf + 8}
          height="28"
          fill="#dc2626"
        />
        <rect
          x={200 - ankleOuterHalf - 4}
          y="715"
          width={ankleOuterHalf * 2 + 8}
          height="28"
          fill="url(#hoa-van-mong)"
        />
      </g>
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const tunicPath = buildTunicOverHipPath(soDo, 585, 2, 5, 6);

  const childrenAo = (
    <g id="dao-do-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={leftSleevePath} fill={baseIndigo} stroke="#020617" strokeWidth="1.1" />
      <path d={rightSleevePath} fill={baseIndigo} stroke="#020617" strokeWidth="1.1" />
      <path d={tunicPath} fill={baseIndigo} stroke="#020617" strokeWidth="1.2" />
      {patternFill && <path d={tunicPath} fill={patternFill} opacity="0.35" style={{ mixBlendMode: "screen" }} />}

      {/* Nẹp cổ thêu đỏ & hàng bông len đỏ trước ngực */}
      <path
        d={`M ${200 - m.neckSeamX} 148 L 200 285 L ${200 + m.neckSeamX} 148`}
        fill="none"
        stroke="#dc2626"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[-12, -6, 0, 6, 12].map((dx, i) => (
        <circle
          key={i}
          cx={200 + dx}
          cy={198 + Math.abs(dx) * 0.7}
          r="4.2"
          fill="#ef4444"
          stroke="#fef08a"
          strokeWidth="0.9"
        />
      ))}

      {/* Cửa tay thêu đỏ chuẩn cổ tay */}
      <line
        x1={200 - m.wristOutX}
        y1="386"
        x2={200 - m.wristInX}
        y2="385"
        stroke="#dc2626"
        strokeWidth="6"
      />
      <line
        x1={200 + m.wristInX}
        y1="385"
        x2={200 + m.wristOutX}
        y2="386"
        stroke="#dc2626"
        strokeWidth="6"
      />

      {/* Đai thắt lưng đỏ thêu */}
      <rect
        x={200 - m.waistHalf - 1.5}
        y="280"
        width={(m.waistHalf + 1.5) * 2}
        height="10"
        rx="2"
        fill="#b91c1c"
        stroke="#f59e0b"
        strokeWidth="0.9"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 4. ÁO CHÀM TÀY
export function renderTayChamGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const pantsPath = buildTraditionalPantsPath(soDo);

  const childrenVayQuan = (
    <g id="tay-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={pantsPath} fill="#172554" stroke="#0f172a" strokeWidth="1.2" />
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const tunicPath = buildTunicOverHipPath(soDo, 605, 2, 5, 5);

  const childrenAo = (
    <g id="tay-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={leftSleevePath} fill={mauHex} stroke="#0f172a" strokeWidth="1.1" />
      <path d={rightSleevePath} fill={mauHex} stroke="#0f172a" strokeWidth="1.1" />
      <path d={tunicPath} fill={mauHex} stroke="#0f172a" strokeWidth="1.2" />
      {patternFill && <path d={tunicPath} fill={patternFill} opacity="0.32" style={{ mixBlendMode: "screen" }} />}

      {/* Đường cài khuy nách phải truyền thống áo năm thân Tày */}
      <path
        d={`M 200 150 Q ${200 + 16} 162, ${200 + m.chestHalf - 5} 202 L ${200 + m.waistHalf} 285`}
        fill="none"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.1"
      />
      {/* Thắt lưng lụa xanh ngọc & Vòng kiềng bạc mảnh */}
      <rect
        x={200 - m.waistHalf - 1.5}
        y="280"
        width={(m.waistHalf + 1.5) * 2}
        height="9"
        rx="3"
        fill="#0d9488"
        stroke="#0f766e"
        strokeWidth="0.9"
      />
      <path
        d={`M ${200 - m.neckSeamX - 3} 152 Q 200 168, ${200 + m.neckSeamX + 3} 152`}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="3"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 5. ÁO PẮN & VÁY CẠP MƯỜNG
export function renderMuongVayGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtPath = buildFittedTubeSkirtPath(soDo, m.isMale ? 60 : 50, 745);

  const childrenVayQuan = (
    <g id="muong-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={skirtPath} fill="#0f172a" stroke="#020617" strokeWidth="1.2" />
      {/* Cạp váy Mường (3 dải: rang trên, rang giữa, cáol) ôm chuẩn eo */}
      <rect
        x={200 - m.waistHalf - 1.5}
        y="272"
        width={(m.waistHalf + 1.5) * 2}
        height="24"
        rx="2"
        fill="#b91c1c"
        stroke="#f59e0b"
        strokeWidth="1.2"
      />
      <rect
        x={200 - m.waistHalf - 1.5}
        y="272"
        width={(m.waistHalf + 1.5) * 2}
        height="24"
        rx="2"
        fill="url(#hoa-van-thai)"
      />
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const bodicePath = buildShortFittedBodicePath(soDo, 276, 12);

  const childrenAo = (
    <g id="muong-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={leftSleevePath} fill={mauHex} stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
      <path d={rightSleevePath} fill={mauHex} stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
      <path d={bodicePath} fill={mauHex} stroke="rgba(0,0,0,0.24)" strokeWidth="1.2" />
      {patternFill && <path d={bodicePath} fill={patternFill} opacity="0.35" style={{ mixBlendMode: "screen" }} />}
      {/* Yếm đào bên trong ngực áo pắn */}
      <path
        d={`M ${200 - 11} 154 L 200 274 L ${200 + 11} 154 Q 200 162, ${200 - 11} 154 Z`}
        fill="#f43f5e"
        stroke="#be123c"
        strokeWidth="0.9"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 6. TRANG PHỤC LÔ LÔ HOA (GHÉP VẢI ĐA SẮC)
export function renderLoLoHoaGarment({
  soDo,
  mauHex,
}: GarmentRenderProps): GarmentRenderResult {
  const skirtPath = buildFlaredSkirtPath(soDo, soDo.isMale ? 74 : 70, 742);

  const childrenVayQuan = (
    <g id="lolo-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-lolo-skirt">
          <path d={skirtPath} />
        </clipPath>
      </defs>
      <path d={skirtPath} fill="#0f172a" stroke="#020617" strokeWidth="1.2" />
      {/* Dải vải ghép đa sắc nằm gọn trong biên dạng váy */}
      <g clipPath="url(#clip-lolo-skirt)">
        {["#ef4444", "#eab308", "#22c55e", "#3b82f6"].map((c, i) => (
          <rect
            key={i}
            x="110"
            y={410 + i * 32}
            width="180"
            height="12"
            fill={c}
            opacity="0.9"
          />
        ))}
        <rect x="110" y="695" width="180" height="24" fill="url(#hoa-van-mong)" />
      </g>
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const bodicePath = buildShortFittedBodicePath(soDo, 287, 10);

  const childrenAo = (
    <g id="lolo-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-lolo-bodice">
          <path d={bodicePath} />
        </clipPath>
        <clipPath id="clip-lolo-left-sleeve">
          <path d={leftSleevePath} />
        </clipPath>
        <clipPath id="clip-lolo-right-sleeve">
          <path d={rightSleevePath} />
        </clipPath>
      </defs>

      <path d={leftSleevePath} fill={mauHex} stroke="#0f172a" strokeWidth="1.1" />
      <path d={rightSleevePath} fill={mauHex} stroke="#0f172a" strokeWidth="1.1" />

      {/* Các vòng vải ghép đa sắc trên ống tay áo */}
      <g clipPath="url(#clip-lolo-left-sleeve)">
        {["#dc2626", "#facc15", "#10b981", "#f97316"].map((c, idx) => (
          <rect key={idx} x="90" y={225 + idx * 34} width="110" height="14" fill={c} />
        ))}
      </g>
      <g clipPath="url(#clip-lolo-right-sleeve)">
        {["#dc2626", "#facc15", "#10b981", "#f97316"].map((c, idx) => (
          <rect key={idx} x="200" y={225 + idx * 34} width="110" height="14" fill={c} />
        ))}
      </g>

      <path d={bodicePath} fill={mauHex} stroke="#0f172a" strokeWidth="1.2" />
      <g clipPath="url(#clip-lolo-bodice)">
        {["#dc2626", "#facc15", "#f97316", "#10b981"].map((color, idx) => (
          <rect key={idx} x="130" y={192 + idx * 14} width="140" height="9" fill={color} />
        ))}
        <rect x="130" y="192" width="140" height="56" fill="url(#hoa-van-mong)" />
      </g>
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 7. TRANG PHỤC HÀ NHÌ
export function renderHaNhiGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const pantsPath = buildTraditionalPantsPath(soDo);

  const childrenVayQuan = (
    <g id="hanhi-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <path d={pantsPath} fill="#0f172a" stroke="#020617" strokeWidth="1.2" />
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const tunicPath = buildTunicOverHipPath(soDo, 402, 2, 3, 6);

  const childrenAo = (
    <g id="hanhi-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-hanhi-tunic">
          <path d={tunicPath} />
        </clipPath>
        <clipPath id="clip-hanhi-left-sleeve">
          <path d={leftSleevePath} />
        </clipPath>
        <clipPath id="clip-hanhi-right-sleeve">
          <path d={rightSleevePath} />
        </clipPath>
      </defs>

      <path d={leftSleevePath} fill={mauHex} stroke="#020617" strokeWidth="1.1" />
      <path d={rightSleevePath} fill={mauHex} stroke="#020617" strokeWidth="1.1" />
      <g clipPath="url(#clip-hanhi-left-sleeve)">
        <rect x="90" y="340" width="110" height="12" fill="#38bdf8" />
      </g>
      <g clipPath="url(#clip-hanhi-right-sleeve)">
        <rect x="200" y="340" width="110" height="12" fill="#38bdf8" />
      </g>

      <path d={tunicPath} fill={mauHex} stroke="#020617" strokeWidth="1.2" />
      {patternFill && <path d={tunicPath} fill={patternFill} opacity="0.35" style={{ mixBlendMode: "screen" }} />}

      {/* Nẹp viền xanh lam & hàng đồng xu bạc chéo ngực đặc trưng Hà Nhì */}
      <g clipPath="url(#clip-hanhi-tunic)">
        <path
          d={`M ${200 - m.neckSeamX + 2} 150 L ${200 + m.waistHalf - 4} 285 L ${200 + m.hipHalf - 6} 402`}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="5.5"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx={200 - 10 + i * 7.5}
            cy={162 + i * 18}
            r="3.3"
            fill="#f8fafc"
            stroke="#64748b"
            strokeWidth="0.9"
          />
        ))}
      </g>
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 8. TRANG PHỤC PÀ THẺN (SẮC ĐỎ THẦN LỬA)
export function renderPaThenGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const redFire = mauHex || "#dc2626";
  const skirtPath = buildFlaredSkirtPath(soDo, soDo.isMale ? 74 : 68, 742);

  const childrenVayQuan = (
    <g id="pathen-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-pathen-skirt">
          <path d={skirtPath} />
        </clipPath>
      </defs>
      <path d={skirtPath} fill={redFire} stroke="#7f1d1d" strokeWidth="1.2" />
      <g clipPath="url(#clip-pathen-skirt)">
        <rect x="110" y="706" width="180" height="7" fill="#ffffff" />
        <rect x="110" y="715" width="180" height="10" fill="#0f172a" />
      </g>
    </g>
  );

  const { leftSleevePath, rightSleevePath } = buildFittedSleeves(soDo);
  const tunicPath = buildTunicOverHipPath(soDo, 392, 2, 4, 8);

  const childrenAo = (
    <g id="pathen-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-pathen-tunic">
          <path d={tunicPath} />
        </clipPath>
      </defs>

      <path d={leftSleevePath} fill={redFire} stroke="#7f1d1d" strokeWidth="1.1" />
      <path d={rightSleevePath} fill={redFire} stroke="#7f1d1d" strokeWidth="1.1" />
      <path d={tunicPath} fill={redFire} stroke="#7f1d1d" strokeWidth="1.2" />
      {patternFill && <path d={tunicPath} fill={patternFill} opacity="0.35" style={{ mixBlendMode: "screen" }} />}

      {/* Sọc ngang trắng - đen - vàng rực rỡ trên ngực áo & đai eo */}
      <g clipPath="url(#clip-pathen-tunic)">
        <rect x="130" y="202" width="140" height="5" fill="#ffffff" />
        <rect x="130" y="209" width="140" height="7" fill="#0f172a" />
        <rect x="130" y="218" width="140" height="5" fill="#facc15" />
        <rect x="130" y="280" width="140" height="10" fill="#ffffff" />
        <rect x="130" y="283" width="140" height="4" fill="#0f172a" />
      </g>
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 9. TRANG PHỤC BA NA (THỔ CẨM 3 SẮC ĐẤT - LỬA - TRỜI)
export function renderBaNaGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtPath = buildFittedTubeSkirtPath(soDo, m.isMale ? 60 : 50, 745);

  const childrenVayQuan = (
    <g id="bana-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-bana-skirt">
          <path d={skirtPath} />
        </clipPath>
      </defs>
      <path d={skirtPath} fill="#0f172a" stroke="#020617" strokeWidth="1.2" />
      {/* Hoa văn đối xứng Đỏ - Trắng - Vàng Ba Na được cắt gọn theo thân váy */}
      <g clipPath="url(#clip-bana-skirt)">
        <rect x="120" y="545" width="160" height="16" fill="#dc2626" />
        <rect x="120" y="550" width="160" height="6" fill="url(#hoa-van-ede)" />
        <rect x="120" y="718" width="160" height="18" fill="#dc2626" />
        <rect x="120" y="723" width="160" height="8" fill="#fef08a" />
      </g>
    </g>
  );

  const bodicePath = buildSleevelessBodicePath(soDo, 287);

  const childrenAo = (
    <g id="bana-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-bana-bodice">
          <path d={bodicePath} />
        </clipPath>
      </defs>
      <path d={bodicePath} fill={mauHex} stroke="#020617" strokeWidth="1.2" />
      {patternFill && <path d={bodicePath} fill={patternFill} opacity="0.35" style={{ mixBlendMode: "screen" }} />}
      <g clipPath="url(#clip-bana-bodice)">
        <rect x="130" y="200" width="140" height="16" fill="#dc2626" />
        <line
          x1="130"
          y1="208"
          x2="270"
          y2="208"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeDasharray="4 3"
        />
        <rect x="130" y="278" width="140" height="8" fill="#dc2626" />
      </g>
    </g>
  );

  return { childrenVayQuan, childrenAo };
}

// 10. TRANG PHỤC CƠ HO (THỔ CẨM LÂM VIÊN & CHUỖI CƯỜM)
export function renderCoHoGarment({
  soDo,
  mauHex,
  patternFill,
}: GarmentRenderProps): GarmentRenderResult {
  const m = getAnatomicalLandmarks(soDo);
  const skirtPath = buildFittedTubeSkirtPath(soDo, m.isMale ? 60 : 50, 745);

  const childrenVayQuan = (
    <g id="caho-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-caho-skirt">
          <path d={skirtPath} />
        </clipPath>
      </defs>
      <path d={skirtPath} fill="#1e1b4b" stroke="#0f172a" strokeWidth="1.2" />
      <g clipPath="url(#clip-caho-skirt)">
        <rect x="120" y="340" width="160" height="12" fill="url(#hoa-van-champa)" />
        <rect
          x="120"
          y="716"
          width="160"
          height="22"
          fill="url(#hoa-van-champa)"
          stroke="#f59e0b"
          strokeWidth="1"
        />
      </g>
    </g>
  );

  const bodicePath = buildSleevelessBodicePath(soDo, 287);

  const childrenAo = (
    <g id="caho-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      <defs>
        <clipPath id="clip-caho-bodice">
          <path d={bodicePath} />
        </clipPath>
      </defs>
      <path d={bodicePath} fill={mauHex} stroke="#0f172a" strokeWidth="1.2" />
      {patternFill && <path d={bodicePath} fill={patternFill} opacity="0.35" style={{ mixBlendMode: "screen" }} />}
      <g clipPath="url(#clip-caho-bodice)">
        <rect
          x="130"
          y="200"
          width="140"
          height="18"
          fill="url(#hoa-van-champa)"
          stroke="#f59e0b"
          strokeWidth="1"
        />
        <rect x="130" y="278" width="140" height="8" fill="#1e1b4b" />
      </g>
      <path
        d={`M ${200 - m.neckSeamX - 2} 151 Q 200 167, ${200 + m.neckSeamX + 2} 151`}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3.2"
        strokeDasharray="3 2"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
