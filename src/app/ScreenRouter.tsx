/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ScreenRouter — Điều phối lazy-loading cho các màn hình chính của ứng dụng.
 */

import React, { Suspense } from "react";
import GateScreen from "../screens/GateScreen";
import { ScreenLoadingFallback } from "../components/common/SharedUI";
import { CharacterModel } from "../characters/models/CharacterModel";
import { CharacterStorageService } from "../characters/services/CharacterStorageService";
import { layKhoaTheoHoSo } from "../lib/hoSo";
import type { useAppState } from "./useAppState";

const CostumeSelectScreen = React.lazy(() => import("../screens/CostumeSelectScreen"));
const QueNhaScreen = React.lazy(() => import("../screens/QueNhaScreen"));
const CostumeDetailScreen = React.lazy(() => import("../screens/CostumeDetailScreen"));
const CharacterSelectScreen = React.lazy(() => import("../screens/CharacterSelectScreen"));
const OutfitScreen = React.lazy(() => import("../screens/OutfitScreen"));
const GuiKyUcScreen = React.lazy(() => import("../screens/GuiKyUcScreen"));
const GiuChuanVanHoaScreen = React.lazy(() => import("../screens/GiuChuanVanHoaScreen"));
const ThamTuScreen = React.lazy(() => import("../screens/ThamTuScreen"));
const BanDoScreen = React.lazy(() => import("../screens/BanDoScreen"));
const DongThoiGianScreen = React.lazy(() => import("../screens/DongThoiGianScreen"));
const SoiChiChungScreen = React.lazy(() => import("../screens/SoiChiChungScreen"));
const ChoPhienScreen = React.lazy(() => import("../screens/ChoPhienScreen"));
const LeHoiVanHoaScreen = React.lazy(() => import("../screens/LeHoiVanHoaScreen"));
const AdminScreen = React.lazy(() => import("../screens/AdminScreen"));
const ChaoBanScreen = React.lazy(() => import("../screens/ChaoBanScreen"));
const NhatKyTraiNghiemScreen = React.lazy(() => import("../screens/NhatKyTraiNghiemScreen"));
const ThuDoAIScreen = React.lazy(() => import("../screens/ThuDoAIScreen"));

type AppState = ReturnType<typeof useAppState>;

export function ScreenRouter({ state }: { state: AppState }) {
  const {
    currentScreen,
    setCurrentScreen,
    activeHoSo,
    setActiveHoSo,
    setShowChaoBanModal,
    setIsChatOpen,
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
    theme,
    characterConfig,
    setCharacterConfig,
    queNhaData,
    setQueNhaData,
    currentVungId,
    weatherState,
    handleSelectVung,
    handleWearOutfitFromGui,
  } = state;

  const openGuiKyUc = (from: typeof currentScreen = "s4") => {
    setReturnScreenFromGui(from);
    setCurrentScreen("gui_ky_uc");
  };
  const openDongThoiGian = (from: typeof currentScreen = "s2") => {
    setReturnScreenFromDongThoiGian(from);
    setCurrentScreen("dong_thoi_gian");
  };
  const openSoiChiChung = (from: typeof currentScreen = "s2") => {
    setReturnScreenFromSoiChi(from);
    setCurrentScreen("soi_chi_chung");
  };
  const openChoPhien = (from: typeof currentScreen = "s2") => {
    setReturnScreenFromChoPhien(from);
    setCurrentScreen("cho_phien");
  };

  return (
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
          onOpenChoPhien={() => openChoPhien("gate")}
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
          onOpenChoPhien={() => openChoPhien("thu_do_ai")}
          onBackToCollection={() => setCurrentScreen("s2")}
        />
      )}

      {currentScreen === "que_nha" && (
        <QueNhaScreen
          onComplete={(data) => {
            setQueNhaData(data);
            setCurrentScreen("s2");
          }}
          onBackToGate={() => setCurrentScreen("gate")}
          onDirectToOutfit={(trangPhucId) => {
            setSelectedTrangPhucId(trangPhucId);
            setCurrentScreen("s4");
          }}
        />
      )}

      {currentScreen === "s2" && (
        <CostumeSelectScreen
          queNhaData={queNhaData}
          onBackToQueNha={() => setCurrentScreen("que_nha")}
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
          onOpenGuiKyUc={() => openGuiKyUc("s2")}
          onOpenThamTu={() => setCurrentScreen("tham_tu")}
          onOpenBanDo={() => setCurrentScreen("ban_do")}
          onOpenDongThoiGian={() => openDongThoiGian("s2")}
          onOpenSoiChiChung={() => openSoiChiChung("s2")}
          onOpenChoPhien={() => openChoPhien("s2")}
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
          onOpenDongThoiGian={() => openDongThoiGian("s3")}
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
          onOpenGuiKyUc={() => openGuiKyUc("s4")}
          onOpenDongThoiGian={() => openDongThoiGian("s4")}
          onOpenThuDoAI={(id) => {
            setSelectedTrangPhucId(id);
            setCurrentScreen("thu_do_ai");
          }}
          onOpenChoPhien={() => openChoPhien("s4")}
        />
      )}

      {currentScreen === "gui_ky_uc" && (
        <GuiKyUcScreen
          onBack={() => setCurrentScreen(returnScreenFromGui)}
          onWearOutfit={handleWearOutfitFromGui}
          globalNhanVatConfig={characterConfig}
          onOpenChoPhien={() => openChoPhien("gui_ky_uc")}
          onOpenChaoBan={() => setShowChaoBanModal(true)}
        />
      )}

      {currentScreen === "nhat_ky" && (
        <NhatKyTraiNghiemScreen
          onBack={() => setCurrentScreen(returnScreenFromGui || "gate")}
          onWearOutfit={handleWearOutfitFromGui}
          globalNhanVatConfig={characterConfig}
          onOpenChoPhien={() => openChoPhien("nhat_ky")}
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
            if (tpId) {
              import("../data/trangphuc")
                .then(({ trangPhuc }) => {
                  if (trangPhuc.some((t) => t.id === tpId)) setSelectedTrangPhucId(tpId);
                  setCurrentScreen("s4");
                })
                .catch(() => setCurrentScreen("s4"));
            } else {
              setCurrentScreen("s4");
            }
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
          onSelectVungOnly={(vungId) => handleSelectVung(vungId)}
          onSelectNhomAndNavigateToS2={(nhomOrCostumeId, vungId) => {
            handleSelectVung(vungId);
            import("../data/trangphuc")
              .then(({ trangPhuc }) => {
                if (trangPhuc.some((tp) => tp.id === nhomOrCostumeId)) {
                  setSelectedTrangPhucId(nhomOrCostumeId);
                  setCurrentScreen("s3");
                } else {
                  setSelectedNhomFilterForS2(nhomOrCostumeId);
                  setCurrentScreen("s2");
                }
              })
              .catch(() => {
                setSelectedNhomFilterForS2(nhomOrCostumeId);
                setCurrentScreen("s2");
              });
          }}
        />
      )}

      {currentScreen === "dong_thoi_gian" && (
        <DongThoiGianScreen
          onBack={() => setCurrentScreen(returnScreenFromDongThoiGian)}
          onRemixInS4={(costumeId) => {
            setSelectedTrangPhucId(costumeId);
            try {
              window.localStorage.removeItem(layKhoaTheoHoSo(`outfit:${costumeId}`));
            } catch {
              // ignore
            }
            setCurrentScreen("s4");
          }}
        />
      )}

      {currentScreen === "soi_chi_chung" && (
        <SoiChiChungScreen
          initialNhomAId={queNhaData.camHungIds?.[0] || queNhaData.nhomQueId || "kb"}
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
                  JSON.stringify({ trangPhucId: tpId, mauId, phuKienIds: phuKienIds || [] })
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
  );
}

