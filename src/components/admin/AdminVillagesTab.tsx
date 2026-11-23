/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AdminVillagesTab — Quản lý Làng nghề Di sản & Đơn liên hệ Đặt may
 */

import React, { useState } from "react";
import {
  saveCraftVillages,
  updateVillageOrderStatus,
  type CraftVillageItem,
  type VillageOrderRecord,
} from "../../lib/adminStore";
import { ModalShell } from "../common/SharedUI";
import { Plus } from "lucide-react";

interface AdminVillagesTabProps {
  villages: CraftVillageItem[];
  villageOrders: VillageOrderRecord[];
  onReload: () => void;
  onShowToast: (msg: string) => void;
}

export default function AdminVillagesTab({
  villages,
  villageOrders,
  onReload,
  onShowToast,
}: AdminVillagesTabProps) {
  const [showAddVillageModal, setShowAddVillageModal] = useState(false);
  const [vilName, setVilName] = useState("");
  const [vilRegion, setVilRegion] = useState<"bac" | "trung" | "nam">("bac");
  const [vilRegionLabel, setVilRegionLabel] = useState("");
  const [vilArtisan, setVilArtisan] = useState("");
  const [vilSpecialty, setVilSpecialty] = useState("");
  const [vilPrice, setVilPrice] = useState("1.5 – 3.5tr");

  const handleAddVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vilName.trim() || !vilSpecialty.trim()) return;
    const newVil: CraftVillageItem = {
      id: `vil_${Date.now()}`,
      name: vilName.trim(),
      region: vilRegion,
      regionLabel: vilRegionLabel.trim() || "Việt Nam",
      artisan: vilArtisan.trim() || "Nghệ nhân Làng nghề",
      specialty: vilSpecialty.trim(),
      costumeId: "aodai",
      costumeName: "Cổ phục truyền thống",
      mauId: "m_do",
      phuKienIds: ["khan_dong"],
      priceRange: vilPrice.trim(),
      theme: "lua_gam",
      active: true,
    };
    saveCraftVillages([newVil, ...villages]);
    onReload();
    setShowAddVillageModal(false);
    setVilName("");
    setVilRegionLabel("");
    setVilArtisan("");
    setVilSpecialty("");
    onShowToast("Đã thêm Làng nghề mới vào hệ thống!");
  };

  return (
    <div className="space-y-4">
      {/* Đơn đặt may từ khách hàng */}
      <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3.5">
        <h2 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
          Yêu Cầu Kết Nối & Đặt May Từ Người Dùng
        </h2>

        {villageOrders.length === 0 ? (
          <div className="p-5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-center text-xs text-[var(--chu-phu)]">
            Chưa có yêu cầu đặt may mới.
          </div>
        ) : (
          <div className="space-y-2.5">
            {villageOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-sm text-[var(--chu-chinh)]">
                    {ord.customerName} — Đặt may {ord.costumeName} ({ord.villageName})
                  </div>
                  <div className="text-[var(--chu-phu)]">
                    Ghi chú: {ord.note || "Không có ghi chú thêm"}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      ["new", "Mới gửi"],
                      ["contacted", "Đang tư vấn"],
                      ["completed", "Hoàn tất"],
                    ] as const
                  ).map(([stKey, stLabel]) => (
                    <button
                      key={stKey}
                      type="button"
                      onClick={() => {
                        updateVillageOrderStatus(ord.id, stKey);
                        onShowToast("Đã cập nhật tiến độ đơn đặt may!");
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        ord.status === stKey
                          ? "bg-[var(--xanh-chinh)] text-white"
                          : "bg-[var(--nen-the)] text-[var(--chu-phu)] border border-[var(--vien-the)]"
                      }`}
                    >
                      {stLabel}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Danh sách Làng nghề */}
      <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--vien-the)]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
              Danh Mục Làng Nghề & Nghệ Nhân Di Sản
            </h2>
            <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
              Thêm mới hoặc bật/tắt các làng nghề truyền thống trên Chợ Phiên
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddVillageModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Làng nghề mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {villages.map((vil) => (
            <div
              key={vil.id}
              className={`p-3.5 rounded-xl border space-y-2 ${
                vil.active === false
                  ? "bg-rose-500/5 border-rose-500/30 opacity-70"
                  : "bg-[var(--nen-the-phu)] border-[var(--vien-the)]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold text-[var(--vang-chinh)]">
                    {vil.regionLabel} · {vil.priceRange}
                  </div>
                  <h3 className="font-serif text-sm font-bold text-[var(--chu-chinh)] m-0">
                    {vil.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = villages.map((v) =>
                      v.id === vil.id
                        ? { ...v, active: v.active === false }
                        : v
                    );
                    saveCraftVillages(next);
                    onShowToast("Đã cập nhật hiển thị Làng nghề.");
                  }}
                  className="px-2 py-1 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-[10px] font-semibold cursor-pointer"
                >
                  {vil.active === false ? "Đang ẩn" : "Hiển thị"}
                </button>
              </div>
              <p className="text-xs text-[var(--chu-phu)] m-0">
                {vil.specialty} · {vil.artisan}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL THÊM LÀNG NGHỀ MỚI */}
      <ModalShell
        isOpen={showAddVillageModal}
        onClose={() => setShowAddVillageModal(false)}
        title="Thêm Làng Nghề Di Sản Mới"
      >
        <form onSubmit={handleAddVillage} className="space-y-3">
          <input
            type="text"
            required
            value={vilName}
            onChange={(e) => setVilName(e.target.value)}
            placeholder="Tên làng nghề (VD: Làng Lụa Cổ Đô)..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={vilRegion}
              onChange={(e) =>
                setVilRegion(e.target.value as "bac" | "trung" | "nam")
              }
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
            >
              <option value="bac">Bắc Bộ</option>
              <option value="trung">Trung Bộ & Tây Nguyên</option>
              <option value="nam">Nam Bộ</option>
            </select>
            <input
              type="text"
              value={vilRegionLabel}
              onChange={(e) => setVilRegionLabel(e.target.value)}
              placeholder="Huyện · Tỉnh..."
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
            />
          </div>

          <input
            type="text"
            value={vilArtisan}
            onChange={(e) => setVilArtisan(e.target.value)}
            placeholder="Nghệ nhân / Hợp tác xã đại diện..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
          />

          <input
            type="text"
            required
            value={vilSpecialty}
            onChange={(e) => setVilSpecialty(e.target.value)}
            placeholder="Đặc sản thủ công (VD: Lụa tơ tằm dệt thủ công)..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
          />

          <input
            type="text"
            value={vilPrice}
            onChange={(e) => setVilPrice(e.target.value)}
            placeholder="Khoảng giá tham khảo (VD: 1.5 – 3.5tr)"
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddVillageModal(false)}
              className="px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] text-xs font-semibold cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold cursor-pointer"
            >
              Lưu Làng Nghề
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}
