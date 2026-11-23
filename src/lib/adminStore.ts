/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ADMIN & PROJECT MANAGEMENT DATA STORE (adminStore.ts)
 * - Phân quyền RBAC chặt chẽ (Admin / Moderator)
 * - Tự động ẩn giấu thông tin cá nhân nhạy cảm (PII Masking: SĐT, Email) nếu người gọi không phải Admin
 * - Khử độc và giới hạn độ dài chuỗi đầu vào trước khi lưu
 */

import {
  ADMIN_DATA_CHANGE_EVENT,
  emitAdminChange,
  isCurrentUserAdmin,
} from "./adminAuth";
import { trangPhuc as defaultTrangPhuc } from "../data/trangphuc";
import type { TrangPhuc } from "../types";
import {
  DEFAULT_CRAFT_VILLAGES,
  DEFAULT_SETTINGS,
  DEFAULT_USERS,
  DEFAULT_WORKSHOPS,
  type CraftTheme,
  type CraftVillageItem,
  type ManagedUserAccount,
  type ProjectSettings,
  type UserRole,
  type VillageOrderRecord,
  type WorkshopItem,
  type WorkshopRegistrationRecord,
} from "./admin/adminTypesAndSeeds";

export {
  DEFAULT_CRAFT_VILLAGES,
  DEFAULT_WORKSHOPS,
  type UserRole,
  type ManagedUserAccount,
  type CraftTheme,
  type CraftVillageItem,
  type WorkshopItem,
  type WorkshopRegistrationRecord,
  type VillageOrderRecord,
  type ProjectSettings,
};

const KEYS = {
  USERS: "vpr:admin:users_v1",
  VILLAGES: "vpr:admin:villages_v1",
  WORKSHOPS: "vpr:admin:workshops_v1",
  WS_REGISTRATIONS: "vpr:admin:ws_registrations_v1",
  VILLAGE_ORDERS: "vpr:admin:village_orders_v1",
  CUSTOM_COSTUMES: "vpr:admin:custom_costumes_v1",
  HIDDEN_COSTUMES: "vpr:admin:hidden_costumes_v1",
  SETTINGS: "vpr:admin:settings_v1",
};

export { ADMIN_DATA_CHANGE_EVENT, isCurrentUserAdmin };

function sanitizeInput(val: string, maxLen = 200): string {
  return String(val || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

function maskPhone(phone: string): string {
  const clean = String(phone || "").trim();
  if (clean.length <= 4) return "****";
  return `${clean.slice(0, 3)}****${clean.slice(-2)}`;
}

function maskEmail(email: string): string {
  const clean = String(email || "").trim();
  const [local, domain] = clean.split("@");
  if (!local || !domain) return "***@***";
  return `${local.slice(0, 2)}***@${domain}`;
}

export function getProjectSettings(): ProjectSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw), adminDemoUnlock: false };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveProjectSettings(next: Partial<ProjectSettings>): ProjectSettings {
  if (!isCurrentUserAdmin()) return getProjectSettings();
  const current = getProjectSettings();
  const updated = { ...current, ...next, adminDemoUnlock: false };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    emitAdminChange();
  }
  return updated;
}



export function getManagedUsers(): ManagedUserAccount[] {
  if (!isCurrentUserAdmin()) return [];
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = window.localStorage.getItem(KEYS.USERS);
    if (!raw) {
      window.localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveManagedUsers(users: ManagedUserAccount[]): void {
  if (!isCurrentUserAdmin()) return;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    emitAdminChange();
  }
}

// 2. QUẢN LÝ LÀNG NGHỀ & ĐƠN ĐẶT MAY (Tự động che giấu PII nếu không phải Admin)
export function getCraftVillages(includeInactive = false): CraftVillageItem[] {
  if (typeof window === "undefined") return DEFAULT_CRAFT_VILLAGES;
  try {
    const raw = window.localStorage.getItem(KEYS.VILLAGES);
    const list: CraftVillageItem[] = raw ? JSON.parse(raw) : DEFAULT_CRAFT_VILLAGES;
    const validList = Array.isArray(list) && list.length > 0 ? list : DEFAULT_CRAFT_VILLAGES;
    return includeInactive ? validList : validList.filter((v) => v.active !== false);
  } catch {
    return DEFAULT_CRAFT_VILLAGES;
  }
}

export function saveCraftVillages(villages: CraftVillageItem[]): void {
  if (!isCurrentUserAdmin()) return;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.VILLAGES, JSON.stringify(villages));
    emitAdminChange();
  }
}

export function getVillageOrders(): VillageOrderRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEYS.VILLAGE_ORDERS);
    const list: VillageOrderRecord[] = raw ? JSON.parse(raw) : [];
    if (isCurrentUserAdmin()) return list;
    return list.map((o) => ({
      ...o,
      customerPhone: maskPhone(o.customerPhone),
    }));
  } catch {
    return [];
  }
}

export function addVillageOrder(
  order: Omit<VillageOrderRecord, "id" | "status" | "createdAt">
): VillageOrderRecord {
  const rawList: VillageOrderRecord[] =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(KEYS.VILLAGE_ORDERS) || "[]")
      : [];
  const record: VillageOrderRecord = {
    villageId: sanitizeInput(order.villageId, 64),
    villageName: sanitizeInput(order.villageName, 120),
    costumeName: sanitizeInput(order.costumeName, 120),
    customerName: sanitizeInput(order.customerName, 80),
    customerPhone: sanitizeInput(order.customerPhone, 24),
    note: sanitizeInput(order.note, 400),
    id: `order_${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  const next = [record, ...rawList];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.VILLAGE_ORDERS, JSON.stringify(next));
    emitAdminChange();
  }
  return record;
}

export function updateVillageOrderStatus(
  id: string,
  status: VillageOrderRecord["status"]
): void {
  if (!isCurrentUserAdmin()) return;
  const current = getVillageOrders();
  const next = current.map((o) => (o.id === id ? { ...o, status } : o));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.VILLAGE_ORDERS, JSON.stringify(next));
    emitAdminChange();
  }
}

// 3. QUẢN LÝ WORKSHOP & ĐƠN ĐĂNG KÝ CAM KẾT (Bảo vệ PII người đăng ký)
export function getWorkshops(includeInactive = false): WorkshopItem[] {
  if (typeof window === "undefined") return DEFAULT_WORKSHOPS;
  try {
    const raw = window.localStorage.getItem(KEYS.WORKSHOPS);
    const list: WorkshopItem[] = raw ? JSON.parse(raw) : DEFAULT_WORKSHOPS;
    const validList = Array.isArray(list) && list.length > 0 ? list : DEFAULT_WORKSHOPS;
    return includeInactive ? validList : validList.filter((w) => w.active !== false);
  } catch {
    return DEFAULT_WORKSHOPS;
  }
}

export function saveWorkshops(workshops: WorkshopItem[]): void {
  if (!isCurrentUserAdmin()) return;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.WORKSHOPS, JSON.stringify(workshops));
    emitAdminChange();
  }
}

export function getWorkshopRegistrations(): WorkshopRegistrationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEYS.WS_REGISTRATIONS);
    const list: WorkshopRegistrationRecord[] = raw ? JSON.parse(raw) : [];
    if (isCurrentUserAdmin()) return list;
    return list.map((r) => ({
      ...r,
      phone: maskPhone(r.phone),
      email: maskEmail(r.email),
    }));
  } catch {
    return [];
  }
}

export function submitWorkshopRegistration(
  payload: Omit<WorkshopRegistrationRecord, "id" | "status" | "createdAt">
): WorkshopRegistrationRecord {
  const rawList: WorkshopRegistrationRecord[] =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(KEYS.WS_REGISTRATIONS) || "[]")
      : [];
  const record: WorkshopRegistrationRecord = {
    ...payload,
    fullName: sanitizeInput(payload.fullName, 80),
    phone: sanitizeInput(payload.phone, 24),
    email: sanitizeInput(payload.email, 120),
    motivationNote: sanitizeInput(payload.motivationNote, 500),
    attendeeCount: Math.max(1, Math.min(5, Number(payload.attendeeCount) || 1)),
    id: `wsreg_${Date.now()}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  const next = [record, ...rawList];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.WS_REGISTRATIONS, JSON.stringify(next));
    emitAdminChange();
  }
  return record;
}

export function updateWorkshopRegistrationStatus(
  id: string,
  status: WorkshopRegistrationRecord["status"]
): void {
  if (!isCurrentUserAdmin()) return;
  const current = getWorkshopRegistrations();
  const next = current.map((r) => (r.id === id ? { ...r, status } : r));
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.WS_REGISTRATIONS, JSON.stringify(next));
    emitAdminChange();
  }
}

export function cancelWorkshopRegistrationByWorkshopId(workshopId: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEYS.WS_REGISTRATIONS);
    const current: WorkshopRegistrationRecord[] = raw ? JSON.parse(raw) : [];
    const next = current.filter((r) => r.workshopId !== workshopId);
    window.localStorage.setItem(KEYS.WS_REGISTRATIONS, JSON.stringify(next));
    emitAdminChange();
  } catch {
    // Ignore
  }
}

// 4. QUẢN LÝ TRANG PHỤC
export function getCustomCostumes(): TrangPhuc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEYS.CUSTOM_COSTUMES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomCostume(costume: TrangPhuc): void {
  if (!isCurrentUserAdmin()) return;
  const current = getCustomCostumes();
  const existsIdx = current.findIndex((c) => c.id === costume.id);
  const next =
    existsIdx >= 0
      ? current.map((c, i) => (i === existsIdx ? costume : c))
      : [costume, ...current];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.CUSTOM_COSTUMES, JSON.stringify(next));
    emitAdminChange();
  }
}

export function getHiddenCostumeIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEYS.HIDDEN_COSTUMES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleCostumeVisibility(costumeId: string): boolean {
  if (!isCurrentUserAdmin()) return false;
  const hidden = getHiddenCostumeIds();
  const isCurrentlyHidden = hidden.includes(costumeId);
  const next = isCurrentlyHidden
    ? hidden.filter((id) => id !== costumeId)
    : [...hidden, costumeId];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEYS.HIDDEN_COSTUMES, JSON.stringify(next));
    emitAdminChange();
  }
  return !isCurrentlyHidden;
}

export function getAllManagedCostumes(includeHidden = false): TrangPhuc[] {
  const customList = getCustomCostumes();
  const hiddenIds = new Set(getHiddenCostumeIds());
  const customMap = new Map(customList.map((c) => [c.id, c]));

  const merged: TrangPhuc[] = defaultTrangPhuc.map(
    (tp) => customMap.get(tp.id) || tp
  );
  for (const c of customList) {
    if (!defaultTrangPhuc.some((tp) => tp.id === c.id)) {
      merged.unshift(c);
    }
  }

  return includeHidden ? merged : merged.filter((tp) => !hiddenIds.has(tp.id));
}
