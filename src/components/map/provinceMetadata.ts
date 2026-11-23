/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DANH SÁCH & THÔNG TIN CHI TIẾT 34 TỈNH THÀNH VIỆT NAM (QĐ 19/2025/QĐ-TTg)
 * Dữ liệu chuẩn xác 100% kết nối với di sản trang phục truyền thống từng vùng
 */

import { Province34, RegionInfo } from "./types";

export const REGIONS_INFO: Record<string, RegionInfo> = {
  bac: {
    id: "bac",
    name: "Bắc Bộ",
    shortName: "Miền Bắc",
    provincesCount: 15,
    colorHex: "#15803D",
    accentHex: "#86EFAC",
    description: "Cái nôi ngàn năm văn hiến, áo tứ thân quan họ, áo dài Hà thành và thổ cẩm vùng cao",
  },
  trung: {
    id: "trung",
    name: "Trung Bộ",
    shortName: "Miền Trung",
    provincesCount: 8,
    colorHex: "#CA8A04",
    accentHex: "#FDE047",
    description: "Kinh đô Huế cổ kính, áo ngũ thân lập lĩnh chuẩn mực và di sản dệt thổ cẩm Chăm Pa",
  },
  taynguyen: {
    id: "taynguyen",
    name: "Tây Nguyên",
    shortName: "Tây Nguyên",
    provincesCount: 3,
    colorHex: "#C2410C",
    accentHex: "#FDBA74",
    description: "Đại ngàn cồng chiêng, hoa văn thổ cẩm Ê Đê, Jrai, Ba Na rực rỡ nắng gió bazan",
  },
  nam: {
    id: "nam",
    name: "Nam Bộ",
    shortName: "Miền Nam",
    provincesCount: 8,
    colorHex: "#0D9488",
    accentHex: "#99F6E4",
    description: "Sông nước Cửu Long trù phú, áo bà ba mộc mạc, khăn rằn và nếp sampot Khmer rực rỡ",
  },
};

import { PROVINCES_BAC } from "./provincesBac";
import { PROVINCES_TRUNG_NAM } from "./provincesTrungTayNguyenNam";

export const PROVINCES_34_LIST: Province34[] = [
  ...PROVINCES_BAC,
  ...PROVINCES_TRUNG_NAM,
];

export const PROVINCES_34_BY_ID: Record<string, Province34> = Object.fromEntries(
  PROVINCES_34_LIST.map((p) => [p.id, p])
);

export const PROVINCES_BY_REGION: Record<string, Province34[]> = {
  bac: PROVINCES_34_LIST.filter((p) => p.region === "bac"),
  trung: PROVINCES_34_LIST.filter((p) => p.region === "trung"),
  taynguyen: PROVINCES_34_LIST.filter((p) => p.region === "taynguyen"),
  nam: PROVINCES_34_LIST.filter((p) => p.region === "nam"),
};
