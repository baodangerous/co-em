/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHỤ KIỆN ĐỘI ĐẦU / KHĂN / NÓN (HEADWEAR RENDERER)
 * Hệ tọa độ đầu chuẩn trên ma-nơ-canh:
 * - Đỉnh sọ (headTopY): Y = 50 (tóc búi cao Y = 30..54, chân tóc trán Y = 61..66)
 * - Vùng trán (Forehead): Y = 56..70
 * - Chân mày & Mắt & Tai (headCenterY): Y = 78..105 (tâm Y = 90)
 * - Cằm (chinY): Y = 136
 *
 * Tất cả mũ/nón/khăn đội đầu được định vị ôm trọn đỉnh đầu và phần trán trên (Y = 28..71),
 * tuyệt đối không bị hở trán phía trên và không sụp xuống che khuất vùng mắt (Y > 74).
 */

import { SoDoNhanVat } from "../types";
import { CroquisBodyType } from "../croquis/BodyPartLayering";

export function renderHeadwear(
  soDo: SoDoNhanVat,
  phuKienIds: string[],
  bodyType: CroquisBodyType = "adult"
) {
  const hasNonLa = phuKienIds.includes("non_la");
  const hasKhanDong = phuKienIds.includes("khan_dong");
  const hasKhanMoQua = phuKienIds.includes("khan_mo_qua");
  const hasNonQuaiThao = phuKienIds.includes("non_quai_thao");
  const hasKhanPieu = phuKienIds.includes("khan_pieu");
  const hasKhanCham = phuKienIds.includes("khan_cham");
  const hasTramCai = phuKienIds.includes("tram_cai");

  if (
    !hasNonLa &&
    !hasKhanDong &&
    !hasKhanMoQua &&
    !hasNonQuaiThao &&
    !hasKhanPieu &&
    !hasKhanCham &&
    !hasTramCai
  ) {
    return null;
  }

  // Tọa độ chuẩn vùng trán, thái dương & đỉnh đầu (khớp 100% với mũ tóc Y=47..92)
  const crownTopY = soDo.headTopY - 6; // Y = 44 (ôm sát đỉnh đầu Y=47, không bị nhô cao)
  const browRimY = soDo.headTopY + 23; // Y = 73 (ngang giữa trán, che kín chân tóc Y=61)
  const templeY = soDo.headTopY + 34;  // Y = 84 (ôm xuống thái dương ngay trên tai Y=90)
  const headRx = soDo.headRadiusX;     // 29

  // Tỷ lệ Nón lá Huế hạ thấp ôm vừa đầu (vành nón Y=76, chóp nón Y=30)
  const nonLaRimY = soDo.headTopY + 26; // Y = 76
  const nonLaRimRx = bodyType === "child" ? headRx + 30 : headRx + 36; // 59..65
  const nonLaApexY = bodyType === "child" ? soDo.headTopY - 16 : soDo.headTopY - 20; // Y = 30..34

  return (
    <g id="common-headwear" className={`headwear-${bodyType}`}>
      {/* 1. KHĂN ĐÓNG / KHĂN XẾP CHỮ NHÂN (Ôm gọn đỉnh đầu Y=43..78, không nhô cao) */}
      {hasKhanDong && !hasKhanMoQua && !hasKhanPieu && !hasNonQuaiThao && (
        <g id="acc-khan-dong">
          {/* Lớp lót đỉnh đầu ôm sát hộp sọ */}
          <path
            d={`
              M ${200 - headRx} ${templeY - 4}
              C ${200 - headRx - 3} ${crownTopY + 10}, ${200 - 16} ${crownTopY - 1}, 200 ${crownTopY - 1}
              C ${200 + 16} ${crownTopY - 1}, ${200 + headRx + 3} ${crownTopY + 10}, ${200 + headRx} ${templeY - 4}
              Z
            `}
            fill="#0f172a"
          />

          {/* Khối khăn xếp nhiều vòng ôm sát trán và hai bên thái dương */}
          <path
            d={`
              M ${200 - headRx - 2} ${templeY - 3}
              C ${200 - headRx - 5} ${crownTopY + 10}, ${200 - 20} ${crownTopY + 1}, 200 ${crownTopY + 1}
              C ${200 + 20} ${crownTopY + 1}, ${200 + headRx + 5} ${crownTopY + 10}, ${200 + headRx + 2} ${templeY - 3}
              C ${200 + headRx - 4} ${browRimY + 3}, ${200 + 12} ${browRimY}, 200 ${browRimY + 1}
              C ${200 - 12} ${browRimY}, ${200 - headRx + 4} ${browRimY + 3}, ${200 - headRx - 2} ${templeY - 3}
              Z
            `}
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.3"
          />

          {/* Các nếp xếp chữ Nhân (人) đan chéo trước trán */}
          <path
            d={`M ${200 - headRx - 1} ${templeY - 6} Q ${200 - 12} ${crownTopY + 9} 200 ${browRimY}`}
            fill="none"
            stroke="#475569"
            strokeWidth="1.15"
          />
          <path
            d={`M ${200 + headRx + 1} ${templeY - 6} Q ${200 + 12} ${crownTopY + 9} 200 ${browRimY}`}
            fill="none"
            stroke="#475569"
            strokeWidth="1.15"
          />
          <path
            d={`M ${200 - headRx} ${browRimY - 2} Q 200 ${crownTopY + 7} ${200 + headRx} ${browRimY - 2}`}
            fill="none"
            stroke="#64748b"
            strokeWidth="1.05"
          />
          <path
            d={`M ${200 - headRx + 3} ${browRimY - 8} Q 200 ${crownTopY + 3} ${200 + headRx - 3} ${browRimY - 8}`}
            fill="none"
            stroke="#64748b"
            strokeWidth="0.95"
          />
        </g>
      )}

      {/* 2. KHĂN MỎ QUẠ KINH BẮC (Ôm sát hộp sọ Y=45..86, mũi mỏ quạ nhọn giữa trán Y=77) */}
      {hasKhanMoQua && !hasKhanPieu && !hasNonQuaiThao && (
        <g id="acc-khan-mo-qua">
          <path
            d={`
              M ${200 - headRx + 1} ${templeY + 2}
              C ${200 - headRx - 2} ${crownTopY + 10}, ${200 - 14} ${crownTopY + 1}, 200 ${crownTopY + 1}
              C ${200 + 14} ${crownTopY + 1}, ${200 + headRx + 2} ${crownTopY + 10}, ${200 + headRx - 1} ${templeY + 2}
              C ${200 + headRx - 6} ${browRimY - 1}, ${200 + 11} ${browRimY - 6}, 200 ${browRimY + 4}
              C ${200 - 11} ${browRimY - 6}, ${200 - headRx + 6} ${browRimY - 1}, ${200 - headRx + 1} ${templeY + 2}
              Z
            `}
            fill="#18181b"
            stroke="#09090b"
            strokeWidth="1.2"
          />
          {/* Nếp gấp chéo tạo dáng mỏ quạ giữa trán */}
          <path
            d={`M ${200 - headRx + 3} ${templeY - 4} Q ${200 - 10} ${browRimY - 7} 200 ${browRimY + 3} Q ${200 + 10} ${browRimY - 7} ${200 + headRx - 3} ${templeY - 4}`}
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1"
          />
        </g>
      )}

      {/* 3. NÓN QUAI THAO KINH BẮC (Hạ thấp vành nón ôm quanh đầu Y=56, kết hợp khăn mỏ quạ lót trong) */}
      {hasNonQuaiThao && (
        <g id="acc-non-quai-thao">
          {/* Vành nón tròn rộng hạ thấp ôm quanh đầu */}
          <ellipse
            cx={200}
            cy={soDo.headTopY + 6}
            rx={headRx + 44}
            ry="16"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="1.8"
          />
          <ellipse
            cx={200}
            cy={soDo.headTopY + 6}
            rx={headRx + 34}
            ry="11.5"
            fill="none"
            stroke="#d97706"
            strokeWidth="0.8"
            strokeDasharray="3 2"
          />
          {/* Khup nón trên đỉnh hạ thấp vừa vặn */}
          <ellipse
            cx={200}
            cy={soDo.headTopY - 1}
            rx="22"
            ry="6"
            fill="#fde047"
            stroke="#ca8a04"
            strokeWidth="1.1"
          />

          {/* Lớp khăn mỏ quạ lót trong ôm sát trán và thái dương */}
          <path
            d={`
              M ${200 - headRx + 1} ${templeY + 1}
              C ${200 - headRx - 2} ${crownTopY + 10}, ${200 - 14} ${crownTopY + 2}, 200 ${crownTopY + 2}
              C ${200 + 14} ${crownTopY + 2}, ${200 + headRx + 2} ${crownTopY + 10}, ${200 + headRx - 1} ${templeY + 1}
              C ${200 + headRx - 6} ${browRimY - 1}, ${200 + 11} ${browRimY - 6}, 200 ${browRimY + 4}
              C ${200 - 11} ${browRimY - 6}, ${200 - headRx + 6} ${browRimY - 1}, ${200 - headRx + 1} ${templeY + 1}
              Z
            `}
            fill="#18181b"
            stroke="#09090b"
            strokeWidth="1.2"
          />

          {/* Dải lụa quai thao mềm mại buông hai bên cằm */}
          <path
            d={`M ${200 - headRx - 4} ${templeY - 2} C ${200 - headRx - 14} ${soDo.chinY + 2}, ${200 - 18} ${soDo.chinY + 16}, 200 ${soDo.chinY + 16} C ${200 + 18} ${soDo.chinY + 16}, ${200 + headRx + 14} ${soDo.chinY + 2}, ${200 + headRx + 4} ${templeY - 2}`}
            fill="none"
            stroke="#fde68a"
            strokeWidth="2.8"
          />
          <path
            d={`M ${200 - headRx - 4} ${templeY - 2} C ${200 - headRx - 14} ${soDo.chinY + 2}, ${200 - 18} ${soDo.chinY + 16}, 200 ${soDo.chinY + 16} C ${200 + 18} ${soDo.chinY + 16}, ${200 + headRx + 14} ${soDo.chinY + 2}, ${200 + headRx + 4} ${templeY - 2}`}
            fill="none"
            stroke="#b45309"
            strokeWidth="0.9"
          />
          <circle cx={200 - headRx - 6} cy={templeY + 8} r="2.8" fill="#dc2626" />
          <circle cx={200 + headRx + 6} cy={templeY + 8} r="2.8" fill="#dc2626" />
        </g>
      )}

      {/* 4. KHĂN PIÊU THÁI TÂY BẮC (Hạ thấp ôm sát đỉnh đầu Y=42..76, hai đầu khăn thêu buông sau vai) */}
      {hasKhanPieu && (
        <g id="acc-khan-pieu">
          {/* Hai vạt khăn piêu buông dọc hai bên thái dương xuống vai */}
          <path
            d={`
              M ${200 - headRx} ${browRimY}
              L ${200 - headRx - 11} ${soDo.shoulderY - 10}
              L ${200 - headRx - 1} ${soDo.shoulderY - 10}
              L ${200 - headRx + 4} ${browRimY + 4}
              Z
            `}
            fill="#18181b"
            stroke="#991b1b"
            strokeWidth="1.1"
          />
          <path
            d={`
              M ${200 + headRx} ${browRimY}
              L ${200 + headRx + 11} ${soDo.shoulderY - 10}
              L ${200 + headRx + 1} ${soDo.shoulderY - 10}
              L ${200 + headRx - 4} ${browRimY + 4}
              Z
            `}
            fill="#18181b"
            stroke="#991b1b"
            strokeWidth="1.1"
          />
          {/* Mảng thổ cẩm đỏ vàng ở hai đầu khăn piêu */}
          <rect
            x={200 - headRx - 11}
            y={soDo.shoulderY - 22}
            width="10"
            height="12"
            rx="1"
            fill="#dc2626"
            stroke="#facc15"
            strokeWidth="0.9"
          />
          <rect
            x={200 + headRx + 1}
            y={soDo.shoulderY - 22}
            width="10"
            height="12"
            rx="1"
            fill="#dc2626"
            stroke="#facc15"
            strokeWidth="0.9"
          />
          <circle cx={200 - headRx - 6} cy={soDo.shoulderY - 16} r="1.8" fill="#facc15" />
          <circle cx={200 + headRx + 6} cy={soDo.shoulderY - 16} r="1.8" fill="#facc15" />

          {/* Phần vòm khăn piêu ôm gọn đỉnh đầu và trán trên */}
          <path
            d={`
              M ${200 - headRx - 2} ${templeY - 4}
              C ${200 - headRx - 4} ${crownTopY + 8}, ${200 - 18} ${crownTopY - 2}, 200 ${crownTopY - 2}
              C ${200 + 18} ${crownTopY - 2}, ${200 + headRx + 4} ${crownTopY + 8}, ${200 + headRx + 2} ${templeY - 4}
              Q 200 ${browRimY - 2} ${200 - headRx - 2} ${templeY - 4}
              Z
            `}
            fill="#18181b"
            stroke="#dc2626"
            strokeWidth="1.3"
          />
          {/* Dải thổ cẩm cút piêu vắt ngang trán */}
          <path
            d={`
              M ${200 - headRx - 1} ${templeY - 6}
              Q 200 ${browRimY - 5} ${200 + headRx + 1} ${templeY - 6}
              L ${200 + headRx} ${templeY - 13}
              Q 200 ${browRimY - 12} ${200 - headRx} ${templeY - 13}
              Z
            `}
            fill="#dc2626"
          />
          <path
            d={`M ${200 - 20} ${browRimY - 4} L ${200 - 14} ${browRimY - 7} L ${200 - 8} ${browRimY - 4} L ${200 - 2} ${browRimY - 7} L ${200 + 4} ${browRimY - 4} L ${200 + 10} ${browRimY - 7} L ${200 + 16} ${browRimY - 4} L ${200 + 22} ${browRimY - 7}`}
            fill="none"
            stroke="#facc15"
            strokeWidth="1.1"
          />
        </g>
      )}

      {/* 5. KHĂN THỔ CẨM CHĂM (Ôm sát đỉnh đầu Y=44..78 với dải lụa dệt Chăm) */}
      {hasKhanCham && !hasKhanPieu && !hasNonQuaiThao && (
        <g id="acc-khan-cham">
          <path
            d={`M ${200 + headRx - 1} ${templeY - 4} L ${200 + headRx + 9} ${soDo.shoulderY - 12} L ${200 + headRx + 1} ${soDo.shoulderY - 12} L ${200 + headRx - 4} ${templeY - 2} Z`}
            fill="#fef3c7"
            stroke="#b45309"
            strokeWidth="1"
          />
          <path
            d={`
              M ${200 - headRx - 2} ${templeY - 4}
              C ${200 - headRx - 4} ${crownTopY + 10}, ${200 - 16} ${crownTopY}, 200 ${crownTopY}
              C ${200 + 16} ${crownTopY}, ${200 + headRx + 4} ${crownTopY + 10}, ${200 + headRx + 2} ${templeY - 4}
              Q 200 ${browRimY} ${200 - headRx - 2} ${templeY - 4}
              Z
            `}
            fill="#fffbeb"
            stroke="#d97706"
            strokeWidth="1.2"
          />
          <path
            d={`M ${200 - headRx - 1} ${templeY - 6} Q 200 ${browRimY - 2} ${200 + headRx + 1} ${templeY - 6}`}
            fill="none"
            stroke="#b91c1c"
            strokeWidth="3.2"
          />
          <path
            d={`M ${200 - headRx - 1} ${templeY - 6} Q 200 ${browRimY - 2} ${200 + headRx + 1} ${templeY - 6}`}
            fill="none"
            stroke="#facc15"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
        </g>
      )}

      {/* 6. NÓN LÁ HUẾ / NÓN BÀI THƠ (Hạ thấp ôm vừa đầu: chóp Y=30, vành Y=76, không nhô cao) */}
      {hasNonLa && !hasNonQuaiThao && !hasKhanPieu && (
        <g id="acc-non-la">
          {/* Vành trong dưới bóng nón */}
          <ellipse
            cx={200}
            cy={nonLaRimY}
            rx={nonLaRimRx}
            ry="6.5"
            fill="#fde68a"
            stroke="#b45309"
            strokeWidth="1.1"
          />

          {/* Thân nón hình chóp hạ thấp vừa vặn với đầu */}
          <path
            d={`
              M 200 ${nonLaApexY}
              L ${200 - nonLaRimRx} ${nonLaRimY}
              Q 200 ${nonLaRimY + 5} ${200 + nonLaRimRx} ${nonLaRimY}
              Z
            `}
            fill="#fef3c7"
            stroke="#d97706"
            strokeWidth="1.3"
          />

          {/* Các vòng tre đồng tâm và nan nón bài thơ thanh mảnh */}
          <path
            d={`M ${200 - nonLaRimRx * 0.68} ${nonLaApexY + (nonLaRimY - nonLaApexY) * 0.68} Q 200 ${nonLaApexY + (nonLaRimY - nonLaApexY) * 0.74} ${200 + nonLaRimRx * 0.68} ${nonLaApexY + (nonLaRimY - nonLaApexY) * 0.68}`}
            fill="none"
            stroke="#d97706"
            strokeWidth="0.7"
            opacity="0.45"
          />
          <path
            d={`M ${200 - nonLaRimRx * 0.38} ${nonLaApexY + (nonLaRimY - nonLaApexY) * 0.38} Q 200 ${nonLaApexY + (nonLaRimY - nonLaApexY) * 0.42} ${200 + nonLaRimRx * 0.38} ${nonLaApexY + (nonLaRimY - nonLaApexY) * 0.38}`}
            fill="none"
            stroke="#d97706"
            strokeWidth="0.7"
            opacity="0.4"
          />
          <line x1={200} y1={nonLaApexY} x2={200} y2={nonLaRimY + 2} stroke="#d97706" strokeWidth="0.6" opacity="0.35" />
          <line x1={200} y1={nonLaApexY} x2={200 - nonLaRimRx * 0.5} y2={nonLaRimY + 1} stroke="#d97706" strokeWidth="0.6" opacity="0.3" />
          <line x1={200} y1={nonLaApexY} x2={200 + nonLaRimRx * 0.5} y2={nonLaRimY + 1} stroke="#d97706" strokeWidth="0.6" opacity="0.3" />

          {/* Quai nón lụa ôm nhẹ dọc xương hàm xuống dưới cằm */}
          <path
            d={`
              M ${200 - headRx + 2} ${nonLaRimY + 2}
              C ${200 - headRx - 3} ${soDo.headCenterY + 20}, ${200 - 15} ${soDo.chinY + 5}, 200 ${soDo.chinY + 5}
              C ${200 + 15} ${soDo.chinY + 5}, ${200 + headRx + 3} ${soDo.headCenterY + 20}, ${200 + headRx - 2} ${nonLaRimY + 2}
            `}
            fill="none"
            stroke="#d98ba0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 7. TRÂM CÀI BÚI TÓC */}
      {hasTramCai && !hasNonLa && (
        <g id="acc-tram-cai">
          <line
            x1={176}
            y1={soDo.headTopY - 4}
            x2={226}
            y2={soDo.headTopY + 3}
            stroke="#d9a441"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx={227} cy={soDo.headTopY + 3} r="3" fill="#10b981" stroke="#fef08a" strokeWidth="0.9" />
          <circle cx={231} cy={soDo.headTopY + 7} r="1.6" fill="#fef08a" />
        </g>
      )}
    </g>
  );
}

