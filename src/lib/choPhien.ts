/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NhanVatConfig, NHAN_VAT_MAC_DINH } from "./avatar";
import { OutfitSaved } from "./guiKyUc";
import { layHoSoHienTai } from "./hoSo";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";

export type NhanChoPhien = "chuan" | "sang_tao" | "can_xem_lai";
export type LyDoBinhChon = "hop_dip" | "phoi_mau" | "ton_trong_vung_mien";

export interface BaiDangChoPhien {
  id: string;
  nguoiDang: string;
  nhomId: string;
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  dip: string;
  vung: string;
  nhan: NhanChoPhien;
  caption: string;
  nhanVatConfig: NhanVatConfig;
  taoLuc: string;
  binhChon: Record<LyDoBinhChon, number>;
  laToi?: boolean;
  trangThaiDuyet?: "approved" | "pending" | "hidden";
}

const CHO_PHIEN_STORAGE_KEY = "vpr:cho_phien_posts";
const CHO_PHIEN_VOTES_KEY = "vpr:cho_phien_my_votes";

import { SAMPLE_CHO_PHIEN_POSTS } from "./cho-phien/choPhienSamples";
export { SAMPLE_CHO_PHIEN_POSTS };

export function docDanhSachChoPhien(): BaiDangChoPhien[] {
  try {
    const raw = localStorage.getItem(CHO_PHIEN_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(SAMPLE_CHO_PHIEN_POSTS));
      return SAMPLE_CHO_PHIEN_POSTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map((item: BaiDangChoPhien) => item.id));
      const missingSamples = SAMPLE_CHO_PHIEN_POSTS.filter(
        (sample) => !existingIds.has(sample.id)
      );
      if (missingSamples.length > 0) {
        const merged = [...parsed, ...missingSamples];
        localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    }
  } catch (e) {
    console.warn("Lỗi đọc dữ liệu Chợ phiên:", e);
  }
  return SAMPLE_CHO_PHIEN_POSTS;
}

export function dangLenChoPhien(
  baiMoi: Omit<BaiDangChoPhien, "id" | "taoLuc" | "binhChon" | "laToi">
): BaiDangChoPhien {
  const danhSach = docDanhSachChoPhien();
  const post: BaiDangChoPhien = {
    ...baiMoi,
    id: `cp_user_${Date.now()}`,
    taoLuc: new Date().toISOString(),
    binhChon: {
      hop_dip: 1,
      phoi_mau: 1,
      ton_trong_vung_mien: 1
    },
    laToi: true
  };
  const capNhat = [post, ...danhSach];
  try {
    localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(capNhat));
  } catch (e) {
    console.warn("Lỗi lưu bài Chợ phiên:", e);
  }
  return post;
}

export function dangBaiLenChoPhien(outfit: OutfitSaved): {
  success: boolean;
  message: string;
  post: BaiDangChoPhien;
} {
  const tpObj = trangPhuc.find((t) => t.id === outfit.trangPhucId) || trangPhuc[0];
  const nhomId = tpObj.nhomIds[0] || "kb";
  const nhomObj = nhom.find((n) => n.id === nhomId);
  const vung = nhomObj ? nhomObj.vung : "bac";

  const hoSo = layHoSoHienTai();
  const tenNguoiDang =
    hoSo && !hoSo.laKhach && hoSo.tenHienThi
      ? `${hoSo.tenHienThi} (Nhà Sưu Tầm)`
      : "Bạn (Nhà Sưu Tầm)";

  const post = dangLenChoPhien({
    nguoiDang: tenNguoiDang,
    nhomId,
    trangPhucId: outfit.trangPhucId,
    mauId: outfit.mauId,
    phuKienIds: outfit.phuKienIds || [],
    dip: tpObj.dip[0] || "le_hoi",
    vung,
    nhan: outfit.phongCach === "sang_tao" ? "sang_tao" : "chuan",
    caption: outfit.caption || "Chia sẻ bộ phối Việt phục từ Gùi Ký Ức!",
    nhanVatConfig: outfit.nhanVatConfig || NHAN_VAT_MAC_DINH
  });

  return {
    success: true,
    message: "Đã đăng bộ phối lên Chợ Phiên Cộng Đồng!",
    post
  };
}

export function docBinhChonCuaToi(): Record<string, LyDoBinhChon> {
  try {
    const raw = localStorage.getItem(CHO_PHIEN_VOTES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Lỗi đọc bình chọn của tôi:", e);
  }
  return {};
}

export function binhChonBaiDang(
  postId: string,
  lyDo: LyDoBinhChon
): { danhSach: BaiDangChoPhien[]; myVotes: Record<string, LyDoBinhChon> } {
  const danhSach = docDanhSachChoPhien();
  const myVotes = docBinhChonCuaToi();
  const prevVote = myVotes[postId];

  const capNhat = danhSach.map((post) => {
    if (post.id !== postId) return post;
    const newCounts = { ...post.binhChon };

    if (prevVote && newCounts[prevVote] > 0) {
      newCounts[prevVote] -= 1;
    }

    if (prevVote !== lyDo) {
      newCounts[lyDo] = (newCounts[lyDo] || 0) + 1;
    }

    return {
      ...post,
      binhChon: newCounts
    };
  });

  if (prevVote === lyDo) {
    delete myVotes[postId];
  } else {
    myVotes[postId] = lyDo;
  }

  try {
    localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(capNhat));
    localStorage.setItem(CHO_PHIEN_VOTES_KEY, JSON.stringify(myVotes));
  } catch (e) {
    console.warn("Lỗi lưu bình chọn Chợ phiên:", e);
  }

  return { danhSach: capNhat, myVotes };
}

export function huyBinhChonBaiDang(
  postId: string
): { danhSach: BaiDangChoPhien[]; myVotes: Record<string, LyDoBinhChon> } {
  const danhSach = docDanhSachChoPhien();
  const myVotes = docBinhChonCuaToi();
  const prevVote = myVotes[postId];

  if (!prevVote) {
    return { danhSach, myVotes };
  }

  const capNhat = danhSach.map((post) => {
    if (post.id !== postId) return post;
    const newCounts = { ...post.binhChon };
    if (newCounts[prevVote] > 0) {
      newCounts[prevVote] -= 1;
    }
    return {
      ...post,
      binhChon: newCounts
    };
  });

  delete myVotes[postId];

  try {
    localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(capNhat));
    localStorage.setItem(CHO_PHIEN_VOTES_KEY, JSON.stringify(myVotes));
  } catch (e) {
    console.warn("Lỗi hủy bình chọn Chợ phiên:", e);
  }

  return { danhSach: capNhat, myVotes };
}

export function capNhatBaiDangChoPhien(
  postId: string,
  updates: Partial<Pick<BaiDangChoPhien, "nhan" | "trangThaiDuyet" | "caption">>
): BaiDangChoPhien[] {
  const danhSach = docDanhSachChoPhien();
  const capNhat = danhSach.map((p) =>
    p.id === postId ? { ...p, ...updates } : p
  );
  try {
    localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(capNhat));
  } catch (e) {
    console.warn("Lỗi cập nhật bài đăng Chợ phiên:", e);
  }
  return capNhat;
}

export function xoaBaiDangChoPhien(postId: string): BaiDangChoPhien[] {
  const danhSach = docDanhSachChoPhien();
  const capNhat = danhSach.filter((p) => p.id !== postId);
  try {
    localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(capNhat));
  } catch (e) {
    console.warn("Lỗi xóa bài đăng Chợ phiên:", e);
  }
  return capNhat;
}

