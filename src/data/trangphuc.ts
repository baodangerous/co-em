/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Barrel module hợp nhất dữ liệu trang phục từ 3 phân vùng văn hóa.
 * Giữ nguyên toàn bộ export `trangPhuc` để tương thích 100% với các module hiện có.
 */

import { TrangPhuc } from "../types";
import { trangPhucDongBangVaCungDinh } from "./trangphuc/dongBangVaCungDinh";
import { trangPhucTayBacVaVietBac } from "./trangphuc/tayBacVaVietBac";
import { trangPhucTruongSonTayNguyenNamBo } from "./trangphuc/truongSonTayNguyenNamBo";

export {
  trangPhucDongBangVaCungDinh,
  trangPhucTayBacVaVietBac,
  trangPhucTruongSonTayNguyenNamBo,
};

export const trangPhuc: TrangPhuc[] = [
  ...trangPhucDongBangVaCungDinh,
  ...trangPhucTayBacVaVietBac,
  ...trangPhucTruongSonTayNguyenNamBo,
];
