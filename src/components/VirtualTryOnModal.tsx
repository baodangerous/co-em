/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AI VIRTUAL TRY-ON — TẢI ẢNH CÁ NHÂN (CÓ RÀNG BUỘC) & MÔ HÌNH TINH CHỈNH GHÉP TRANG PHỤC
 */

import React, { useState, useRef, useMemo } from "react";
import {
  Upload,
  RefreshCw,
  Download,
  X,
  Check,
  Camera,
  Archive,
  Move,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { TrangPhuc } from "../types";
import { mauSac } from "../data/mausac";
import { luuVaoGuiKyUc } from "../lib/guiKyUc";
import { playSilkRustleSound, playSilverBell } from "../lib/audio";
import { CulturalPatternsDefs, renderGarmentLayers } from "./GarmentLayers";
import { NhanVatConfig, tinhSoDo } from "../lib/avatar";
import {
  DEFAULT_CALIBRATION,
  validateAndScanPortrait,
  type CalibrationData,
  type PhotoValidationReport,
  type BlendModelId,
} from "./virtual-tryon/portraitScanner";
import { exportTryOnCanvasHD } from "./virtual-tryon/tryOnCanvasExporter";
import TryOnControlPanel from "./virtual-tryon/TryOnControlPanel";

export type { CalibrationData, PhotoValidationReport, BlendModelId };

export interface VirtualTryOnProps {
  isOpen: boolean;
  onClose?: () => void;
  currentTrangPhuc: TrangPhuc;
  selectedMauId: string;
  selectedPhuKienIds: string[];
  selectedFootwearId?: string;
  selectedFabricName?: string;
  embedded?: boolean;
}

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  currentTrangPhuc,
  selectedMauId,
  selectedPhuKienIds,
  selectedFabricName = "Lụa tơ tằm",
  embedded = false,
}: VirtualTryOnProps) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [hasTriedOn, setHasTriedOn] = useState<boolean>(false);
  const [calibration, setCalibration] = useState<CalibrationData>(DEFAULT_CALIBRATION);
  const [, setValidationReport] = useState<PhotoValidationReport | null>(null);
  const [agreedConstraint, setAgreedConstraint] = useState<boolean>(true);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Mô hình tinh chỉnh ghép ảnh vào trang phục
  const [blendModel, setBlendModel] = useState<BlendModelId>("studio_blend");
  const [activeControlTab, setActiveControlTab] = useState<"geometry" | "lighting">("geometry");

  const [, setTailorNote] = useState<string>(
    "Tải ảnh chân dung của bạn lên để AI kiểm tra ràng buộc và ghép trang phục"
  );

  // Tinh chỉnh hình học (Vị trí cổ áo, cỡ vai, dịch ngang, góc xoay)
  const [offsetYPercent, setOffsetYPercent] = useState<number>(0);
  const [offsetXPercent, setOffsetXPercent] = useState<number>(0);
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1.0);
  const [rotationDeg, setRotationDeg] = useState<number>(0);

  // Tinh chỉnh hòa trộn & ánh sáng
  const [neckShadowIntensity, setNeckShadowIntensity] = useState<number>(55);
  const [photoBrightness, setPhotoBrightness] = useState<number>(100);
  const [photoContrast, setPhotoContrast] = useState<number>(102);
  const [garmentOpacity, setGarmentOpacity] = useState<number>(98);

  const [showHeadwear, setShowHeadwear] = useState<boolean>(false);
  const [showKeypoints, setShowKeypoints] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<"fit" | "slider" | "split">("fit");
  const [isSavedToGui, setIsSavedToGui] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const exportBodySvgRef = useRef<SVGSVGElement>(null);
  const exportHeadSvgRef = useRef<SVGSVGElement>(null);
  const isDraggingSlider = useRef(false);
  const dragGarmentStart = useRef<{
    x: number;
    y: number;
    initOffsetX: number;
    initOffsetY: number;
  } | null>(null);

  const activeColor = useMemo(
    () => mauSac.find((m) => m.id === selectedMauId) || mauSac[0],
    [selectedMauId]
  );

  const isMaleCostume = currentTrangPhuc.gioiTinh === "nam";
  const garmentLayers = useMemo(() => {
    const nv: NhanVatConfig = {
      tuoi: "nguoi_lon",
      gioi: isMaleCostume ? "nam" : "nu",
      vocDang: "trung_binh",
      tongDa: 3,
      toc: isMaleCostume ? "ngan" : "bui_cao",
      huongNhin: "truoc",
    };
    const soDo = tinhSoDo(nv);
    return renderGarmentLayers({
      trangPhucId: currentTrangPhuc.id,
      soDo,
      mauHex: activeColor.hex,
      phuKienIds: selectedPhuKienIds,
      huongNhin: "truoc",
    });
  }, [currentTrangPhuc.id, isMaleCostume, activeColor.hex, selectedPhuKienIds]);

  const totalTiltDeg = useMemo(
    () => Math.round(((calibration.tiltDeg || 0) + rotationDeg) * 10) / 10,
    [calibration.tiltDeg, rotationDeg]
  );

  const bodyOverlayStyle = useMemo(() => {
    const svgShoulderW = isMaleCostume ? 176 : 136;
    const svgWidthPercent =
      calibration.shoulderWidthRatio * scaleMultiplier * (400 / svgShoulderW) * 100;
    const svgHeightPercent = svgWidthPercent * (840 / 400) * (3 / 4);

    const targetCenterXPercent = calibration.centerX * 100 + offsetXPercent;
    const targetNeckYPercent = calibration.neckY * 100 + offsetYPercent;

    const leftPercent = targetCenterXPercent - svgWidthPercent * 0.5;
    const topPercent = targetNeckYPercent - svgHeightPercent * (148 / 840);

    return {
      width: `${svgWidthPercent}%`,
      height: `${svgHeightPercent}%`,
      left: `${leftPercent}%`,
      top: `${topPercent}%`,
      opacity: garmentOpacity / 100,
      transform: totalTiltDeg ? `rotate(${totalTiltDeg}deg)` : undefined,
      transformOrigin: "50% 17.6%",
    };
  }, [
    calibration,
    scaleMultiplier,
    offsetXPercent,
    offsetYPercent,
    isMaleCostume,
    garmentOpacity,
    totalTiltDeg,
  ]);

  const headwearOverlayStyle = useMemo(() => {
    const faceW = calibration.faceWidthRatio || calibration.shoulderWidthRatio * 0.4;
    const svgFaceW = 54;
    const svgWidthPercent = faceW * scaleMultiplier * (400 / svgFaceW) * 100;
    const svgHeightPercent = svgWidthPercent * (840 / 400) * (3 / 4);

    const targetCenterXPercent = calibration.centerX * 100 + offsetXPercent;
    const targetHeadTopPercent = calibration.headTopY * 100 + offsetYPercent * 0.5;

    const leftPercent = targetCenterXPercent - svgWidthPercent * 0.5;
    const topPercent = targetHeadTopPercent - svgHeightPercent * (76 / 840);

    return {
      width: `${svgWidthPercent}%`,
      height: `${svgHeightPercent}%`,
      left: `${leftPercent}%`,
      top: `${topPercent}%`,
      transform: totalTiltDeg ? `rotate(${totalTiltDeg}deg)` : undefined,
      transformOrigin: "50% 9%",
    };
  }, [calibration, scaleMultiplier, offsetXPercent, offsetYPercent, totalTiltDeg]);

  const resetFineTuning = () => {
    setOffsetXPercent(0);
    setOffsetYPercent(0);
    setScaleMultiplier(1.0);
    setRotationDeg(0);
    setNeckShadowIntensity(55);
    setPhotoBrightness(100);
    setPhotoContrast(102);
    setGarmentOpacity(98);
  };

  const runAiSubjectDetection = async (
    imageDataUrl: string,
    localReport: PhotoValidationReport
  ) => {
    setIsProcessing(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);
      const response = await fetch("/api/try-on/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          image: imageDataUrl,
          costumeId: currentTrangPhuc.id,
          costumeName: currentTrangPhuc.ten,
          colorName: activeColor.ten,
          fabricName: selectedFabricName,
        }),
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const resData = await response.json();
        if (resData.ok && resData.calibration) {
          const aiDetected = resData.calibration.personDetected ?? localReport.subjectOk;
          if (!aiDetected) {
            setValidationReport((prev) =>
              prev
                ? {
                    ...prev,
                    isValid: false,
                    subjectOk: false,
                    message:
                      "AI không phát hiện được người trong ảnh. Vui lòng tải lên ảnh chân dung hoặc bán thân rõ mặt.",
                  }
                : prev
            );
            setHasTriedOn(false);
            setErrorMsg(
              "Ràng buộc AI: Ảnh không có chân dung người rõ ràng. Vui lòng chọn ảnh khác."
            );
            return;
          }

          setCalibration((prev) => ({
            personDetected: true,
            neckY: resData.calibration.neckY ?? prev.neckY,
            centerX: resData.calibration.centerX ?? prev.centerX,
            shoulderWidthRatio:
              resData.calibration.shoulderWidthRatio ?? prev.shoulderWidthRatio,
            faceWidthRatio: resData.calibration.faceWidthRatio ?? prev.faceWidthRatio,
            headTopY: resData.calibration.headTopY ?? prev.headTopY,
            tiltDeg: resData.calibration.tiltDeg ?? 0,
            faceBox: resData.calibration.faceBox ?? prev.faceBox,
            shotType: resData.calibration.shotType ?? prev.shotType,
          }));
          setHasTriedOn(true);
          if (resData.tailorNote) {
            setTailorNote(resData.tailorNote);
          }
        }
      }
      playSilverBell();
    } catch {
      if (localReport.isValid) {
        setHasTriedOn(true);
        setTailorNote(`Đã định vị đối tượng · ${currentTrangPhuc.ten} (${activeColor.ten})`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const processSelectedFile = async (file: File) => {
    if (!agreedConstraint) {
      setErrorMsg(
        "Vui lòng tích xác nhận cam kết sử dụng ảnh lịch sự, tôn trọng chuẩn mực văn hóa trước khi tải ảnh."
      );
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMsg("Ràng buộc định dạng: Chỉ chấp nhận tệp ảnh JPG, PNG hoặc WEBP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ràng buộc dung lượng: Tệp ảnh tối đa 10MB.");
      return;
    }

    setErrorMsg(null);
    setIsSavedToGui(false);
    resetFineTuning();

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        try {
          const result = await validateAndScanPortrait(reader.result);
          setUserImage(result.dataUrl);
          setCalibration(result.estimated);
          setValidationReport(result.validation);

          if (!result.validation.isValid) {
            setHasTriedOn(false);
            setErrorMsg(result.validation.message);
            setTailorNote("Ảnh chưa đạt ràng buộc · Vui lòng xem chi tiết kiểm tra bên dưới");
            return;
          }

          setHasTriedOn(true);
          setViewMode("fit");
          playSilkRustleSound();
          await runAiSubjectDetection(result.dataUrl, result.validation);
        } catch {
          setErrorMsg("Không thể đọc tệp ảnh này. Vui lòng thử một bức ảnh chân dung khác.");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
    e.target.value = "";
  };

  const handleDropFile = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const handleReScanTryOn = async () => {
    if (!userImage) return;
    if (!agreedConstraint) {
      setErrorMsg("Vui lòng xác nhận ràng buộc chuẩn mực văn hóa trước khi ghép ảnh.");
      return;
    }
    setErrorMsg(null);
    resetFineTuning();
    const result = await validateAndScanPortrait(userImage);
    setUserImage(result.dataUrl);
    setCalibration(result.estimated);
    setValidationReport(result.validation);

    if (!result.validation.isValid) {
      setHasTriedOn(false);
      setErrorMsg(result.validation.message);
      return;
    }

    setHasTriedOn(true);
    await runAiSubjectDetection(result.dataUrl, result.validation);
  };

  const handleStageMouseDown = (e: React.MouseEvent) => {
    if (viewMode === "slider") {
      isDraggingSlider.current = true;
      return;
    }
    if (viewMode === "fit") {
      dragGarmentStart.current = {
        x: e.clientX,
        y: e.clientY,
        initOffsetX: offsetXPercent,
        initOffsetY: offsetYPercent,
      };
    }
  };

  const handleStageMouseMove = (e: React.MouseEvent) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();

    if (viewMode === "slider" && isDraggingSlider.current) {
      const x = e.clientX - rect.left;
      setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
      return;
    }

    if (viewMode === "fit" && dragGarmentStart.current) {
      const dxPct = ((e.clientX - dragGarmentStart.current.x) / rect.width) * 100;
      const dyPct = ((e.clientY - dragGarmentStart.current.y) / rect.height) * 100;
      setOffsetXPercent(
        Math.max(
          -25,
          Math.min(25, Math.round((dragGarmentStart.current.initOffsetX + dxPct) * 2) / 2)
        )
      );
      setOffsetYPercent(
        Math.max(
          -25,
          Math.min(25, Math.round((dragGarmentStart.current.initOffsetY + dyPct) * 2) / 2)
        )
      );
    }
  };

  const handleStageMouseUp = () => {
    isDraggingSlider.current = false;
    dragGarmentStart.current = null;
  };

  const handleStageTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    if (viewMode === "fit") {
      dragGarmentStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        initOffsetX: offsetXPercent,
        initOffsetY: offsetYPercent,
      };
    }
  };

  const handleStageTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();

    if (viewMode === "slider") {
      const x = touch.clientX - rect.left;
      setSliderPosition(Math.max(0, Math.min(100, (x / rect.width) * 100)));
      return;
    }

    if (viewMode === "fit" && dragGarmentStart.current) {
      const dxPct = ((touch.clientX - dragGarmentStart.current.x) / rect.width) * 100;
      const dyPct = ((touch.clientY - dragGarmentStart.current.y) / rect.height) * 100;
      setOffsetXPercent(
        Math.max(
          -25,
          Math.min(25, Math.round((dragGarmentStart.current.initOffsetX + dxPct) * 2) / 2)
        )
      );
      setOffsetYPercent(
        Math.max(
          -25,
          Math.min(25, Math.round((dragGarmentStart.current.initOffsetY + dyPct) * 2) / 2)
        )
      );
    }
  };

  const handleDownload = async () => {
    if (!userImage || !hasTriedOn) return;
    await exportTryOnCanvasHD({
      userImage,
      costumeId: currentTrangPhuc.id,
      isMaleCostume,
      blendModel,
      calibration,
      offsetXPercent,
      offsetYPercent,
      scaleMultiplier,
      totalTiltDeg,
      neckShadowIntensity,
      photoBrightness,
      photoContrast,
      garmentOpacity,
      showHeadwear,
      bodySvgEl: exportBodySvgRef.current,
      headSvgEl: exportHeadSvgRef.current,
    });
  };

  const handleSaveToGui = () => {
    if (!userImage || !hasTriedOn) return;
    luuVaoGuiKyUc({
      trangPhucId: currentTrangPhuc.id,
      mauId: selectedMauId,
      phuKienIds: selectedPhuKienIds,
      phongCach: "ai_virtual_try_on",
      caption: `${currentTrangPhuc.ten} — ${activeColor.ten}`,
    });
    setIsSavedToGui(true);
    playSilverBell();
  };

  if (!isOpen) return null;

  const targetNeckX = calibration.centerX * 100 + offsetXPercent;
  const targetNeckY = calibration.neckY * 100 + offsetYPercent;
  const halfShoulderPct = (calibration.shoulderWidthRatio * scaleMultiplier * 100) / 2;

  const [fYMin, fXMin, fYMax, fXMax] = calibration.faceBox;
  const faceClipCx = ((fXMin + fXMax) / 2) * 100;
  const faceClipCy = ((fYMin + fYMax) / 2) * 100 + 2;
  const faceClipRx = Math.max(11, (fXMax - fXMin) * 100 * 0.72);
  const faceClipRy = Math.max(14, (fYMax - fYMin) * 100 * 0.82);

  const renderAfterFittedPortrait = () => {
    if (!userImage) return null;

    return (
      <div className="relative w-full h-full overflow-hidden pointer-events-none select-none">
        {blendModel === "portrait_in_costume" ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-[#fdf8f0] via-[#f3e5cf] to-[#e2c9a6]" />
            <img
              src={userImage}
              alt="Chân dung tách nền lồng vào Việt phục"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: `brightness(${photoBrightness}%) contrast(${photoContrast}%)`,
                clipPath: `ellipse(${faceClipRx}% ${faceClipRy}% at ${faceClipCx}% ${faceClipCy}%)`,
              }}
            />
          </>
        ) : (
          <img
            src={userImage}
            alt="Sau khi mặc Việt Phục"
            className="w-full h-full object-cover"
            style={{
              filter: `brightness(${photoBrightness}%) contrast(${photoContrast}%)`,
            }}
          />
        )}

        {blendModel !== "keypoint_fit" && neckShadowIntensity > 0 && (
          <div
            className="absolute pointer-events-none rounded-full blur-md"
            style={{
              left: `${targetNeckX - halfShoulderPct * 0.85}%`,
              top: `${targetNeckY - 3}%`,
              width: `${halfShoulderPct * 1.7}%`,
              height: "18%",
              background: `radial-gradient(circle, rgba(28,18,10,${
                (neckShadowIntensity / 100) * 0.45
              }) 0%, rgba(28,18,10,0) 75%)`,
            }}
          />
        )}

        <svg
          ref={exportBodySvgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 840"
          className={`absolute pointer-events-none ${
            blendModel === "studio_blend"
              ? "drop-shadow-[0_10px_20px_rgba(15,23,42,0.44)]"
              : "drop-shadow-[0_6px_14px_rgba(15,23,42,0.34)]"
          }`}
          style={bodyOverlayStyle}
        >
          <defs>
            <CulturalPatternsDefs />
          </defs>
          <g>
            {garmentLayers.childrenVayQuan}
            {garmentLayers.childrenAo}
            {garmentLayers.childrenPhuKienThan}
          </g>
        </svg>

        {showHeadwear && garmentLayers.childrenTocTruocKhanNon && (
          <svg
            ref={exportHeadSvgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 840"
            className="absolute pointer-events-none drop-shadow-[0_4px_10px_rgba(15,23,42,0.3)]"
            style={headwearOverlayStyle}
          >
            <defs>
              <CulturalPatternsDefs />
            </defs>
            <g>{garmentLayers.childrenTocTruocKhanNon}</g>
          </svg>
        )}

        {showKeypoints && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div
              className="absolute border border-dashed border-emerald-400/85 rounded-lg bg-emerald-400/5"
              style={{
                top: `${calibration.faceBox[0] * 100}%`,
                left: `${calibration.faceBox[1] * 100}%`,
                height: `${(calibration.faceBox[2] - calibration.faceBox[0]) * 100}%`,
                width: `${(calibration.faceBox[3] - calibration.faceBox[1]) * 100}%`,
              }}
            >
              <span className="absolute -top-4 left-0 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-xs font-semibold whitespace-nowrap">
                Mặt AI
              </span>
            </div>

            <div
              className="absolute h-0.5 bg-amber-400/90 -translate-y-1/2"
              style={{
                top: `${targetNeckY + 3.2}%`,
                left: `${targetNeckX - halfShoulderPct}%`,
                width: `${halfShoulderPct * 2}%`,
                transform: totalTiltDeg ? `rotate(${totalTiltDeg}deg)` : undefined,
              }}
            />
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${targetNeckX}%`, top: `${targetNeckY}%` }}
              title="Điểm cổ áo"
            />
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${targetNeckX - halfShoulderPct}%`,
                top: `${targetNeckY + 3.2}%`,
              }}
            />
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${targetNeckX + halfShoulderPct}%`,
                top: `${targetNeckY + 3.2}%`,
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const innerContent = (
    <div
      className={`relative w-full ${
        embedded
          ? "bg-[var(--nen-the)] border border-[var(--vien-the)] rounded-3xl shadow-sm p-4 sm:p-5"
          : "max-w-5xl bg-white dark:bg-slate-900 border border-amber-300/40 dark:border-amber-500/30 rounded-3xl shadow-2xl p-4 sm:p-5 max-h-[92vh] flex flex-col overflow-hidden"
      } text-slate-800 dark:text-slate-100`}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {!embedded && (
        <header className="mb-3 pr-8 shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Camera className="w-4 h-4" />
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white m-0">
                Thử Đồ AI: {currentTrangPhuc.ten}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                · {activeColor.ten} · {selectedFabricName}
              </span>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </header>
      )}

      {!hasTriedOn || !userImage ? (
        <div className="max-w-md mx-auto py-4 flex flex-col items-center text-center gap-3">
          {userImage && !hasTriedOn ? (
            <div className="w-36 aspect-[3/4] rounded-2xl overflow-hidden border border-rose-400/60 shadow-sm bg-slate-950 relative">
              <img
                src={userImage}
                alt="Ảnh kiểm tra"
                className="w-full h-full object-cover opacity-85"
              />
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleDropFile}
              className={`w-full py-10 px-6 rounded-2xl border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                isDraggingFile
                  ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30"
                  : "border-amber-400/70 dark:border-slate-700 hover:border-amber-500 bg-slate-50/70 dark:bg-slate-800/40"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-slate-900 dark:text-white m-0">
                  Tải ảnh chân dung lên để mặc {currentTrangPhuc.ten}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                  Bấm chọn tệp hoặc kéo thả ảnh của bạn vào khung này
                </p>
              </div>
            </div>
          )}

          <div className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>JPG/PNG ≥240×300px</span>
            <span>·</span>
            <span>Đủ sáng</span>
            <span>·</span>
            <span>Rõ mặt & vai</span>
          </div>

          <label className="flex items-center justify-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={agreedConstraint}
              onChange={(e) => {
                setAgreedConstraint(e.target.checked);
                if (e.target.checked) setErrorMsg(null);
              }}
              className="accent-emerald-600 rounded cursor-pointer"
            />
            <span>Cam kết ảnh lịch sự, tôn trọng Việt phục</span>
          </label>

          {errorMsg && (
            <div className="w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {userImage && !hasTriedOn && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Chọn ảnh khác</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 items-start">
          {/* CỘT TRÁI / CHÍNH (7 cols): SÂN KHẤU GHÉP ẢNH */}
          <div className="lg:col-span-7 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("fit")}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition ${
                    viewMode === "fit"
                      ? "bg-emerald-600 text-white font-semibold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Khớp AI
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("slider")}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition ${
                    viewMode === "slider"
                      ? "bg-amber-600 text-white font-semibold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Kéo so sánh
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition ${
                    viewMode === "split"
                      ? "bg-amber-600 text-white font-semibold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Cạnh nhau
                </button>
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Move className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kéo trên ảnh để chỉnh vị trí</span>
              </span>
            </div>

            <div className="min-h-[340px] sm:min-h-[380px] rounded-2xl bg-slate-900 border border-slate-700/80 overflow-hidden relative flex items-center justify-center p-2.5">
              {viewMode === "fit" ? (
                <div
                  ref={stageRef}
                  className="relative aspect-[3/4] h-[330px] sm:h-[370px] rounded-xl select-none cursor-move overflow-hidden shadow-lg border border-white/15"
                  onMouseDown={handleStageMouseDown}
                  onMouseMove={handleStageMouseMove}
                  onMouseUp={handleStageMouseUp}
                  onMouseLeave={handleStageMouseUp}
                  onTouchStart={handleStageTouchStart}
                  onTouchMove={handleStageTouchMove}
                  onTouchEnd={handleStageMouseUp}
                  title="Giữ chuột hoặc chạm kéo để di chuyển trang phục"
                >
                  {renderAfterFittedPortrait()}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-30">
                      <div className="px-3 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Đang căn khớp AI...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : viewMode === "slider" ? (
                <div
                  ref={stageRef}
                  className="relative aspect-[3/4] h-[330px] sm:h-[370px] rounded-xl select-none cursor-ew-resize overflow-hidden shadow-lg border border-white/15"
                  onMouseDown={handleStageMouseDown}
                  onMouseMove={handleStageMouseMove}
                  onMouseUp={handleStageMouseUp}
                  onMouseLeave={handleStageMouseUp}
                  onTouchMove={handleStageTouchMove}
                >
                  <div className="absolute inset-0 w-full h-full">
                    {renderAfterFittedPortrait()}
                  </div>
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={userImage}
                      alt="Ảnh gốc"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{
                        width: stageRef.current
                          ? `${stageRef.current.clientWidth}px`
                          : "280px",
                      }}
                    />
                  </div>
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-500 border-2 border-white text-slate-950 flex items-center justify-center shadow font-bold text-xs">
                      ↔
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 w-full h-[330px] sm:h-[370px] gap-2">
                  <div className="relative rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                    <img
                      src={userImage}
                      alt="Ảnh gốc"
                      className="aspect-[3/4] h-full object-cover rounded-lg"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-semibold">
                      Gốc
                    </span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                    <div className="relative aspect-[3/4] h-full overflow-hidden rounded-lg">
                      {renderAfterFittedPortrait()}
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-amber-600 text-white text-xs font-semibold">
                      Đã ghép
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>Đổi ảnh khác</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserImage(null);
                    setHasTriedOn(false);
                    setValidationReport(null);
                    setErrorMsg(null);
                  }}
                  className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition cursor-pointer"
                  title="Xóa ảnh"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveToGui}
                  disabled={isSavedToGui}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  {isSavedToGui ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã lưu</span>
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5 text-amber-600" />
                      <span>Cất vào Gùi</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Ảnh HD</span>
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (5 cols): BẢNG TINH CHỈNH GỌN GÀNG */}
          <TryOnControlPanel
            blendModel={blendModel}
            onChangeBlendModel={setBlendModel}
            activeControlTab={activeControlTab}
            onChangeControlTab={setActiveControlTab}
            offsetYPercent={offsetYPercent}
            onChangeOffsetY={setOffsetYPercent}
            offsetXPercent={offsetXPercent}
            onChangeOffsetX={setOffsetXPercent}
            scaleMultiplier={scaleMultiplier}
            onChangeScale={setScaleMultiplier}
            rotationDeg={rotationDeg}
            onChangeRotation={setRotationDeg}
            neckShadowIntensity={neckShadowIntensity}
            onChangeNeckShadow={setNeckShadowIntensity}
            photoBrightness={photoBrightness}
            onChangeBrightness={setPhotoBrightness}
            photoContrast={photoContrast}
            onChangeContrast={setPhotoContrast}
            garmentOpacity={garmentOpacity}
            onChangeGarmentOpacity={setGarmentOpacity}
            showKeypoints={showKeypoints}
            onToggleKeypoints={() => setShowKeypoints((p) => !p)}
            showHeadwear={showHeadwear}
            onToggleHeadwear={() => setShowHeadwear((p) => !p)}
            onResetFineTuning={resetFineTuning}
            onReScanTryOn={handleReScanTryOn}
            isProcessing={isProcessing}
            errorMsg={errorMsg}
          />
        </div>
      )}
    </div>
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <div
      className="vpr-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {innerContent}
    </div>
  );
}
