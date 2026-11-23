/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from "react";
import AvatarSVG from "./AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "./GarmentLayers";
import { NhanVatConfig, tinhSoDo } from "../lib/avatar";
import { layThemeHienTai, THEME_CHANGE_EVENT, ThemeMode } from "../lib/theme";

interface CostumeCardPreviewProps {
  trangPhucId: string;
  className?: string;
  enableFlip?: boolean;
  archivalCode?: string;
}

const COSTUME_STYLES_DARK: Record<string, string> = {
  aodai: "linear-gradient(180deg, #1C0F18 0%, #151F2F 65%, #0B192E 100%)",
  ngu_than: "linear-gradient(180deg, #241C0E 0%, #1A2331 55%, #0B192E 100%)",
  tu_than: "linear-gradient(180deg, #22140D 0%, #19202E 60%, #0B192E 100%)",
  ba_ba: "linear-gradient(180deg, #0D2218 0%, #10262E 60%, #0B192E 100%)",
  co_thai: "linear-gradient(180deg, #141E28 0%, #122234 50%, #0B192E 100%)",
  mong_lanh: "linear-gradient(180deg, #0E1A33 0%, #11223F 60%, #0B192E 100%)",
  ede_tho_cam: "linear-gradient(180deg, #131A24 0%, #152232 60%, #0B192E 100%)",
  champa_tho_cam: "linear-gradient(180deg, #28200B 0%, #1B2332 60%, #0B192E 100%)",
  sampot: "linear-gradient(180deg, #241D0C 0%, #1A2332 60%, #0B192E 100%)",
  ao_tac: "linear-gradient(180deg, #10243E 0%, #162238 60%, #0B192E 100%)",
  ao_giao_linh: "linear-gradient(180deg, #271511 0%, #1B2232 60%, #0B192E 100%)",
  dao_do: "linear-gradient(180deg, #2B1015 0%, #182032 60%, #0B192E 100%)",
  tay_cham: "linear-gradient(180deg, #0D1B30 0%, #112238 60%, #0B192E 100%)",
  muong_vay: "linear-gradient(180deg, #1D1E14 0%, #162330 60%, #0B192E 100%)",
  lo_lo_hoa: "linear-gradient(180deg, #291422 0%, #182236 60%, #0B192E 100%)",
  ha_nhi: "linear-gradient(180deg, #0E1F38 0%, #13253C 60%, #0B192E 100%)",
  pa_then: "linear-gradient(180deg, #2D1114 0%, #1B1E30 60%, #0B192E 100%)",
  bana_tho_cam: "linear-gradient(180deg, #1B1822 0%, #152131 60%, #0B192E 100%)",
  caho_tho_cam: "linear-gradient(180deg, #1E1A16 0%, #142232 60%, #0B192E 100%)",
  ao_nhat_binh: "linear-gradient(180deg, #2B1A0E 0%, #1B2234 60%, #0B192E 100%)",
  ao_vien_linh: "linear-gradient(180deg, #12241B 0%, #152332 60%, #0B192E 100%)",
  ao_doi_kham: "linear-gradient(180deg, #28141E 0%, #182234 60%, #0B192E 100%)",
  yem_dao: "linear-gradient(180deg, #291215 0%, #1A2130 60%, #0B192E 100%)",
  dao_tien: "linear-gradient(180deg, #101E36 0%, #14243B 60%, #0B192E 100%)",
  nung_cham: "linear-gradient(180deg, #0E1C32 0%, #12233A 60%, #0B192E 100%)",
  san_chay: "linear-gradient(180deg, #112233 0%, #152538 60%, #0B192E 100%)",
  cotu_tho_cam: "linear-gradient(180deg, #241418 0%, #162132 60%, #0B192E 100%)",
  giarai_tho_cam: "linear-gradient(180deg, #261515 0%, #162232 60%, #0B192E 100%)",
  mnong_tho_cam: "linear-gradient(180deg, #151E2E 0%, #142334 60%, #0B192E 100%)",
  xodang_tho_cam: "linear-gradient(180deg, #221618 0%, #152132 60%, #0B192E 100%)",
  thai_trang: "linear-gradient(180deg, #162230 0%, #112438 60%, #0B192E 100%)",
  tay_ao_luong: "linear-gradient(180deg, #0D192B 0%, #102036 60%, #0B192E 100%)",
  nung_phan_slinh: "linear-gradient(180deg, #0F1E36 0%, #13243B 60%, #0B192E 100%)",
  muong_le_phuc: "linear-gradient(180deg, #231F14 0%, #172330 60%, #0B192E 100%)",
  hmong_hoa: "linear-gradient(180deg, #2B131D 0%, #172236 60%, #0B192E 100%)",
  hmong_trang: "linear-gradient(180deg, #152234 0%, #12243A 60%, #0B192E 100%)",
  dao_ao_dai: "linear-gradient(180deg, #111F38 0%, #15233A 60%, #0B192E 100%)",
  lolo_den: "linear-gradient(180deg, #221524 0%, #162135 60%, #0B192E 100%)",
  hanhi_hoa: "linear-gradient(180deg, #261420 0%, #14243B 60%, #0B192E 100%)",
  bru_van_kieu: "linear-gradient(180deg, #251517 0%, #162132 60%, #0B192E 100%)",
  taoi_deng: "linear-gradient(180deg, #271319 0%, #162234 60%, #0B192E 100%)",
  hre_lang_teng: "linear-gradient(180deg, #261616 0%, #152132 60%, #0B192E 100%)",
  cham_kate: "linear-gradient(180deg, #262010 0%, #192332 60%, #0B192E 100%)",
  khmer_ao_tam_vong: "linear-gradient(180deg, #29181E 0%, #1A2334 60%, #0B192E 100%)",
  lao_sinh: "linear-gradient(180deg, #281B0F 0%, #182334 60%, #0B192E 100%)",
  giay_ao_vien: "linear-gradient(180deg, #102438 0%, #15253A 60%, #0B192E 100%)",
  sandiu_vay_la: "linear-gradient(180deg, #132034 0%, #152438 60%, #0B192E 100%)",
  boy_vay_xoe: "linear-gradient(180deg, #112338 0%, #14253B 60%, #0B192E 100%)",
  hoang_bao_nguyen: "linear-gradient(180deg, #2D220A 0%, #1D2335 60%, #0B192E 100%)",
  phuong_bao_hoang_hau: "linear-gradient(180deg, #2B1316 0%, #1B2134 60%, #0B192E 100%)",
  ao_menh_phu: "linear-gradient(180deg, #2B1218 0%, #1A2134 60%, #0B192E 100%)",
  ao_nghi_le_quan_van: "linear-gradient(180deg, #11233D 0%, #152338 60%, #0B192E 100%)",
  ao_nghi_le_quan_vo: "linear-gradient(180deg, #291315 0%, #192134 60%, #0B192E 100%)",
  ao_truc_linh: "linear-gradient(180deg, #241912 0%, #172232 60%, #0B192E 100%)",
  ao_ba_ba_lanh_my_a: "linear-gradient(180deg, #161A24 0%, #132232 60%, #0B192E 100%)",
  ao_dai_lemur: "linear-gradient(180deg, #261422 0%, #182234 60%, #0B192E 100%)",
  hoa_suon_xam_gam: "linear-gradient(180deg, #2C1116 0%, #1B2133 60%, #0B192E 100%)",
  dao_quan_trang: "linear-gradient(180deg, #112138 0%, #14243B 60%, #0B192E 100%)",
  hmong_do: "linear-gradient(180deg, #2B121B 0%, #172236 60%, #0B192E 100%)",
  hmong_den: "linear-gradient(180deg, #0E1B32 0%, #12233A 60%, #0B192E 100%)",
  tay_le_cuoi: "linear-gradient(180deg, #101F36 0%, #14253B 60%, #0B192E 100%)",
  thai_le_hoi_xoe: "linear-gradient(180deg, #10243A 0%, #14263C 60%, #0B192E 100%)",
  ede_le_phuc_ktam: "linear-gradient(180deg, #261416 0%, #162234 60%, #0B192E 100%)",
  giarai_le_hoi_pothi: "linear-gradient(180deg, #281515 0%, #172234 60%, #0B192E 100%)",
  raglai_tho_cam: "linear-gradient(180deg, #261B12 0%, #182334 60%, #0B192E 100%)",
  xtieng_bom_bo: "linear-gradient(180deg, #251518 0%, #162234 60%, #0B192E 100%)",
  khomu_ao_bac: "linear-gradient(180deg, #151E2E 0%, #142438 60%, #0B192E 100%)",
  lu_ao_canh_buom: "linear-gradient(180deg, #122138 0%, #15253A 60%, #0B192E 100%)",
  lachi_ao_tu_than_cham: "linear-gradient(180deg, #101E34 0%, #13233A 60%, #0B192E 100%)",
  phula_dinh_cuom_y_di: "linear-gradient(180deg, #26141C 0%, #162338 60%, #0B192E 100%)",
  pupeo_ghep_vai_mat_troi: "linear-gradient(180deg, #281612 0%, #172236 60%, #0B192E 100%)",
  odu_tho_cam_to_tam: "linear-gradient(180deg, #182230 0%, #142538 60%, #0B192E 100%)",
};

const COSTUME_STYLES: Record<
  string,
  {
    mauHex: string;
    phuKienIds: string[];
    gioi: "nu" | "nam";
    toc: string;
    bgGradient: string;
  }
> = {
  aodai: {
    mauHex: "#DC2626", // Đỏ son truyền thống
    phuKienIds: ["non_la"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEF9C3 65%, #F0FDF4 100%)",
  },
  ngu_than: {
    mauHex: "#CA8A04", // Hoàng yến / Vàng nghệ
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #FEF9C3 0%, #FEF08A 55%, #F0FDF4 100%)",
  },
  tu_than: {
    mauHex: "#B45309", // Nâu sồng / Đất nung
    phuKienIds: ["khan_mo_qua"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 60%, #F0FDF4 100%)",
  },
  ba_ba: {
    mauHex: "#15803D", // Xanh lá mạ / chàm Nam Bộ
    phuKienIds: ["khan_ran"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 60%, #FEF9C3 100%)",
  },
  co_thai: {
    mauHex: "#1E293B", // Áo cỏm Thái Đen
    phuKienIds: ["khan_pieu"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 50%, #DCFCE7 100%)",
  },
  mong_lanh: {
    mauHex: "#1E3A8A", // Chàm lanh thêu hoa
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 60%, #FEF9C3 100%)",
  },
  ede_tho_cam: {
    mauHex: "#0F172A", // Thổ cẩm Tây Nguyên
    phuKienIds: [],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 60%, #FEF9C3 100%)",
  },
  champa_tho_cam: {
    mauHex: "#EAB308", // Thổ cẩm Chăm vàng óng
    phuKienIds: ["khan_cham"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #FEF9C3 0%, #FDE047 60%, #F0FDF4 100%)",
  },
  sampot: {
    mauHex: "#CA8A04", // Sampot dệt chỉ vàng
    phuKienIds: [],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF9C3 0%, #FEF08A 60%, #DCFCE7 100%)",
  },
  ao_tac: {
    mauHex: "#1D4ED8", // Lam triều Nguyễn đại lễ
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 60%, #FEF9C3 100%)",
  },
  ao_nhat_binh: {
    mauHex: "#EAB308", // Hoàng bào / Nhật Bình cung đình
    phuKienIds: ["khan_dong"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF9C3 0%, #FDE68A 60%, #FEF2F2 100%)",
  },
  ao_giao_linh: {
    mauHex: "#991B1B", // Đỏ trầm cổ phục Lê - Nguyễn
    phuKienIds: ["non_quai_thao"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FDE68A 60%, #F0FDF4 100%)",
  },
  ao_vien_linh: {
    mauHex: "#15803D", // Xanh lục cổ phục Lý - Trần - Lê
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 60%, #FEF9C3 100%)",
  },
  ao_doi_kham: {
    mauHex: "#DB2777", // Hồng sen đối khâm
    phuKienIds: ["non_quai_thao"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 60%, #FEF9C3 100%)",
  },
  yem_dao: {
    mauHex: "#DC2626", // Yếm đào truyền thống
    phuKienIds: ["khan_mo_qua"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 60%, #FEF9C3 100%)",
  },
  dao_do: {
    mauHex: "#1E293B", // Chàm thêu bông đỏ Dao Đỏ
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 60%, #FEF9C3 100%)",
  },
  dao_tien: {
    mauHex: "#1E3A8A", // Chàm in sáp ong Dao Tiền
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 60%, #F0FDF4 100%)",
  },
  tay_cham: {
    mauHex: "#1E3A8A", // Áo chàm Tày thanh nhã
    phuKienIds: ["kieng_bac", "non_la"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #E0F2FE 60%, #F0FDF4 100%)",
  },
  nung_cham: {
    mauHex: "#1E40AF", // Áo chàm Nùng xứ Lạng
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 60%, #FEF9C3 100%)",
  },
  san_chay: {
    mauHex: "#1D4ED8", // Áo chàm phối xanh Sán Chay
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 60%, #F0FDF4 100%)",
  },
  muong_vay: {
    mauHex: "#F8FAFC", // Áo pắn trắng & cạp váy Mường
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEFCE8 0%, #FEF3C7 60%, #DCFCE7 100%)",
  },
  lo_lo_hoa: {
    mauHex: "#1E293B", // Ghép vải tam giác đa sắc Lô Lô Hoa
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 60%, #FEF9C3 100%)",
  },
  ha_nhi: {
    mauHex: "#1E3A8A", // Chàm xanh thêu nổi Hà Nhì
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 60%, #F0FDF4 100%)",
  },
  pa_then: {
    mauHex: "#DC2626", // Đỏ lửa thiêng Pà Thẻn
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 60%, #FEF9C3 100%)",
  },
  cotu_tho_cam: {
    mauHex: "#0F172A", // Dệt Zèng Cơ Tu đính cườm
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFF1F2 0%, #F1F5F9 60%, #FEF3C7 100%)",
  },
  bana_tho_cam: {
    mauHex: "#0F172A", // Thổ cẩm Ba Na đen - đỏ
    phuKienIds: [],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 60%, #FEF3C7 100%)",
  },
  giarai_tho_cam: {
    mauHex: "#991B1B", // Thổ cẩm Gia Rai đỏ - chàm
    phuKienIds: [],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 60%, #FEF3C7 100%)",
  },
  mnong_tho_cam: {
    mauHex: "#1E293B", // Thổ cẩm M'Nông
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 60%, #DCFCE7 100%)",
  },
  xodang_tho_cam: {
    mauHex: "#7F1D1D", // Thổ cẩm Xơ Đăng Ngọc Linh
    phuKienIds: [],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #F1F5F9 60%, #FEF3C7 100%)",
  },
  caho_tho_cam: {
    mauHex: "#F8FAFC", // Thổ cẩm Cơ Ho trắng ngà - chàm
    phuKienIds: [],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 60%, #DCFCE7 100%)",
  },
  thai_trang: {
    mauHex: "#F8FAFC", // Áo cỏm Thái Trắng
    phuKienIds: ["khan_pieu", "kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 55%, #FEF9C3 100%)",
  },
  tay_ao_luong: {
    mauHex: "#0F172A", // Áo lương Tày chàm đen
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 60%, #DCFCE7 100%)",
  },
  nung_phan_slinh: {
    mauHex: "#1D4ED8", // Nùng Phàn Slình
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 60%, #DCFCE7 100%)",
  },
  muong_le_phuc: {
    mauHex: "#FEF3C7", // Lễ phục Mường áo chùng
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFFBEB 0%, #FDE68A 60%, #DCFCE7 100%)",
  },
  hmong_hoa: {
    mauHex: "#DC2626", // H'Mông Hoa rực rỡ
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFF1F2 0%, #FCE7F3 60%, #FEF9C3 100%)",
  },
  hmong_trang: {
    mauHex: "#F8FAFC", // H'Mông Trắng váy lanh trắng
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #E0F2FE 60%, #F0FDF4 100%)",
  },
  dao_ao_dai: {
    mauHex: "#0284C7", // Dao Áo Dài / Dao Thanh Y
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F0F9FF 0%, #BAE6FD 60%, #FEF9C3 100%)",
  },
  lolo_den: {
    mauHex: "#312E81", // Lô Lô Đen Bảo Lạc
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EEF2FF 0%, #E0E7FF 60%, #FEF3C7 100%)",
  },
  hanhi_hoa: {
    mauHex: "#0369A1", // Hà Nhì Hoa tua rua
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F0F9FF 0%, #FFE4E6 60%, #FEF9C3 100%)",
  },
  bru_van_kieu: {
    mauHex: "#991B1B", // Bru - Vân Kiều đính bạc
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 60%, #F0FDF4 100%)",
  },
  taoi_deng: {
    mauHex: "#7F1D1D", // Tà Ôi dệt Dèng A Lưới
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 60%, #FEF3C7 100%)",
  },
  hre_lang_teng: {
    mauHex: "#B91C1C", // Hrê thổ cẩm Làng Teng
    phuKienIds: [],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #F1F5F9 60%, #FEF9C3 100%)",
  },
  cham_kate: {
    mauHex: "#F8FAFC", // Lễ phục Chăm Katê trắng ngà
    phuKienIds: ["khan_cham"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 60%, #F0FDF4 100%)",
  },
  khmer_ao_tam_vong: {
    mauHex: "#DB2777", // Áo Tầm Vông & Sampot Hol
    phuKienIds: [],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FDF2F8 0%, #FEF08A 60%, #F0FDF4 100%)",
  },
  lao_sinh: {
    mauHex: "#D97706", // Váy Sinh Lào vàng cam thổ cẩm
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFFBEB 0%, #FDE68A 60%, #FEF2F2 100%)",
  },
  giay_ao_vien: {
    mauHex: "#0284C7", // Áo Giáy xanh lam viền hồng
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F0F9FF 0%, #FCE7F3 60%, #F0FDF4 100%)",
  },
  sandiu_vay_la: {
    mauHex: "#1E3A8A", // Sán Dìu áo chàm váy lá
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #FEE2E2 60%, #F0FDF4 100%)",
  },
  boy_vay_xoe: {
    mauHex: "#0369A1", // Bố Y Quản Bạ
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 60%, #FEF9C3 100%)",
  },
  hoang_bao_nguyen: {
    mauHex: "#EAB308", // Hoàng bào chính hoàng cung đình Huế
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #FEF9C3 0%, #FDE047 60%, #FEF2F2 100%)",
  },
  phuong_bao_hoang_hau: {
    mauHex: "#DC2626", // Phượng bào đỏ xích tối cao
    phuKienIds: ["khan_dong"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FDE68A 60%, #FFFBEB 100%)",
  },
  ao_menh_phu: {
    mauHex: "#B91C1C", // Nhật Bình chu sa mệnh phụ
    phuKienIds: ["khan_dong"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 60%, #FEF3C7 100%)",
  },
  ao_nghi_le_quan_van: {
    mauHex: "#1E40AF", // Triều phục quan văn bổ tử tiên hạc
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 60%, #FEF9C3 100%)",
  },
  ao_nghi_le_quan_vo: {
    mauHex: "#991B1B", // Triều phục võ tướng bổ tử kỳ lân
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 60%, #FEF3C7 100%)",
  },
  ao_truc_linh: {
    mauHex: "#78350F", // Áo trực lĩnh Lý - Trần - Lê
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 60%, #ECFDF5 100%)",
  },
  ao_ba_ba_lanh_my_a: {
    mauHex: "#1E293B", // Lãnh Mỹ A đen huyền óng ả
    phuKienIds: ["khan_ran", "non_la"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #FEF3C7 60%, #DCFCE7 100%)",
  },
  ao_dai_lemur: {
    mauHex: "#EC4899", // Áo dài Lemur hồng phấn tân thời
    phuKienIds: ["non_la"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 60%, #FEF9C3 100%)",
  },
  hoa_suon_xam_gam: {
    mauHex: "#DC2626", // Áo đại khâm & sườn xám gấm đỏ dân tộc Hoa
    phuKienIds: [],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FDE68A 60%, #FFFBEB 100%)",
  },
  dao_quan_trang: {
    mauHex: "#1E3A8A", // Dao Quần Trắng yếm thêu lớn
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #DBEAFE 60%, #FEF2F2 100%)",
  },
  hmong_do: {
    mauHex: "#BE123C", // H'Mông Đỏ (Mông Si)
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 60%, #FEF3C7 100%)",
  },
  hmong_den: {
    mauHex: "#0F172A", // H'Mông Đen lanh chàm ánh đồng
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #E2E8F0 60%, #F0FDF4 100%)",
  },
  tay_le_cuoi: {
    mauHex: "#1D4ED8", // Lễ phục cưới Tày - Nùng
    phuKienIds: ["kieng_bac", "non_la"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #FCE7F3 60%, #FEF9C3 100%)",
  },
  thai_le_hoi_xoe: {
    mauHex: "#0284C7", // Lễ phục Xòe Hoa Thái áo cỏm lam
    phuKienIds: ["khan_pieu", "kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 60%, #FEF9C3 100%)",
  },
  ede_le_phuc_ktam: {
    mauHex: "#7F1D1D", // Đại lễ Ê Đê K'tăm
    phuKienIds: [],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 60%, #FEF3C7 100%)",
  },
  giarai_le_hoi_pothi: {
    mauHex: "#B91C1C", // Đại lễ Gia Rai Pơ Thi
    phuKienIds: [],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #FFF1F2 0%, #FDE68A 60%, #F1F5F9 100%)",
  },
  raglai_tho_cam: {
    mauHex: "#991B1B", // Ra Glai & chuỗi cườm Mã la
    phuKienIds: ["khan_cham"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFFBEB 0%, #FEE2E2 60%, #F0FDF4 100%)",
  },
  xtieng_bom_bo: {
    mauHex: "#7F1D1D", // Xtiêng thổ cẩm Sóc Bom Bo
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #E2E8F0 60%, #FEF3C7 100%)",
  },
  khomu_ao_bac: {
    mauHex: "#1E293B", // Khơ Mú đính bạc & cườm ngũ sắc
    phuKienIds: ["khan_pieu", "kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #FFE4E6 60%, #FEF9C3 100%)",
  },
  lu_ao_canh_buom: {
    mauHex: "#1E3A8A", // Dân tộc Lự áo cánh bướm váy 3 tầng
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #FEF3C7 60%, #FFF1F2 100%)",
  },
  lachi_ao_tu_than_cham: {
    mauHex: "#1E293B", // La Chí áo tứ thân chàm & yếm thêu
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F1F5F9 0%, #FEE2E2 60%, #FEF9C3 100%)",
  },
  phula_dinh_cuom_y_di: {
    mauHex: "#991B1B", // Phù Lá / Xá Phó đính hạt ý dĩ rừng
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFF1F2 0%, #E0F2FE 60%, #FEF9C3 100%)",
  },
  pupeo_ghep_vai_mat_troi: {
    mauHex: "#DC2626", // Pu Péo tạp dề ghép vải mặt trời
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEF08A 60%, #EFF6FF 100%)",
  },
  odu_tho_cam_to_tam: {
    mauHex: "#0F172A", // Ơ Đu váy tơ tằm & thổ cẩm xứ Nghệ
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #FEF3C7 60%, #DCFCE7 100%)",
  },
};

export default function CostumeCardPreview({
  trangPhucId,
  className = "",
  enableFlip = true,
  archivalCode,
}: CostumeCardPreviewProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(layThemeHienTai);
  const [huongNhin, setHuongNhin] = useState<"truoc" | "sau">("truoc");

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      if (customEvent.detail?.theme) {
        setThemeMode(customEvent.detail.theme);
      } else {
        setThemeMode(layThemeHienTai());
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const cfg = COSTUME_STYLES[trangPhucId] || COSTUME_STYLES.aodai;
  const isDark = themeMode === "dark";
  const darkGradient = COSTUME_STYLES_DARK[trangPhucId] || "linear-gradient(180deg, #102542 0%, #0B192E 100%)";
  const activeBg = isDark ? darkGradient : cfg.bgGradient;

  const nhanVat: NhanVatConfig = useMemo(
    () => ({
      tuoi: "nguoi_lon",
      gioi: cfg.gioi,
      vocDang: "trung_binh",
      tongDa: 3,
      toc: cfg.toc,
      huongNhin,
    }),
    [cfg.gioi, cfg.toc, huongNhin]
  );

  const soDo = useMemo(() => tinhSoDo(nhanVat), [nhanVat]);

  const garmentLayers = useMemo(() => {
    return renderGarmentLayers({
      trangPhucId,
      soDo,
      mauHex: cfg.mauHex,
      phuKienIds: cfg.phuKienIds,
      huongNhin,
    });
  }, [trangPhucId, soDo, cfg.mauHex, cfg.phuKienIds, huongNhin]);

  return (
    <div
      className={`costume-card-preview relative w-full h-[270px] sm:h-[295px] flex items-center justify-center overflow-hidden rounded-t-[14px] select-none ${className}`}
      style={{
        background: activeBg,
        ["--dark-card-gradient" as any]: darkGradient,
      }}
    >
      {/* Nền hoa văn mờ nhạt Đông Sơn */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #15803D 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      {/* Hiệu ứng hào quang dịu nhẹ */}
      <div
        className="absolute w-44 h-44 rounded-full blur-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(234, 179, 8, 0.28) 0%, transparent 70%)",
          top: "15%",
        }}
        aria-hidden="true"
      />

      {/* Nút xoay Trước / Sau nhanh ngay trên thẻ */}
      {enableFlip && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setHuongNhin((prev) => (prev === "truoc" ? "sau" : "truoc"));
          }}
          className="absolute bottom-2.5 right-2.5 z-20 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-emerald-900 dark:text-emerald-200 border border-emerald-500/35 shadow-xs hover:bg-emerald-600 hover:text-white transition cursor-pointer flex items-center gap-1"
          title="Xoay xem mặt trước / mặt sau"
        >
          <span>{huongNhin === "truoc" ? "Mặt sau" : "Mặt trước"}</span>
        </button>
      )}

      {/* Hình minh hoạ trang phục */}
      <div className="relative z-10 w-full h-full flex items-center justify-center transform scale-[1.0] group-hover:scale-[1.03] transition-transform duration-500 ease-out py-1 px-1">
        <AvatarSVG
          nhanVat={nhanVat}
          scalePreset="md"
          customViewBox="80 -65 240 780"
          className="w-full h-full drop-shadow-md"
          childrenDefs={<CulturalPatternsDefs />}
          childrenVayQuan={garmentLayers.childrenVayQuan}
          childrenAo={garmentLayers.childrenAo}
          childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
          childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
        />
      </div>
    </div>
  );
}
