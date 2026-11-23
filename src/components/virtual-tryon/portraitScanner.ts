/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Portrait Scanner & Validation Engine (portraitScanner.ts)
 * Tách riêng bộ máy kiểm tra ràng buộc ảnh tải lên, chuẩn hóa khung 3:4
 * và định vị khuôn mặt/vai khỏi VirtualTryOnModal để dễ bảo trì và tái sử dụng.
 */

export interface CalibrationData {
  personDetected: boolean;
  neckY: number;
  centerX: number;
  shoulderWidthRatio: number;
  faceWidthRatio: number;
  headTopY: number;
  tiltDeg: number;
  faceBox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0..1
  shotType: "closeup" | "half_body" | "full_body";
}

export interface PhotoValidationReport {
  isValid: boolean;
  formatOk: boolean;
  resolutionOk: boolean;
  lightingOk: boolean;
  subjectOk: boolean;
  width: number;
  height: number;
  avgLuma: number;
  skinRatio: number;
  message: string;
}

export type BlendModelId =
  | "keypoint_fit"
  | "studio_blend"
  | "portrait_in_costume";

export interface BlendModelOption {
  id: BlendModelId;
  shortName: string;
  desc: string;
}

export const BLEND_MODELS: BlendModelOption[] = [
  {
    id: "keypoint_fit",
    shortName: "Khớp dáng",
    desc: "Phủ trang phục khớp theo cổ và vai trên nền ảnh gốc.",
  },
  {
    id: "studio_blend",
    shortName: "Hòa sáng",
    desc: "Tạo bóng đổ vùng cổ và cân bằng ánh sáng với chất vải.",
  },
  {
    id: "portrait_in_costume",
    shortName: "Lồng mặt",
    desc: "Tách khuôn mặt lồng vào cổ áo Việt phục trên nền lụa.",
  },
];

export const DEFAULT_CALIBRATION: CalibrationData = {
  personDetected: true,
  neckY: 0.355,
  centerX: 0.5,
  shoulderWidthRatio: 0.46,
  faceWidthRatio: 0.18,
  headTopY: 0.1,
  tiltDeg: 0,
  faceBox: [0.14, 0.41, 0.32, 0.59],
  shotType: "half_body",
};

/**
 * Kiểm tra ràng buộc ảnh tải lên + chuẩn hóa khung 3:4 (720x960)
 * và định vị đối tượng bằng FaceDetector API + thuật toán phân vùng da YCbCr
 */
export async function validateAndScanPortrait(
  src: string
): Promise<{
  dataUrl: string;
  estimated: CalibrationData;
  validation: PhotoValidationReport;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      const srcW = img.naturalWidth || img.width || 0;
      const srcH = img.naturalHeight || img.height || 0;
      const srcAspect = srcW / Math.max(1, srcH);

      // Ràng buộc 1: Độ phân giải tối thiểu & tỷ lệ khung hình hợp lý
      const resolutionOk =
        srcW >= 240 && srcH >= 300 && srcAspect >= 0.32 && srcAspect <= 1.85;

      const targetW = 720;
      const targetH = 960;
      const targetAspect = targetW / targetH; // 0.75

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Không thể khởi tạo bộ xử lý ảnh."));
        return;
      }

      // Cắt khung 3:4 ưu tiên giữ trọn phần đầu và thân trên
      let sx = 0;
      let sy = 0;
      let sw = srcW;
      let sh = srcH;

      if (srcAspect > targetAspect) {
        sw = srcH * targetAspect;
        sx = (srcW - sw) * 0.5;
      } else if (srcAspect < targetAspect) {
        sh = srcW / targetAspect;
        sy = (srcH - sh) * 0.2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);

      // Phân tích ánh sáng, độ tương phản và mật độ sắc da YCbCr trên lưới 120x160
      const gw = 120;
      const gh = 160;
      const off = document.createElement("canvas");
      off.width = gw;
      off.height = gh;
      const octx = off.getContext("2d");

      let avgLuma = 128;
      let skinPixels = 0;
      let upperContrast = 0;
      let estimated: CalibrationData = {
        ...DEFAULT_CALIBRATION,
        personDetected: false,
      };

      if (octx) {
        octx.drawImage(canvas, 0, 0, gw, gh);
        const pixels = octx.getImageData(0, 0, gw, gh).data;
        const rowCounts = new Float32Array(gh);
        const rowSumX = new Float32Array(gh);
        const rowMinX = new Float32Array(gh).fill(gw);
        const rowMaxX = new Float32Array(gh).fill(0);

        let totalLuma = 0;
        const totalPixels = gw * gh;

        for (let y = 0; y < gh; y++) {
          let rMin = gw;
          let rMax = 0;
          for (let x = 0; x < gw; x++) {
            const i = (y * gw + x) * 4;
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            const yLuma = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuma += yLuma;

            if (
              y >= Math.floor(gh * 0.04) &&
              y < Math.floor(gh * 0.68) &&
              x >= Math.floor(gw * 0.1) &&
              x < Math.floor(gw * 0.9)
            ) {
              const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
              const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

              if (
                yLuma > 38 &&
                yLuma < 245 &&
                cb >= 74 &&
                cb <= 132 &&
                cr >= 130 &&
                cr <= 178 &&
                r >= g * 0.95 &&
                r >= b
              ) {
                skinPixels++;
                const centerWeight = 1 - Math.abs(x / gw - 0.5) * 0.65;
                rowCounts[y] += centerWeight;
                rowSumX[y] += x * centerWeight;
                if (x < rMin) rMin = x;
                if (x > rMax) rMax = x;
              }

              if (x > Math.floor(gw * 0.2) && x < Math.floor(gw * 0.8)) {
                const prevI = (y * gw + (x - 1)) * 4;
                const prevLuma =
                  0.299 * pixels[prevI] +
                  0.587 * pixels[prevI + 1] +
                  0.114 * pixels[prevI + 2];
                upperContrast += Math.abs(yLuma - prevLuma);
              }
            }
          }
          rowMinX[y] = rMin;
          rowMaxX[y] = rMax;
        }

        avgLuma = Math.round(totalLuma / totalPixels);

        let peakY = Math.floor(gh * 0.22);
        let maxScore = 0;
        for (let y = Math.floor(gh * 0.06); y < Math.floor(gh * 0.56); y++) {
          const windowScore =
            (rowCounts[y - 2] || 0) +
            (rowCounts[y - 1] || 0) +
            rowCounts[y] * 1.5 +
            (rowCounts[y + 1] || 0) +
            (rowCounts[y + 2] || 0);
          if (windowScore > maxScore) {
            maxScore = windowScore;
            peakY = y;
          }
        }

        if (maxScore > 9) {
          const threshold = Math.max(1.8, rowCounts[peakY] * 0.26);
          let topY = peakY;
          while (
            topY > Math.floor(gh * 0.04) &&
            rowCounts[topY - 1] >= threshold
          ) {
            topY--;
          }
          let botY = peakY;
          while (
            botY <
              Math.min(Math.floor(gh * 0.62), topY + Math.floor(gh * 0.34)) &&
            rowCounts[botY + 1] >= threshold
          ) {
            botY++;
          }

          let sumX = 0;
          let sumW = 0;
          let faceSpanSum = 0;
          let spanRows = 0;
          for (let y = topY; y <= botY; y++) {
            if (rowCounts[y] > 0) {
              sumX += rowSumX[y];
              sumW += rowCounts[y];
            }
            if (rowMaxX[y] > rowMinX[y]) {
              faceSpanSum += (rowMaxX[y] - rowMinX[y]) / gw;
              spanRows++;
            }
          }

          const centerX =
            sumW > 0
              ? Math.max(0.22, Math.min(0.78, sumX / sumW / gw))
              : 0.5;
          const fYMin = Math.max(0.03, topY / gh);
          const fYMax = Math.max(fYMin + 0.12, Math.min(0.62, botY / gh));
          const faceH = fYMax - fYMin;
          const rawFaceW =
            spanRows > 0 ? faceSpanSum / spanRows : faceH * 0.75;
          const faceW = Math.max(
            0.11,
            Math.min(0.36, rawFaceW * 0.7 + faceH * 0.72 * 0.3)
          );

          const neckY = Math.max(0.2, Math.min(0.72, fYMax + faceH * 0.14));
          const shoulderWidthRatio = Math.max(0.3, Math.min(0.8, faceW * 2.45));
          const headTopY = Math.max(0.01, fYMin - faceH * 0.22);

          estimated = {
            personDetected: true,
            neckY,
            centerX,
            shoulderWidthRatio,
            faceWidthRatio: faceW,
            headTopY,
            tiltDeg: 0,
            faceBox: [
              fYMin,
              Math.max(0.05, centerX - faceW / 2),
              fYMax,
              Math.min(0.95, centerX + faceW / 2),
            ],
            shotType:
              faceH > 0.26
                ? "closeup"
                : faceH < 0.14
                ? "full_body"
                : "half_body",
          };
        }
      }

      try {
        const FaceDetectorCtor = (
          window as unknown as {
            FaceDetector?: new (opts: object) => {
              detect: (
                c: HTMLCanvasElement
              ) => Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
            };
          }
        ).FaceDetector;
        if (typeof FaceDetectorCtor === "function") {
          const detector = new FaceDetectorCtor({
            fastMode: true,
            maxDetectedFaces: 1,
          });
          const faces = await detector.detect(canvas);
          if (faces && faces.length > 0 && faces[0].boundingBox) {
            const box = faces[0].boundingBox;
            const fXMin = Math.max(0.05, box.x / targetW);
            const fYMin = Math.max(0.02, box.y / targetH);
            const fW = Math.max(0.1, box.width / targetW);
            const fH = Math.max(0.1, box.height / targetH);
            const fXMax = Math.min(0.95, fXMin + fW);
            const fYMax = Math.min(0.85, fYMin + fH);
            const centerX = (fXMin + fXMax) / 2;
            const neckY = Math.min(0.76, fYMax + fH * 0.16);
            const shoulderWidthRatio = Math.max(
              0.28,
              Math.min(0.82, fW * 2.45)
            );
            const headTopY = Math.max(0.01, fYMin - fH * 0.22);

            estimated = {
              personDetected: true,
              neckY,
              centerX,
              shoulderWidthRatio,
              faceWidthRatio: fW,
              headTopY,
              tiltDeg: 0,
              faceBox: [fYMin, fXMin, fYMax, fXMax],
              shotType:
                fH > 0.26
                  ? "closeup"
                  : fH < 0.14
                  ? "full_body"
                  : "half_body",
            };
          }
        }
      } catch {
        // Bỏ qua nếu trình duyệt không hỗ trợ FaceDetector
      }

      const skinRatio = skinPixels / (gw * gh);
      const lightingOk = avgLuma >= 30 && avgLuma <= 242;
      const subjectOk =
        estimated.personDetected ||
        (skinRatio >= 0.015 && upperContrast > 8000);
      if (subjectOk && !estimated.personDetected) {
        estimated.personDetected = true;
      }

      const isValid = resolutionOk && lightingOk && subjectOk;
      let message =
        "Ảnh hợp lệ · Đã định vị khuôn mặt và bờ vai để ghép Việt phục.";
      if (!resolutionOk) {
        message = `Ảnh quá nhỏ hoặc lệch tỷ lệ (${srcW}×${srcH}px). Cần ảnh dọc tối thiểu 240×300px.`;
      } else if (!lightingOk) {
        message =
          avgLuma < 30
            ? "Ảnh quá tối, không rõ đường nét cổ và vai. Vui lòng chọn ảnh đủ sáng."
            : "Ảnh bị cháy sáng. Vui lòng chọn ảnh có ánh sáng cân đối hơn.";
      } else if (!subjectOk) {
        message =
          "Không nhận diện được chân dung người rõ ràng trong ảnh. Vui lòng tải ảnh chụp chính diện hoặc bán thân.";
      }

      resolve({
        dataUrl: canvas.toDataURL("image/jpeg", 0.92),
        estimated,
        validation: {
          isValid,
          formatOk: true,
          resolutionOk,
          lightingOk,
          subjectOk,
          width: srcW,
          height: srcH,
          avgLuma,
          skinRatio,
          message,
        },
      });
    };
    img.onerror = () => reject(new Error("Không thể đọc tệp ảnh."));
    img.src = src;
  });
}
