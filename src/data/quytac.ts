/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LuatMau, LuatRemix } from "../types";

export const luatMau: LuatMau[] = [
  { a: "m_do", b: "m_vang", ketQua: "hai_hoa", lyDo: "Cặp sắc đỏ – vàng cát tường cho dịp Tết và lễ cưới." },
  { a: "m_do", b: "m_trang", ketQua: "hai_hoa", lyDo: "Đỏ nổi bật thanh lịch trên nền trắng ngà." },
  { a: "m_vang", b: "m_cham", ketQua: "hai_hoa", lyDo: "Vàng ấm tôn sắc trên nền chàm trầm." },
  { a: "m_cham", b: "m_trang", ketQua: "hai_hoa", lyDo: "Chàm và trắng ngà giản dị, thanh nhã." },
  { a: "m_reu", b: "m_nau", ketQua: "hai_hoa", lyDo: "Hai gam mộc của đất và cây cỏ." },
  { a: "m_hongsen", b: "m_trang", ketQua: "hai_hoa", lyDo: "Hồng sen và trắng ngà dịu mắt." },
  { a: "m_do", b: "m_reu", ketQua: "can_can_bang", lyDo: "Đỏ và xanh rêu tương phản mạnh; nên chọn một màu làm chủ đạo." },
  { a: "m_do", b: "m_hongsen", ketQua: "can_can_bang", lyDo: "Đỏ và hồng gần tông; nên đệm thêm sắc trắng ngà." },
  { a: "m_vang", b: "m_hongsen", ketQua: "can_can_bang", lyDo: "Hai màu sáng cùng nổi; nên phối thêm màu trầm." },
  { a: "*", b: "*", ketQua: "hai_hoa", lyDo: "Tổng thể màu sắc hài hòa." }
];

export const luatRemix: LuatRemix[] = [
  {
    id: "r1",
    khi: { trangPhuc: ["aodai"], phuKienBatKy: ["sneaker", "tote"] },
    nhan: "sang_tao",
    lyDo: "Phối phụ kiện hiện đại năng động cho kỷ yếu, dạo phố."
  },
  {
    id: "r2",
    khi: { trangPhuc: ["aodai"], phuKienBatKy: ["non_la"] },
    nhan: "chuan",
    lyDo: "Áo dài và nón lá chuẩn mực truyền thống."
  },
  {
    id: "r3",
    khi: { trangPhuc: ["tu_than"], phuKienBatKy: ["khan_mo_qua", "non_quai_thao"] },
    nhan: "chuan",
    lyDo: "Chuẩn lối phục sức nữ giới Bắc Bộ xưa."
  },
  {
    id: "r4",
    khi: { trangPhuc: ["tu_than"], phuKienBatKy: ["khan_dong"] },
    nhan: "can_xem_lai",
    lyDo: "Khăn đóng lệch bối cảnh khi đi cùng áo tứ thân Bắc Bộ.",
    goiYThayThe: "Nên thay bằng khăn mỏ quạ hoặc nón quai thao."
  },
  {
    id: "r5",
    khi: { trangPhuc: ["aodai"], phuKienBatKy: ["khan_pieu"] },
    nhan: "sang_tao",
    lyDo: "Giao thoa cảm hứng khăn Piêu Thái; nên ghi rõ nguồn văn hóa."
  },
  {
    id: "r6",
    khi: { trangPhuc: ["co_thai"], hoaVanThem: "mong" },
    nhan: "can_xem_lai",
    lyDo: "Không nên trộn lẫn hoa văn đặc trưng của hai dân tộc khác nhau.",
    goiYThayThe: "Giữ nguyên áo cỏm Thái phối cùng khăn Piêu truyền thống."
  },
  {
    id: "r7",
    khi: { trangPhuc: ["ba_ba"], phuKienBatKy: ["khan_ran"] },
    nhan: "chuan",
    lyDo: "Áo bà ba và khăn rằn đặc trưng miền Tây Nam Bộ."
  },
  {
    id: "mac_dinh",
    khi: {},
    nhan: "sang_tao",
    lyDo: "Bản phối sáng tạo cá nhân."
  }
];
