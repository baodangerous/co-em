/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { playSilverBell } from "../../lib/audio";
import { BlendModelId, CalibrationData } from "./portraitScanner";

export interface ExportTryOnCanvasOptions {
  userImage: string;
  costumeId: string;
  isMaleCostume: boolean;
  blendModel: BlendModelId;
  calibration: CalibrationData;
  offsetXPercent: number;
  offsetYPercent: number;
  scaleMultiplier: number;
  totalTiltDeg: number;
  neckShadowIntensity: number;
  photoBrightness: number;
  photoContrast: number;
  garmentOpacity: number;
  showHeadwear: boolean;
  bodySvgEl: SVGSVGElement | null;
  headSvgEl: SVGSVGElement | null;
}

export async function exportTryOnCanvasHD(options: ExportTryOnCanvasOptions): Promise<void> {
  const {
    userImage,
    costumeId,
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
    bodySvgEl,
    headSvgEl,
  } = options;

  try {
    const canvas = document.createElement("canvas");
    const cw = 720;
    const ch = 960;
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const photoImg = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = userImage;
    });

    ctx.save();
    ctx.filter = `brightness(${photoBrightness}%) contrast(${photoContrast}%)`;

    if (blendModel === "portrait_in_costume") {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, ch);
      bgGrad.addColorStop(0, "#fdf8f0");
      bgGrad.addColorStop(0.55, "#f3e5cf");
      bgGrad.addColorStop(1, "#e2c9a6");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cw, ch);

      const [fYMin, fXMin, fYMax, fXMax] = calibration.faceBox;
      const fCx = ((fXMin + fXMax) / 2) * cw;
      const fCy = ((fYMin + fYMax) / 2) * ch;
      const rx = Math.max(65, (fXMax - fXMin) * cw * 0.68);
      const ry = Math.max(85, (fYMax - fYMin) * ch * 0.78);

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(fCx, fCy + ry * 0.08, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(photoImg, 0, 0, cw, ch);
      ctx.restore();
    } else {
      ctx.drawImage(photoImg, 0, 0, cw, ch);
    }
    ctx.restore();

    if (blendModel !== "keypoint_fit" && neckShadowIntensity > 0) {
      const neckPxX = cw * (calibration.centerX + offsetXPercent / 100);
      const neckPxY = ch * (calibration.neckY + offsetYPercent / 100);
      const shadowRad = cw * calibration.shoulderWidthRatio * scaleMultiplier * 0.45;
      const shGrad = ctx.createRadialGradient(
        neckPxX,
        neckPxY + 12,
        8,
        neckPxX,
        neckPxY + 24,
        shadowRad
      );
      shGrad.addColorStop(0, `rgba(28, 18, 10, ${(neckShadowIntensity / 100) * 0.42})`);
      shGrad.addColorStop(1, "rgba(28, 18, 10, 0)");
      ctx.fillStyle = shGrad;
      ctx.fillRect(0, 0, cw, ch);
    }

    const drawSvgLayer = async (
      svgEl: SVGSVGElement | null,
      baseUnitsW: number,
      targetRatioW: number,
      anchorSvgY: number,
      targetNormY: number
    ) => {
      if (!svgEl) return;
      const xml = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const svgImg = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = url;
      });

      const S = (cw * targetRatioW * scaleMultiplier) / baseUnitsW;
      const drawW = 400 * S;
      const drawH = 840 * S;
      const pivotX = cw * (calibration.centerX + offsetXPercent / 100);
      const pivotY = ch * targetNormY;
      const drawX = pivotX - 200 * S;
      const drawY = pivotY - anchorSvgY * S;

      ctx.save();
      ctx.globalAlpha = garmentOpacity / 100;
      if (totalTiltDeg) {
        ctx.translate(pivotX, pivotY);
        ctx.rotate((totalTiltDeg * Math.PI) / 180);
        ctx.translate(-pivotX, -pivotY);
      }
      ctx.drawImage(svgImg, drawX, drawY, drawW, drawH);
      ctx.restore();
      URL.revokeObjectURL(url);
    };

    const svgShoulderW = isMaleCostume ? 176 : 136;
    await drawSvgLayer(
      bodySvgEl,
      svgShoulderW,
      calibration.shoulderWidthRatio,
      148,
      calibration.neckY + offsetYPercent / 100
    );

    if (showHeadwear && headSvgEl) {
      const faceW = calibration.faceWidthRatio || calibration.shoulderWidthRatio * 0.4;
      await drawSvgLayer(
        headSvgEl,
        54,
        faceW,
        76,
        calibration.headTopY + (offsetYPercent * 0.5) / 100
      );
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 0.94);
    link.download = `viet-phuc-${costumeId}-${Date.now()}.jpg`;
    link.click();
    playSilverBell();
  } catch {
    // ignore
  }
}
