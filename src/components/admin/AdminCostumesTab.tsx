/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AdminCostumesTab — Quản lý Kho Trang phục & Cổ phục
 */

import React, { useState, useMemo } from "react";
import {
  saveCustomCostume,
  toggleCostumeVisibility,
} from "../../lib/adminStore";
import { nhom } from "../../data/nhom";
import type { TrangPhuc } from "../../types";
import CostumeCardPreview from "../CostumeCardPreview";
import { ModalShell } from "../common/SharedUI";
import { Plus, Search } from "lucide-react";

interface AdminCostumesTabProps {
  costumes: TrangPhuc[];
  hiddenCostumeIds: string[];
  onReload: () => void;
  onShowToast: (msg: string) => void;
  onOpenCostumeDetail?: (trangPhucId: string) => void;
}

export default function AdminCostumesTab({
  costumes,
  hiddenCostumeIds,
  onReload,
  onShowToast,
  onOpenCostumeDetail,
}: AdminCostumesTabProps) {
  const [costumeQuery, setCostumeQuery] = useState("");
  const [showAddCostumeModal, setShowAddCostumeModal] = useState(false);
  const [newCostumeName, setNewCostumeName] = useState("");
  const [newCostumeDesc, setNewCostumeDesc] = useState("");
  const [newCostumeNhom, setNewCostumeNhom] = useState("kb");
  const [newCostumeGioiTinh, setNewCostumeGioiTinh] = useState<
    "nu" | "nam" | "chung"
  >("chung");

  const filteredCostumes = useMemo(() => {
    if (!costumeQuery.trim()) return costumes;
    const q = costumeQuery.toLowerCase();
    return costumes.filter(
      (tp) =>
        tp.ten.toLowerCase().includes(q) ||
        tp.id.toLowerCase().includes(q) ||
        tp.moTaNgan.toLowerCase().includes(q)
    );
  }, [costumes, costumeQuery]);

  const handleAddCostume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCostumeName.trim() || !newCostumeDesc.trim()) return;
    const id = `custom_${Date.now()}`;
    saveCustomCostume({
      id,
      ten: newCostumeName.trim(),
      nhomIds: [newCostumeNhom],
      gioiTinh: newCostumeGioiTinh,
      dip: ["le_hoi", "tet", "anh"],
      thoiTiet: ["mat", "nang", "se_lanh"],
      mucRemix: "co_dieu_kien",
      moTaNgan: newCostumeDesc.trim(),
      fallbackText: newCostumeDesc.trim(),
      suThat: [
        "Trang phục được bổ sung và thẩm định qua Hệ thống Quản trị Dự án.",
        newCostumeDesc.trim(),
      ],
      daKiemChung: true,
      nguonIds: ["ngan_nam"],
    });
    onReload();
    setNewCostumeName("");
    setNewCostumeDesc("");
    setShowAddCostumeModal(false);
    onShowToast("Đã thêm trang phục mới vào Bộ Sưu Tập!");
  };

  return (
    <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--vien-the)]">
        <div>
          <h2 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
            Quản Lý Kho Trang Phục & Cổ Phục
          </h2>
          <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
            Thêm trang phục mới, bật/tắt hiển thị hoặc kiểm tra hồ sơ trang phục
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 text-[var(--chu-phu)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={costumeQuery}
              onChange={(e) => setCostumeQuery(e.target.value)}
              placeholder="Tìm tên hoặc mã trang phục..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--chu-chinh)]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAddCostumeModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm trang phục mới</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[540px] overflow-y-auto pr-1">
        {filteredCostumes.map((tp) => {
          const isHidden = hiddenCostumeIds.includes(tp.id);
          return (
            <div
              key={tp.id}
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                isHidden
                  ? "bg-rose-500/5 border-rose-500/30 opacity-65"
                  : "bg-[var(--nen-the-phu)] border-[var(--vien-the)]"
              }`}
            >
              <div
                onClick={() => onOpenCostumeDetail?.(tp.id)}
                className="w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-[var(--vien-the)] bg-[var(--nen-the)] cursor-pointer"
              >
                <CostumeCardPreview
                  trangPhucId={tp.id}
                  enableFlip={false}
                  className="!h-20 !rounded-lg pointer-events-none"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  onClick={() => onOpenCostumeDetail?.(tp.id)}
                  className="font-serif text-sm font-bold text-[var(--chu-chinh)] truncate cursor-pointer hover:text-[var(--xanh-chinh)]"
                >
                  {tp.ten}
                </div>
                <div className="text-[11px] text-[var(--chu-phu)] line-clamp-2 mt-0.5">
                  {tp.moTaNgan}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-semibold text-[var(--xanh-chinh)]">
                    {tp.daKiemChung ? "✓ Đã kiểm chứng" : "Đang cập nhật"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nowHidden = toggleCostumeVisibility(tp.id);
                      onReload();
                      onShowToast(
                        nowHidden
                          ? `Đã ẩn ${tp.ten} khỏi Bộ Sưu Tập.`
                          : `Đã hiển thị ${tp.ten} trên Bộ Sưu Tập.`
                      );
                    }}
                    className="px-2 py-1 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-[10px] font-semibold cursor-pointer"
                  >
                    {isHidden ? "Hiện lại" : "Tạm ẩn"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL THÊM TRANG PHỤC MỚI */}
      <ModalShell
        isOpen={showAddCostumeModal}
        onClose={() => setShowAddCostumeModal(false)}
        title="Thêm Trang Phục Mới"
      >
        <form onSubmit={handleAddCostume} className="space-y-3">
          <input
            type="text"
            required
            value={newCostumeName}
            onChange={(e) => setNewCostumeName(e.target.value)}
            placeholder="Tên trang phục (VD: Áo Tấc Lụa Vân Cổ)..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--chu-chinh)]"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={newCostumeNhom}
              onChange={(e) => setNewCostumeNhom(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--chu-chinh)]"
            >
              {nhom.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.ten}
                </option>
              ))}
            </select>

            <select
              value={newCostumeGioiTinh}
              onChange={(e) =>
                setNewCostumeGioiTinh(
                  e.target.value as "nu" | "nam" | "chung"
                )
              }
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--chu-chinh)]"
            >
              <option value="chung">Nam & Nữ</option>
              <option value="nu">Nữ</option>
              <option value="nam">Nam</option>
            </select>
          </div>

          <textarea
            rows={3}
            required
            value={newCostumeDesc}
            onChange={(e) => setNewCostumeDesc(e.target.value)}
            placeholder="Mô tả đặc trưng phom dáng, chất liệu và ý nghĩa văn hóa..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--chu-chinh)]"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddCostumeModal(false)}
              className="px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] text-xs font-semibold cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
            >
              Lưu vào Bộ Sưu Tập
            </button>
          </div>
        </form>
      </ModalShell>
    </section>
  );
}
