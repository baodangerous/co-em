import { trangPhuc } from "../../data/trangphuc";
import { nhom } from "../../data/nhom";
import { domdom } from "../../copy/coem";
import type { TrangPhuc } from "../../types";
import { TEN_THOI_TIET } from "./weatherOccasionRules";

export interface GoiYQueNhaItem {
  trangPhuc: TrangPhuc;
  score: number;
  lyDoGoiY: string[];
  goiYPhoiMau: string;
  goiYPhuKien: string;
  mauMacDinh: string;
  phuKienMacDinh: string[];
}

const CHI_TIET_PHOI_GOI_Y: Record<
  string,
  { mau: string; phuKien: string; mauId: string; phuKienIds: string[] }
> = {
  aodai: {
    mau: "Đỏ son hoặc Vàng lúa chín",
    phuKien: "Nón lá bài thơ, Kiềng bạc cung đình",
    mauId: "m_do",
    phuKienIds: ["non_la", "vong_bac"],
  },
  ngu_than: {
    mau: "Vàng nghệ hoàng gia hoặc Chàm cổ điển",
    phuKien: "Khăn đóng chữ Nhất, Trâm cài",
    mauId: "m_vang",
    phuKienIds: ["khan_dong"],
  },
  ao_tac: {
    mau: "Chàm lam triều Nguyễn hoặc Đỏ đại lễ",
    phuKien: "Khăn đóng đại lễ, Kiềng bạc",
    mauId: "m_cham",
    phuKienIds: ["khan_dong", "vong_bac"],
  },
  ao_giao_linh: {
    mau: "Đỏ trầm cổ phong hoặc Vàng gấm",
    phuKien: "Nón quai thao, Trâm cài",
    mauId: "m_do",
    phuKienIds: ["non_quai_thao", "tram_cai"],
  },
  tu_than: {
    mau: "Nâu non mộc mạc phối Yếm đào đỏ",
    phuKien: "Khăn mỏ quạ, Nón quai thao",
    mauId: "m_nau",
    phuKienIds: ["khan_mo_qua", "non_quai_thao"],
  },
  ba_ba: {
    mau: "Chàm mạ mát dịu hoặc Trắng ngà",
    phuKien: "Khăn rằn Nam Bộ, Nón lá",
    mauId: "m_cham",
    phuKienIds: ["khan_ran", "non_la"],
  },
  muong_vay: {
    mau: "Trắng ngà phối Cạp váy thổ cẩm Đông Sơn",
    phuKien: "Vòng bạc chạm khắc, Khăn trắng",
    mauId: "m_trang",
    phuKienIds: ["vong_bac"],
  },
  co_thai: {
    mau: "Trắng hoa ban hoặc Chàm thẫm",
    phuKien: "Khăn piêu thêu hoa, Vòng bạc Tây Bắc",
    mauId: "m_trang",
    phuKienIds: ["khan_pieu", "vong_bac"],
  },
  mong_lanh: {
    mau: "Chàm sáp ong phối Đỏ thổ cẩm",
    phuKien: "Vòng kiềng bạc đúc",
    mauId: "m_cham",
    phuKienIds: ["vong_bac"],
  },
  dao_do: {
    mau: "Chàm thêu chỉ đỏ rực rỡ",
    phuKien: "Khăn vấn đỏ tua bông, Kiềng bạc",
    mauId: "m_do",
    phuKienIds: ["vong_bac"],
  },
  tay_cham: {
    mau: "Chàm xanh đen tự nhiên",
    phuKien: "Kiềng bạc mảnh, Nón lá",
    mauId: "m_cham",
    phuKienIds: ["vong_bac", "non_la"],
  },
  lo_lo_hoa: {
    mau: "Đỏ cam ghép vải tam giác ngũ sắc",
    phuKien: "Kiềng bạc, Khăn sừng trâu",
    mauId: "m_do",
    phuKienIds: ["vong_bac"],
  },
  ha_nhi: {
    mau: "Chàm kép đính xu bạc",
    phuKien: "Vòng bạc vùng cao",
    mauId: "m_cham",
    phuKienIds: ["vong_bac"],
  },
  pa_then: {
    mau: "Đỏ lửa thiêng phối sọc trắng đen",
    phuKien: "Vòng kiềng bạc",
    mauId: "m_do",
    phuKienIds: ["vong_bac"],
  },
  ede_tho_cam: {
    mau: "Chàm đen viền hoa văn đỏ - vàng",
    phuKien: "Vòng đồng cồng chiêng",
    mauId: "m_cham",
    phuKienIds: ["vong_bac"],
  },
  bana_tho_cam: {
    mau: "Đen - Đỏ - Trắng thổ cẩm Bắc Tây Nguyên",
    phuKien: "Kiềng đồng Tây Nguyên",
    mauId: "m_cham",
    phuKienIds: ["vong_bac"],
  },
  caho_tho_cam: {
    mau: "Trắng ngà dệt hình thoi Lâm Viên",
    phuKien: "Chuỗi hạt cườm, Vòng đồng",
    mauId: "m_trang",
    phuKienIds: ["vong_bac"],
  },
  champa_tho_cam: {
    mau: "Vàng gấm tháp Chàm hoặc Trắng lễ hội",
    phuKien: "Dải khăn Talei Ka-in dệt Mỹ Nghiệp",
    mauId: "m_vang",
    phuKienIds: ["tram_cai"],
  },
  sampot: {
    mau: "Vàng ánh kim lễ hội Chol Chnam Thmay",
    phuKien: "Khăn Sbai vắt chéo vai, Trâm cài vàng",
    mauId: "m_vang",
    phuKienIds: ["tram_cai"],
  },
};

/**
 * Chấm điểm và lọc danh sách trang phục gợi ý từ dữ liệu Bối cảnh (QueNhaData) + Thời tiết
 */
export function goiYTheoBoiCanhQueNha(
  queNhaData?: {
    dip?: string[] | string | null;
    camHungIds?: string[] | null;
    phongCach?: string[] | string | null;
    nhomQueId?: string | null;
  } | null,
  thoiTiet?: string | null
): {
  items: GoiYQueNhaItem[];
  hasContextFilter: boolean;
  tongQuanLoiKhuyen: string;
} {
  const dips = Array.isArray(queNhaData?.dip)
    ? queNhaData.dip
    : queNhaData?.dip
    ? [queNhaData.dip]
    : [];
  const camHungIds = Array.isArray(queNhaData?.camHungIds)
    ? queNhaData.camHungIds
    : queNhaData?.nhomQueId
    ? [queNhaData.nhomQueId]
    : [];
  const phongCachs = Array.isArray(queNhaData?.phongCach)
    ? queNhaData.phongCach
    : queNhaData?.phongCach
    ? [queNhaData.phongCach]
    : [];

  const activeDips = dips.filter((d) => d !== "chi_muon_kham_pha");
  const hasContextFilter =
    activeDips.length > 0 || camHungIds.length > 0 || phongCachs.length > 0;

  // Quy đổi các dịp mở rộng sang tập dịp trong trangPhuc
  const expandedDips = new Set<string>();
  for (const d of activeDips) {
    expandedDips.add(d);
    if (d === "tet" || d === "cuoi") expandedDips.add("le");
    if (d === "le_hoi") {
      expandedDips.add("hoi_lang");
      expandedDips.add("cho_phien");
      expandedDips.add("le");
    }
    if (d === "ky_yeu" || d === "tot_nghiep" || d === "nha_giao" || d === "khai_giang") {
      expandedDips.add("le");
    }
  }

  const scored: GoiYQueNhaItem[] = trangPhuc.map((tp) => {
    let score = 0;
    const lyDoGoiY: string[] = [];

    // 1. Khớp vùng / nhóm dân tộc cảm hứng (trọng số cao nhất: +50)
    const matchedNhoms = tp.nhomIds.filter((id) => camHungIds.includes(id));
    if (matchedNhoms.length > 0) {
      score += 50;
      const tenNhoms = matchedNhoms
        .map((id) => nhom.find((n) => n.id === id)?.ten || id)
        .join(", ");
      lyDoGoiY.push(`Đúng cảm hứng ${tenNhoms}`);
    }

    // 2. Khớp dịp chuẩn bị (+35)
    const matchedDips = tp.dip.filter((d) => expandedDips.has(d));
    if (matchedDips.length > 0) {
      score += 35 + matchedDips.length * 5;
      const tenDips = activeDips
        .slice(0, 2)
        .map((d) => domdom.queNha.cau1.danhSach[d as keyof typeof domdom.queNha.cau1.danhSach] || domdom.s2.tenDip[d] || d)
        .join(", ");
      lyDoGoiY.push(`Rất hợp dịp ${tenDips}`);
    } else if (
      (activeDips.includes("ky_yeu") ||
        activeDips.includes("tot_nghiep") ||
        activeDips.includes("cuoi")) &&
      ["aodai", "ao_tac", "ngu_than"].includes(tp.id)
    ) {
      score += 30;
      lyDoGoiY.push("Trang trọng cho dịp kỷ niệm & lễ lớn");
    }

    // 3. Khớp phong cách (+20)
    if (phongCachs.length > 0) {
      if (phongCachs.includes("truyen_thong")) {
        score += 20;
        lyDoGoiY.push("Giữ trọn phom dáng cổ phong truyền thống");
      } else if (
        phongCachs.includes("ca_tinh") &&
        (tp.mucRemix === "tu_do" || ["aodai", "ba_ba", "tu_than", "lo_lo_hoa", "pa_then"].includes(tp.id))
      ) {
        score += 22;
        lyDoGoiY.push("Dễ phối phá cách, nổi bật cá tính");
      } else if (phongCachs.includes("cach_tan_nhe")) {
        score += 18;
        lyDoGoiY.push("Thanh thoát khi phối cách tân nhẹ nhàng");
      }
    }

    // 4. Khớp thời tiết hiện tại (+10)
    if (thoiTiet && tp.thoiTiet.includes(thoiTiet)) {
      score += 10;
      lyDoGoiY.push(`Hợp tiết trời ${TEN_THOI_TIET[thoiTiet] || thoiTiet}`);
    }

    // Nếu người dùng không chọn bộ lọc nào (hoặc chỉ chọn dạo ngắm), ưu tiên các bộ tiêu biểu đa vùng miền
    if (!hasContextFilter) {
      if (["aodai", "ao_tac", "co_thai", "tu_than", "mong_lanh", "champa_tho_cam"].includes(tp.id)) {
        score += 15;
      }
      if (lyDoGoiY.length === 0) {
        lyDoGoiY.push("Nếp áo di sản tiêu biểu đáng thử");
      }
    } else if (lyDoGoiY.length === 0) {
      lyDoGoiY.push("Phù hợp khám phá giao thoa văn hóa");
    }

    const detail = CHI_TIET_PHOI_GOI_Y[tp.id] || {
      mau: "Sắc màu truyền thống",
      phuKien: "Phụ kiện bản địa",
      mauId: "m_do",
      phuKienIds: [],
    };

    return {
      trangPhuc: tp,
      score,
      lyDoGoiY,
      goiYPhoiMau: detail.mau,
      goiYPhuKien: detail.phuKien,
      mauMacDinh: detail.mauId,
      phuKienMacDinh: detail.phuKienIds,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  // Tạo câu tổng quan lời khuyên từ Cò Em
  const parts: string[] = [];
  if (activeDips.length > 0) {
    const tenDips = activeDips
      .map((d) => domdom.queNha.cau1.danhSach[d as keyof typeof domdom.queNha.cau1.danhSach] || domdom.s2.tenDip[d] || d)
      .join(", ");
    parts.push(`dịp **${tenDips}**`);
  }
  if (camHungIds.length > 0) {
    const tenNhoms = camHungIds
      .map((id) => nhom.find((n) => n.id === id)?.ten || id)
      .join(", ");
    parts.push(`cảm hứng **${tenNhoms}**`);
  }
  if (phongCachs.length > 0) {
    const tenPC = phongCachs
      .map((p) => domdom.queNha.cau3.danhSach[p as keyof typeof domdom.queNha.cau3.danhSach] || p)
      .join(", ");
    parts.push(`phong vị **${tenPC}**`);
  }

  const tongQuanLoiKhuyen =
    parts.length > 0
      ? `Từ ${parts.join(" kết hợp cùng ")} bạn vừa chọn, Cò Em đã tuyển chọn những nếp áo hài hòa nhất dưới đây. Bạn có thể bấm thử phối ngay hoặc xem danh sách đã lọc nhé!`
      : `Bạn chọn tự do dạo ngắm, nên Cò Em gợi ý những bộ cổ phục và sắc phục dân tộc tiêu biểu nhất từ Bắc chí Nam để bạn bắt đầu hành trình.`;

  return {
    items: scored,
    hasContextFilter,
    tongQuanLoiKhuyen,
  };
}


