/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MODULE ĐỊNH TUYẾN PROXY AI TRÊN MÁY CHỦ (AI PROXY ROUTES)
 * - Bảo vệ tuyệt đối API Key trên máy chủ, không bao giờ gửi khóa xuống trình duyệt
 * - Tích hợp kiểm tra Schema, khử độc đầu vào (Input Sanitization) và ẩn thông tin nhạy cảm
 */

import { Router, type Request, type Response } from "express";
import { GoogleGenAI } from "@google/genai";
import db from "../db.ts";
import {
  sanitizeString,
  sanitizeErrorMessage,
  redactSecrets,
  validateSchema,
  rateLimiterMiddleware,
} from "../security.ts";

export const aiRouter = Router();

const getApiKey = (): string => {
  return process.env.API_KEY || process.env.GEMINI_API_KEY || "";
};

function withTimeout<T>(promise: Promise<T>, timeoutMs = 14000): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("AI request timeout")), timeoutMs);
    }),
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function hashPrompt(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// 1. AI Virtual Try-On Spatial Keypoints Calibration
aiRouter.post("/try-on/transfer", rateLimiterMiddleware(30, 60_000, "ai-tryon"), async (req: Request, res: Response) => {
  const apiKey = getApiKey();
  const { image, costumeName, colorName, fabricName, preferAiImage = false } = req.body || {};

  if (!image || typeof image !== "string") {
    res.status(400).json({ ok: false, error: "Vui lòng cung cấp ảnh chân dung hoặc bán thân." });
    return;
  }
  if (image.length > 11_000_000) {
    res.status(413).json({ ok: false, error: "Ảnh vượt quá dung lượng tối đa 8MB." });
    return;
  }

  const defaultCalibration = {
    personDetected: true,
    neckY: 0.35,
    centerX: 0.5,
    shoulderWidthRatio: 0.48,
    faceWidthRatio: 0.19,
    headTopY: 0.1,
    tiltDeg: 0,
    faceBox: [0.12, 0.4, 0.32, 0.6] as [number, number, number, number],
    shotType: "half_body" as "closeup" | "half_body" | "full_body",
  };

  try {
    let mimeType = "image/jpeg";
    let base64Data = image;
    const matches = image.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      base64Data = matches[2];
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
      mimeType = "image/jpeg";
    }

    const imageFingerprint = base64Data.slice(0, 320) + base64Data.length;
    const calCacheKey = `tryon-cal:${hashPrompt(imageFingerprint)}`;
    const cachedCal = db.getAiCache(calCacheKey) as typeof defaultCalibration | null;

    if (cachedCal && !preferAiImage) {
      res.json({
        ok: true,
        mode: "smart_composite",
        calibration: cachedCal,
        tailorNote: `Đã bắt đối tượng AI · ${sanitizeString(costumeName) || "Việt Phục"} (${sanitizeString(colorName) || "Truyền thống"})`,
        tuCache: true,
      });
      return;
    }

    if (!apiKey) {
      res.json({
        ok: true,
        mode: "smart_composite",
        calibration: defaultCalibration,
        tailorNote: `Đã căn chỉnh ${sanitizeString(costumeName) || "Việt Phục"} (${sanitizeString(colorName) || "Truyền thống"})`,
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });

    const visionModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
    let calibration = { ...defaultCalibration };
    const tailorNote = `Đã bắt đối tượng AI · ${sanitizeString(costumeName) || "Việt Phục"} (${sanitizeString(colorName) || "Truyền thống"})`;

    const visionPrompt = `Detect the primary human subject in this 3:4 portrait image for virtual garment fitting.
Use a normalized 0 to 1000 coordinate scale where (0,0) is top-left and (1000,1000) is bottom-right.
Return ONLY valid JSON:
{
  "personDetected": true,
  "faceBox": [ymin, xmin, ymax, xmax],
  "neckCollar": [y, x],
  "leftShoulder": [y, x],
  "rightShoulder": [y, x],
  "headTopY": number,
  "shotType": "closeup" | "half_body" | "full_body"
}`;

    for (const vModel of visionModels) {
      try {
        const vRes: any = await withTimeout(
          ai.models.generateContent({
            model: vModel,
            contents: {
              parts: [{ inlineData: { data: base64Data, mimeType } }, { text: visionPrompt }],
            },
            config: { responseMimeType: "application/json", temperature: 0.05 },
          }),
          12000
        );

        let rawJson = (vRes?.text || "").trim();
        if (rawJson.startsWith("```")) {
          rawJson = rawJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
        }
        if (!rawJson) continue;

        const parsed = JSON.parse(rawJson);
        const scale = (val: number) => (val > 1.5 ? val / 1000 : val);
        let [faceYMin, faceXMin, faceYMax, faceXMax] = [0.12, 0.38, 0.32, 0.62];

        if (Array.isArray(parsed.faceBox) && parsed.faceBox.length === 4) {
          faceYMin = Math.max(0.01, Math.min(0.75, scale(Number(parsed.faceBox[0]))));
          faceXMin = Math.max(0.05, Math.min(0.85, scale(Number(parsed.faceBox[1]))));
          faceYMax = Math.max(faceYMin + 0.06, Math.min(0.88, scale(Number(parsed.faceBox[2]))));
          faceXMax = Math.max(faceXMin + 0.06, Math.min(0.95, scale(Number(parsed.faceBox[3]))));
        }

        const faceH = Math.max(0.08, faceYMax - faceYMin);
        const faceW = Math.max(0.08, faceXMax - faceXMin);
        const faceCenterX = (faceXMin + faceXMax) / 2;
        let neckY = faceYMax + faceH * 0.16;
        let centerX = faceCenterX;

        if (Array.isArray(parsed.neckCollar) && parsed.neckCollar.length === 2) {
          const rawNeckY = scale(Number(parsed.neckCollar[0]));
          const rawNeckX = scale(Number(parsed.neckCollar[1]));
          if (!Number.isNaN(rawNeckY)) {
            neckY = Math.max(faceYMax - faceH * 0.02, Math.min(faceYMax + faceH * 0.42, rawNeckY));
          }
          if (!Number.isNaN(rawNeckX)) {
            centerX = rawNeckX * 0.65 + faceCenterX * 0.35;
          }
        }

        let shoulderWidthRatio = faceW * 2.45;
        let tiltDeg = 0;

        if (
          Array.isArray(parsed.leftShoulder) &&
          parsed.leftShoulder.length === 2 &&
          Array.isArray(parsed.rightShoulder) &&
          parsed.rightShoulder.length === 2
        ) {
          const ly = scale(Number(parsed.leftShoulder[0]));
          const lx = scale(Number(parsed.leftShoulder[1]));
          const ry = scale(Number(parsed.rightShoulder[0]));
          const rx = scale(Number(parsed.rightShoulder[1]));
          const distX = Math.abs(rx - lx);

          if (distX >= 0.16 && distX <= 0.92) {
            shoulderWidthRatio = Math.max(
              faceW * 1.95,
              Math.min(faceW * 3.1, distX * 0.75 + faceW * 2.45 * 0.25)
            );
            centerX = centerX * 0.6 + ((lx + rx) / 2) * 0.4;
            const rawTilt = (Math.atan2(ry - ly, Math.max(0.1, rx - lx)) * 180) / Math.PI;
            tiltDeg = Math.max(-12, Math.min(12, Math.round(rawTilt * 10) / 10));
          }
        }

        const headTopY =
          typeof parsed.headTopY === "number"
            ? Math.max(0.01, Math.min(faceYMin + 0.02, scale(parsed.headTopY)))
            : Math.max(0.01, faceYMin - faceH * 0.22);

        calibration = {
          personDetected: parsed.personDetected !== false,
          neckY: Math.max(0.14, Math.min(0.76, neckY)),
          centerX: Math.max(0.18, Math.min(0.82, centerX)),
          shoulderWidthRatio: Math.max(0.24, Math.min(0.86, shoulderWidthRatio)),
          faceWidthRatio: Math.max(0.1, Math.min(0.45, faceW)),
          headTopY,
          tiltDeg,
          faceBox: [faceYMin, faceXMin, faceYMax, faceXMax],
          shotType:
            parsed.shotType === "closeup" ||
            parsed.shotType === "half_body" ||
            parsed.shotType === "full_body"
              ? parsed.shotType
              : faceH > 0.26
              ? "closeup"
              : faceH < 0.14
              ? "full_body"
              : "half_body",
        };

        db.setAiCache(calCacheKey, calibration);
        break;
      } catch {
        // Try next vision model
      }
    }

    res.json({
      ok: true,
      mode: "smart_composite",
      calibration,
      tailorNote,
      fabricName: sanitizeString(fabricName) || "Lụa truyền thống",
    });
  } catch (err) {
    console.error("Fallback AI Virtual Try-On:", sanitizeErrorMessage(err));
    res.json({
      ok: true,
      mode: "smart_composite",
      calibration: defaultCalibration,
      tailorNote: `Đã căn chỉnh ${sanitizeString(costumeName) || "Việt Phục"}`,
    });
  }
});

// 2. Proxy gọi Gemini AI xử lý ngôn ngữ văn hóa
aiRouter.post("/gemini", rateLimiterMiddleware(30, 60_000, "ai-gemini"), async (req: Request, res: Response) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    res.status(503).json({
      ok: false,
      error: "Dịch vụ AI chưa được cấu hình khóa trên máy chủ.",
    });
    return;
  }

  const { vaiTro, context, quyTac, viDu, cauHoi, schema, nhietDo = 0.3 } = req.body || {};
  if (!cauHoi && !context) {
    res.status(400).json({ ok: false, error: "Thiếu nội dung câu hỏi hoặc ngữ cảnh" });
    return;
  }

  try {
    const systemParts: string[] = [];
    if (vaiTro && typeof vaiTro === "string" && vaiTro.trim()) {
      systemParts.push(sanitizeString(vaiTro));
    }
    if (quyTac) {
      const quyTacStr = Array.isArray(quyTac)
        ? quyTac.map((r) => `- ${sanitizeString(r)}`).join("\n")
        : typeof quyTac === "string"
        ? sanitizeString(quyTac)
        : "";
      if (quyTacStr) systemParts.push(`QUY TẮC:\n${quyTacStr}`);
    }

    const parts: string[] = [];
    if (context && typeof context === "string" && context.trim()) {
      parts.push(`=== CONTEXT ===\n${sanitizeString(context)}`);
    }
    if (viDu) {
      const viDuStr =
        typeof viDu === "string" ? sanitizeString(viDu) : JSON.stringify(viDu, null, 2);
      if (viDuStr) parts.push(`=== VÍ DỤ ===\n${viDuStr}`);
    }
    if (cauHoi && typeof cauHoi === "string" && cauHoi.trim()) {
      parts.push(`=== CÂU HỎI ===\n${sanitizeString(cauHoi)}`);
    }
    if (schema) {
      parts.push(
        `=== ĐỊNH DẠNG ĐẦU RA ===\nTrả về DUY NHẤT một chuỗi JSON hợp lệ tuân thủ chính xác theo schema sau:\n${JSON.stringify(
          schema,
          null,
          2
        )}`
      );
    }

    const assembledPrompt = `${systemParts.join("\n\n")}\n---\n${parts.join("\n\n")}`;
    const cacheKey = `prompt:${hashPrompt(assembledPrompt)}`;
    const cachedResponse = db.getAiCache(cacheKey);
    if (cachedResponse !== null) {
      res.json({ ok: true, data: cachedResponse, tuCache: true });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });

    const config: Record<string, unknown> = {
      ...(schema ? { responseMimeType: "application/json" } : {}),
      ...(systemParts.length > 0 ? { systemInstruction: systemParts.join("\n\n") } : {}),
      temperature: typeof nhietDo === "number" ? Math.max(0, Math.min(1, nhietDo)) : 0.3,
      maxOutputTokens: schema ? 1000 : 350,
    };

    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let lastErr: unknown;
    let response: any = null;

    for (const model of modelsToTry) {
      try {
        response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: parts.join("\n\n"),
            config,
          }),
          14000
        );
        if (response && response.text) break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!response) {
      throw lastErr || new Error("Không thể kết nối với dịch vụ xử lý ngôn ngữ.");
    }

    const rawText = response.text || "";
    let parsedData: unknown = rawText.trim();

    if (schema) {
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      }
      parsedData = JSON.parse(cleanJson);
      if (!validateSchema(parsedData, schema)) {
        res.status(422).json({ ok: false, error: "Dữ liệu trả về không khớp với schema yêu cầu." });
        return;
      }
    }

    if (typeof parsedData === "string") {
      parsedData = redactSecrets(parsedData);
    }

    db.setAiCache(cacheKey, parsedData);
    res.json({ ok: true, data: parsedData, tuCache: false });
  } catch (err) {
    const safeError = sanitizeErrorMessage(err);
    res.status(500).json({ ok: false, error: safeError });
  }
});

// 3. Google Maps Grounding cho địa điểm di sản
aiRouter.post("/maps/heritage-places", rateLimiterMiddleware(15, 60_000, "ai-maps"), async (req: Request, res: Response) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    res.status(503).json({ ok: false, error: "Dịch vụ AI chưa được cấu hình khóa trên máy chủ." });
    return;
  }

  const { query: userQuery, region = "vietnam" } = req.body || {};
  const queryText = userQuery
    ? sanitizeString(userQuery)
    : "Tìm các di tích lịch sử, bảo tàng cổ phục và làng nghề dệt lụa truyền thống nổi tiếng tại Việt Nam";

  const cacheKey = `maps:${hashPrompt(queryText + region)}`;
  const cached = db.getAiCache(cacheKey);
  if (cached) {
    res.json({ ok: true, data: cached, tuCache: true });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Bạn là trợ lý văn hóa di sản Việt Phục. Hãy sử dụng công cụ Google Maps để tìm kiếm thông tin địa điểm thực tế, địa chỉ chính xác và nét đặc sắc văn hóa trang phục truyền thống của: ${queryText}. Giới thiệu ngắn gọn, súc tích và chính xác.`,
        config: { tools: [{ googleMaps: {} }] },
      }),
      14000
    );

    const text = response.text || "";
    const groundingMetadata = (response.candidates?.[0] as any)?.groundingMetadata || null;
    const resultData = {
      text: redactSecrets(text),
      groundingMetadata,
      places:
        groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web || chunk.maps || chunk) ||
        [],
    };

    db.setAiCache(cacheKey, resultData);
    res.json({ ok: true, data: resultData, tuCache: false });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 4. Lyria Music Generation
aiRouter.post("/music/generate", rateLimiterMiddleware(15, 60_000, "ai-music"), async (req: Request, res: Response) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    res.status(503).json({ ok: false, error: "Dịch vụ AI chưa được cấu hình khóa trên máy chủ." });
    return;
  }

  const { prompt: userPrompt, modelType = "clip" } = req.body || {};
  const model = modelType === "pro" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";
  const musicPrompt = userPrompt
    ? sanitizeString(userPrompt)
    : "A serene, ambient traditional Vietnamese heritage melody featuring Dan Tranh zither, Dan Bau monochord, and gentle bamboo flute Sau Truc, reminiscent of ancient Hue imperial court music, calm and reflective.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: musicPrompt,
    });

    let audioBase64 = "";
    let lyrics = "";
    let mimeType = "audio/wav";

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    res.json({
      ok: true,
      audioBase64: audioBase64 || null,
      mimeType,
      lyrics: lyrics || "Giai điệu di sản cổ phong Việt Nam",
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});
