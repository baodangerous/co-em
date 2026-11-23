/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỆ THỐNG CHUỖI NGÀY ĐIỂM DANH (STREAK) & ĐIỂM THÁM TỬ VĂN HÓA
 * - Lưu trữ theo từng hồ sơ người dùng (localStorage scoped theo hoSo)
 * - Tự động ghi nhận điểm danh hàng ngày khi người dùng bấm điểm danh hoặc đăng nhập
 * - Phát sự kiện chúc mừng khi đạt chuỗi ngày liên tiếp mới hoặc mốc thưởng (3, 7, 14, 30 ngày)
 */

import { layKhoaTheoHoSo } from "./hoSo";

export const STREAK_CHANGE_EVENT = "vpr:streak-change";
export const STREAK_MILESTONE_EVENT = "vpr:streak-milestone";

export interface StreakMilestonePayload {
  streakCount: number;
  bestStreak: number;
  isNewRecord: boolean;
  isSpecialMilestone: boolean;
  milestoneLabel: string;
  addedPoints: number;
  bonusReason?: string;
  rankInfo: RankInfo;
  nextMilestoneDays: number;
}

export interface KetQuaQuizRecord {
  id: string;
  ngay: string;
  chuDe: string;
  soCauDung: number;
  tongSoCau: number;
  diemNhanDuoc: number;
  xepHang: "S" | "A" | "B" | "C";
}

export interface CulturalStreakData {
  currentStreak: number;
  bestStreak: number;
  lastCheckInDate: string | null; // YYYY-MM-DD
  checkInHistory: string[]; // Danh sách YYYY-MM-DD đã điểm danh
  checkInDates: string[]; // Alias đồng bộ cho UI
  totalPoints: number;
  tongDiem: number; // Alias đồng bộ cho UI
  solvedCaseIds: string[];
  solvedQuizIds: string[];
  tongCauDungQuiz: number;
  bestQuizScore: number;
  quizAttempts: number;
  lichSuQuiz: KetQuaQuizRecord[];
}

export interface RankInfo {
  title: string;
  danhHieu: string;
  badge: string;
  icon: string;
  minPoints: number;
  nextMinPoints: number | null;
  mucTiepTheo: number;
  tienDoPhanTram: number;
  mauSac: string;
  colorClass: string;
}

export const STREAK_MILESTONES = [1, 3, 7, 14, 21, 30, 60, 100];

export function layMocStreakTiepTheo(currentStreak: number): {
  targetDays: number;
  remainingDays: number;
  progressPercent: number;
} {
  const safeStreak = Math.max(0, currentStreak);
  const nextTarget =
    STREAK_MILESTONES.find((m) => m > safeStreak) ??
    Math.ceil((safeStreak + 1) / 10) * 10;
  const prevTarget =
    [...STREAK_MILESTONES].reverse().find((m) => m <= safeStreak) ?? 0;
  const span = Math.max(1, nextTarget - prevTarget);
  const progressPercent = Math.min(
    100,
    Math.max(8, Math.round(((safeStreak - prevTarget) / span) * 100))
  );

  return {
    targetDays: nextTarget,
    remainingDays: Math.max(0, nextTarget - safeStreak),
    progressPercent,
  };
}

const RANKS = [
  {
    title: "Tân Binh Di Sản",
    badge: "🌱",
    minPoints: 0,
    nextMinPoints: 100,
    mauSac: "#15803D",
    colorClass: "text-emerald-700 bg-emerald-50 border-emerald-300",
  },
  {
    title: "Người Yêu Cổ Phục",
    badge: "🏮",
    minPoints: 100,
    nextMinPoints: 250,
    mauSac: "#B45309",
    colorClass: "text-amber-700 bg-amber-50 border-amber-300",
  },
  {
    title: "Thám Tử Văn Hóa",
    badge: "🔍",
    minPoints: 250,
    nextMinPoints: 500,
    mauSac: "#0369A1",
    colorClass: "text-sky-700 bg-sky-50 border-sky-300",
  },
  {
    title: "Học Giả Việt Phục",
    badge: "👑",
    minPoints: 500,
    nextMinPoints: null,
    mauSac: "#BE123C",
    colorClass: "text-rose-700 bg-rose-50 border-rose-300",
  },
];

export function getTodayDateStr(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateStr(date = new Date()): string {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return getTodayDateStr(d);
}

const DEFAULT_STREAK_DATA: CulturalStreakData = {
  currentStreak: 0,
  bestStreak: 0,
  lastCheckInDate: null,
  checkInHistory: [],
  checkInDates: [],
  totalPoints: 0,
  tongDiem: 0,
  solvedCaseIds: [],
  solvedQuizIds: [],
  tongCauDungQuiz: 0,
  bestQuizScore: 0,
  quizAttempts: 0,
  lichSuQuiz: [],
};

function normalizeStreakData(
  parsed: Partial<CulturalStreakData> | null | undefined
): CulturalStreakData {
  if (!parsed || typeof parsed !== "object") {
    return { ...DEFAULT_STREAK_DATA };
  }

  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();

  let currentStreak =
    typeof parsed.currentStreak === "number" ? parsed.currentStreak : 0;
  const lastDate =
    typeof parsed.lastCheckInDate === "string" ? parsed.lastCheckInDate : null;

  // Nếu lần điểm danh cuối cùng trước cả ngày hôm qua thì chuỗi đã bị đứt
  if (lastDate && lastDate !== today && lastDate !== yesterday) {
    currentStreak = 0;
  }

  const rawHistory = Array.isArray(parsed.checkInDates)
    ? parsed.checkInDates
    : Array.isArray(parsed.checkInHistory)
      ? parsed.checkInHistory
      : [];
  const cleanHistory = Array.from(
    new Set(rawHistory.filter((d): d is string => typeof d === "string"))
  );

  const pts =
    typeof parsed.tongDiem === "number"
      ? parsed.tongDiem
      : typeof parsed.totalPoints === "number"
        ? parsed.totalPoints
        : 0;

  const solvedCases = Array.isArray(parsed.solvedCaseIds)
    ? parsed.solvedCaseIds.filter((id): id is string => typeof id === "string")
    : [];

  const solvedQuizzes = Array.isArray(parsed.solvedQuizIds)
    ? parsed.solvedQuizIds.filter((id): id is string => typeof id === "string")
    : [];

  const lichSuQuiz = Array.isArray(parsed.lichSuQuiz) ? parsed.lichSuQuiz : [];

  const tongCauDungQuiz =
    typeof parsed.tongCauDungQuiz === "number"
      ? parsed.tongCauDungQuiz
      : solvedQuizzes.length;

  return {
    currentStreak,
    bestStreak: Math.max(parsed.bestStreak ?? 0, currentStreak),
    lastCheckInDate: lastDate,
    checkInHistory: cleanHistory,
    checkInDates: cleanHistory,
    totalPoints: pts,
    tongDiem: pts,
    solvedCaseIds: solvedCases,
    solvedQuizIds: solvedQuizzes,
    tongCauDungQuiz,
    bestQuizScore: parsed.bestQuizScore ?? 0,
    quizAttempts: parsed.quizAttempts ?? lichSuQuiz.length,
    lichSuQuiz,
  };
}

export function docDuLieuStreak(): CulturalStreakData {
  if (typeof window === "undefined" || !window.localStorage) {
    return { ...DEFAULT_STREAK_DATA };
  }

  try {
    const key = layKhoaTheoHoSo("cultural_streak");
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return { ...DEFAULT_STREAK_DATA };
    }
    const parsed = JSON.parse(raw) as Partial<CulturalStreakData>;
    return normalizeStreakData(parsed);
  } catch {
    return { ...DEFAULT_STREAK_DATA };
  }
}

export function luuDuLieuStreak(data: CulturalStreakData): CulturalStreakData {
  const normalized = normalizeStreakData(data);
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const key = layKhoaTheoHoSo("cultural_streak");
      window.localStorage.setItem(key, JSON.stringify(normalized));
      window.dispatchEvent(
        new CustomEvent(STREAK_CHANGE_EVENT, { detail: normalized })
      );
    } catch {
      // ignore
    }
  }
  return normalized;
}

export function daDiemDanhHomNay(data?: CulturalStreakData): boolean {
  const target = data ? normalizeStreakData(data) : docDuLieuStreak();
  const today = getTodayDateStr();
  return (
    target.lastCheckInDate === today || target.checkInDates.includes(today)
  );
}

/**
 * Phát thông báo chúc mừng đạt mốc Streak
 */
export function phatThongBaoMocStreak(payload: StreakMilestonePayload): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(STREAK_MILESTONE_EVENT, { detail: payload })
    );
  }
}

/**
 * Thực hiện điểm danh giữ chuỗi ngày hôm nay
 */
export function diemDanhHomNay(): {
  alreadyCheckedIn: boolean;
  moiDiemDanh: boolean;
  addedPoints: number;
  diemCong: number;
  bonusReason?: string;
  data: CulturalStreakData;
} {
  const current = docDuLieuStreak();
  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();

  if (
    current.lastCheckInDate === today ||
    current.checkInDates.includes(today)
  ) {
    return {
      alreadyCheckedIn: true,
      moiDiemDanh: false,
      addedPoints: 0,
      diemCong: 0,
      data: current,
    };
  }

  const nextStreak =
    current.lastCheckInDate === yesterday ? current.currentStreak + 1 : 1;
  const isNewRecord = nextStreak > current.bestStreak;
  const bestStreak = Math.max(current.bestStreak, nextStreak);

  let addedPoints = 20;
  let bonusReason: string | undefined;
  let isSpecialMilestone = false;

  if (nextStreak % 30 === 0) {
    addedPoints += 120;
    isSpecialMilestone = true;
    bonusReason = `Kỳ tích ${nextStreak} ngày liên tiếp giữ lửa di sản (+120 điểm thưởng)!`;
  } else if (nextStreak % 14 === 0) {
    addedPoints += 75;
    isSpecialMilestone = true;
    bonusReason = `Chinh phục mốc ${nextStreak} ngày liên tiếp (+75 điểm thưởng)!`;
  } else if (nextStreak % 7 === 0) {
    addedPoints += 50;
    isSpecialMilestone = true;
    bonusReason = `Tuyệt vời! Trọn tuần ${nextStreak} ngày liên tiếp (+50 điểm thưởng)!`;
  } else if (nextStreak % 3 === 0) {
    addedPoints += 25;
    isSpecialMilestone = true;
    bonusReason = `Đạt mốc ${nextStreak} ngày liên tiếp (+25 điểm thưởng)!`;
  } else if (nextStreak === 1) {
    bonusReason = "Khởi đầu chuỗi ngày giữ lửa văn hóa Việt!";
  } else {
    bonusReason = `Duy trì chuỗi ${nextStreak} ngày liên tiếp không ngắt quãng!`;
  }

  const historySet = new Set([...current.checkInDates, today]);
  const updatedHistory = Array.from(historySet).slice(-30);
  const nextPoints = current.tongDiem + addedPoints;

  const updated = luuDuLieuStreak({
    ...current,
    currentStreak: nextStreak,
    bestStreak,
    lastCheckInDate: today,
    checkInHistory: updatedHistory,
    checkInDates: updatedHistory,
    totalPoints: nextPoints,
    tongDiem: nextPoints,
  });

  const nextMilestone = layMocStreakTiepTheo(nextStreak);
  const rankInfo = layDanhHieuThamTu(nextPoints);

  phatThongBaoMocStreak({
    streakCount: nextStreak,
    bestStreak,
    isNewRecord,
    isSpecialMilestone,
    milestoneLabel: isSpecialMilestone
      ? `Mốc Vàng ${nextStreak} Ngày Liên Tiếp!`
      : isNewRecord
        ? `Kỷ Lục Mới: ${nextStreak} Ngày Liên Tiếp!`
        : `Chuỗi ${nextStreak} Ngày Liên Tiếp!`,
    addedPoints,
    bonusReason,
    rankInfo,
    nextMilestoneDays: nextMilestone.targetDays,
  });

  return {
    alreadyCheckedIn: false,
    moiDiemDanh: true,
    addedPoints,
    diemCong: addedPoints,
    bonusReason,
    data: updated,
  };
}

/**
 * Cộng điểm khi giải đúng ca Thám Tử Giám Định 2D
 */
export function ghiNhanGiaiCaThamTu(
  caseId: string,
  basePoints = 15
): {
  addedPoints: number;
  diemCong: number;
  isFirstTime: boolean;
  lanDau: boolean;
  data: CulturalStreakData;
} {
  let current = docDuLieuStreak();

  // Tự động điểm danh nếu hôm nay chưa điểm danh
  if (!daDiemDanhHomNay(current)) {
    current = diemDanhHomNay().data;
  }

  const isFirstTime = !current.solvedCaseIds.includes(caseId);
  const addedPoints = isFirstTime ? basePoints : 5;
  const nextPoints = current.tongDiem + addedPoints;

  const updated = luuDuLieuStreak({
    ...current,
    totalPoints: nextPoints,
    tongDiem: nextPoints,
    solvedCaseIds: isFirstTime
      ? [...current.solvedCaseIds, caseId]
      : current.solvedCaseIds,
  });

  return {
    addedPoints,
    diemCong: addedPoints,
    isFirstTime,
    lanDau: isFirstTime,
    data: updated,
  };
}

/**
 * Cộng điểm sau khi hoàn thành một lượt Quiz Trắc Nghiệm
 */
export function ghiNhanKetQuaQuiz(
  soCauDung: number,
  tongSoCau: number,
  chuDe = "Đố vui Văn Hóa"
): {
  data: CulturalStreakData;
  record: KetQuaQuizRecord;
  autoCheckedIn: boolean;
} {
  let current = docDuLieuStreak();
  let autoCheckedIn = false;

  if (!daDiemDanhHomNay(current)) {
    const checkInRes = diemDanhHomNay();
    current = checkInRes.data;
    autoCheckedIn = checkInRes.moiDiemDanh;
  }

  const safeTotal = Math.max(1, tongSoCau);
  const ratio = soCauDung / safeTotal;
  const xepHang: "S" | "A" | "B" | "C" =
    ratio >= 0.9 ? "S" : ratio >= 0.75 ? "A" : ratio >= 0.5 ? "B" : "C";

  const bonusHang =
    xepHang === "S" ? 30 : xepHang === "A" ? 20 : xepHang === "B" ? 10 : 5;
  const diemNhanDuoc = soCauDung * 15 + bonusHang;
  const nextPoints = current.tongDiem + diemNhanDuoc;

  const record: KetQuaQuizRecord = {
    id: `quiz_${Date.now()}`,
    ngay: getTodayDateStr(),
    chuDe,
    soCauDung,
    tongSoCau: safeTotal,
    diemNhanDuoc,
    xepHang,
  };

  const updated = luuDuLieuStreak({
    ...current,
    totalPoints: nextPoints,
    tongDiem: nextPoints,
    tongCauDungQuiz: current.tongCauDungQuiz + soCauDung,
    bestQuizScore: Math.max(current.bestQuizScore, diemNhanDuoc),
    quizAttempts: current.quizAttempts + 1,
    lichSuQuiz: [record, ...current.lichSuQuiz].slice(0, 20),
  });

  return { data: updated, record, autoCheckedIn };
}

/**
 * Lấy thông tin danh hiệu hiện tại dựa trên tổng điểm
 */
export function layDanhHieuThamTu(points = 0): RankInfo {
  const safePoints =
    typeof points === "number" && !Number.isNaN(points) ? points : 0;
  let chosen = RANKS[0];

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (safePoints >= RANKS[i].minPoints) {
      chosen = RANKS[i];
      break;
    }
  }

  const mucTiepTheo = chosen.nextMinPoints ?? Math.max(safePoints, 600);
  const span = Math.max(1, mucTiepTheo - chosen.minPoints);
  const tienDoPhanTram = chosen.nextMinPoints
    ? Math.min(
        100,
        Math.max(
          5,
          Math.round(((safePoints - chosen.minPoints) / span) * 100)
        )
      )
    : 100;

  return {
    title: chosen.title,
    danhHieu: chosen.title,
    badge: chosen.badge,
    icon: chosen.badge,
    minPoints: chosen.minPoints,
    nextMinPoints: chosen.nextMinPoints,
    mucTiepTheo,
    tienDoPhanTram,
    mauSac: chosen.mauSac,
    colorClass: chosen.colorClass,
  };
}

/**
 * Lấy danh sách 7 ngày gần nhất (từ 6 ngày trước đến hôm nay) để hiển thị thanh lịch Streak
 * Hỗ trợ truyền vào cả CulturalStreakData hoặc mảng string[]
 */
export function layLich7NgayGanNhat(
  input?: CulturalStreakData | string[] | null
): Array<{
  dateKey: string;
  dateStr: string;
  label: string;
  dayNum: string;
  checked: boolean;
  isToday: boolean;
}> {
  const historyList: string[] = Array.isArray(input)
    ? input
    : input && typeof input === "object"
      ? Array.isArray(input.checkInDates)
        ? input.checkInDates
        : Array.isArray(input.checkInHistory)
          ? input.checkInHistory
          : []
      : docDuLieuStreak().checkInDates;

  const result = [];
  const today = new Date();
  const todayStr = getTodayDateStr(today);
  const thuLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const dStr = getTodayDateStr(d);
    result.push({
      dateKey: dStr,
      dateStr: dStr,
      label: offset === 0 ? "H.Nay" : thuLabels[d.getDay()],
      dayNum: String(d.getDate()).padStart(2, "0"),
      checked: historyList.includes(dStr),
      isToday: dStr === todayStr,
    });
  }

  return result;
}
