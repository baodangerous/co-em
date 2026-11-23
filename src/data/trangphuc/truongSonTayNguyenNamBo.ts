/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dữ liệu trang phục truyền thống: Dãy Trường Sơn, Tây Nguyên, Duyên hải Nam Trung Bộ & Nam Bộ
 */

import { TrangPhuc } from "../../types";

export const trangPhucTruongSonTayNguyenNamBo: TrangPhuc[] = [
  {
    id: "cotu_tho_cam",
    ten: "Trang phục Cơ Tu (Dệt Zèng)",
    nhomIds: ["cotu"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Di sản dệt Zèng người Cơ Tu Trường Sơn; thổ cẩm đen – đỏ đính hạt cườm chì lấp lánh.",
    fallbackText: "Di sản dệt Zèng người Cơ Tu Trường Sơn; thổ cẩm đen – đỏ đính hạt cườm chì lấp lánh.",
    suThat: [
      "Kỹ thuật luồn hạt cườm trực tiếp vào sợi dọc khi dệt trên khung cửi tre truyền thống.",
      "Hoa văn tái hiện cây nêu, chim Tơ Rưng và điệu múa Tân Tung Da Dă."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "ede_tho_cam",
    ten: "Trang phục Ê Đê",
    nhomIds: ["ede"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Thổ cẩm Ê Đê Tây Nguyên; nền chàm đen điểm dải hoa văn đỏ – vàng.",
    fallbackText: "Thổ cẩm Ê Đê Tây Nguyên; nền chàm đen điểm dải hoa văn đỏ – vàng.",
    suThat: [
      "Áo chui đầu xẻ ngực và váy quấn dệt kỹ thuật Kteh (luồn sợi nổi hoa văn).",
      "Gắn liền với không gian văn hóa Cồng chiêng Tây Nguyên (UNESCO)."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "bana_tho_cam",
    ten: "Trang phục Ba Na",
    nhomIds: ["bana"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Thổ cẩm dân tộc Ba Na Bắc Tây Nguyên; bố cục đối xứng 3 sắc đen – đỏ – trắng.",
    fallbackText: "Thổ cẩm dân tộc Ba Na Bắc Tây Nguyên; bố cục đối xứng 3 sắc đen – đỏ – trắng.",
    suThat: [
      "Dệt từ sợi bông nhuộm vỏ cây rừng: màu đen tượng trưng đất, đỏ là lửa/mặt trời, trắng là bầu trời.",
      "Áo chui đầu không tay (nam) hoặc ngắn tay (nữ) đi cùng váy quấn và vòng đồng."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "giarai_tho_cam",
    ten: "Trang phục Gia Rai",
    nhomIds: ["giarai"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Thổ cẩm người Gia Rai cao nguyên Pleiku; áo chui đầu dệt dải hoa văn ngang ngực và gấu.",
    fallbackText: "Thổ cẩm người Gia Rai cao nguyên Pleiku; áo chui đầu dệt dải hoa văn ngang ngực và gấu.",
    suThat: [
      "Nền vải chàm đen làm nổi bật các dải hoa văn đỏ thẫm, vàng nghệ đối xứng.",
      "Hoa văn mô phỏng nhà rông, hạt lúa rẫy và đôi cánh chim đại ngàn."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "mnong_tho_cam",
    ten: "Trang phục M'Nông",
    nhomIds: ["mnong"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Thổ cẩm người M'Nông Nam Tây Nguyên; váy quấn và áo dệt hoa văn sóng nước, chim rừng.",
    fallbackText: "Thổ cẩm người M'Nông Nam Tây Nguyên; váy quấn và áo dệt hoa văn sóng nước, chim rừng.",
    suThat: [
      "Dệt bằng khung cửi truyền thống với hoa văn thực vật, động vật và hình học liên hoàn.",
      "Kết hợp cùng kiềng đồng, vòng tay bạc và khuyên tai ngà truyền thống."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "xodang_tho_cam",
    ten: "Trang phục Xơ Đăng",
    nhomIds: ["xodang"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục dân tộc Xơ Đăng vùng núi Ngọc Linh; áo thổ cẩm phối dải khăn chéo ngực đỏ – đen.",
    fallbackText: "Y phục dân tộc Xơ Đăng vùng núi Ngọc Linh; áo thổ cẩm phối dải khăn chéo ngực đỏ – đen.",
    suThat: [
      "Dệt từ sợi bông tự trồng, nhuộm màu tự nhiên từ củ nâu, vỏ cây và lá chàm rừng.",
      "Nam giới thường quàng tấm vải thổ cẩm lớn bắt chéo trước ngực trong lễ hội mừng lúa mới."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "caho_tho_cam",
    ten: "Trang phục Cơ Ho",
    nhomIds: ["caho"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Thổ cẩm dân tộc Cơ Ho cao nguyên Lâm Viên; hoa văn hình thoi và kiềng đồng.",
    fallbackText: "Thổ cẩm dân tộc Cơ Ho cao nguyên Lâm Viên; hoa văn hình thoi và kiềng đồng.",
    suThat: [
      "Dệt trên khung cửi cổ truyền với họa tiết mắt võng, răng cưa, chim rừng.",
      "Thường kết hợp chuỗi hạt cườm cổ xưa và vòng đồng xoắn."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "can_bo_sung"],
    daKiemChung: true
  },
  {
    id: "champa_tho_cam",
    ten: "Trang phục Chăm",
    nhomIds: ["champa"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Di sản người Chăm Nam Trung Bộ; áo Aw Tah kết hợp dải khăn thổ cẩm Mỹ Nghiệp.",
    fallbackText: "Di sản người Chăm Nam Trung Bộ; áo Aw Tah kết hợp dải khăn thổ cẩm Mỹ Nghiệp.",
    suThat: [
      "Áo dài liền thân chui đầu kết hợp dây lưng thổ cẩm dệt chéo ngực (Talei Ka-in).",
      "Làng dệt Mỹ Nghiệp (Ninh Thuận) bảo tồn kỹ thuật dệt khung dài và khung ngắn truyền đời."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["tt_van_hoa_dan_toc", "bt_dan_toc_hoc"],
    daKiemChung: true
  },
  {
    id: "sampot",
    ten: "Sampot Khmer",
    nhomIds: ["khmer"],
    gioiTinh: "chung",
    dip: ["le_hoi", "cuoi"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Lễ phục người Khmer Nam Bộ; váy quấn Sampot dệt kim tuyến và khăn Sbai.",
    fallbackText: "Lễ phục người Khmer Nam Bộ; váy quấn Sampot dệt kim tuyến và khăn Sbai.",
    suThat: [
      "Sampot là tấm vải lụa/thổ cẩm dài quấn quanh hông, kết hợp khăn Sbai vắt chéo vai.",
      "Sử dụng trong lễ hội Chol Chnam Thmay, Ok Om Bok và lễ cưới cổ truyền."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["tt_van_hoa_dan_toc", "bt_dan_toc_hoc"],
    daKiemChung: true
  },
  {
    id: "bru_van_kieu",
    ten: "Trang phục Bru - Vân Kiều",
    nhomIds: ["cotu"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Y phục dân tộc Bru - Vân Kiều dãy Trường Sơn; áo chui đầu đính đồng bạc và váy thổ cẩm đỏ – đen.",
    fallbackText: "Y phục dân tộc Bru - Vân Kiều dãy Trường Sơn; áo chui đầu đính đồng bạc và váy thổ cẩm đỏ – đen.",
    suThat: [
      "Quanh cổ áo và vạt trước được đính những hàng đồng bạc mỏng hoặc hạt cườm tạo âm thanh vui tai khi múa.",
      "Váy ống dệt thổ cẩm với các dải hoa văn hình thoi và sóng nước đặc trưng miền Tây Quảng Trị."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "taoi_deng",
    ten: "Trang phục Tà Ôi (Thổ cẩm Dèng)",
    nhomIds: ["cotu"],
    gioiTinh: "chung",
    dip: ["le_hoi", "cuoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Di sản dệt Dèng người Tà Ôi (Pa Cô) vùng A Lưới; vải thổ cẩm đính hàng ngàn hạt cườm trắng.",
    fallbackText: "Di sản dệt Dèng người Tà Ôi (Pa Cô) vùng A Lưới; vải thổ cẩm đính hàng ngàn hạt cườm trắng.",
    suThat: [
      "Nghề dệt Dèng của người Tà Ôi tại A Lưới (Thừa Thiên Huế) được công nhận là Di sản văn hóa phi vật thể quốc gia.",
      "Hạt cườm được luồn trực tiếp vào sợi vải ngay trên khung cửi tạo thành đồ án núi rừng, chim muông."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "hre_lang_teng",
    ten: "Trang phục Hrê (Thổ cẩm Làng Teng)",
    nhomIds: ["xodang", "cotu"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Di sản dệt thổ cẩm Làng Teng người Hrê (Ba Tơ – Quảng Ngãi); váy ống hai tầng và áo năm thân.",
    fallbackText: "Di sản dệt thổ cẩm Làng Teng người Hrê (Ba Tơ – Quảng Ngãi); váy ống hai tầng và áo năm thân.",
    suThat: [
      "Thổ cẩm Làng Teng sử dụng 3 gam màu chủ đạo Đen – Đỏ – Trắng mô phỏng sông suối, núi rừng và lòng quả cảm.",
      "Váy phụ nữ Hrê may ghép hai tấm vải theo bố cục ngang và dọc độc đáo."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "cham_kate",
    ten: "Lễ phục Chăm Katê (Aw Kamei)",
    nhomIds: ["champa"],
    gioiTinh: "nu",
    dip: ["le_hoi", "le"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Lễ phục thiếu nữ Chăm trong đại lễ Katê; áo Aw Kamei trắng ngà thắt đai thổ cẩm Tali và khăn Mat'ra.",
    fallbackText: "Lễ phục thiếu nữ Chăm trong đại lễ Katê; áo Aw Kamei trắng ngà thắt đai thổ cẩm Tali và khăn Mat'ra.",
    suThat: [
      "Áo Aw Kamei cắt may liền thân không xẻ tà, tôn nét thanh khiết và uyển chuyển trong điệu múa quạt truyền thống.",
      "Hai dải băng thổ cẩm dệt tay thắt chéo trước ngực và ngang hông là điểm nhấn định danh văn hóa Chăm."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["tt_van_hoa_dan_toc", "bt_dan_toc_hoc"],
    daKiemChung: true
  },
  {
    id: "khmer_ao_tam_vong",
    ten: "Áo Tầm Vông & Sampot Hol Khmer",
    nhomIds: ["khmer"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cuoi", "tet"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Trang phục truyền thống phụ nữ Khmer Nam Bộ; áo Tầm Vông ôm dáng phối khăn Sbay và váy lụa Hol.",
    fallbackText: "Trang phục truyền thống phụ nữ Khmer Nam Bộ; áo Tầm Vông ôm dáng phối khăn Sbay và váy lụa Hol.",
    suThat: [
      "Áo Tầm Vông có phom dáng thanh lịch, tay dài vừa vặn, thường may bằng lụa tơ tằm vàng óng hoặc hồng sen.",
      "Kết hợp cùng váy Sampot Hol dệt nhuộm ikat thủ công và trang sức chạm trổ hoa văn Angkor."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["tt_van_hoa_dan_toc", "bt_dan_toc_hoc"],
    daKiemChung: true
  },
  {
    id: "ede_le_phuc_ktam",
    ten: "Lễ Phục Đại Lễ Ê Đê (Áo K'tăm & Choàng Thổ Cẩm)",
    nhomIds: ["ede"],
    gioiTinh: "nam",
    dip: ["le_hoi", "le"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Lễ phục uy nghiêm của người Ê Đê trong lễ Cúng Bến Nước và Mừng Lúa Mới; mảng ngực dệt chỉ đỏ – vàng lớn.",
    fallbackText: "Lễ phục uy nghiêm của người Ê Đê trong lễ Cúng Bến Nước và Mừng Lúa Mới; mảng ngực dệt chỉ đỏ – vàng lớn.",
    suThat: [
      "Giữa ngực áo là mảng hoa văn đỏ – vàng hình chữ nhật (K'tăm) tượng trưng cho tấm khiên che chở của thần linh.",
      "Dệt nổi bằng kỹ thuật Kteh công phu bậc nhất của phụ nữ Ê Đê."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "giarai_le_hoi_pothi",
    ten: "Lễ Phục Đại Lễ Gia Rai (Thổ Cẩm Đỏ – Chàm)",
    nhomIds: ["giarai"],
    gioiTinh: "chung",
    dip: ["le_hoi", "le"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Lễ phục truyền thống người Gia Rai vùng Pleiku – Chư Păh; thổ cẩm chàm đen dệt dải hoa văn nhà rông đỏ thẫm.",
    fallbackText: "Lễ phục truyền thống người Gia Rai vùng Pleiku – Chư Păh; thổ cẩm chàm đen dệt dải hoa văn nhà rông đỏ thẫm.",
    suThat: [
      "Hoa văn thổ cẩm Gia Rai phản ánh vũ trụ quan Tây Nguyên với hình tượng mái nhà rông, cây nêu và chim đại bàng.",
      "Mặc trong các nghi lễ cộng đồng lớn cùng tiếng cồng chiêng vang vọng đại ngàn."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "raglai_tho_cam",
    ten: "Trang phục Ra Glai & Chuỗi Cườm Mã La",
    nhomIds: ["champa", "caho"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Y phục dân tộc Ra Glai vùng Nam Trường Sơn (Khánh Hòa – Ninh Thuận); thổ cẩm trắng ngà phối sọc đỏ – đen.",
    fallbackText: "Y phục dân tộc Ra Glai vùng Nam Trường Sơn (Khánh Hòa – Ninh Thuận); thổ cẩm trắng ngà phối sọc đỏ – đen.",
    suThat: [
      "Người Ra Glai lưu giữ kho tàng sử thi đồ sộ (Udai - Ujac) và nhạc cụ Mã la bằng đồng phẳng không núm.",
      "Trang phục mang đậm dấu ấn văn hóa Nam Đảo giao thoa giữa núi rừng Trường Sơn và duyên hải."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "xtieng_bom_bo",
    ten: "Trang phục Xtiêng (Thổ Cẩm Sóc Bom Bo)",
    nhomIds: ["mnong", "caho"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Di sản dệt thổ cẩm người Xtiêng vùng Bình Phước; váy quấn và tấm choàng dệt hoa văn hình học đỏ – đen.",
    fallbackText: "Di sản dệt thổ cẩm người Xtiêng vùng Bình Phước; váy quấn và tấm choàng dệt hoa văn hình học đỏ – đen.",
    suThat: [
      "Nghề dệt thổ cẩm truyền thống của người Xtiêng tại Bình Phước là Di sản văn hóa phi vật thể quốc gia.",
      "Sợi bông được nhuộm màu tự nhiên từ vỏ cây lộc vừng, củ nghệ và lá chàm rừng."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  }
];
