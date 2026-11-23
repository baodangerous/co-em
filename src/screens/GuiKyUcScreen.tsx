/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import AvatarSVG from "../components/AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "../components/GarmentLayers";
import { NhanVatConfig, tinhSoDo, NHAN_VAT_MAC_DINH } from "../lib/avatar";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { domdom } from "../copy/domdom";
import AppFooter from "../components/AppFooter";
import {
  OutfitSaved,
  docDanhSachGuiKyUc,
  xoaKhoiGuiKyUc,
  capNhatCaptionGuiKyUc,
  xuatThePNG,
  SAMPLE_OUTFIT,
  luuVaoGuiKyUc,
  goiYCaptionGemini,
  MAX_OUTFITS,
} from "../lib/guiKyUc";
import { dangBaiLenChoPhien } from "../lib/choPhien";
import { layHoSoHienTai, HoSo } from "../lib/hoSo";
import { ThoiTietState } from "../lib/thoitiet";
import { QueNhaData } from "../types";
import { GUI_KY_UC_CSS } from "../components/gui-ky-uc/guiKyUcStyles";
import GuiComparePanel from "../components/gui-ky-uc/GuiComparePanel";

interface Props {
  onBack: () => void;
  onWearOutfit: (outfit: OutfitSaved) => void;
  globalNhanVatConfig?: NhanVatConfig;
  onOpenChoPhien?: () => void;
  onOpenChaoBan?: () => void;
  weatherState?: ThoiTietState;
  queNhaData?: QueNhaData;
}

export default function GuiKyUcScreen({
  onBack,
  onWearOutfit,
  globalNhanVatConfig,
  onOpenChoPhien,
}: Props) {
  const [hoSo, setHoSo] = useState<HoSo>(() => layHoSoHienTai());
  const [outfits, setOutfits] = useState<OutfitSaved[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [loadingGeminiId, setLoadingGeminiId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDemRaCho = (outfit: OutfitSaved) => {
    const res = dangBaiLenChoPhien(outfit);
    setExportToast(res.message);
    setTimeout(() => setExportToast(null), 3500);
    if (onOpenChoPhien) {
      setTimeout(() => onOpenChoPhien(), 700);
    }
  };

  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const svgRefs = useRef<Record<string, SVGSVGElement | null>>({});

  useEffect(() => {
    const list = docDanhSachGuiKyUc();
    setOutfits(list);

    const handleOutfitsChange = () => {
      setOutfits(docDanhSachGuiKyUc());
      setHoSo(layHoSoHienTai());
    };

    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent<HoSo>;
      if (customEvent.detail) {
        setHoSo(customEvent.detail);
      } else {
        setHoSo(layHoSoHienTai());
      }
      setOutfits(docDanhSachGuiKyUc());
    };

    window.addEventListener("vpr:outfits-change", handleOutfitsChange);
    window.addEventListener("vpr:profile-change", handleProfileChange);
    return () => {
      window.removeEventListener("vpr:outfits-change", handleOutfitsChange);
      window.removeEventListener("vpr:profile-change", handleProfileChange);
    };
  }, []);

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [prev[0], prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleDelete = (id: string, name: string) => {
    const updated = xoaKhoiGuiKyUc(id);
    setOutfits(updated);
    setSelectedForCompare((prev) => prev.filter((item) => item !== id));
    if (editingId === id) setEditingId(null);
    setConfirmDeleteId(null);
    setExportToast(`Đã xóa "${name}" khỏi Gùi Ký Ức.`);
    setTimeout(() => setExportToast(null), 3000);
  };

  const handleStartEdit = (outfit: OutfitSaved) => {
    setEditingId(outfit.id);
    setEditCaption(outfit.caption);
  };

  const handleSaveEdit = (id: string) => {
    const updated = capNhatCaptionGuiKyUc(id, editCaption);
    setOutfits(updated);
    setEditingId(null);
  };

  const handleGeminiForEdit = async (outfit: OutfitSaved) => {
    setLoadingGeminiId(outfit.id);
    const tpObj = trangPhuc.find((t) => t.id === outfit.trangPhucId);
    const mauObj = mauSac.find((m) => m.id === outfit.mauId);
    const tenPkList = outfit.phuKienIds.map(
      (pkId) => phuKien.find((p) => p.id === pkId)?.ten ?? pkId
    );

    try {
      const suggested = await goiYCaptionGemini({
        tenTrangPhuc: tpObj?.ten ?? outfit.trangPhucId,
        tenMau: mauObj?.ten ?? outfit.mauId,
        tenPhuKienList: tenPkList,
      });
      setEditCaption(suggested);
    } catch {
      setEditCaption("");
    } finally {
      setLoadingGeminiId(null);
    }
  };

  const handleExportCard = async (outfit: OutfitSaved) => {
    const svgEl = svgRefs.current[outfit.id];
    if (!svgEl) {
      setExportToast("Không tìm thấy mẫu vẽ nhân vật để in thẻ.");
      setTimeout(() => setExportToast(null), 3000);
      return;
    }

    setExportingId(outfit.id);
    const tpObj = trangPhuc.find((t) => t.id === outfit.trangPhucId);
    const mauObj = mauSac.find((m) => m.id === outfit.mauId);
    const tenPkList = outfit.phuKienIds.map(
      (pkId) => phuKien.find((p) => p.id === pkId)?.ten ?? pkId
    );

    const moTaPhu = `${mauObj?.ten ?? ""}${
      tenPkList.length > 0 ? ` · ${tenPkList.join(", ")}` : ""
    }`;

    const success = await xuatThePNG({
      svgElement: svgEl,
      tenBoDo: tpObj?.ten ?? "Việt Phục",
      moTaPhu,
      caption: outfit.caption,
      fileName: tpObj?.ten ?? "the_gui_ky_uc",
    });

    setExportingId(null);
    if (success) {
      setExportToast(`Đã xuất thẻ "${tpObj?.ten ?? "Việt Phục"}" thành công!`);
      setTimeout(() => setExportToast(null), 3500);
    }
  };

  const handleResetSample = () => {
    luuVaoGuiKyUc(SAMPLE_OUTFIT);
    setOutfits(docDanhSachGuiKyUc());
  };

  const compareOutfits = useMemo(() => {
    if (selectedForCompare.length < 2) return null;
    const first = outfits.find((o) => o.id === selectedForCompare[0]);
    const second = outfits.find((o) => o.id === selectedForCompare[1]);
    if (first && second) {
      return [first, second] as const;
    }
    return null;
  }, [selectedForCompare, outfits]);

  return (
    <main className="gui-screen">
      <style>{GUI_KY_UC_CSS}</style>
      <div className="gui-screen__noise" aria-hidden="true" />

      {exportToast && (
        <div className="gui-screen__toast" role="status">
          <span>{exportToast}</span>
        </div>
      )}

      {/* Header */}
      <header className="gui-screen__header">
        <div>
          <h1 className="gui-screen__brand-name">
            {domdom.guiKyUc.tieuDeTrang}
            <span className="gui-screen__user-tag">
              ({hoSo.tenHienThi})
            </span>
          </h1>
          <span className="gui-screen__brand-sub">
            Lưu trữ và đối chiếu các bản phối trang phục truyền thống
          </span>
        </div>

        <div className="gui-screen__header-actions">
          <span className="gui-screen__count-badge">
            Đã lưu: {outfits.length}/{MAX_OUTFITS} bộ
          </span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("vpr:open-nhat-ky"))}
            className="gui-screen__back-btn"
            title="Mở Nhật Ký Trải Nghiệm & Cảm Xúc"
          >
            Nhật Ký
          </button>
          {onOpenChoPhien && (
            <button
              type="button"
              onClick={onOpenChoPhien}
              className="gui-screen__back-btn"
              title="Mở màn hình Chợ Phiên"
            >
              {domdom.choPhien.tieuDe}
            </button>
          )}
          <button
            type="button"
            onClick={onBack}
            className="gui-screen__back-btn"
          >
            ← {domdom.common.back}
          </button>
        </div>
      </header>

      <div className="gui-screen__body">
        {compareOutfits && (
          <GuiComparePanel
            compareOutfits={compareOutfits}
            globalNhanVatConfig={globalNhanVatConfig}
            onCloseCompare={() => setSelectedForCompare([])}
          />
        )}

        {outfits.length === 0 ? (
          <div className="gui-empty-box">
            <p className="gui-empty-box__text">{domdom.guiKyUc.chuaCoBoNao}</p>
            <button
              type="button"
              onClick={handleResetSample}
              className="gui-btn gui-btn--primary"
            >
              Nạp lại bộ mẫu ({SAMPLE_OUTFIT.caption.slice(0, 20)}...)
            </button>
          </div>
        ) : (
          <div className="gui-cards-grid">
            {outfits.map((item) => {
              const tpObj =
                trangPhuc.find((t) => t.id === item.trangPhucId) ?? trangPhuc[0];
              const mauObj =
                mauSac.find((m) => m.id === item.mauId) ?? mauSac[0];
              const pkObjs = item.phuKienIds.map(
                (pkId) => phuKien.find((p) => p.id === pkId) ?? { id: pkId, ten: pkId }
              );

              const charConfig =
                item.nhanVatConfig ?? globalNhanVatConfig ?? NHAN_VAT_MAC_DINH;
              const soDo = tinhSoDo(charConfig);
              const garmentLayers = renderGarmentLayers({
                trangPhucId: item.trangPhucId,
                soDo,
                mauHex: mauObj.hex,
                phuKienIds: item.phuKienIds,
                hoaVanThem: item.hoaVanThem,
                phongCach: item.phongCach,
              });

              const isComparing = selectedForCompare.includes(item.id);
              const isEditing = editingId === item.id;
              const isExporting = exportingId === item.id;

              return (
                <article
                  key={item.id}
                  className={`gui-card ${isComparing ? "gui-card--comparing" : ""}`}
                >
                  <div className="gui-card__avatar-wrap">
                    <svg
                      ref={(el) => {
                        svgRefs.current[item.id] = el;
                      }}
                      viewBox="0 0 400 560"
                      className="gui-card__avatar-svg"
                    >
                      <AvatarSVG
                        nhanVat={charConfig}
                        childrenDefs={<CulturalPatternsDefs />}
                        childrenVayQuan={garmentLayers.childrenVayQuan}
                        childrenAo={garmentLayers.childrenAo}
                        childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
                        childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
                      />
                    </svg>
                  </div>

                  <div className="gui-card__content">
                    <div className="gui-card__header">
                      <h2 className="gui-card__name">{tpObj.ten}</h2>
                      <span className="gui-card__date">
                        {new Date(item.taoLuc).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className="gui-card__meta">
                      <span className="gui-card__meta-item">
                        <span
                          className="gui-card__swatch"
                          style={{ backgroundColor: mauObj.hex }}
                        />
                        {mauObj.ten}
                      </span>
                      {pkObjs.length > 0 && (
                        <span className="gui-card__meta-item">
                          · {pkObjs.map((p) => p.ten).join(", ")}
                        </span>
                      )}
                    </div>

                    <div className="gui-card__caption-box">
                      {isEditing ? (
                        <div className="gui-edit-caption">
                          <textarea
                            value={editCaption}
                            onChange={(e) =>
                              setEditCaption(e.target.value.slice(0, 140))
                            }
                            rows={2}
                            maxLength={140}
                            className="gui-edit-caption__input"
                            placeholder="Nhập chú thích tối đa 140 ký tự..."
                          />
                          <div className="gui-edit-caption__actions">
                            <button
                              type="button"
                              onClick={() => handleGeminiForEdit(item)}
                              disabled={loadingGeminiId === item.id}
                              className="gui-btn-mini gui-btn-mini--gemini"
                            >
                              {loadingGeminiId === item.id ? "Đang gợi ý..." : "Gợi ý mô tả"}
                            </button>
                            <div className="gui-edit-caption__save-wrap">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="gui-btn-mini"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(item.id)}
                                className="gui-btn-mini gui-btn-mini--primary"
                              >
                                {domdom.guiKyUc.luuChuThich}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="gui-card__caption">
                          "{item.caption || "Một nếp áo kỷ niệm trong gùi."}"
                        </p>
                      )}
                    </div>

                    <div className="gui-card__actions">
                      <button
                        type="button"
                        onClick={() => handleToggleCompare(item.id)}
                        className={`gui-action-btn ${
                          isComparing ? "gui-action-btn--active" : ""
                        }`}
                        title={
                          isComparing
                            ? domdom.guiKyUc.dangChonSoSanh
                            : domdom.guiKyUc.chonSoSanh
                        }
                      >
                        {isComparing ? domdom.guiKyUc.dangChonSoSanh : domdom.guiKyUc.chonSoSanh}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportCard(item)}
                        disabled={isExporting}
                        className="gui-action-btn gui-action-btn--export"
                        title="Tạo ảnh PNG từ SVG qua canvas và tải về"
                      >
                        {isExporting ? "Đang xuất ảnh..." : domdom.guiKyUc.xuatThePNG}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemRaCho(item)}
                        className="gui-action-btn"
                        title="Đem bộ trang phục này ra Chợ Phiên"
                      >
                        {domdom.choPhien.nutDemRaCho}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          isEditing ? setEditingId(null) : handleStartEdit(item)
                        }
                        className="gui-action-btn"
                      >
                        {domdom.guiKyUc.suaChuThich}
                      </button>

                      <button
                        type="button"
                        onClick={() => onWearOutfit(item)}
                        className="gui-action-btn gui-action-btn--wear"
                      >
                        {domdom.guiKyUc.macLaiBoNay}
                      </button>

                      {confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, tpObj.ten)}
                            className="gui-action-btn gui-action-btn--delete"
                            title="Xác nhận xóa bộ này"
                          >
                            Xác nhận xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="gui-action-btn"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="gui-action-btn gui-action-btn--delete"
                          title={domdom.guiKyUc.xoaKhoiGui}
                        >
                          {domdom.guiKyUc.xoaKhoiGui}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <AppFooter />
    </main>
  );
}
