/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SuKienGenZ {
  id: string;
  ten: string;
  bieuTuong: string;
  nhuCau: string;
  moTa: string;
  trangPhucDeXuat: string[];
  mauDeXuat: string[];
  phuKienDeXuat: string[];
  giayDeXuat: string;
  loiKhuyenVanHoa: string;
  phongCachMacDinh: "chuan_muc" | "y2k_remix" | "thanh_lich" | "pha_cach";
}

export interface PhongCachGenZ {
  id: "chuan_muc" | "y2k_remix" | "thanh_lich" | "pha_cach";
  ten: string;
  bieuTuong: string;
  moTa: string;
  phuKienDacTrung: string[];
  tinhThan: string;
}

export interface NguHanhColor {
  element: "Kim" | "Moc" | "Thuy" | "Hoa" | "Tho";
  hanh: string;
  tenMau: string;
  hex: string;
  yNghia: string;
}

export const SU_KIEN_GENZ: SuKienGenZ[] = [
  {
    id: "ky_yeu",
    ten: "Kỷ Yếu Học Đường",
    bieuTuong: "🎓",
    nhuCau: "Thanh lịch, thoải mái di chuyển chụp ảnh sân trường.",
    moTa: "Chụp ảnh kỷ niệm cuối cấp cùng bạn bè, thầy cô.",
    trangPhucDeXuat: ["aodai", "ngu_than"],
    mauDeXuat: ["m_trang", "m_lam", "m_luc"],
    phuKienDeXuat: ["kieng_bac", "non_la"],
    giayDeXuat: "sneaker",
    loiKhuyenVanHoa: "Giữ phom áo kín đáo; có thể phối sneaker trắng gọn gàng.",
    phongCachMacDinh: "y2k_remix",
  },
  {
    id: "dao_pho",
    ten: "Dạo Phố & Check-in",
    bieuTuong: "☕",
    nhuCau: "Thoáng mát, năng động khi dạo phố cổ.",
    moTa: "Dạo phố cuối tuần, chụp ảnh và thưởng trà.",
    trangPhucDeXuat: ["ba_ba", "aodai", "ngu_than"],
    mauDeXuat: ["m_luc", "m_nau", "m_den"],
    phuKienDeXuat: ["khan_ran", "tote"],
    giayDeXuat: "guoc_moc",
    loiKhuyenVanHoa: "Chất liệu đũi, lụa mộc phối túi tote hoặc guốc mộc rất tự nhiên.",
    phongCachMacDinh: "thanh_lich",
  },
  {
    id: "le_hoi",
    ten: "Lễ Hội Di Sản",
    bieuTuong: "🏮",
    nhuCau: "Trang nghiêm, chuẩn mực khi dự hội truyền thống.",
    moTa: "Tham dự lễ hội dân gian, đình đền và phố cổ.",
    trangPhucDeXuat: ["tu_than", "ngu_than"],
    mauDeXuat: ["m_nau", "m_do", "m_vang"],
    phuKienDeXuat: ["khan_mo_qua", "non_quai_thao", "kieng_bac"],
    giayDeXuat: "guoc_moc",
    loiKhuyenVanHoa: "Áo tứ thân đi cùng khăn mỏ quạ, nón quai thao đúng chuẩn Kinh Bắc.",
    phongCachMacDinh: "chuan_muc",
  },
  {
    id: "tet",
    ten: "Tết & Du Xuân",
    bieuTuong: "🧧",
    nhuCau: "Tươi tắn, cát tường dịp đầu năm mới.",
    moTa: "Chúc Tết gia đình, du xuân và vãn cảnh đầu năm.",
    trangPhucDeXuat: ["ngu_than", "aodai"],
    mauDeXuat: ["m_do", "m_vang"],
    phuKienDeXuat: ["khan_dong", "quat_lua"],
    giayDeXuat: "hai_theu",
    loiKhuyenVanHoa: "Sắc đỏ điều và vàng nghệ tượng trưng cho may mắn, hỷ sự.",
    phongCachMacDinh: "chuan_muc",
  },
  {
    id: "bieu_dien",
    ten: "Sân Khấu Bản Sắc",
    bieuTuong: "🎭",
    nhuCau: "Nổi bật thị giác, tôn vinh bản sắc các dân tộc.",
    moTa: "Biểu diễn nghệ thuật và trình diễn trang phục dân tộc.",
    trangPhucDeXuat: ["co_thai", "mong_lanh", "ede_tho_cam", "champa_tho_cam", "sampot"],
    mauDeXuat: ["m_cham", "m_do", "m_vang"],
    phuKienDeXuat: ["khan_pieu", "kieng_bac"],
    giayDeXuat: "hai_theu",
    loiKhuyenVanHoa: "Giữ đúng hoa văn thổ cẩm và phụ kiện đặc trưng của từng dân tộc.",
    phongCachMacDinh: "pha_cach",
  },
  {
    id: "cuoi_hoi",
    ten: "Lễ Cưới & Gia Tiên",
    bieuTuong: "💍",
    nhuCau: "Trang trọng, tôn vinh gia phong truyền thống.",
    moTa: "Dự lễ ăn hỏi, rước dâu hoặc lễ gia tiên.",
    trangPhucDeXuat: ["aodai", "ngu_than"],
    mauDeXuat: ["m_do", "m_trang", "m_vang"],
    phuKienDeXuat: ["kieng_bac", "quat_lua"],
    giayDeXuat: "hai_theu",
    loiKhuyenVanHoa: "Áo tấc hoặc áo ngũ thân gấm phối kiềng bạc đúng nghi lễ.",
    phongCachMacDinh: "thanh_lich",
  },
];

export const PHONG_CACH_GENZ: PhongCachGenZ[] = [
  {
    id: "chuan_muc",
    ten: "Cổ Điển Chuẩn Mực",
    bieuTuong: "🏛️",
    moTa: "Giữ nguyên cấu trúc cổ truyền, cài đủ 5 khuy, đi hài thêu hoặc guốc mộc.",
    phuKienDacTrung: ["Khăn đóng", "Nón quai thao", "Hài thêu", "Kiềng bạc"],
    tinhThan: "Bảo tồn nguyên bản",
  },
  {
    id: "y2k_remix",
    ten: "Gen Z Remix",
    bieuTuong: "✨",
    moTa: "Phối cổ phục cùng sneaker trắng hoặc túi tote năng động.",
    phuKienDacTrung: ["Sneaker trắng", "Túi tote", "Nón lá"],
    tinhThan: "Ứng dụng đời thường",
  },
  {
    id: "thanh_lich",
    ten: "Tối Giản Thanh Lịch",
    bieuTuong: "🌿",
    moTa: "Tông màu trung tính, chất liệu lụa đũi tự nhiên.",
    phuKienDacTrung: ["Quạt lụa", "Guốc mộc", "Kiềng bạc"],
    tinhThan: "Nhã nhặn, tinh tế",
  },
  {
    id: "pha_cach",
    ten: "Nghệ Thuật Sân Khấu",
    bieuTuong: "🎨",
    moTa: "Phối sắc tương phản ngũ hành và họa tiết truyền thống nổi bật.",
    phuKienDacTrung: ["Kiềng bạc", "Khăn Piêu", "Sắc ngũ hành"],
    tinhThan: "Ấn tượng thị giác",
  },
];

export const MAU_NGU_HANH: Record<string, NguHanhColor> = {
  m_trang: {
    element: "Kim",
    hanh: "Bạch Kim",
    tenMau: "Trắng ngà",
    hex: "#F8FAFC",
    yNghia: "Thuần khiết, thanh tao.",
  },
  m_luc: {
    element: "Moc",
    hanh: "Thanh Mộc",
    tenMau: "Xanh lục",
    hex: "#10B981",
    yNghia: "Sinh sôi, tươi mới.",
  },
  m_cham: {
    element: "Thuy",
    hanh: "Huyền Thủy",
    tenMau: "Xanh chàm",
    hex: "#1E3A8A",
    yNghia: "Điềm đạm, bền bỉ.",
  },
  m_lam: {
    element: "Thuy",
    hanh: "Huyền Thủy",
    tenMau: "Xanh lam",
    hex: "#0284C7",
    yNghia: "Thanh bình, phóng khoáng.",
  },
  m_den: {
    element: "Thuy",
    hanh: "Huyền Thủy",
    tenMau: "Đen lãnh",
    hex: "#1E293B",
    yNghia: "Mộc mạc, trang nhã.",
  },
  m_do: {
    element: "Hoa",
    hanh: "Xích Hỏa",
    tenMau: "Đỏ điều",
    hex: "#DC2626",
    yNghia: "May mắn, hỷ sự.",
  },
  m_vang: {
    element: "Tho",
    hanh: "Hoàng Thổ",
    tenMau: "Vàng nghệ",
    hex: "#EAB308",
    yNghia: "Sung túc, tôn quý.",
  },
  m_nau: {
    element: "Tho",
    hanh: "Hoàng Thổ",
    tenMau: "Nâu đất",
    hex: "#78350F",
    yNghia: "Chân chất, gần gũi.",
  },
};

export function kiemTraHaiHoaMauSac(
  mauAoId: string,
  mauPhuKienId?: string
): {
  diemSo: number;
  nhan: string;
  quanHeNguHanh: string;
  phanTich: string;
  loiKhuyenGenZ: string;
  elementAo: string;
  elementPhuKien: string;
} {
  const ao = MAU_NGU_HANH[mauAoId] || MAU_NGU_HANH["m_do"];
  const pk = MAU_NGU_HANH[mauPhuKienId || "m_trang"] || MAU_NGU_HANH["m_trang"];

  const tuongSinh: Record<string, string> = {
    Kim: "Thuy",
    Thuy: "Moc",
    Moc: "Hoa",
    Hoa: "Tho",
    Tho: "Kim",
  };

  const tuongKhac: Record<string, string> = {
    Kim: "Moc",
    Moc: "Tho",
    Tho: "Thuy",
    Thuy: "Hoa",
    Hoa: "Kim",
  };

  if (ao.element === pk.element) {
    return {
      diemSo: 95,
      nhan: "Đồng Điệu Thanh Nhã",
      quanHeNguHanh: `Cùng hành ${ao.element}`,
      phanTich: `${ao.tenMau} và ${pk.tenMau} đồng tông, tạo tổng thể trang nhã.`,
      loiKhuyenGenZ: "Hợp chụp kỷ yếu; có thể nhấn thêm kiềng bạc.",
      elementAo: ao.element,
      elementPhuKien: pk.element,
    };
  }

  if (tuongSinh[ao.element] === pk.element || tuongSinh[pk.element] === ao.element) {
    return {
      diemSo: 100,
      nhan: "Ngũ Hành Tương Sinh",
      quanHeNguHanh: `${ao.element} – ${pk.element} tương sinh`,
      phanTich: `${ao.tenMau} (${ao.element}) và ${pk.tenMau} (${pk.element}) tôn nhau hài hòa.`,
      loiKhuyenGenZ: "Bảng màu cân đối, nổi bật trong cả lễ hội và đời thường.",
      elementAo: ao.element,
      elementPhuKien: pk.element,
    };
  }

  if (tuongKhac[ao.element] === pk.element || tuongKhac[pk.element] === ao.element) {
    return {
      diemSo: 82,
      nhan: "Tương Phản Thị Giác",
      quanHeNguHanh: `${ao.element} – ${pk.element} đối trọng`,
      phanTich: `${ao.tenMau} và ${pk.tenMau} tạo độ tương phản mạnh.`,
      loiKhuyenGenZ: "Nên giữ tỷ lệ màu phụ kiện khoảng 15–20% để cân bằng.",
      elementAo: ao.element,
      elementPhuKien: pk.element,
    };
  }

  return {
    diemSo: 90,
    nhan: "Hài Hòa Bổ Trợ",
    quanHeNguHanh: "Giao thoa cân bằng",
    phanTich: `${ao.tenMau} và ${pk.tenMau} kết hợp dịu mắt.`,
    loiKhuyenGenZ: "Dễ mặc trong nhiều dịp lễ và dạo phố.",
    elementAo: ao.element,
    elementPhuKien: pk.element,
  };
}

export interface CanhBaoVanHoa {
  mucDo: "chuan_xac" | "remix_van_minh" | "can_can_nhac";
  tieuDe: string;
  noiDung: string;
  nguyenTacCotLoi: string;
  goiYKhacPhuc: string;
}

export function danhGiaVanHoaGenZ(
  trangPhucId: string,
  mauId: string,
  phuKienIds: string[],
  giayId: string,
  _phongCachId: string
): CanhBaoVanHoa {
  if (trangPhucId === "ngu_than" && phuKienIds.includes("khan_ran")) {
    return {
      mucDo: "can_can_nhac",
      tieuDe: "Lưu ý bối cảnh: Áo ngũ thân & Khăn rằn",
      noiDung: "Áo ngũ thân thuộc lễ phục cố đô, còn khăn rằn gắn với sinh hoạt Nam Bộ.",
      nguyenTacCotLoi: "Đồng bộ vùng miền và tính chất trang phục.",
      goiYKhacPhuc: "Phối Áo ngũ thân với Khăn đóng; Khăn rằn đi cùng Áo bà ba.",
    };
  }

  if (mauId === "m_den" && phuKienIds.includes("khan_dong")) {
    return {
      mucDo: "remix_van_minh",
      tieuDe: "Lưu ý sắc phục dịp lễ Tết",
      noiDung: "Sắc đen trang nghiêm; nếu mặc dịp Tết nên điểm thêm phụ kiện tươi sáng.",
      nguyenTacCotLoi: "Ưu tiên sắc màu cát tường trong dịp hỷ sự.",
      goiYKhacPhuc: "Điểm thêm quạt lụa hoặc kiềng bạc sáng.",
    };
  }

  if (giayId === "sneaker") {
    return {
      mucDo: "remix_van_minh",
      tieuDe: "Cách tân: Cổ phục & Sneaker",
      noiDung: "Phối sneaker trắng với cổ phục giúp di chuyển thuận tiện khi chụp kỷ yếu.",
      nguyenTacCotLoi: "Giữ nguyên phom áo suông và chiều dài tà chuẩn mực.",
      goiYKhacPhuc: "Chọn sneaker trắng trơn tối giản.",
    };
  }

  return {
    mucDo: "chuan_xac",
    tieuDe: "Bản phối chuẩn mực di sản",
    noiDung: "Trang phục và phụ kiện đồng điệu theo thẩm mỹ truyền thống.",
    nguyenTacCotLoi: "Tôn trọng nguồn gốc và cấu trúc nguyên bản.",
    goiYKhacPhuc: "Phù hợp cho lễ hội, sự kiện văn hóa và chụp ảnh.",
  };
}
