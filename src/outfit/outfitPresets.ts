/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Bộ phối mẫu chuẩn điệu (Presets) theo từng trang phục tại Xưởng Phối Đồ 2D (S4).
 */

export interface OutfitPresetItem {
  ten: string;
  moTa: string;
  mauId: string;
  phuKienIds: string[];
  footwearId: string;
  phongCach: string;
}

export const GOI_Y_PRESETS_BY_COSTUME: Record<string, OutfitPresetItem[]> = {
  aodai: [
    {
      ten: "Đài Các Cung Đình",
      moTa: "Nón lá bài thơ duyên dáng, kiềng bạc và hài thêu hoa sen trên nền lụa đỏ son.",
      mauId: "m_do",
      phuKienIds: ["non_la", "kieng_bac"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
    {
      ten: "Thanh Tân Phố Thị",
      moTa: "Lụa trắng thanh lịch kết hợp cùng sneaker trắng hiện đại và kiềng bạc.",
      mauId: "m_trang",
      phuKienIds: ["kieng_bac"],
      footwearId: "sneaker",
      phongCach: "cach_tan_nhe",
    },
    {
      ten: "Hoài Niệm Trầm Mặc",
      moTa: "Lụa xanh biếc nhã nhặn cùng guốc mộc quai nhung mộc mạc cổ phong.",
      mauId: "m_lam",
      phuKienIds: ["non_la"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  ngu_than: [
    {
      ten: "Kinh Kỳ Quý Phái",
      moTa: "Gấm vàng nghệ triều Nguyễn, khăn đóng chữ Nhất và hài thêu cung đình.",
      mauId: "m_vang",
      phuKienIds: ["khan_dong", "quat_lua"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
    {
      ten: "Nho Sinh Phong Nhã",
      moTa: "Sắc xanh lục điềm đạm, khăn đóng trang nhã cùng guốc mộc cổ phong.",
      mauId: "m_luc",
      phuKienIds: ["khan_dong"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  tu_than: [
    {
      ten: "Hội Làng Kinh Bắc",
      moTa: "Nâu sồng đất nung đằm thắm, khăn mỏ quạ, nón quai thao và guốc mộc.",
      mauId: "m_nau",
      phuKienIds: ["khan_mo_qua", "non_quai_thao"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
    {
      ten: "Quan Họ Duyên Dáng",
      moTa: "Yếm đào đỏ son tươi tắn, khăn mỏ quạ thắt duyên và guốc mộc truyền thống.",
      mauId: "m_do",
      phuKienIds: ["khan_mo_qua"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  ba_ba: [
    {
      ten: "Sông Nước Nam Bộ",
      moTa: "Xanh lá mạ mát lành, khăn rằn vắt vai, nón lá bài thơ và guốc mộc.",
      mauId: "m_luc",
      phuKienIds: ["khan_ran", "non_la"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
    {
      ten: "Bình Dị Miền Tây",
      moTa: "Sắc đen tuyền chân chất, khăn rằn Nam Bộ và dép da thủ công êm bước.",
      mauId: "m_den",
      phuKienIds: ["khan_ran"],
      footwearId: "dep_da_co",
      phongCach: "truyen_thong",
    },
  ],
  co_thai: [
    {
      ten: "Thiếu Nữ Hoa Ban",
      moTa: "Áo cóm trắng ngà cúc bướm bạc, khăn piêu thêu hoa và guốc mộc thanh thoát.",
      mauId: "m_trang",
      phuKienIds: ["khan_pieu"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  mong_lanh: [
    {
      ten: "Sắc Màu Vùng Cao",
      moTa: "Vải chàm lanh sáp ong, kiềng bạc đúc truyền thống và hài thêu rực rỡ.",
      mauId: "m_cham",
      phuKienIds: ["kieng_bac"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  ede_tho_cam: [
    {
      ten: "Đại Ngàn Cồng Chiêng",
      moTa: "Thổ cẩm đen sẫm Tây Nguyên, hoa văn cồng chiêng và dép da mộc mạc.",
      mauId: "m_den",
      phuKienIds: [],
      footwearId: "dep_da_co",
      phongCach: "truyen_thong",
    },
  ],
  champa_tho_cam: [
    {
      ten: "Mỹ Nghiệp Cổ Truyền",
      moTa: "Thổ cẩm dệt chỉ vàng óng ả, khăn Talei Ka-in và hài thêu trang trọng.",
      mauId: "m_vang",
      phuKienIds: [],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  sampot: [
    {
      ten: "Lễ Hội Ánh Kim",
      moTa: "Nếp váy Sampot dệt vàng, khăn Sbai vắt chéo ngực quý phái và hài thêu sen.",
      mauId: "m_vang",
      phuKienIds: [],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  ao_tac: [
    {
      ten: "Đại Lễ Triều Nguyễn",
      moTa: "Áo Tấc tay thụng gấm xanh lam, khăn đóng chữ Nhất và hài thêu cung đình.",
      mauId: "m_lam",
      phuKienIds: ["khan_dong", "quat_lua"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  ao_giao_linh: [
    {
      ten: "Cổ Phong Đại Việt",
      moTa: "Giao lĩnh vạt chéo sắc đỏ trầm, nón quai thao và hài thêu trang nhã.",
      mauId: "m_do",
      phuKienIds: ["non_quai_thao"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  dao_do: [
    {
      ten: "Sắc Đỏ Bản Dao",
      moTa: "Áo chàm thêu chỉ đỏ rực rỡ, kiềng bạc chạm khắc và hài thêu.",
      mauId: "m_cham",
      phuKienIds: ["kieng_bac"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  tay_cham: [
    {
      ten: "Nền Nã Thung Lũng",
      moTa: "Áo năm thân nhuộm chàm xanh mộc mạc, kiềng bạc mảnh và nón lá.",
      mauId: "m_cham",
      phuKienIds: ["kieng_bac", "non_la"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  muong_vay: [
    {
      ten: "Hoa Văn Đông Sơn",
      moTa: "Áo pắn trắng ngà cùng cạp váy thổ cẩm Mường và kiềng bạc.",
      mauId: "m_trang",
      phuKienIds: ["kieng_bac"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  lo_lo_hoa: [
    {
      ten: "Đa Sắc Cao Nguyên Đá",
      moTa: "Áo ghép vải tam giác ngũ sắc Lô Lô Hoa phối kiềng bạc và hài thêu.",
      mauId: "m_do",
      phuKienIds: ["kieng_bac"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  ha_nhi: [
    {
      ten: "Sương Mù Biên Cương",
      moTa: "Áo chàm kép đính xu bạc Hà Nhì cùng kiềng bạc vùng cao.",
      mauId: "m_cham",
      phuKienIds: ["kieng_bac"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  pa_then: [
    {
      ten: "Vũ Điệu Thần Lửa",
      moTa: "Sắc đỏ rực rỡ Pà Thẻn phối kiềng bạc và hài thêu truyền thống.",
      mauId: "m_do",
      phuKienIds: ["kieng_bac"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  bana_tho_cam: [
    {
      ten: "Nhịp Chiêng Nhà Rông",
      moTa: "Thổ cẩm Ba Na đen - đỏ - trắng dệt đối xứng cùng dép da mộc.",
      mauId: "m_den",
      phuKienIds: [],
      footwearId: "dep_da_co",
      phongCach: "truyen_thong",
    },
  ],
  caho_tho_cam: [
    {
      ten: "Nắng Sớm Lâm Viên",
      moTa: "Thổ cẩm sợi bông trắng ngà Cơ Ho dệt hoa văn hình thoi.",
      mauId: "m_trang",
      phuKienIds: [],
      footwearId: "dep_da_co",
      phongCach: "truyen_thong",
    },
  ],
};
