/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CƠ SỞ DỮ LIỆU LỄ HỘI VĂN HÓA VIỆT NAM & SỔ THÔNG HÀNH 54 DÂN TỘC (CULTURAL PASSPORT)
 * - Gợi ý & lọc trang phục theo 6 nhóm Lễ hội – Sự kiện văn hóa lớn trong năm
 * - Quản lý bộ sưu tập 54 Con Dấu Triện Son (Sổ Thông Hành Di Sản 54 Dân Tộc)
 */

import { DAN_TOC_54, type DanToc54Item } from "./dan_toc_54";

export interface LeHoiVanHoaItem {
  id: string;
  ten: string;
  tenViTat: string;
  thoiGian: string;
  khongGian: string;
  moTaNgan: string;
  quyTacMacChuan: string;
  quyTacDanhSach: string[];
  mauSacChuDao: string;
  gradientClass: string;
  badgeColorClass: string;
  trangPhucIds: string[];
  danTocTieuBieu: string[];
}

export const LE_HOI_VIET_NAM: LeHoiVanHoaItem[] = [
  {
    id: "tet_nguyen_dan",
    ten: "Tết Nguyên Đán & Du Xuân",
    tenViTat: "Tết & Du Xuân",
    thoiGian: "Tháng Giêng Âm lịch",
    khongGian: "Đền chùa, Phố cổ, Đường hoa 3 miền",
    moTaNgan:
      "Dịp lễ cổ truyền thiêng liêng nhất trong năm; ưu tiên cổ phục và áo dài mang sắc đỏ son, vàng hoàng yến, xanh ngọc cát tường.",
    quyTacMacChuan:
      "Áo Ngũ thân / Áo Tấc cài đủ 5 khuy bên phải, mặc cùng quần trắng hoặc quần đồng sắc, đội khăn đóng và đi guốc mộc hoặc hài thêu.",
    quyTacDanhSach: [
      "Áo Ngũ thân / Áo Tấc cài đủ 5 khuy bên phải (tượng trưng Nhân – Nghĩa – Lễ – Trí – Tín).",
      "Phối cùng quần lụa trắng hoặc đồng sắc, đầu đội khăn đóng chỉnh tề khi vào đền chùa.",
      "Ưu tiên gam màu cát tường đầu năm: Đỏ son, Vàng hoàng yến, Xanh ngọc bích.",
    ],
    mauSacChuDao: "#DC2626",
    gradientClass: "from-rose-600 to-amber-600",
    badgeColorClass: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/30",
    trangPhucIds: [
      "aodai",
      "ao_dai_lemur",
      "ngu_than",
      "ao_tac",
      "ao_nhat_binh",
      "hoang_bao_nguyen",
      "phuong_bao_hoang_hau",
      "ao_menh_phu",
      "hoa_suon_xam_gam",
      "ba_ba",
      "ao_ba_ba_lanh_my_a",
    ],
    danTocTieuBieu: ["Kinh", "Hoa", "Tày", "Khmer"],
  },
  {
    id: "hoi_lim_kinh_bac",
    ten: "Hội Lim, Chùa Hương & Xuân Kinh Bắc",
    tenViTat: "Hội Lim & Kinh Bắc",
    thoiGian: "Tháng Giêng – Tháng Ba Âm lịch",
    khongGian: "Bắc Ninh, Hà Nội & Đồng bằng Bắc Bộ",
    moTaNgan:
      "Không gian hát Quan họ trên thuyền rồng và trẩy hội đầu xuân miền châu thổ sông Hồng với tà áo tứ thân, yếm đào duyên dáng.",
    quyTacMacChuan:
      "Áo tứ thân buông tà hoặc buộc hai vạt trước, bên trong mặc yếm đào thắt lưng lụa xanh/hồng, đầu vấn khăn mỏ quạ và tay nâng nón quai thao.",
    quyTacDanhSach: [
      "Áo tứ thân khoác ngoài yếm đào thắm, hai vạt trước thắt nút duyên dáng trước bụng.",
      "Thắt lưng bao lụa xanh thiên lý hoặc hồng cánh sen tạo điểm nhấn vòng eo.",
      "Đầu vấn khăn mỏ quạ kèm tóc đuôi gà, tay nâng nón ba tầm (nón quai thao).",
    ],
    mauSacChuDao: "#B45309",
    gradientClass: "from-amber-600 to-orange-600",
    badgeColorClass: "bg-amber-500/14 text-amber-800 dark:text-amber-300 border-amber-500/35",
    trangPhucIds: [
      "tu_than",
      "yem_dao",
      "ao_giao_linh",
      "ao_doi_kham",
      "ao_vien_linh",
      "ao_truc_linh",
      "sandiu_vay_la",
      "san_chay",
    ],
    danTocTieuBieu: ["Kinh", "Sán Dìu", "Sán Chay"],
  },
  {
    id: "gau_tao_long_tong",
    ten: "Lễ Hội Gầu Tào, Lồng Tồng & Chợ Tình",
    tenViTat: "Gầu Tào & Lồng Tồng",
    thoiGian: "Mùa Xuân · Tháng Giêng – Tháng Hai",
    khongGian: "Hà Giang, Lào Cai, Cao Bằng, Lạng Sơn",
    moTaNgan:
      "Bản giao hưởng sắc màu trên cao nguyên đá và núi rừng Đông – Tây Bắc với váy lanh xếp ly, áo chàm đính bạc và thổ cẩm ghép vải.",
    quyTacMacChuan:
      "Phối đúng bộ theo từng nhánh dân tộc (váy lanh xòe H'Mông đi cùng tạp dề và xà cạp; áo chàm Tày – Nùng đeo kiềng bạc và xà tích bên hông).",
    quyTacDanhSach: [
      "Phối đồng bộ theo đúng nhánh tộc người (không trộn lẫn mũ Dao Đỏ với váy H'Mông).",
      "Váy lanh xếp ly H'Mông đi kèm tạp dề thêu trước bụng và xà cạp quấn bắp chân.",
      "Áo chàm Tày – Nùng cài khuy vải bên nách phải, phối kiềng bạc cổ và xà tích bạc.",
    ],
    mauSacChuDao: "#2563EB",
    gradientClass: "from-blue-600 to-indigo-700",
    badgeColorClass: "bg-blue-500/12 text-blue-700 dark:text-blue-300 border-blue-500/30",
    trangPhucIds: [
      "mong_lanh",
      "hmong_hoa",
      "hmong_trang",
      "hmong_do",
      "hmong_den",
      "tay_cham",
      "tay_ao_luong",
      "tay_le_cuoi",
      "nung_cham",
      "nung_phan_slinh",
      "dao_do",
      "dao_tien",
      "dao_ao_dai",
      "dao_quan_trang",
      "lo_lo_hoa",
      "lolo_den",
      "pa_then",
      "pupeo_ghep_vai_mat_troi",
      "lachi_ao_tu_than_cham",
      "boy_vay_xoe",
      "giay_ao_vien",
    ],
    danTocTieuBieu: ["H'Mông", "Tày", "Nùng", "Dao", "Lô Lô", "Pà Thẻn", "Pu Péo"],
  },
  {
    id: "xoe_hoa_tay_bac",
    ten: "Lễ Hội Xòe Hoa, Hoa Ban & Sắc Núi Tây Bắc",
    tenViTat: "Lễ Hội Xòe Hoa & Hoa Ban",
    thoiGian: "Tháng Hai – Tháng Ba Âm lịch",
    khongGian: "Điện Biên, Sơn La, Lai Châu, Hòa Bình",
    moTaNgan:
      "Vòng xòe đại đoàn kết bên hoa ban trắng với áo cỏm đính cúc bướm bạc mắc pém, khăn Piêu thêu hoa và cạp váy Mường di sản.",
    quyTacMacChuan:
      "Áo cỏm ôm vừa vặn cài khuy bướm bạc chính giữa ngực, váy nhung/chàm đen thêu gấu, kết hợp khăn Piêu đội đầu và xà tích bạc.",
    quyTacDanhSach: [
      "Áo cỏm Thái cài hàng cúc bướm bạc (mắc pém) thẳng tắp chính giữa ngực.",
      "Đầu đội khăn Piêu thêu cút piêu rực rỡ, lưng thắt dây xanh lá tôn dáng thon gọn.",
      "Với trang phục Mường, phần cạp váy dệt hoa văn rồng và hình học phải nổi bật ngang eo.",
    ],
    mauSacChuDao: "#0D9488",
    gradientClass: "from-teal-600 to-emerald-700",
    badgeColorClass: "bg-teal-500/12 text-teal-700 dark:text-teal-300 border-teal-500/30",
    trangPhucIds: [
      "co_thai",
      "thai_trang",
      "thai_le_hoi_xoe",
      "lao_sinh",
      "muong_vay",
      "muong_le_phuc",
      "lu_ao_canh_buom",
      "khomu_ao_bac",
      "ha_nhi",
      "hanhi_hoa",
      "phula_dinh_cuom_y_di",
      "odu_tho_cam_to_tam",
    ],
    danTocTieuBieu: ["Thái", "Mường", "Lào", "Lự", "Khơ Mú", "Hà Nhì"],
  },
  {
    id: "kate_cong_chieng_okombok",
    ten: "Lễ Hội Katê, Cồng Chiêng & Ok Om Bok",
    tenViTat: "Lễ Katê & Cồng Chiêng",
    thoiGian: "Tháng 7 Chăm lịch & Mùa lễ hội Tây Nguyên – Nam Bộ",
    khongGian: "Tây Nguyên, Ninh Thuận & Tây Nam Bộ",
    moTaNgan:
      "Không gian di sản Tháp Chăm, Cồng chiêng đại ngàn Trường Sơn – Tây Nguyên và lễ hội Ok Om Bok rực rỡ ánh vàng lụa Sampot Hol.",
    quyTacMacChuan:
      "Tôn trọng dải hoa văn thổ cẩm nguyên bản (đai Tali Chăm thắt chéo ngực, thổ cẩm K'tăm Ê Đê / Dèng Tà Ôi đính cườm chì, dải Sbay Khmer vắt vai trái).",
    quyTacDanhSach: [
      "Lễ phục Chăm Aw Kamei chui đầu, đeo đai dệt hoa văn Tali chéo qua ngực và khăn đội đầu.",
      "Thổ cẩm Tây Nguyên (Ê Đê, Gia Rai, Ba Na, Cơ Tu, Tà Ôi) giữ nguyên nền chàm đen – đỏ – vàng.",
      "Lễ phục Khmer quấn váy lụa Sampot Hol và vắt dải khăn Sbay ánh kim qua vai trái.",
    ],
    mauSacChuDao: "#D97706",
    gradientClass: "from-amber-500 to-red-600",
    badgeColorClass: "bg-orange-500/12 text-orange-700 dark:text-orange-300 border-orange-500/30",
    trangPhucIds: [
      "cham_kate",
      "champa_tho_cam",
      "raglai_tho_cam",
      "ede_tho_cam",
      "ede_le_phuc_ktam",
      "giarai_tho_cam",
      "giarai_le_hoi_pothi",
      "bana_tho_cam",
      "mnong_tho_cam",
      "xtieng_bom_bo",
      "xodang_tho_cam",
      "caho_tho_cam",
      "cotu_tho_cam",
      "taoi_deng",
      "bru_van_kieu",
      "hre_lang_teng",
      "sampot",
      "khmer_ao_tam_vong",
    ],
    danTocTieuBieu: ["Chăm", "Ê Đê", "Gia Rai", "Ba Na", "Cơ Tu", "Tà Ôi", "Khmer"],
  },
  {
    id: "le_cuoi_ky_yeu_co_phuc",
    ten: "Lễ Cưới Truyền Thống, Đại Lễ & Kỷ Yếu Cổ Phục",
    tenViTat: "Lễ Cưới & Đại Lễ Cổ Phục",
    thoiGian: "Quanh năm · Sự kiện trọng đại",
    khongGian: "Đại Nội Huế, Hoàng Thành Thăng Long & Studio",
    moTaNgan:
      "Dành cho lễ hằng thuận, đám cưới cổ truyền, lễ tốt nghiệp và bộ ảnh kỷ yếu phục dựng uy nghi chuẩn mực cổ phục Việt Nam.",
    quyTacMacChuan:
      "Phân biệt chuẩn xác phẩm phục Cung đình (Hoàng bào, Phượng bào, Nhật Bình, Bổ tử Quan văn/võ) và lễ phục cưới truyền thống.",
    quyTacDanhSach: [
      "Áo Nhật Bình phối cùng khăn vành (hoặc mũ Cửu Phượng), cổ đeo kiềng vàng trang nhã.",
      "Phân biệt rõ Bổ tử thêu Chim (Quan Văn) và Bổ tử thêu Thú (Quan Võ) trên phẩm phục.",
      "Lễ phục giao lĩnh / viên lĩnh / đối khâm nên đi cùng hài thêu hoặc guốc mộc đồng điệu.",
    ],
    mauSacChuDao: "#7C3AED",
    gradientClass: "from-violet-600 to-purple-700",
    badgeColorClass: "bg-violet-500/12 text-violet-700 dark:text-violet-300 border-violet-500/30",
    trangPhucIds: [
      "ao_nhat_binh",
      "ao_tac",
      "hoang_bao_nguyen",
      "phuong_bao_hoang_hau",
      "ao_menh_phu",
      "ao_nghi_le_quan_van",
      "ao_nghi_le_quan_vo",
      "ao_giao_linh",
      "ao_vien_linh",
      "ao_truc_linh",
      "ao_doi_kham",
      "tay_le_cuoi",
      "muong_le_phuc",
      "aodai",
    ],
    danTocTieuBieu: ["Kinh", "Tày", "Mường"],
  },
];

/**
 * Tìm danh sách Lễ hội phù hợp với 1 mã trang phục
 */
export function layLeHoiTheoTrangPhuc(trangPhucId: string): LeHoiVanHoaItem[] {
  return LE_HOI_VIET_NAM.filter((lh) => lh.trangPhucIds.includes(trangPhucId));
}

// ============================================================================
// HỆ THỐNG SỔ THÔNG HÀNH 54 DÂN TỘC (CULTURAL PASSPORT)
// ============================================================================

const PASSPORT_STORAGE_KEY = "vpr:cultural_passport_v1";
export const PASSPORT_CHANGE_EVENT = "vpr:passport-change";

export interface PassportStampRecord {
  danTocId: string;
  stampedAt: string;
  source: "kham_pha" | "ho_so" | "tham_tu";
}

export interface CulturalPassportData {
  stamps: Record<string, PassportStampRecord>;
}

const DEFAULT_PASSPORT: CulturalPassportData = {
  stamps: {
    kinh: {
      danTocId: "kinh",
      stampedAt: new Date().toISOString().slice(0, 10),
      source: "kham_pha",
    },
  },
};

export function docSoThongHanh(): CulturalPassportData {
  if (typeof window === "undefined") return DEFAULT_PASSPORT;
  try {
    const raw = window.localStorage.getItem(PASSPORT_STORAGE_KEY);
    if (!raw) return DEFAULT_PASSPORT;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.stamps !== "object") return DEFAULT_PASSPORT;
    return parsed as CulturalPassportData;
  } catch {
    return DEFAULT_PASSPORT;
  }
}

export function luuSoThongHanh(data: CulturalPassportData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(PASSPORT_CHANGE_EVENT, { detail: data }));
  } catch {
    // ignore
  }
}

/**
 * Đóng dấu mộc đỏ cho 1 dân tộc cụ thể vào Sổ Thông Hành
 */
export function dongDauDanToc(
  danTocId: string,
  source: "kham_pha" | "ho_so" | "tham_tu" = "kham_pha"
): { isNew: boolean; data: CulturalPassportData; danToc?: DanToc54Item } {
  const current = docSoThongHanh();
  const danToc = DAN_TOC_54.find((d) => d.id === danTocId);
  if (!danToc) {
    return { isNew: false, data: current };
  }
  const already = Boolean(current.stamps[danTocId]);
  if (already) {
    return { isNew: false, data: current, danToc };
  }
  const next: CulturalPassportData = {
    stamps: {
      ...current.stamps,
      [danTocId]: {
        danTocId,
        stampedAt: new Date().toISOString().slice(0, 10),
        source,
      },
    },
  };
  luuSoThongHanh(next);
  return { isNew: true, data: next, danToc };
}

/**
 * Đóng dấu các dân tộc liên quan khi người dùng xem Hồ sơ 1 trang phục
 */
export function dongDauTheoTrangPhuc(
  trangPhucId: string,
  source: "ho_so" | "tham_tu" = "ho_so"
): { newlyStamped: DanToc54Item[]; data: CulturalPassportData } {
  const current = docSoThongHanh();
  const matched = DAN_TOC_54.filter((d) => d.trangPhucIds.includes(trangPhucId));
  const newlyStamped: DanToc54Item[] = [];
  const nextStamps = { ...current.stamps };
  const today = new Date().toISOString().slice(0, 10);

  // Khi xem hồ sơ trang phục, mở khóa dân tộc tiêu biểu đầu tiên chưa có dấu của trang phục đó
  for (const dt of matched) {
    if (!nextStamps[dt.id]) {
      nextStamps[dt.id] = {
        danTocId: dt.id,
        stampedAt: today,
        source,
      };
      newlyStamped.push(dt);
      break;
    }
  }

  const next = { stamps: nextStamps };
  if (newlyStamped.length > 0) {
    luuSoThongHanh(next);
  }
  return { newlyStamped, data: next };
}

/**
 * Thưởng ngẫu nhiên 1 con dấu Dân tộc chưa mở khóa khi trả lời đúng trong Thám Tử Văn Hóa
 */
export function thuongDauThamTuNgauNhien(): {
  newlyStamped: DanToc54Item | null;
  data: CulturalPassportData;
} {
  const current = docSoThongHanh();
  const unstamped = DAN_TOC_54.filter((d) => !current.stamps[d.id]);
  if (unstamped.length === 0) {
    return { newlyStamped: null, data: current };
  }
  const chosen = unstamped[Math.floor(Math.random() * unstamped.length)];
  const res = dongDauDanToc(chosen.id, "tham_tu");
  return { newlyStamped: chosen, data: res.data };
}

export function layDanhHieuSoThongHanh(count: number): {
  danhHieu: string;
  moTa: string;
  nextTarget: number;
} {
  if (count >= 54) {
    return {
      danhHieu: "Đại Sứ Di Sản 54 Dân Tộc",
      moTa: "Đã sưu tầm trọn vẹn 54/54 con dấu triện son sắc phục đại gia đình các dân tộc Việt Nam!",
      nextTarget: 54,
    };
  }
  if (count >= 35) {
    return {
      danhHieu: "Học Giả Bách Khoa Sắc Phục",
      moTa: "Am tường sâu sắc hệ ngôn ngữ và kỹ thuật dệt thêu khắp các vùng văn hóa.",
      nextTarget: 54,
    };
  }
  if (count >= 20) {
    return {
      danhHieu: "Người Giữ Lửa Thổ Cẩm",
      moTa: "Đã đặt dấu chân khám phá hơn một nửa bản đồ văn hóa các dân tộc Việt Nam.",
      nextTarget: 35,
    };
  }
  if (count >= 10) {
    return {
      danhHieu: "Sứ Giả Bản Làng",
      moTa: "Hành trình kết nối sắc phục từ đồng bằng lên núi cao đang rộng mở.",
      nextTarget: 20,
    };
  }
  return {
    danhHieu: "Lữ Khách Khởi Hành",
    moTa: "Khám phá hồ sơ dân tộc hoặc giải đố Thám Tử Văn Hóa để sưu tầm đủ 54 con dấu triện son.",
    nextTarget: 10,
  };
}
