/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * KIỂU DỮ LIỆU & DỮ LIỆU KHỞI TẠO HỆ THỐNG QUẢN TRỊ (ADMIN TYPES & SEEDS)
 */

export type UserRole = "admin" | "moderator" | "artisan" | "member";

export interface ManagedUserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
  joinedAt: string;
  note?: string;
}

export type CraftTheme =
  | "lua_gam"
  | "lanh_cham"
  | "theu_cung_dinh"
  | "tho_cam"
  | "non_trang_suc";

export interface CraftVillageItem {
  id: string;
  name: string;
  region: "bac" | "trung" | "nam";
  regionLabel: string;
  artisan: string;
  specialty: string;
  costumeId: string;
  costumeName: string;
  mauId: string;
  phuKienIds: string[];
  priceRange: string;
  theme: CraftTheme;
  active?: boolean;
}

export interface WorkshopItem {
  id: string;
  title: string;
  specificDate: string;
  timeRange: string;
  location: string;
  addressDetail: string;
  host: string;
  costumeId: string;
  costumeName: string;
  mauId: string;
  phuKienIds: string[];
  maxCapacity: number;
  spotsLabel: string;
  feeType: "mien_phi" | "co_phi";
  feeLabel: string;
  notes: string[];
  theme: CraftTheme;
  active?: boolean;
}

export interface WorkshopRegistrationRecord {
  id: string;
  workshopId: string;
  workshopTitle: string;
  workshopDate: string;
  workshopTime: string;
  workshopLocation: string;
  fullName: string;
  phone: string;
  email: string;
  attendeeCount: number;
  motivationNote: string;
  committedOnTime: boolean;
  committedRespectRules: boolean;
  committedAccurateInfo: boolean;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface VillageOrderRecord {
  id: string;
  villageId: string;
  villageName: string;
  costumeName: string;
  customerName: string;
  customerPhone: string;
  note: string;
  status: "new" | "contacted" | "completed";
  createdAt: string;
}

export interface ProjectSettings {
  projectName: string;
  announcementBanner: string;
  requirePostModeration: boolean;
  allowWorkshopRegistration: boolean;
  adminDemoUnlock: boolean;
}

export const DEFAULT_CRAFT_VILLAGES: CraftVillageItem[] = [
  {
    id: "van_phuc",
    name: "Làng Lụa Vạn Phúc",
    region: "bac",
    regionLabel: "Hà Đông · Hà Nội",
    artisan: "NNƯT Nguyễn Văn Hùng",
    specialty: "Lụa vân cổ truyền & gấm tứ quý",
    costumeId: "ngu_than",
    costumeName: "Áo Ngũ Thân",
    mauId: "m_do",
    phuKienIds: ["khan_dong", "quat_giay"],
    priceRange: "1.8 – 4.5tr",
    theme: "lua_gam",
    active: true,
  },
  {
    id: "lung_tam",
    name: "HTX Lanh Lùng Tám",
    region: "bac",
    regionLabel: "Quản Bạ · Hà Giang",
    artisan: "Nghệ nhân Vàng Thị Mai",
    specialty: "Vải lanh vẽ sáp ong nhuộm chàm",
    costumeId: "mong_lanh",
    costumeName: "Trang phục Mông",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    priceRange: "1.5 – 3.8tr",
    theme: "lanh_cham",
    active: true,
  },
  {
    id: "quat_dong",
    name: "Làng Thêu Quất Động",
    region: "bac",
    regionLabel: "Thường Tín · Hà Nội",
    artisan: "Phường Thêu Đông Cứu",
    specialty: "Thêu tay chỉ tơ & kim tuyến cung đình",
    costumeId: "ao_tac",
    costumeName: "Áo Tấc",
    mauId: "m_cham",
    phuKienIds: ["khan_dong", "guoc_go"],
    priceRange: "2.5 – 6.2tr",
    theme: "theu_cung_dinh",
    active: true,
  },
  {
    id: "nam_cao",
    name: "Làng Đũi Nam Cao",
    region: "bac",
    regionLabel: "Kiến Xương · Thái Bình",
    artisan: "HTX Đũi Tơ Tằm Nam Cao",
    specialty: "Đũi tơ tằm rút sợi se tay mộc mạc",
    costumeId: "ao_giao_linh",
    costumeName: "Áo Giao Lĩnh",
    mauId: "m_reu",
    phuKienIds: ["quat_giay", "guoc_go"],
    priceRange: "1.6 – 3.9tr",
    theme: "lua_gam",
    active: true,
  },
  {
    id: "nha_xa",
    name: "Làng Lụa Nha Xá",
    region: "bac",
    regionLabel: "Duy Tiên · Hà Nam",
    artisan: "Phường Dệt Nha Xá",
    specialty: "Lụa tơ tằm nhuộm củ nâu & lá bàng",
    costumeId: "tu_than",
    costumeName: "Áo Tứ Thân",
    mauId: "m_nau",
    phuKienIds: ["non_quai_thao", "guoc_go"],
    priceRange: "1.4 – 3.2tr",
    theme: "lua_gam",
    active: true,
  },
  {
    id: "lang_chuong",
    name: "Làng Nón Chuông & Yếm Lụa",
    region: "bac",
    regionLabel: "Thanh Oai · Hà Nội",
    artisan: "Nghệ nhân Phạm Thị Tứ",
    specialty: "Nón quai thao ba tầm & yếm lụa đào",
    costumeId: "yem_dao",
    costumeName: "Áo Yếm & Váy Lĩnh",
    mauId: "m_do",
    phuKienIds: ["non_quai_thao", "guoc_go"],
    priceRange: "0.9 – 2.4tr",
    theme: "non_trang_suc",
    active: true,
  },
  {
    id: "mai_chau",
    name: "Thổ Cẩm Lác – Mai Châu",
    region: "bac",
    regionLabel: "Mai Châu · Hòa Bình",
    artisan: "HTX Dệt Thổ Cẩm Chiềng Châu",
    specialty: "Áo cỏm đính cúc bạc & khăn Piêu",
    costumeId: "co_thai",
    costumeName: "Áo Cỏm Thái",
    mauId: "m_trang",
    phuKienIds: ["khan_pieu", "kieng_bac"],
    priceRange: "1.2 – 2.8tr",
    theme: "tho_cam",
    active: true,
  },
  {
    id: "ta_phin",
    name: "Bản Thêu Dao Đỏ Tả Phìn",
    region: "bac",
    regionLabel: "Sa Pa · Lào Cai",
    artisan: "Nghệ nhân Lý Mẩy Chạn",
    specialty: "Thêu chữ Vạn chỉ đỏ & chạm bạc cổ",
    costumeId: "dao_do",
    costumeName: "Trang phục Dao Đỏ",
    mauId: "m_do",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    priceRange: "2.0 – 4.8tr",
    theme: "lanh_cham",
    active: true,
  },
  {
    id: "lo_lo_chai",
    name: "Bản Ghép Vải Lô Lô Chải",
    region: "bac",
    regionLabel: "Lũng Cú · Hà Giang",
    artisan: "Nghệ nhân Lò Thị Xuyến",
    specialty: "Ghép hàng trăm mảnh vải tam giác",
    costumeId: "lo_lo_hoa",
    costumeName: "Trang phục Lô Lô Hoa",
    mauId: "m_do",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    priceRange: "2.8 – 5.5tr",
    theme: "tho_cam",
    active: true,
  },
  {
    id: "kim_long",
    name: "Phường Thêu Cung Đình Kim Long",
    region: "trung",
    regionLabel: "Kim Long · TP. Huế",
    artisan: "Nghệ nhân Đặng Viết Bảo",
    specialty: "Thêu loan phượng & đính dải ngũ sắc",
    costumeId: "ao_nhat_binh",
    costumeName: "Áo Nhật Bình",
    mauId: "m_vang",
    phuKienIds: ["khan_dong", "quat_giay"],
    priceRange: "3.5 – 8.5tr",
    theme: "theu_cung_dinh",
    active: true,
  },
  {
    id: "zeng_a_luoi",
    name: "Phường Dệt Zèng A Lưới",
    region: "trung",
    regionLabel: "A Lưới · Thừa Thiên Huế",
    artisan: "NNƯT Mai Thị Hợp",
    specialty: "Dệt thổ cẩm Zèng đính cườm chì",
    costumeId: "cotu_tho_cam",
    costumeName: "Trang phục Cơ Tu",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    priceRange: "1.4 – 3.5tr",
    theme: "tho_cam",
    active: true,
  },
  {
    id: "my_nghiep",
    name: "Làng Thổ Cẩm Mỹ Nghiệp",
    region: "trung",
    regionLabel: "Ninh Phước · Ninh Thuận",
    artisan: "Nghệ nhân Đạt Thị Nam",
    specialty: "Dệt khung dài & khung ngắn Chăm Pa",
    costumeId: "champa_tho_cam",
    costumeName: "Trang phục Chăm",
    mauId: "m_trang",
    phuKienIds: ["khan_cham"],
    priceRange: "1.2 – 3.2tr",
    theme: "tho_cam",
    active: true,
  },
  {
    id: "ako_dhong",
    name: "Buôn Dệt Kteh Ako Dhông",
    region: "trung",
    regionLabel: "Buôn Ma Thuột · Đắk Lắk",
    artisan: "Nghệ nhân H'Bia Êban",
    specialty: "Dệt nổi Kteh hoa văn đại ngàn",
    costumeId: "ede_tho_cam",
    costumeName: "Trang phục Ê Đê",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    priceRange: "1.5 – 3.6tr",
    theme: "tho_cam",
    active: true,
  },
  {
    id: "tan_chau",
    name: "Làng Lụa Tân Châu",
    region: "nam",
    regionLabel: "Tân Châu · An Giang",
    artisan: "Nghệ nhân Nguyễn Hữu Trí",
    specialty: "Lãnh Mỹ A nhuộm trái mặc nưa",
    costumeId: "ba_ba",
    costumeName: "Áo Bà Ba",
    mauId: "m_hongsen",
    phuKienIds: ["khan_ran", "non_la"],
    priceRange: "1.6 – 4.8tr",
    theme: "lua_gam",
    active: true,
  },
  {
    id: "van_giao",
    name: "Làng Dệt Thổ Cẩm Văn Giáo",
    region: "nam",
    regionLabel: "Tịnh Biên · An Giang",
    artisan: "Nghệ nhân Neáng Chanh Ty",
    specialty: "Lụa thổ cẩm Khmer dệt kim tuyến",
    costumeId: "sampot",
    costumeName: "Sampot Khmer",
    mauId: "m_vang",
    phuKienIds: ["kieng_bac"],
    priceRange: "1.8 – 4.2tr",
    theme: "theu_cung_dinh",
    active: true,
  },
];

export const DEFAULT_WORKSHOPS: WorkshopItem[] = [
  {
    id: "ws_sap_ong",
    title: "Vẽ Sáp Ong Trên Vải Lanh & Nhuộm Chàm Tự Nhiên",
    specificDate: "Thứ Bảy, 14/11/2026",
    timeRange: "09:00 – 11:30",
    location: "Bảo tàng Dân tộc học Việt Nam · Hà Nội",
    addressDetail: "Khu nhà trình tường H'Mông ngoài trời, đường Nguyễn Văn Huyên, Cầu Giấy, Hà Nội",
    host: "Nghệ nhân Vàng Thị Mai (HTX Lùng Tám)",
    costumeId: "mong_lanh",
    costumeName: "Trang phục Mông",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    maxCapacity: 15,
    spotsLabel: "Giới hạn 15 học viên/buổi",
    feeType: "mien_phi",
    feeLabel: "Miễn phí tham dự (Quỹ Bảo tồn Di sản tài trợ nguyên liệu)",
    notes: [
      "Có mặt trước 15 phút để nhận tạp dề, bút đồng vẽ sáp ong và phôi vải lanh.",
      "Nên mặc trang phục tối màu, gọn tay vì sáp ong nóng và nước chàm tự nhiên dễ bám màu.",
      "Thành phẩm khăn tay lanh vẽ sáp ong học viên được mang về sau buổi học.",
    ],
    theme: "lanh_cham",
    active: true,
  },
  {
    id: "ws_ngu_than",
    title: "Đơm Khuy Đồng & Tìm Hiểu Quy Chuẩn Áo Ngũ Thân",
    specificDate: "Chủ Nhật, 15/11/2026",
    timeRange: "14:00 – 16:30",
    location: "Đình Kim Ngân · Phố cổ Hà Nội",
    addressDetail: "Tầng 1 Không gian Di sản, số 42–44 Hàng Bạc, Quận Hoàn Kiếm, Hà Nội",
    host: "Xưởng Cổ Phục Đại Việt & Nghệ nhân Làng Trạch Xá",
    costumeId: "ngu_than",
    costumeName: "Áo Ngũ Thân",
    mauId: "m_do",
    phuKienIds: ["khan_dong", "quat_giay"],
    maxCapacity: 20,
    spotsLabel: "Giới hạn 20 học viên/buổi",
    feeType: "co_phi",
    feeLabel: "180.000đ/người (Gồm bộ khuy đồng chạm tay, vải mẫu & trà sen)",
    notes: [
      "Học viên được thực hành tết khuy vải và đơm 5 hạt cúc đồng đúng chuẩn Ngũ thường.",
      "Khuyến khích mặc Việt phục hoặc trang phục lịch sự khi vào không gian đình cổ.",
      "Hỗ trợ mượn miễn phí Áo Tấc và Áo Ngũ Thân tay chẽn để chụp ảnh lưu niệm cuối buổi.",
    ],
    theme: "lua_gam",
    active: true,
  },
  {
    id: "ws_nhat_binh",
    title: "Thêu Hoa Văn Loan Phượng & Phối Màu Cổ Áo Nhật Bình",
    specificDate: "Thứ Bảy, 21/11/2026",
    timeRange: "14:00 – 17:00",
    location: "Không gian Văn hóa Lục Bộ · Cố đô Huế",
    addressDetail: "Phòng Trải nghiệm Thêu Cung Đình, số 79 Nguyễn Chí Diểu, Nội thành Huế",
    host: "Nghệ nhân Đặng Viết Bảo (Phường Thêu Kim Long)",
    costumeId: "ao_nhat_binh",
    costumeName: "Áo Nhật Bình",
    mauId: "m_vang",
    phuKienIds: ["khan_dong", "quat_giay"],
    maxCapacity: 12,
    spotsLabel: "Giới hạn 12 học viên/buổi",
    feeType: "co_phi",
    feeLabel: "250.000đ/người (Gồm khung thêu gỗ, chỉ tơ tằm kim tuyến & trà cung đình)",
    notes: [
      "Công việc thêu kim tuyến đòi hỏi sự tỉ mỉ; phù hợp cho người từ 14 tuổi trở lên.",
      "Không mang đồ uống có màu sát bàn khung thêu lụa.",
      "Nếu huỷ lịch, vui lòng thông báo trước 24 giờ để xưởng nhường khung thêu cho học viên chờ.",
    ],
    theme: "theu_cung_dinh",
    active: true,
  },
  {
    id: "ws_khan_pieu",
    title: "Thêu Hoa Văn Khăn Piêu & Đính Cúc Bướm Bạc Thái",
    specificDate: "Chủ Nhật, 22/11/2026",
    timeRange: "08:30 – 11:00",
    location: "Nhà Văn hóa Bản Lác · Mai Châu, Hòa Bình",
    addressDetail: "Nhà sàn số 18, Bản Lác 1, Xã Chiềng Châu, Huyện Mai Châu, Hòa Bình",
    host: "Nhóm Nghệ nhân Phụ nữ Thái Mai Châu",
    costumeId: "co_thai",
    costumeName: "Áo Cỏm Thái",
    mauId: "m_trang",
    phuKienIds: ["khan_pieu", "kieng_bac"],
    maxCapacity: 18,
    spotsLabel: "Giới hạn 18 học viên/buổi",
    feeType: "mien_phi",
    feeLabel: "Miễn phí tham dự (Chương trình giao lưu văn hóa cộng đồng Tây Bắc)",
    notes: [
      "Học kỹ thuật thêu luồn chỉ mặt trái đặc trưng của phụ nữ Thái Đen và Thái Trắng.",
      "Có giao lưu múa Xòe hoa và thưởng thức trà thảo mộc vùng cao sau giờ thực hành.",
    ],
    theme: "tho_cam",
    active: true,
  },
  {
    id: "ws_det_zeng",
    title: "Luồn Hạt Cườm Dệt Thổ Cẩm Zèng Cơ Tu Trường Sơn",
    specificDate: "Thứ Bảy, 28/11/2026",
    timeRange: "09:00 – 11:30",
    location: "Làng Văn hóa Du lịch Cộng đồng A Nôr · A Lưới",
    addressDetail: "Nhà Gươl trung tâm làng A Nôr, Xã Hồng Kim, Huyện A Lưới, Thừa Thiên Huế",
    host: "NNƯT Mai Thị Hợp",
    costumeId: "cotu_tho_cam",
    costumeName: "Trang phục Cơ Tu",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    maxCapacity: 15,
    spotsLabel: "Giới hạn 15 học viên/buổi",
    feeType: "mien_phi",
    feeLabel: "Miễn phí tham dự (Bảo tồn Di sản Văn hóa Phi vật thể Quốc gia)",
    notes: [
      "Ngồi dệt trên khung cửi lưng truyền thống của người Cơ Tu; nên mặc quần dài hoặc váy dài thoải mái.",
      "Tuyệt đối tôn trọng không gian thiêng trong nhà Gươl theo hướng dẫn của già làng và nghệ nhân.",
    ],
    theme: "tho_cam",
    active: true,
  },
  {
    id: "ws_lanh_my_a",
    title: "Trải Nghiệm Nhuộm Lãnh Mỹ A Mặc Nưa & Khâu Áo Bà Ba",
    specificDate: "Chủ Nhật, 29/11/2026",
    timeRange: "09:00 – 11:30",
    location: "Bảo tàng Áo Dài · TP. Thủ Đức, TP.HCM",
    addressDetail: "Khu nhà cổ Nam Bộ, số 206/19/30 Long Thuận, Phường Long Phước, TP. Thủ Đức",
    host: "Nghệ nhân Nguyễn Hữu Trí (Làng Lụa Tân Châu)",
    costumeId: "ba_ba",
    costumeName: "Áo Bà Ba",
    mauId: "m_hongsen",
    phuKienIds: ["khan_ran", "non_la"],
    maxCapacity: 20,
    spotsLabel: "Giới hạn 20 học viên/buổi",
    feeType: "co_phi",
    feeLabel: "150.000đ/người (Đã bao gồm vé vào cổng bảo tàng & nguyên liệu thực hành)",
    notes: [
      "Tìm hiểu quy trình đập trái mặc nưa nhuộm lụa đen huyền thoại của vùng đất Tân Châu – An Giang.",
      "Có mặt đúng giờ để tham gia phần trình diễn đập lụa ngoài sân nắng.",
    ],
    theme: "lua_gam",
    active: true,
  },
];

export const DEFAULT_USERS: ManagedUserAccount[] = [
  {
    id: "admin_master",
    name: "Ban Quản Trị Dự Án (Admin)",
    email: "admin@vietphucremix.vn",
    role: "admin",
    status: "active",
    joinedAt: "2026-01-01",
    note: "Tài khoản Quản trị viên chuyên trách vận hành dự án",
  },
  {
    id: "admin_root",
    name: "Quản Trị Viên Dự Án",
    email: "thumodzit@gmail.com",
    role: "admin",
    status: "active",
    joinedAt: "2026-01-10",
    note: "Tài khoản Super Admin quản lý toàn bộ hệ thống",
  },
  {
    id: "mod_1",
    name: "Cố Vấn Cổ Phục Kinh Kỳ",
    email: "covan.cophuc@vietphuc.vn",
    role: "moderator",
    status: "active",
    joinedAt: "2026-03-15",
    note: "Phụ trách thẩm định tư liệu & duyệt bài Chợ Phiên",
  },
  {
    id: "artisan_1",
    name: "Nghệ nhân Vàng Thị Mai",
    email: "lungtam.hagiang@langnghe.vn",
    role: "artisan",
    status: "active",
    joinedAt: "2026-04-02",
    note: "Đại diện HTX Lanh Lùng Tám & Workshop vẽ sáp ong",
  },
  {
    id: "member_1",
    name: "Minh Anh (Nhà Sưu Tầm)",
    email: "m***@gmail.com",
    role: "member",
    status: "active",
    joinedAt: "2026-06-20",
    note: "Thành viên tích cực đóng góp bản phối",
  },
];

export const DEFAULT_SETTINGS: ProjectSettings = {
  projectName: "Việt Phục Remix — Không Gian Di Sản 54 Dân Tộc",
  announcementBanner: "",
  requirePostModeration: false,
  allowWorkshopRegistration: true,
  adminDemoUnlock: false,
};
