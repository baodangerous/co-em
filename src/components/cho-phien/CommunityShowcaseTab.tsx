/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CommunityShowcaseTab — Phân khu 1: Trưng bày & Bình chọn Bản phối Cộng đồng
 */

import React, { useState, useMemo } from "react";
import { domdom } from "../../copy/domdom";
import { trangPhuc } from "../../data/trangphuc";
import { nhom } from "../../data/nhom";
import { mauSac } from "../../data/mausac";
import {
  type BaiDangChoPhien,
  type LyDoBinhChon,
  type NhanChoPhien,
  docDanhSachChoPhien,
  binhChonBaiDang,
  huyBinhChonBaiDang,
  dangLenChoPhien,
} from "../../lib/choPhien";
import { docDanhSachGuiKyUc, type OutfitSaved } from "../../lib/guiKyUc";
import { tinhSoDo, NHAN_VAT_MAC_DINH } from "../../lib/avatar";
import AvatarSVG from "../AvatarSVG";
import {
  renderGarmentLayers,
  CulturalPatternsDefs,
} from "../GarmentLayers";
import { ModalShell } from "../common/SharedUI";
import { playSilkRustleSound, playFolkPluck } from "../../lib/audio";
import { Filter, Heart, Palette, Plus } from "lucide-react";

interface CommunityShowcaseTabProps {
  posts: BaiDangChoPhien[];
  myVotes: Record<string, LyDoBinhChon>;
  onPostsChange: (posts: BaiDangChoPhien[]) => void;
  onVotesChange: (votes: Record<string, LyDoBinhChon>) => void;
  onShowToast: (msg: string) => void;
  onOpenStudioWithCostume?: (
    trangPhucId: string,
    mauId?: string,
    phuKienIds?: string[]
  ) => void;
}

export default function CommunityShowcaseTab({
  posts,
  myVotes,
  onPostsChange,
  onVotesChange,
  onShowToast,
  onOpenStudioWithCostume,
}: CommunityShowcaseTabProps) {
  const [filterVung, setFilterVung] = useState<string>("all");
  const [filterNhan, setFilterNhan] = useState<"all" | NhanChoPhien>("all");
  const [sortBy, setSortBy] = useState<"moi_nhat" | "yeu_thich">("moi_nhat");

  const [showPickFromGuiModal, setShowPickFromGuiModal] = useState(false);
  const [myOutfits, setMyOutfits] = useState<OutfitSaved[]>([]);
  const [activeVoteModalPostId, setActiveVoteModalPostId] = useState<
    string | null
  >(null);

  const handleOpenPickFromGui = () => {
    setMyOutfits(docDanhSachGuiKyUc());
    setShowPickFromGuiModal(true);
  };

  const handlePostFromGui = (outfit: OutfitSaved) => {
    const nhanVat = outfit.nhanVatConfig || NHAN_VAT_MAC_DINH;
    const tpObj =
      trangPhuc.find((t) => t.id === outfit.trangPhucId) || trangPhuc[0];
    const nhomId = tpObj.nhomIds[0] || "kb";
    const nhomObj = nhom.find((n) => n.id === nhomId);
    const vung = nhomObj ? nhomObj.vung : "bac";

    let tenNguoiDang = "Bạn (Nhà Sưu Tầm)";
    try {
      const rawUser = localStorage.getItem("vpr:auth_user");
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        if (parsedUser?.name) {
          tenNguoiDang = `${parsedUser.name} (Nhà Sưu Tầm)`;
        }
      }
    } catch {
      // ignore
    }

    dangLenChoPhien({
      nguoiDang: tenNguoiDang,
      nhomId,
      trangPhucId: outfit.trangPhucId,
      mauId: outfit.mauId,
      phuKienIds: outfit.phuKienIds,
      dip: tpObj.dip[0] || "le_hoi",
      vung,
      nhan: outfit.phongCach === "sang_tao" ? "sang_tao" : "chuan",
      caption:
        outfit.caption ||
        "Chia sẻ bộ phối Việt phục từ Gùi Ký Ức của mình!",
      nhanVatConfig: nhanVat,
    });

    onPostsChange(docDanhSachChoPhien());
    setShowPickFromGuiModal(false);
    playFolkPluck();
    onShowToast("Đã chia sẻ bộ phối lên Chợ Phiên Cộng Đồng!");
  };

  const handleVote = (postId: string, lyDo: LyDoBinhChon) => {
    const res = binhChonBaiDang(postId, lyDo);
    onPostsChange(res.danhSach);
    onVotesChange(res.myVotes);
    setActiveVoteModalPostId(null);
    playFolkPluck();
    onShowToast(domdom.choPhien.daBinhChon);
  };

  const handleCancelVote = (postId: string) => {
    const res = huyBinhChonBaiDang(postId);
    onPostsChange(res.danhSach);
    onVotesChange(res.myVotes);
    onShowToast("Đã huỷ lượt yêu thích.");
  };

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => {
        if (p.trangThaiDuyet === "hidden") return false;
        if (filterVung !== "all" && p.vung !== filterVung) return false;
        if (filterNhan !== "all" && p.nhan !== filterNhan) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "yeu_thich") {
          const sumA =
            (a.binhChon.hop_dip || 0) +
            (a.binhChon.phoi_mau || 0) +
            (a.binhChon.ton_trong_vung_mien || 0);
          const sumB =
            (b.binhChon.hop_dip || 0) +
            (b.binhChon.phoi_mau || 0) +
            (b.binhChon.ton_trong_vung_mien || 0);
          return sumB - sumA;
        }
        return new Date(b.taoLuc).getTime() - new Date(a.taoLuc).getTime();
      });
  }, [posts, filterVung, filterNhan, sortBy]);

  const getNhomTen = (id: string) =>
    nhom.find((n) => n.id === id)?.ten || id;
  const getTrangPhucTen = (id: string) =>
    trangPhuc.find((t) => t.id === id)?.ten || id;
  const getMauObj = (id: string) =>
    mauSac.find((m) => m.id === id) || {
      id,
      ten: id,
      hex: "#D9A441",
      yNghia: "",
    };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Thanh lọc & nút chia sẻ */}
      <div className="p-3.5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--tro-tram)]">
            <Filter className="w-3.5 h-3.5" />
            <span>Vùng:</span>
          </span>
          {(
            [
              ["all", "Tất cả"],
              ["bac", "Bắc Bộ"],
              ["trung", "Trung Bộ"],
              ["taynguyen", "Tây Nguyên"],
              ["nam", "Nam Bộ"],
            ] as const
          ).map(([vKey, vLabel]) => (
            <button
              key={vKey}
              type="button"
              onClick={() => setFilterVung(vKey)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterVung === vKey
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-[var(--vien-the)]"
              }`}
            >
              {vLabel}
            </button>
          ))}

          <select
            value={filterNhan}
            onChange={(e) =>
              setFilterNhan(e.target.value as "all" | NhanChoPhien)
            }
            aria-label="Lọc theo nhãn văn hóa"
            className="px-2.5 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs font-medium text-[var(--nen-toi)]"
          >
            <option value="all">Mọi phong cách</option>
            <option value="chuan">Chuẩn nếp xưa</option>
            <option value="sang_tao">Phối sáng tạo</option>
            <option value="can_xem_lai">Cần lưu ý</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "moi_nhat" | "yeu_thich")
            }
            aria-label="Sắp xếp bài đăng"
            className="px-2.5 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs font-medium text-[var(--nen-toi)]"
          >
            <option value="moi_nhat">Mới nhất</option>
            <option value="yeu_thich">Được yêu thích nhất</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenPickFromGui}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Đăng bộ phối từ Gùi Ký Ức</span>
        </button>
      </div>

      {/* Danh sách bài đăng */}
      {filteredPosts.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] text-center text-sm text-[var(--tro-tram)]">
          Chưa có bài đăng nào khớp bộ lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => {
            const soDo = tinhSoDo(post.nhanVatConfig);
            const mauObj = getMauObj(post.mauId);
            const garmentLayers = renderGarmentLayers({
              trangPhucId: post.trangPhucId,
              soDo,
              mauHex: mauObj.hex,
              phuKienIds: post.phuKienIds,
              huongNhin: post.nhanVatConfig.huongNhin || "truoc",
            });

            const totalVotes =
              (post.binhChon.hop_dip || 0) +
              (post.binhChon.phoi_mau || 0) +
              (post.binhChon.ton_trong_vung_mien || 0);
            const userVote = myVotes[post.id];
            const isVoteModalOpen = activeVoteModalPostId === post.id;

            return (
              <article
                key={post.id}
                className="flex flex-col justify-between p-4 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-emerald-500/40 shadow-xs transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-[var(--nen-toi)] flex items-center gap-1.5">
                        <span>{post.nguoiDang}</span>
                        {post.laToi && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                            Của bạn
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--tro-tram)]">
                        {getNhomTen(post.nhomId)} · {formatTime(post.taoLuc)}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        post.nhan === "chuan"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                          : post.nhan === "sang_tao"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      {post.nhan === "chuan"
                        ? "Chuẩn nếp xưa"
                        : post.nhan === "sang_tao"
                        ? "Sáng tạo"
                        : "Lưu ý"}
                    </span>
                  </div>

                  {/* Hình minh họa 2D */}
                  <div className="relative w-full h-64 rounded-xl bg-gradient-to-b from-amber-50/50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 border border-[var(--vien-the)] flex items-center justify-center overflow-hidden">
                    <svg
                      viewBox="0 0 400 560"
                      className="w-full h-full object-contain"
                      aria-label={getTrangPhucTen(post.trangPhucId)}
                    >
                      <AvatarSVG
                        nhanVat={post.nhanVatConfig}
                        childrenDefs={<CulturalPatternsDefs />}
                        childrenVayQuan={garmentLayers.childrenVayQuan}
                        childrenAo={garmentLayers.childrenAo}
                        childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
                        childrenTocTruocKhanNon={
                          garmentLayers.childrenTocTruocKhanNon
                        }
                      />
                    </svg>

                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-medium flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40"
                        style={{ backgroundColor: mauObj.hex }}
                      />
                      <span>
                        {getTrangPhucTen(post.trangPhucId)} · {mauObj.ten}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--nen-toi)] line-clamp-2 m-0">
                    {post.caption}
                  </p>
                </div>

                {/* Nút tương tác */}
                <div className="pt-3 mt-3 border-t border-[var(--vien-the)] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    {!userVote ? (
                      <button
                        type="button"
                        onClick={() => setActiveVoteModalPostId(post.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--nen-the-phu)] hover:bg-amber-500/15 border border-[var(--vien-the)] hover:border-amber-500/40 text-xs font-semibold text-[var(--nen-toi)] transition cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Yêu thích ({totalVotes})</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-semibold">
                          ✓ {domdom.choPhien.lyDo[userVote]} ({totalVotes})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCancelVote(post.id)}
                          className="text-xs text-[var(--tro-tram)] hover:text-rose-500 px-1.5 py-1 cursor-pointer"
                          title="Huỷ thích"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {onOpenStudioWithCostume && (
                      <button
                        type="button"
                        onClick={() => {
                          playSilkRustleSound();
                          onOpenStudioWithCostume(
                            post.trangPhucId,
                            post.mauId,
                            post.phuKienIds
                          );
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Phối thử</span>
                      </button>
                    )}
                  </div>

                  {isVoteModalOpen && (
                    <div className="p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-amber-500/40 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[var(--nen-toi)]">
                        <span>Chọn lý do bạn yêu thích:</span>
                        <button
                          type="button"
                          onClick={() => setActiveVoteModalPostId(null)}
                          className="text-[var(--tro-tram)] cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {(
                          [
                            ["hop_dip", domdom.choPhien.lyDo.hop_dip],
                            ["phoi_mau", domdom.choPhien.lyDo.phoi_mau],
                            [
                              "ton_trong_vung_mien",
                              domdom.choPhien.lyDo.ton_trong_vung_mien,
                            ],
                          ] as [LyDoBinhChon, string][]
                        ).map(([key, label]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleVote(post.id, key)}
                            className="text-left px-2.5 py-1.5 rounded-lg bg-[var(--nen-the)] hover:bg-amber-500/15 border border-[var(--vien-the)] text-xs font-medium text-[var(--nen-toi)] cursor-pointer"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* MODAL CHỌN BỘ ĐỒ TỪ GÙI KÝ ỨC ĐỂ ĐĂNG LÊN CỘNG ĐỒNG */}
      <ModalShell
        isOpen={showPickFromGuiModal}
        onClose={() => setShowPickFromGuiModal(false)}
        title="Chia sẻ từ Gùi Ký Ức"
        maxWidthClass="max-w-lg"
      >
        {myOutfits.length === 0 ? (
          <div className="py-6 text-center text-sm text-[var(--tro-tram)]">
            Gùi Ký Ức của bạn đang trống. Hãy vào mục Phối Đồ 2D để lưu trang phục trước nhé!
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {myOutfits.map((outfit) => {
              const tp =
                trangPhuc.find((t) => t.id === outfit.trangPhucId) ||
                trangPhuc[0];
              const mau =
                mauSac.find((m) => m.id === outfit.mauId) || mauSac[0];
              return (
                <div
                  key={outfit.id}
                  className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold">{tp.ten}</div>
                    <div className="text-xs text-[var(--tro-tram)]">
                      Màu {mau.ten} · {outfit.caption || "Bản phối cá nhân"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePostFromGui(outfit)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold cursor-pointer shrink-0"
                  >
                    Đăng lên chợ
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </ModalShell>
    </div>
  );
}
