import React, { useEffect, useMemo, useState } from "react";
import {
  caThamTu,
  cauHoiQuizThamTu,
  tronCauHoiVaDapAn,
  type CauHoiQuizThamTu,
  type VungKiemTraThamTu,
} from "../data/tham_tu";
import { NhanVatConfig } from "../lib/avatar";
import {
  Award,
  Flame,
  Check,
  X,
  RotateCcw,
  ArrowLeft,
  Palette,
  ChevronRight,
  Shuffle,
  Zap,
  Trophy,
  Stamp,
} from "lucide-react";
import {
  daDiemDanhHomNay,
  diemDanhHomNay,
  docDuLieuStreak,
  ghiNhanGiaiCaThamTu,
  ghiNhanKetQuaQuiz,
  layDanhHieuThamTu,
  type CulturalStreakData,
  type KetQuaQuizRecord,
} from "../lib/streak";
import {
  docSoThongHanh,
  thuongDauThamTuNgauNhien,
  PASSPORT_CHANGE_EVENT,
  type CulturalPassportData,
} from "../data/le_hoi_di_san";
import CulturalPassportModal from "../components/CulturalPassportModal";
import ThamTuInspector2DView, {
  Mannequin2DPreview,
  OPTION_GAME_THEMES,
} from "../components/tham-tu/ThamTuInspector2DView";
import { playFolkPluck, playSilverBell } from "../lib/audio";

export interface ThamTuScreenProps {
  onProceedToS4?: (trangPhucId?: string) => void;
  onSkipToS4?: () => void;
  onBackToS2?: () => void;
  nhanVatConfig?: NhanVatConfig;
  onBack?: () => void;
  onUnlockLore?: () => void;
}

type ThamTuMode = "giam_dinh_2d" | "quiz_van_hoa";
type ChuDeFilter =
  | "tat_ca_20"
  | "dau_nhanh_10"
  | "Cổ phục Triều Nguyễn"
  | "Việt phục Ba Miền"
  | "Sắc phục Dân tộc"
  | "Chất liệu & Làng nghề";

export function ThamTuScreen({
  onProceedToS4,
  onBackToS2,
  onBack,
  onUnlockLore,
}: ThamTuScreenProps) {
  const [mode, setMode] = useState<ThamTuMode>("quiz_van_hoa");
  const [streakState, setStreakState] = useState<CulturalStreakData>(() =>
    docDuLieuStreak()
  );
  const [checkInToast, setCheckInToast] = useState<string | null>(null);
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);
  const [passportData, setPassportData] = useState<CulturalPassportData>(() =>
    docSoThongHanh()
  );
  const [passportStampToast, setPassportStampToast] = useState<string | null>(
    null
  );

  // --- Mode 1: Giám định 2D (12 Ca Thám Tử) ---
  const [caseShuffleSeed, setCaseShuffleSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedZone, setSelectedZone] = useState<VungKiemTraThamTu | null>(
    null
  );
  const [isCorrectCase, setIsCorrectCase] = useState<boolean | null>(null);
  const [casePointMessage, setCasePointMessage] = useState<string | null>(null);

  // --- Mode 2: Đố Vui Trắc Nghiệm (20 Câu Hỏi) ---
  const [chuDeQuiz, setChuDeQuiz] = useState<ChuDeFilter>("dau_nhanh_10");
  const [quizShuffleSeed, setQuizShuffleSeed] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<
    Record<string, { chon: number; dung: boolean; diem: number }>
  >({});
  const [comboCount, setComboCount] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [quizCompletedRecord, setQuizCompletedRecord] =
    useState<KetQuaQuizRecord | null>(null);

  useEffect(() => {
    const syncStreak = () => setStreakState(docDuLieuStreak());
    window.addEventListener("vpr:streak-change", syncStreak);
    return () => window.removeEventListener("vpr:streak-change", syncStreak);
  }, []);

  useEffect(() => {
    const syncPassport = () => setPassportData(docSoThongHanh());
    window.addEventListener(PASSPORT_CHANGE_EVENT, syncPassport);
    return () => window.removeEventListener(PASSPORT_CHANGE_EVENT, syncPassport);
  }, []);

  const stampedCount = Object.keys(passportData.stamps).length;

  const danhHieu = useMemo(
    () => layDanhHieuThamTu(streakState.tongDiem),
    [streakState.tongDiem]
  );
  const checkedInToday = useMemo(
    () => daDiemDanhHomNay(streakState),
    [streakState]
  );

  const danhSachCauHoiQuiz: CauHoiQuizThamTu[] = useMemo(() => {
    void quizShuffleSeed;
    if (chuDeQuiz === "tat_ca_20") {
      return tronCauHoiVaDapAn(cauHoiQuizThamTu);
    }
    if (chuDeQuiz === "dau_nhanh_10") {
      return tronCauHoiVaDapAn(cauHoiQuizThamTu, 10);
    }
    const theoChuDe = cauHoiQuizThamTu.filter((q) => q.chuDe === chuDeQuiz);
    return tronCauHoiVaDapAn(theoChuDe);
  }, [chuDeQuiz, quizShuffleSeed]);

  const danhSachCaThamTu = useMemo(() => {
    void caseShuffleSeed;
    const copy = [...caThamTu];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }, [caseShuffleSeed]);

  const currentQuestion =
    danhSachCauHoiQuiz[quizIndex] || danhSachCauHoiQuiz[0];

  const handleBackNavigation = () => {
    if (onBack) onBack();
    else if (onBackToS2) onBackToS2();
  };

  const handleCheckInToday = () => {
    playSilverBell();
    const res = diemDanhHomNay();
    setStreakState(res.data);
    setCheckInToast(
      res.moiDiemDanh
        ? `Điểm danh thành công (+${res.diemCong}đ)`
        : `Hôm nay đã điểm danh (${res.data.currentStreak} ngày)`
    );
    window.setTimeout(() => setCheckInToast(null), 3000);
  };

  // --- Logic Mode 1: Giám định 2D ---
  const currentCa = danhSachCaThamTu[currentIndex] || danhSachCaThamTu[0];

  const handleSelectZone = (zone: VungKiemTraThamTu) => {
    setSelectedZone(zone);
    const correct = zone === currentCa.vungDung;
    setIsCorrectCase(correct);

    if (correct) {
      playSilverBell();
      onUnlockLore?.();
      const res = ghiNhanGiaiCaThamTu(currentCa.id, currentCa.diemThuong);
      setStreakState(res.data);
      setCasePointMessage(`+${res.diemCong}đ`);

      const stampRes = thuongDauThamTuNgauNhien();
      setPassportData(stampRes.data);
      if (stampRes.newlyStamped) {
        setPassportStampToast(
          `Mở khóa dấu Triện Son: Dân tộc ${stampRes.newlyStamped.ten}!`
        );
        window.setTimeout(() => setPassportStampToast(null), 4000);
      }
    } else {
      playFolkPluck(0);
      setCasePointMessage(null);
    }
  };

  const handleSelectCaseIndex = (idx: number) => {
    playFolkPluck(idx);
    setCurrentIndex(idx);
    setSelectedZone(null);
    setIsCorrectCase(null);
    setCasePointMessage(null);
  };

  const handleNextCase = () => {
    handleSelectCaseIndex((currentIndex + 1) % danhSachCaThamTu.length);
  };

  const handleShuffleCases = () => {
    playFolkPluck();
    setCaseShuffleSeed((s) => s + 1);
    setCurrentIndex(0);
    setSelectedZone(null);
    setIsCorrectCase(null);
    setCasePointMessage(null);
  };

  // --- Logic Mode 2: Quiz Trắc Nghiệm ---
  const handleChangeQuizFilter = (newFilter: ChuDeFilter) => {
    playFolkPluck();
    setChuDeQuiz(newFilter);
    setQuizShuffleSeed((s) => s + 1);
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizAnswers({});
    setComboCount(0);
    setMaxCombo(0);
    setQuizCompletedRecord(null);
  };

  const handleRestartQuiz = () => {
    playFolkPluck();
    setQuizShuffleSeed((s) => s + 1);
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizAnswers({});
    setComboCount(0);
    setMaxCombo(0);
    setQuizCompletedRecord(null);
  };

  const handleAnswerOption = (optionIndex: number) => {
    if (selectedOption !== null || !currentQuestion) return;
    setSelectedOption(optionIndex);

    const isRight = optionIndex === currentQuestion.dapAnDung;
    const newCombo = isRight ? comboCount + 1 : 0;
    const nextMaxCombo = Math.max(maxCombo, newCombo);
    setComboCount(newCombo);
    setMaxCombo(nextMaxCombo);

    const comboBonus = isRight && newCombo >= 2 ? Math.min(newCombo * 3, 15) : 0;
    const diemCau = isRight ? currentQuestion.diem + comboBonus : 0;

    if (isRight) {
      playSilverBell();
      onUnlockLore?.();
      const stampRes = thuongDauThamTuNgauNhien();
      setPassportData(stampRes.data);
      if (stampRes.newlyStamped) {
        setPassportStampToast(
          `Mở khóa dấu Triện Son: Dân tộc ${stampRes.newlyStamped.ten}!`
        );
        window.setTimeout(() => setPassportStampToast(null), 4000);
      }
    } else {
      playFolkPluck(0);
    }

    setQuizAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        chon: optionIndex,
        dung: isRight,
        diem: diemCau,
      },
    }));
  };

  const handleNextQuizQuestion = () => {
    playFolkPluck(quizIndex + 1);
    if (quizIndex + 1 < danhSachCauHoiQuiz.length) {
      setQuizIndex(quizIndex + 1);
      const nextQ = danhSachCauHoiQuiz[quizIndex + 1];
      const existing = nextQ ? quizAnswers[nextQ.id] : undefined;
      setSelectedOption(existing ? existing.chon : null);
    } else {
      const values = Object.values(quizAnswers) as Array<{
        chon: number;
        dung: boolean;
        diem: number;
      }>;
      const soCauDung = values.filter((a) => a.dung).length;
      const tongDiemQuiz = values.reduce((acc, a) => acc + a.diem, 0);
      const tenChuDe =
        chuDeQuiz === "tat_ca_20"
          ? "Toàn tập 20 câu"
          : chuDeQuiz === "dau_nhanh_10"
            ? "10 câu ngẫu nhiên"
            : chuDeQuiz;

      const res = ghiNhanKetQuaQuiz(
        soCauDung,
        danhSachCauHoiQuiz.length,
        tenChuDe
      );
      setStreakState(res.data);
      setQuizCompletedRecord({
        ...res.record,
        diemNhanDuoc: Math.max(res.record.diemNhanDuoc, tongDiemQuiz),
      });
    }
  };

  const answeredValues = Object.values(quizAnswers) as Array<{
    chon: number;
    dung: boolean;
    diem: number;
  }>;
  const answeredCount = answeredValues.length;
  const correctSoFar = answeredValues.filter((a) => a.dung).length;
  const scoreSoFar = answeredValues.reduce((sum, a) => sum + a.diem, 0);

  return (
    <main className="tham-tu-screen min-h-screen py-3 flex flex-col gap-3.5 max-w-6xl mx-auto text-[var(--chu-chinh)]">
      <style>{`
        @keyframes thamTuSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes thamTuRevealUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes thamTuShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes thamTuScorePop {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(6px);
          }
          60% {
            opacity: 1;
            transform: scale(1.12) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .tham-tu-question-enter {
          animation: thamTuSlideIn 0.34s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .tham-tu-reveal-enter {
          animation: thamTuRevealUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .tham-tu-shake {
          animation: thamTuShake 0.42s ease-in-out both;
        }
        .tham-tu-score-pop {
          animation: thamTuScorePop 0.36s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>

      {/* Thanh điều hướng & chỉ số Game */}
      <header className="flex flex-wrap justify-between items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <h1 className="font-serif text-base sm:text-lg font-bold text-[var(--chu-chinh)] m-0">
              Thám Tử Văn Hóa
            </h1>
          </div>

          <span className="h-4 w-px bg-[var(--vien-the)] hidden sm:inline-block" />

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] font-semibold text-[var(--chu-chinh)]">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              {streakState.currentStreak} ngày
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] font-semibold text-[var(--xanh-chinh)]">
              <Trophy className="w-3.5 h-3.5" />
              {danhHieu.danhHieu} · {streakState.tongDiem}đ
            </span>

            {!checkedInToday && (
              <button
                type="button"
                onClick={handleCheckInToday}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold cursor-pointer transition hover:opacity-95 shadow-2xs"
              >
                Điểm danh (+20đ)
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setShowPassportModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600/10 hover:bg-rose-600/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 font-semibold transition cursor-pointer"
              title="Mở Sổ Thông Hành 54 Dân Tộc"
            >
              <Stamp className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Sổ Thông Hành: {stampedCount}/54</span>
            </button>

            {checkInToast && (
              <span className="text-xs font-semibold text-[var(--xanh-chinh)]">
                {checkInToast}
              </span>
            )}

            {passportStampToast && (
              <span className="tham-tu-score-pop inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xs">
                <Stamp className="w-3 h-3" />
                <span>{passportStampToast}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-[var(--nen-the-phu)] rounded-xl border border-[var(--vien-the)]">
            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setMode("quiz_van_hoa");
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                mode === "quiz_van_hoa"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-2xs"
                  : "text-[var(--chu-chinh)] hover:opacity-80"
              }`}
            >
              Trắc Nghiệm
            </button>
            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setMode("giam_dinh_2d");
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                mode === "giam_dinh_2d"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-2xs"
                  : "text-[var(--chu-chinh)] hover:opacity-80"
              }`}
            >
              Giám Định 2D ({streakState.solvedCaseIds.length}/12)
            </button>
          </div>

          {onProceedToS4 && (
            <button
              type="button"
              onClick={() => {
                const activeTpId =
                  mode === "giam_dinh_2d"
                    ? currentCa?.boPhoi?.trangPhucId
                    : currentQuestion?.trangPhucMinhHoa?.trangPhucId;
                onProceedToS4(activeTpId);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--xanh-chinh)] hover:opacity-95 rounded-xl font-semibold text-white text-xs transition cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phối Đồ</span>
            </button>
          )}
          {(onBack || onBackToS2) && (
            <button
              type="button"
              onClick={handleBackNavigation}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--nen-the-phu)] border border-[var(--vien-the)] rounded-xl font-semibold text-[var(--chu-chinh)] text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
          )}
        </div>
      </header>

      {/* CHẾ ĐỘ 2: TRẮC NGHIỆM VĂN HÓA GAMIFICATION */}
      {mode === "quiz_van_hoa" && (
        <div className="flex-1 flex flex-col gap-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--nen-the)] px-3.5 py-2.5 rounded-2xl border border-[var(--vien-the)] shadow-[var(--shadow-the)]">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: "dau_nhanh_10", label: "10 câu ngẫu nhiên" },
                  { id: "tat_ca_20", label: "Tất cả (20)" },
                  { id: "Cổ phục Triều Nguyễn", label: "Triều Nguyễn" },
                  { id: "Việt phục Ba Miền", label: "Ba Miền" },
                  { id: "Sắc phục Dân tộc", label: "Dân Tộc" },
                  { id: "Chất liệu & Làng nghề", label: "Làng Nghề" },
                ] as Array<{ id: ChuDeFilter; label: string }>
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleChangeQuizFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    chuDeQuiz === tab.id
                      ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-2xs"
                      : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-[var(--xanh-la)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRestartQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] text-xs font-semibold text-[var(--chu-chinh)] cursor-pointer transition"
              title="Trộn lại thứ tự câu hỏi và đáp án"
            >
              <Shuffle className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
              <span>Trộn đề</span>
            </button>
          </div>

          {quizCompletedRecord ? (
            <div className="tham-tu-question-enter bg-[var(--nen-the)] rounded-2xl border border-[var(--vien-the)] shadow-[var(--shadow-the)] p-6 max-w-2xl mx-auto w-full relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-teal-500" />
              <div className="flex items-center gap-4 pb-5 border-b border-[var(--vien-the)]">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                    Hạng
                  </span>
                  <span className="text-3xl font-extrabold leading-none mt-1">
                    {quizCompletedRecord.xepHang}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--xanh-chinh)] mb-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Hoàn thành lượt đấu</span>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--chu-chinh)] font-serif m-0">
                    Đúng {quizCompletedRecord.soCauDung}/
                    {quizCompletedRecord.tongSoCau} câu hỏi
                  </h2>
                  <p className="text-xs text-[var(--chu-phu)] mt-1 m-0">
                    {quizCompletedRecord.chuDe} · Chính xác{" "}
                    {Math.round(
                      (quizCompletedRecord.soCauDung /
                        Math.max(1, quizCompletedRecord.tongSoCau)) *
                        100
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 my-5 text-center">
                <div className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
                  <div className="text-xs text-[var(--chu-phu)]">Điểm thưởng</div>
                  <div className="text-lg font-extrabold text-amber-500 mt-0.5">
                    +{quizCompletedRecord.diemNhanDuoc}đ
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
                  <div className="text-xs text-[var(--chu-phu)]">Combo đỉnh</div>
                  <div className="text-lg font-extrabold text-[var(--chu-chinh)] mt-0.5">
                    x{maxCombo}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)]">
                  <div className="text-xs text-[var(--chu-phu)]">Streak</div>
                  <div className="text-lg font-extrabold text-[var(--xanh-chinh)] mt-0.5">
                    {streakState.currentStreak} ngày
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-sm transition cursor-pointer text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Trộn đề & Chơi lại</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              key={`${currentQuestion.id}-${quizIndex}`}
              className="tham-tu-question-enter grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
            >
              <div className="lg:col-span-4 bg-[var(--nen-the)] rounded-2xl border border-[var(--vien-the)] shadow-[var(--shadow-the)] p-4 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />

                <div className="w-full flex items-center justify-between mb-2.5 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[var(--chu-chinh)]">
                    Câu {quizIndex + 1}/{danhSachCauHoiQuiz.length}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg border font-bold ${
                      currentQuestion.capDo === "Khó"
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-300"
                        : currentQuestion.capDo === "Trung bình"
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {currentQuestion.capDo} · +{currentQuestion.diem}đ
                  </span>
                </div>

                <div className="w-full h-[265px] bg-gradient-to-b from-[var(--nen-the-phu)] to-[var(--nen-the)] rounded-xl border border-[var(--vien-the)] flex items-center justify-center overflow-hidden p-2">
                  {currentQuestion.trangPhucMinhHoa && (
                    <Mannequin2DPreview
                      trangPhucId={currentQuestion.trangPhucMinhHoa.trangPhucId}
                      mauHex={currentQuestion.trangPhucMinhHoa.mauHex}
                      phuKienIds={currentQuestion.trangPhucMinhHoa.phuKienIds}
                      gioi={currentQuestion.trangPhucMinhHoa.gioi}
                    />
                  )}
                </div>

                <div className="w-full grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                  <div className="bg-[var(--nen-the-phu)] py-2 px-2 rounded-xl border border-[var(--vien-the)]">
                    <div className="text-[11px] text-[var(--chu-phu)]">Đúng</div>
                    <strong className="text-sm text-[var(--xanh-chinh)]">
                      {correctSoFar}/{answeredCount}
                    </strong>
                  </div>
                  <div
                    className={`py-2 px-2 rounded-xl border transition-all ${
                      comboCount >= 2
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-300"
                        : "bg-[var(--nen-the-phu)] border-[var(--vien-the)]"
                    }`}
                  >
                    <div className="text-[11px] text-[var(--chu-phu)]">Combo</div>
                    <strong className="text-sm text-[var(--vang-chinh)]">
                      x{comboCount}
                    </strong>
                  </div>
                  <div className="bg-[var(--nen-the-phu)] py-2 px-2 rounded-xl border border-[var(--vien-the)]">
                    <div className="text-[11px] text-[var(--chu-phu)]">Điểm</div>
                    <strong className="text-sm text-[var(--chu-chinh)]">
                      +{scoreSoFar}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-[var(--nen-the)] rounded-2xl border border-[var(--vien-the)] shadow-[var(--shadow-the)] p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-sky-500" />

                <div>
                  <div className="flex items-center gap-1.5 mb-4">
                    {danhSachCauHoiQuiz.map((q, i) => {
                      const ans = quizAnswers[q.id];
                      const isCurrent = i === quizIndex;
                      return (
                        <div
                          key={q.id}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            ans
                              ? ans.dung
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                              : isCurrent
                                ? "bg-amber-500 scale-y-125"
                                : "bg-[var(--nen-the-phu)] border border-[var(--vien-the)]"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[var(--nen-the-phu)] to-[var(--nen-the)] border-2 border-[var(--vien-the)] shadow-xs mb-4 relative">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--xanh-nhe)] text-[var(--xanh-chinh)] font-bold">
                        {currentQuestion.chuDe}
                      </span>

                      {comboCount >= 2 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-2xs animate-pulse">
                          <Zap className="w-3 h-3" />
                          Combo x{comboCount} (+{Math.min(comboCount * 3, 15)}đ)
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--chu-chinh)] leading-relaxed m-0">
                      {currentQuestion.cauHoi}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQuestion.luaChon.map((optionText, idx) => {
                      const theme =
                        OPTION_GAME_THEMES[idx] || OPTION_GAME_THEMES[0];
                      const isPicked = selectedOption === idx;
                      const isAnswer = currentQuestion.dapAnDung === idx;
                      const hasAnswered = selectedOption !== null;
                      const earnedPoints =
                        quizAnswers[currentQuestion.id]?.diem ||
                        currentQuestion.diem;

                      let cardClass = `bg-[var(--nen-the-phu)] border-[var(--vien-the)] text-[var(--chu-chinh)] ${theme.accentBorder} ${theme.hover}`;
                      let badgeClass = theme.keycap;

                      if (hasAnswered) {
                        if (isAnswer) {
                          cardClass =
                            "bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-lg scale-[1.01]";
                          badgeClass = "bg-white text-emerald-700";
                        } else if (isPicked && !isAnswer) {
                          cardClass =
                            "tham-tu-shake bg-gradient-to-r from-rose-600 to-red-600 border-rose-400 text-white shadow-md";
                          badgeClass = "bg-white text-rose-700";
                        } else {
                          cardClass =
                            "bg-[var(--nen-the-phu)] border-[var(--vien-the)] text-[var(--chu-mo)] opacity-45 scale-[0.99]";
                          badgeClass =
                            "bg-[var(--nen-the)] text-[var(--chu-mo)] border border-[var(--vien-the)]";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={hasAnswered}
                          onClick={() => handleAnswerOption(idx)}
                          style={{ animationDelay: `${idx * 45}ms` }}
                          className={`tham-tu-question-enter w-full p-3.5 rounded-xl border font-semibold text-left transition-all duration-200 flex items-center gap-3.5 cursor-pointer ${cardClass}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 transition-transform ${badgeClass}`}
                          >
                            {theme.letter}
                          </span>

                          <span className="text-sm flex-1 leading-relaxed">
                            {optionText}
                          </span>

                          {hasAnswered && isAnswer && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isPicked && (
                                <span className="tham-tu-score-pop px-2 py-0.5 rounded-md bg-white/20 text-white text-xs font-extrabold">
                                  +{earnedPoints}đ
                                </span>
                              )}
                              <span className="w-6 h-6 rounded-full bg-white text-emerald-700 flex items-center justify-center">
                                <Check className="w-4 h-4 stroke-[2.5]" />
                              </span>
                            </div>
                          )}

                          {hasAnswered && isPicked && !isAnswer && (
                            <span className="w-6 h-6 rounded-full bg-white text-rose-600 flex items-center justify-center shrink-0">
                              <X className="w-4 h-4 stroke-[2.5]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedOption !== null && (
                  <div className="tham-tu-reveal-enter mt-4 pt-3.5 border-t border-[var(--vien-the)]">
                    <div
                      className={`p-4 rounded-xl border mb-3.5 ${
                        selectedOption === currentQuestion.dapAnDung
                          ? "bg-[var(--xanh-nhe)] border-[var(--xanh-la)]"
                          : "bg-rose-500/10 border-rose-500/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-xs text-[var(--chu-chinh)]">
                          {selectedOption === currentQuestion.dapAnDung
                            ? "Chính xác!"
                            : `Đáp án đúng: ${String.fromCharCode(
                                65 + currentQuestion.dapAnDung
                              )}`}
                        </span>
                        {selectedOption === currentQuestion.dapAnDung && (
                          <span className="text-xs font-extrabold text-[var(--xanh-chinh)]">
                            +
                            {quizAnswers[currentQuestion.id]?.diem ||
                              currentQuestion.diem}
                            đ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--chu-phu)] leading-relaxed m-0">
                        {currentQuestion.giaiThich}
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextQuizQuestion}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer text-xs"
                      >
                        <span>
                          {quizIndex + 1 < danhSachCauHoiQuiz.length
                            ? "Câu tiếp theo"
                            : "Xem kết quả"}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHẾ ĐỘ 1: GIÁM ĐỊNH PHỐI ĐỒ 2D GAMIFIED */}
      {mode === "giam_dinh_2d" && (
        <ThamTuInspector2DView
          danhSachCaThamTu={danhSachCaThamTu}
          currentIndex={currentIndex}
          solvedCaseIds={streakState.solvedCaseIds}
          selectedZone={selectedZone}
          isCorrectCase={isCorrectCase}
          casePointMessage={casePointMessage}
          onSelectCaseIndex={handleSelectCaseIndex}
          onShuffleCases={handleShuffleCases}
          onSelectZone={handleSelectZone}
          onNextCase={handleNextCase}
        />
      )}

      <CulturalPassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        onSelectDanToc={(dt) => {
          const firstTpId = dt.trangPhucIds?.[0];
          if (firstTpId && onProceedToS4) {
            onProceedToS4(firstTpId);
          } else if (onBackToS2) {
            onBackToS2();
          }
        }}
      />
    </main>
  );
}

export default ThamTuScreen;
