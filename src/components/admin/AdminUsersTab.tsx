/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AdminUsersTab — Quản lý Tài khoản & Phân quyền Hệ thống (RBAC)
 */

import React, { useState } from "react";
import {
  saveManagedUsers,
  type ManagedUserAccount,
  type UserRole,
} from "../../lib/adminStore";

interface AdminUsersTabProps {
  users: ManagedUserAccount[];
  onReload: () => void;
  onShowToast: (msg: string) => void;
}

export default function AdminUsersTab({
  users,
  onReload,
  onShowToast,
}: AdminUsersTabProps) {
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("moderator");

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newUser: ManagedUserAccount = {
      id: `usr_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    saveManagedUsers([newUser, ...users]);
    onReload();
    setNewUserName("");
    setNewUserEmail("");
    onShowToast(`Đã cấp quyền cho tài khoản ${newUser.email}!`);
  };

  return (
    <section className="p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-4">
      <div className="pb-3 border-b border-[var(--vien-the)]">
        <h2 className="font-serif text-lg font-bold text-[var(--chu-chinh)] m-0">
          Quản Lý Tài Khoản & Phân Quyền Hệ Thống (RBAC)
        </h2>
        <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
          Phân quyền cho Quản trị viên (Admin), Kiểm duyệt viên (Moderator), Nghệ nhân Làng nghề và Thành viên
        </p>
      </div>

      {/* Form cấp quyền nhanh */}
      <form
        onSubmit={handleAddUser}
        className="p-4 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] grid grid-cols-1 sm:grid-cols-4 gap-2.5"
      >
        <input
          type="text"
          required
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Họ tên thành viên / Nghệ nhân..."
          className="px-3 py-2 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] text-xs text-[var(--chu-chinh)]"
        />
        <input
          type="email"
          required
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="Email tài khoản (VD: ten@gmail.com)..."
          className="px-3 py-2 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] text-xs text-[var(--chu-chinh)]"
        />
        <select
          value={newUserRole}
          onChange={(e) => setNewUserRole(e.target.value as UserRole)}
          className="px-3 py-2 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] text-xs font-semibold text-[var(--chu-chinh)]"
        >
          <option value="admin">Quản trị viên (Admin)</option>
          <option value="moderator">Kiểm duyệt viên (Moderator)</option>
          <option value="artisan">Nghệ nhân Làng nghề</option>
          <option value="member">Thành viên</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold cursor-pointer"
        >
          + Thêm & Cấp Quyền
        </button>
      </form>

      {/* Danh sách tài khoản */}
      <div className="space-y-2.5">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[var(--chu-chinh)]">
                  {u.name}
                </span>
                <span className="text-xs text-[var(--chu-phu)]">
                  ({u.email})
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    u.status === "active"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-500/15 text-rose-600"
                  }`}
                >
                  {u.status === "active" ? "Đang hoạt động" : "Đã khóa"}
                </span>
              </div>
              {u.note && (
                <div className="text-xs text-[var(--chu-phu)] mt-0.5">
                  {u.note}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={u.role}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  const next = users.map((item) =>
                    item.id === u.id ? { ...item, role } : item
                  );
                  saveManagedUsers(next);
                  onShowToast(`Đã đổi quyền của ${u.name}!`);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-xs font-semibold text-[var(--chu-chinh)]"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Kiểm duyệt viên</option>
                <option value="artisan">Nghệ nhân</option>
                <option value="member">Thành viên</option>
              </select>

              {u.email !== "thumodzit@gmail.com" && (
                <button
                  type="button"
                  onClick={() => {
                    const next = users.map((item) =>
                      item.id === u.id
                        ? {
                            ...item,
                            status:
                              item.status === "active"
                                ? ("suspended" as const)
                                : ("active" as const),
                          }
                        : item
                    );
                    saveManagedUsers(next);
                    onShowToast("Đã cập nhật trạng thái tài khoản.");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-xs font-semibold cursor-pointer"
                >
                  {u.status === "active" ? "Khóa" : "Mở khóa"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
