/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SERVICE: LƯU TRỮ VÀ QUẢN LÝ HỒ SƠ NHÂN VẬT (CHARACTER STORAGE SERVICE)
 * Hỗ trợ đồng bộ đa tầng: Bộ nhớ cục bộ (localStorage) và Máy chủ CSDL an toàn (/api/character)
 */

import { CharacterModel } from "../models/CharacterModel";
import { NhanVatConfig } from "../types";
import { layKhoaTheoHoSo } from "../../lib/hoSo";
import { AuthService } from "../../lib/auth";

export class CharacterStorageService {
  private static readonly STORAGE_KEY_PREFIX = "nhan_vat";

  /**
   * Tải cấu hình nhân vật từ bộ nhớ ứng dụng
   */
  static loadCharacter(initial?: NhanVatConfig): CharacterModel {
    if (initial) {
      return CharacterModel.fromConfig(initial);
    }

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const key = layKhoaTheoHoSo(this.STORAGE_KEY_PREFIX);
        const stored = window.localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          return CharacterModel.fromConfig(parsed);
        }
      }
    } catch (err) {
      console.warn("Không thể tải hồ sơ nhân vật từ localStorage:", err);
    }

    return CharacterModel.createDefault();
  }

  /**
   * Áp dụng cấu hình nhân vật nhận từ đồng bộ máy chủ/Cloud mà không gọi ngược lại API
   */
  static applySyncedCharacter(character: NhanVatConfig): NhanVatConfig {
    const model = CharacterModel.fromConfig(character);
    const normalized = model.toConfig();
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const key = layKhoaTheoHoSo(this.STORAGE_KEY_PREFIX);
        window.localStorage.setItem(key, JSON.stringify(normalized));
        window.dispatchEvent(new CustomEvent("vpr:character-sync", { detail: normalized }));
      }
    } catch {
      // ignore
    }
    return normalized;
  }

  /**
   * Lưu cấu hình nhân vật an toàn (đồng bộ cả LocalStorage và Backend CSDL / Firestore)
   */
  static saveCharacter(character: CharacterModel | NhanVatConfig): void {
    const config = character instanceof CharacterModel ? character.toConfig() : character;

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const key = layKhoaTheoHoSo(this.STORAGE_KEY_PREFIX);
        window.localStorage.setItem(key, JSON.stringify(config));
      }
    } catch (err) {
      console.warn("Không thể lưu hồ sơ nhân vật vào localStorage:", err);
    }

    const token = AuthService.getToken();
    if (!token) return;
    if (token.startsWith("fb-")) {
      import("../../lib/dataSync")
        .then((m) => m.pushCharacterToCloud(config))
        .catch(() => {});
      return;
    }

    // Đồng bộ nền tới máy chủ CSDL (không chặn UI)
    try {
      if (typeof window !== "undefined" && typeof fetch === "function") {
        fetch("/api/character", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...AuthService.getAuthHeaders(),
          },
          body: JSON.stringify({
            id: "default",
            name: AuthService.getUser()?.name || "Người mẫu Việt Phục",
            gioi: config.gioi,
            tuoi: config.tuoi,
            vocDang: config.vocDang,
            tongDa: config.tongDa,
            toc: config.toc,
            huongNhin: config.huongNhin,
          }),
        }).catch(() => {
          // Bỏ qua lỗi mạng nếu offline
        });
      }
    } catch {
      // Offline safe
    }
  }
}
