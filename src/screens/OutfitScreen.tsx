/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from "react";
import AvatarSVG from "../components/AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "../components/GarmentLayers";
import { NhanVatConfig, tinhSoDo, NHAN_VAT_MAC_DINH, toCroquisBodyType } from "../lib/avatar";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { nhom } from "../data/nhom";
import { trangPhuc } from "../data/trangphuc";
import { domdom } from "../copy/coem";
import {
  playFabricRustle,
  playSilverBell,
  playClogSteps,
  playFootstepSound,
  playFolkPluck,
} from "../lib/audio";
import { docCaiDatTraiNghiem } from "../lib/caiDatTraiNghiem";
import MotTrangDoiModal from "../components/MotTrangDoiModal";
import AppFooter from "../components/AppFooter";
import { evaluateColor, evaluateRemix } from "../lib/rules";
import CatVaoGuiModal from "../components/CatVaoGuiModal";
import { docDanhSachGuiKyUc } from "../lib/guiKyUc";
import { Vai } from "../types";
import { layChatLieuTuTrangPhuc } from "../lib/ghiChuChatLieu";
import { layKhoaTheoHoSo, layHoSoHienTai } from "../lib/hoSo";
import { keLyDoRemix } from "../lib/loiKe";
import { callGemini } from "../lib/gemini";
import { ThoiTietState } from "../lib/thoitiet";
import GenzEventSelector from "../components/GenzEventSelector";
import ColorHarmonyChecker from "../components/ColorHarmonyChecker";
import CulturalWarningCard from "../components/CulturalWarningCard";
import OutfitCompareModal, { OutfitOption } from "../components/OutfitCompareModal";
import LookbookModal from "../components/LookbookModal";
import VirtualTryOnModal from "../components/VirtualTryOnModal";
import { SuKienGenZ } from "../data/genzRemixData";
import {
  OutfitControlTabs,
  ColorSelector,
  FabricSelector,
  PatternSelector,
  AccessorySelector,
  FootwearSelector,
  GenderFilterCard,
  type OutfitTab,
  type VaiNangCao,
} from "../outfit";
import { GOI_Y_PRESETS_BY_COSTUME, type OutfitPresetItem } from "../outfit/outfitPresets";
import { OUTFIT_SCREEN_CSS } from "../outfit/outfitScreenStyles";
import OutfitStagePreviewSection from "../outfit/OutfitStagePreviewSection";
import OutfitViSaoModal from "../outfit/OutfitViSaoModal";

type Props = {
  trangPhucId: string;
  nhanVatConfig?: NhanVatConfig;
  onUpdateCharacterConfig?: (config: NhanVatConfig) => void;
  weatherState?: ThoiTietState;
  onBackToDetail: () => void;
  onOpenCharacterSelect: () => void;
  onSelectAnotherCostume: () => void;
  onChangeTrangPhuc?: (trangPhucId: string) => void;
  onOpenThuDoAI?: (trangPhucId: string) => void;
  onOpenChoPhien?: () => void;
  onOpenGuiKyUc?: () => void;
  onOpenDongThoiGian?: () => void;
};

export default function OutfitScreen({
  trangPhucId,
  nhanVatConfig,
  onUpdateCharacterConfig,
  onBackToDetail,
  onOpenCharacterSelect,
  onSelectAnotherCostume,
  onChangeTrangPhuc,
  onOpenThuDoAI,
  onOpenChoPhien,
  onOpenGuiKyUc,
}: Props) {
  const defaultMauId = "m_do";
  const defaultPhuKienIds = ["non_la"];

  const currentTrangPhuc = useMemo(() => {
    return (
      trangPhuc.find((t) => t.id === trangPhucId) ??
      trangPhuc.find((t) => t.id === "aodai") ??
      trangPhuc[0]
    );
  }, [trangPhucId]);

  const nhanVat: NhanVatConfig = nhanVatConfig ?? NHAN_VAT_MAC_DINH;
  const soDo = useMemo(() => tinhSoDo(nhanVat), [nhanVat]);

  const [selectedMauId, setSelectedMauId] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlMau = urlParams.get("m");
        if (urlMau && mauSac.some((m) => m.id === urlMau)) return urlMau;

        if (window.localStorage) {
          const saved = window.localStorage.getItem(layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`));
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.mauId) return parsed.mauId;
          }
        }
      }
    } catch {
      // Bỏ qua
    }
    return defaultMauId;
  });

  const [selectedPhuKienIds, setSelectedPhuKienIds] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPk = urlParams.get("pk");
        if (urlPk) {
          const items = urlPk.split(",").filter(Boolean);
          if (items.length > 0) return items;
        }

        if (window.localStorage) {
          const saved = window.localStorage.getItem(layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`));
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed.phuKienIds)) return parsed.phuKienIds;
          }
        }
      }
    } catch {
      // Bỏ qua
    }
    return defaultPhuKienIds;
  });

  const [hoaVanThem, setHoaVanThem] = useState<string | null>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem(layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`));
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.hoaVanThem !== undefined) return parsed.hoaVanThem;
        }
      }
    } catch {
      // Bỏ qua
    }
    return null;
  });

  const [phongCach, setPhongCach] = useState<string>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem(layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`));
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.phongCach) return parsed.phongCach;
        }
      }
    } catch {
      // Bỏ qua
    }
    return "truyen_thong";
  });

  const [hoveredColorId, setHoveredColorId] = useState<string | null>(null);
  const [activeOutfitTab, setActiveOutfitTab] = useState<OutfitTab>("mau_sac");
  const [selectedFootwearId, setSelectedFootwearId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlFw = new URLSearchParams(window.location.search).get("fw");
      if (urlFw) return urlFw;
      try {
        if (window.localStorage) {
          const saved = window.localStorage.getItem(layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`));
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.footwearId) return parsed.footwearId;
          }
        }
      } catch {
        // ignore
      }
    }
    return defaultPhuKienIds.includes("sneaker") ? "sneaker" : "guoc_moc";
  });

  const [isPerforming, setIsPerforming] = useState<boolean>(false);
  const [completedMoment, setCompletedMoment] = useState<boolean>(false);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [showCatGuiModal, setShowCatGuiModal] = useState<boolean>(false);
  const [savedOutfitsCount, setSavedOutfitsCount] = useState<number>(() => {
    return docDanhSachGuiKyUc().length;
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>("ky_yeu");
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showLookbookModal, setShowLookbookModal] = useState<boolean>(false);
  const [showTryOnModal, setShowTryOnModal] = useState<boolean>(false);
  const activeHoSo = layHoSoHienTai();

  const [optionBForCompare, setOptionBForCompare] = useState<OutfitOption>({
    ten: "Phương án Gợi ý Đổi",
    trangPhucId: currentTrangPhuc.id,
    mauId: selectedMauId === "m_do" ? "m_trang" : "m_do",
    phuKienIds: selectedMauId === "m_do" ? ["kieng_bac"] : ["non_la", "kieng_bac"],
    footwearId: "sneaker",
    phongCach: "y2k_remix",
  });

  const defaultVai = useMemo(() => {
    return layChatLieuTuTrangPhuc(currentTrangPhuc.id, selectedMauId);
  }, [currentTrangPhuc.id, selectedMauId]);

  const [customSelectedVai, setCustomSelectedVai] = useState<Vai | null>(null);

  useEffect(() => {
    setCustomSelectedVai(null);
  }, [currentTrangPhuc.id, selectedMauId]);

  const currentVai = customSelectedVai ?? defaultVai;

  useEffect(() => {
    const handleUpdateCount = () => {
      setSavedOutfitsCount(docDanhSachGuiKyUc().length);
    };
    window.addEventListener("vpr:outfits-change", handleUpdateCount);
    return () => window.removeEventListener("vpr:outfits-change", handleUpdateCount);
  }, []);

  const loadedCostumeRef = useRef<string>(currentTrangPhuc.id);
  useEffect(() => {
    if (loadedCostumeRef.current === currentTrangPhuc.id) return;
    loadedCostumeRef.current = currentTrangPhuc.id;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem(
          layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`)
        );
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.mauId) setSelectedMauId(parsed.mauId);
          else setSelectedMauId(defaultMauId);
          if (Array.isArray(parsed.phuKienIds)) setSelectedPhuKienIds(parsed.phuKienIds);
          else setSelectedPhuKienIds(defaultPhuKienIds);
          setHoaVanThem(parsed.hoaVanThem ?? null);
          setPhongCach(parsed.phongCach || "truyen_thong");
          if (parsed.footwearId) setSelectedFootwearId(parsed.footwearId);
          return;
        }
      }
    } catch {
      // ignore
    }
    setSelectedMauId(defaultMauId);
    setSelectedPhuKienIds(defaultPhuKienIds);
    setHoaVanThem(null);
    setPhongCach("truyen_thong");
  }, [currentTrangPhuc.id]);

  useEffect(() => {
    if (loadedCostumeRef.current !== currentTrangPhuc.id) return;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const data = {
          trangPhucId: currentTrangPhuc.id,
          mauId: selectedMauId,
          phuKienIds: selectedPhuKienIds,
          hoaVanThem,
          phongCach,
          footwearId: selectedFootwearId,
        };
        window.localStorage.setItem(
          layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`),
          JSON.stringify(data)
        );
      }
    } catch {
      // Bỏ qua
    }
  }, [
    currentTrangPhuc.id,
    selectedMauId,
    selectedPhuKienIds,
    hoaVanThem,
    phongCach,
    selectedFootwearId,
  ]);

  const activeColorObj = useMemo(() => {
    return mauSac.find((m) => m.id === selectedMauId) ?? mauSac[0];
  }, [selectedMauId]);

  const handleSelectColor = (mauId: string) => {
    setSelectedMauId(mauId);
    playFabricRustle();
  };

  const handleToggleAccessory = (pkId: string) => {
    setSelectedPhuKienIds((prev) => {
      let next: string[];
      if (prev.includes(pkId)) {
        next = prev.filter((id) => id !== pkId);
      } else {
        const targetPk = phuKien.find((p) => p.id === pkId);
        if (targetPk && (targetPk.loai === "non" || targetPk.loai === "khan")) {
          next = prev.filter((id) => {
            const existing = phuKien.find((p) => p.id === id);
            return !existing || existing.loai !== targetPk.loai;
          });
          next.push(pkId);
        } else {
          next = [...prev, pkId];
        }
      }
      playFabricRustle();
      return next;
    });
  };

  const handleSelectHoaVan = (nhomId: string | null) => {
    setHoaVanThem(nhomId);
    playFabricRustle();
  };

  const handleSelectFootwear = (id: string) => {
    setSelectedFootwearId(id);
    playFootstepSound(id);
    setSelectedPhuKienIds((prev) => {
      const filtered = prev.filter(
        (x) => !["guoc_moc", "hai_theu", "sneaker", "dep_da_co"].includes(x)
      );
      return id === "sneaker" ? [...filtered, "sneaker"] : filtered;
    });
  };

  const handleApplyPreset = (preset: OutfitPresetItem) => {
    setSelectedMauId(preset.mauId);
    setSelectedPhuKienIds(preset.phuKienIds);
    setSelectedFootwearId(preset.footwearId);
    setPhongCach(preset.phongCach);
    playFabricRustle();
  };

  const handleSelectEvent = (event: SuKienGenZ) => {
    setSelectedEventId(event.id);
  };

  const handleApplyEventRecommendation = (event: SuKienGenZ) => {
    setSelectedEventId(event.id);
    if (event.mauDeXuat[0]) {
      setSelectedMauId(event.mauDeXuat[0]);
    }
    setSelectedPhuKienIds(event.phuKienDeXuat);
    setSelectedFootwearId(event.giayDeXuat);
    setPhongCach(event.phongCachMacDinh);
    playSilverBell();
    setCompletedMoment(true);
  };

  const handleOpenCompareModal = () => {
    const presetCandidates = GOI_Y_PRESETS_BY_COSTUME[currentTrangPhuc.id] || [];
    const altPreset =
      presetCandidates.find((p) => p.mauId !== selectedMauId) || presetCandidates[0];

    setOptionBForCompare({
      ten: altPreset ? altPreset.ten : "Bản Phối Cách Tân Hiện Đại",
      trangPhucId: currentTrangPhuc.id,
      mauId: altPreset ? altPreset.mauId : selectedMauId === "m_do" ? "m_trang" : "m_do",
      phuKienIds: altPreset ? altPreset.phuKienIds : ["kieng_bac"],
      footwearId: altPreset ? altPreset.footwearId : "sneaker",
      phongCach: altPreset ? altPreset.phongCach : "y2k_remix",
    });

    setShowCompareModal(true);
  };

  const handleApplyOptionFromCompare = (opt: OutfitOption) => {
    setSelectedMauId(opt.mauId);
    setSelectedPhuKienIds(opt.phuKienIds);
    setSelectedFootwearId(opt.footwearId);
    setPhongCach(opt.phongCach);
    playFabricRustle();
  };

  const handleSelectFabric = (f: VaiNangCao) => {
    setCustomSelectedVai(f);
    playFabricRustle();
  };

  const handleFinishOutfit = () => {
    playClogSteps();
    const isReduced = docCaiDatTraiNghiem().giamChuyenDong;
    if (isReduced) {
      setIsPerforming(false);
      setCompletedMoment(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vpr:outfit-completed", {
            detail: { trangPhucId: currentTrangPhuc.id, action: "finish" },
          })
        );
      }
      return;
    }

    setIsPerforming(true);
    playSilverBell();

    setTimeout(() => {
      setIsPerforming(false);
      setCompletedMoment(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vpr:outfit-completed", {
            detail: { trangPhucId: currentTrangPhuc.id, action: "finish" },
          })
        );
      }
    }, 1500);
  };

  const garmentLayers = useMemo(() => {
    return renderGarmentLayers({
      trangPhucId: currentTrangPhuc.id,
      soDo,
      mauHex: activeColorObj.hex,
      phuKienIds: selectedPhuKienIds,
      footwearId: selectedFootwearId,
      hoaVanThem,
      phongCach,
      bodyType: toCroquisBodyType(nhanVat.tuoi),
    });
  }, [
    currentTrangPhuc.id,
    soDo,
    activeColorObj.hex,
    selectedPhuKienIds,
    selectedFootwearId,
    hoaVanThem,
    phongCach,
    nhanVat.tuoi,
  ]);

  const computedViewBox = useMemo(() => {
    let minX = 60;
    let maxX = 340;
    let minY = -75;
    let maxY = 810;

    const hasTallHeadwear = selectedPhuKienIds.some((id) =>
      ["non_la", "khan_dong", "khan_mo_qua", "non_quai_thao", "khan_pieu", "tram_cai"].includes(
        id
      )
    );
    if (hasTallHeadwear || nhanVat.gioi === "nam") {
      minY = Math.min(minY, -85);
    }
    if (selectedPhuKienIds.includes("non_quai_thao")) {
      minX = Math.min(minX, 45);
      maxX = Math.max(maxX, 355);
    }

    if (["aodai", "ngu_than", "tu_than"].includes(currentTrangPhuc.id)) {
      minX = Math.min(minX, 50);
      maxX = Math.max(maxX, 350);
    }

    if (selectedFootwearId) {
      maxY = Math.max(maxY, 815);
    }

    const width = maxX - minX;
    const height = maxY - minY;
    return `${minX} ${minY} ${width} ${height}`;
  }, [selectedPhuKienIds, nhanVat.gioi, currentTrangPhuc.id, selectedFootwearId]);

  const tenNhomHoaVan = useMemo(() => {
    if (!hoaVanThem) return null;
    const n = nhom.find((g) => g.id === hoaVanThem);
    return n ? n.ten : hoaVanThem;
  }, [hoaVanThem]);

  const colorEvaluation = useMemo(() => {
    return evaluateColor(selectedMauId, selectedPhuKienIds);
  }, [selectedMauId, selectedPhuKienIds]);

  const remixEvaluation = useMemo(() => {
    return evaluateRemix({
      trangPhucId: currentTrangPhuc.id,
      phuKienIds: selectedPhuKienIds,
      hoaVanThem,
      phongCach,
    });
  }, [currentTrangPhuc.id, selectedPhuKienIds, hoaVanThem, phongCach]);

  const [selectedLyDoRemix] = useState<string[]>([]);
  const cauLyDoRemix = useMemo(() => {
    if (selectedLyDoRemix.length === 0) return null;
    return keLyDoRemix({
      tenTrangPhuc: currentTrangPhuc.ten,
      mucRemix: currentTrangPhuc.mucRemix,
      mauHienTai: selectedMauId,
      tenMauHienTai: activeColorObj.ten,
      phuKienHienTai: selectedPhuKienIds,
      lyDoDaChon: selectedLyDoRemix,
    });
  }, [
    currentTrangPhuc.ten,
    currentTrangPhuc.mucRemix,
    selectedMauId,
    activeColorObj.ten,
    selectedPhuKienIds,
    selectedLyDoRemix,
  ]);

  const [showViSaoModal, setShowViSaoModal] = useState<boolean>(false);
  const [viSaoLoading, setViSaoLoading] = useState<boolean>(false);
  const [viSaoText, setViSaoText] = useState<string>("");

  const handleOpenViSao = async () => {
    setShowViSaoModal(true);
    setViSaoLoading(true);
    try {
      const tenMau = activeColorObj.ten;
      const tenPhuKien = selectedPhuKienIds
        .map((id) => phuKien.find((p) => p.id === id)?.ten ?? id)
        .join(", ");
      const prompt = `Bạn là Cò Em, người bạn đồng hành am hiểu cổ phục Việt Nam, xưng Cò Em gọi bạn. Người dùng đang phối trang phục "${currentTrangPhuc.ten}", chọn màu "${tenMau}", phụ kiện: "${tenPhuKien || "không có"}", hoa văn mượn: "${tenNhomHoaVan || "vải trơn"}", phong cách: "${phongCach}". Nhãn văn hóa hiện tại là: "${remixEvaluation.nhanHienThi}".
Hãy viết 2-3 câu ngắn gọn, ấm áp, giải thích vì sao bộ phối này mang tinh thần như vậy và ý nghĩa chiều sâu văn hóa của sự kết hợp này. Giữ giọng điệu tôn trọng và khơi gợi cảm hứng.`;

      const aiResponse = await callGemini({
        cauHoi: prompt,
        callerKey: "vi_sao",
      });
      if (aiResponse?.ok && typeof aiResponse.data === "string" && aiResponse.data.trim()) {
        setViSaoText(aiResponse.data);
        setViSaoLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Lỗi gọi Gemini cho giải thích sâu:", err);
    }

    setViSaoText(
      remixEvaluation.giaiThich3Phan.toanBo ||
        "Mỗi nếp áo xưa đều mang theo câu chuyện đời sống và nghi lễ của tiền nhân. Giữ nét cũ, mở lối mới để trang phục luôn sống động cùng thời gian."
    );
    setViSaoLoading(false);
  };

  return (
    <main className="outfit-screen">
      <style>{OUTFIT_SCREEN_CSS}</style>
      <div className="outfit-screen__noise" aria-hidden="true" />

      <header className="outfit-screen__header">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <span className="outfit-screen__brand-name">Xưởng Phối Đồ 2D</span>
            <span className="outfit-screen__brand-sub">{currentTrangPhuc.ten}</span>
          </div>

          {onChangeTrangPhuc && (
            <select
              value={currentTrangPhuc.id}
              onChange={(e) => {
                playFolkPluck();
                onChangeTrangPhuc(e.target.value);
              }}
              aria-label="Đổi nhanh trang phục"
              className="px-3 py-1.5 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] text-xs font-semibold text-[var(--nen-toi)] cursor-pointer"
            >
              {trangPhuc.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.ten}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="outfit-screen__header-actions">
          {onOpenGuiKyUc && (
            <button
              type="button"
              onClick={onOpenGuiKyUc}
              className="outfit-screen__pill-btn outfit-screen__pill-btn--highlight"
            >
              🎒 Gùi ({savedOutfitsCount}/6)
            </button>
          )}

          {onOpenChoPhien && (
            <button
              type="button"
              onClick={onOpenChoPhien}
              className="outfit-screen__pill-btn"
            >
              🏮 Chợ Phiên
            </button>
          )}

          <button
            type="button"
            onClick={onBackToDetail}
            className="outfit-screen__pill-btn"
          >
            📖 Hồ sơ áo
          </button>

          <button
            type="button"
            onClick={onSelectAnotherCostume}
            className="outfit-screen__back-btn"
          >
            ← Bộ sưu tập
          </button>
        </div>
      </header>

      <div className="outfit-screen__body">
        <OutfitStagePreviewSection
          isPerforming={isPerforming}
          completedMoment={completedMoment}
          nhanVat={nhanVat}
          computedViewBox={computedViewBox}
          garmentLayers={garmentLayers}
          costumeName={currentTrangPhuc.ten}
          colorName={activeColorObj.ten}
          tenNhomHoaVan={tenNhomHoaVan}
          colorBadgeLabel={colorEvaluation.nhanHienThi}
          remixBadgeLabel={remixEvaluation.nhanHienThi}
          onOpenViSao={handleOpenViSao}
          onFinishOutfit={handleFinishOutfit}
          onOpenCatGui={() => setShowCatGuiModal(true)}
          onOpenAIAnd3D={() => {
            if (onOpenThuDoAI) {
              onOpenThuDoAI(currentTrangPhuc.id);
            } else {
              setShowTryOnModal(true);
            }
          }}
          onOpenLookbook={() => setShowLookbookModal(true)}
          onOpenCompare={handleOpenCompareModal}
          onOpenChoPhien={onOpenChoPhien}
        />

        <section className="outfit-screen__controls-section">
          <OutfitControlTabs
            activeTab={activeOutfitTab}
            onSelectTab={setActiveOutfitTab}
          />

          {activeOutfitTab === "mau_sac" && (
            <div className="space-y-3">
              <div className="outfit-control-card">
                <ColorSelector
                  selectedColorId={selectedMauId}
                  onSelectColor={handleSelectColor}
                  hoveredColorId={hoveredColorId}
                  onHoverColor={setHoveredColorId}
                />
              </div>

              <div className="outfit-control-card">
                <FabricSelector
                  selectedFabricId={currentVai?.id || "lua_van_phuc"}
                  onSelectFabric={handleSelectFabric}
                />
              </div>
            </div>
          )}

          {activeOutfitTab === "phu_kien" && (
            <div className="space-y-3">
              <div className="outfit-control-card">
                <AccessorySelector
                  selectedIds={selectedPhuKienIds}
                  onToggleAccessory={handleToggleAccessory}
                />
              </div>

              <div className="outfit-control-card">
                <FootwearSelector
                  selectedFootwearId={selectedFootwearId}
                  onSelectFootwear={handleSelectFootwear}
                />
              </div>
            </div>
          )}

          {activeOutfitTab === "hoa_tiet" && (
            <div className="space-y-3">
              <div className="outfit-control-card">
                <PatternSelector
                  selectedPatternId={hoaVanThem}
                  onSelectPattern={handleSelectHoaVan}
                />
              </div>

              <div className="outfit-control-card">
                <h2 className="text-xs font-bold text-[var(--nen-toi)] uppercase tracking-wider mb-2">
                  {domdom.s4.phongCach}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "truyen_thong", ten: domdom.s4.phongCachTruyenThong },
                    { id: "cach_tan_nhe", ten: domdom.s4.phongCachCachTan },
                    { id: "ca_tinh", ten: domdom.s4.phongCachCaTinh },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setPhongCach(st.id);
                        playFabricRustle();
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                        phongCach === st.id
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-[var(--nen-the-phu)] border-[var(--vien-the)] text-[var(--nen-toi)]"
                      }`}
                    >
                      {st.ten}
                    </button>
                  ))}
                </div>
              </div>

              <ColorHarmonyChecker
                selectedColorId={selectedMauId}
                selectedAccessoryColorId={selectedPhuKienIds[0]}
              />
              <CulturalWarningCard
                trangPhucId={currentTrangPhuc.id}
                mauId={selectedMauId}
                phuKienIds={selectedPhuKienIds}
                giayId={selectedFootwearId}
                phongCachId={phongCach}
              />
            </div>
          )}

          {activeOutfitTab === "gioi_tinh" && (
            <div className="outfit-control-card">
              <GenderFilterCard
                currentGender={nhanVat.gioi}
                config={nhanVat}
                onUpdateConfig={onUpdateCharacterConfig}
                onOpenFullAtelier={onOpenCharacterSelect}
              />
            </div>
          )}

          {activeOutfitTab === "su_kien" && (
            <div className="space-y-3">
              {GOI_Y_PRESETS_BY_COSTUME[currentTrangPhuc.id] &&
                GOI_Y_PRESETS_BY_COSTUME[currentTrangPhuc.id].length > 0 && (
                  <div className="outfit-control-card border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-bold text-[var(--nen-toi)] m-0">
                        Bộ Phối Mẫu Chuẩn Điệu ({currentTrangPhuc.ten})
                      </h2>
                      <span className="text-xs text-[var(--tro-tram)]">
                        1-chạm áp dụng
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {GOI_Y_PRESETS_BY_COSTUME[currentTrangPhuc.id].map((preset, idx) => {
                        const isMatching =
                          selectedMauId === preset.mauId &&
                          selectedFootwearId === preset.footwearId &&
                          preset.phuKienIds.every((id) => selectedPhuKienIds.includes(id));
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border transition text-left flex flex-col justify-between gap-2 ${
                              isMatching
                                ? "border-amber-500 bg-amber-100/60 dark:bg-amber-900/30"
                                : "border-[var(--vien-the)] bg-[var(--nen-the)]"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-bold text-[var(--nen-toi)]">
                                {preset.ten}
                              </div>
                              <p className="text-xs text-[var(--tro-tram)] mt-0.5 m-0">
                                {preset.moTa}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyPreset(preset)}
                              className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition ${
                                isMatching
                                  ? "bg-amber-600 text-white"
                                  : "bg-[var(--nen-the-phu)] hover:bg-amber-500 hover:text-slate-950 text-[var(--nen-toi)] border border-[var(--vien-the)]"
                              }`}
                            >
                              {isMatching ? "✓ Đang áp dụng" : "Áp dụng bộ này"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              <GenzEventSelector
                selectedEventId={selectedEventId}
                onSelectEvent={handleSelectEvent}
                onApplyRecommendation={handleApplyEventRecommendation}
              />
            </div>
          )}
        </section>
      </div>

      <AppFooter currentCostumeName={currentTrangPhuc.ten} />

      <MotTrangDoiModal
        trangPhucId={currentTrangPhuc.id}
        isOpen={showStory}
        onClose={() => setShowStory(false)}
      />

      {showCatGuiModal && (
        <CatVaoGuiModal
          trangPhucId={currentTrangPhuc.id}
          tenTrangPhuc={currentTrangPhuc.ten}
          mauId={selectedMauId}
          tenMau={activeColorObj.ten}
          phuKienIds={selectedPhuKienIds}
          tenPhuKienList={selectedPhuKienIds.map(
            (id) => phuKien.find((p) => p.id === id)?.ten ?? id
          )}
          hoaVanThem={hoaVanThem}
          phongCach={phongCach}
          nhanVatConfig={nhanVat}
          lyDoRemix={selectedLyDoRemix}
          cauLyDoRemix={cauLyDoRemix || undefined}
          nhanVatPreview={
            <AvatarSVG
              nhanVat={nhanVat}
              customViewBox={computedViewBox}
              childrenDefs={<CulturalPatternsDefs />}
              childrenVayQuan={garmentLayers.childrenVayQuan}
              childrenAo={garmentLayers.childrenAo}
              childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
              childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
            />
          }
          onClose={() => setShowCatGuiModal(false)}
          onOpenGuiKyUc={() => {
            setShowCatGuiModal(false);
            onOpenGuiKyUc?.();
          }}
        />
      )}

      <OutfitViSaoModal
        isOpen={showViSaoModal}
        loading={viSaoLoading}
        text={viSaoText}
        onClose={() => setShowViSaoModal(false)}
      />

      <OutfitCompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        optionA={{
          ten: "Phương án đang chọn (A)",
          trangPhucId: currentTrangPhuc.id,
          mauId: selectedMauId,
          phuKienIds: selectedPhuKienIds,
          footwearId: selectedFootwearId,
          hoaVanThem,
          phongCach,
        }}
        optionB={optionBForCompare}
        onSelectOption={handleApplyOptionFromCompare}
      />

      <LookbookModal
        isOpen={showLookbookModal}
        onClose={() => setShowLookbookModal(false)}
        trangPhucId={currentTrangPhuc.id}
        mauId={selectedMauId}
        phuKienIds={selectedPhuKienIds}
        footwearId={selectedFootwearId}
        activeHoSo={activeHoSo}
        onSaveToGui={() => setShowCatGuiModal(true)}
      />

      <VirtualTryOnModal
        isOpen={showTryOnModal}
        onClose={() => setShowTryOnModal(false)}
        currentTrangPhuc={currentTrangPhuc}
        selectedMauId={selectedMauId}
        selectedPhuKienIds={selectedPhuKienIds}
        selectedFootwearId={selectedFootwearId}
        selectedFabricName={currentVai?.ten || "Lụa tơ tằm truyền thống"}
      />
    </main>
  );
}
