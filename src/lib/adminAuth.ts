/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Module kiểm tra quyền Quản trị & phát sự kiện cập nhật nhẹ.
 * Chỉ tin cậy role được máy chủ cấp qua phiên đăng nhập (/api/auth/*).
 */

import { AuthService } from "./auth";

export const ADMIN_DATA_CHANGE_EVENT = "vpr:admin-data-change";

export function emitAdminChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ADMIN_DATA_CHANGE_EVENT));
  }
}

export function isCurrentUserAdmin(): boolean {
  const authUser = AuthService.getUser();
  const token = AuthService.getToken();
  if (!authUser || !token || token.startsWith("fb-")) return false;

  return authUser.role === "admin" || authUser.role === "moderator";
}
