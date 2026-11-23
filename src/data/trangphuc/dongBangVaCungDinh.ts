/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dữ liệu trang phục truyền thống: Nhóm Kinh (Bắc Bộ, Cố đô Huế, Nam Bộ), Mường & Hoa
 */

import { TrangPhuc } from "../../types";

export const trangPhucDongBangVaCungDinh: TrangPhuc[] = [
  {
    id: "aodai",
    ten: "Áo dài",
    nhomIds: ["kh", "kb", "kn"],
    gioiTinh: "chung",
    dip: ["tet", "khai_giang", "cuoi", "ky_yeu", "tot_nghiep", "nha_giao"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Nguồn gốc từ áo ngũ thân (1744), cách tân thập niên 1930.",
    fallbackText: "Nguồn gốc từ áo ngũ thân (1744), cách tân thập niên 1930.",
    suThat: [
      "Tiền thân là áo ngũ thân lập lĩnh thời chúa Nguyễn Phúc Khoát (1744).",
      "Thập niên 1930, họa sĩ Cát Tường (Lemur) và Lê Phổ cách tân phom dáng hiện đại."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["ngan_nam_ao_mu", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "ngu_than",
    ten: "Áo ngũ thân",
    nhomIds: ["kh", "kb"],
    gioiTinh: "chung",
    dip: ["le", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Định chế năm 1744 và 1837; gồm 5 thân vải, cổ đứng cài 5 khuy.",
    fallbackText: "Định chế năm 1744 và 1837; gồm 5 thân vải, cổ đứng cài 5 khuy.",
    suThat: [
      "Gồm 5 thân vải (4 thân ngoài, 1 thân con), 5 khuy cài bên phải.",
      "Phổ cập toàn quốc theo chiếu chỉ vua Minh Mạng năm 1837."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["kham_dinh_dai_nam", "ngan_nam_ao_mu"],
    daKiemChung: true
  },
  {
    id: "ao_tac",
    ten: "Áo Tấc (Ngũ thân tay thụng)",
    nhomIds: ["kh", "kb"],
    gioiTinh: "chung",
    dip: ["le", "tet", "cuoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Lễ phục triều Nguyễn (thế kỷ XVIII–XX), tay áo rộng dài quá cổ tay.",
    fallbackText: "Lễ phục triều Nguyễn (thế kỷ XVIII–XX), tay áo rộng dài quá cổ tay.",
    suThat: [
      "Cấu trúc 5 thân cổ lập lĩnh, tay thụng rộng khoảng 1 tấc cổ truyền.",
      "Sử dụng trong đại lễ, tế tự, cưới hỏi từ hoàng tộc đến dân gian."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["kham_dinh_dai_nam", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "ao_nhat_binh",
    ten: "Áo Nhật Bình",
    nhomIds: ["kh"],
    gioiTinh: "nu",
    dip: ["le", "cuoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Triều phục cung đình Huế; cổ hình chữ nhật thêu hoa văn loan phượng, bát bảo.",
    fallbackText: "Triều phục cung đình Huế; cổ hình chữ nhật thêu hoa văn loan phượng, bát bảo.",
    suThat: [
      "Cổ áo to bản ghép thành hình chữ nhật trước ngực (Nhật Bình), tay áo đính dải ngũ sắc.",
      "Được quy định cho Hoàng hậu, Công chúa, Phi tần và mệnh phụ triều Nguyễn."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["kham_dinh_dai_nam", "ngan_nam_ao_mu"],
    daKiemChung: true
  },
  {
    id: "ao_giao_linh",
    ten: "Áo Giao lĩnh",
    nhomIds: ["kb", "kh"],
    gioiTinh: "chung",
    dip: ["le", "le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Cổ phục thời Lý – Trần – Lê (thế kỷ XI–XVIII), cổ vạt chéo trước ngực.",
    fallbackText: "Cổ phục thời Lý – Trần – Lê (thế kỷ XI–XVIII), cổ vạt chéo trước ngực.",
    suThat: [
      "Cổ áo giao nhau chéo sang bên phải, mặc cùng yếm và thường (váy) xếp nếp.",
      "Thịnh hành suốt thời Lý, Trần, Lê sơ và Lê Trung Hưng trước cải cách 1744."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["ngan_nam_ao_mu", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "ao_vien_linh",
    ten: "Áo Viên lĩnh",
    nhomIds: ["kb", "kh"],
    gioiTinh: "chung",
    dip: ["le", "tet", "le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Cổ phục truyền thống thời Lý – Trần – Lê; cổ tròn ôm sát, cài khuy bên phải.",
    fallbackText: "Cổ phục truyền thống thời Lý – Trần – Lê; cổ tròn ôm sát, cài khuy bên phải.",
    suThat: [
      "Đặc trưng bởi phần cổ cắt tròn (viên lĩnh), vạt áo chéo cài khuy sang nách phải.",
      "Xuất hiện phổ biến trong cả thường phục và triều phục qua nhiều triều đại Đại Việt."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["ngan_nam_ao_mu", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "ao_doi_kham",
    ten: "Áo Đối khâm",
    nhomIds: ["kb", "kh"],
    gioiTinh: "chung",
    dip: ["le_hoi", "tet", "le"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Áo khoác cổ phục hai vạt song song buông thẳng trước ngực, phóng khoáng và trang nhã.",
    fallbackText: "Áo khoác cổ phục hai vạt song song buông thẳng trước ngực, phóng khoáng và trang nhã.",
    suThat: [
      "Hai vạt trước đối xứng song song, có thể buộc dây trước ngực hoặc buông tự nhiên.",
      "Thường khoác ngoài áo giao lĩnh hoặc yếm đào, kết hợp cùng thường (váy) nhiều lớp."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["ngan_nam_ao_mu", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "tu_than",
    ten: "Áo tứ thân",
    nhomIds: ["kb"],
    gioiTinh: "nu",
    dip: ["hoi_lang", "tet", "le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục nữ giới Bắc Bộ (thế kỷ XVII–XX), 4 thân vải mặc cùng yếm đào.",
    fallbackText: "Y phục nữ giới Bắc Bộ (thế kỷ XVII–XX), 4 thân vải mặc cùng yếm đào.",
    suThat: [
      "Gồm 4 thân vải (2 thân sau ghép liền, 2 vạt trước buông hoặc thắt).",
      "Phối cùng yếm đào, váy đụp, khăn mỏ quạ và nón quai thao."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_phu_nu_vn", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "yem_dao",
    ten: "Áo Yếm & Váy Lĩnh",
    nhomIds: ["kb"],
    gioiTinh: "nu",
    dip: ["hoi_lang", "le_hoi", "tet"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Trang phục cổ truyền phụ nữ Kinh Bắc; yếm lụa thắt lưng bao phối váy lĩnh đen.",
    fallbackText: "Trang phục cổ truyền phụ nữ Kinh Bắc; yếm lụa thắt lưng bao phối váy lĩnh đen.",
    suThat: [
      "Yếm có nhiều kiểu cổ: cổ xây (tròn), cổ xẻ (chữ V), cổ cánh nhạn.",
      "Mặc cùng váy lĩnh hoa chanh và dải thắt lưng lụa đào hoặc xanh lý."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_phu_nu_vn", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "ba_ba",
    ten: "Áo bà ba",
    nhomIds: ["kn"],
    gioiTinh: "chung",
    dip: ["doi_thuong", "le_hoi"],
    thoiTiet: ["nong", "mat", "mua"],
    moTaNgan: "Hình thành cuối thế kỷ XIX tại Nam Bộ; áo ngắn không cổ, xẻ tà hông.",
    fallbackText: "Hình thành cuối thế kỷ XIX tại Nam Bộ; áo ngắn không cổ, xẻ tà hông.",
    suThat: [
      "Áo thân ngắn, cổ tròn, cài khuy giữa, xẻ tà hai bên hông kèm hai túi dưới.",
      "Gắn liền với chất liệu lãnh Mỹ A, khăn rằn và nón lá miền Tây Nam Bộ."
    ],
    mucRemix: "tu_do",
    nguonIds: ["bt_phu_nu_vn", "can_bo_sung"],
    daKiemChung: true
  },
  {
    id: "muong_vay",
    ten: "Áo pắn & Váy cạp Mường",
    nhomIds: ["muong"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Y phục nữ Mường Hòa Bình – Thanh Hóa; điểm nhấn là cạp váy dệt hoa văn cổ.",
    fallbackText: "Y phục nữ Mường Hòa Bình – Thanh Hóa; điểm nhấn là cạp váy dệt hoa văn cổ.",
    suThat: [
      "Gồm khăn trắng đội đầu, áo pắn ngắn, yếm ngực và váy đen có đầu váy (cạp váy) dệt nổi.",
      "Cạp váy gồm 3 phần (rang trên, rang dưới, cáol) dệt hình rồng, hươu, chim lạc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "muong_le_phuc",
    ten: "Lễ phục Mường (Áo chùng & Cạp váy rồng)",
    nhomIds: ["muong"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "cuoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Lễ phục đại lễ Khai hạ người Mường; áo chùng trắng khoác ngoài yếm cùng cạp váy dệt rồng – chim công.",
    fallbackText: "Lễ phục đại lễ Khai hạ người Mường; áo chùng trắng khoác ngoài yếm cùng cạp váy dệt rồng – chim công.",
    suThat: [
      "Cạp váy Mường được ví như bức thông điệp bằng sợi chỉ với 3 tầng hoa văn: rang trên, rang giữa và cáol.",
      "Kết hợp cùng bộ xà tích bạc đính hộp quả đào và móng hổ bọc bạc trừ tà."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "hoang_bao_nguyen",
    ten: "Hoàng Bào Đại Triều (Triều Nguyễn)",
    nhomIds: ["kh", "kb"],
    gioiTinh: "nam",
    dip: ["le", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Đại triều phục bậc Đế vương triều Nguyễn; sa đoạn sắc vàng chính sắc thêu rồng 5 móng kim tuyến và thủy ba.",
    fallbackText: "Đại triều phục bậc Đế vương triều Nguyễn; sa đoạn sắc vàng chính sắc thêu rồng 5 móng kim tuyến và thủy ba.",
    suThat: [
      "Thêu 9 hình rồng năm móng (Cửu Long) bằng chỉ kim tuyến vàng ròng kết hợp đồ án Thập nhị chương và sóng thủy ba.",
      "Ngự dụng trong các đại lễ Thiết đại triều tại điện Thái Hòa và lễ Tế Giao ở Kinh đô Huế."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["kham_dinh_dai_nam", "ngan_nam_ao_mu"],
    daKiemChung: true
  },
  {
    id: "phuong_bao_hoang_hau",
    ten: "Phượng Bào Hoàng Hậu (Cung Đình Huế)",
    nhomIds: ["kh"],
    gioiTinh: "nu",
    dip: ["le", "cuoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Đại lễ phục bậc Mẫu nghi thiên hạ triều Nguyễn; gấm đỏ cam thêu chim phượng hàm thư và dải ngũ sắc.",
    fallbackText: "Đại lễ phục bậc Mẫu nghi thiên hạ triều Nguyễn; gấm đỏ cam thêu chim phượng hàm thư và dải ngũ sắc.",
    suThat: [
      "Thêu các đoàn chim phượng hoàng tung cánh bằng sợi kim tuyến, điểm hạt trân châu và san hô.",
      "Kết hợp cùng mũ Cửu Phượng và xiêm y thêu bát bảo trang nghiêm bậc nhất chốn nội cung."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["kham_dinh_dai_nam", "ngan_nam_ao_mu"],
    daKiemChung: true
  },
  {
    id: "ao_menh_phu",
    ten: "Lễ Phục Mệnh Phụ Phu Nhân (Nhật Bình Chu Sa)",
    nhomIds: ["kh", "kb"],
    gioiTinh: "nu",
    dip: ["le", "cuoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Triều phục Công chúa và Nhất phẩm Mệnh phụ; cổ Nhật Bình thêu loan phượng trên nền sa đoạn màu chu sa.",
    fallbackText: "Triều phục Công chúa và Nhất phẩm Mệnh phụ; cổ Nhật Bình thêu loan phượng trên nền sa đoạn màu chu sa.",
    suThat: [
      "Màu sắc và số lượng hoa văn loan – phượng trên áo Nhật Bình phân định rõ phẩm hàm trong hoàng thất.",
      "Phối cùng khăn vành dây kết trâm vàng và quần lụa trắng hoặc xiêm thêu."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["kham_dinh_dai_nam", "ngan_nam_ao_mu"],
    daKiemChung: true
  },
  {
    id: "ao_nghi_le_quan_van",
    ten: "Triều Phục Quan Văn (Áo Bổ Tử Tiên Hạc)",
    nhomIds: ["kh", "kb"],
    gioiTinh: "nam",
    dip: ["le", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Đại triều phục Văn thần Đại Việt; áo giao lĩnh/viên lĩnh tay thụng đính Bổ tử thêu chim Hạc vượt mây.",
    fallbackText: "Đại triều phục Văn thần Đại Việt; áo giao lĩnh/viên lĩnh tay thụng đính Bổ tử thêu chim Hạc vượt mây.",
    suThat: [
      "Tấm Bổ tử vuông trước ngực và sau lưng thêu hình chim Hạc, Cẩm kê hoặc Khổng tước tùy theo phẩm cấp quan văn.",
      "Đi kèm mũ cánh chuồn (Phốc đầu), đai lưng khảm sừng/ngọc và hia cao cổ."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["kham_dinh_dai_nam", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "ao_nghi_le_quan_vo",
    ten: "Triều Phục Võ Tướng (Áo Bổ Tử Kỳ Lân)",
    nhomIds: ["kb", "kh"],
    gioiTinh: "nam",
    dip: ["le", "le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Phẩm phục Võ quan Đại Việt; áo bào đỏ thẫm thêu Bổ tử Kỳ Lân – Hổ báo uy dũng cùng đai giáp lưng.",
    fallbackText: "Phẩm phục Võ quan Đại Việt; áo bào đỏ thẫm thêu Bổ tử Kỳ Lân – Hổ báo uy dũng cùng đai giáp lưng.",
    suThat: [
      "Quan võ sử dụng đồ án mãnh thú (Kỳ Lân, Sư tử, Hổ, Báo) trên Bổ tử để biểu thị uy lực bảo vệ sơn hà.",
      "Tay áo và vạt áo cắt may gọn khỏe hơn văn quan để thuận tiện khi hộ giá và duyệt binh."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["kham_dinh_dai_nam", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "ao_truc_linh",
    ten: "Áo Trực Lĩnh (Cổ Phục Lý – Trần – Lê)",
    nhomIds: ["kb", "kh"],
    gioiTinh: "chung",
    dip: ["le_hoi", "tet", "doi_thuong"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục cổ truyền thời Lý – Trần – Lê; hai vạt cổ thẳng giao nhau trước ngực, phóng khoáng và nho nhã.",
    fallbackText: "Y phục cổ truyền thời Lý – Trần – Lê; hai vạt cổ thẳng giao nhau trước ngực, phóng khoáng và nho nhã.",
    suThat: [
      "Khác với Giao lĩnh có nẹp cổ vắt chéo sâu, Trực lĩnh có đường nẹp cổ buông thẳng thanh thoát.",
      "Được tầng lớp nho sĩ, quý tộc và dân gian Đại Việt ưa chuộng suốt nhiều thế kỷ."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["ngan_nam_ao_mu", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "ao_ba_ba_lanh_my_a",
    ten: "Áo Bà Ba Lãnh Mỹ A & Khăn Rằn Tân Châu",
    nhomIds: ["kn"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "doi_thuong"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Tuyệt phẩm lụa Lãnh Mỹ A Tân Châu (An Giang) đen bóng huyền thoại phối chuỗi ngọc trai Nam Bộ.",
    fallbackText: "Tuyệt phẩm lụa Lãnh Mỹ A Tân Châu (An Giang) đen bóng huyền thoại phối chuỗi ngọc trai Nam Bộ.",
    suThat: [
      "Lãnh Mỹ A được dệt từ tơ tằm thượng hạng và nhuộm hàng trăm lần bằng nhựa trái mặc nưa tạo mặt lụa đen bóng, mát lạnh mùa hè.",
      "Biểu tượng thanh lịch của phụ nữ lục tỉnh Nam Kỳ xưa trong các dịp lễ Tết và hội đình."
    ],
    mucRemix: "tu_do",
    nguonIds: ["bt_phu_nu_vn", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "ao_dai_lemur",
    ten: "Áo Dài Lemur & Lê Phổ (Tân Thời 1930)",
    nhomIds: ["kb", "kh", "kn"],
    gioiTinh: "nu",
    dip: ["tet", "ky_yeu", "cuoi", "khai_giang"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Dáng áo dài cách tân lịch sử thập niên 1930 tại Hà Nội; lụa màu pastel nhã nhặn phối kiềng vàng và vấn tóc.",
    fallbackText: "Dáng áo dài cách tân lịch sử thập niên 1930 tại Hà Nội; lụa màu pastel nhã nhặn phối kiềng vàng và vấn tóc.",
    suThat: [
      "Họa sĩ Cát Tường khởi xướng áo dài Lemur năm 1934, sau đó họa sĩ Lê Phổ dung hòa lại với nét truyền thống của áo ngũ thân.",
      "Tạo nên diện mạo kinh điển của tà áo dài Việt Nam hiện đại."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_phu_nu_vn", "ngan_nam_ao_mu"],
    daKiemChung: true
  },
  {
    id: "hoa_suon_xam_gam",
    ten: "Áo Đại Khâm & Sườn Xám Gấm Đỏ (Dân tộc Hoa)",
    nhomIds: ["kn", "kb"],
    gioiTinh: "nu",
    dip: ["tet", "cuoi", "le_hoi"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Lễ phục truyền thống người Hoa tại Việt Nam; gấm đỏ son dệt hoa mẫu đơn vàng cài nút thắt bàn khấu.",
    fallbackText: "Lễ phục truyền thống người Hoa tại Việt Nam; gấm đỏ son dệt hoa mẫu đơn vàng cài nút thắt bàn khấu.",
    suThat: [
      "Cổ đứng cao cài khuy tết vải thủ công (bàn khấu) chạy chéo từ cổ sang nách phải.",
      "Sắc đỏ son và chỉ vàng kim tượng trưng cho phúc lộc, cát tường trong Tết Nguyên Đán và Tết Nguyên Tiêu."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  }
];
