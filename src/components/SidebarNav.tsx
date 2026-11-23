/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SidebarNav — Cột Điều Hướng Bên Trái (Tinh giản, Chuyên nghiệp, Tương phản Sáng/Tối chuẩn WCAG)
 */

import React, { useState, useEffect } from "react";
import CoLogo from "./CoLogo";
import Tooltip from "./Tooltip";
import { ThemeMode } from "../lib/theme";
import { HoSo } from "../lib/hoSo";
import {
  Home,
  CloudSun,
  Palette,
  Bookmark,
  Map,
  Store,
  Shirt,
  Sliders,
  Sun,
  Moon,
  User,
  X,
  Camera,
  Award,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { isCurrentUserAdmin, ADMIN_DATA_CHANGE_EVENT } from "../lib/adminAuth";
import { AUTH_CHANGE_EVENT } from "../lib/auth";

export type Screen =
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

interface NavItem {
  id: Screen;
  matchScreens?: Screen[];
  label: string;
  icon: LucideIcon;
  tooltip: string;
  /** Bảng màu riêng biệt cho từng mục để thanh điều hướng sinh động, bắt mắt */
  iconBgClass: string;
  iconColorClass: string;
  activeGradClass: string;
  activeRowBgLight: string;
  activeRowBorderLight: string;
  activeTextLight: string;
  dotColor: string;
  badge?: string;
}

interface NavGroup {
  title: string;
  accentColor: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Khám Phá",
    accentColor: "#10B981",
    items: [
      {
        id: "gate",
        label: "Trang Chủ",
        icon: Home,
        tooltip: "Tổng quan hệ thống Việt Phục Remix",
        iconBgClass: "bg-emerald-500/12 border-emerald-500/30",
        iconColorClass: "text-emerald-600 dark:text-emerald-400",
        activeGradClass: "from-emerald-600 to-teal-600",
        activeRowBgLight: "rgba(16, 185, 129, 0.12)",
        activeRowBorderLight: "rgba(16, 185, 129, 0.45)",
        activeTextLight: "#065F46",
        dotColor: "#10B981",
      },
      {
        id: "s2",
        matchScreens: ["s2", "s3"],
        label: "Bộ Sưu Tập",
        icon: Shirt,
        tooltip: "Tra cứu kho Việt phục & Sắc phục 54 dân tộc",
        iconBgClass: "bg-amber-500/14 border-amber-500/35",
        iconColorClass: "text-amber-600 dark:text-amber-400",
        activeGradClass: "from-amber-500 to-orange-600",
        activeRowBgLight: "rgba(245, 158, 11, 0.14)",
        activeRowBorderLight: "rgba(245, 158, 11, 0.5)",
        activeTextLight: "#92400E",
        dotColor: "#F59E0B",
      },
      {
        id: "le_hoi",
        label: "Lễ Hội & Sự Kiện",
        icon: Calendar,
        tooltip: "Gợi ý trang phục theo dịp lễ hội Việt Nam & Quy tắc mặc chuẩn văn hóa",
        iconBgClass: "bg-orange-500/14 border-orange-500/35",
        iconColorClass: "text-orange-600 dark:text-orange-400",
        activeGradClass: "from-orange-500 to-rose-600",
        activeRowBgLight: "rgba(249, 115, 22, 0.14)",
        activeRowBorderLight: "rgba(249, 115, 22, 0.5)",
        activeTextLight: "#9A3412",
        dotColor: "#F97316",
      },
      {
        id: "ban_do",
        matchScreens: ["ban_do", "dong_thoi_gian", "soi_chi_chung"],
        label: "Bản Đồ & Lịch Sử",
        icon: Map,
        tooltip: "Bản đồ văn hóa, Dòng lịch sử & Đối chiếu dân tộc",
        iconBgClass: "bg-sky-500/12 border-sky-500/30",
        iconColorClass: "text-sky-600 dark:text-sky-400",
        activeGradClass: "from-sky-500 to-blue-600",
        activeRowBgLight: "rgba(14, 165, 233, 0.12)",
        activeRowBorderLight: "rgba(14, 165, 233, 0.45)",
        activeTextLight: "#075985",
        dotColor: "#0EA5E9",
      },
    ],
  },
  {
    title: "Xưởng Phối & Thử Đồ",
    accentColor: "#8B5CF6",
    items: [
      {
        id: "s4",
        matchScreens: ["s4", "nhan_vat"],
        label: "Phối Đồ 2D",
        icon: Palette,
        tooltip: "Phối màu sắc, chất liệu, phụ kiện & tạo dáng nhân vật 2D",
        iconBgClass: "bg-teal-500/12 border-teal-500/30",
        iconColorClass: "text-teal-600 dark:text-teal-400",
        activeGradClass: "from-teal-600 to-emerald-600",
        activeRowBgLight: "rgba(20, 184, 166, 0.12)",
        activeRowBorderLight: "rgba(20, 184, 166, 0.45)",
        activeTextLight: "#115E59",
        dotColor: "#14B8A6",
      },
      {
        id: "thu_do_ai",
        label: "Thử Đồ AI & 3D",
        icon: Camera,
        tooltip: "Ghép chỉnh trang phục trên ảnh cá nhân & Bóc tách lớp áo 3D",
        iconBgClass: "bg-violet-500/12 border-violet-500/30",
        iconColorClass: "text-violet-600 dark:text-violet-400",
        activeGradClass: "from-violet-600 to-purple-600",
        activeRowBgLight: "rgba(139, 92, 246, 0.12)",
        activeRowBorderLight: "rgba(139, 92, 246, 0.45)",
        activeTextLight: "#5B21B6",
        dotColor: "#8B5CF6",
      },
      {
        id: "que_nha",
        label: "Gợi Ý Bối Cảnh",
        icon: CloudSun,
        tooltip: "Chọn dịp lễ, vùng miền để nhận gợi ý trang phục phù hợp",
        iconBgClass: "bg-orange-500/12 border-orange-500/30",
        iconColorClass: "text-orange-600 dark:text-orange-400",
        activeGradClass: "from-orange-500 to-amber-600",
        activeRowBgLight: "rgba(249, 115, 22, 0.12)",
        activeRowBorderLight: "rgba(249, 115, 22, 0.45)",
        activeTextLight: "#9A3412",
        dotColor: "#F97316",
      },
    ],
  },
  {
    title: "Cộng Đồng & Cá Nhân",
    accentColor: "#F43F5E",
    items: [
      {
        id: "cho_phien",
        label: "Chợ Phiên & Làng Nghề",
        icon: Store,
        tooltip: "Giao lưu bản phối cộng đồng, Kết nối làng nghề & Workshop di sản",
        iconBgClass: "bg-rose-500/12 border-rose-500/30",
        iconColorClass: "text-rose-600 dark:text-rose-400",
        activeGradClass: "from-rose-600 to-red-600",
        activeRowBgLight: "rgba(244, 63, 94, 0.12)",
        activeRowBorderLight: "rgba(244, 63, 94, 0.45)",
        activeTextLight: "#9F1239",
        dotColor: "#F43F5E",
      },
      {
        id: "gui_ky_uc",
        matchScreens: ["gui_ky_uc", "nhat_ky"],
        label: "Gùi Ký Ức & Nhật Ký",
        icon: Bookmark,
        tooltip: "Tủ đồ lưu trữ cá nhân & Nhật ký trải nghiệm",
        iconBgClass: "bg-indigo-500/12 border-indigo-500/30",
        iconColorClass: "text-indigo-600 dark:text-indigo-400",
        activeGradClass: "from-indigo-600 to-blue-700",
        activeRowBgLight: "rgba(99, 102, 241, 0.12)",
        activeRowBorderLight: "rgba(99, 102, 241, 0.45)",
        activeTextLight: "#3730A3",
        dotColor: "#6366F1",
      },
      {
        id: "tham_tu",
        label: "Thám Tử Văn Hóa",
        icon: Award,
        tooltip: "Đấu trường trắc nghiệm văn hóa & Giám định phối đồ 2D",
        iconBgClass: "bg-yellow-500/15 border-yellow-500/35",
        iconColorClass: "text-amber-600 dark:text-yellow-400",
        activeGradClass: "from-amber-500 to-red-600",
        activeRowBgLight: "rgba(234, 179, 8, 0.15)",
        activeRowBorderLight: "rgba(234, 179, 8, 0.5)",
        activeTextLight: "#854D0E",
        dotColor: "#EAB308",
      },
    ],
  },
];

interface SidebarNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeHoSo: HoSo;
  onOpenChaoBan: () => void;
  onOpenTraiNghiem: () => void;
  hasActiveTraiNghiem: boolean;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
  showGoiYBtn?: boolean;
  onOpenGoiY?: () => void;
}

export default function SidebarNav({
  currentScreen,
  onNavigate,
  theme,
  onToggleTheme,
  activeHoSo,
  onOpenChaoBan,
  onOpenTraiNghiem,
  hasActiveTraiNghiem,
}: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return (
        typeof window !== "undefined" &&
        window.localStorage.getItem("vpr:sidebar_collapsed") === "true"
      );
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setAdminTick] = useState(0);

  useEffect(() => {
    const syncAdmin = () => setAdminTick((t) => t + 1);
    window.addEventListener(AUTH_CHANGE_EVENT, syncAdmin);
    window.addEventListener(ADMIN_DATA_CHANGE_EVENT, syncAdmin);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncAdmin);
      window.removeEventListener(ADMIN_DATA_CHANGE_EVENT, syncAdmin);
    };
  }, []);

  useEffect(() => {
    const handleOpenMobile = () => setMobileOpen(true);
    window.addEventListener("vpr:open-mobile-nav", handleOpenMobile);
    return () =>
      window.removeEventListener("vpr:open-mobile-nav", handleOpenMobile);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isCollapsed) {
        document.body.classList.add("sidebar-collapsed");
        document.body.classList.remove("sidebar-expanded");
      } else {
        document.body.classList.add("sidebar-expanded");
        document.body.classList.remove("sidebar-collapsed");
      }
    }
    try {
      window.localStorage.setItem(
        "vpr:sidebar_collapsed",
        isCollapsed ? "true" : "false"
      );
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  const handleSelectNav = (id: Screen) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const isLight = theme === "light";
  const hasAdminAccess = isCurrentUserAdmin();

  const visibleGroups: NavGroup[] = hasAdminAccess
    ? [
        ...NAV_GROUPS,
        {
          title: "Quản Trị Hệ Thống",
          accentColor: "#10B981",
          items: [
            {
              id: "admin",
              label: "Quản Trị Dự Án",
              icon: ShieldCheck,
              tooltip: "Phân quyền Admin: Quản lý dự án, tài khoản, duyệt bài, trang phục, làng nghề & workshop",
              iconBgClass: "bg-emerald-500/15 border-emerald-500/40",
              iconColorClass: "text-emerald-600 dark:text-emerald-400",
              activeGradClass: "from-emerald-600 to-teal-700",
              activeRowBgLight: "rgba(16, 185, 129, 0.14)",
              activeRowBorderLight: "rgba(16, 185, 129, 0.5)",
              activeTextLight: "#065F46",
              dotColor: "#10B981",
              badge: "Admin",
            },
          ],
        },
      ]
    : NAV_GROUPS;

  return (
    <>
      <style>{`
        .vpr-sidebar-nav {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          background: var(--nen-sidebar);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid var(--sidebar-border);
          box-shadow: 2px 0 18px -4px rgba(15, 23, 42, 0.08);
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          width: 250px;
        }

        @media (min-width: 1024px) {
          .vpr-sidebar-nav.is-collapsed {
            width: 72px;
          }
        }

        @media (max-width: 1023px) {
          .vpr-sidebar-nav {
            transform: translateX(-100%);
            width: 260px !important;
          }
          .vpr-sidebar-nav.is-mobile-open {
            transform: translateX(0);
          }
        }

        .vpr-sidebar-backdrop {
          position: fixed;
          inset: 0;
          z-index: 48;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
        }

        .vpr-nav-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 10px;
          border-radius: 12px !important;
          background: transparent;
          border: 1px solid transparent;
          color: var(--chu-chinh);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          white-space: nowrap;
          box-sizing: border-box;
        }

        @media (min-width: 1024px) {
          .vpr-sidebar-nav.is-collapsed .vpr-nav-row {
            justify-content: center;
            padding: 8px 0;
          }
        }

        .vpr-nav-row:hover {
          background: var(--nen-the-phu);
          border-color: var(--vien-the);
          transform: translateX(2px);
        }
      `}</style>

      {mobileOpen && (
        <div
          className="vpr-sidebar-backdrop lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`vpr-sidebar-nav ${mobileOpen ? "is-mobile-open" : ""} ${
          isCollapsed ? "is-collapsed" : ""
        }`}
        aria-label="Thanh công cụ điều hướng chính"
      >
        {/* Dải sắc màu thổ cẩm trên đỉnh Sidebar */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 shrink-0" />

        {/* HEADER: LOGO & NÚT THU GỌN SIDEBAR */}
        <div
          className={`flex items-center ${
            isCollapsed ? "lg:justify-center lg:px-2" : "justify-between px-3.5"
          } h-[56px] border-b border-[var(--sidebar-border)] gap-1 shrink-0`}
        >
          {!isCollapsed && (
            <CoLogo
              size="sm"
              showText={true}
              onClick={() => handleSelectNav("gate")}
            />
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            title={
              isCollapsed
                ? "Mở rộng thanh điều hướng"
                : "Thu gọn thanh điều hướng"
            }
            aria-label={
              isCollapsed
                ? "Mở rộng thanh điều hướng"
                : "Thu gọn thanh điều hướng"
            }
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] transition cursor-pointer shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-[var(--xanh-chinh)]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-[var(--chu-phu)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--chu-phu)] hover:bg-[var(--nen-the-phu)]"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CÁC NHÓM DANH MỤC ĐIỀU HƯỚNG ĐA SẮC MÀU DI SẢN */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
          {visibleGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase text-[var(--chu-phu)] px-2 pb-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: group.accentColor }}
                  />
                  <span>{group.title}</span>
                </div>
              )}

              {group.items.map((item) => {
                const isActive = item.matchScreens
                  ? item.matchScreens.includes(currentScreen)
                  : currentScreen === item.id;
                const IconComponent = item.icon;

                return (
                  <Tooltip
                    key={item.id}
                    title={item.label}
                    content={item.tooltip}
                    position="right"
                    disabled={!isCollapsed}
                    asBlock
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectNav(item.id)}
                      className="vpr-nav-row group"
                      style={
                        isActive
                          ? {
                              background: isLight
                                ? item.activeRowBgLight
                                : "rgba(255, 255, 255, 0.08)",
                              borderColor: isLight
                                ? item.activeRowBorderLight
                                : item.dotColor,
                              color: isLight ? item.activeTextLight : "#F8FAFC",
                              fontWeight: 700,
                              boxShadow: "0 4px 12px -4px rgba(0, 0, 0, 0.08)",
                            }
                          : undefined
                      }
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 border ${
                          isActive
                            ? `bg-gradient-to-br ${item.activeGradClass} text-white border-transparent shadow-xs scale-105`
                            : `${item.iconBgClass} ${item.iconColorClass} group-hover:scale-105`
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </span>

                      {!isCollapsed && (
                        <>
                          <span className="text-xs font-semibold truncate flex-1 text-left">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                              {item.badge}
                            </span>
                          )}
                          {isActive && (
                            <span
                              className="w-1.5 h-4 rounded-full shrink-0"
                              style={{ backgroundColor: item.dotColor }}
                            />
                          )}
                        </>
                      )}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        {/* FOOTER: GIAO DIỆN SÁNG/TỐI, CÀI ĐẶT & HỒ SƠ */}
        <div className="p-2.5 border-t border-[var(--sidebar-border)] bg-[var(--nen-the-phu)]/90 space-y-1.5">
          <div className={`grid ${isCollapsed ? "grid-cols-1" : "grid-cols-2"} gap-1.5`}>
            <button
              type="button"
              onClick={onToggleTheme}
              title={
                isLight ? "Đổi sang Giao diện Tối" : "Đổi sang Giao diện Sáng"
              }
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[var(--nen-the)] border border-amber-500/30 hover:border-amber-500 text-[var(--chu-chinh)] text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              {isLight ? (
                <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              )}
              {!isCollapsed && (
                <span className="truncate">{isLight ? "Sáng" : "Tối"}</span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenTraiNghiem}
              title="Cài đặt hiển thị"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[var(--nen-the)] border border-teal-500/30 hover:border-teal-500 text-[var(--chu-chinh)] text-xs font-semibold transition cursor-pointer relative shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              {!isCollapsed && <span className="truncate">Cài đặt</span>}
              {hasActiveTraiNghiem && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenChaoBan}
            title={`Hồ sơ: ${activeHoSo.tenHienThi}`}
            className={`w-full flex items-center ${
              isCollapsed ? "lg:justify-center" : "gap-2.5"
            } p-2 rounded-xl bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-left transition-all border border-emerald-500/30 cursor-pointer`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <User className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && (
              <div className="flex items-center justify-between min-w-0 flex-1">
                <span className="text-xs font-bold text-[var(--chu-chinh)] truncate">
                  {activeHoSo.tenHienThi}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600/15 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 shrink-0 ml-1">
                  Hồ sơ
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

