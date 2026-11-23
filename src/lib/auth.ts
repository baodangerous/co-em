/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MODULE QUẢN LÝ XÁC THỰC TRÊN CLIENT (CLIENT AUTH SERVICE)
 * - Không lưu trữ hay kiểm tra bất kỳ mật khẩu cứng (hardcoded password) nào ở phía Client
 * - Mọi yêu cầu đăng nhập OTP và Quản trị viên (Admin) đều được xác thực qua máy chủ (/api/auth/*)
 */

import { useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: "admin" | "moderator" | "artisan" | "member";
  avatar?: string;
  created_at?: string;
}

const AUTH_TOKEN_KEY = "vpr:auth_token";
const AUTH_USER_KEY = "vpr:auth_user";
export const AUTH_CHANGE_EVENT = "vpr:auth-change";

export class AuthService {
  static getToken(): string | null {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  }

  static getUser(): AuthUser | null {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Xác thực Quản trị viên qua endpoint máy chủ /api/auth/admin-login
   * Không bao giờ kiểm tra mật khẩu ở phía Client
   */
  static async loginAdmin(
    accountInput: string,
    passwordInput: string
  ): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: accountInput.trim(),
          password: passwordInput,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.user || !data.token) {
        return {
          ok: false,
          error: data.error || "Thông tin xác thực Quản trị viên không chính xác.",
        };
      }

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: data.user }));
      }

      return { ok: true, user: data.user };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ xác thực";
      return { ok: false, error: msg };
    }
  }

  /**
   * Đổi Firebase ID Token (Google Sign-In) lấy Session Token xác thực trên máy chủ Express
   */
  static async loginWithFirebase(
    idToken: string
  ): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
    try {
      const res = await fetch("/api/auth/firebase-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok || !data.user || !data.token) {
        return { ok: false, error: data.error || "Không thể xác thực phiên Google với máy chủ." };
      }
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: data.user }));
      }
      return { ok: true, user: data.user };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ xác thực";
      return { ok: false, error: msg };
    }
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async sendOtp(email: string): Promise<{ ok: boolean; message: string; error?: string }> {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return {
          ok: false,
          message: "",
          error: data.error || "Không thể gửi mã OTP. Vui lòng thử lại.",
        };
      }
      return { ok: true, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      return { ok: false, message: "", error: msg };
    }
  }

  static async verifyOtp(
    email: string,
    code: string,
    name?: string
  ): Promise<{ ok: boolean; user?: AuthUser; message?: string; error?: string }> {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || "Mã OTP không chính xác hoặc đã hết hạn." };
      }

      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: data.user }));
      }

      return { ok: true, user: data.user, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      return { ok: false, error: msg };
    }
  }

  static async fetchMe(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    if (token.startsWith("fb-")) {
      return this.getUser();
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        this.logout();
        return null;
      }
      const data = await res.json();
      if (data.ok && data.user) {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
          window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: data.user }));
        }
        return data.user;
      }
    } catch {
      // Offline fallback
    }
    return this.getUser();
  }

  static logout(): void {
    const token = this.getToken();
    if (token && !token.startsWith("fb-")) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(AUTH_USER_KEY);
      window.localStorage.setItem("vpr:current_profile_id", "khach");
      window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }));
      window.dispatchEvent(
        new CustomEvent("vpr:profile-change", {
          detail: { id: "khach", tenHienThi: "Khách", laKhach: true, taoLuc: 0 },
        })
      );
    }
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => AuthService.getUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AuthService.fetchMe().then((me) => {
      setUser(me);
    });

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<AuthUser | null>;
      setUser(customEvent.detail);
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  return {
    user,
    isLoggedIn: Boolean(user),
    isLoading,
    setIsLoading,
    logout: () => AuthService.logout(),
  };
}
