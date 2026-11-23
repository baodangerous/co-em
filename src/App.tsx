/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * App.tsx — Bộ điều phối màn hình trung tâm với Code-Splitting (React.lazy + Suspense)
 * Đảm bảo đóng gói tối ưu (chunk splitting), giảm tải bộ nhớ ban đầu và dùng chung tài nguyên UI.
 */

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { playFolkScreenTransition } from "./lib/audio";
import GateScreen from "./screens/GateScreen";
import CostumeSelectScreen from "./screens/CostumeSelectScreen";
import BauTroi from "./components/BauTroi";
import TopBar from "./components/TopBar";
import SidebarNav from "./components/SidebarNav";
import { TooltipProvider } from "./components/Tooltip";
import { ScreenLoadingFallback, SubNavTabs } from "./components/common/SharedUI";
import { QueNhaData } from "./types";
import { NhanVatConfig, NHAN_VAT_MAC_DINH } from "./lib/avatar";
import { CharacterModel, CharacterStorageService } from "./characters";
import { VungId, layVungTheoId } from "./data/vung";
import { nhom } from "./data/nhom";
import { trangPhuc } from "./data/trangphuc";
import {
  layThoiTietVung,
  ThoiTietState,
  ThongTinViTri,
  docViTriSession,
  docThamSoURL,
} from "./lib/thoitiet";
import { OutfitSaved } from "./lib/guiKyUc";
import {
  HoSo,
  layHoSoHienTai,
  layKhoaTheoHoSo,
  taoHoacChonHoSo,
  dungHoSoKhach,
  PROFILE_CHANGE_EVENT,
} from "./lib/hoSo";
import { useCaiDatTraiNghiem } from "./lib/caiDatTraiNghiem";
import {
  ThemeMode,
  layThemeHienTai,
  apDungTheme,
  THEME_CHANGE_EVENT,
} from "./lib/theme";
import { diemDanhHomNay } from "./lib/streak";

// Lazy-loaded screens & modals for optimal bundling and runtime code-splitting
const QueNhaScreen = React.lazy(() => import("./screens/QueNhaScreen"));
const CostumeDetailScreen = React.lazy(() => import("./screens/CostumeDetailScreen"));
const CharacterSelectScreen = React.lazy(() => import("./screens/CharacterSelectScreen"));
const OutfitScreen = React.lazy(() => import("./screens/OutfitScreen"));
const GuiKyUcScreen = React.lazy(() => import("./screens/GuiKyUcScreen"));
const GiuChuanVanHoaScreen = React.lazy(() => import("./screens/GiuChuanVanHoaScreen"));
const ThamTuScreen = React.lazy(() => import("./screens/ThamTuScreen"));
const BanDoScreen = React.lazy(() => import("./screens/BanDoScreen"));
const DongThoiGianScreen = React.lazy(() => import("./screens/DongThoiGianScreen"));
const SoiChiChungScreen = React.lazy(() => import("./screens/SoiChiChungScreen"));
const ChoPhienScreen = React.lazy(() => import("./screens/ChoPhienScreen"));
const LeHoiVanHoaScreen = React.lazy(() => import("./screens/LeHoiVanHoaScreen"));
const AdminScreen = React.lazy(() => import("./screens/AdminScreen"));
const ChaoBanScreen = React.lazy(() => import("./screens/ChaoBanScreen"));
const NhatKyTraiNghiemScreen = React.lazy(() => import("./screens/NhatKyTraiNghiemScreen"));
const ThuDoAIScreen = React.lazy(() => import("./screens/ThuDoAIScreen"));
const CaiDatTraiNghiemModal = React.lazy(() => import("./components/CaiDatTraiNghiemModal"));
const AuthModal = React.lazy(() => import("./components/AuthModal"));

type Screen =
  | "chao_ban"
  | "gate"
  | "que_nha"
  | "s2"
  | "le_hoi"
  | "thu_do_ai"
  | "s3"
  | "nhan_vat"
  | "s4"
  | "test"
  | "giu_chuan"
  | "gui_ky_uc"
  | "nhat_ky"
  | "tham_tu"
  | "ban_do"
  | "dong_thoi_gian"
  | "soi_chi_chung"
  | "cho_phien"
  | "admin";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    if (typeof window !== "undefined") {
      const urlScreen = new URLSearchParams(window.location.search).get(
        "screen"
      ) as Screen;
      if (urlScreen) return urlScreen;
    }
    return "gate";
  });

  // Âm thanh nhạc cụ dân gian xuyên suốt khi di chuyển giữa các màn hình
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
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login"
  );
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
            const data = {
              trangPhucId: tp,
              mauId: m || "m_do",
              phuKienIds: pk ? pk.split(",") : [],
              footwearId: fw || "guoc_moc",
            };
            window.localStorage.setItem(
              layKhoaTheoHoSo(`outfit:${tp}`),
              JSON.stringify(data)
            );
          } catch {
            // bỏ qua
          }
        }
        return tp;
      }
    }
    return "aodai";
  });
  const [selectedNhomFilterForS2, setSelectedNhomFilterForS2] =
    useState<string>("all");
  const [returnScreenFromChar, setReturnScreenFromChar] =
    useState<Screen>("s3");
  const [returnScreenFromGui, setReturnScreenFromGui] = useState<Screen>("s4");
  const [returnScreenFromDongThoiGian, setReturnScreenFromDongThoiGian] =
    useState<Screen>("s2");
  const [returnScreenFromSoiChi, setReturnScreenFromSoiChi] =
    useState<Screen>("s2");
  const [returnScreenFromChoPhien, setReturnScreenFromChoPhien] =
    useState<Screen>("s2");
  const [giuChuanModal, setGiuChuanModal] = useState<{
    open: boolean;
    costumeName?: string;
  }>({ open: false });

  const [theme, setTheme] = useState<ThemeMode>(() => layThemeHienTai());

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () =>
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  useEffect(() => {
    const handleOpenAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: "login" | "register" }>;
      if (customEvent.detail?.mode === "register") {
        setAuthModalMode("register");
      } else {
        setAuthModalMode("login");
      }
      setIsAuthModalOpen(true);
    };
    window.addEventListener("vpr:open-auth-modal", handleOpenAuth);
    return () =>
      window.removeEventListener("vpr:open-auth-modal", handleOpenAuth);
  }, []);

  useEffect(() => {
    if (activeHoSo.id !== "khach") {
      diemDanhHomNay();
    }
  }, [activeHoSo.id]);

  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name?: string } | null>;
      if (customEvent.detail?.name) {
        const hoSo = taoHoacChonHoSo(customEvent.detail.name);
        setActiveHoSo(hoSo);
        diemDanhHomNay();
      } else {
        const hoSo = dungHoSoKhach();
        setActiveHoSo(hoSo);
        setCurrentScreen((prev) => (prev === "admin" ? "s2" : prev));
      }
    };
    window.addEventListener("vpr:auth-change", handleAuthChange);
    return () => window.removeEventListener("vpr:auth-change", handleAuthChange);
  }, []);

  useEffect(() => {
    const handleOpenProfile = () => setShowChaoBanModal(true);
    const handleOpenAdminDashboard = () => setCurrentScreen("admin");
    window.addEventListener("vpr:open-profile", handleOpenProfile);
    window.addEventListener("vpr:open-admin-dashboard", handleOpenAdminDashboard);
    return () => {
      window.removeEventListener("vpr:open-profile", handleOpenProfile);
      window.removeEventListener(
        "vpr:open-admin-dashboard",
        handleOpenAdminDashboard
      );
    };
  }, []);

  useEffect(() => {
    const handleOpenNhatKy = () => {
      setReturnScreenFromGui(currentScreen);
      setCurrentScreen("nhat_ky");
    };
    const handleOpenThamTu = () => {
      setCurrentScreen("tham_tu");
    };
    window.addEventListener("vpr:open-nhat-ky", handleOpenNhatKy);
    window.addEventListener("vpr:open-tham-tu", handleOpenThamTu);
    return () => {
      window.removeEventListener("vpr:open-nhat-ky", handleOpenNhatKy);
      window.removeEventListener("vpr:open-tham-tu", handleOpenThamTu);
    };
  }, [currentScreen]);

  const handleToggleTheme = () => {
    const next: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(next);
    apDungTheme(next);
  };

  const handleNavigateFromSidebar = (screen: Screen) => {
    if (screen === "gui_ky_uc" || screen === "nhat_ky") {
      setReturnScreenFromGui(currentScreen);
    } else if (screen === "dong_thoi_gian") {
      setReturnScreenFromDongThoiGian(currentScreen);
    } else if (screen === "soi_chi_chung") {
      setReturnScreenFromSoiChi(currentScreen);
    } else if (screen === "cho_phien") {
      setReturnScreenFromChoPhien(currentScreen);
    }
    setCurrentScreen(screen);
  };

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setGiuChuanModal({
        open: true,
        costumeName: detail?.costumeName,
      });
    };
    window.addEventListener("vpr:open-giu-chuan", handleOpen);
    return () => window.removeEventListener("vpr:open-giu-chuan", handleOpen);
  }, []);

  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent<HoSo>;
      const newHoSo = customEvent.detail || layHoSoHienTai();
      setActiveHoSo(newHoSo);

      try {
        const charModel = CharacterStorageService.loadCharacter();
        setCharacterConfig(charModel.toConfig());
      } catch {
        setCharacterConfig(NHAN_VAT_MAC_DINH);
      }

      try {
        const qnRaw = window.localStorage.getItem(`vpr:${newHoSo.id}:que_nha`);
        if (qnRaw) {
          const parsed = JSON.parse(qnRaw);
          const camHungIds = Array.isArray(parsed.camHungIds)
            ? parsed.camHungIds
            : parsed.nhomQueId
            ? [parsed.nhomQueId]
            : [];
          setQueNhaData({
            dip: parsed.dip ?? [],
            camHungIds,
            phongCach: parsed.phongCach ?? [],
            nhomQueId: camHungIds[0] || null,
          });
        } else {
          setQueNhaData({
            dip: [],
            camHungIds: [],
            phongCach: [],
            nhomQueId: null,
          });
        }
      } catch {
        setQueNhaData({
          dip: [],
          camHungIds: [],
          phongCach: [],
          nhomQueId: null,
        });
      }

      window.dispatchEvent(new CustomEvent("vpr:outfits-change"));
    };

    window.addEventListener(PROFILE_CHANGE_EVENT, handleProfileChange);
    return () =>
      window.removeEventListener(PROFILE_CHANGE_EVENT, handleProfileChange);
  }, []);

  const [characterConfig, setCharacterConfig] = useState<NhanVatConfig>(() => {
    return CharacterStorageService.loadCharacter().toConfig();
  });

  const [queNhaData, setQueNhaData] = useState<QueNhaData>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem(layKhoaTheoHoSo("que_nha"));
        if (stored) {
          const parsed = JSON.parse(stored);
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
        }
      }
    } catch {
      // Bỏ qua
    }
    return { dip: [], camHungIds: [], phongCach: [], nhomQueId: null };
  });

  const [manualVungId, setManualVungId] = useState<VungId | null>(null);
  const [customViTri, setCustomViTri] = useState<ThongTinViTri | null>(() =>
    docViTriSession()
  );

  const currentVungId: VungId = useMemo(() => {
    const urlParams = docThamSoURL();
    if (urlParams.vungOverride) {
      return urlParams.vungOverride;
    }
    if (customViTri?.vungId) {
      return customViTri.vungId;
    }
    if (manualVungId) {
      return manualVungId;
    }
    const primaryCamHung = queNhaData.camHungIds?.[0] || queNhaData.nhomQueId;
    if (primaryCamHung) {
      const foundNhom = nhom.find((n) => n.id === primaryCamHung);
      if (
        foundNhom?.vung === "bac" ||
        foundNhom?.vung === "trung" ||
        foundNhom?.vung === "taynguyen" ||
        foundNhom?.vung === "nam"
      ) {
        return foundNhom.vung;
      }
    }
    return "trung";
  }, [manualVungId, customViTri, queNhaData.camHungIds, queNhaData.nhomQueId]);

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
      if (!isCancelled) {
        setWeatherState(res);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [currentVungId, customViTri]);

  const handleSelectVung = (vungId: VungId) => {
    setManualVungId(vungId);
  };

  const handleViTriChange = (newViTri: ThongTinViTri) => {
    setCustomViTri(newViTri);
    setManualVungId(newViTri.vungId);
  };

  const handleSelectCostumeFromWeather = (trangPhucId: string) => {
    setSelectedTrangPhucId(trangPhucId);
    setCurrentScreen("s3");
  };

  const handleQueNhaComplete = (data: QueNhaData) => {
    setQueNhaData(data);
    setCurrentScreen("s2");
  };

  const handleBackToGate = () => {
    setCurrentScreen("gate");
  };

  const handleBackToQueNha = () => {
    setCurrentScreen("que_nha");
  };

  const handleOpenGuiKyUc = (from: Screen = "s4") => {
    setReturnScreenFromGui(from);
    setCurrentScreen("gui_ky_uc");
  };

  const handleOpenDongThoiGian = (from: Screen = "s2") => {
    setReturnScreenFromDongThoiGian(from);
    setCurrentScreen("dong_thoi_gian");
  };

  const handleOpenSoiChiChung = (from: Screen = "s2") => {
    setReturnScreenFromSoiChi(from);
    setCurrentScreen("soi_chi_chung");
  };

  const handleOpenChoPhien = (from: Screen = "s2") => {
    setReturnScreenFromChoPhien(from);
    setCurrentScreen("cho_phien");
  };

  const handleWearOutfitFromGui = (outfit: OutfitSaved) => {
    setSelectedTrangPhucId(outfit.trangPhucId);
    try {
      const data = {
        trangPhucId: outfit.trangPhucId,
        mauId: outfit.mauId,
        phuKienIds: outfit.phuKienIds,
        hoaVanThem: outfit.hoaVanThem ?? null,
        phongCach: outfit.phongCach ?? "truyen_thong",
      };
      window.localStorage.setItem(
        layKhoaTheoHoSo(`outfit:${outfit.trangPhucId}`),
        JSON.stringify(data)
      );
    } catch (err) {
      console.error("Lỗi lưu outfit để mặc lại:", err);
    }
    if (outfit.nhanVatConfig) {
      const model = CharacterModel.fromConfig(outfit.nhanVatConfig);
      CharacterStorageService.saveCharacter(model);
      setCharacterConfig(model.toConfig());
    }
    setCurrentScreen("s4");
  };

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        {/* Lớp nền Bầu trời nằm cố định sau mọi màn */}
        <BauTroi
          vungId={weatherState.vung.id}
          khungGio={weatherState.khungGio}
          thoiTiet={weatherState.thoiTiet}
          theme={theme}
        />

        {/* Dải thông tin trên cùng (TopBar - 56px) */}
        {currentScreen !== "chao_ban" && (
          <TopBar
            weatherState={weatherState}
            onSelectVung={handleSelectVung}
            onSelectCostume={handleSelectCostumeFromWeather}
            onViTriChange={handleViTriChange}
            theme={theme}
            onLogoClick={() => setCurrentScreen("gate")}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenThamTu={() => setCurrentScreen("tham_tu")}
          />
        )}

        <style>{`
          @media (min-width: 1024px) {
            body.sidebar-collapsed .vpr-main-content-layout {
              padding-left: 72px !important;
            }
          }
        `}</style>
        <div
          className={`vpr-main-content-layout min-h-screen ${
            currentScreen !== "chao_ban" ? "pt-[56px] lg:pl-[250px]" : ""
          } transition-all duration-300`}
        >
          {/* Thanh điều hướng con cho nhóm Bản Đồ & Lịch Sử (Dùng chung SubNavTabs) */}
          {(currentScreen === "ban_do" ||
            currentScreen === "dong_thoi_gian" ||
            currentScreen === "soi_chi_chung") && (
            <SubNavTabs
              activeId={currentScreen}
              items={[
                { id: "ban_do", label: "Bản đồ vùng văn hóa" },
                { id: "dong_thoi_gian", label: "Dòng thời gian lịch sử" },
                { id: "soi_chi_chung", label: "Đối chiếu 2 dân tộc" },
              ]}
              onSelect={(tabId) => {
                if (tabId === "dong_thoi_gian") {
                  handleOpenDongThoiGian("ban_do");
                } else if (tabId === "soi_chi_chung") {
                  handleOpenSoiChiChung("ban_do");
                } else {
                  setCurrentScreen("ban_do");
                }
              }}
            />
          )}

          {/* Thanh điều hướng con cho nhóm Gùi Ký Ức & Nhật Ký */}
          {(currentScreen === "gui_ky_uc" || currentScreen === "nhat_ky") && (
            <SubNavTabs
              activeId={currentScreen}
              items={[
                { id: "gui_ky_uc", label: "Tủ đồ đã lưu (Gùi Ký Ức)" },
                { id: "nhat_ky", label: "Nhật ký trải nghiệm" },
              ]}
              onSelect={(tabId) => setCurrentScreen(tabId)}
            />
          )}

          {/* CÁC MÀN HÌNH ĐƯỢC CODE-SPLITTING QUA SUSPENSE */}
          <Suspense fallback={<ScreenLoadingFallback />}>
            {currentScreen === "chao_ban" && (
              <ChaoBanScreen
                onProceed={(hoSo) => {
                  window.localStorage.setItem("vpr:has_seen_chao_ban", "1");
                  setActiveHoSo(hoSo);
                  setCurrentScreen("gate");
                }}
                onBack={() => {
                  window.localStorage.setItem("vpr:has_seen_chao_ban", "1");
                  setCurrentScreen("gate");
                }}
              />
            )}

            {currentScreen === "gate" && (
              <GateScreen
                onEnter={() => setCurrentScreen("s2")}
                onEnterQueNha={() => setCurrentScreen("que_nha")}
                onSkip={() => setCurrentScreen("s2")}
                onOpenChaoBan={() => setShowChaoBanModal(true)}
                onOpenStudio={() => setCurrentScreen("s4")}
                onOpenThuDoAI={() => setCurrentScreen("thu_do_ai")}
                onOpenChoPhien={() => handleOpenChoPhien("gate")}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenCharacter={() => {
                  setReturnScreenFromChar("gate");
                  setCurrentScreen("nhan_vat");
                }}
              />
            )}

            {currentScreen === "thu_do_ai" && (
              <ThuDoAIScreen
                initialTrangPhucId={selectedTrangPhucId}
                onOpenStudio2D={(tpId) => {
                  setSelectedTrangPhucId(tpId);
                  setCurrentScreen("s4");
                }}
                onOpenChoPhien={() => handleOpenChoPhien("thu_do_ai")}
                onBackToCollection={() => setCurrentScreen("s2")}
              />
            )}

            {currentScreen === "que_nha" && (
              <QueNhaScreen
                onComplete={handleQueNhaComplete}
                onBackToGate={handleBackToGate}
                onDirectToOutfit={(trangPhucId) => {
                  setSelectedTrangPhucId(trangPhucId);
                  setCurrentScreen("s4");
                }}
              />
            )}

            {currentScreen === "s2" && (
              <CostumeSelectScreen
                queNhaData={queNhaData}
                onBackToQueNha={handleBackToQueNha}
                onSelectTrangPhuc={(id, directToS4) => {
                  setSelectedTrangPhucId(id);
                  setCurrentScreen(directToS4 ? "s4" : "s3");
                }}
                onOpenThuDoAI={(id) => {
                  if (id) setSelectedTrangPhucId(id);
                  setCurrentScreen("thu_do_ai");
                }}
                onOpenCharacter={() => {
                  setReturnScreenFromChar("s2");
                  setCurrentScreen("nhan_vat");
                }}
                onOpenGuiKyUc={() => handleOpenGuiKyUc("s2")}
                onOpenThamTu={() => setCurrentScreen("tham_tu")}
                onOpenBanDo={() => setCurrentScreen("ban_do")}
                onOpenDongThoiGian={() => handleOpenDongThoiGian("s2")}
                onOpenSoiChiChung={() => handleOpenSoiChiChung("s2")}
                onOpenChoPhien={() => handleOpenChoPhien("s2")}
                onOpenLeHoi={() => setCurrentScreen("le_hoi")}
                onOpenChaoBan={() => setShowChaoBanModal(true)}
                initialNhomFilter={selectedNhomFilterForS2}
                activeHoSo={activeHoSo}
                weatherState={weatherState}
              />
            )}

            {currentScreen === "le_hoi" && (
              <LeHoiVanHoaScreen
                onSelectTrangPhuc={(id, directToS4) => {
                  setSelectedTrangPhucId(id);
                  setCurrentScreen(directToS4 ? "s4" : "s3");
                }}
                onOpenThuDoAI={(id) => {
                  if (id) setSelectedTrangPhucId(id);
                  setCurrentScreen("thu_do_ai");
                }}
                onOpenThamTu={() => setCurrentScreen("tham_tu")}
                onBackToCollection={() => setCurrentScreen("s2")}
              />
            )}

            {currentScreen === "s3" && (
              <CostumeDetailScreen
                trangPhucId={selectedTrangPhucId}
                onBackToCostumes={() => setCurrentScreen("s2")}
                onProceedToS4={() => setCurrentScreen("s4")}
                onOpenThuDoAI={(id) => {
                  setSelectedTrangPhucId(id);
                  setCurrentScreen("thu_do_ai");
                }}
                onSelectAnotherCostume={(id) => {
                  setSelectedTrangPhucId(id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenDongThoiGian={() => handleOpenDongThoiGian("s3")}
                onOpenThamTu={() => setCurrentScreen("tham_tu")}
              />
            )}

            {currentScreen === "s4" && (
              <OutfitScreen
                trangPhucId={selectedTrangPhucId}
                nhanVatConfig={characterConfig}
                onUpdateCharacterConfig={(cfg) => {
                  const model = CharacterModel.fromConfig(cfg);
                  CharacterStorageService.saveCharacter(model);
                  setCharacterConfig(model.toConfig());
                }}
                weatherState={weatherState}
                onBackToDetail={() => setCurrentScreen("s3")}
                onOpenCharacterSelect={() => {
                  setReturnScreenFromChar("s4");
                  setCurrentScreen("nhan_vat");
                }}
                onSelectAnotherCostume={() => setCurrentScreen("s2")}
                onChangeTrangPhuc={(id) => setSelectedTrangPhucId(id)}
                onOpenGuiKyUc={() => handleOpenGuiKyUc("s4")}
                onOpenDongThoiGian={() => handleOpenDongThoiGian("s4")}
                onOpenThuDoAI={(id) => {
                  setSelectedTrangPhucId(id);
                  setCurrentScreen("thu_do_ai");
                }}
                onOpenChoPhien={() => handleOpenChoPhien("s4")}
              />
            )}

            {currentScreen === "gui_ky_uc" && (
              <GuiKyUcScreen
                onBack={() => setCurrentScreen(returnScreenFromGui)}
                onWearOutfit={handleWearOutfitFromGui}
                globalNhanVatConfig={characterConfig}
                onOpenChoPhien={() => handleOpenChoPhien("gui_ky_uc")}
                onOpenChaoBan={() => setShowChaoBanModal(true)}
              />
            )}

            {currentScreen === "nhat_ky" && (
              <NhatKyTraiNghiemScreen
                onBack={() => setCurrentScreen(returnScreenFromGui || "gate")}
                onWearOutfit={handleWearOutfitFromGui}
                globalNhanVatConfig={characterConfig}
                onOpenChoPhien={() => handleOpenChoPhien("nhat_ky")}
                onOpenChaoBan={() => setShowChaoBanModal(true)}
              />
            )}

            {currentScreen === "nhan_vat" && (
              <CharacterSelectScreen
                initialConfig={characterConfig}
                onSave={(cfg) => {
                  const model = CharacterModel.fromConfig(cfg);
                  CharacterStorageService.saveCharacter(model);
                  setCharacterConfig(model.toConfig());
                  setCurrentScreen(returnScreenFromChar);
                }}
                onBack={() => setCurrentScreen(returnScreenFromChar)}
              />
            )}

            {currentScreen === "giu_chuan" && (
              <GiuChuanVanHoaScreen onClose={() => setCurrentScreen("gate")} />
            )}

            {currentScreen === "tham_tu" && (
              <ThamTuScreen
                onProceedToS4={(tpId) => {
                  if (tpId && trangPhuc.some((t) => t.id === tpId)) {
                    setSelectedTrangPhucId(tpId);
                  }
                  setCurrentScreen("s4");
                }}
                onSkipToS4={() => setCurrentScreen("s4")}
                onBackToS2={() => setCurrentScreen("s2")}
                nhanVatConfig={characterConfig}
              />
            )}

            {currentScreen === "ban_do" && (
              <BanDoScreen
                onBack={() => setCurrentScreen("s2")}
                currentVungId={currentVungId}
                theme={theme}
                onSelectVungOnly={(vungId) => {
                  setManualVungId(vungId);
                }}
                onSelectNhomAndNavigateToS2={(nhomOrCostumeId, vungId) => {
                  setManualVungId(vungId);
                  if (trangPhuc.some((tp) => tp.id === nhomOrCostumeId)) {
                    setSelectedTrangPhucId(nhomOrCostumeId);
                    setCurrentScreen("s3");
                  } else {
                    setSelectedNhomFilterForS2(nhomOrCostumeId);
                    setCurrentScreen("s2");
                  }
                }}
              />
            )}

            {currentScreen === "dong_thoi_gian" && (
              <DongThoiGianScreen
                onBack={() => setCurrentScreen(returnScreenFromDongThoiGian)}
                onRemixInS4={(costumeId) => {
                  setSelectedTrangPhucId(costumeId);
                  try {
                    window.localStorage.removeItem(
                      layKhoaTheoHoSo(`outfit:${costumeId}`)
                    );
                  } catch {
                    // ignore
                  }
                  setCurrentScreen("s4");
                }}
              />
            )}

            {currentScreen === "soi_chi_chung" && (
              <SoiChiChungScreen
                initialNhomAId={
                  queNhaData.camHungIds?.[0] || queNhaData.nhomQueId || "kb"
                }
                initialNhomBId="thai"
                onBack={() => setCurrentScreen(returnScreenFromSoiChi)}
                onSelectCostume={(trangPhucId) => {
                  setSelectedTrangPhucId(trangPhucId);
                  setCurrentScreen("s3");
                }}
              />
            )}

            {currentScreen === "cho_phien" && (
              <ChoPhienScreen
                onBack={() => setCurrentScreen(returnScreenFromChoPhien)}
                onOpenCostumeDetail={(tpId) => {
                  setSelectedTrangPhucId(tpId);
                  setCurrentScreen("s3");
                }}
                onOpenStudioWithCostume={(tpId, mauId, phuKienIds) => {
                  setSelectedTrangPhucId(tpId);
                  if (mauId || phuKienIds) {
                    try {
                      window.localStorage.setItem(
                        layKhoaTheoHoSo(`outfit:${tpId}`),
                        JSON.stringify({
                          trangPhucId: tpId,
                          mauId,
                          phuKienIds: phuKienIds || [],
                        })
                      );
                    } catch {
                      // ignore
                    }
                  }
                  setCurrentScreen("s4");
                }}
              />
            )}

            {currentScreen === "admin" && (
              <AdminScreen
                onOpenCostumeDetail={(tpId) => {
                  setSelectedTrangPhucId(tpId);
                  setCurrentScreen("s3");
                }}
                onOpenChoPhien={() => setCurrentScreen("cho_phien")}
              />
            )}
          </Suspense>
        </div>

        {/* CÁC MODAL TẢI THEO YÊU CẦU */}
        <Suspense fallback={null}>
          {showChaoBanModal && (
            <ChaoBanScreen
              isModal
              onProceed={(hoSo) => {
                setActiveHoSo(hoSo);
                setShowChaoBanModal(false);
              }}
              onBack={() => setShowChaoBanModal(false)}
            />
          )}

          {showTraiNghiemModal && (
            <CaiDatTraiNghiemModal
              onClose={() => setShowTraiNghiemModal(false)}
              weatherState={weatherState}
              onViTriChange={handleViTriChange}
              onSelectVung={handleSelectVung}
            />
          )}

          {giuChuanModal.open && (
            <GiuChuanVanHoaScreen
              sourceCostumeName={giuChuanModal.costumeName}
              onClose={() => setGiuChuanModal({ open: false })}
            />
          )}

          <AuthModal
            isOpen={isAuthModalOpen}
            initialMode={authModalMode}
            onClose={() => setIsAuthModalOpen(false)}
          />
        </Suspense>

        {/* CỘT CÔNG CỤ & ĐIỀU HƯỚNG BÊN TRÁI MÀN HÌNH (SidebarNav) */}
        <SidebarNav
          currentScreen={currentScreen}
          onNavigate={handleNavigateFromSidebar}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          activeHoSo={activeHoSo}
          onOpenChaoBan={() => setShowChaoBanModal(true)}
          onOpenTraiNghiem={() => setShowTraiNghiemModal(true)}
          hasActiveTraiNghiem={Boolean(
            caiDatTraiNghiem.amThanh ||
              caiDatTraiNghiem.giamChuyenDong ||
              caiDatTraiNghiem.chuLonDeDoc ||
              caiDatTraiNghiem.tatBauTroi
          )}
          onToggleChat={() => setIsChatOpen((prev) => !prev)}
          isChatOpen={isChatOpen}
          showGoiYBtn={currentScreen === "s2"}
          onOpenGoiY={() =>
            window.dispatchEvent(new CustomEvent("vpr:open-goi-y"))
          }
        />
      </div>
    </TooltipProvider>
  );
}
