/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CƠ SỞ DỮ LIỆU ĐẦY ĐỦ 54 DÂN TỘC VIỆT NAM & ĐẶC TRƯNG SẮC PHỤC TRUYỀN THỐNG
 * Phục vụ tra cứu, tìm kiếm và lọc trang phục theo toàn bộ 54 dân tộc anh em.
 */

export type HeNgonNgu54 =
  | "Việt - Mường"
  | "Tày - Thái"
  | "Môn - Khmer"
  | "Mông - Dao"
  | "Nam Đảo"
  | "Tạng - Miến"
  | "Ka Đai"
  | "Hán";

export type VungVanHoa54 =
  | "Toàn quốc & Đồng bằng"
  | "Đông Bắc & Việt Bắc"
  | "Tây Bắc & Miền núi Bắc Bộ"
  | "Trường Sơn & Duyên hải Trung Bộ"
  | "Tây Nguyên"
  | "Nam Bộ";

export interface DanToc54Item {
  id: string;
  stt: number;
  ten: string;
  tenGoiKhac: string;
  heNgonNgu: HeNgonNgu54;
  vungVanHoa: VungVanHoa54;
  diaBanChinh: string;
  dacTrungTrangPhuc: string;
  chatLieuKyThuat: string;
  mauChuDao: [string, string, string];
  /** Các mã trang phục 2D/3D tương ứng hoặc gần gũi nhất trong hệ thống xưởng phối */
  trangPhucIds: string[];
  /** Các mã nhomId liên kết nếu có */
  nhomIds: string[];
}

import { DAN_TOC_PART_1 } from "./dan-toc/danTocPart1";
import { DAN_TOC_PART_2 } from "./dan-toc/danTocPart2";

export const DAN_TOC_54: DanToc54Item[] = [
  ...DAN_TOC_PART_1,
  ...DAN_TOC_PART_2,
];

export const DAN_HSACH_HE_NGON_NGU: Array<{ id: "all" | HeNgonNgu54; label: string }> = [
  { id: "all", label: "Tất cả 54 dân tộc" },
  { id: "Việt - Mường", label: "Việt - Mường (4)" },
  { id: "Tày - Thái", label: "Tày - Thái (8)" },
  { id: "Mông - Dao", label: "Mông - Dao (3)" },
  { id: "Môn - Khmer", label: "Môn - Khmer (21)" },
  { id: "Nam Đảo", label: "Nam Đảo (5)" },
  { id: "Tạng - Miến", label: "Tạng - Miến (6)" },
  { id: "Ka Đai", label: "Ka Đai (4)" },
  { id: "Hán", label: "Hán (3)" },
];

/**
 * Chuẩn hóa chuỗi tiếng Việt không dấu để tìm kiếm nhanh theo tên 54 dân tộc
 */
export function boDauTiengViet(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
