/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AdminScreen — Trung Tâm Quản Trị Dự Án & Phân Quyền Hệ Thống (Tách riêng tại Sidebar)
 * Được cấu trúc module hóa thành 6 phân hệ component độc lập trong `src/components/admin/*`:
 * 1. AdminPostsTab: Duyệt bài đăng Chợ Phiên Cộng Đồng & Gắn nhãn văn hóa
 * 2. AdminWorkshopsTab: Quản lý Workshop & Duyệt đơn đăng ký cam kết của học viên
 * 3. AdminVillagesTab: Quản lý Làng nghề, Nghệ nhân & Đơn liên hệ đặt may
 * 4. AdminCostumesTab: Quản lý Trang phục (Thêm mới, ẩn/hiện, kiểm chứng)
 * 5. AdminUsersTab: Quản lý Tài khoản & Phân quyền (Admin, Kiểm duyệt viên, Nghệ nhân, Thành viên)
 * 6. AdminSettingsTab: Tổng quan & Cấu hình dự án
 */

import React, { useState } from "react";
import { AuthService } from "../lib/auth";
import { isCurrentUserAdmin } from "../lib/adminStore";
import { playFolkPluck } from "../lib/audio";
import { useAdminStoreData, useToastNotification } from "../hooks/useAppSync";
import { ToastBanner } from "../components/common/SharedUI";
import AdminPostsTab from "../components/admin/AdminPostsTab";
import AdminWorkshopsTab from "../components/admin/AdminWorkshopsTab";
import AdminVillagesTab from "../components/admin/AdminVillagesTab";
import AdminCostumesTab from "../components/admin/AdminCostumesTab";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminSettingsTab from "../components/admin/AdminSettingsTab";
import {
  ShieldCheck,
  Users,
  FileCheck2,
  Shirt,
  Store,
  Calendar,
  Settings,
  KeyRound,
  LogOut,
  Lock,
} from "lucide-react";

type AdminTab =
  | "tong_quan"
  | "duyet_bai"
  | "trang_phuc"
  | "lang_nghe"
  | "workshop"
  | "tai_khoan";

interface AdminScreenProps {
  onOpenCostumeDetail?: (trangPhucId: string) => void;
  onOpenChoPhien?: () => void;
}

export default function AdminScreen({
  onOpenCostumeDetail,
}: AdminScreenProps = {}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("duyet_bai");
  const [adminAccount, setAdminAccount] = useState("admin@vietphucremix.vn");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { toastMsg, showToast, clearToast } = useToastNotification();
  const {
    settings,
    setSettings,
    users,
    posts,
    setPosts,
    costumes,
    hiddenCostumeIds,
    villages,
    villageOrders,
    workshops,
    wsRegistrations,
    reloadAll,
  } = useAdminStoreData(true);

  const currentAuthUser = AuthService.getUser();
  const isAdminAuthenticated = isCurrentUserAdmin();

  const handleDirectAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await AuthService.loginAdmin(adminAccount, adminPassword);
    if (!res.ok) {
      setLoginError(res.error || "Thông tin đăng nhập Quản trị viên không hợp lệ.");
      return;
    }
    reloadAll();
    showToast("Đăng nhập tài khoản Quản trị viên thành công!");
  };

  if (!isAdminAuthenticated) {
    return (
      <main className="min-h-screen bg-[var(--nen-bright)] text-[var(--chu-chinh)] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase">
                Khu Vực Hạn Chế
              </span>
              <h1 className="font-serif text-xl font-bold text-[var(--chu-chinh)] m-0 mt-0.5">
                Cổng Đăng Nhập Quản Trị Viên
              </h1>
            </div>
          </div>

          <p className="text-xs text-[var(--chu-phu)] m-0 leading-relaxed">
            Khu vực Quản trị Dự án chỉ dành riêng cho tài khoản Quản trị viên (Admin), không hiển thị cho người dùng thông thường. Vui lòng đăng nhập tài khoản Admin để tiếp tục.
          </p>

          <form onSubmit={handleDirectAdminLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--chu-chinh)] mb-1">
                Tài khoản Quản trị:
              </label>
              <input
                type="text"
                value={adminAccount}
                onChange={(e) => setAdminAccount(e.target.value)}
                placeholder="admin@vietphucremix.vn"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs sm:text-sm text-[var(--chu-chinh)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--chu-chinh)] mb-1">
                Mật khẩu Quản trị:
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Nhập mật khẩu (VD: admin2026)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-xs sm:text-sm text-[var(--chu-chinh)]"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 text-[11px]">
              <div>
                <div>TK: <strong>admin@vietphucremix.vn</strong></div>
                <div>MK: <strong>admin2026</strong></div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAdminAccount("admin@vietphucremix.vn");
                  setAdminPassword("admin2026");
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold cursor-pointer"
              >
                Điền nhanh
              </button>
            </div>

            {loginError && (
              <div className="p-2.5 rounded-xl bg-rose-500/12 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs sm:text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>Đăng Nhập Tài Khoản Admin</span>
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--nen-bright)] text-[var(--chu-chinh)] pb-14 font-sans">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* 1. HEADER QUẢN TRỊ DỰ ÁN */}
        <header className="relative overflow-hidden flex flex-col gap-3.5 p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-500 to-indigo-600" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                    Tài Khoản Quản Trị Viên (Admin)
                  </span>
                  <span className="text-xs text-[var(--chu-phu)]">
                    {currentAuthUser?.email || "admin@vietphucremix.vn"}
                  </span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[var(--chu-chinh)] m-0 mt-0.5">
                  Trung Tâm Quản Trị Dự Án Việt Phục Remix
                </h1>
                <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
                  Quản lý tài khoản phân quyền, duyệt bài cộng đồng, danh mục trang phục, làng nghề và đơn đăng ký cam kết Workshop
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => AuthService.logout()}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/12 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-semibold transition cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất Admin</span>
            </button>
          </div>

          {/* 6 TAB ĐIỀU KHIỂN QUẢN TRỊ */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--vien-the)]">
            {(
              [
                ["duyet_bai", "Duyệt Bài", FileCheck2],
                ["workshop", "Workshop & Đơn Cam Kết", Calendar],
                ["lang_nghe", "Làng Nghề & Đặt May", Store],
                ["trang_phuc", "Trang Phục", Shirt],
                ["tai_khoan", "Tài Khoản & Quyền", Users],
                ["tong_quan", "Cấu Hình Dự Án", Settings],
              ] as const
            ).map(([id, label, IconComp]) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    playFolkPluck();
                    setActiveTab(id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs"
                      : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)]"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* THÔNG BÁO THAO TÁC QUẢN TRỊ */}
        <ToastBanner message={toastMsg} onClose={clearToast} />

        {/* CÁC PHÂN HỆ MODULE QUẢN TRỊ */}
        {activeTab === "duyet_bai" && (
          <AdminPostsTab
            posts={posts}
            onPostsChange={setPosts}
            onShowToast={showToast}
            onOpenCostumeDetail={onOpenCostumeDetail}
          />
        )}

        {activeTab === "workshop" && (
          <AdminWorkshopsTab
            workshops={workshops}
            wsRegistrations={wsRegistrations}
            onReload={reloadAll}
            onShowToast={showToast}
          />
        )}

        {activeTab === "lang_nghe" && (
          <AdminVillagesTab
            villages={villages}
            villageOrders={villageOrders}
            onReload={reloadAll}
            onShowToast={showToast}
          />
        )}

        {activeTab === "trang_phuc" && (
          <AdminCostumesTab
            costumes={costumes}
            hiddenCostumeIds={hiddenCostumeIds}
            onReload={reloadAll}
            onShowToast={showToast}
            onOpenCostumeDetail={onOpenCostumeDetail}
          />
        )}

        {activeTab === "tai_khoan" && (
          <AdminUsersTab
            users={users}
            onReload={reloadAll}
            onShowToast={showToast}
          />
        )}

        {activeTab === "tong_quan" && (
          <AdminSettingsTab
            settings={settings}
            onSettingsChange={setSettings}
            onShowToast={showToast}
          />
        )}
      </div>
    </main>
  );
}
