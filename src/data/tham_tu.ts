import type { CaThamTu } from "../types";

export type VungKiemTraThamTu = "headwear" | "garment" | "accessories" | "pattern" | "all_good";

export interface CaThamTuMoRong extends CaThamTu {
  tenCa: string;
  capDo: "Dễ" | "Trung bình" | "Khó";
  diemThuong: number;
  vungDung: VungKiemTraThamTu;
  mauHex?: string;
  gioi?: "nu" | "nam" | "trung_tinh";
  toc?: string;
  tenHoaTiet: string;
  goiYKhiSai: string;
}

export interface CauHoiQuizThamTu {
  id: string;
  chuDe: "Cổ phục Triều Nguyễn" | "Việt phục Ba Miền" | "Sắc phục Dân tộc" | "Chất liệu & Làng nghề";
  capDo: "Dễ" | "Trung bình" | "Khó";
  diem: number;
  cauHoi: string;
  luaChon: [string, string, string, string];
  dapAnDung: 0 | 1 | 2 | 3;
  giaiThich: string;
  trangPhucMinhHoa?: {
    trangPhucId: string;
    mauHex: string;
    phuKienIds: string[];
    gioi: "nu" | "nam";
  };
}

export const caThamTu: CaThamTuMoRong[] = [
  {
    id: "t1",
    tenCa: "Ca 01: Tấc lễ tân khoa",
    capDo: "Dễ",
    diemThuong: 15,
    boPhoi: {
      trangPhucId: "ao_tac",
      mauSacId: "xanh_lam",
      phuKienIds: ["non_quai_thao"],
      hoaTietId: "may_ngu_sac",
    },
    mauHex: "#205081",
    gioi: "nam",
    toc: "bui_cao",
    tenHoaTiet: "Mây ngũ sắc cung đình",
    vungDung: "headwear",
    loiSai: "Đội Nón quai thao cùng Áo Tấc đại lễ",
    lyDo: "Áo Tấc là đại lễ phục trang trọng (thường đi cùng Khăn đóng/Khăn xếp chỉnh tề), còn Nón quai thao là phụ kiện đặc trưng của hội hè Quan họ vùng Kinh Bắc đi cùng Áo tứ thân.",
    goiYKhiSai: "Hãy quan sát kỹ phần đầu: chiếc nón rộng vành quai thao có thuộc về trang phục đại lễ cung đình không?",
  },
  {
    id: "t2",
    tenCa: "Ca 02: Nếp Chăm miền nắng gió",
    capDo: "Dễ",
    diemThuong: 15,
    boPhoi: {
      trangPhucId: "champa_tho_cam",
      mauSacId: "trang_nga",
      phuKienIds: ["khan_pieu"],
      hoaTietId: "hoa_van_cham",
    },
    mauHex: "#F4EFE6",
    gioi: "nu",
    toc: "bui_cao",
    tenHoaTiet: "Thổ cẩm Chăm Pa cổ truyền",
    vungDung: "headwear",
    loiSai: "Đội Khăn Piêu của người Thái cùng trang phục Chăm",
    lyDo: "Khăn Piêu thêu hoa văn sặc sỡ là biểu tượng của phụ nữ Thái vùng Tây Bắc, không thuộc hệ trang phục cổ truyền của đồng bào Chăm vùng Duyên hải Nam Trung Bộ.",
    goiYKhiSai: "Hãy kiểm tra chiếc khăn đội đầu: đó là khăn Mat'ra của người Chăm hay khăn vùng núi Tây Bắc?",
  },
  {
    id: "t3",
    tenCa: "Ca 03: Dáng lụa Ngũ thân",
    capDo: "Dễ",
    diemThuong: 15,
    boPhoi: {
      trangPhucId: "ngu_than",
      mauSacId: "vang_hoang",
      phuKienIds: ["khan_dong", "kieng_bac"],
      hoaTietId: "hoa_sen",
    },
    mauHex: "#D4AF37",
    gioi: "nu",
    toc: "bui_cao",
    tenHoaTiet: "Hoa sen thanh nhã",
    vungDung: "all_good",
    loiSai: null,
    lyDo: "Bộ phối hoàn toàn chuẩn mực: Áo ngũ thân tay chẽn kết hợp Khăn đóng, Kiềng bạc và họa tiết Hoa sen thanh nhã đúng chuẩn mực thẩm mỹ truyền thống.",
    goiYKhiSai: "Cẩn thận nhé! Hãy nhìn tổng thể từ khăn đóng, cổ đứng ngũ thân đến kiềng bạc xem có điểm nào lệch vùng văn hóa không.",
  },
  {
    id: "t4",
    tenCa: "Ca 04: Hội Lim Kinh Bắc",
    capDo: "Trung bình",
    diemThuong: 20,
    boPhoi: {
      trangPhucId: "tu_than",
      mauSacId: "nau_dat",
      phuKienIds: ["non_quai_thao"],
      hoaTietId: "tho_cam_tay_nguyen",
    },
    mauHex: "#7B4B3A",
    gioi: "nu",
    toc: "bui_thap",
    tenHoaTiet: "Thổ cẩm Tây Nguyên (Đỏ - Đen)",
    vungDung: "pattern",
    loiSai: "Dệt họa tiết Thổ cẩm Tây Nguyên trên Áo tứ thân Bắc Bộ",
    lyDo: "Áo tứ thân vùng đồng bằng Bắc Bộ truyền thống dệt bằng lụa tơ tằm trơn hoặc gấm hoa nhí nhẹ nhàng, không sử dụng dải hoa văn kỷ hà thổ cẩm Tây Nguyên.",
    goiYKhiSai: "Nón quai thao đã rất hợp với Áo tứ thân rồi! Hãy thử soi kỹ lớp họa tiết dệt được ghi trong hồ sơ xem sao.",
  },
  {
    id: "t5",
    tenCa: "Ca 05: Áo Cỏm bên suối",
    capDo: "Trung bình",
    diemThuong: 20,
    boPhoi: {
      trangPhucId: "co_thai",
      mauSacId: "trang_nga",
      phuKienIds: ["khan_pieu", "vong_co_bac"],
      hoaTietId: "hoa_ban",
    },
    mauHex: "#F4EFE6",
    gioi: "nu",
    toc: "bui_cao",
    tenHoaTiet: "Hoa ban trắng Tây Bắc",
    vungDung: "all_good",
    loiSai: null,
    lyDo: "Sự kết hợp hài hòa của phụ nữ Thái Tây Bắc: Áo cỏm đính hàng cúc bướm bạc (mắc pém), đội Khăn Piêu thêu tay và họa tiết Hoa ban núi rừng.",
    goiYKhiSai: "Áo cỏm, Khăn Piêu và Hoa ban đều là những biểu tượng đặc trưng của văn hóa Thái vùng Tây Bắc đó!",
  },
  {
    id: "t6",
    tenCa: "Ca 06: Sắc chàm người Dao Đỏ",
    capDo: "Trung bình",
    diemThuong: 20,
    boPhoi: {
      trangPhucId: "dao_do",
      mauSacId: "cham_indig",
      phuKienIds: ["non_la", "vong_co_bac"],
      hoaTietId: "hoa_van_dao",
    },
    mauHex: "#1F2A44",
    gioi: "nu",
    toc: "bui_cao",
    tenHoaTiet: "Cây thông & Dấu ấn Bàn Vương",
    vungDung: "headwear",
    loiSai: "Đội Nón lá bài thơ thay vì Khăn đỏ truyền thống của người Dao",
    lyDo: "Điểm nhận diện linh thiêng nhất của phụ nữ Dao Đỏ là chiếc khăn quấn đầu đỏ rực kết hợp tua hạt cườm và bông len đỏ, không đội nón lá xuôi vùng đồng bằng.",
    goiYKhiSai: "Hãy chú ý phần đầu của trang phục Dao Đỏ: vì sao lại gọi là Dao Đỏ?",
  },
  {
    id: "t7",
    tenCa: "Ca 07: Hương phù sa Nam Bộ",
    capDo: "Dễ",
    diemThuong: 15,
    boPhoi: {
      trangPhucId: "ba_ba",
      mauSacId: "xanh_ngoc",
      phuKienIds: ["khan_ran", "guoc_go"],
      hoaTietId: "tron",
    },
    mauHex: "#2E6F5E",
    gioi: "nu",
    toc: "dai_xoa",
    tenHoaTiet: "Lụa trơn mộc mạc",
    vungDung: "all_good",
    loiSai: null,
    lyDo: "Chuẩn cốt cách miền Tây sông nước: Áo bà ba xẻ tà thoải mái phối cùng Khăn rằn Nam Bộ và đôi Guốc mộc giản dị, mộc mạc.",
    goiYKhiSai: "Hãy xem xét kỹ: Áo bà ba, Khăn rằn và Guốc mộc có phải là bộ ba kinh điển của miền Tây Nam Bộ không?",
  },
  {
    id: "t8",
    tenCa: "Ca 08: Nét duyên Yếm đào",
    capDo: "Trung bình",
    diemThuong: 20,
    boPhoi: {
      trangPhucId: "yem_dao",
      mauSacId: "do_dieu",
      phuKienIds: ["khan_ran"],
      hoaTietId: "hoa_sen",
    },
    mauHex: "#9E2A2B",
    gioi: "nu",
    toc: "bui_cao",
    tenHoaTiet: "Lụa dệt Hoa sen",
    vungDung: "accessories",
    loiSai: "Choàng Khăn rằn Nam Bộ cùng Áo yếm cổ truyền Bắc Bộ",
    lyDo: "Áo yếm đào truyền thống thường đi cùng dây lưng lụa (bao thắt lưng), kiềng bạc và tóc vấn trần hoặc khăn mỏ quạ Bắc Bộ, không quấn khăn rằn Krama vùng Nam Bộ.",
    goiYKhiSai: "Chiếc yếm đỏ và họa tiết sen rất hợp nhau, nhưng phụ kiện quấn quanh cổ/ngực có đúng vùng văn hóa Bắc Bộ không?",
  },
  {
    id: "t9",
    tenCa: "Ca 09: Phượng bào Hoàng cung",
    capDo: "Khó",
    diemThuong: 25,
    boPhoi: {
      trangPhucId: "ao_nhat_binh",
      mauSacId: "vang_hoang",
      phuKienIds: ["khan_pieu", "kieng_bac"],
      hoaTietId: "phuong_hoang",
    },
    mauHex: "#D4AF37",
    gioi: "nu",
    toc: "bui_cao",
    tenHoaTiet: "Loan Phượng & Thủy ba cung đình",
    vungDung: "headwear",
    loiSai: "Đội Khăn Piêu dân tộc Thái khi mặc Áo Nhật Bình cung đình Huế",
    lyDo: "Áo Nhật Bình là lễ phục mệnh phụ và công chúa triều Nguyễn tại kinh thành Phú Xuân (Huế), phải kết hợp cùng Khăn vành (khăn đóng) hoặc Mũ Cửu Phượng thay vì Khăn Piêu vùng Tây Bắc.",
    goiYKhiSai: "Áo Nhật Bình sắc vàng hoàng gia thêu Phượng hoàng rất chuẩn cung đình Huế, nhưng chiếc khăn đội đầu lại thuộc vùng núi phía Bắc!",
  },
  {
    id: "t10",
    tenCa: "Ca 10: Váy xòe bản Mông",
    capDo: "Khó",
    diemThuong: 25,
    boPhoi: {
      trangPhucId: "mong_lanh",
      mauSacId: "cham_indig",
      phuKienIds: ["vong_co_bac"],
      hoaTietId: "rong_trieu_nguyen",
    },
    mauHex: "#1F2A44",
    gioi: "nu",
    toc: "bui_thap",
    tenHoaTiet: "Đồ án Rồng năm móng triều Nguyễn",
    vungDung: "pattern",
    loiSai: "In họa tiết Rồng năm móng triều Nguyễn lên Váy lanh xếp ly của người H'Mông",
    lyDo: "Váy H'Mông nổi tiếng với nghệ thuật vẽ sáp ong trên vải lanh nhuộm chàm và thêu chữ thập hình xoắn ốc, hình học núi rừng — không sử dụng đồ án Rồng cung đình.",
    goiYKhiSai: "Kiểu dáng váy xếp ly và vòng cổ bạc đã đúng chuẩn người H'Mông, nhưng hãy nhìn kỹ đồ án hoa văn trang trí trong hồ sơ!",
  },
  {
    id: "t11",
    tenCa: "Ca 11: Vũ điệu Chùa Tháp",
    capDo: "Trung bình",
    diemThuong: 20,
    boPhoi: {
      trangPhucId: "sampot",
      mauSacId: "vang_hoang",
      phuKienIds: ["kieng_bac"],
      hoaTietId: "hoa_van_khmer",
    },
    mauHex: "#D4AF37",
    gioi: "nu",
    toc: "bui_cao",
    tenHoaTiet: "Hoa văn Angkor & Cánh sen vàng",
    vungDung: "all_good",
    loiSai: null,
    lyDo: "Bộ lễ phục truyền thống Khmer Nam Bộ chuẩn xác với sắc vàng ánh kim rực rỡ, dải Sbay vắt chéo vai mềm mại, trang sức chạm khắc và hoa văn chùa tháp.",
    goiYKhiSai: "Bộ lễ phục Khmer sắc vàng ánh kim với dải Sbay chéo vai và hoa văn Khmer này có thật sự có lỗi sai nào không?",
  },
  {
    id: "t12",
    tenCa: "Ca 12: Âm vang Cồng chiêng",
    capDo: "Khó",
    diemThuong: 25,
    boPhoi: {
      trangPhucId: "ede_tho_cam",
      mauSacId: "den_huyen",
      phuKienIds: ["non_quai_thao"],
      hoaTietId: "tho_cam_tay_nguyen",
    },
    mauHex: "#1C1C1E",
    gioi: "nu",
    toc: "dai_xoa",
    tenHoaTiet: "Dải thổ cẩm kỷ hà Tây Nguyên",
    vungDung: "headwear",
    loiSai: "Đội Nón quai thao Bắc Bộ cùng trang phục thổ cẩm Ê Đê Tây Nguyên",
    lyDo: "Trang phục Ê Đê nền chàm đen điểm dải thổ cẩm đỏ-vàng đặc trưng của đại ngàn Tây Nguyên không kết hợp với Nón quai thao vùng Kinh Bắc.",
    goiYKhiSai: "Sắc chàm đen và thổ cẩm Tây Nguyên rất chuẩn người Ê Đê, nhưng chiếc nón rộng vành trên đầu lại đến từ vùng đồng bằng Bắc Bộ!",
  },
];

export const cauHoiQuizThamTu: CauHoiQuizThamTu[] = [
  {
    id: "q1",
    chuDe: "Cổ phục Triều Nguyễn",
    capDo: "Dễ",
    diem: 15,
    cauHoi: "Vì sao trang phục truyền thống của người Việt từ thời chúa Nguyễn Phúc Khoát đến triều Nguyễn lại có tên gọi là 'Áo Ngũ Thân'?",
    luaChon: [
      "Vì áo bắt buộc phải phối đủ 5 màu sắc ngũ hành trên cùng một tấm vải",
      "Vì áo được may từ 5 vạt vải ghép lại (tượng trưng cho Tứ thân phụ mẫu và bản thân người mặc)",
      "Vì chỉ những vị quan từ hàm Ngũ phẩm trở lên mới được phép mặc",
      "Vì áo có 5 lớp lót bằng lụa tơ tằm chồng lên nhau để giữ ấm",
    ],
    dapAnDung: 1,
    giaiThich: "Áo Ngũ Thân gồm 4 thân áo ngoài (2 thân trước, 2 thân sau tượng trưng cho cha mẹ ruột và cha mẹ chồng/vợ) cùng 1 thân con ẩn bên trong vạt trước bên phải (tượng trưng cho chính người mặc), cài 5 hạt cúc biểu trưng cho Ngũ thường (Nhân – Lễ – Nghĩa – Trí – Tín).",
    trangPhucMinhHoa: {
      trangPhucId: "ngu_than",
      mauHex: "#205081",
      phuKienIds: ["khan_dong"],
      gioi: "nam",
    },
  },
  {
    id: "q2",
    chuDe: "Cổ phục Triều Nguyễn",
    capDo: "Dễ",
    diem: 15,
    cauHoi: "Tên gọi 'Áo Nhật Bình' của hoàng hậu, công chúa và mệnh phụ triều Nguyễn bắt nguồn từ đặc điểm cấu trúc nào trên áo?",
    luaChon: [
      "Áo chỉ được phép mặc vào buổi bình minh khi mặt trời mọc",
      "Tay áo có thêu hình mặt trời đỏ rực nằm giữa mặt biển bình yên",
      "Khi cài khuy lại, phần cổ áo hình chữ nhật to bản trước ngực tạo thành hình chữ 'Nhật' (日)",
      "Vạt áo sau lưng xẻ làm đôi tạo dáng hình chữ nhật đứng",
    ],
    dapAnDung: 2,
    giaiThich: "Áo Nhật Bình (cổ Phi Phong thời Minh biến đổi sang quy chế triều Nguyễn) có phần cổ áo to bản đối khâm; khi buộc dây hai vạt trước ngực lại sẽ ghép thành một hình chữ nhật ngang ngay ngắn trước ngực, gọi là 'Nhật Bình'.",
    trangPhucMinhHoa: {
      trangPhucId: "ao_nhat_binh",
      mauHex: "#D4AF37",
      phuKienIds: ["khan_dong", "kieng_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q3",
    chuDe: "Cổ phục Triều Nguyễn",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Điểm khác biệt dễ nhận biết nhất giữa 'Áo Tấc' (Áo Ngũ thân tay thụng) và 'Áo Ngũ thân tay chẽn' là gì?",
    luaChon: [
      "Áo Tấc không có cổ đứng, còn Áo Ngũ thân tay chẽn có cổ đứng",
      "Áo Tấc chỉ dành riêng cho nữ giới, còn Áo tay chẽn chỉ dành riêng cho nam giới",
      "Áo Tấc cài khuy bên trái, còn Áo tay chẽn cài khuy bên phải",
      "Áo Tấc có ống tay dài và rộng thụng, khi chắp tay tạo vẻ uy nghiêm trong đại lễ; còn tay chẽn ôm gọn cổ tay để tiện sinh hoạt",
    ],
    dapAnDung: 3,
    giaiThich: "Áo Tấc (còn gọi là áo lễ, áo thụng) có phần tay áo rộng thụng dài quá bàn tay và viền tà rộng khoảng 1 tấc (nên gọi là Áo Tấc), dùng trong dịp lễ tết, cưới hỏi, tế lễ cho cả nam lẫn nữ.",
    trangPhucMinhHoa: {
      trangPhucId: "ao_tac",
      mauHex: "#205081",
      phuKienIds: ["khan_dong"],
      gioi: "nam",
    },
  },
  {
    id: "q4",
    chuDe: "Việt phục Ba Miền",
    capDo: "Dễ",
    diem: 15,
    cauHoi: "Trong bộ trang phục truyền thống của liền chị Quan họ Kinh Bắc (Bắc Ninh), chiếc Áo tứ thân thường được kết hợp với những phụ kiện biểu tượng nào?",
    luaChon: [
      "Yếm đào bên trong, thắt lưng lụa (bao), khăn mỏ quạ và Nón quai thao",
      "Khăn rằn Krama, guốc mộc mũi cong và chuỗi hạt mã não",
      "Khăn Piêu thêu cút piêu và hàng cúc bạc mắc pém",
      "Dải lụa Sbay vắt chéo vai và mũ chóp nhọn ánh kim",
    ],
    dapAnDung: 0,
    giaiThich: "Hình ảnh liền chị Quan họ Kinh Bắc kinh điển gồm áo tứ thân mớ ba mớ bảy khoác ngoài yếm đào thắm, thắt lưng lụa xanh/hồng, vấn khăn mỏ quạ và tay nâng chiếc nón thúng quai thao.",
    trangPhucMinhHoa: {
      trangPhucId: "tu_than",
      mauHex: "#7B4B3A",
      phuKienIds: ["non_quai_thao"],
      gioi: "nu",
    },
  },
  {
    id: "q5",
    chuDe: "Việt phục Ba Miền",
    capDo: "Dễ",
    diem: 15,
    cauHoi: "Chiếc 'Áo Bà Ba' gắn liền với đời sống miền Tây Nam Bộ có đặc trưng phom dáng truyền thống như thế nào?",
    luaChon: [
      "Áo có cổ cao 5 phân và hai vạt dài chấm gót chân như áo dài",
      "Áo không cổ, thân sau may bằng một mảnh vải nguyên, thân trước gồm hai mảnh cài hàng cúc giữa và xẻ tà hai bên hông",
      "Áo chui đầu có phần cổ khoét chữ V sâu đính tua rua hạt cườm",
      "Áo khoác đối khâm tay rộng thụng thêu hoa văn sóng nước",
    ],
    dapAnDung: 1,
    giaiThich: "Áo bà ba truyền thống không có cổ đứng, cài hàng khuy thẳng từ cổ xuống bụng và xẻ tà vừa phải ở hai bên hông, giúp người dân vùng sông nước Nam Bộ cử động thoáng mát, linh hoạt.",
    trangPhucMinhHoa: {
      trangPhucId: "ba_ba",
      mauHex: "#2E6F5E",
      phuKienIds: ["khan_ran"],
      gioi: "nu",
    },
  },
  {
    id: "q6",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Trên chiếc 'Áo Cỏm' của phụ nữ dân tộc Thái vùng Tây Bắc, hai hàng khuy bạc chạm khắc tinh xảo đính dọc ngực áo được gọi là gì và mang ý nghĩa gì?",
    luaChon: [
      "Gọi là 'Nút đồng tiền', tượng trưng cho 12 tháng mùa màng bội thu trong năm",
      "Gọi là 'Khuy mặt trời', chỉ được đính số lẻ để trừ tà ma rừng thiêng",
      "Gọi là 'Mắc pém' (cúc bướm), gồm hàng khuy đực và khuy cái tượng trưng cho sự gắn kết âm dương, tình yêu đôi lứa bền chặt",
      "Gọi là 'Cúc hoa ban', làm bằng ngà voi hoặc sừng trâu rừng",
    ],
    dapAnDung: 2,
    giaiThich: "Hàng cúc bướm bạc ('Mắc pém') trên áo cỏm Thái có một bên là hàng cúc đực và một bên là hàng cúc cái cài khít vào nhau trước ngực, biểu trưng cho sự hòa hợp âm dương và sự trường tồn của nòi giống.",
    trangPhucMinhHoa: {
      trangPhucId: "co_thai",
      mauHex: "#F4EFE6",
      phuKienIds: ["khan_pieu", "vong_co_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q7",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Kỹ thuật thủ công độc đáo nào được phụ nữ H'Mông sử dụng để tạo nên các hoa văn trắng – xanh chàm tinh xảo trên nền vải lanh của chiếc váy xòe xếp ly?",
    luaChon: [
      "Dùng khuôn gỗ khắc sẵn chấm mực trắng in đè lên vải đã nhuộm đen",
      "Dùng lá rừng giã nát đắp lên vải rồi phơi sương suốt 49 ngày",
      "Dệt sợi bạc nguyên chất xen lẫn với sợi tơ tằm vàng óng",
      "Dùng bút đồng chấm sáp ong nóng chảy vẽ trực tiếp lên vải lanh, sau đó đem nhuộm chàm rồi luộc sôi để sáp bong ra hiện hoa văn",
    ],
    dapAnDung: 3,
    giaiThich: "Nghệ thuật vẽ sáp ong trên vải lanh của người H'Mông là Di sản văn hóa phi vật thể quốc gia: phần vải có sáp ong phủ lên sẽ không thấm thuốc nhuộm chàm, khi nhúng nước sôi sáp tan đi để lộ đường nét hoa văn sắc sảo.",
    trangPhucMinhHoa: {
      trangPhucId: "mong_lanh",
      mauHex: "#1F2A44",
      phuKienIds: ["vong_co_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q8",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Dễ",
    diem: 15,
    cauHoi: "Trang phục truyền thống của đồng bào Ê Đê vùng Tây Nguyên nổi bật với gam màu chủ đạo nào và ý nghĩa của chúng là gì?",
    luaChon: [
      "Nền đen/chàm sẫm điểm dải hoa văn đỏ, vàng và trắng — tượng trưng cho đất đai bazan, ngọn lửa đam mê và ánh nắng đại ngàn",
      "Toàn bộ màu trắng tinh khôi điểm hoa văn xanh ngọc bích của biển cả",
      "Sắc tím hoàng hôn phối cùng kim tuyến bạc lấp lánh",
      "Màu xanh lá mạ non kết hợp với họa tiết hoa sen hồng",
    ],
    dapAnDung: 0,
    giaiThich: "Thổ cẩm Ê Đê và các dân tộc Tây Nguyên chuộng nền chàm đen huyền bí của đất rừng đại ngàn, làm nổi bật các dải hoa văn kỷ hà màu đỏ (lửa, sức sống) và vàng (ánh mặt trời).",
    trangPhucMinhHoa: {
      trangPhucId: "ede_tho_cam",
      mauHex: "#1C1C1E",
      phuKienIds: ["tui_tho_cam"],
      gioi: "nu",
    },
  },
  {
    id: "q9",
    chuDe: "Chất liệu & Làng nghề",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Loại vải 'Lãnh Mỹ A' trứ danh vùng Tân Châu (An Giang) có màu đen huyền óng ả tự nhiên là nhờ được nhuộm hàng trăm lần từ loại quả nào?",
    luaChon: [
      "Lá cây Chàm rừng",
      "Quả Mặc Nưa",
      "Vỏ cây Đước ngập mặn",
      "Hạt cây Dành Dành và bùn non",
    ],
    dapAnDung: 1,
    giaiThich: "Lãnh Mỹ A được dệt từ tơ tằm thượng hạng và nhuộm thủ công hàng trăm lần bằng nhựa trái Mặc Nưa, tạo nên bề mặt vải đen bóng như gương, mặc mùa hè thì mát, mùa đông thì ấm.",
    trangPhucMinhHoa: {
      trangPhucId: "ba_ba",
      mauHex: "#1C1C1E",
      phuKienIds: ["khan_ran", "kieng_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q10",
    chuDe: "Chất liệu & Làng nghề",
    capDo: "Dễ",
    diem: 15,
    cauHoi: "Điểm độc đáo làm nên tên tuổi của chiếc 'Nón bài thơ' xứ Huế so với các loại nón lá thông thường là gì?",
    luaChon: [
      "Trên đỉnh chóp nón có gắn một chiếc chuông bạc phát ra tiếng nhạc khi gió thổi",
      "Nón được đan hoàn toàn bằng sợi tơ tằm thay vì lá cọ hay lá buông",
      "Giữa hai lớp lá nón mỏng thanh thoát có ép những câu thơ lục bát và hình ảnh danh thắng xứ Huế, chỉ hiện rõ khi soi dưới ánh nắng",
      "Vành nón được sơn mài cẩn xà cừ 16 vòng tròn đồng tâm",
    ],
    dapAnDung: 2,
    giaiThich: "Nghệ nhân làng nón Huế khéo léo cài những vần thơ và hình bóng cầu Trường Tiền, chùa Thiên Mụ bằng giấy cắt mỏng vào giữa hai lớp lá nón trắng ngà, khi nghiêng nón dưới nắng sẽ hiện lên đầy thi vị.",
    trangPhucMinhHoa: {
      trangPhucId: "aodai",
      mauHex: "#9E2A2B",
      phuKienIds: ["non_la"],
      gioi: "nu",
    },
  },
  {
    id: "q11",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Trong lễ phục truyền thống của phụ nữ Khmer Nam Bộ (đặc biệt trong lễ cưới hoặc múa Rom Vong), dải lụa thêu kim tuyến quấn chéo qua một bên vai có tên gọi là gì?",
    luaChon: [
      "Khăn Mat'ra",
      "Khăn Piêu",
      "Khăn Đóng",
      "Khăn Sbay (Sabai)",
    ],
    dapAnDung: 3,
    giaiThich: "Dải lụa Sbay (Sabai) dệt kim tuyến hoặc đính cườm lấp lánh vắt chéo qua vai trái, buông dài mềm mại sau lưng là điểm nhấn quý phái không thể thiếu của trang phục lễ hội Khmer.",
    trangPhucMinhHoa: {
      trangPhucId: "sampot",
      mauHex: "#D4AF37",
      phuKienIds: ["kieng_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q12",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Khó",
    diem: 25,
    cauHoi: "Áo dài truyền thống của phụ nữ Chăm (Aw Kamei) có đặc điểm cấu trúc rất riêng biệt nào so với Áo dài của người Kinh?",
    luaChon: [
      "Áo may liền thân chui đầu, không xẻ tà hai bên hông, thường đi cùng dây đai dệt thổ cẩm thắt ngang eo và chéo qua ngực (Tali)",
      "Áo xẻ tà cao đến ngang ngực và cài 15 chiếc cúc ngọc trai bên sườn trái",
      "Áo không có ống tay và phần vạt sau dài gấp ba lần vạt trước",
      "Áo luôn nhuộm màu đen tuyền bằng củ nâu và bùn ao",
    ],
    dapAnDung: 0,
    giaiThich: "Áo dài Chăm (Aw Kamei) có phom dáng kín đáo, may kín sườn không xẻ tà, mặc kiểu chui đầu và điểm nhấn là dải băng dệt thổ cẩm (Tali) quấn chéo ngực và ngang lưng vô cùng duyên dáng.",
    trangPhucMinhHoa: {
      trangPhucId: "champa_tho_cam",
      mauHex: "#F4EFE6",
      phuKienIds: ["kieng_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q13",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Trang phục truyền thống của phụ nữ dân tộc Tày vùng Đông Bắc nổi tiếng với vẻ đẹp giản dị, thanh tao từ chất liệu và sắc màu nào?",
    luaChon: [
      "Áo dệt toàn bộ bằng chỉ vàng rực rỡ và đính lông công trên mũ",
      "Áo năm thân nhuộm chàm xanh sẫm mộc mạc, hầu như không thêu hoa văn sặc sỡ mà tôn lên vẻ sáng lấp lánh của vòng cổ bạc và xà tích bạc",
      "Váy ngắn xếp ly 7 màu cầu vồng thêu kín hạt cườm nhựa",
      "Áo khoác da thú kết hợp với khăn voan trắng mỏng",
    ],
    dapAnDung: 1,
    giaiThich: "Sắc áo chàm Tày đằm thắm, bình dị và tinh khiết, lấy chính sự tối giản của nền vải chàm tự nhiên để làm nổi bật bộ vòng kiềng bạc và dây xà tích bên hông.",
    trangPhucMinhHoa: {
      trangPhucId: "tay_cham",
      mauHex: "#1F2A44",
      phuKienIds: ["khan_cham", "vong_co_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q14",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Khó",
    diem: 25,
    cauHoi: "Họa tiết quan trọng bậc nhất thường được phụ nữ Mường dệt vô cùng kỳ công ở phần 'cạp váy' (đầu váy) gồm những đồ án nào?",
    luaChon: [
      "Hình tàu thuyền buồm vượt sóng biển khơi và cá heo",
      "Chỉ dệt chữ Hán cổ viết bằng chỉ bạc trên nền lụa đỏ",
      "Rồng (rồng cuốn, rồng bay), hươu sao, chim công, hoa hồi và các hình kỷ hà phản ánh vũ trụ quan Mường",
      "Hoàn toàn để trơn không có bất kỳ hoa văn nào",
    ],
    dapAnDung: 2,
    giaiThich: "Cạp váy Mường được ví như một bức tranh thổ cẩm sống động nhất của người phụ nữ Mường, gồm 3 phần (rang trên, rang giữa, rang dưới) dệt hình rồng, hươu, chim muông và cây cỏ.",
    trangPhucMinhHoa: {
      trangPhucId: "muong_vay",
      mauHex: "#F4EFE6",
      phuKienIds: ["vong_co_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q15",
    chuDe: "Cổ phục Triều Nguyễn",
    capDo: "Khó",
    diem: 25,
    cauHoi: "Trên dải viền cổ và tay áo Nhật Bình cũng như lễ phục cung đình triều Nguyễn, đồ án những dải màu xanh – đỏ – vàng – trắng đan xen ở chân sóng nước được gọi là gì?",
    luaChon: [
      "Vân kiên (bờ vai mây ngũ sắc)",
      "Bát bửu liên hoa (tám bảo vật nhà Phật)",
      "Kỷ hà lưỡng nghi",
      "Thủy ba (sóng nước) và Thủy đạo (sọc ngũ sắc biểu trưng cho phúc lộc trường cửu)",
    ],
    dapAnDung: 3,
    giaiThich: "Họa tiết Thủy ba (sóng vỗ đá ngầm) kết hợp cùng các dải sọc ngũ sắc ở gấu tay áo Nhật Bình vừa phân định thứ bậc người mặc trong hoàng thất, vừa mang ý nghĩa phúc thọ dồi dào như biển lớn.",
    trangPhucMinhHoa: {
      trangPhucId: "ao_nhat_binh",
      mauHex: "#9E2A2B",
      phuKienIds: ["khan_dong"],
      gioi: "nu",
    },
  },
  {
    id: "q16",
    chuDe: "Việt phục Ba Miền",
    capDo: "Dễ",
    diem: 15,
    cauHoi: "Chiếc 'Áo Yếm' truyền thống của phụ nữ Việt có cấu tạo dây buộc như thế nào?",
    luaChon: [
      "Mảnh vải hình vuông hoặc thoi đặt chéo trước ngực, góc trên khoét cổ và có đôi dây buộc sau gáy cùng đôi dây buộc vòng ra sau lưng",
      "May liền ống tròn từ vai xuống hông và kéo khóa sắt ở sau lưng",
      "Gồm hai vạt vải dài quấn từ chân lên vai rồi cài trâm ngọc",
      "Chỉ giữ trên người bằng khung nan tre uốn cong bên trong",
    ],
    dapAnDung: 0,
    giaiThich: "Yếm đào có cấu trúc tối giản mà tinh tế, tôn lên bờ vai và tấm lưng ong của người phụ nữ Việt xưa, thường mặc bên trong áo tứ thân, ngũ thân hoặc mặc khi lao động ngày hè.",
    trangPhucMinhHoa: {
      trangPhucId: "yem_dao",
      mauHex: "#9E2A2B",
      phuKienIds: ["kieng_bac"],
      gioi: "nu",
    },
  },
  {
    id: "q17",
    chuDe: "Chất liệu & Làng nghề",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Làng lụa Vạn Phúc (Hà Đông, Hà Nội) nổi tiếng hơn một thiên niên kỷ qua với dòng vải truyền thống đặc sắc nào có hoa văn chìm nổi vừa bóng vừa xốp?",
    luaChon: [
      "Vải lanh vẽ sáp ong nhuộm chàm",
      "Lụa Vân (vải dệt hoa nổi bóng trên nền vân chìm mỏng thoáng)",
      "Vải thổ cẩm dệt từ sợi vỏ cây rừng",
      "Vải bố thô nhuộm nhựa cây đước",
    ],
    dapAnDung: 1,
    giaiThich: "Lụa Vân Vạn Phúc đòi hỏi kỹ thuật điều khiển khung cửi bậc thầy của nghệ nhân Hà Đông: hoa văn nổi thì bóng mượt, phần nền chìm thì thoáng nhẹ, giúp người mặc mát mẻ quanh năm.",
    trangPhucMinhHoa: {
      trangPhucId: "ngu_than",
      mauHex: "#D4AF37",
      phuKienIds: ["khan_dong", "quat_giay"],
      gioi: "nu",
    },
  },
  {
    id: "q18",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Theo phong tục truyền thống của người Thái Tây Bắc, trước khi về nhà chồng, cô gái Thái thường tự tay dệt và thêu vật phẩm nào để làm quà tặng nhà chồng và minh chứng cho sự khéo léo?",
    luaChon: [
      "Một bộ cồng chiêng đồng gồm 6 chiếc",
      "Chiếc nón thúng quai thao đường kính 80cm",
      "Những chiếc Khăn Piêu thêu hoa văn 'cút piêu' đầy màu sắc",
      "Đôi hài thêu chim phượng hoàng bằng chỉ vàng",
    ],
    dapAnDung: 2,
    giaiThich: "Khăn Piêu không chỉ giữ ấm và che nắng mà còn là thước đo sự đảm đang, tài hoa và tấm lòng của người con gái Thái qua từng đường kim mũi chỉ thêu hoa văn ở hai đầu khăn.",
    trangPhucMinhHoa: {
      trangPhucId: "co_thai",
      mauHex: "#F4EFE6",
      phuKienIds: ["khan_pieu"],
      gioi: "nu",
    },
  },
  {
    id: "q19",
    chuDe: "Cổ phục Triều Nguyễn",
    capDo: "Trung bình",
    diem: 20,
    cauHoi: "Quy tắc vấn 'Khăn Đóng' (Khăn Xếp) truyền thống của người Việt xưa thường chú trọng điều gì ở các nếp quấn phía trước trán?",
    luaChon: [
      "Phải quấn lệch hẳn sang bên tai trái để che kín một bên mắt",
      "Buộc thắt nút thành hai sừng nhọn dựng đứng trên đỉnh đầu",
      "Luôn để xõa hai dải vải dài che kín khuôn mặt",
      "Hai nếp khăn đầu tiên giao nhau ngay chính giữa sống mũi tạo thành hình chữ 'Nhân' (人) hoặc chữ 'Nhất' (一) ngay ngắn, chỉnh tề",
    ],
    dapAnDung: 3,
    giaiThich: "Cách vấn khăn chữ Nhân (人) tượng trưng cho đạo làm người chân chính, đoan trang, đặt vừa vặn trên trán để giữ phong thái đĩnh đạc khi mặc Áo Ngũ thân hay Áo Tấc.",
    trangPhucMinhHoa: {
      trangPhucId: "ao_tac",
      mauHex: "#205081",
      phuKienIds: ["khan_dong"],
      gioi: "nam",
    },
  },
  {
    id: "q20",
    chuDe: "Sắc phục Dân tộc",
    capDo: "Khó",
    diem: 25,
    cauHoi: "Trên bộ trang phục truyền thống của người Dao Đỏ, hình thêu 'Dấu ấn Bàn Vương' và 'Cây thông / Hoa văn chữ Vạn' mang ý nghĩa sâu sắc gì?",
    luaChon: [
      "Là ký hiệu phân biệt số lượng ruộng bậc thang mà gia đình sở hữu",
      "Nhắc nhớ cội nguồn tổ tiên, ước vọng bình an, sinh sôi nảy nở và sự gắn kết hài hòa giữa con người với thiên nhiên vũ trụ",
      "Chỉ dùng để trang trí ngẫu hứng theo sở thích mà không có quy ước truyền thống",
      "Là bản đồ chỉ đường ra biển Đông của các thương thuyền",
    ],
    dapAnDung: 1,
    giaiThich: "Mỗi họa tiết thêu đỏ – trắng – vàng trên nền áo chàm của người Dao Đỏ đều là một trang sử thi bằng chỉ thêu, lưu giữ ký ức về nguồn cội Bàn Vương và ước vọng ấm no nơi rẻo cao.",
    trangPhucMinhHoa: {
      trangPhucId: "dao_do",
      mauHex: "#1F2A44",
      phuKienIds: ["vong_co_bac"],
      gioi: "nu",
    },
  },
];

/**
 * Trộn ngẫu nhiên danh sách câu hỏi VÀ vị trí 4 đáp án A, B, C, D của từng câu hỏi
 */
export function tronCauHoiVaDapAn(
  danhSachGoc: CauHoiQuizThamTu[],
  soLuongToiDa?: number
): CauHoiQuizThamTu[] {
  const banSao = [...danhSachGoc];
  // Fisher-Yates shuffle cho thứ tự câu hỏi
  for (let i = banSao.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = banSao[i];
    banSao[i] = banSao[j];
    banSao[j] = temp;
  }

  const danhSachGioiHan =
    typeof soLuongToiDa === "number" ? banSao.slice(0, soLuongToiDa) : banSao;

  // Trộn ngẫu nhiên 4 phương án trả lời của từng câu hỏi
  return danhSachGioiHan.map((q) => {
    const indices = [0, 1, 2, 3];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
    }

    const luaChonMoi: [string, string, string, string] = [
      q.luaChon[indices[0]],
      q.luaChon[indices[1]],
      q.luaChon[indices[2]],
      q.luaChon[indices[3]],
    ];
    const dapAnDungMoi = indices.indexOf(q.dapAnDung) as 0 | 1 | 2 | 3;

    return {
      ...q,
      luaChon: luaChonMoi,
      dapAnDung: dapAnDungMoi,
    };
  });
}

