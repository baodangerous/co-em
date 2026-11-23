/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AdminWorkshopsTab — Quản lý Lịch Workshop Thực hành & Duyệt Đơn Đăng Ký Cam Kết
 */

import React, { useState } from "react";
import {
  saveWorkshops,
  updateWorkshopRegistrationStatus,
  type WorkshopItem,
  type WorkshopRegistrationRecord,
} from "../../lib/adminStore";
import { ModalShell } from "../common/SharedUI";
import { Clock, Mail, MapPin, Phone, Plus } from "lucide-react";

interface AdminWorkshopsTabProps {
  workshops: WorkshopItem[];
  wsRegistrations: WorkshopRegistrationRecord[];
  onReload: () => void;
  onShowToast: (msg: string) => void;
}

export default function AdminWorkshopsTab({
  workshops,
  wsRegistrations,
  onReload,
  onShowToast,
}: AdminWorkshopsTabProps) {
  const [showAddWorkshopModal, setShowAddWorkshopModal] = useState(false);
  const [wsTitle, setWsTitle] = useState("");
  const [wsDate, setWsDate] = useState("Thứ Bảy, 05/12/2026");
  const [wsTime, setWsTime] = useState("09:00 – 11:30");
  const [wsLocation, setWsLocation] = useState("");
  const [wsAddress, setWsAddress] = useState("");
  const [wsHost, setWsHost] = useState("");
  const [wsFeeType, setWsFeeType] = useState<"mien_phi" | "co_phi">("mien_phi");
  const [wsFeeLabel, setWsFeeLabel] = useState(
    "Miễn phí tham dự (Tài trợ bởi Quỹ Bảo tồn Di sản)"
  );
  const [wsMaxCap, setWsMaxCap] = useState(15);
  const [wsNotesText, setWsNotesText] = useState(
    "Có mặt trước 15 phút để điểm danh nhận nguyên liệu.\nMặc trang phục lịch sự, gọn gàng."
  );

  const handleAddWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsTitle.trim() || !wsLocation.trim()) return;
    const newWs: WorkshopItem = {
      id: `ws_${Date.now()}`,
      title: wsTitle.trim(),
      specificDate: wsDate.trim(),
      timeRange: wsTime.trim(),
      location: wsLocation.trim(),
      addressDetail: wsAddress.trim() || wsLocation.trim(),
      host: wsHost.trim() || "Nghệ nhân Di sản Việt Phục",
      costumeId: "ngu_than",
      costumeName: "Áo Ngũ Thân",
      mauId: "m_do",
      phuKienIds: ["khan_dong"],
      maxCapacity: Number(wsMaxCap) || 15,
      spotsLabel: `Giới hạn ${Number(wsMaxCap) || 15} học viên/buổi`,
      feeType: wsFeeType,
      feeLabel: wsFeeLabel.trim(),
      notes: wsNotesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      theme: "lua_gam",
      active: true,
    };
    saveWorkshops([newWs, ...workshops]);
    onReload();
    setShowAddWorkshopModal(false);
    setWsTitle("");
    setWsLocation("");
    setWsAddress("");
    setWsHost("");
    onShowToast("Đã tạo lịch Workshop mới thành công!");
  };

  return (
    <div className="space-y-4">
      {/* Danh sách Đơn đăng ký cam kết của học viên */}
      <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--vien-the)]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
              Danh Sách Đơn Đăng Ký & Cam Kết Tham Gia Workshop
            </h2>
            <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
              Kiểm tra thông tin liên hệ và cam kết của học viên đã đăng ký để chuẩn bị nguyên liệu
            </p>
          </div>
        </div>

        {wsRegistrations.length === 0 ? (
          <div className="p-6 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-center text-xs text-[var(--chu-phu)]">
            Chưa có đơn đăng ký mới. Khi người dùng điền form cam kết tại mục Workshop, hồ sơ sẽ hiển thị tại đây.
          </div>
        ) : (
          <div className="space-y-2.5">
            {wsRegistrations.map((reg) => (
              <div
                key={reg.id}
                className="p-4 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-sm font-bold text-[var(--chu-chinh)]">
                      {reg.fullName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      {reg.attendeeCount} học viên · Đã ký 3 cam kết
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        reg.status === "confirmed"
                          ? "bg-sky-500/15 text-sky-700 dark:text-sky-300"
                          : reg.status === "cancelled"
                          ? "bg-rose-500/15 text-rose-600"
                          : "bg-amber-500/15 text-amber-700"
                      }`}
                    >
                      {reg.status === "confirmed"
                        ? "Đã xác nhận chỗ"
                        : reg.status === "cancelled"
                        ? "Đã huỷ"
                        : "Chờ duyệt"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--chu-phu)]">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[var(--xanh-chinh)]" />
                      {reg.phone}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[var(--xanh-chinh)]" />
                      {reg.email}
                    </span>
                    <span className="font-semibold text-[var(--chu-chinh)]">
                      Workshop: {reg.workshopTitle} ({reg.workshopDate} · {reg.workshopTime})
                    </span>
                  </div>

                  {reg.motivationNote && (
                    <p className="text-xs text-[var(--chu-phu)] m-0 italic">
                      Ghi chú học viên: &ldquo;{reg.motivationNote}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      updateWorkshopRegistrationStatus(reg.id, "confirmed");
                      onShowToast(`Đã xác nhận chỗ cho ${reg.fullName}!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                  >
                    Xác nhận
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateWorkshopRegistrationStatus(reg.id, "cancelled");
                      onShowToast(`Đã huỷ đơn của ${reg.fullName}.`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/15 text-rose-600 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                  >
                    Huỷ chỗ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quản lý Lịch Workshop */}
      <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--vien-the)]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
              Quản Lý Lịch Workshop Thực Hành Di Sản
            </h2>
            <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
              Cập nhật ngày tháng cụ thể, giờ học, địa điểm, học phí/miễn phí và lưu ý cho người tham gia
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddWorkshopModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm lịch Workshop mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {workshops.map((ws) => (
            <div
              key={ws.id}
              className={`p-4 rounded-xl border space-y-2 ${
                ws.active === false
                  ? "bg-rose-500/5 border-rose-500/30 opacity-70"
                  : "bg-[var(--nen-the-phu)] border-[var(--vien-the)]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mb-1 ${
                      ws.feeType === "mien_phi"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {ws.feeLabel}
                  </span>
                  <h3 className="font-serif text-sm font-bold text-[var(--chu-chinh)] m-0">
                    {ws.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = workshops.map((item) =>
                      item.id === ws.id
                        ? { ...item, active: item.active === false }
                        : item
                    );
                    saveWorkshops(next);
                    onShowToast("Đã cập nhật trạng thái hiển thị Workshop.");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-[11px] font-semibold cursor-pointer"
                >
                  {ws.active === false ? "Đang ẩn (Bật lại)" : "Đang mở"}
                </button>
              </div>

              <div className="text-xs text-[var(--chu-phu)] space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--xanh-chinh)] shrink-0" />
                  <span>
                    {ws.specificDate} · {ws.timeRange} ({ws.spotsLabel})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--vang-chinh)] shrink-0" />
                  <span>{ws.addressDetail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL THÊM LỊCH WORKSHOP MỚI */}
      <ModalShell
        isOpen={showAddWorkshopModal}
        onClose={() => setShowAddWorkshopModal(false)}
        title="Tạo Lịch Workshop Thực Hành Mới"
        maxWidthClass="max-w-lg"
      >
        <form onSubmit={handleAddWorkshop} className="space-y-3">
          <input
            type="text"
            required
            value={wsTitle}
            onChange={(e) => setWsTitle(e.target.value)}
            placeholder="Tên chủ đề Workshop..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              value={wsDate}
              onChange={(e) => setWsDate(e.target.value)}
              placeholder="Ngày tháng (VD: Thứ Bảy, 05/12/2026)"
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
            />
            <input
              type="text"
              required
              value={wsTime}
              onChange={(e) => setWsTime(e.target.value)}
              placeholder="Khung giờ (VD: 09:00 – 11:30)"
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
            />
          </div>

          <input
            type="text"
            required
            value={wsLocation}
            onChange={(e) => setWsLocation(e.target.value)}
            placeholder="Địa điểm chính (VD: Bảo tàng Dân tộc học · Hà Nội)"
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
          />

          <input
            type="text"
            value={wsAddress}
            onChange={(e) => setWsAddress(e.target.value)}
            placeholder="Địa chỉ phòng/tầng/số nhà cụ thể..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={wsHost}
              onChange={(e) => setWsHost(e.target.value)}
              placeholder="Nghệ nhân hướng dẫn..."
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
            />
            <input
              type="number"
              min={5}
              max={100}
              value={wsMaxCap}
              onChange={(e) => setWsMaxCap(Number(e.target.value))}
              placeholder="Số chỗ tối đa"
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              value={wsFeeType}
              onChange={(e) =>
                setWsFeeType(e.target.value as "mien_phi" | "co_phi")
              }
              className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs font-semibold"
            >
              <option value="mien_phi">Miễn phí</option>
              <option value="co_phi">Có thu phí</option>
            </select>
            <input
              type="text"
              value={wsFeeLabel}
              onChange={(e) => setWsFeeLabel(e.target.value)}
              placeholder="Mô tả chi phí / miễn phí..."
              className="col-span-2 px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
            />
          </div>

          <textarea
            rows={3}
            value={wsNotesText}
            onChange={(e) => setWsNotesText(e.target.value)}
            placeholder="Lưu ý khi tham gia (mỗi dòng 1 lưu ý)..."
            className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddWorkshopModal(false)}
              className="px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] text-xs font-semibold cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
            >
              Đăng lịch Workshop
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
}
