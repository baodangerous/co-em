/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TopBar (56px) — Thanh Tiêu Đề Trên Cùng
 * Tinh giản, chuyên nghiệp, đồng bộ tương phản Sáng/Tối.
 */

import { useRef, useEffect, useState, useMemo } from "react";
import WeatherChip from "./WeatherChip";
import { ThoiTietState, ThongTinViTri } from "../lib/thoitiet";
import { VungId } from "../data/vung";
import {
  Menu,
  LogOut,
  User,
  BookOpen,
  ShieldCheck,
  Flame,
  Trophy,
  Award,
  Check,
  ChevronDown,
  X,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { isCurrentUserAdmin } from "../lib/adminStore";
import FolkAudioControl from "./FolkAudioControl";
import { playFolkScreenTransition } from "../lib/audio";
import {
  daDiemDanhHomNay,
  diemDanhHomNay,
  docDuLieuStreak,
  layDanhHieuThamTu,
  layLich7NgayGanNhat,
  layMocStreakTiepTheo,
  STREAK_CHANGE_EVENT,
  STREAK_MILESTONE_EVENT,
  type CulturalStreakData,
  type StreakMilestonePayload,
} from "../lib/streak";

interface TopBarProps {
  weatherState: ThoiTietState;
  onSelectVung: (vungId: VungId) => void;
  onSelectCostume?: (trangPhucId: string) => void;
  onViTriChange?: (newViTri: ThongTinViTri) => void;
  onLogoClick?: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  onOpenAuthModal?: () => void;
  onOpenThamTu?: () => void;
}

export default function TopBar({
  weatherState,
  onSelectVung,
  onSelectCostume,
  onViTriChange,
  onLogoClick,
  onOpenAuthModal,
  onOpenThamTu,
}: TopBarProps) {
  const barRef = useRef<HTMLElement>(null);
  const { user, isLoggedIn, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showStreakPopover, setShowStreakPopover] = useState(false);
  const [milestoneBanner, setMilestoneBanner] =
    useState<StreakMilestonePayload | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const streakPopoverRef = useRef<HTMLDivElement>(null);

  const [streakData, setStreakData] = useState<CulturalStreakData>(() =>
    docDuLieuStreak()
  );

  useEffect(() => {
    const syncStreak = () => setStreakData(docDuLieuStreak());
    window.addEventListener(STREAK_CHANGE_EVENT, syncStreak);
    return () => window.removeEventListener(STREAK_CHANGE_EVENT, syncStreak);
  }, []);

  useEffect(() => {
    let timerId: number | undefined;
    const handleMilestone = (e: Event) => {
      const customEvent = e as CustomEvent<StreakMilestonePayload>;
      if (customEvent.detail) {
        setMilestoneBanner(customEvent.detail);
        try {
          playFolkScreenTransition("tham_tu");
        } catch {
          // ignore
        }
        if (timerId) window.clearTimeout(timerId);
        timerId = window.setTimeout(() => {
          setMilestoneBanner(null);
        }, 6500);
      }
    };
    window.addEventListener(STREAK_MILESTONE_EVENT, handleMilestone);
    return () => {
      window.removeEventListener(STREAK_MILESTONE_EVENT, handleMilestone);
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        streakPopoverRef.current &&
        !streakPopoverRef.current.contains(e.target as Node)
      ) {
        setShowStreakPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkedInToday = useMemo(
    () => daDiemDanhHomNay(streakData),
    [streakData]
  );
  const nextMilestone = useMemo(
    () => layMocStreakTiepTheo(streakData.currentStreak),
    [streakData.currentStreak]
  );
  const rankInfo = useMemo(
    () => layDanhHieuThamTu(streakData.tongDiem),
    [streakData.tongDiem]
  );
  const lich7Ngay = useMemo(
    () => layLich7NgayGanNhat(streakData),
    [streakData]
  );

  const handleStreakButtonClick = () => {
    if (!checkedInToday) {
      const res = diemDanhHomNay();
      setStreakData(res.data);
    }
    setShowStreakPopover((prev) => !prev);
  };

  const handleGoToThamTu = () => {
    setShowStreakPopover(false);
    if (onOpenThamTu) {
      onOpenThamTu();
    } else {
      window.dispatchEvent(new CustomEvent("vpr:open-tham-tu"));
    }
  };

  return (
    <>
      <header
        ref={barRef}
        className="vpr-top-bar"
        role="banner"
        aria-label="Thanh tiêu đề trên cùng"
      >
        <style>{`
          .vpr-top-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 56px;
            z-index: 45;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            background: var(--nen-sidebar);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--sidebar-border);
            box-sizing: border-box;
            transition: background-color 0.25s ease, border-color 0.25s ease;
          }

          @media (min-width: 1024px) {
            .vpr-top-bar {
              left: 250px;
            }
            body.sidebar-collapsed .vpr-top-bar {
              left: 72px;
            }
          }

          @media (max-width: 1023px) {
            .vpr-top-bar {
              padding: 0 10px;
            }
          }
        `}</style>

        {/* ZONE 1: MENU MOBILE VÀ TÊN ỨNG DỤNG */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("vpr:open-mobile-nav"))
            }
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-[var(--chu-chinh)] hover:border-[var(--xanh-la)] cursor-pointer shrink-0"
            aria-label="Mở thực đơn"
          >
            <Menu className="w-4 h-4 text-[var(--xanh-chinh)]" />
          </button>

          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center gap-2 group text-left cursor-pointer bg-transparent border-0 p-0"
          >
            <span className="font-serif font-bold text-lg text-[var(--chu-chinh)] group-hover:text-[var(--xanh-chinh)] transition">
              Việt Phục Remix
            </span>
          </button>
        </div>

        {/* ZONE 2: THANH STREAK NGÀY LIÊN TIẾP + CHIP THỜI TIẾT + ÂM THANH + ĐĂNG NHẬP */}
        <div className="flex items-center gap-2 font-sans">
          {/* THANH STREAK "NGÀY LIÊN TIẾP" TRÊN TOPBAR */}
          <div className="relative" ref={streakPopoverRef}>
            <button
              type="button"
              onClick={handleStreakButtonClick}
              title={
                checkedInToday
                  ? `Chuỗi ${streakData.currentStreak} ngày liên tiếp · ${streakData.tongDiem} điểm`
                  : "Nhấn để điểm danh giữ chuỗi ngày liên tiếp (+20 điểm)"
              }
              className="h-9 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] transition cursor-pointer whitespace-nowrap"
            >
              <span className="relative flex items-center justify-center shrink-0">
                <Flame
                  className={`w-3.5 h-3.5 ${
                    checkedInToday
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-amber-500"
                  }`}
                />
              </span>

              <span className="leading-none">
                {streakData.currentStreak} ngày liên tiếp
              </span>

              <ChevronDown className="w-3.5 h-3.5 text-[var(--chu-phu)] shrink-0" />
            </button>

            {/* POPOVER CHI TIẾT CHUỖI NGÀY LIÊN TIẾP */}
            {showStreakPopover && (
              <div className="absolute right-0 mt-2 w-80 p-4 bg-[var(--nen-the)] rounded-xl shadow-xl border border-[var(--vien-the)] text-[var(--chu-chinh)] z-50">
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[var(--vien-the)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--xanh-nhe)] text-[var(--xanh-chinh)] border border-[var(--vien-the)] flex flex-col items-center justify-center font-bold shrink-0">
                      <Flame className="w-4 h-4" />
                      <span className="text-xs leading-none mt-0.5">
                        {streakData.currentStreak}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[var(--chu-chinh)] m-0">
                        {streakData.currentStreak} Ngày liên tiếp
                      </h4>
                      <p className="text-xs text-[var(--chu-phu)] m-0 mt-0.5">
                        Kỷ lục: {streakData.bestStreak} ngày ·{" "}
                        {rankInfo.danhHieu} ({streakData.tongDiem}đ)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowStreakPopover(false)}
                    className="p-1 rounded-lg hover:bg-[var(--nen-the-phu)] text-[var(--chu-mo)] cursor-pointer"
                    aria-label="Đóng"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Thanh tiến độ chinh phục mốc tiếp theo */}
                <div className="my-3 p-3 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--chu-chinh)] mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
                      <span>Mốc tiếp theo: {nextMilestone.targetDays} ngày</span>
                    </span>
                    <span className="text-xs text-[var(--chu-phu)]">
                      Còn {nextMilestone.remainingDays} ngày
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--vien-the)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--xanh-chinh)] transition-all duration-500"
                      style={{ width: `${nextMilestone.progressPercent}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-2.5 text-xs text-center">
                    {[
                      { d: 3, bonus: "+25đ" },
                      { d: 7, bonus: "+50đ" },
                      { d: 14, bonus: "+75đ" },
                      { d: 30, bonus: "+120đ" },
                    ].map((m) => {
                      const reached = streakData.currentStreak >= m.d;
                      return (
                        <div
                          key={m.d}
                          className={`py-1 px-1 rounded-md border ${
                            reached
                              ? "bg-[var(--xanh-chinh)] text-white border-[var(--xanh-chinh)] font-semibold"
                              : "bg-[var(--nen-the)] text-[var(--chu-phu)] border-[var(--vien-the)]"
                          }`}
                        >
                          <div>{m.d} ngày</div>
                          <div className="opacity-85">{m.bonus}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lịch 7 ngày gần nhất */}
                <div className="mb-3">
                  <div className="flex justify-between items-center text-xs text-[var(--chu-phu)] mb-1.5">
                    <span className="font-semibold">7 ngày gần nhất</span>
                    <span className="text-[var(--xanh-chinh)] font-semibold">
                      {checkedInToday ? "Đã điểm danh hôm nay" : "Chưa điểm danh"}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {lich7Ngay.map((d) => (
                      <div
                        key={d.dateKey}
                        className={`flex flex-col items-center py-1.5 rounded-lg border text-center ${
                          d.checked
                            ? "bg-[var(--xanh-chinh)] text-white border-[var(--xanh-chinh)] font-semibold"
                            : d.isToday
                              ? "bg-[var(--vang-nhe)] text-[var(--chu-chinh)] border-[var(--vang-chinh)]"
                              : "bg-[var(--nen-the-phu)] text-[var(--chu-mo)] border-[var(--vien-the)]"
                        }`}
                      >
                        <span className="text-xs">{d.label}</span>
                        <span className="text-xs font-bold mt-0.5 flex items-center justify-center h-4">
                          {d.checked ? <Check className="w-3.5 h-3.5" /> : d.dayNum}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="flex flex-col gap-2">
                  {!checkedInToday && (
                    <button
                      type="button"
                      onClick={() => {
                        const res = diemDanhHomNay();
                        setStreakData(res.data);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-[var(--vang-chinh)] hover:opacity-95 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      Điểm danh giữ chuỗi hôm nay (+20đ)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleGoToThamTu}
                    className="w-full py-2 px-3 rounded-lg bg-[var(--xanh-chinh)] hover:opacity-95 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Vào Thám Tử Văn Hóa & Đố Vui</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <WeatherChip
              weatherState={weatherState}
              onSelectVung={onSelectVung}
              onSelectCostume={onSelectCostume}
              onViTriChange={onViTriChange}
            />
          </div>

          <FolkAudioControl />

          {!isLoggedIn ? (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="h-9 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] transition cursor-pointer whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--xanh-chinh)] shrink-0" />
              <span className="leading-none">Đăng nhập</span>
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="h-9 inline-flex items-center gap-2 px-3 rounded-xl text-xs font-semibold bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] transition cursor-pointer whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-md bg-[var(--xanh-chinh)] text-white flex items-center justify-center font-semibold text-xs shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[100px] truncate hidden md:inline leading-none">
                  {user?.name || user?.email}
                </span>
                {isCurrentUserAdmin() && (
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold leading-none">
                    Admin
                  </span>
                )}
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-60 p-3 bg-[var(--nen-the)] rounded-xl shadow-xl border border-[var(--vien-the)] text-[var(--chu-chinh)] z-50 text-xs">
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--vien-the)]">
                    <div className="w-8 h-8 rounded-lg bg-[var(--xanh-chinh)] text-white flex items-center justify-center font-semibold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold truncate text-[var(--chu-chinh)] m-0">
                        {user?.name}
                      </p>
                      <p className="text-xs text-[var(--chu-mo)] truncate m-0">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {isCurrentUserAdmin() && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.dispatchEvent(
                          new CustomEvent("vpr:open-admin-dashboard")
                        );
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 bg-emerald-500/12 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-lg transition cursor-pointer font-bold mb-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Trung tâm Quản trị (Admin)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      window.dispatchEvent(new CustomEvent("vpr:open-profile"));
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[var(--nen-the-phu)] rounded-lg transition cursor-pointer font-semibold mb-1 text-[var(--chu-chinh)]"
                  >
                    <User className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
                    <span>Hồ sơ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      window.dispatchEvent(new CustomEvent("vpr:open-nhat-ky"));
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[var(--nen-the-phu)] rounded-lg transition cursor-pointer font-semibold mb-1 text-[var(--chu-chinh)]"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
                    <span>Nhật ký</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* THÔNG BÁO CHÚC MỪNG ĐẠT MỐC STREAK MỚI */}
      {milestoneBanner && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-[66px] left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md bg-[var(--nen-the)] border border-[var(--xanh-la)] rounded-xl shadow-xl p-4 text-[var(--chu-chinh)] transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--xanh-chinh)] text-white flex flex-col items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-bold leading-none mt-0.5">
                {milestoneBanner.streakCount}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-[var(--xanh-chinh)] font-semibold">
                <span>
                  {milestoneBanner.isSpecialMilestone
                    ? "Cột mốc đặc biệt"
                    : milestoneBanner.isNewRecord
                      ? "Kỷ lục mới"
                      : "Điểm danh thành công"}
                </span>
                <span>·</span>
                <span>+{milestoneBanner.addedPoints} điểm Văn Hóa</span>
              </div>

              <h4 className="font-serif font-bold text-sm text-[var(--chu-chinh)] mt-0.5 m-0">
                Chúc mừng đạt {milestoneBanner.milestoneLabel}
              </h4>

              {milestoneBanner.bonusReason && (
                <p className="text-xs text-[var(--chu-phu)] mt-0.5 m-0">
                  {milestoneBanner.bonusReason}
                </p>
              )}

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--vien-the)] text-xs text-[var(--chu-phu)]">
                <span>Danh hiệu: {milestoneBanner.rankInfo.danhHieu}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMilestoneBanner(null);
                    handleGoToThamTu();
                  }}
                  className="font-semibold text-[var(--xanh-chinh)] hover:underline cursor-pointer"
                >
                  Thử sức Quiz ngay →
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMilestoneBanner(null)}
              className="p-1 rounded-lg hover:bg-[var(--nen-the-phu)] text-[var(--chu-mo)] cursor-pointer shrink-0"
              aria-label="Đóng thông báo chúc mừng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
