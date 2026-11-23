/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỆ TỌA ĐỘ GIẢI PHẪU CHUẨN CHO TRANG PHỤC (ANATOMICAL GARMENT PATHS)
 * Đồng bộ 100% với đường cong Bezier của ma-nơ-canh Croquis:
 * - Cánh tay: ôm trọn cơ delta (Y=188), khuỷu tay (Y=262), cẳng tay (Y=348.5) và cổ tay (Y=390)
 * - Thân trên: ôm trọn ngực (Y=210) và thắt eo (Y=285)
 * - Hông & Thân dưới: ôm trọn đỉnh hông (Y=367, hong=62 nữ / 77 nam) không bao giờ cắt vát qua hông
 */

import { SoDoNhanVat } from "../types";

export interface AnatomicalLandmarks {
  isMale: boolean;
  neckSeamX: number;
  shoulderTipX: number;
  shoulderTipY: number;
  deltoidX: number;
  elbowOutX: number;
  forearmOutX: number;
  wristOutX: number;
  wristInX: number;
  forearmInX: number;
  elbowInX: number;
  armpitInX: number;
  chestHalf: number;
  waistHalf: number;
  hipHalf: number;
}

export function getAnatomicalLandmarks(soDo: SoDoNhanVat): AnatomicalLandmarks {
  const isMale = soDo.isMale;
  return {
    isMale,
    neckSeamX: isMale ? 19.5 : 14.5,
    shoulderTipX: isMale ? 85 : 61,
    shoulderTipY: isMale ? 165 : 165.5,
    deltoidX: isMale ? 93.5 : 70.5,
    elbowOutX: isMale ? 103.5 : 75.5,
    forearmOutX: isMale ? 107 : 81.5,
    wristOutX: isMale ? 98 : 89.5,
    wristInX: isMale ? 80 : 71.5,
    forearmInX: isMale ? 70 : 57.5,
    elbowInX: isMale ? 63 : 45,
    armpitInX: isMale ? 55 : 41,
    chestHalf: isMale ? 66.5 : 48.5,
    waistHalf: isMale ? 63.5 : 37.5,
    hipHalf: isMale ? 77.5 : 62.5,
  };
}

/**
 * Hai ống tay áo dài ôm khít 100% cánh tay ma-nơ-canh (không lộ viền da ở bắp tay hay khuỷu tay)
 */
export function buildFittedSleeves(soDo: SoDoNhanVat): {
  leftSleevePath: string;
  rightSleevePath: string;
} {
  const m = getAnatomicalLandmarks(soDo);

  const leftSleevePath = `
    M ${200 - m.neckSeamX} 148
    C ${200 - (m.neckSeamX + 12)} 154, ${200 - (m.shoulderTipX - 10)} 159, ${200 - m.shoulderTipX} ${m.shoulderTipY}
    C ${200 - (m.deltoidX - 5)} 171, ${200 - (m.deltoidX - 0.5)} 181, ${200 - m.deltoidX} 188
    C ${200 - (m.deltoidX + 1.5)} 205, ${200 - (m.elbowOutX - 0.5)} 230, ${200 - m.elbowOutX} 262
    C ${200 - (m.elbowOutX + 1.5)} 290, ${200 - (m.forearmOutX - 0.5)} 320, ${200 - m.forearmOutX} 348.5
    C ${200 - (m.forearmOutX + 3)} 365, ${200 - (m.wristOutX - 1.5)} 382, ${200 - m.wristOutX} 390
    L ${200 - m.wristInX} 388.5
    C ${200 - (m.wristInX - 2)} 378, ${200 - (m.forearmInX + 4)} 358, ${200 - m.forearmInX} 348.5
    C ${200 - (m.forearmInX - 4)} 322, ${200 - (m.elbowInX + 3)} 290, ${200 - m.elbowInX} 262
    C ${200 - (m.elbowInX - 2)} 245, ${200 - (m.armpitInX + 2)} 230, ${200 - m.armpitInX} 210
    C ${200 - (m.armpitInX - 7)} 190, ${200 - (m.neckSeamX + 12)} 168, ${200 - m.neckSeamX} 148
    Z
  `;

  const rightSleevePath = `
    M ${200 + m.neckSeamX} 148
    C ${200 + (m.neckSeamX + 12)} 154, ${200 + (m.shoulderTipX - 10)} 159, ${200 + m.shoulderTipX} ${m.shoulderTipY}
    C ${200 + (m.deltoidX - 5)} 171, ${200 + (m.deltoidX - 0.5)} 181, ${200 + m.deltoidX} 188
    C ${200 + (m.deltoidX + 1.5)} 205, ${200 + (m.elbowOutX - 0.5)} 230, ${200 + m.elbowOutX} 262
    C ${200 + (m.elbowOutX + 1.5)} 290, ${200 + (m.forearmOutX - 0.5)} 320, ${200 + m.forearmOutX} 348.5
    C ${200 + (m.forearmOutX + 3)} 365, ${200 + (m.wristOutX - 1.5)} 382, ${200 + m.wristOutX} 390
    L ${200 + m.wristInX} 388.5
    C ${200 + (m.wristInX - 2)} 378, ${200 + (m.forearmInX + 4)} 358, ${200 + m.forearmInX} 348.5
    C ${200 + (m.forearmInX - 4)} 322, ${200 + (m.elbowInX + 3)} 290, ${200 + m.elbowInX} 262
    C ${200 + (m.elbowInX - 2)} 245, ${200 + (m.armpitInX + 2)} 230, ${200 + m.armpitInX} 210
    C ${200 + (m.armpitInX - 7)} 190, ${200 + (m.neckSeamX + 12)} 168, ${200 + m.neckSeamX} 148
    Z
  `;

  return { leftSleevePath, rightSleevePath };
}

/**
 * Tay áo thụng rộng truyền thống (dành cho Áo Tấc, Áo Giao Lĩnh):
 * Ôm chuẩn bờ vai & cơ delta ở phía trên, buông rộng từ khuỷu/cổ tay xuống ngang hông
 */
export function buildWideSleeves(
  soDo: SoDoNhanVat,
  dropBottomY = 415
): {
  leftWideSleevePath: string;
  rightWideSleevePath: string;
} {
  const m = getAnatomicalLandmarks(soDo);

  const leftWideSleevePath = `
    M ${200 - m.neckSeamX} 148
    C ${200 - (m.neckSeamX + 12)} 154, ${200 - (m.shoulderTipX - 10)} 159, ${200 - m.shoulderTipX} ${m.shoulderTipY}
    C ${200 - (m.deltoidX - 4)} 171, ${200 - (m.deltoidX + 2)} 182, ${200 - (m.deltoidX + 4)} 192
    C ${200 - (m.elbowOutX + 8)} 235, ${200 - (m.wristOutX + 12)} 320, ${200 - (m.wristOutX + 14)} 392
    Q ${200 - (m.wristOutX + 4)} ${dropBottomY + 8}, ${200 - (m.armpitInX + 14)} ${dropBottomY}
    C ${200 - (m.armpitInX + 8)} 350, ${200 - (m.armpitInX + 4)} 275, ${200 - m.armpitInX} 220
    Z
  `;

  const rightWideSleevePath = `
    M ${200 + m.neckSeamX} 148
    C ${200 + (m.neckSeamX + 12)} 154, ${200 + (m.shoulderTipX - 10)} 159, ${200 + m.shoulderTipX} ${m.shoulderTipY}
    C ${200 + (m.deltoidX - 4)} 171, ${200 + (m.deltoidX + 2)} 182, ${200 + (m.deltoidX + 4)} 192
    C ${200 + (m.elbowOutX + 8)} 235, ${200 + (m.wristOutX + 12)} 320, ${200 + (m.wristOutX + 14)} 392
    Q ${200 + (m.wristOutX + 4)} ${dropBottomY + 8}, ${200 + (m.armpitInX + 14)} ${dropBottomY}
    C ${200 + (m.armpitInX + 8)} 350, ${200 + (m.armpitInX + 4)} 275, ${200 + m.armpitInX} 220
    Z
  `;

  return { leftWideSleevePath, rightWideSleevePath };
}

/**
 * Thân áo ngắn ôm chuẩn ngực (Y=210) và eo (Y=285)
 * Dành cho: Áo Cỏm Thái, Áo Mông, Áo Pắn Mường, Áo Lô Lô Hoa, Áo Ê Đê, Sampot
 */
export function buildShortFittedBodicePath(
  soDo: SoDoNhanVat,
  bottomY = 287,
  neckDrop = 14
): string {
  const m = getAnatomicalLandmarks(soDo);
  return `
    M ${200 - m.neckSeamX} 148
    C ${200 - (m.neckSeamX + 14)} 158, ${200 - (m.chestHalf + 2)} 185, ${200 - m.chestHalf} 210
    C ${200 - (m.chestHalf - 2)} 235, ${200 - (m.waistHalf + 3)} 260, ${200 - (m.waistHalf + 1)} ${bottomY}
    Q 200 ${bottomY + 4}, ${200 + (m.waistHalf + 1)} ${bottomY}
    C ${200 + (m.waistHalf + 3)} 260, ${200 + (m.chestHalf - 2)} 235, ${200 + m.chestHalf} 210
    C ${200 + (m.chestHalf + 2)} 185, ${200 + (m.neckSeamX + 14)} 158, ${200 + m.neckSeamX} 148
    Q 200 ${148 + neckDrop}, ${200 - m.neckSeamX} 148
    Z
  `;
}

/**
 * Thân áo chui đầu sát nách (dành cho Ba Na, Cơ Ho):
 * Vai áo ôm vừa bờ vai trong (shoulderStrapX), nách khoét gọn và phần ngực-eo ôm sát cơ thể
 */
export function buildSleevelessBodicePath(
  soDo: SoDoNhanVat,
  bottomY = 287
): string {
  const m = getAnatomicalLandmarks(soDo);
  const strapOuterX = m.isMale ? 68 : 49;
  const strapOuterY = m.isMale ? 160 : 161;

  return `
    M ${200 - m.neckSeamX} 148
    L ${200 - strapOuterX} ${strapOuterY}
    Q ${200 - (m.chestHalf - 2)} 188, ${200 - m.chestHalf} 210
    C ${200 - (m.chestHalf - 2)} 235, ${200 - (m.waistHalf + 3)} 260, ${200 - (m.waistHalf + 1)} ${bottomY}
    Q 200 ${bottomY + 4}, ${200 + (m.waistHalf + 1)} ${bottomY}
    C ${200 + (m.waistHalf + 3)} 260, ${200 + (m.chestHalf - 2)} 235, ${200 + m.chestHalf} 210
    Q ${200 + (m.chestHalf - 2)} 188, ${200 + strapOuterX} ${strapOuterY}
    L ${200 + m.neckSeamX} 148
    Q 200 160, ${200 - m.neckSeamX} 148
    Z
  `;
}

/**
 * Thân áo dài / trung bình phủ qua hông (Áo Bà Ba, Hà Nhì, Pà Thẻn, Dao Đỏ, Tày, Ngũ Thân, Áo Tấc, Giao Lĩnh, Chăm):
 * Ôm ngực (Y=210), thắt eo (Y=285), và MỞ RỘNG ĐÚNG ĐƯỜNG CONG HÔNG (Y=367) trước khi buông xuống gấu áo (hemY).
 * Đảm bảo 100% không bao giờ cắt lẹm vào phần hông của ma-nơ-canh!
 */
export function buildTunicOverHipPath(
  soDo: SoDoNhanVat,
  hemY = 600,
  hipExtra = 2,
  hemExtra = 6,
  neckDrop = 6
): string {
  const m = getAnatomicalLandmarks(soDo);
  const wHalf = m.waistHalf + 1;
  const hHalf = m.hipHalf + hipExtra;
  const bHalf = m.hipHalf + hemExtra;

  // Nếu áo ngắn ngang hông (như Áo Bà Ba hoặc Hà Nhì, hemY <= 405)
  if (hemY <= 410) {
    return `
      M ${200 - m.neckSeamX} 148
      C ${200 - (m.neckSeamX + 14)} 158, ${200 - (m.chestHalf + 2)} 185, ${200 - m.chestHalf} 210
      C ${200 - (m.chestHalf - 2)} 235, ${200 - (wHalf + 3)} 260, ${200 - wHalf} 285
      C ${200 - (wHalf + 4)} 312, ${200 - (hHalf - 6)} 338, ${200 - hHalf} 367
      L ${200 - (hHalf + 1)} ${hemY}
      Q 200 ${hemY + 6}, ${200 + (hHalf + 1)} ${hemY}
      L ${200 + hHalf} 367
      C ${200 + (hHalf - 6)} 338, ${200 + (wHalf + 4)} 312, ${200 + wHalf} 285
      C ${200 + (wHalf + 3)} 260, ${200 + (m.chestHalf - 2)} 235, ${200 + m.chestHalf} 210
      C ${200 + (m.chestHalf + 2)} 185, ${200 + (m.neckSeamX + 14)} 158, ${200 + m.neckSeamX} 148
      Q 200 ${148 + neckDrop}, ${200 - m.neckSeamX} 148
      Z
    `;
  }

  // Áo dài qua gối hoặc tới cổ chân
  return `
    M ${200 - m.neckSeamX} 148
    C ${200 - (m.neckSeamX + 14)} 158, ${200 - (m.chestHalf + 2)} 185, ${200 - m.chestHalf} 210
    C ${200 - (m.chestHalf - 2)} 235, ${200 - (wHalf + 3)} 260, ${200 - wHalf} 285
    C ${200 - (wHalf + 4)} 312, ${200 - (hHalf - 8)} 338, ${200 - hHalf} 367
    C ${200 - (hHalf + 1)} 440, ${200 - (bHalf - 1)} 520, ${200 - bHalf} ${hemY}
    Q 200 ${hemY + 7}, ${200 + bHalf} ${hemY}
    C ${200 + (bHalf - 1)} 520, ${200 + (hHalf + 1)} 440, ${200 + hHalf} 367
    C ${200 + (hHalf - 8)} 338, ${200 + (wHalf + 4)} 312, ${200 + wHalf} 285
    C ${200 + (wHalf + 3)} 260, ${200 + (m.chestHalf - 2)} 235, ${200 + m.chestHalf} 210
    C ${200 + (m.chestHalf + 2)} 185, ${200 + (m.neckSeamX + 14)} 158, ${200 + m.neckSeamX} 148
    Q 200 ${148 + neckDrop}, ${200 - m.neckSeamX} 148
    Z
  `;
}

/**
 * Quần ống suông truyền thống (ôm chuẩn eo Y=285, bao trọn đỉnh hông Y=367, buông ống thẳng xuống Y=745)
 */
export function buildTraditionalPantsPath(soDo: SoDoNhanVat): string {
  const m = getAnatomicalLandmarks(soDo);
  const wHalf = m.waistHalf + 0.5;
  const hHalf = m.hipHalf + 0.5;
  const ankleOuterHalf = m.isMale ? 60 : 52;
  const ankleInnerHalf = m.isMale ? 10 : 8;

  return `
    M ${200 - wHalf} 284
    C ${200 - (wHalf + 10)} 316, ${200 - (hHalf - 2)} 342, ${200 - hHalf} 367
    C ${200 - (hHalf - 1)} 430, ${200 - (hHalf - 3)} 510, ${200 - (hHalf - 5)} 580
    C ${200 - (hHalf - 6)} 640, ${200 - (ankleOuterHalf + 1)} 700, ${200 - ankleOuterHalf} 745
    L ${200 - ankleInnerHalf} 745
    Q ${200 - 4} 540, 200 410
    Q ${200 + 4} 540, ${200 + ankleInnerHalf} 745
    L ${200 + ankleOuterHalf} 745
    C ${200 + (ankleOuterHalf + 1)} 700, ${200 + (hHalf - 6)} 640, ${200 + (hHalf - 5)} 580
    C ${200 + (hHalf - 3)} 510, ${200 + (hHalf - 1)} 430, ${200 + hHalf} 367
    C ${200 + (hHalf - 2)} 342, ${200 + (wHalf + 10)} 316, ${200 + wHalf} 284
    Q 200 288, ${200 - wHalf} 284
    Z
  `;
}

/**
 * Váy ống / Váy quấn truyền thống (Thái, Mường, Ê Đê, Ba Na, Cơ Ho, Chăm):
 * Ôm khít eo Y=284, lượn cong bao trọn hoàn toàn đỉnh hông Y=367 (hHalf=63), và suông xuống mắt cá Y=745.
 */
export function buildFittedTubeSkirtPath(
  soDo: SoDoNhanVat,
  hemHalfWidth?: number,
  hemY = 745
): string {
  const m = getAnatomicalLandmarks(soDo);
  const wHalf = m.waistHalf + 0.5;
  const hHalf = m.hipHalf + 1;
  const bHalf = hemHalfWidth ?? (m.isMale ? 62 : 52);

  return `
    M ${200 - wHalf} 284
    C ${200 - (wHalf + 10)} 316, ${200 - (hHalf - 1)} 342, ${200 - hHalf} 367
    C ${200 - hHalf} 450, ${200 - (bHalf + 4)} 580, ${200 - bHalf} ${hemY}
    Q 200 ${hemY + 5}, ${200 + bHalf} ${hemY}
    C ${200 + (bHalf + 4)} 580, ${200 + hHalf} 450, ${200 + hHalf} 367
    C ${200 + (hHalf - 1)} 342, ${200 + (wHalf + 10)} 316, ${200 + wHalf} 284
    Q 200 288, ${200 - wHalf} 284
    Z
  `;
}

/**
 * Váy xòe chữ A / Xếp nếp (H'Mông, Lô Lô Hoa, Pà Thẻn, Tứ Thân, Thường Giao Lĩnh):
 * Ôm khít eo Y=284, bao trọn đỉnh hông Y=367 (hHalf=63.5) và xòe rộng ở gấu váy
 */
export function buildFlaredSkirtPath(
  soDo: SoDoNhanVat,
  hemHalfWidth = 76,
  hemY = 742
): string {
  const m = getAnatomicalLandmarks(soDo);
  const wHalf = m.waistHalf + 0.5;
  const hHalf = m.hipHalf + 1.5;

  return `
    M ${200 - wHalf} 284
    C ${200 - (wHalf + 11)} 316, ${200 - (hHalf - 1)} 342, ${200 - hHalf} 367
    C ${200 - (hHalf + 4)} 450, ${200 - (hemHalfWidth - 5)} 590, ${200 - hemHalfWidth} ${hemY}
    Q 200 ${hemY + 8}, ${200 + hemHalfWidth} ${hemY}
    C ${200 + (hemHalfWidth - 5)} 590, ${200 + (hHalf + 4)} 450, ${200 + hHalf} 367
    C ${200 + (hHalf - 1)} 342, ${200 + (wHalf + 11)} 316, ${200 + wHalf} 284
    Q 200 288, ${200 - wHalf} 284
    Z
  `;
}
