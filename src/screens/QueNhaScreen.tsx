/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { domdom } from "../copy/coem";
import { nhom } from "../data/nhom";
import { QueNhaData } from "../types";
import AppFooter from "../components/AppFooter";
import { QueNhaPose } from "../narrator";
import { layKhoaTheoHoSo } from "../lib/hoSo";
import { phanTichBoiCanhVaGoiY, GoiYPhanTichBoiCanh } from "../lib/gemini";
import { goiYTheoBoiCanhQueNha, GoiYQueNhaItem } from "../lib/rules";
import {
  startQueNhaBirdAmbience,
  playBirdChirpSound,
  playFolkPluck,
  playSilkRustleSound,
} from "../lib/audio";
import {
  OCCASION_VIGNETTES,
  REGION_VIGNETTES,
  STYLE_VIGNETTES,
} from "../components/BoiCanhIllustrations";
import { QUE_NHA_CSS } from "../components/que-nha/queNhaStyles";
import QueNhaRecommendationsStep from "../components/que-nha/QueNhaRecommendationsStep";
import {
  Check,
  Compass,
  ArrowRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Palette,
  Shirt,
  X,
  Feather,
  Sparkles,
} from "lucide-react";

type Props = {
  onComplete: (data: QueNhaData) => void;
  onBackToGate?: () => void;
  onDirectToOutfit?: (trangPhucId: string) => void;
};

export default function QueNhaScreen({ onComplete, onBackToGate, onDirectToOutfit }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Trạng thái cho phần gợi ý theo bối cảnh riêng
  const [customBoiCanh, setCustomBoiCanh] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<GoiYPhanTichBoiCanh | null>(null);

  // Khởi tạo từ localStorage theo hồ sơ hiện tại
  const [formData, setFormData] = useState<QueNhaData>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem(layKhoaTheoHoSo("que_nha"));
        if (stored) {
          const parsed = JSON.parse(stored);
          let camHungIds: string[] = [];
          if (Array.isArray(parsed.camHungIds)) {
            camHungIds = parsed.camHungIds;
          } else if (parsed.nhomQueId) {
            camHungIds = [parsed.nhomQueId];
          }

          let dip: string[] = [];
          if (Array.isArray(parsed.dip)) {
            dip = parsed.dip;
          } else if (typeof parsed.dip === "string" && parsed.dip) {
            dip = [parsed.dip];
          }

          let phongCach: string[] = [];
          if (Array.isArray(parsed.phongCach)) {
            phongCach = parsed.phongCach;
          } else if (typeof parsed.phongCach === "string" && parsed.phongCach) {
            phongCach = [parsed.phongCach];
          }

          return {
            dip,
            camHungIds,
            phongCach,
            nhomQueId: camHungIds[0] || null,
          };
        }
      }
    } catch {
      // Bỏ qua lỗi truy cập localStorage
    }
    return { dip: [], camHungIds: [], phongCach: [], nhomQueId: null };
  });

  const persistData = (updated: QueNhaData) => {
    setFormData(updated);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(layKhoaTheoHoSo("que_nha"), JSON.stringify(updated));
      }
    } catch {
      // Bỏ qua
    }
  };

  // Tự động kích hoạt tiếng chim hót đồng quê ríu rít khi ở bối cảnh Quê Nhà
  useEffect(() => {
    const stopAmbience = startQueNhaBirdAmbience();
    return () => {
      stopAmbience();
    };
  }, []);

  // 1) Xử lý Câu 1: Dịp chuẩn bị (Multi-select)
  const handleToggleDip = (val: string) => {
    const current = Array.isArray(formData.dip)
      ? formData.dip
      : formData.dip
      ? [formData.dip]
      : [];
    const next = current.includes(val)
      ? current.filter((x) => x !== val)
      : [...current, val];
    persistData({ ...formData, dip: next });
    playFolkPluck();
  };

  const handleNextStep1 = () => {
    playFolkPluck();
    if (customBoiCanh.trim() && !aiResult && !isAnalyzing) {
      handlePhanTichBoiCanh();
    }
    setStep(2);
  };

  const handleSkipStep1 = () => {
    persistData({ ...formData, dip: [] });
    setStep(2);
  };

  // 2) Xử lý Câu 2: Cảm hứng hôm nay
  const handleToggleCamHung = (id: string) => {
    const current = formData.camHungIds || [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    persistData({
      ...formData,
      camHungIds: next,
      nhomQueId: next[0] || null,
    });
    playBirdChirpSound();
  };

  const handleSelectKhamPhaDan = () => {
    playBirdChirpSound();
    persistData({
      ...formData,
      camHungIds: [],
      nhomQueId: null,
    });
  };

  const handleNextStep2 = () => {
    playFolkPluck();
    setStep(3);
  };

  const handleSkipStep2 = () => {
    persistData({ ...formData, camHungIds: [], nhomQueId: null });
    setStep(3);
  };

  // 3) Xử lý Câu 3: Phong cách mong muốn -> Chuyển sang Bước 4 (Gợi ý của Cò Em)
  const handleTogglePhongCach = (val: string) => {
    const current = Array.isArray(formData.phongCach)
      ? formData.phongCach
      : formData.phongCach
      ? [formData.phongCach]
      : [];
    const next = current.includes(val)
      ? current.filter((x) => x !== val)
      : [...current, val];
    persistData({ ...formData, phongCach: next });
    playFolkPluck();
  };

  const handleGoToSuggestionsStep = (overridePhongCach?: string[]) => {
    playFolkPluck();
    const finalPhongCach =
      overridePhongCach !== undefined
        ? overridePhongCach
        : Array.isArray(formData.phongCach)
        ? formData.phongCach
        : formData.phongCach
        ? [formData.phongCach]
        : [];

    const finalData: QueNhaData = {
      dip: formData.dip,
      camHungIds: formData.camHungIds,
      phongCach: finalPhongCach,
      nhomQueId: formData.camHungIds[0] || null,
    };
    persistData(finalData);
    setStep(4);
  };

  const handleFinishToCollection = () => {
    playFolkPluck();
    const finalData: QueNhaData = {
      dip: formData.dip,
      camHungIds: formData.camHungIds,
      phongCach: Array.isArray(formData.phongCach)
        ? formData.phongCach
        : formData.phongCach
        ? [formData.phongCach]
        : [],
      nhomQueId: formData.camHungIds[0] || null,
    };
    persistData(finalData);
    onComplete(finalData);
  };

  // Xử lý mặc thử một bộ gợi ý từ Bước 4
  const handleTryRecommendedCostume = (item: GoiYQueNhaItem) => {
    playSilkRustleSound();
    const chosenPhongCach =
      Array.isArray(formData.phongCach) && formData.phongCach.length > 0
        ? formData.phongCach[0]
        : typeof formData.phongCach === "string" && formData.phongCach
        ? formData.phongCach
        : "truyen_thong";

    try {
      const outfitPreset = {
        trangPhucId: item.trangPhuc.id,
        mauId: item.mauMacDinh,
        phuKienIds: item.phuKienMacDinh,
        phongCach: chosenPhongCach,
      };
      window.localStorage.setItem(
        layKhoaTheoHoSo(`outfit:${item.trangPhuc.id}`),
        JSON.stringify(outfitPreset)
      );
    } catch {
      // ignore
    }

    if (onDirectToOutfit) {
      onDirectToOutfit(item.trangPhuc.id);
    } else {
      handleFinishToCollection();
    }
  };

  // Xử lý nhờ Cò Em gợi ý bối cảnh
  const handlePhanTichBoiCanh = async () => {
    if (!customBoiCanh.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await phanTichBoiCanhVaGoiY(customBoiCanh);
      setAiResult(result);
    } catch (err) {
      console.error("Lỗi phân tích bối cảnh:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Áp dụng gợi ý AI vào cấu hình và mở luôn Bước 4
  const handleApplyAiSuggestion = () => {
    if (!aiResult) return;
    const nextDips = Array.from(new Set([...(formData.dip || []), ...(aiResult.dipTuongUng || [])]));
    const nextCamHung = aiResult.vungTuongUng
      ? Array.from(new Set([...(formData.camHungIds || []), aiResult.vungTuongUng]))
      : formData.camHungIds;
    const nextPhongCach = aiResult.phongCachKhuyenNghi ? [aiResult.phongCachKhuyenNghi] : formData.phongCach;

    const updated: QueNhaData = {
      ...formData,
      dip: nextDips,
      camHungIds: nextCamHung,
      phongCach: nextPhongCach,
      nhomQueId: nextCamHung[0] || null,
    };
    persistData(updated);
    setStep(4);
  };

  // Áp dụng gợi ý và chuyển thẳng đến phòng thử đồ S4
  const handleGoDirectToOutfit = () => {
    if (!aiResult) return;
    const nextDips = Array.from(new Set([...(formData.dip || []), ...(aiResult.dipTuongUng || [])]));
    const nextCamHung = aiResult.vungTuongUng ? [aiResult.vungTuongUng] : formData.camHungIds;
    const nextPhongCach = aiResult.phongCachKhuyenNghi ? [aiResult.phongCachKhuyenNghi] : formData.phongCach;

    const updated: QueNhaData = {
      dip: nextDips,
      camHungIds: nextCamHung,
      phongCach: nextPhongCach,
      nhomQueId: nextCamHung[0] || null,
    };
    persistData(updated);

    if (onDirectToOutfit) {
      onDirectToOutfit(aiResult.trangPhucId);
    } else {
      onComplete(updated);
    }
  };

  const currentDips = Array.isArray(formData.dip)
    ? formData.dip
    : formData.dip
    ? [formData.dip]
    : [];

  const currentPhongCachs = Array.isArray(formData.phongCach)
    ? formData.phongCach
    : formData.phongCach
    ? [formData.phongCach]
    : [];

  const isKhamPhaDanActive = (formData.camHungIds || []).length === 0;

  // Tính toán danh sách trang phục gợi ý từ Cò Em dựa trên 3 bước người dùng đã chọn
  const recommendationResult = useMemo(() => {
    return goiYTheoBoiCanhQueNha(formData);
  }, [formData]);

  // Nếu có aiResult từ ô nhập tự do, đưa trang phục AI khuyên lên đầu danh sách gợi ý
  const topRecommendations = useMemo(() => {
    const list = [...recommendationResult.items];
    if (aiResult?.trangPhucId) {
      const idx = list.findIndex((x) => x.trangPhuc.id === aiResult.trangPhucId);
      if (idx > 0) {
        const [found] = list.splice(idx, 1);
        list.unshift({
          ...found,
          lyDoGoiY: [`Khuyên dùng cho "${customBoiCanh.trim() || "bối cảnh riêng"}"`, ...found.lyDoGoiY],
        });
      }
    }
    return list.slice(0, 6);
  }, [recommendationResult.items, aiResult, customBoiCanh]);

  return (
    <main className="que-nha">
      <style>{QUE_NHA_CSS}</style>
      <div className="que-nha__noise" aria-hidden="true" />

      {/* Cò Em dẫn chuyện */}
      <div className="que-nha__fly" aria-hidden="true">
        <QueNhaPose size={88} animate={true} />
      </div>

      {/* Thanh tiến trình 4 bước văn hóa */}
      <header className="que-nha__brand">
        <div className="que-nha__brand-text">
          <span className="text-lg" role="img" aria-hidden="true">🎋</span>
          <span className="que-nha__name">Cảm Hứng Quê Nhà</span>
        </div>

        <nav className="que-nha__steps-indicator" aria-label="Tiến trình chọn bối cảnh">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`que-nha__step-pill ${step === 1 ? "que-nha__step-pill--active" : ""}`}
          >
            <Calendar size={13} className="inline-block" />
            <span>1. Dịp</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`que-nha__step-pill ${step === 2 ? "que-nha__step-pill--active" : ""}`}
          >
            <MapPin size={13} className="inline-block" />
            <span>2. Vùng miền</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`que-nha__step-pill ${step === 3 ? "que-nha__step-pill--active" : ""}`}
          >
            <Palette size={13} className="inline-block" />
            <span>3. Phong cách</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(4)}
            className={`que-nha__step-pill ${step === 4 ? "que-nha__step-pill--active" : ""}`}
          >
            <Sparkles size={13} className="inline-block" />
            <span>4. Gợi ý</span>
          </button>
        </nav>
      </header>

      {/* Nội dung từng câu hỏi */}
      <div className="que-nha__container">
        {/* CÂU 1: DỊP / BỐI CẢNH */}
        {step === 1 && (
          <section className="que-nha__card" aria-labelledby="cau-1-heading">
            <header className="que-nha__card-header">
              <div className="que-nha__question-row">
                <h1 id="cau-1-heading" className="que-nha__question">
                  {domdom.queNha.cau1.cauHoi}
                </h1>
                {currentDips.length > 0 && (
                  <span className="que-nha__selected-badge">
                    <Check size={14} className="text-amber-700 dark:text-amber-300 stroke-[3]" />
                    Đã chọn {currentDips.length}
                  </span>
                )}
              </div>
            </header>

            {/* A. CÁC Ô CHỌN DỊP */}
            <div className="que-nha__options que-nha__options--grid">
              {(Object.keys(domdom.queNha.cau1.danhSach) as Array<keyof typeof domdom.queNha.cau1.danhSach>).map(
                (key) => {
                  const isSelected = currentDips.includes(key);
                  const VignetteComponent = OCCASION_VIGNETTES[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggleDip(key)}
                      className={`que-nha__option-btn ${
                        isSelected ? "que-nha__option-btn--active" : ""
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="que-nha__vignette-frame">
                        {VignetteComponent && <VignetteComponent className="w-11 h-11" />}
                      </div>

                      <span className="que-nha__option-title flex-1">
                        {domdom.queNha.cau1.danhSach[key]}
                      </span>

                      <div className={`que-nha__marker-badge ${isSelected ? "que-nha__marker-badge--active" : ""}`}>
                        {isSelected ? (
                          <Check size={14} strokeWidth={3} className="text-white" />
                        ) : (
                          <div className="que-nha__marker-circle" />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* B. PHẦN TƯ VẤN BỐI CẢNH RIÊNG TỰ DO CÙNG CÒ EM */}
            <div className="que-nha__ai-section">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-600 text-white shrink-0">
                  <Feather size={13} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 m-0">
                    Gợi ý theo bối cảnh của bạn
                  </h2>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 m-0">
                    Nhập điểm đến hoặc sự kiện để Cò Em tìm dáng áo phù hợp.
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <textarea
                  value={customBoiCanh}
                  onChange={(e) => setCustomBoiCanh(e.target.value)}
                  placeholder="Ví dụ: Đi tiệc cưới ở Huế, chụp kỷ yếu Văn Miếu, trẩy hội đầu xuân..."
                  className="w-full p-2.5 rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:border-amber-600 resize-none min-h-[52px] transition-all"
                  rows={2}
                  disabled={isAnalyzing}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Gợi ý nhanh:</span>
                  {[
                    { label: "Tiệc cưới", text: "Đi dự tiệc cưới bạn thân ở Huế, thanh lịch và trang nhã" },
                    { label: "Kỷ yếu", text: "Chụp ảnh kỷ yếu ở Văn Miếu Quốc Tử Giám, tinh khôi và trang nghiêm" },
                    { label: "Lễ hội", text: "Đi lễ chùa và trẩy hội đầu năm cùng gia đình, trang nghiêm đằm thắm" },
                    { label: "Dạo phố", text: "Dạo chơi sông nước miền Tây, nhẹ nhàng, thoải mái" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomBoiCanh(item.text)}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 hover:bg-amber-100/80 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handlePhanTichBoiCanh}
                  disabled={isAnalyzing || !customBoiCanh.trim()}
                  className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang ngẫm...</span>
                    </>
                  ) : (
                    <>
                      <Feather size={12} />
                      <span>Nhờ Cò Em chọn</span>
                    </>
                  )}
                </button>
              </div>

              {/* KẾT QUẢ GỢI Ý TỪ CÒ EM */}
              {aiResult && (
                <div className="que-nha__ai-result">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎋</span>
                      <div>
                        <h3 className="text-base font-bold text-amber-900 dark:text-amber-200 m-0">
                          Lời khuyên trang phục từ Cò Em
                        </h3>
                        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 m-0">
                          {aiResult.tongQuan}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiResult(null)}
                      className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                      title="Đóng kết quả"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
                    <div className="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-amber-300/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                        <Shirt size={14} />
                        <span>Dáng áo khuyên mặc</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {aiResult.tenTrangPhuc}
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 m-0 leading-relaxed">
                        {aiResult.lyDo}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-amber-300/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                        <Palette size={14} />
                        <span>Phối sắc & Phụ kiện</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Màu chính: <span className="text-amber-700 dark:text-amber-300 font-bold">{aiResult.phoiMau.mauChinh}</span> • Phối: {aiResult.phoiMau.mauPhoi}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 italic mt-0.5">
                        {aiResult.phoiMau.yNghia}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        {aiResult.phuKien.map((pk, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700">
                            + {pk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 mb-3">
                    <span className="text-sm mt-0.5">💡</span>
                    <p className="text-xs text-amber-900 dark:text-amber-200 m-0 leading-relaxed font-medium">
                      <strong>Cò Em nhắn nhủ:</strong> {aiResult.luuYVanHoa}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleApplyAiSuggestion}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-amber-300/50 hover:bg-amber-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      Xem danh sách gợi ý của Cò Em →
                    </button>
                    <button
                      type="button"
                      onClick={handleGoDirectToOutfit}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Shirt size={14} />
                      <span>Mặc bộ này ngay (Đến phòng thử đồ)</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <footer className="que-nha__actions">
              {onBackToGate && (
                <button
                  type="button"
                  onClick={onBackToGate}
                  className="que-nha__btn que-nha__btn--sub"
                >
                  <ChevronLeft size={16} />
                  <span>{domdom.common.back}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSkipStep1}
                className="que-nha__btn que-nha__btn--sub"
              >
                {domdom.queNha.nutBoQua}
              </button>
              <button
                type="button"
                onClick={handleNextStep1}
                className="que-nha__btn que-nha__btn--pri"
              >
                <span>{domdom.queNha.nutTiep}</span>
                {currentDips.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold">
                    {currentDips.length}
                  </span>
                )}
                <ArrowRight size={16} />
              </button>
            </footer>
          </section>
        )}

        {/* CÂU 2: CẢM HỨNG VÙNG MIỀN */}
        {step === 2 && (
          <section className="que-nha__card" aria-labelledby="cau-2-heading">
            <header className="que-nha__card-header">
              <div className="que-nha__question-row">
                <h1 id="cau-2-heading" className="que-nha__question">
                  {domdom.queNha.cau2.cauHoi}
                </h1>
                {formData.camHungIds.length > 0 && (
                  <span className="que-nha__selected-badge">
                    <Check size={14} className="text-amber-700 dark:text-amber-300 stroke-[3]" />
                    Đã chọn {formData.camHungIds.length} vùng
                  </span>
                )}
              </div>
            </header>

            <div className="que-nha__options que-nha__options--grid">
              <button
                type="button"
                onClick={handleSelectKhamPhaDan}
                className={`que-nha__option-btn que-nha__option-btn--special ${
                  isKhamPhaDanActive ? "que-nha__option-btn--active" : ""
                }`}
                aria-pressed={isKhamPhaDanActive}
              >
                <div className="que-nha__vignette-frame">
                  <Compass className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="que-nha__option-title flex-1">
                  {domdom.queNha.cau2.khamPhaDan}
                </span>
                <div className={`que-nha__marker-badge ${isKhamPhaDanActive ? "que-nha__marker-badge--active" : ""}`}>
                  {isKhamPhaDanActive ? (
                    <Check size={14} strokeWidth={3} className="text-white" />
                  ) : (
                    <div className="que-nha__marker-circle" />
                  )}
                </div>
              </button>

              {nhom.map((item) => {
                const isSelected = formData.camHungIds.includes(item.id);
                const RegionVignette = REGION_VIGNETTES[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleCamHung(item.id)}
                    className={`que-nha__option-btn ${
                      isSelected ? "que-nha__option-btn--active" : ""
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="que-nha__vignette-frame">
                      {RegionVignette ? (
                        <RegionVignette className="w-11 h-11" />
                      ) : (
                        <span className="text-xl">🎋</span>
                      )}
                    </div>
                    <span className="que-nha__option-title flex-1">
                      {item.ten}
                    </span>
                    <div className={`que-nha__marker-badge ${isSelected ? "que-nha__marker-badge--active" : ""}`}>
                      {isSelected ? (
                        <Check size={14} strokeWidth={3} className="text-white" />
                      ) : (
                        <div className="que-nha__marker-circle" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <footer className="que-nha__actions">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="que-nha__btn que-nha__btn--sub"
              >
                <ChevronLeft size={16} />
                <span>{domdom.queNha.nutQuayLai}</span>
              </button>
              <button
                type="button"
                onClick={handleSkipStep2}
                className="que-nha__btn que-nha__btn--sub"
              >
                {domdom.queNha.nutBoQua}
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="que-nha__btn que-nha__btn--pri"
              >
                <span>{domdom.queNha.nutTiep}</span>
                {formData.camHungIds.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold">
                    {formData.camHungIds.length}
                  </span>
                )}
                <ArrowRight size={16} />
              </button>
            </footer>
          </section>
        )}

        {/* CÂU 3: PHONG CÁCH */}
        {step === 3 && (
          <section className="que-nha__card" aria-labelledby="cau-3-heading">
            <header className="que-nha__card-header">
              <div className="que-nha__question-row">
                <h1 id="cau-3-heading" className="que-nha__question">
                  {domdom.queNha.cau3.cauHoi}
                </h1>
                {currentPhongCachs.length > 0 && (
                  <span className="que-nha__selected-badge">
                    <Check size={14} className="text-amber-700 dark:text-amber-300 stroke-[3]" />
                    Đã chọn {currentPhongCachs.length}
                  </span>
                )}
              </div>
            </header>

            <div className="que-nha__options que-nha__options--stack">
              {(Object.keys(domdom.queNha.cau3.danhSach) as Array<keyof typeof domdom.queNha.cau3.danhSach>).map(
                (key) => {
                  const isSelected = currentPhongCachs.includes(key);
                  const StyleVignette = STYLE_VIGNETTES[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTogglePhongCach(key)}
                      className={`que-nha__option-btn que-nha__option-btn--lg ${
                        isSelected ? "que-nha__option-btn--active" : ""
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="que-nha__vignette-frame">
                        {StyleVignette ? (
                          <StyleVignette className="w-12 h-12" />
                        ) : (
                          <span className="text-xl">🌸</span>
                        )}
                      </div>
                      <span className="que-nha__option-title flex-1">
                        {domdom.queNha.cau3.danhSach[key]}
                      </span>
                      <div className={`que-nha__marker-badge ${isSelected ? "que-nha__marker-badge--active" : ""}`}>
                        {isSelected ? (
                          <Check size={14} strokeWidth={3} className="text-white" />
                        ) : (
                          <div className="que-nha__marker-circle" />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            <footer className="que-nha__actions">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="que-nha__btn que-nha__btn--sub"
              >
                <ChevronLeft size={16} />
                <span>{domdom.queNha.nutQuayLai}</span>
              </button>
              <button
                type="button"
                onClick={() => handleGoToSuggestionsStep([])}
                className="que-nha__btn que-nha__btn--sub"
              >
                {domdom.queNha.nutBoQua}
              </button>
              <button
                type="button"
                onClick={() => handleGoToSuggestionsStep()}
                className="que-nha__btn que-nha__btn--pri"
              >
                <Sparkles size={15} />
                <span>Xem gợi ý từ Cò Em</span>
                {currentPhongCachs.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold">
                    {currentPhongCachs.length}
                  </span>
                )}
                <ArrowRight size={16} />
              </button>
            </footer>
          </section>
        )}

        {/* BƯỚC 4: KẾT QUẢ GỢI Ý TRANG PHỤC */}
        {step === 4 && (
          <QueNhaRecommendationsStep
            currentDips={currentDips}
            camHungIds={formData.camHungIds}
            currentPhongCachs={currentPhongCachs}
            aiResult={aiResult}
            tongQuanLoiKhuyen={recommendationResult.tongQuanLoiKhuyen}
            topRecommendations={topRecommendations}
            onResetToStep1={() => setStep(1)}
            onBackToStep3={() => setStep(3)}
            onTryRecommendedCostume={handleTryRecommendedCostume}
            onFinishToCollection={handleFinishToCollection}
          />
        )}
      </div>

      <AppFooter />
    </main>
  );
}
