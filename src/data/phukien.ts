/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhuKien } from "../types";

export const phuKien: PhuKien[] = [
  {
    id: "non_la",
    ten: "Nón lá Huế (nón bài thơ)",
    loai: "non",
    nhomIds: ["kh"],
    suThat: ["Nón bài thơ có lồng hình hoặc chữ giữa hai lớp lá."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "khan_dong",
    ten: "Khăn đóng",
    loai: "khan",
    nhomIds: ["kh"],
    suThat: ["Khăn đội đầu truyền thống của nam giới, thường gặp ở Huế và miền Trung."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "khan_mo_qua",
    ten: "Khăn mỏ quạ",
    loai: "khan",
    nhomIds: ["kb"],
    suThat: ["Thường đi cùng áo tứ thân."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "non_quai_thao",
    ten: "Nón quai thao",
    loai: "non",
    nhomIds: ["kb"],
    suThat: ["Thường đi cùng áo tứ thân."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "khan_ran",
    ten: "Khăn rằn",
    loai: "khan",
    nhomIds: ["kn"],
    suThat: ["Khăn kẻ ô, phổ biến ở Nam Bộ."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "khan_pieu",
    ten: "Khăn piêu",
    loai: "khan",
    nhomIds: ["thai"],
    suThat: ["Khăn thêu hoa văn của phụ nữ Thái, thường xuất hiện trong lễ hội và múa xòe."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "vong_bac",
    ten: "Vòng bạc",
    loai: "trang_suc",
    nhomIds: ["mong", "thai", "tay", "dao"],
    suThat: ["Trang sức bạc chạm khắc thủ công phổ biến ở nhiều dân tộc vùng cao."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "kieng_bac",
    ten: "Kiềng bạc chạm khắc",
    loai: "trang_suc",
    nhomIds: ["kb", "kh", "kn", "tay", "muong"],
    suThat: ["Kiềng bạc đeo cổ tôn vẻ đoan trang khi diện áo dài, áo ngũ thân và áo tứ thân."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "vong_co_bac",
    ten: "Vòng cổ bạc dân tộc",
    loai: "trang_suc",
    nhomIds: ["mong", "dao", "tay", "nung", "thai", "ede", "bahnar"],
    suThat: ["Vòng bạc đặc hoặc chạm rỗng của đồng bào vùng cao, vừa làm đẹp vừa tránh gió."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "tram_cai",
    ten: "Trâm cài",
    loai: "trang_suc",
    nhomIds: ["kb", "kh"],
    suThat: ["Trâm cài búi tóc tôn nét thanh tao của trang phục truyền thống và cung đình."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "quat_giay",
    ten: "Quạt giấy thủ công",
    loai: "trang_suc",
    nhomIds: ["kb", "kh"],
    suThat: ["Quạt giấy Chàng Sơn hoặc quạt nan tre cầm tay thường đi cùng áo tấc, áo ngũ thân."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "tui_tho_cam",
    ten: "Túi thổ cẩm dệt tay",
    loai: "trang_suc",
    nhomIds: ["thai", "mong", "dao", "tay", "ede", "bahnar", "cotu"],
    suThat: ["Túi đeo chéo dệt hoa văn kỷ hà đặc trưng của các dân tộc Tây Bắc và Tây Nguyên."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "khan_cham",
    ten: "Khăn thổ cẩm Chăm",
    loai: "khan",
    nhomIds: ["cham"],
    suThat: ["Dải khăn dệt hoa văn Chăm vắt vai hoặc quấn đầu truyền thống."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "guoc_go",
    ten: "Guốc mộc truyền thống",
    loai: "hien_dai",
    nhomIds: ["kb", "kh", "kn"],
    suThat: ["Guốc mộc quai nhung hoặc quai mây tôn dáng thướt tha cùng áo dài, áo tứ thân."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "tote",
    ten: "Túi tote",
    loai: "hien_dai",
    nhomIds: [],
    suThat: [],
    mucRemix: "tu_do",
    daKiemChung: false
  },
  {
    id: "sneaker",
    ten: "Giày sneaker",
    loai: "hien_dai",
    nhomIds: [],
    suThat: [],
    mucRemix: "tu_do",
    daKiemChung: false
  }
];
