/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dữ liệu trang phục truyền thống: Vùng Tây Bắc, Đông Bắc & Việt Bắc
 */

import { TrangPhuc } from "../../types";

export const trangPhucTayBacVaVietBac: TrangPhuc[] = [
  {
    id: "co_thai",
    ten: "Áo cỏm Thái",
    nhomIds: ["thai"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục nữ Thái Tây Bắc; áo ngắn ôm thân đính hàng khuy bướm bạc.",
    fallbackText: "Y phục nữ Thái Tây Bắc; áo ngắn ôm thân đính hàng khuy bướm bạc.",
    suThat: [
      "Áo ngắn ôm sát cơ thể, đính hai hàng khuy bạc chạm hình bướm/ong (Mák pém).",
      "Mặc cùng váy đen ống suông, thắt lưng xanh và khăn Piêu thêu tay."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "mong_lanh",
    ten: "Trang phục Mông",
    nhomIds: ["mong"],
    gioiTinh: "chung",
    dip: ["le_hoi", "cho_phien"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Di sản vùng cao Bắc Bộ; vải lanh dệt tay, vẽ sáp ong và nhuộm chàm.",
    fallbackText: "Di sản vùng cao Bắc Bộ; vải lanh dệt tay, vẽ sáp ong và nhuộm chàm.",
    suThat: [
      "Dệt từ sợi vỏ cây lanh, tạo hoa văn bằng bút sáp ong nóng chảy và nhuộm chàm.",
      "Váy xếp nếp xòe rộng phối xà cạp, thắt lưng thêu và kiềng bạc chạm khắc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "dao_do",
    ten: "Trang phục Dao Đỏ",
    nhomIds: ["dao"],
    gioiTinh: "chung",
    dip: ["le_hoi", "cuoi", "tet"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Y phục người Dao Đỏ Bắc Bộ; nền chàm thêu chỉ đỏ và khăn vấn tua bông.",
    fallbackText: "Y phục người Dao Đỏ Bắc Bộ; nền chàm thêu chỉ đỏ và khăn vấn tua bông.",
    suThat: [
      "Áo dài nền chàm thêu hoa văn chữ Vạn, cây thông, chim muông bằng chỉ đỏ.",
      "Khăn vấn đầu đỏ rực kết hạt cườm, bông len và hàng chuông bạc trước ngực."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "dao_tien",
    ten: "Trang phục Dao Tiền",
    nhomIds: ["daotien"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cho_phien", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục người Dao Tiền vùng Tây Bắc – Việt Bắc; váy in sáp ong và đồng tiền bạc sau lưng.",
    fallbackText: "Y phục người Dao Tiền vùng Tây Bắc – Việt Bắc; váy in sáp ong và đồng tiền bạc sau lưng.",
    suThat: [
      "Sau cổ áo đính chuỗi đồng tiền cổ bằng bạc tượng trưng cho sự sung túc và bình an.",
      "Chân váy nhuộm chàm in hoa văn sáp ong hình sóng nước và xoáy ốc tinh xảo."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "tay_cham",
    ten: "Áo chàm Tày",
    nhomIds: ["tay"],
    gioiTinh: "chung",
    dip: ["le_hoi", "doi_thuong", "cho_phien"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Trang phục truyền thống dân tộc Tày Việt Bắc; áo 5 thân vải bông nhuộm chàm.",
    fallbackText: "Trang phục truyền thống dân tộc Tày Việt Bắc; áo 5 thân vải bông nhuộm chàm.",
    suThat: [
      "Áo năm thân cắt may từ vải bông tự dệt nhuộm chàm xanh đen, cài khuy đồng bên nách.",
      "Đi kèm thắt lưng lụa, kiềng bạc tròn và túi vải thổ cẩm đeo vai."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "can_bo_sung"],
    daKiemChung: true
  },
  {
    id: "nung_cham",
    ten: "Trang phục Nùng",
    nhomIds: ["nung"],
    gioiTinh: "chung",
    dip: ["le_hoi", "cho_phien", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục dân tộc Nùng xứ Lạng – Cao Bằng; áo chàm 5 thân ngắn viền vải màu nơi cổ tay.",
    fallbackText: "Y phục dân tộc Nùng xứ Lạng – Cao Bằng; áo chàm 5 thân ngắn viền vải màu nơi cổ tay.",
    suThat: [
      "Áo 5 thân dáng ngắn rộng, ống tay to viền vải khác màu và cài khuy vải hoặc khuy bạc.",
      "Phụ nữ Nùng Phàn Slình và Nùng Cháo nổi tiếng với khăn chàm đính cườm và kiềng bạc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "san_chay",
    ten: "Trang phục Sán Chay",
    nhomIds: ["sanchay"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục dân tộc Sán Chay trung du Bắc Bộ; áo chàm phối vạt xanh và dây lưng lụa.",
    fallbackText: "Y phục dân tộc Sán Chay trung du Bắc Bộ; áo chàm phối vạt xanh và dây lưng lụa.",
    suThat: [
      "Áo chàm dài qua gối, vạt trước ghép dải vải màu xanh hoặc đỏ tạo điểm nhấn thanh nhã.",
      "Mặc trong lễ hội cầu mùa và hát Sình ca truyền thống vùng Đông Bắc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "lo_lo_hoa",
    ten: "Trang phục Lô Lô Hoa",
    nhomIds: ["lolo"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cho_phien"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Di sản người Lô Lô cao nguyên đá Hà Giang; ghép từ hàng trăm mảnh vải màu.",
    fallbackText: "Di sản người Lô Lô cao nguyên đá Hà Giang; ghép từ hàng trăm mảnh vải màu.",
    suThat: [
      "Nghệ thuật ghép vải (patchwork) từ hàng trăm mảnh tam giác, vuông nhỏ đủ màu sắc.",
      "Hoa văn mô phỏng mặt trời, chim Tước và ruộng bậc thang vùng cực Bắc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "ha_nhi",
    ten: "Trang phục Hà Nhì",
    nhomIds: ["hanhi"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["lanh"],
    moTaNgan: "Y phục người Hà Nhì vùng núi biên giới Tây Bắc; áo chàm hai lớp đính đồng bạc.",
    fallbackText: "Y phục người Hà Nhì vùng núi biên giới Tây Bắc; áo chàm hai lớp đính đồng bạc.",
    suThat: [
      "Áo chàm xanh hoặc đen dày dặn giữ ấm vùng núi cao, viền dải vải màu và đính khuy bạc.",
      "Mũ đội đầu (khăn pà xò) tết sợi len, hạt cườm và tua rua cầu kỳ."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "can_bo_sung"],
    daKiemChung: true
  },
  {
    id: "pa_then",
    ten: "Trang phục Pà Thẻn",
    nhomIds: ["pathen"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cuoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Lễ phục người Pà Thẻn Hà Giang – Tuyên Quang; sắc đỏ lửa chủ đạo.",
    fallbackText: "Lễ phục người Pà Thẻn Hà Giang – Tuyên Quang; sắc đỏ lửa chủ đạo.",
    suThat: [
      "Phối màu đỏ rực chủ đạo đan xen sọc trắng, đen gắn liền với tín ngưỡng thần Lửa.",
      "Khăn vấn đầu quấn nhiều vòng vươn rộng hai bên như đôi cánh chim phượng."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "thai_trang",
    ten: "Áo cỏm Thái Trắng (Tày Khao)",
    nhomIds: ["thai"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "cuoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục nữ Thái Trắng Tây Bắc; áo cỏm trắng cổ tim đính khuy bướm bạc, phối váy đen và khăn Piêu.",
    fallbackText: "Y phục nữ Thái Trắng Tây Bắc; áo cỏm trắng cổ tim đính khuy bướm bạc, phối váy đen và khăn Piêu.",
    suThat: [
      "Khác với Thái Đen mặc áo tối màu cổ cao, phụ nữ Thái Trắng ưa chuộng áo cỏm trắng cổ xẻ hình chữ V duyên dáng.",
      "Hai hàng cúc bạc hình bướm (mắc pém) tượng trưng cho sự gắn kết âm dương và hạnh phúc lứa đôi."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "tay_ao_luong",
    ten: "Áo lương & Lễ phục Tày",
    nhomIds: ["tay"],
    gioiTinh: "chung",
    dip: ["le_hoi", "tet", "cuoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Lễ phục truyền thống người Tày vùng Việt Bắc; áo chàm dài năm thân khoác ngoài áo cánh trắng.",
    fallbackText: "Lễ phục truyền thống người Tày vùng Việt Bắc; áo chàm dài năm thân khoác ngoài áo cánh trắng.",
    suThat: [
      "Áo lương chàm dài buông qua gối, cài khuy đồng bên nách phải, mặc trong hội Lồng Tồng và lễ cưới.",
      "Đi kèm khăn xếp chàm, thắt lưng lụa và bộ xà tích bạc chạm khắc tinh xảo."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "nung_phan_slinh",
    ten: "Trang phục Nùng Phàn Slình",
    nhomIds: ["nung"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cho_phien", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Sắc phục nhánh Nùng Phàn Slình xứ Lạng; áo chàm 5 thân đáp dải vải lam ở cổ và cửa tay.",
    fallbackText: "Sắc phục nhánh Nùng Phàn Slình xứ Lạng; áo chàm 5 thân đáp dải vải lam ở cổ và cửa tay.",
    suThat: [
      "Nổi bật với chiếc khăn chàm vấn đầu đính hạt cườm và hoa văn hình học trang nhã.",
      "Vải bông tự trồng được nhuộm chàm hàng chục lần tạo độ bóng bền bỉ qua năm tháng."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "hmong_hoa",
    ten: "Trang phục H'Mông Hoa",
    nhomIds: ["mong"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cho_phien", "tet"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Sắc phục người H'Mông Hoa vùng Bắc Hà – Mù Cang Chải; váy lanh xếp ly kết hợp thêu đáp vải đỏ – vàng rực rỡ.",
    fallbackText: "Sắc phục người H'Mông Hoa vùng Bắc Hà – Mù Cang Chải; váy lanh xếp ly kết hợp thêu đáp vải đỏ – vàng rực rỡ.",
    suThat: [
      "Mỗi bộ váy áo H'Mông Hoa cần từ 6 tháng đến 1 năm se lanh, vẽ sáp ong và thêu chữ thập tỉ mỉ.",
      "Cổ áo và ống tay ghép những dải vải màu nóng tương phản nổi bật giữa núi rừng Tây Bắc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "hmong_trang",
    ten: "Trang phục H'Mông Trắng",
    nhomIds: ["mong"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "cho_phien"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Y phục người H'Mông Trắng cao nguyên đá Đồng Văn; váy lanh trắng xếp nếp xòe và cổ áo sau thêu xoắn ốc.",
    fallbackText: "Y phục người H'Mông Trắng cao nguyên đá Đồng Văn; váy lanh trắng xếp nếp xòe và cổ áo sau thêu xoắn ốc.",
    suThat: [
      "Chân váy làm từ vải lanh giặt trắng tự nhiên, xếp hàng trăm nếp ly đều đặn như cánh hoa rừng.",
      "Đi kèm tạp dề trước bụng, dây lưng thêu chỉ màu và kiềng bạc chạm trổ."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "dao_ao_dai",
    ten: "Trang phục Dao Áo Dài (Dao Thanh Y)",
    nhomIds: ["dao"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "cuoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Sắc phục người Dao Áo Dài & Dao Thanh Y Đông Bắc; áo chàm dài thêu sao tám cánh và mũ đính bạc.",
    fallbackText: "Sắc phục người Dao Áo Dài & Dao Thanh Y Đông Bắc; áo chàm dài thêu sao tám cánh và mũ đính bạc.",
    suThat: [
      "Thân áo dài quá gối, thêu hoa văn ngôi sao tám cánh và cây thông bằng kỹ thuật thêu mặt trái vải.",
      "Đầu đội mũ cao quấn khăn hoặc đính các ngôi sao bạc lấp lánh."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "lolo_den",
    ten: "Trang phục Lô Lô Đen",
    nhomIds: ["lolo"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cho_phien"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Di sản người Lô Lô Đen vùng Bảo Lạc (Cao Bằng); áo cổ vuông ghép vòng vải màu trên ống tay rộng.",
    fallbackText: "Di sản người Lô Lô Đen vùng Bảo Lạc (Cao Bằng); áo cổ vuông ghép vòng vải màu trên ống tay rộng.",
    suThat: [
      "Áo ngắn chui đầu cổ vuông, phía sau lưng đính những dải tua vải và hạt cườm tượng trưng cho cội nguồn.",
      "Ống tay áo ghép từ các vòng vải màu đỏ, vàng, xanh lam nối tiếp nhau."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "hanhi_hoa",
    ten: "Trang phục Hà Nhì Hoa",
    nhomIds: ["hanhi"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["lanh"],
    moTaNgan: "Lễ phục người Hà Nhì Hoa vùng Mường Tè – Bát Xát; áo chàm đáp vải hình răng cưa và mũ tua rua cườm.",
    fallbackText: "Lễ phục người Hà Nhì Hoa vùng Mường Tè – Bát Xát; áo chàm đáp vải hình răng cưa và mũ tua rua cườm.",
    suThat: [
      "Nẹp áo và ống tay khâu đáp các dải vải hình tam giác, răng cưa kết hợp đính hàng đồng xu bạc.",
      "Mũ đội đầu kết từ hàng chục chuỗi hạt cườm, bông len và tua rua nhiều màu sắc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "lao_sinh",
    ten: "Váy Sinh (Xỉn) & Áo cỏm Lào",
    nhomIds: ["thai"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "cuoi"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Sắc phục phụ nữ dân tộc Lào vùng Điện Biên – Sơn La; váy ống Sinh dệt thổ cẩm chân váy và khăn vắt vai.",
    fallbackText: "Sắc phục phụ nữ dân tộc Lào vùng Điện Biên – Sơn La; váy ống Sinh dệt thổ cẩm chân váy và khăn vắt vai.",
    suThat: [
      "Chân váy Sinh được dệt thổ cẩm cực kỳ tinh xảo với đồ án rắn thần Naga, chim công và hoa đại.",
      "Phụ nữ Lào thường búi tóc cao lệch sang bên trái, cài trâm bạc và quàng khăn thổ cẩm chéo vai trái."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "giay_ao_vien",
    ten: "Trang phục Giáy viền sắc cầu vồng",
    nhomIds: ["nung", "tay"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cho_phien", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Sắc phục phụ nữ dân tộc Giáy vùng Bát Xát – Sa Pa; áo xẻ nách đáp viền vải cong khác màu tinh tế.",
    fallbackText: "Sắc phục phụ nữ dân tộc Giáy vùng Bát Xát – Sa Pa; áo xẻ nách đáp viền vải cong khác màu tinh tế.",
    suThat: [
      "Điểm nhận diện độc đáo nhất của áo người Giáy là đường viền vải to bản uốn cong từ cổ sang nách phải và quanh cửa tay.",
      "Màu vải áo và màu đường viền luôn tạo sự tương phản tươi sáng như xanh lam phối hồng sen hoặc chàm phối lục."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "sandiu_vay_la",
    ten: "Trang phục Sán Dìu (Áo chàm & Váy lá)",
    nhomIds: ["sanchay", "tay"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Y phục dân tộc Sán Dìu vùng trung du Đông Bắc; áo chàm bốn thân mặc ngoài yếm đỏ và váy lá xẻ mảnh.",
    fallbackText: "Y phục dân tộc Sán Dìu vùng trung du Đông Bắc; áo chàm bốn thân mặc ngoài yếm đỏ và váy lá xẻ mảnh.",
    suThat: [
      "Chiếc váy chàm của phụ nữ Sán Dìu không khâu kín mà gồm 2 đến 4 mảnh vải rời đính vào cạp, gọi là váy lá.",
      "Thắt lưng lụa xanh hoặc hồng buộc ngoài áo chàm tôn lên bộ xà tích bạc bên hông."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "boy_vay_xoe",
    ten: "Trang phục Bố Y (Yếm thêu & Váy sáp ong)",
    nhomIds: ["mong", "nung"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Di sản người Bố Y vùng Quản Bạ (Hà Giang); áo ngắn 5 thân viền mây nước mặc cùng yếm thêu và váy sáp ong.",
    fallbackText: "Di sản người Bố Y vùng Quản Bạ (Hà Giang); áo ngắn 5 thân viền mây nước mặc cùng yếm thêu và váy sáp ong.",
    suThat: [
      "Cổ áo và vạt áo được đáp các dải hoa văn sóng nước, mây cuộn màu xanh lam – trắng thanh nhã.",
      "Mặc ngoài chiếc yếm thêu hoa mẫu đơn, chim phượng kết hợp chân váy xếp ly in sáp ong."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "dao_quan_trang",
    ten: "Trang phục Dao Quần Trắng (Yếm Thêu Lớn)",
    nhomIds: ["dao", "daotien"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "cuoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Sắc phục người Dao Quần Trắng vùng Yên Bái – Tuyên Quang; yếm thêu hoa văn lớn trước ngực phối quần trắng.",
    fallbackText: "Sắc phục người Dao Quần Trắng vùng Yên Bái – Tuyên Quang; yếm thêu hoa văn lớn trước ngực phối quần trắng.",
    suThat: [
      "Chiếc yếm thêu chỉ đỏ – vàng che kín ngực là điểm nhấn nghệ thuật rực rỡ trên nền áo chàm dài.",
      "Quần vải bông trắng tinh khôi được giữ gìn cẩn trọng cho ngày cưới và lễ cấp sắc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "hmong_do",
    ten: "Trang phục H'Mông Đỏ (Mông Si)",
    nhomIds: ["mong"],
    gioiTinh: "nu",
    dip: ["le_hoi", "cho_phien", "tet"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Sắc phục nhánh H'Mông Đỏ vùng Tây Bắc; áo và tạp dề thêu kín hoa văn chữ thập sắc đỏ son nồng ấm.",
    fallbackText: "Sắc phục nhánh H'Mông Đỏ vùng Tây Bắc; áo và tạp dề thêu kín hoa văn chữ thập sắc đỏ son nồng ấm.",
    suThat: [
      "Sử dụng kỹ thuật thêu chữ thập và đáp vải màu đỏ chủ đạo kết hợp các hàng đồng bạc và bông len.",
      "Khăn vấn đầu đồ sộ quấn nhiều vòng tạo vẻ uy nghi và duyên dáng giữa núi rừng."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "hmong_den",
    ten: "Trang phục H'Mông Đen (Lanh Chàm Ánh Đồng)",
    nhomIds: ["mong"],
    gioiTinh: "chung",
    dip: ["le_hoi", "cho_phien", "doi_thuong"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Di sản người H'Mông Đen vùng Sa Pa (Lào Cai); vải lanh nhuộm chàm sẫm lăn đá tạo ánh tím đồng.",
    fallbackText: "Di sản người H'Mông Đen vùng Sa Pa (Lào Cai); vải lanh nhuộm chàm sẫm lăn đá tạo ánh tím đồng.",
    suThat: [
      "Vải lanh sau khi nhuộm chàm hàng chục lần được lăn phẳng bằng khúc gỗ trên phiến đá cho đến khi ánh lên sắc tím đồng bóng mượt.",
      "Cổ áo và ống tay thêu hoa văn xoắn ốc màu xanh lục, lam và đỏ trầm tinh tế."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "tay_le_cuoi",
    ten: "Lễ Phục Cưới Tày – Nùng (Áo Chàm Kép & Kiềng Bạc)",
    nhomIds: ["tay", "nung"],
    gioiTinh: "nu",
    dip: ["cuoi", "le_hoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Lễ phục tân nương Tày – Nùng vùng Việt Bắc; áo chàm mới tinh tươm phối bộ kiềng bạc kép và nón lá cọ.",
    fallbackText: "Lễ phục tân nương Tày – Nùng vùng Việt Bắc; áo chàm mới tinh tươm phối bộ kiềng bạc kép và nón lá cọ.",
    suThat: [
      "Trong ngày về nhà chồng, cô dâu Tày – Nùng mặc nhiều lớp áo chàm mới, thắt dây lưng lụa đào/xanh và đeo bộ xà tích bạc 7 món.",
      "Tượng trưng cho sự đảm đang, hiếu thảo và lời chúc phúc trăm năm."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "thai_le_hoi_xoe",
    ten: "Lễ Phục Xòe Hoa Thái (Áo Cỏm Lam & Khăn Piêu)",
    nhomIds: ["thai"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Sắc phục trình diễn Nghệ thuật Xòe Thái (Di sản UNESCO); áo cỏm xanh ngọc/hồng sen đính khuy bướm bạc.",
    fallbackText: "Sắc phục trình diễn Nghệ thuật Xòe Thái (Di sản UNESCO); áo cỏm xanh ngọc/hồng sen đính khuy bướm bạc.",
    suThat: [
      "Nghệ thuật Xòe Thái được UNESCO ghi danh là Di sản văn hóa phi vật thể đại diện của nhân loại năm 2021.",
      "Dải thắt lưng lụa xanh và chiếc khăn Piêu thêu cút piêu chuyển động nhịp nhàng theo từng vòng xòe đoàn kết."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "khomu_ao_bac",
    ten: "Trang phục Khơ Mú Đính Bạc & Cườm Ngũ Sắc",
    nhomIds: ["thai"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Sắc phục phụ nữ dân tộc Khơ Mú vùng Tây Bắc – Nghệ An; áo ngắn chàm đen đính đồng bạc cổ và chân váy hoa văn sao.",
    fallbackText: "Sắc phục phụ nữ dân tộc Khơ Mú vùng Tây Bắc – Nghệ An; áo ngắn chàm đen đính đồng bạc cổ và chân váy hoa văn sao.",
    suThat: [
      "Ngực áo được trang trí cầu kỳ bằng những hàng đồng bạc trắng, vỏ ốc biển và chuỗi hạt cườm đa sắc.",
      "Chân váy dệt nổi hình hươu nai, chim chóc và mặt trời rực rỡ."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "lu_ao_canh_buom",
    ten: "Trang phục Dân Tộc Lự (Áo Cánh Bướm & Váy 3 Tầng)",
    nhomIds: ["thai", "mong"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "cho_phien"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Tuyệt tác dệt may của người Lự vùng Tam Đường – Sìn Hồ (Lai Châu); áo vắt chéo 6 mảnh và váy dệt sóng nước.",
    fallbackText: "Tuyệt tác dệt may của người Lự vùng Tam Đường – Sìn Hồ (Lai Châu); áo vắt chéo 6 mảnh và váy dệt sóng nước.",
    suThat: [
      "Thân áo được cắt ghép từ 6 miếng vải chàm hình rẻ quạt tạo dáng xòe mềm mại như đôi cánh bướm.",
      "Chân váy chia 3 tầng hoa văn: tầng trên dệt sóng nước, tầng giữa hình quả trám, tầng dưới đen tuyền."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "lachi_ao_tu_than_cham",
    ten: "Trang phục La Chí (Áo Tứ Thân Chàm & Yếm Thêu)",
    nhomIds: ["tay", "hanhi"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Di sản người La Chí vùng Hoàng Su Phì (Hà Giang); áo dài chàm 4 thân xẻ ngực mặc ngoài yếm thêu hoa.",
    fallbackText: "Di sản người La Chí vùng Hoàng Su Phì (Hà Giang); áo dài chàm 4 thân xẻ ngực mặc ngoài yếm thêu hoa.",
    suThat: [
      "Áo chàm dài buông thướt tha không cài cúc mà dùng dây lưng vải chàm thắt gọn ngang eo, để lộ chiếc yếm thêu chỉ tơ rực rỡ.",
      "Gắn liền với lễ hội Khu Cù Tê (Tết tháng Bảy) trên những thửa ruộng bậc thang di sản."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "phula_dinh_cuom_y_di",
    ten: "Trang phục Phù Lá (Xá Phó) Đính Hạt Ý Dĩ Rừng",
    nhomIds: ["hanhi", "lolo"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet", "cho_phien"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Di sản người Phù Lá (Xá Phó) vùng Sa Pa – Bắc Hà; áo cổ vuông đính hàng ngàn hạt cườm rừng (hạt Ý dĩ) trắng ngà.",
    fallbackText: "Di sản người Phù Lá (Xá Phó) vùng Sa Pa – Bắc Hà; áo cổ vuông đính hàng ngàn hạt cườm rừng (hạt Ý dĩ) trắng ngà.",
    suThat: [
      "Phụ nữ Xá Phó sử dụng hạt cây Ý dĩ (Bo Bo) cứng bóng tự nhiên kết thành những đường hoa văn ngôi sao và rừng thông trên nền vải chàm.",
      "Nghệ thuật trang trí trên trang phục người Xá Phó đã được công nhận là Di sản văn hóa phi vật thể quốc gia."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "pupeo_ghep_vai_mat_troi",
    ten: "Trang phục Pu Péo (Tạp Dề Ghép Vải Mặt Trời)",
    nhomIds: ["lolo", "hanhi"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Sắc phục người Pu Péo vùng Đồng Văn – Yên Minh (Hà Giang); ghép hàng trăm miếng vải tam giác nhỏ hình mặt trời.",
    fallbackText: "Sắc phục người Pu Péo vùng Đồng Văn – Yên Minh (Hà Giang); ghép hàng trăm miếng vải tam giác nhỏ hình mặt trời.",
    suThat: [
      "Không dùng kỹ thuật thêu, phụ nữ Pu Péo cắt ghép hàng trăm mảnh vải nhỏ li ti màu đỏ, vàng, xanh tạo thành đồ án hình thoi và mặt trời.",
      "Thể hiện sự khéo léo tuyệt đỉnh và tín ngưỡng thờ thần Rừng, thần Mặt Trời vùng cao nguyên đá."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  },
  {
    id: "odu_tho_cam_to_tam",
    ten: "Trang phục Ơ Đu (Váy Tơ Tằm & Thổ Cẩm Xứ Nghệ)",
    nhomIds: ["thai", "muong"],
    gioiTinh: "nu",
    dip: ["le_hoi", "tet"],
    thoiTiet: ["mat", "nong"],
    moTaNgan: "Sắc phục dân tộc Ơ Đu vùng Tương Dương (Nghệ An); áo ngắn và chân váy dệt sợi bông pha tơ tằm vàng óng.",
    fallbackText: "Sắc phục dân tộc Ơ Đu vùng Tương Dương (Nghệ An); áo ngắn và chân váy dệt sợi bông pha tơ tằm vàng óng.",
    suThat: [
      "Người Ơ Đu đón năm mới vào ngày tiếng sấm đầu xuân vang lên (Lễ hội Tiếng Sấm đầu năm).",
      "Chân váy và khăn đội đầu được dệt từ sợi bông kết hợp tơ tằm nhuộm màu thảo mộc núi rừng miền Tây xứ Nghệ."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "tt_van_hoa_dan_toc"],
    daKiemChung: true
  }
];
