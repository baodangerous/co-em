/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Bộ điều phối đồng bộ dữ liệu đa chiều (localStorage ↔ Express SQLite ↔ Cloud Firestore).
 * Nạp Firebase SDK hoàn toàn theo cơ chế động (lazy) để không làm nặng trang khởi đầu.
 */

import { AuthService } from "./auth";
import type { NhanVatConfig, VocDang, TongDa } from "./avatar";

const VALID_VOC_DANG = new Set<string>([
  "chu_nhat",
  "qua_le",
  "dong_ho_cat",
  "tam_giac_nguoc",
  "qua_tao",
  "manh",
  "trung_binh",
  "day_dan",
  "dam_nguoi",
]);

function normalizeVocDang(val: unknown, fallback: VocDang): VocDang {
  return typeof val === "string" && VALID_VOC_DANG.has(val) ? (val as VocDang) : fallback;
}

function normalizeTongDa(val: unknown, fallback: TongDa): TongDa {
  return typeof val === "number" && Number.isInteger(val) && val >= 1 && val <= 6
    ? (val as TongDa)
    : fallback;
}
import {
  docDanhSachGuiKyUc,
  capNhatDanhSachGuiKyUcTuSync,
  MAX_OUTFITS,
  SAMPLE_OUTFIT,
  type OutfitSaved,
} from "./guiKyUc";
import { CharacterStorageService } from "../characters/services/CharacterStorageService";

let inFlightSync: Promise<void> | null = null;

function mapServerOutfitToLocal(rec: Record<string, unknown>): OutfitSaved | null {
  const id = typeof rec.id === "string" ? rec.id : "";
  const tpId =
    typeof rec.trang_phuc_id === "string"
      ? rec.trang_phuc_id
      : typeof rec.trangPhucId === "string"
      ? rec.trangPhucId
      : "";
  if (!id || !tpId) return null;

  const createdRaw =
    typeof rec.created_at === "string"
      ? Date.parse(rec.created_at)
      : typeof rec.taoLuc === "number"
      ? rec.taoLuc
      : Date.now();

  return {
    id,
    trangPhucId: tpId,
    mauId:
      (typeof rec.mau_hex === "string" && rec.mau_hex) ||
      (typeof rec.mauId === "string" && rec.mauId) ||
      "m_do",
    phuKienIds: Array.isArray(rec.phu_kien_ids)
      ? rec.phu_kien_ids.filter((x): x is string => typeof x === "string")
      : Array.isArray(rec.phuKienIds)
      ? rec.phuKienIds.filter((x): x is string => typeof x === "string")
      : [],
    caption:
      (typeof rec.title === "string" && rec.title) ||
      (typeof rec.caption === "string" && rec.caption) ||
      "",
    taoLuc: Number.isFinite(createdRaw) ? createdRaw : Date.now(),
    nhanVatConfig:
      rec.nhan_vat_config &&
      typeof rec.nhan_vat_config === "object" &&
      Object.keys(rec.nhan_vat_config as object).length > 0
        ? (rec.nhan_vat_config as NhanVatConfig)
        : rec.nhanVatConfig && typeof rec.nhanVatConfig === "object"
        ? (rec.nhanVatConfig as NhanVatConfig)
        : undefined,
    cauLyDoRemix:
      (typeof rec.notes === "string" && rec.notes) ||
      (typeof rec.cauLyDoRemix === "string" && rec.cauLyDoRemix) ||
      undefined,
  };
}

function mergeOutfits(local: OutfitSaved[], remote: OutfitSaved[]): OutfitSaved[] {
  const realRemote = remote.filter((o) => o.id !== SAMPLE_OUTFIT.id);
  const map = new Map<string, OutfitSaved>();

  for (const r of remote) {
    map.set(r.id, r);
  }
  for (const l of local) {
    // Nếu máy chủ đã có bộ phối thật của người dùng và local chỉ có mẫu mặc định, ưu tiên dữ liệu máy chủ
    if (l.id === SAMPLE_OUTFIT.id && realRemote.length > 0) {
      continue;
    }
    const existing = map.get(l.id);
    if (!existing || (l.taoLuc || 0) > (existing.taoLuc || 0)) {
      map.set(l.id, l);
    }
  }

  return Array.from(map.values())
    .sort((a, b) => (b.taoLuc || 0) - (a.taoLuc || 0))
    .slice(0, MAX_OUTFITS);
}

export async function pushCharacterToCloud(config: NhanVatConfig): Promise<void> {
  const token = AuthService.getToken();
  const user = AuthService.getUser();
  if (!token || !user?.id || !token.startsWith("fb-")) return;

  try {
    const { auth, saveUserCharacterToFirestore } = await import("./firebase");
    if (!auth.currentUser || auth.currentUser.uid !== user.id) return;
    await saveUserCharacterToFirestore(user.id, {
      gioi: config.gioi,
      tuoi: config.tuoi,
      vocDang: config.vocDang,
      tongDa: config.tongDa,
      toc: config.toc,
      huongNhin: config.huongNhin,
    });
  } catch {
    // Offline or auth not active yet
  }
}

export async function pushOutfitToCloud(outfit: OutfitSaved): Promise<void> {
  const token = AuthService.getToken();
  const user = AuthService.getUser();
  if (!token || !user?.id || !token.startsWith("fb-")) return;

  try {
    const { auth, saveUserOutfitToFirestore } = await import("./firebase");
    if (!auth.currentUser || auth.currentUser.uid !== user.id) return;
    await saveUserOutfitToFirestore(user.id, outfit.id, {
      id: outfit.id,
      trangPhucId: outfit.trangPhucId,
      mauId: outfit.mauId,
      phuKienIds: outfit.phuKienIds || [],
      caption: (outfit.caption || "").slice(0, 140),
      taoLuc: outfit.taoLuc || Date.now(),
      notes: (outfit.cauLyDoRemix || "").slice(0, 500),
    });
  } catch {
    // Ignore transient errors
  }
}

export async function deleteOutfitFromCloud(outfitId: string): Promise<void> {
  const token = AuthService.getToken();
  const user = AuthService.getUser();
  if (!token || !user?.id || !token.startsWith("fb-")) return;

  try {
    const { auth, deleteUserOutfitFromFirestore } = await import("./firebase");
    if (!auth.currentUser || auth.currentUser.uid !== user.id) return;
    await deleteUserOutfitFromFirestore(user.id, outfitId);
  } catch {
    // Ignore
  }
}

async function syncWithExpressServer(token: string): Promise<void> {
  try {
    const res = await fetch("/api/sync", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    if (!data?.ok || !data.authenticated) return;

    const localChar = CharacterStorageService.loadCharacter().toConfig();
    const remoteChar = data.character as Partial<NhanVatConfig> | null;

    if (remoteChar && remoteChar.gioi && remoteChar.vocDang) {
      CharacterStorageService.applySyncedCharacter({
        gioi: remoteChar.gioi === "nam" ? "nam" : "nu",
        tuoi:
          remoteChar.tuoi === "tre_em" || remoteChar.tuoi === "nguoi_cao_tuoi"
            ? remoteChar.tuoi
            : "nguoi_lon",
        vocDang: normalizeVocDang(remoteChar.vocDang, localChar.vocDang),
        tongDa: normalizeTongDa(remoteChar.tongDa, localChar.tongDa),
        toc: typeof remoteChar.toc === "string" ? remoteChar.toc : localChar.toc,
        huongNhin: remoteChar.huongNhin === "sau" ? "sau" : "truoc",
      });
    }

    const remoteOutfits: OutfitSaved[] = Array.isArray(data.outfits)
      ? (data.outfits as Record<string, unknown>[])
          .map(mapServerOutfitToLocal)
          .filter((x): x is OutfitSaved => x !== null)
      : [];

    const localOutfits = docDanhSachGuiKyUc();
    const remoteIds = new Set(remoteOutfits.map((o) => o.id));
    const localOnly = localOutfits.filter(
      (o) => !remoteIds.has(o.id) && o.id !== SAMPLE_OUTFIT.id
    );

    const merged = mergeOutfits(localOutfits, remoteOutfits);
    if (merged.length > 0 && remoteOutfits.length > 0) {
      capNhatDanhSachGuiKyUcTuSync(merged);
    }

    if (localOnly.length > 0 || !remoteChar) {
      await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          character: !remoteChar ? localChar : undefined,
          outfits: localOnly.map((o) => ({
            id: o.id,
            title: o.caption || "Bộ phối đồ Việt phục",
            trang_phuc_id: o.trangPhucId,
            mau_hex: o.mauId,
            phu_kien_ids: o.phuKienIds,
            nhan_vat_config: o.nhanVatConfig || {},
            notes: o.cauLyDoRemix || "",
            created_at: new Date(o.taoLuc || Date.now()).toISOString(),
          })),
        }),
      }).catch(() => {});
    }
  } catch {
    // Offline fallback: giữ dữ liệu cục bộ
  }
}

async function syncWithFirebaseCloud(userId: string): Promise<void> {
  try {
    const [fb, journal] = await Promise.all([
      import("./firebase"),
      import("./journal"),
    ]);
    if (!fb.auth.currentUser || fb.auth.currentUser.uid !== userId) return;

    const [remoteChar, remoteOutfitsRaw] = await Promise.all([
      fb.getUserCharacterFromFirestore(userId).catch(() => null),
      fb.getUserOutfitsFromFirestore(userId).catch(() => []),
    ]);

    const localChar = CharacterStorageService.loadCharacter().toConfig();
    if (remoteChar && typeof remoteChar.gioi === "string") {
      CharacterStorageService.applySyncedCharacter({
        gioi: remoteChar.gioi === "nam" ? "nam" : "nu",
        tuoi:
          remoteChar.tuoi === "tre_em" || remoteChar.tuoi === "nguoi_cao_tuoi"
            ? (remoteChar.tuoi as NhanVatConfig["tuoi"])
            : "nguoi_lon",
        vocDang: normalizeVocDang(remoteChar.vocDang, localChar.vocDang),
        tongDa: normalizeTongDa(remoteChar.tongDa, localChar.tongDa),
        toc: typeof remoteChar.toc === "string" ? remoteChar.toc : localChar.toc,
        huongNhin: remoteChar.huongNhin === "sau" ? "sau" : "truoc",
      });
    } else {
      await pushCharacterToCloud(localChar);
    }

    const remoteOutfits: OutfitSaved[] = remoteOutfitsRaw
      .map(mapServerOutfitToLocal)
      .filter((x): x is OutfitSaved => x !== null);
    const localOutfits = docDanhSachGuiKyUc();
    const remoteIds = new Set(remoteOutfits.map((o) => o.id));
    const localOnly = localOutfits.filter(
      (o) => !remoteIds.has(o.id) && o.id !== SAMPLE_OUTFIT.id
    );

    if (remoteOutfits.length > 0) {
      capNhatDanhSachGuiKyUcTuSync(mergeOutfits(localOutfits, remoteOutfits));
    }
    for (const o of localOnly) {
      await pushOutfitToCloud(o);
    }

    await journal.taiVaDongBoJournal(userId);
  } catch {
    // Ignore transient Firestore offline issues
  }
}

export async function syncAllUserData(_reason = "auto"): Promise<void> {
  if (typeof window === "undefined") return;
  const token = AuthService.getToken();
  const user = AuthService.getUser();
  if (!token || !user?.id) return;

  if (inFlightSync) {
    return inFlightSync;
  }

  inFlightSync = (async () => {
    try {
      if (token.startsWith("fb-")) {
        await syncWithFirebaseCloud(user.id);
      } else {
        await syncWithExpressServer(token);
      }
    } finally {
      inFlightSync = null;
    }
  })();

  return inFlightSync;
}

export async function syncCommunityDataFromServer(): Promise<void> {
  if (typeof window === "undefined" || typeof fetch !== "function") return;
  try {
    const res = await fetch("/api/community/bootstrap", {
      headers: AuthService.getAuthHeaders(),
    });
    if (!res.ok) return;
    const json = await res.json();
    const d = json?.data;
    if (!json?.ok || !d) return;

    if (Array.isArray(d.villages) && d.villages.length > 0) {
      window.localStorage.setItem("vpr:admin:villages_v1", JSON.stringify(d.villages));
    }
    if (Array.isArray(d.workshops) && d.workshops.length > 0) {
      window.localStorage.setItem("vpr:admin:workshops_v1", JSON.stringify(d.workshops));
    }
    if (Array.isArray(d.customCostumes)) {
      window.localStorage.setItem("vpr:admin:custom_costumes_v1", JSON.stringify(d.customCostumes));
    }
    if (Array.isArray(d.hiddenCostumeIds)) {
      window.localStorage.setItem("vpr:admin:hidden_costumes_v1", JSON.stringify(d.hiddenCostumeIds));
    }
    if (d.settings && typeof d.settings === "object") {
      window.localStorage.setItem("vpr:admin:settings_v1", JSON.stringify(d.settings));
    }
    window.dispatchEvent(new CustomEvent("vpr:admin-data-change"));
  } catch {
    // Offline fallback: giữ dữ liệu cục bộ
  }
}
