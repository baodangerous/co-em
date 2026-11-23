/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AdminPostsTab — Kiểm duyệt Bản phối Cộng đồng & Gắn nhãn Văn hóa (Chợ Phiên)
 */

import React, { useState, useMemo } from "react";
import {
  capNhatBaiDangChoPhien,
  xoaBaiDangChoPhien,
  type BaiDangChoPhien,
  type NhanChoPhien,
} from "../../lib/choPhien";
import CostumeCardPreview from "../CostumeCardPreview";
import { playFolkPluck } from "../../lib/audio";
import { Eye, EyeOff, Trash2 } from "lucide-react";

interface AdminPostsTabProps {
  posts: BaiDangChoPhien[];
  onPostsChange: (posts: BaiDangChoPhien[]) => void;
  onShowToast: (msg: string) => void;
  onOpenCostumeDetail?: (trangPhucId: string) => void;
}

export default function AdminPostsTab({
  posts,
  onPostsChange,
  onShowToast,
  onOpenCostumeDetail,
}: AdminPostsTabProps) {
  const [postFilter, setPostFilter] = useState<"all" | NhanChoPhien>("all");

  const filteredPosts = useMemo(() => {
    if (postFilter === "all") return posts;
    return posts.filter((p) => p.nhan === postFilter);
  }, [posts, postFilter]);

  const handleUpdatePostLabel = (postId: string, nhan: NhanChoPhien) => {
    playFolkPluck();
    const updated = capNhatBaiDangChoPhien(postId, {
      nhan,
      trangThaiDuyet: "approved",
    });
    onPostsChange(updated);
    onShowToast("Đã cập nhật phân loại văn hóa & duyệt bài đăng!");
  };

  const handleTogglePostVisibility = (post: BaiDangChoPhien) => {
    playFolkPluck();
    const nextState =
      post.trangThaiDuyet === "hidden" ? "approved" : "hidden";
    const updated = capNhatBaiDangChoPhien(post.id, {
      trangThaiDuyet: nextState,
    });
    onPostsChange(updated);
    onShowToast(
      nextState === "hidden"
        ? "Đã tạm ẩn bài đăng khỏi Chợ Phiên công khai."
        : "Đã hiển thị lại bài đăng trên Chợ Phiên."
    );
  };

  const handleDeletePost = (postId: string) => {
    playFolkPluck();
    const updated = xoaBaiDangChoPhien(postId);
    onPostsChange(updated);
    onShowToast("Đã xóa bài đăng khỏi hệ thống.");
  };

  return (
    <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--vien-the)]">
        <div>
          <h2 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
            Kiểm Duyệt Bản Phối Cộng Đồng (Chợ Phiên)
          </h2>
          <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
            Thẩm định nhãn văn hóa, duyệt hiển thị hoặc ẩn/xóa các bài đăng không phù hợp thuần phong mỹ tục
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ["all", "Tất cả bài đăng"],
              ["chuan", "Chuẩn nếp xưa"],
              ["sang_tao", "Phối sáng tạo"],
              ["can_xem_lai", "Cần lưu ý"],
            ] as const
          ).map(([fKey, fLabel]) => (
            <button
              key={fKey}
              type="button"
              onClick={() => setPostFilter(fKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                postFilter === fKey
                  ? "bg-[var(--xanh-chinh)] text-white"
                  : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border border-[var(--vien-the)]"
              }`}
            >
              {fLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredPosts.map((post) => {
          const isHidden = post.trangThaiDuyet === "hidden";
          return (
            <div
              key={post.id}
              className={`p-4 rounded-xl border flex gap-3.5 items-start transition ${
                isHidden
                  ? "bg-rose-500/5 border-rose-500/30 opacity-75"
                  : "bg-[var(--nen-the-phu)] border-[var(--vien-the)]"
              }`}
            >
              <div
                onClick={() => onOpenCostumeDetail?.(post.trangPhucId)}
                className="w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-[var(--vien-the)] bg-[var(--nen-the)] cursor-pointer"
                title="Xem hồ sơ trang phục"
              >
                <CostumeCardPreview
                  trangPhucId={post.trangPhucId}
                  enableFlip={false}
                  className="!h-28 !rounded-xl pointer-events-none"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-[var(--chu-chinh)]">
                      {post.nguoiDang}
                    </div>
                    <div className="text-[11px] text-[var(--chu-phu)]">
                      Mã trang phục: {post.trangPhucId} · Vùng: {post.vung}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isHidden
                        ? "bg-rose-600 text-white"
                        : "bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {isHidden ? "Đang ẩn" : "Đang hiển thị"}
                  </span>
                </div>

                <p className="text-xs text-[var(--chu-chinh)] m-0 line-clamp-2">
                  &ldquo;{post.caption}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(
                    [
                      ["chuan", "Chuẩn nếp xưa"],
                      ["sang_tao", "Sáng tạo"],
                      ["can_xem_lai", "Cần lưu ý"],
                    ] as [NhanChoPhien, string][]
                  ).map(([nKey, nLabel]) => (
                    <button
                      key={nKey}
                      type="button"
                      onClick={() => handleUpdatePostLabel(post.id, nKey)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer border ${
                        post.nhan === nKey
                          ? "bg-[var(--xanh-chinh)] text-white border-transparent"
                          : "bg-[var(--nen-the)] text-[var(--chu-phu)] border-[var(--vien-the)] hover:text-[var(--chu-chinh)]"
                      }`}
                    >
                      {nLabel}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleTogglePostVisibility(post)}
                    className="p-1.5 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-[var(--chu-chinh)] hover:border-amber-500 cursor-pointer"
                    title={isHidden ? "Hiện lại bài đăng" : "Tạm ẩn bài đăng"}
                  >
                    {isHidden ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-rose-600 hover:bg-rose-600 hover:text-white cursor-pointer"
                    title="Xóa vĩnh viễn bài đăng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
