/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Hook quản lý trạng thái toàn cục & đồng bộ sự kiện cho App.tsx
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { playFolkScreenTransition } from "../lib/audio";
import { QueNhaData } from "../types";
import { NhanVatConfig, NHAN_VAT_MAC_DINH } from "../lib/avatar";
import { CharacterModel } from "../characters/models/CharacterModel";
import { CharacterStorageService } from "../characters/services/CharacterStorageService";
import { VungId, layVungTheoId } from "../data/vung";
import { AuthService } from "../lib/auth";
import {
  layThoiTietVung,
  ThoiTietState,
  ThongTinViTri,
  docViTriSession,
  docThamSoURL,
} from "../lib/thoitiet";
import { OutfitSaved } from "../lib/guiKyUc";
import {
  HoSo,
  layHoSoHienTai,
  layKhoaTheoHoSo,
  taoHoacChonHoSo,
  dungHoSoKhach,
  PROFILE_CHANGE_EVENT,
} from "../lib/hoSo";
import { useCaiDatTraiNghiem } from "../lib/caiDatTraiNghiem";
import { ThemeMode, layThemeHienTai, apDungTheme, THEME_CHANGE_EVENT } from "../lib/theme";
import { diemDanhHomNay } from "../lib/streak";
import type { Screen } from "./types";

function parseQueNhaFromStorage(raw: string | null): QueNhaData {
  if (!raw) return { dip: [], camHungIds: [], phongCach: [], nhomQueId: null };
  try {
    const parsed = JSON.parse(raw);
    const camHungIds = Array.isArray(parsed.camHungIds)
      ? parsed.camHungIds
      : parsed.nhomQueId
      ? [parsed.nhomQueId]
      : [];
    return {
      dip: parsed.dip ?? [],
      camHungIds,
      phongCach: parsed.phongCach ?? [],
      nhomQueId: camHungIds[0] || null,
    };
  } catch {
    return { dip: [], camHungIds: [], phongCach: [], nhomQueId: null };
  }
}

export function useAppState() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    if (typeof window !== "undefined") {
      const urlScreen = new URLSearchParams(window.location.search).get("screen") as Screen;
      if (urlScreen) return urlScreen;
    }
    return "gate";
  });

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playFolkScreenTransition(currentScreen);
  }, [currentScreen]);

  const [activeHoSo, setActiveHoSo] = useState<HoSo>(() => layHoSoHienTai());
  const [showChaoBanModal, setShowChaoBanModal] = useState(false);
  const [showTraiNghiemModal, setShowTraiNghiemModal] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [caiDatTraiNghiem] = useCaiDatTraiNghiem();

  const [selectedTrangPhucId, setSelectedTrangPhucId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tp = urlParams.get("tp");
      const m = urlParams.get("m");
      const pk = urlParams.get("pk");
      const fw = urlParams.get("fw");
      if (tp) {
        if (m || pk || fw) {
          try {
            window.localStorage.setItem(
              layKhoaTheoHoSo(`outfit:${tp}`),
              JSON.stringify({
                trangPhucId: tp,
                mauId: m || "m_do",
                phuKienIds: pk ? pk.split(",") : [],
                footwearId: fw || "guoc_moc",
              })
            );
          } catch {
            // ignore
          }
        }
        return tp;
      }
    }
    return "aodai";
  });

  const [selectedNhomFilterForS2, setSelectedNhomFilterForS2] = useState<string>("all");
  const [returnScreenFromChar, setReturnScreenFromChar] = useState<Screen>("s3");
  const [returnScreenFromGui, setReturnScreenFromGui] = useState<Screen>("s4");
  const [returnScreenFromDongThoiGian, setReturnScreenFromDongThoiGian] = useState<Screen>("s2");
  const [returnScreenFromSoiChi, setReturnScreenFromSoiChi] = useState<Screen>("s2");
  const [returnScreenFromChoPhien, setReturnScreenFromChoPhien] = useState<Screen>("s2");
  const [giuChuanModal, setGiuChuanModal] = useState<{ open: boolean; costumeName?: string }>({
    open: false,
  });

  const [theme, setTheme] = useState<ThemeMode>(() => layThemeHienTai());
  const [characterConfig, setCharacterConfig] = useState<NhanVatConfig>(() =>
    CharacterStorageService.loadCharacter().toConfig()
  );
  const [queNhaData, setQueNhaData] = useState<QueNhaData>(() => {
    if (typeof window === "undefined" || !window.localStorage) {
      return { dip: [], camHungIds: [], phongCach: [], nhomQueId: null };
    }
    return parseQueNhaFromStorage(window.localStorage.getItem(layKhoaTheoHoSo("que_nha")));
  });

  const [manualVungId, setManualVungId] = useState<VungId | null>(null);
  const [customViTri, setCustomViTri] = useState<ThongTinViTri | null>(() => docViTriSession());
  const [camHungVung, setCamHungVung] = useState<VungId | null>(null);

  useEffect(() => {
    if (activeHoSo.id !== "khach") diemDanhHomNay();
  }, [activeHoSo.id]);

  useEffect(() => {
    const onTheme = (e: Event) => {
      const t = (e as CustomEvent<{ theme: ThemeMode }>).detail?.theme;
      if (t) setTheme(t);
    };
    const onOpenAuth = (e: Event) => {
      const mode = (e as CustomEvent<{ mode?: "login" | "register" }>).detail?.mode;
      setAuthModalMode(mode === "register" ? "register" : "login");
      setIsAuthModalOpen(true);
    };
    const onOpenProfile = () => setShowChaoBanModal(true);
    const onOpenAdmin = () => setCurrentScreen("admin");
    const onOpenGiuChuan = (e: Event) =>
      setGiuChuanModal({ open: true, costumeName: (e as CustomEvent).detail?.costumeName });
    const onOpenThamTu = () => setCurrentScreen("tham_tu");
    const onCharSync = (e: Event) => {
      const cfg = (e as CustomEvent<NhanVatConfig>).detail;
      if (cfg) setCharacterConfig(cfg);
    };
    const onAuthChange = (e: Event) => {
      const detail = (e as CustomEvent<{ name?: string } | null>).detail;
      if (detail?.name) {
        setActiveHoSo(taoHoacChonHoSo(detail.name));
        diemDanhHomNay();
        import("../lib/dataSync")
          .then((m) => m.syncAllUserData("auth-change"))
          .catch(() => {});
      } else {
        setActiveHoSo(dungHoSoKhach());
        setCurrentScreen((prev) => (prev === "admin" ? "s2" : prev));
      }
    };
    const onProfileChange = (e: Event) => {
      const newHoSo = (e as CustomEvent<HoSo>).detail || layHoSoHienTai();
      setActiveHoSo(newHoSo);
      try {
        setCharacterConfig(CharacterStorageService.loadCharacter().toConfig());
      } catch {
        setCharacterConfig(NHAN_VAT_MAC_DINH);
      }
      setQueNhaData(
        parseQueNhaFromStorage(window.localStorage.getItem(`vpr:${newHoSo.id}:que_nha`))
      );
      window.dispatchEvent(new CustomEvent("vpr:outfits-change"));
    };

    window.addEventListener(THEME_CHANGE_EVENT, onTheme);
    window.addEventListener("vpr:open-auth-modal", onOpenAuth);
    window.addEventListener("vpr:open-profile", onOpenProfile);
    window.addEventListener("vpr:open-admin-dashboard", onOpenAdmin);
    window.addEventListener("vpr:open-giu-chuan", onOpenGiuChuan);
    window.addEventListener("vpr:open-tham-tu", onOpenThamTu);
    window.addEventListener("vpr:character-sync", onCharSync);
    window.addEventListener("vpr:auth-change", onAuthChange);
    window.addEventListener(PROFILE_CHANGE_EVENT, onProfileChange);

    let timerId: number | undefined;
    if (AuthService.getToken()) {
      timerId = window.setTimeout(() => {
        import("../lib/dataSync")
          .then((m) => m.syncAllUserData("boot"))
          .catch(() => {});
      }, 250);
    }

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, onTheme);
      window.removeEventListener("vpr:open-auth-modal", onOpenAuth);
      window.removeEventListener("vpr:open-profile", onOpenProfile);
      window.removeEventListener("vpr:open-admin-dashboard", onOpenAdmin);
      window.removeEventListener("vpr:open-giu-chuan", onOpenGiuChuan);
      window.removeEventListener("vpr:open-tham-tu", onOpenThamTu);
      window.removeEventListener("vpr:character-sync", onCharSync);
      window.removeEventListener("vpr:auth-change", onAuthChange);
      window.removeEventListener(PROFILE_CHANGE_EVENT, onProfileChange);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const onOpenNhatKy = () => {
      setReturnScreenFromGui(currentScreen);
      setCurrentScreen("nhat_ky");
    };
    window.addEventListener("vpr:open-nhat-ky", onOpenNhatKy);
    return () => window.removeEventListener("vpr:open-nhat-ky", onOpenNhatKy);
  }, [currentScreen]);

  useEffect(() => {
    const primaryCamHung = queNhaData.camHungIds?.[0] || queNhaData.nhomQueId;
    if (!primaryCamHung) {
      setCamHungVung(null);
      return;
    }
    let cancelled = false;
    import("../data/nhom")
      .then(({ nhom }) => {
        if (cancelled) return;
        const foundNhom = nhom.find((n) => n.id === primaryCamHung);
        if (
          foundNhom?.vung === "bac" ||
          foundNhom?.vung === "trung" ||
          foundNhom?.vung === "taynguyen" ||
          foundNhom?.vung === "nam"
        ) {
          setCamHungVung(foundNhom.vung);
        } else {
          setCamHungVung(null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [queNhaData.camHungIds, queNhaData.nhomQueId]);

  const currentVungId: VungId = useMemo(() => {
    const urlParams = docThamSoURL();
    if (urlParams.vungOverride) return urlParams.vungOverride;
    if (customViTri?.vungId) return customViTri.vungId;
    if (manualVungId) return manualVungId;
    if (camHungVung) return camHungVung;
    return "trung";
  }, [manualVungId, customViTri, camHungVung]);

  const [weatherState, setWeatherState] = useState<ThoiTietState>(() => {
    const targetVung = layVungTheoId(currentVungId);
    const initialViTri: ThongTinViTri = customViTri || {
      ten: targetVung.noi,
      lat: targetVung.lat,
      lon: targetVung.lon,
      nguon: "mac_dinh",
      vungId: currentVungId,
    };
    return {
      vung: targetVung,
      thoiTiet: "mat",
      khungGio: "ngay",
      nhietDo: 26,
      precipitation: 0,
      weatherCode: 0,
      moTaThoiTiet: "Dịu mát",
      moTaKhungGio: "ban ngày",
      isFallback: true,
      timestamp: Date.now(),
      doAm: 70,
      viTri: initialViTri,
    };
  });

  useEffect(() => {
    let isCancelled = false;
    layThoiTietVung(currentVungId, customViTri ?? undefined).then((res) => {
      if (!isCancelled) setWeatherState(res);
    });
    return () => {
      isCancelled = true;
    };
  }, [currentVungId, customViTri]);

  const handleToggleTheme = () => {
    const next: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(next);
    apDungTheme(next);
  };

  const handleNavigateFromSidebar = (screen: Screen) => {
    if (screen === "gui_ky_uc" || screen === "nhat_ky") setReturnScreenFromGui(currentScreen);
    else if (screen === "dong_thoi_gian") setReturnScreenFromDongThoiGian(currentScreen);
    else if (screen === "soi_chi_chung") setReturnScreenFromSoiChi(currentScreen);
    else if (screen === "cho_phien") setReturnScreenFromChoPhien(currentScreen);
    setCurrentScreen(screen);
  };

  const handleWearOutfitFromGui = (outfit: OutfitSaved) => {
    setSelectedTrangPhucId(outfit.trangPhucId);
    try {
      window.localStorage.setItem(
        layKhoaTheoHoSo(`outfit:${outfit.trangPhucId}`),
        JSON.stringify({
          trangPhucId: outfit.trangPhucId,
          mauId: outfit.mauId,
          phuKienIds: outfit.phuKienIds,
          hoaVanThem: outfit.hoaVanThem ?? null,
          phongCach: outfit.phongCach ?? "truyen_thong",
        })
      );
    } catch {
      // ignore
    }
    if (outfit.nhanVatConfig) {
      const model = CharacterModel.fromConfig(outfit.nhanVatConfig);
      CharacterStorageService.saveCharacter(model);
      setCharacterConfig(model.toConfig());
    }
    setCurrentScreen("s4");
  };

  return {
    currentScreen,
    setCurrentScreen,
    activeHoSo,
    setActiveHoSo,
    showChaoBanModal,
    setShowChaoBanModal,
    showTraiNghiemModal,
    setShowTraiNghiemModal,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    isChatOpen,
    setIsChatOpen,
    caiDatTraiNghiem,
    selectedTrangPhucId,
    setSelectedTrangPhucId,
    selectedNhomFilterForS2,
    setSelectedNhomFilterForS2,
    returnScreenFromChar,
    setReturnScreenFromChar,
    returnScreenFromGui,
    setReturnScreenFromGui,
    returnScreenFromDongThoiGian,
    setReturnScreenFromDongThoiGian,
    returnScreenFromSoiChi,
    setReturnScreenFromSoiChi,
    returnScreenFromChoPhien,
    setReturnScreenFromChoPhien,
    giuChuanModal,
    setGiuChuanModal,
    theme,
    characterConfig,
    setCharacterConfig,
    queNhaData,
    setQueNhaData,
    currentVungId,
    weatherState,
    handleSelectVung: (vungId: VungId) => setManualVungId(vungId),
    handleViTriChange: (newViTri: ThongTinViTri) => {
      setCustomViTri(newViTri);
      setManualVungId(newViTri.vungId);
    },
    handleToggleTheme,
    handleNavigateFromSidebar,
    handleWearOutfitFromGui,
  };
}
