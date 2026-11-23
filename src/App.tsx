/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * App.tsx — Bộ điều phối giao diện trung tâm gọn nhẹ (Shell + Layout + Modals)
 */

import React, { Suspense } from "react";
import BauTroi from "./components/BauTroi";
import TopBar from "./components/TopBar";
import SidebarNav from "./components/SidebarNav";
import { TooltipProvider } from "./components/Tooltip";
import { SubNavTabs } from "./components/common/SharedUI";
import { useAppState } from "./app/useAppState";
import { ScreenRouter } from "./app/ScreenRouter";

const GiuChuanVanHoaScreen = React.lazy(() => import("./screens/GiuChuanVanHoaScreen"));
const ChaoBanScreen = React.lazy(() => import("./screens/ChaoBanScreen"));
const CaiDatTraiNghiemModal = React.lazy(() => import("./components/CaiDatTraiNghiemModal"));
const AuthModal = React.lazy(() => import("./components/AuthModal"));

export default function App() {
  const state = useAppState();
  const {
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
    setSelectedTrangPhucId,
    setReturnScreenFromDongThoiGian,
    setReturnScreenFromSoiChi,
    giuChuanModal,
    setGiuChuanModal,
    theme,
    weatherState,
    handleSelectVung,
    handleViTriChange,
    handleToggleTheme,
    handleNavigateFromSidebar,
  } = state;

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        <BauTroi
          vungId={weatherState.vung.id}
          khungGio={weatherState.khungGio}
          thoiTiet={weatherState.thoiTiet}
          theme={theme}
        />

        {currentScreen !== "chao_ban" && (
          <TopBar
            weatherState={weatherState}
            onSelectVung={handleSelectVung}
            onSelectCostume={(tpId) => {
              setSelectedTrangPhucId(tpId);
              setCurrentScreen("s3");
            }}
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
                  setReturnScreenFromDongThoiGian("ban_do");
                  setCurrentScreen("dong_thoi_gian");
                } else if (tabId === "soi_chi_chung") {
                  setReturnScreenFromSoiChi("ban_do");
                  setCurrentScreen("soi_chi_chung");
                } else {
                  setCurrentScreen("ban_do");
                }
              }}
            />
          )}

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

          <ScreenRouter state={state} />
        </div>

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

          {isAuthModalOpen && (
            <AuthModal
              isOpen={isAuthModalOpen}
              initialMode={authModalMode}
              onClose={() => setIsAuthModalOpen(false)}
            />
          )}
        </Suspense>

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
          onOpenGoiY={() => window.dispatchEvent(new CustomEvent("vpr:open-goi-y"))}
        />
      </div>
    </TooltipProvider>
  );
}
