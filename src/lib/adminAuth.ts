/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Module kiểm tra quyền Quản trị & phát sự kiện cập nhật nhẹ (không kéo theo dataset trang phục).
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
  if (!authUser || !token) return false;

  if (authUser.role === "admin" || authUser.role === "moderator") {
    return true;
  }

  if (authUser.email) {
    const emailNorm = authUser.email.trim().toLowerCase();
    if (
      emailNorm === "admin@vietphucremix.vn" ||
      emailNorm === "quanly@vietphucremix.vn" ||
      emailNorm === "thumodzit@gmail.com"
    ) {
      return true;
    }
  }
  return false;
}
