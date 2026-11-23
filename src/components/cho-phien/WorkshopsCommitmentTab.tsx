/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * WorkshopsCommitmentTab — Phân khu 3: Hội Làng & Workshop Di Sản kèm Phiếu Cam Kết Tham Dự
 */

import React, { useState } from "react";
import {
  submitWorkshopRegistration,
  cancelWorkshopRegistrationByWorkshopId,
  type WorkshopItem,
} from "../../lib/adminStore";
import HeritageVisualBanner from "./HeritageVisualBanner";
import { ModalShell } from "../common/SharedUI";
import { playSilkRustleSound, playFolkPluck } from "../../lib/audio";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

interface WorkshopsCommitmentTabProps {
  workshops: WorkshopItem[];
  onShowToast: (msg: string) => void;
  onOpenStudioWithCostume?: (
    trangPhucId: string,
    mauId?: string,
    phuKienIds?: string[]
  ) => void;
}

export default function WorkshopsCommitmentTab({
  workshops,
  onShowToast,
  onOpenStudioWithCostume,
}: WorkshopsCommitmentTabProps) {
  const [selectedWorkshopForReg, setSelectedWorkshopForReg] =
    useState<WorkshopItem | null>(null);
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAttendeeCount, setRegAttendeeCount] = useState(1);
  const [regMotivation, setRegMotivation] = useState("");
  const [commitOnTime, setCommitOnTime] = useState(false);
  const [commitRespectRules, setCommitRespectRules] = useState(false);
  const [commitAccurateInfo, setCommitAccurateInfo] = useState(false);
  const [regError, setRegError] = useState("");

  const [registeredWorkshops, setRegisteredWorkshops] = useState<string[]>(
    () => {
      try {
        const raw = localStorage.getItem("vpr:workshop_registrations");
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  );

  const handleOpenWorkshopModal = (ws: WorkshopItem) => {
    playFolkPluck();
    setSelectedWorkshopForReg(ws);
    setRegError("");
    setCommitOnTime(false);
    setCommitRespectRules(false);
    setCommitAccurateInfo(false);
    try {
      const rawUser = localStorage.getItem("vpr:auth_user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed?.name && !regFullName) setRegFullName(parsed.name);
        if (parsed?.email && !regEmail) setRegEmail(parsed.email);
      }
    } catch {
      // ignore
    }
  };

  const handleSubmitWorkshopCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshopForReg) return;

    if (!regFullName.trim() || !regPhone.trim() || !regEmail.trim()) {
      setRegError(
        "Vui lòng điền đầy đủ họ tên, số điện thoại và email liên hệ."
      );
      return;
    }

    if (!commitOnTime || !commitRespectRules || !commitAccurateInfo) {
      setRegError(
        "Vui lòng đánh dấu xác nhận cả 3 điều khoản cam kết tham gia nghiêm túc trước khi hoàn tất đăng ký."
      );
      return;
    }

    submitWorkshopRegistration({
      workshopId: selectedWorkshopForReg.id,
      workshopTitle: selectedWorkshopForReg.title,
      workshopDate: selectedWorkshopForReg.specificDate,
      workshopTime: selectedWorkshopForReg.timeRange,
      workshopLocation: selectedWorkshopForReg.location,
      fullName: regFullName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      attendeeCount: regAttendeeCount,
      motivationNote: regMotivation.trim(),
      committedOnTime: commitOnTime,
      committedRespectRules: commitRespectRules,
      committedAccurateInfo: commitAccurateInfo,
    });

    const nextIds = Array.from(
      new Set([...registeredWorkshops, selectedWorkshopForReg.id])
    );
    setRegisteredWorkshops(nextIds);
    try {
      localStorage.setItem(
        "vpr:workshop_registrations",
        JSON.stringify(nextIds)
      );
    } catch {
      // ignore
    }

    playFolkPluck();
    onShowToast(
      `Đã ghi nhận cam kết & giữ chỗ Workshop "${selectedWorkshopForReg.title}" cho ${regFullName.trim()}!`
    );
    setSelectedWorkshopForReg(null);
    setRegMotivation("");
  };

  const handleCancelWorkshopReg = (ws: WorkshopItem) => {
    cancelWorkshopRegistrationByWorkshopId(ws.id);
    const nextIds = registeredWorkshops.filter((id) => id !== ws.id);
    setRegisteredWorkshops(nextIds);
    try {
      localStorage.setItem(
        "vpr:workshop_registrations",
        JSON.stringify(nextIds)
      );
    } catch {
      // ignore
    }
    onShowToast(`Đã huỷ đăng ký Workshop "${ws.title}".`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshops.map((ws) => {
          const isRegistered = registeredWorkshops.includes(ws.id);
          return (
            <article
              key={ws.id}
              className="p-4 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-indigo-500/40 shadow-xs flex flex-col justify-between gap-3 transition"
            >
              <div className="space-y-3">
                <HeritageVisualBanner
                  costumeId={ws.costumeId}
                  mauId={ws.mauId}
                  phuKienIds={ws.phuKienIds}
                  theme={ws.theme}
                  heightClass="h-44"
                  topLeftBadge={
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/85 text-white text-[11px] font-semibold backdrop-blur-xs">
                      {ws.specificDate}
                    </span>
                  }
                  topRightBadge={
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ws.feeType === "mien_phi"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 text-slate-950"
                      }`}
                    >
                      {ws.feeType === "mien_phi" ? "Miễn phí" : "Có thu phí"}
                    </span>
                  }
                  bottomBadge={
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-medium truncate">
                      ⏰ {ws.timeRange} · {ws.spotsLabel}
                    </span>
                  }
                />

                <div className="space-y-1.5">
                  <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--nen-toi)] m-0 leading-snug">
                    {ws.title}
                  </h2>

                  <div className="text-xs text-[var(--tro-tram)] space-y-1 pt-0.5">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[var(--nen-toi)]">
                          {ws.location}
                        </strong>{" "}
                        — {ws.addressDetail}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Hướng dẫn: {ws.host}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[11px] space-y-1 mt-1">
                      <div className="font-bold text-[var(--nen-toi)]">
                        Chi phí: {ws.feeLabel}
                      </div>
                      {ws.notes[0] && (
                        <div className="text-[var(--tro-tram)]">
                          Lưu ý: {ws.notes[0]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[var(--vien-the)] flex items-center gap-2">
                {!isRegistered ? (
                  <button
                    type="button"
                    onClick={() => handleOpenWorkshopModal(ws)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Điền thông tin & Cam kết đăng ký</span>
                  </button>
                ) : (
                  <div className="flex-1 flex items-center gap-1.5">
                    <span className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã cam kết giữ chỗ</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCancelWorkshopReg(ws)}
                      className="py-2 px-2.5 rounded-xl bg-rose-500/15 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-semibold transition cursor-pointer"
                      title="Huỷ đăng ký để nhường chỗ"
                    >
                      Huỷ
                    </button>
                  </div>
                )}

                {onOpenStudioWithCostume && (
                  <button
                    type="button"
                    onClick={() => {
                      playSilkRustleSound();
                      onOpenStudioWithCostume(
                        ws.costumeId,
                        ws.mauId,
                        ws.phuKienIds
                      );
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[var(--nen-the-phu)] hover:border-emerald-500 border border-[var(--vien-the)] text-xs font-semibold text-[var(--nen-toi)] transition cursor-pointer"
                  >
                    Phối thử
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* MODAL ĐIỀN THÔNG TIN & CAM KẾT ĐĂNG KÝ THAM GIA WORKSHOP */}
      <ModalShell
        isOpen={Boolean(selectedWorkshopForReg)}
        onClose={() => setSelectedWorkshopForReg(null)}
        title={selectedWorkshopForReg?.title || ""}
        maxWidthClass="max-w-xl"
        badge={
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Phiếu Đăng Ký & Cam Kết Tham Dự Workshop Di Sản</span>
          </span>
        }
      >
        {selectedWorkshopForReg && (
          <form onSubmit={handleSubmitWorkshopCommitment} className="space-y-4">
            {/* Khung thông tin cụ thể của buổi Workshop */}
            <div className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    <strong>Ngày tổ chức:</strong>{" "}
                    {selectedWorkshopForReg.specificDate}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Khung giờ:</strong>{" "}
                    {selectedWorkshopForReg.timeRange}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Địa điểm & Phòng học:</strong>{" "}
                  {selectedWorkshopForReg.location} (
                  {selectedWorkshopForReg.addressDetail})
                </span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-[var(--vien-the)]">
                <span>
                  <strong>Chi phí:</strong>{" "}
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    {selectedWorkshopForReg.feeLabel}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--nen-the)] border border-[var(--vien-the)] font-semibold">
                  {selectedWorkshopForReg.spotsLabel}
                </span>
              </div>

              {selectedWorkshopForReg.notes.length > 0 && (
                <div className="pt-1.5 border-t border-[var(--vien-the)] space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-300">
                    Lưu ý quan trọng khi tham gia:
                  </div>
                  <ul className="m-0 pl-4 space-y-0.5 text-[var(--tro-tram)]">
                    {selectedWorkshopForReg.notes.map((n, idx) => (
                      <li key={idx}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Thông tin cá nhân người đăng ký */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-[var(--nen-toi)]">
                1. Thông tin người đăng ký (Để BTC gửi mã xác nhận & chuẩn bị nguyên liệu):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Họ và tên đầy đủ của bạn *"
                  className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--nen-toi)]"
                />
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="Số điện thoại liên hệ xác nhận *"
                  className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--nen-toi)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Email nhận vé xác nhận *"
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--nen-toi)]"
                />
                <select
                  value={regAttendeeCount}
                  onChange={(e) => setRegAttendeeCount(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs font-semibold text-[var(--nen-toi)]"
                >
                  <option value={1}>Đăng ký 1 người</option>
                  <option value={2}>Đăng ký 2 người</option>
                </select>
              </div>

              <input
                type="text"
                value={regMotivation}
                onChange={(e) => setRegMotivation(e.target.value)}
                placeholder="Ghi chú thêm cho nghệ nhân (nếu có)..."
                className="w-full px-3 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs text-[var(--nen-toi)]"
              />
            </div>

            {/* 3 Cam kết bắt buộc */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[var(--nen-toi)]">
                2. Cam kết trách nhiệm của người tham dự (Bắt buộc):
              </div>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={commitOnTime}
                  onChange={(e) => setCommitOnTime(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-600 shrink-0"
                />
                <span>
                  Tôi <strong>cam kết có mặt đúng ngày giờ</strong> (
                  {selectedWorkshopForReg.specificDate},{" "}
                  {selectedWorkshopForReg.timeRange}). Nếu bận đột xuất, tôi sẽ báo huỷ trước ít nhất 24 giờ để nhường suất học và nguyên liệu cho người khác.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={commitRespectRules}
                  onChange={(e) => setCommitRespectRules(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-600 shrink-0"
                />
                <span>
                  Tôi <strong>cam kết tuân thủ hướng dẫn của nghệ nhân</strong>, giữ gìn dụng cụ thủ công (khung cửi, bút đồng sáp ong, khung thêu) và tôn trọng không gian văn hóa di sản.
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={commitAccurateInfo}
                  onChange={(e) => setCommitAccurateInfo(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-600 shrink-0"
                />
                <span>
                  Tôi xác nhận thông tin liên hệ trên là thật và đồng ý để Ban Tổ Chức liên hệ xác nhận suất tham dự.
                </span>
              </label>
            </div>

            {regError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--vien-the)]">
              <button
                type="button"
                onClick={() => setSelectedWorkshopForReg(null)}
                className="px-4 py-2 rounded-xl bg-[var(--nen-the-phu)] text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận Cam kết & Giữ chỗ</span>
              </button>
            </div>
          </form>
        )}
      </ModalShell>
    </>
  );
}
