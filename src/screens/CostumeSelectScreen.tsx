/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CostumeSelectScreen (S2) — Bộ Sưu Tập Di Sản Việt Phục
 * Được tái cấu trúc module hóa:
 * - Tách hằng số phân loại và chất liệu sang `src/components/costume-select/CostumeSelectConstants.ts`
 * - Tách module tra cứu 54 Dân Tộc sang `src/components/costume-select/Ethnic54ExplorerSection.tsx`
 * - Dùng chung dữ liệu kỹ thuật `HERITAGE_CRAFT_DB` từ `src/data/heritageCraftDb.ts`
 * - Dùng chung hooks đồng bộ `useManagedCostumes` & `useCulturalPassport` từ `src/hooks/useAppSync.ts`
 */

import { useState, useMemo, useEffect } from "react";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";
import {
  DAN_TOC_54,
  boDauTiengViet,
  type DanToc54Item,
  type HeNgonNgu54,
} from "../data/dan_toc_54";
import { dongDauDanToc } from "../data/le_hoi_di_san";
import { HERITAGE_CRAFT_DB } from "../data/heritageCraftDb";
import { useManagedCostumes, useCulturalPassport } from "../hooks/useAppSync";
import {
  CATEGORIES,
  CRAFT_FILTERS,
  REGION_BADGES,
} from "../components/costume-select/CostumeSelectConstants";
import Ethnic54ExplorerSection from "../components/costume-select/Ethnic54ExplorerSection";
import CostumeCardPreview from "../components/CostumeCardPreview";
import CulturalPassportModal from "../components/CulturalPassportModal";
import AppFooter from "../components/AppFooter";
import type { QueNhaData } from "../types";
import type { HoSo } from "../lib/hoSo";
import type { ThoiTietState } from "../lib/thoitiet";
import { goiYTheoBoiCanhQueNha } from "../lib/rules";
import { playSilkRustleSound, playFolkPluck } from "../lib/audio";
import {
  Search,
  BookOpen,
  X,
  CloudSun,
  Camera,
  Palette,
  Store,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  Stamp,
} from "lucide-react";

type Props = {
  queNhaData: QueNhaData;
  onBackToQueNha: () => void;
  onSelectTrangPhuc: (trangPhucId: string, directToS4?: boolean) => void;
  onOpenThuDoAI?: (trangPhucId?: string) => void;
  onOpenCharacter?: () => void;
  onOpenGuiKyUc?: () => void;
  onOpenThamTu?: () => void;
  onOpenBanDo?: () => void;
  onOpenDongThoiGian?: () => void;
  onOpenSoiChiChung?: () => void;
  onOpenChoPhien?: () => void;
  onOpenLeHoi?: () => void;
  onOpenChaoBan?: () => void;
  initialNhomFilter?: string;
  activeHoSo?: HoSo;
  weatherState?: ThoiTietState;
};

export default function CostumeSelectScreen({
  queNhaData,
  onBackToQueNha,
  onSelectTrangPhuc,
  onOpenThuDoAI,
  onOpenThamTu,
  onOpenChoPhien,
  onOpenLeHoi,
  initialNhomFilter,
  weatherState,
}: Props) {
  const { costumes: managedCostumes } = useManagedCostumes(false);
  const { passportData, setPassportData, stampedCount } = useCulturalPassport();

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (initialNhomFilter && initialNhomFilter !== "all") {
      const match = CATEGORIES.find((cat) =>
        trangPhuc.some(
          (tp) => cat.filter(tp) && tp.nhomIds.includes(initialNhomFilter)
        )
      );
      if (match) return match.id;
    }
    return "all";
  });

  const [activeCraft, setActiveCraft] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterByQueNha, setFilterByQueNha] = useState<boolean>(false);
  const [showPassportModal, setShowPassportModal] = useState<boolean>(false);

  // State cho Module 54 Dân Tộc Việt Nam
  const [showDanTocModule, setShowDanTocModule] = useState<boolean>(true);
  const [activeHeNgonNgu, setActiveHeNgonNgu] = useState<"all" | HeNgonNgu54>(
    "all"
  );
  const [danTocQuery, setDanTocQuery] = useState<string>("");
  const [selectedDanTocId, setSelectedDanTocId] = useState<string | null>(
    () => {
      if (initialNhomFilter && initialNhomFilter !== "all") {
        const matched = DAN_TOC_54.find(
          (dt) =>
            dt.id === initialNhomFilter ||
            dt.nhomIds.includes(initialNhomFilter)
        );
        if (matched) return matched.id;
      }
      return null;
    }
  );

  const selectedDanToc: DanToc54Item | null = useMemo(() => {
    if (!selectedDanTocId) return null;
    return DAN_TOC_54.find((dt) => dt.id === selectedDanTocId) || null;
  }, [selectedDanTocId]);

  useEffect(() => {
    if (!initialNhomFilter || initialNhomFilter === "all") return;
    const matchedDt = DAN_TOC_54.find(
      (dt) =>
        dt.id === initialNhomFilter || dt.nhomIds.includes(initialNhomFilter)
    );
    if (matchedDt) {
      setShowDanTocModule(true);
      setSelectedDanTocId(matchedDt.id);
    }
    const matchedCat = CATEGORIES.find((cat) =>
      trangPhuc.some(
        (tp) => cat.filter(tp) && tp.nhomIds.includes(initialNhomFilter)
      )
    );
    if (matchedCat) {
      setActiveCategory(matchedCat.id);
    }
  }, [initialNhomFilter]);

  const filteredDanTocList = useMemo(() => {
    let list = DAN_TOC_54;
    if (activeHeNgonNgu !== "all") {
      list = list.filter((dt) => dt.heNgonNgu === activeHeNgonNgu);
    }
    const qRaw = (danTocQuery || searchQuery).trim();
    if (qRaw) {
      const qNorm = boDauTiengViet(qRaw);
      list = list.filter((dt) => {
        const hay = boDauTiengViet(
          `${dt.ten} ${dt.tenGoiKhac || ""} ${dt.diaBanChinh} ${dt.heNgonNgu} ${dt.vungVanHoa} ${dt.dacTrungTrangPhuc}`
        );
        return hay.includes(qNorm);
      });
    }
    return list;
  }, [activeHeNgonNgu, danTocQuery, searchQuery]);

  const costumeToDanTocMap = useMemo(() => {
    const map: Record<string, DanToc54Item[]> = {};
    for (const dt of DAN_TOC_54) {
      for (const tpId of dt.trangPhucIds) {
        if (!map[tpId]) map[tpId] = [];
        map[tpId].push(dt);
      }
    }
    return map;
  }, []);

  const thoiTiet = weatherState?.thoiTiet || "mat";

  const queNhaRecommendation = useMemo(() => {
    return goiYTheoBoiCanhQueNha(queNhaData, thoiTiet);
  }, [queNhaData, thoiTiet]);

  const scoreMap = useMemo(() => {
    const map: Record<string, { score: number; lyDo: string[] }> = {};
    for (const item of queNhaRecommendation.items) {
      map[item.trangPhuc.id] = { score: item.score, lyDo: item.lyDoGoiY };
    }
    return map;
  }, [queNhaRecommendation.items]);

  const filteredCostumes = useMemo(() => {
    const cat =
      CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
    let list = managedCostumes.filter(cat.filter);

    if (selectedDanToc) {
      list = managedCostumes.filter((tp) =>
        selectedDanToc.trangPhucIds.includes(tp.id)
      );
    }

    if (activeCraft !== "all") {
      const craftObj = CRAFT_FILTERS.find((cf) => cf.id === activeCraft);
      if (craftObj && craftObj.costumeIds.length > 0) {
        list = list.filter((tp) => craftObj.costumeIds.includes(tp.id));
      }
    }

    if (filterByQueNha && queNhaRecommendation.hasContextFilter) {
      const matched = list.filter((tp) => (scoreMap[tp.id]?.score ?? 0) >= 30);
      if (matched.length > 0) {
        list = matched;
      }
    }

    if (searchQuery.trim()) {
      const qNorm = boDauTiengViet(searchQuery);
      const matchedDanTocCostumeIds = new Set<string>();
      for (const dt of DAN_TOC_54) {
        const dtHay = boDauTiengViet(
          `${dt.ten} ${dt.tenGoiKhac || ""} ${dt.diaBanChinh} ${dt.heNgonNgu}`
        );
        if (dtHay.includes(qNorm)) {
          dt.trangPhucIds.forEach((id) => matchedDanTocCostumeIds.add(id));
        }
      }

      list = list.filter((tp) => {
        const tpHay = boDauTiengViet(`${tp.ten} ${tp.moTaNgan}`);
        const nhomMatch = tp.nhomIds.some((id) => {
          const n = nhom.find((item) => item.id === id);
          return n && boDauTiengViet(n.ten).includes(qNorm);
        });
        return (
          tpHay.includes(qNorm) ||
          nhomMatch ||
          matchedDanTocCostumeIds.has(tp.id)
        );
      });
    }

    if (queNhaRecommendation.hasContextFilter && !selectedDanToc) {
      list = [...list].sort(
        (a, b) => (scoreMap[b.id]?.score ?? 0) - (scoreMap[a.id]?.score ?? 0)
      );
    }

    return list;
  }, [
    managedCostumes,
    activeCategory,
    activeCraft,
    searchQuery,
    filterByQueNha,
    selectedDanToc,
    queNhaRecommendation.hasContextFilter,
    scoreMap,
  ]);

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeCraft !== "all" ||
    Boolean(searchQuery.trim()) ||
    Boolean(danTocQuery.trim()) ||
    Boolean(selectedDanTocId) ||
    activeHeNgonNgu !== "all" ||
    filterByQueNha;

  const handleSelectDanToc = (dt: DanToc54Item) => {
    playFolkPluck();
    if (selectedDanTocId === dt.id) {
      setSelectedDanTocId(null);
    } else {
      setSelectedDanTocId(dt.id);
      setActiveCategory("all");
      setActiveCraft("all");
      const res = dongDauDanToc(dt.id, "kham_pha");
      setPassportData(res.data);
    }
  };

  const resetAllFilters = () => {
    setActiveCategory("all");
    setActiveCraft("all");
    setSearchQuery("");
    setDanTocQuery("");
    setSelectedDanTocId(null);
    setActiveHeNgonNgu("all");
    setFilterByQueNha(false);
  };

  return (
    <main className="costume-s2 min-h-screen bg-[var(--nen-bright)] text-[var(--chu-chinh)] pb-14">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* 1. ĐẦU TRANG TRIỂN LÃM DI SẢN */}
        <header className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-500 to-teal-600" />
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--xanh-chinh)] mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--xanh-chinh)]" />
              <span>Không Gian Triển Lãm Số · Sắc Phục Di Sản Việt Nam</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[var(--chu-chinh)] m-0">
              Bộ Sưu Tập Di Sản Việt Phục
            </h1>
            <span className="text-xs text-[var(--chu-phu)] mt-0.5 block">
              Tra cứu trực quan cổ phục triều đại & sắc phục truyền thống các dân tộc Việt Nam
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setShowPassportModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition cursor-pointer"
              title="Mở Sổ Thông Hành Di Sản 54 Dân Tộc"
            >
              <Stamp className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Sổ Thông Hành</span>
              <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold leading-none">
                {stampedCount}/54
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playFolkPluck();
                setShowDanTocModule((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                showDanTocModule || selectedDanToc
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-transparent shadow-xs"
                  : "bg-[var(--nen-the-phu)] border-[var(--vien-the)] text-[var(--chu-chinh)] hover:border-[var(--xanh-la)]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>54 Dân Tộc</span>
              {showDanTocModule ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {onOpenLeHoi && (
              <button
                type="button"
                onClick={onOpenLeHoi}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--vang-chinh)] text-[var(--chu-chinh)] text-xs font-semibold transition cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
                <span>Lễ Hội & Sự Kiện</span>
              </button>
            )}

            <button
              type="button"
              onClick={onBackToQueNha}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] text-[var(--chu-chinh)] text-xs font-semibold transition cursor-pointer"
            >
              <CloudSun className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
              <span>Gợi Ý Bối Cảnh</span>
            </button>

            {onOpenChoPhien && (
              <button
                type="button"
                onClick={onOpenChoPhien}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--vang-chinh)] text-[var(--chu-chinh)] text-xs font-semibold transition cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
                <span>Chợ Phiên</span>
              </button>
            )}
          </div>
        </header>

        {/* 2. MODULE TRA CỨU SẮC PHỤC 54 DÂN TỘC VIỆT NAM */}
        {showDanTocModule && (
          <Ethnic54ExplorerSection
            filteredDanTocList={filteredDanTocList}
            activeHeNgonNgu={activeHeNgonNgu}
            onChangeHeNgonNgu={setActiveHeNgonNgu}
            danTocQuery={danTocQuery}
            onChangeDanTocQuery={setDanTocQuery}
            searchQuery={searchQuery}
            selectedDanToc={selectedDanToc}
            selectedDanTocId={selectedDanTocId}
            onSelectDanToc={handleSelectDanToc}
            onClearSelectedDanToc={() => setSelectedDanTocId(null)}
            passportData={passportData}
          />
        )}

        {/* 3. THANH BỘ LỌC TRANG PHỤC & TÌM KIẾM TỔNG HỢP */}
        <div className="p-4 rounded-2xl bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-[var(--shadow-the)] space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
            <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id && !selectedDanToc;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playFolkPluck();
                      setSelectedDanTocId(null);
                      setActiveCategory(cat.id);
                    }}
                    className={`shrink-0 px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer rounded-xl ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs"
                        : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-3.5 h-3.5 text-[var(--chu-phu)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm trang phục hoặc bất kỳ dân tộc nào..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[var(--chu-chinh)] placeholder:text-[var(--chu-phu)]/60 focus:outline-none focus:border-[var(--xanh-chinh)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--chu-phu)] hover:text-[var(--chu-chinh)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[var(--vien-the)]">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {CRAFT_FILTERS.map((cf) => {
                const isCraftActive = activeCraft === cf.id;
                return (
                  <button
                    key={cf.id}
                    type="button"
                    onClick={() => {
                      playFolkPluck();
                      setActiveCraft(cf.id);
                    }}
                    className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isCraftActive
                        ? "bg-[var(--xanh-nhe)] border border-[var(--xanh-la)] text-[var(--xanh-chinh)] font-semibold"
                        : "bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[var(--chu-phu)] hover:text-[var(--chu-chinh)]"
                    }`}
                  >
                    {cf.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {queNhaRecommendation.hasContextFilter && (
                <button
                  type="button"
                  onClick={() => setFilterByQueNha((prev) => !prev)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition cursor-pointer ${
                    filterByQueNha
                      ? "bg-[var(--xanh-chinh)] text-white"
                      : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border border-[var(--vien-the)]"
                  }`}
                >
                  {filterByQueNha
                    ? "✓ Đang lọc theo bối cảnh"
                    : "Lọc theo bối cảnh"}
                </button>
              )}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-2 py-1 text-xs font-semibold text-[var(--xanh-chinh)] hover:underline cursor-pointer"
                >
                  Đặt lại tất cả
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. LƯỚI THẺ TRANG PHỤC TRIỂN LÃM */}
        {filteredCostumes.length === 0 ? (
          <div className="py-12 text-center bg-[var(--nen-the)] rounded-2xl border border-[var(--vien-the)] p-6 shadow-[var(--shadow-the)]">
            <p className="text-[var(--chu-phu)] text-sm mb-3">
              Không tìm thấy trang phục phù hợp với bộ lọc hiện tại.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--xanh-chinh)] text-white cursor-pointer"
            >
              Xem toàn bộ trang phục & 54 dân tộc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCostumes.map((item) => {
              const vung = REGION_BADGES[item.id] || "Việt Nam";
              const craftMeta =
                HERITAGE_CRAFT_DB[item.id] || HERITAGE_CRAFT_DB.aodai;
              const matchInfo = scoreMap[item.id];
              const isRecommended =
                queNhaRecommendation.hasContextFilter &&
                (matchInfo?.score ?? 0) >= 35;
              const relatedDanToc = costumeToDanTocMap[item.id] || [];

              return (
                <article
                  key={item.id}
                  className={`group flex flex-col bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] rounded-2xl shadow-[var(--shadow-the)] hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                    isRecommended ? "ring-2 ring-[var(--vang-chinh)]" : ""
                  }`}
                >
                  <div
                    onClick={() => {
                      playSilkRustleSound();
                      onSelectTrangPhuc(item.id, true);
                    }}
                    className="relative cursor-pointer overflow-hidden bg-gradient-to-b from-[var(--nen-the-phu)] to-[var(--nen-the)]"
                  >
                    <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--nen-the)]/90 backdrop-blur-xs border border-[var(--vien-the)] text-[11px] font-semibold text-[var(--chu-chinh)] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--xanh-chinh)]" />
                      <span>{vung}</span>
                    </div>

                    <CostumeCardPreview
                      trangPhucId={item.id}
                      enableFlip={true}
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3 border-t border-[var(--vien-the)]/60">
                    <div>
                      <div className="text-xs font-semibold text-[var(--vang-chinh)] mb-1 truncate">
                        {craftMeta.material} · {craftMeta.technique}
                      </div>

                      <h2
                        onClick={() => {
                          playSilkRustleSound();
                          onSelectTrangPhuc(item.id, true);
                        }}
                        className="font-serif text-lg font-bold text-[var(--chu-chinh)] group-hover:text-[var(--xanh-chinh)] transition-colors cursor-pointer m-0 truncate"
                      >
                        {item.ten}
                      </h2>

                      <p className="text-xs text-[var(--chu-phu)] line-clamp-2 mt-1 mb-0 leading-relaxed">
                        {item.moTaNgan}
                      </p>

                      {relatedDanToc.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap mt-2.5">
                          <span className="text-[10px] font-semibold text-[var(--chu-phu)] mr-0.5">
                            Dân tộc:
                          </span>
                          {relatedDanToc.slice(0, 5).map((dt) => (
                            <button
                              key={dt.id}
                              type="button"
                              onClick={() => {
                                setShowDanTocModule(true);
                                handleSelectDanToc(dt);
                              }}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition cursor-pointer border ${
                                selectedDanTocId === dt.id
                                  ? "bg-[var(--xanh-chinh)] text-white border-transparent"
                                  : "bg-[var(--nen-the-phu)] text-[var(--chu-chinh)] border-[var(--vien-the)] hover:border-[var(--xanh-la)]"
                              }`}
                            >
                              {dt.ten}
                            </button>
                          ))}
                          {relatedDanToc.length > 5 && (
                            <span className="text-[10px] font-medium text-[var(--chu-phu)]">
                              +{relatedDanToc.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 3 NÚT ĐIỀU HƯỚNG RÕ RÀNG */}
                    <div className="flex items-center gap-1.5 pt-2.5 border-t border-[var(--vien-the)]">
                      <button
                        type="button"
                        onClick={() => {
                          playSilkRustleSound();
                          onSelectTrangPhuc(item.id, true);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Phối 2D</span>
                      </button>

                      {onOpenThuDoAI && (
                        <button
                          type="button"
                          onClick={() => {
                            playSilkRustleSound();
                            onOpenThuDoAI(item.id);
                          }}
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-[var(--nen-the-phu)] hover:bg-[var(--vang-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--vang-chinh)] text-xs font-semibold transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
                          <span>AI & 3D</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          playFolkPluck();
                          onSelectTrangPhuc(item.id, false);
                        }}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] text-[var(--chu-chinh)] text-xs font-semibold transition cursor-pointer"
                        title={`Xem hồ sơ khảo cứu ${item.ten}`}
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
                        <span>Hồ sơ</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <AppFooter />

      {/* Modal Sổ Thông Hành Di Sản 54 Dân Tộc */}
      <CulturalPassportModal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        onSelectDanToc={(dt) => {
          const dtId = typeof dt === "string" ? dt : dt.id;
          const found = DAN_TOC_54.find((d) => d.id === dtId);
          if (found) {
            setShowDanTocModule(true);
            setSelectedDanTocId(found.id);
          }
        }}
        onOpenThamTu={onOpenThamTu}
      />
    </main>
  );
}
