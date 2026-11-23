/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared Synchronization & Notification Hooks (useAppSync.ts)
 * Tập trung hóa việc lắng nghe sự kiện đồng bộ dữ liệu toàn ứng dụng (Admin Store, Sổ Thông Hành, Toast)
 * giúp các màn hình không phải lặp lại boilerplate useEffect + window.addEventListener.
 */

import { useState, useEffect, useCallback } from "react";
import {
  getAllManagedCostumes,
  getHiddenCostumeIds,
  getProjectSettings,
  getManagedUsers,
  getCraftVillages,
  getVillageOrders,
  getWorkshops,
  getWorkshopRegistrations,
  ADMIN_DATA_CHANGE_EVENT,
  type ProjectSettings,
  type ManagedUserAccount,
  type CraftVillageItem,
  type VillageOrderRecord,
  type WorkshopItem,
  type WorkshopRegistrationRecord,
} from "../lib/adminStore";
import {
  docDanhSachChoPhien,
  type BaiDangChoPhien,
} from "../lib/choPhien";
import {
  docSoThongHanh,
  PASSPORT_CHANGE_EVENT,
  type CulturalPassportData,
} from "../data/le_hoi_di_san";
import type { TrangPhuc } from "../types";

/**
 * Hook quản lý thông báo nhanh (Toast) tự động tắt sau timeout
 */
export function useToastNotification(durationMs = 3200) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      setToastMsg(msg);
      window.setTimeout(() => {
        setToastMsg((prev) => (prev === msg ? null : prev));
      }, durationMs);
    },
    [durationMs]
  );

  const clearToast = useCallback(() => setToastMsg(null), []);

  return { toastMsg, showToast, clearToast };
}

/**
 * Hook tự động đồng bộ danh sách trang phục từ Admin Store
 */
export function useManagedCostumes(includeHidden = false) {
  const [costumes, setCostumes] = useState<TrangPhuc[]>(() =>
    getAllManagedCostumes(includeHidden)
  );
  const [hiddenCostumeIds, setHiddenCostumeIds] = useState<string[]>(() =>
    getHiddenCostumeIds()
  );

  const reloadCostumes = useCallback(() => {
    setCostumes(getAllManagedCostumes(includeHidden));
    setHiddenCostumeIds(getHiddenCostumeIds());
  }, [includeHidden]);

  useEffect(() => {
    window.addEventListener(ADMIN_DATA_CHANGE_EVENT, reloadCostumes);
    return () =>
      window.removeEventListener(ADMIN_DATA_CHANGE_EVENT, reloadCostumes);
  }, [reloadCostumes]);

  return { costumes, hiddenCostumeIds, reloadCostumes };
}

/**
 * Hook tự động đồng bộ Sổ Thông Hành Di Sản 54 Dân Tộc
 */
export function useCulturalPassport() {
  const [passportData, setPassportData] = useState<CulturalPassportData>(() =>
    docSoThongHanh()
  );

  useEffect(() => {
    const syncPassport = () => setPassportData(docSoThongHanh());
    window.addEventListener(PASSPORT_CHANGE_EVENT, syncPassport);
    return () => window.removeEventListener(PASSPORT_CHANGE_EVENT, syncPassport);
  }, []);

  const stampedCount = Object.keys(passportData.stamps).length;

  return { passportData, setPassportData, stampedCount };
}

/**
 * Hook tự động đồng bộ toàn bộ dữ liệu Quản trị dự án & Chợ Phiên
 */
export function useAdminStoreData(includeHidden = true) {
  const [settings, setSettings] = useState<ProjectSettings>(() =>
    getProjectSettings()
  );
  const [users, setUsers] = useState<ManagedUserAccount[]>(() =>
    getManagedUsers()
  );
  const [posts, setPosts] = useState<BaiDangChoPhien[]>(() =>
    docDanhSachChoPhien()
  );
  const [costumes, setCostumes] = useState<TrangPhuc[]>(() =>
    getAllManagedCostumes(includeHidden)
  );
  const [hiddenCostumeIds, setHiddenCostumeIds] = useState<string[]>(() =>
    getHiddenCostumeIds()
  );
  const [villages, setVillages] = useState<CraftVillageItem[]>(() =>
    getCraftVillages(includeHidden)
  );
  const [villageOrders, setVillageOrders] = useState<VillageOrderRecord[]>(() =>
    getVillageOrders()
  );
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(() =>
    getWorkshops(includeHidden)
  );
  const [wsRegistrations, setWsRegistrations] = useState<
    WorkshopRegistrationRecord[]
  >(() => getWorkshopRegistrations());

  const reloadAll = useCallback(() => {
    setSettings(getProjectSettings());
    setUsers(getManagedUsers());
    setPosts(docDanhSachChoPhien());
    setCostumes(getAllManagedCostumes(includeHidden));
    setHiddenCostumeIds(getHiddenCostumeIds());
    setVillages(getCraftVillages(includeHidden));
    setVillageOrders(getVillageOrders());
    setWorkshops(getWorkshops(includeHidden));
    setWsRegistrations(getWorkshopRegistrations());
  }, [includeHidden]);

  useEffect(() => {
    window.addEventListener(ADMIN_DATA_CHANGE_EVENT, reloadAll);
    return () => window.removeEventListener(ADMIN_DATA_CHANGE_EVENT, reloadAll);
  }, [reloadAll]);

  return {
    settings,
    setSettings,
    users,
    setUsers,
    posts,
    setPosts,
    costumes,
    hiddenCostumeIds,
    villages,
    setVillages,
    villageOrders,
    workshops,
    setWorkshops,
    wsRegistrations,
    reloadAll,
  };
}
