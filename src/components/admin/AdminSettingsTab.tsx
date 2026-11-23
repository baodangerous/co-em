/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AdminSettingsTab — Cấu hình Vận hành Toàn dự án
 */

import React from "react";
import {
  saveProjectSettings,
  type ProjectSettings,
} from "../../lib/adminStore";

interface AdminSettingsTabProps {
  settings: ProjectSettings;
  onSettingsChange: (next: ProjectSettings) => void;
  onShowToast: (msg: string) => void;
}

export default function AdminSettingsTab({
  settings,
  onSettingsChange,
  onShowToast,
}: AdminSettingsTabProps) {
  return (
    <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-4">
      <h2 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
        Cấu Hình Vận Hành Toàn Dự Án
      </h2>

      <div className="space-y-3 max-w-2xl">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--chu-chinh)]">
            Tên hiển thị dự án:
          </label>
          <input
            type="text"
            value={settings.projectName}
            onChange={(e) =>
              onSettingsChange({ ...settings, projectName: e.target.value })
            }
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-sm text-[var(--chu-chinh)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--chu-chinh)]">
            Thông báo chung từ Ban Quản Trị (hiển thị tại Chợ Phiên & Workshop):
          </label>
          <input
            type="text"
            value={settings.announcementBanner}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                announcementBanner: e.target.value,
              })
            }
            placeholder="VD: Chào đón chuỗi Workshop Vẽ Sáp Ong & Thêu Cung Đình tháng 11..."
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-sm text-[var(--chu-chinh)]"
          />
        </div>

        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] cursor-pointer text-xs font-semibold">
          <input
            type="checkbox"
            checked={settings.allowWorkshopRegistration}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                allowWorkshopRegistration: e.target.checked,
              })
            }
            className="w-4 h-4 accent-emerald-600"
          />
          <span>Cho phép người dùng gửi Form cam kết đăng ký Workshop</span>
        </label>

        <button
          type="button"
          onClick={() => {
            saveProjectSettings(settings);
            onShowToast("Đã lưu cấu hình vận hành dự án!");
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold cursor-pointer"
        >
          Lưu cấu hình hệ thống
        </button>
      </div>
    </section>
  );
}
