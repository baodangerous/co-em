import type { BaiDangChoPhien } from "../choPhien";

export const SAMPLE_CHO_PHIEN_POSTS: BaiDangChoPhien[] = [
  {
    id: "cp_sample_1",
    nguoiDang: "Linh Đan (Hà Nội)",
    nhomId: "kb",
    trangPhucId: "ngu_than",
    mauId: "m_do",
    phuKienIds: ["khan_dong", "guoc_go", "quat_giay"],
    dip: "tet",
    vung: "bac",
    nhan: "chuan",
    caption: "Áo ngũ thân đỏ điều đi lễ chùa đầu xuân, thêm chiếc quạt giấy rất hợp không khí Tết xưa!",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 2,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-20T08:30:00.000Z",
    binhChon: {
      hop_dip: 28,
      phoi_mau: 24,
      ton_trong_vung_mien: 31
    }
  },
  {
    id: "cp_sample_2",
    nguoiDang: "H'Mỹ (Đắk Lắk)",
    nhomId: "ede",
    trangPhucId: "ede_tho_cam",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    dip: "le_hoi",
    vung: "taynguyen",
    nhan: "chuan",
    caption: "Sắc chàm điểm chỉ đỏ truyền thống của buôn làng mình mỗi mùa lễ hội cồng chiêng.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 4,
      toc: "dai_xoa",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-21T14:15:00.000Z",
    binhChon: {
      hop_dip: 35,
      phoi_mau: 29,
      ton_trong_vung_mien: 42
    }
  },
  {
    id: "cp_sample_3",
    nguoiDang: "Minh Khôi (TP.HCM)",
    nhomId: "kn",
    trangPhucId: "aodai",
    mauId: "m_trang",
    phuKienIds: ["sneaker"],
    dip: "ky_yeu",
    vung: "nam",
    nhan: "sang_tao",
    caption: "Chụp kỷ yếu cuối cấp mang giày sneaker trắng chạy nhảy cả ngày cùng lớp mà vẫn gọn gàng!",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "manh",
      tongDa: 3,
      toc: "ngan",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-22T10:00:00.000Z",
    binhChon: {
      hop_dip: 25,
      phoi_mau: 22,
      ton_trong_vung_mien: 14
    }
  },
  {
    id: "cp_sample_4",
    nguoiDang: "Lò Thị Mai (Sơn La)",
    nhomId: "thai",
    trangPhucId: "co_thai",
    mauId: "m_trang",
    phuKienIds: ["khan_pieu", "kieng_bac"],
    dip: "le_hoi",
    vung: "bac",
    nhan: "chuan",
    caption: "Áo cỏm trắng hàng cúc bướm bạc đi cùng khăn Piêu thêu tay của mẹ truyền lại.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 1,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-23T16:45:00.000Z",
    binhChon: {
      hop_dip: 31,
      phoi_mau: 28,
      ton_trong_vung_mien: 39
    }
  },
  {
    id: "cp_sample_5",
    nguoiDang: "Bảo Ngọc (Cần Thơ)",
    nhomId: "kn",
    trangPhucId: "ba_ba",
    mauId: "m_hongsen",
    phuKienIds: ["khan_ran", "non_la", "guoc_go"],
    dip: "doi_thuong",
    vung: "nam",
    nhan: "chuan",
    caption: "Áo bà ba hồng sen phối khăn rằn và nón lá đi chợ nổi Cái Răng sáng sớm.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "day_dan",
      tongDa: 2,
      toc: "tet_hai_ben",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-24T07:20:00.000Z",
    binhChon: {
      hop_dip: 33,
      phoi_mau: 27,
      ton_trong_vung_mien: 36
    }
  },
  {
    id: "cp_sample_6",
    nguoiDang: "Giàng A Tùng (Hà Giang)",
    nhomId: "mong",
    trangPhucId: "mong_lanh",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    dip: "cho_phien",
    vung: "bac",
    nhan: "chuan",
    caption: "Đi chợ phiên Đồng Văn sáng Chủ nhật trong bộ vải lanh nhuộm chàm truyền thống.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "trung_binh",
      tongDa: 3,
      toc: "ngan",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-24T09:10:00.000Z",
    binhChon: {
      hop_dip: 29,
      phoi_mau: 24,
      ton_trong_vung_mien: 38
    }
  },
  {
    id: "cp_sample_7",
    nguoiDang: "Chế Lan Viên (Ninh Thuận)",
    nhomId: "champa",
    trangPhucId: "champa_tho_cam",
    mauId: "m_trang",
    phuKienIds: ["khan_cham"],
    dip: "le_hoi",
    vung: "trung",
    nhan: "chuan",
    caption: "Sắc trắng tinh khôi điểm dải thổ cẩm đỏ vàng chuẩn bị đón lễ hội Katê tại tháp Pô Klong Garai.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 4,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-24T11:30:00.000Z",
    binhChon: {
      hop_dip: 30,
      phoi_mau: 26,
      ton_trong_vung_mien: 41
    }
  },
  {
    id: "cp_sample_8",
    nguoiDang: "Thu Hà (Bắc Ninh)",
    nhomId: "kb",
    trangPhucId: "tu_than",
    mauId: "m_nau",
    phuKienIds: ["non_quai_thao", "guoc_go"],
    dip: "hoi_lang",
    vung: "bac",
    nhan: "chuan",
    caption: "Áo tứ thân nâu non, yếm đào cùng nón quai thao trẩy hội Lim nghe hát Quan họ.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 1,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-24T15:00:00.000Z",
    binhChon: {
      hop_dip: 36,
      phoi_mau: 31,
      ton_trong_vung_mien: 44
    }
  },
  {
    id: "cp_sample_9",
    nguoiDang: "Tôn Nữ Quỳnh Trâm (Huế)",
    nhomId: "kh",
    trangPhucId: "ao_nhat_binh",
    mauId: "m_vang",
    phuKienIds: ["khan_dong", "quat_giay", "guoc_go"],
    dip: "cuoi",
    vung: "trung",
    nhan: "chuan",
    caption: "Áo Nhật Bình sắc vàng hoàng gia tái hiện lễ phục cung đình Huế cho ngày lễ vu quy.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 1,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-25T08:15:00.000Z",
    binhChon: {
      hop_dip: 48,
      phoi_mau: 45,
      ton_trong_vung_mien: 52
    }
  },
  {
    id: "cp_sample_10",
    nguoiDang: "Hoàng Bách (Huế)",
    nhomId: "kh",
    trangPhucId: "ao_tac",
    mauId: "m_cham",
    phuKienIds: ["khan_dong", "guoc_go"],
    dip: "le",
    vung: "trung",
    nhan: "chuan",
    caption: "Áo Tấc lam chàm tay thụng rộng, khăn đóng chữ Nhân chỉnh tề trong lễ tế tổ đầu năm.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "day_dan",
      tongDa: 2,
      toc: "ngan",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-25T09:40:00.000Z",
    binhChon: {
      hop_dip: 39,
      phoi_mau: 34,
      ton_trong_vung_mien: 46
    }
  },
  {
    id: "cp_sample_11",
    nguoiDang: "Khánh Vy (Hà Nội)",
    nhomId: "kb",
    trangPhucId: "ao_giao_linh",
    mauId: "m_reu",
    phuKienIds: ["quat_giay", "guoc_go"],
    dip: "le_hoi",
    vung: "bac",
    nhan: "chuan",
    caption: "Áo Giao Lĩnh xanh rêu cổ vạt chéo dạo Hoàng thành Thăng Long dịp lễ hội mùa thu.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 2,
      toc: "dai_xoa",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-25T11:20:00.000Z",
    binhChon: {
      hop_dip: 27,
      phoi_mau: 35,
      ton_trong_vung_mien: 33
    }
  },
  {
    id: "cp_sample_12",
    nguoiDang: "Lý Mẩy Chạn (Lào Cai)",
    nhomId: "dao",
    trangPhucId: "dao_do",
    mauId: "m_do",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    dip: "cuoi",
    vung: "bac",
    nhan: "chuan",
    caption: "Khăn vấn đỏ rực cùng hàng hoa văn thêu chữ Vạn chuẩn bị cho lễ cưới truyền thống người Dao Đỏ.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 2,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-25T13:50:00.000Z",
    binhChon: {
      hop_dip: 41,
      phoi_mau: 38,
      ton_trong_vung_mien: 47
    }
  },
  {
    id: "cp_sample_13",
    nguoiDang: "Lò Thị Xuyến (Mèo Vạc)",
    nhomId: "lolo",
    trangPhucId: "lo_lo_hoa",
    mauId: "m_do",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    dip: "cho_phien",
    vung: "bac",
    nhan: "chuan",
    caption: "Bộ áo ghép hàng trăm mảnh vải tam giác nhỏ mà hai mẹ con khâu suốt mùa đông trên cao nguyên đá.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 2,
      toc: "tet_hai_ben",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-25T15:10:00.000Z",
    binhChon: {
      hop_dip: 44,
      phoi_mau: 49,
      ton_trong_vung_mien: 51
    }
  },
  {
    id: "cp_sample_14",
    nguoiDang: "Bùi Thị Hương (Hòa Bình)",
    nhomId: "muong",
    trangPhucId: "muong_vay",
    mauId: "m_trang",
    phuKienIds: ["kieng_bac"],
    dip: "le_hoi",
    vung: "bac",
    nhan: "chuan",
    caption: "Áo pắn trắng đi cùng cạp váy dệt hoa văn rồng và chim lạc trong lễ hội Khai hạ Mường Bi.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 1,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-25T17:30:00.000Z",
    binhChon: {
      hop_dip: 32,
      phoi_mau: 29,
      ton_trong_vung_mien: 40
    }
  },
  {
    id: "cp_sample_15",
    nguoiDang: "Thạch Thị Sô Pha (Trà Vinh)",
    nhomId: "khmer",
    trangPhucId: "sampot",
    mauId: "m_vang",
    phuKienIds: ["kieng_bac"],
    dip: "le_hoi",
    vung: "nam",
    nhan: "chuan",
    caption: "Váy Sampot ánh kim tuyến vàng cùng dải khăn Sbai đón Tết Chol Chnam Thmay tại chùa Âng.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 4,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-26T08:00:00.000Z",
    binhChon: {
      hop_dip: 37,
      phoi_mau: 41,
      ton_trong_vung_mien: 45
    }
  },
  {
    id: "cp_sample_16",
    nguoiDang: "Bríu Pố (Tây Giang - Quảng Nam)",
    nhomId: "cotu",
    trangPhucId: "cotu_tho_cam",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    dip: "le_hoi",
    vung: "trung",
    nhan: "chuan",
    caption: "Thổ cẩm dệt Zèng đính cườm chì lấp lánh của người Cơ Tu trên đỉnh Trường Sơn hùng vĩ.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "trung_binh",
      tongDa: 4,
      toc: "ngan",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-26T09:30:00.000Z",
    binhChon: {
      hop_dip: 34,
      phoi_mau: 30,
      ton_trong_vung_mien: 43
    }
  },
  {
    id: "cp_sample_17",
    nguoiDang: "Nông Văn Khải (Cao Bằng)",
    nhomId: "nung",
    trangPhucId: "nung_cham",
    mauId: "m_cham",
    phuKienIds: ["tui_tho_cam"],
    dip: "cho_phien",
    vung: "bac",
    nhan: "chuan",
    caption: "Áo chàm Nùng 5 thân mộc mạc thơm mùi lá chàm mới nhuộm bên suối Lê-nin.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "trung_binh",
      tongDa: 3,
      toc: "ngan",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-26T10:45:00.000Z",
    binhChon: {
      hop_dip: 26,
      phoi_mau: 23,
      ton_trong_vung_mien: 35
    }
  },
  {
    id: "cp_sample_18",
    nguoiDang: "Rơ Châm H'Liên (Gia Lai)",
    nhomId: "giarai",
    trangPhucId: "giarai_tho_cam",
    mauId: "m_do",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    dip: "le_hoi",
    vung: "taynguyen",
    nhan: "chuan",
    caption: "Hoa văn thổ cẩm Gia Rai đỏ đen rực rỡ dưới nắng gió Pleiku mùa hội mừng lúa mới.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 4,
      toc: "dai_xoa",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-26T12:15:00.000Z",
    binhChon: {
      hop_dip: 31,
      phoi_mau: 33,
      ton_trong_vung_mien: 39
    }
  },
  {
    id: "cp_sample_19",
    nguoiDang: "Đặng Quốc Anh (Đà Nẵng)",
    nhomId: "kb",
    trangPhucId: "ao_vien_linh",
    mauId: "m_reu",
    phuKienIds: ["sneaker", "quat_giay"],
    dip: "le_hoi",
    vung: "trung",
    nhan: "sang_tao",
    caption: "Phối Áo Viên Lĩnh xanh rêu cùng sneaker đi dạo phố cổ Hội An đêm rằm vừa cổ điển vừa năng động.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "manh",
      tongDa: 2,
      toc: "ngan",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-26T14:20:00.000Z",
    binhChon: {
      hop_dip: 29,
      phoi_mau: 32,
      ton_trong_vung_mien: 24
    }
  },
  {
    id: "cp_sample_20",
    nguoiDang: "Phù Thị Hồng (Quang Bình - Hà Giang)",
    nhomId: "pathen",
    trangPhucId: "pa_then",
    mauId: "m_do",
    phuKienIds: ["kieng_bac"],
    dip: "le_hoi",
    vung: "bac",
    nhan: "chuan",
    caption: "Sắc đỏ lửa thiêng của người Pà Thẻn rực sáng trong đêm hội Nhảy Lửa truyền thống.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 2,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-26T16:00:00.000Z",
    binhChon: {
      hop_dip: 38,
      phoi_mau: 42,
      ton_trong_vung_mien: 46
    }
  },
  {
    id: "cp_sample_21",
    nguoiDang: "Bàn Thị Liên (Nguyên Bình - Cao Bằng)",
    nhomId: "daotien",
    trangPhucId: "dao_tien",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    dip: "tet",
    vung: "bac",
    nhan: "chuan",
    caption: "Váy chàm in sáp ong xoáy ốc cùng xâu tiền bạc cổ sau lưng của người Dao Tiền.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 1,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-26T18:10:00.000Z",
    binhChon: {
      hop_dip: 33,
      phoi_mau: 30,
      ton_trong_vung_mien: 41
    }
  },
  {
    id: "cp_sample_22",
    nguoiDang: "Phương Thảo (Hưng Yên)",
    nhomId: "kb",
    trangPhucId: "ao_doi_kham",
    mauId: "m_hongsen",
    phuKienIds: ["quat_giay", "guoc_go"],
    dip: "tet",
    vung: "bac",
    nhan: "chuan",
    caption: "Áo Đối Khâm hồng sen khoác ngoài yếm đào và váy lĩnh đi thưởng hoa đào ngày xuân.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 1,
      toc: "dai_xoa",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-27T07:45:00.000Z",
    binhChon: {
      hop_dip: 36,
      phoi_mau: 40,
      ton_trong_vung_mien: 37
    }
  },
  {
    id: "cp_sample_23",
    nguoiDang: "H'Bình (Đắk Nông)",
    nhomId: "mnong",
    trangPhucId: "mnong_tho_cam",
    mauId: "m_cham",
    phuKienIds: ["kieng_bac", "tui_tho_cam"],
    dip: "le_hoi",
    vung: "taynguyen",
    nhan: "chuan",
    caption: "Thổ cẩm M'Nông dệt hoa văn sóng nước hồ Tà Đùng trong ngày hội buôn làng.",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 4,
      toc: "bui_cao",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-27T09:15:00.000Z",
    binhChon: {
      hop_dip: 29,
      phoi_mau: 27,
      ton_trong_vung_mien: 38
    }
  },
  {
    id: "cp_sample_24",
    nguoiDang: "Tuấn Kiệt (Hải Phòng)",
    nhomId: "kb",
    trangPhucId: "ao_tac",
    mauId: "m_do",
    phuKienIds: ["non_quai_thao", "sneaker"],
    dip: "le",
    vung: "bac",
    nhan: "can_xem_lai",
    caption: "Mình thử phối Áo Tấc đại lễ cùng nón quai thao và giày thể thao, Cò Em nhắc cần lưu ý dịp lễ nghiêm trang!",
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "trung_binh",
      tongDa: 2,
      toc: "ngan",
      huongNhin: "truoc"
    },
    taoLuc: "2025-02-27T10:30:00.000Z",
    binhChon: {
      hop_dip: 9,
      phoi_mau: 15,
      ton_trong_vung_mien: 8
    }
  }
];
