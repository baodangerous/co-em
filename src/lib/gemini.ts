/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { trangPhuc } from "../data/trangphuc";
import { phuKien } from "../data/phukien";
import { vai } from "../data/vai";
import { mocThoiGian } from "../data/mocthoigian";
import { coem, domdom } from "../copy/coem";

export interface CallGeminiParams {
  vaiTro?: string;
  context?: string;
  quyTac?: string | string[];
  viDu?: string | unknown;
  cauHoi: string;
  schema?: Record<string, unknown>;
  nhietDo?: number;
  callerKey?: string; // Khóa định danh luồng gọi: "mot_trang_doi", "vi_sao", "dom_dom_chat", v.v.
  signal?: AbortSignal;
}

export interface CallGeminiResult {
  ok: boolean;
  data: unknown;
  tuCache: boolean;
  biHuy?: boolean; // True nếu thao tác bị người dùng chuyển lựa chọn mới làm hủy lệnh
}

// Bộ nhớ đệm in-memory
const memoryCache = new Map<string, unknown>();

// Quản lý các lệnh gọi đang xử lý theo callerKey để tự động hủy lệnh cũ khi người dùng đổi lựa chọn
const activeControllers = new Map<string, AbortController>();

// Hàm băm chuỗi để tạo khóa cache
function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Kiểm tra JSON theo schema đơn giản nhưng chặt chẽ
function validateSchema(data: unknown, schema: Record<string, unknown>): boolean {
  if (!schema) return true;

  const expectedType = schema.type as string | undefined;

  if (expectedType === "object") {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return false;
    }
    const obj = data as Record<string, unknown>;

    // Kiểm tra các trường bắt buộc (required)
    if (Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (typeof field === "string" && (obj[field] === undefined || obj[field] === null)) {
          return false;
        }
      }
    }

    // Kiểm tra kiểu các thuộc tính (properties)
    if (schema.properties && typeof schema.properties === "object") {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, propSchema] of Object.entries(props)) {
        if (obj[key] !== undefined && obj[key] !== null) {
          if (!validateSchema(obj[key], propSchema)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  if (expectedType === "array") {
    if (!Array.isArray(data)) return false;
    if (schema.items && typeof schema.items === "object") {
      const itemSchema = schema.items as Record<string, unknown>;
      for (const item of data) {
        if (!validateSchema(item, itemSchema)) {
          return false;
        }
      }
    }
    return true;
  }

  if (expectedType === "string") return typeof data === "string";
  if (expectedType === "number" || expectedType === "integer") return typeof data === "number";
  if (expectedType === "boolean") return typeof data === "boolean";

  return true;
}

/**
 * Hàm duy nhất gọi Gemini theo cơ chế mặc định AI Studio Build:
 * - Ghép prompt: VAI TRÒ → CONTEXT → QUY TẮC → VÍ DỤ → CÂU HỎI → ĐỊNH DẠNG ĐẦU RA (JSON)
 * - Timeout: 12 giây
 * - Kiểm tra JSON theo schema, sai schema coi như lỗi
 * - Cache theo hash của prompt (in-memory + localStorage, khóa "vpr:gem:")
 * - Khi lỗi trả ok=false để nơi gọi dùng fallbackText có sẵn trong dữ liệu
 * - Không gọi trong lúc render, chỉ gọi khi thao tác
 */
export async function callGemini({
  vaiTro,
  context,
  quyTac,
  viDu,
  cauHoi,
  schema,
  nhietDo = 0.3,
  callerKey,
  signal,
}: CallGeminiParams): Promise<CallGeminiResult> {
  // Quản lý AbortController để hủy lệnh cũ nếu có lệnh mới từ cùng callerKey
  let localController: AbortController | undefined;
  if (callerKey) {
    const prev = activeControllers.get(callerKey);
    if (prev) {
      prev.abort();
    }
    localController = new AbortController();
    activeControllers.set(callerKey, localController);
  }

  const isAborted = () => Boolean(signal?.aborted || localController?.signal?.aborted);

  try {
    if (isAborted()) {
      return { ok: false, data: null, tuCache: false, biHuy: true };
    }

    // (1) Ghép prompt theo đúng thứ tự:
    // VAI TRÒ → CONTEXT → QUY TẮC → VÍ DỤ → CÂU HỎI → ĐỊNH DẠNG ĐẦU RA
    const parts: string[] = [];

    if (vaiTro && vaiTro.trim()) {
      parts.push(`=== VAI TRÒ ===\n${vaiTro.trim()}`);
    }
    if (context && context.trim()) {
      parts.push(`=== CONTEXT ===\n${context.trim()}`);
    }
    if (quyTac) {
      const quyTacStr = Array.isArray(quyTac)
        ? quyTac.map((r) => `- ${r}`).join("\n")
        : quyTac.trim();
      if (quyTacStr) {
        parts.push(`=== QUY TẮC ===\n${quyTacStr}`);
      }
    }
    if (viDu) {
      const viDuStr =
        typeof viDu === "string" ? viDu.trim() : JSON.stringify(viDu, null, 2);
      if (viDuStr) {
        parts.push(`=== VÍ DỤ ===\n${viDuStr}`);
      }
    }
    if (cauHoi && cauHoi.trim()) {
      parts.push(`=== CÂU HỎI ===\n${cauHoi.trim()}`);
    }
    if (schema) {
      parts.push(
        `=== ĐỊNH DẠNG ĐẦU RA ===\nTrả về DUY NHẤT một chuỗi JSON hợp lệ tuân thủ chính xác theo schema sau (không thêm văn bản ngoài JSON):\n${JSON.stringify(
          schema,
          null,
          2
        )}`
      );
    }

    const assembledPrompt = parts.join("\n\n");

    // (4) Cache theo hash của prompt (in-memory + localStorage, khóa "vpr:gem:")
    const promptHash = hashString(assembledPrompt);
    const cacheKey = `vpr:gem:${promptHash}`;

    // Kiểm tra in-memory cache
    if (memoryCache.has(cacheKey)) {
      return { ok: true, data: memoryCache.get(cacheKey), tuCache: true };
    }

    // Kiểm tra localStorage cache
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem(cacheKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          memoryCache.set(cacheKey, parsed);
          return { ok: true, data: parsed, tuCache: true };
        }
      }
    } catch {
      // Bỏ qua lỗi đọc localStorage nếu bị chặn
    }

    // Gọi endpoint proxy an toàn /api/gemini trên máy chủ Express
    const timeoutController = new AbortController();
    const timeoutTimer = setTimeout(() => timeoutController.abort(), 30000);

    const combinedSignal = signal || localController?.signal;
    if (combinedSignal) {
      combinedSignal.addEventListener("abort", () => timeoutController.abort());
    }

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaiTro,
          context,
          quyTac,
          viDu,
          cauHoi,
          schema,
          nhietDo,
        }),
        signal: timeoutController.signal,
      });
      clearTimeout(timeoutTimer);

      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data !== undefined) {
          const parsedData = json.data;

          if (schema && !validateSchema(parsedData, schema)) {
            throw new Error("Dữ liệu trả về không khớp với schema yêu cầu");
          }

          if (isAborted()) {
            return { ok: false, data: null, tuCache: false, biHuy: true };
          }

          memoryCache.set(cacheKey, parsedData);
          try {
            if (typeof window !== "undefined" && window.localStorage) {
              window.localStorage.setItem(cacheKey, JSON.stringify(parsedData));
            }
          } catch {
            // Bỏ qua nếu localStorage đầy
          }

          return { ok: true, data: parsedData, tuCache: Boolean(json.tuCache) };
        }
      }
    } catch (proxyErr) {
      console.warn("Proxy /api/gemini gặp sự cố hoặc timeout, chuyển sang fallback:", proxyErr);
    } finally {
      clearTimeout(timeoutTimer);
    }

    return { ok: false, data: null, tuCache: false };
  } catch (error) {
    if (isAborted()) {
      return { ok: false, data: null, tuCache: false, biHuy: true };
    }
    console.warn("Lỗi gọi Gemini (fallback được kích hoạt):", error);
    return { ok: false, data: null, tuCache: false };
  } finally {
    if (callerKey && localController && activeControllers.get(callerKey) === localController) {
      activeControllers.delete(callerKey);
    }
  }
}


import {
  timKiemContextChoCauHoi,
  SYSTEM_PROMPT_CHATBOT,
  FEW_SHOT_CHATBOT,
  taoCauTraLoiFallback,
  taoGoiYFallback,
} from "./gemini/geminiCulturalKnowledge";

export { timKiemContextChoCauHoi, SYSTEM_PROMPT_CHATBOT, FEW_SHOT_CHATBOT };

export interface ChatCoVanResult {
  ok: boolean;
  cauTraLoi: string;
  nguonIds: string[];
  tuCache: boolean;
  loi?: boolean;
}


/**
 * GỌI GEMINI THẬT qua callGemini theo đúng System prompt cố vấn văn hóa (nhiệt độ 0.3)
 */
export async function hoiCoVanVanHoa(
  cauHoi: string,
  boDoHienTai?: {
    trangPhucId?: string;
    mauId?: string;
    phuKienIds?: string[];
  }
): Promise<ChatCoVanResult> {
  const qClean = cauHoi.trim().toLowerCase();
  // Trả lời NGAY TỨC THÌ (<30ms) cho các câu chào hỏi thường gặp để mang lại trải nghiệm chat siêu mượt
  const isGreeting =
    /^(chào|xin chào|halo|hello|hi|chao ban|chào bạn|chào bạn nha|cò em ơi|cò em|bạn là ai|cò em là ai|giới thiệu|bạn giúp được gì|chào em|alo)$/i.test(qClean) ||
    /^(chào cò em|xin chào cò em|cò em chào|hi cò em|hey|ê cò em)$/i.test(qClean);

  if (isGreeting) {
    const greetingFallback = taoCauTraLoiFallback(cauHoi, boDoHienTai);
    return {
      ok: true,
      cauTraLoi: greetingFallback.cauTraLoi,
      nguonIds: greetingFallback.nguonIds,
      tuCache: true,
      loi: false,
    };
  }

  const context = timKiemContextChoCauHoi(cauHoi, boDoHienTai);

  const res = await callGemini({
    vaiTro: `Bạn là "Cố vấn văn hóa Cò Em" của ứng dụng Cò Em — Việt Phục Remix, xưng "Cò Em", gọi người dùng là "bạn", nói với học sinh, sinh viên bằng tiếng Việt, giọng thân thiện, tối đa 4 câu.`,
    quyTac: [
      "1. Khi người dùng chào hỏi hoặc hỏi bạn là ai, hãy vui vẻ chào lại bằng tiếng Việt, giới thiệu mình là Cò Em và gợi ý 1-2 chủ đề trang phục thú vị (như Áo dài, Áo tứ thân, Áo ngũ thân hay Áo bà ba).",
      "2. Dùng thông tin trong CONTEXT để giải đáp chính xác về trang phục, dịp mặc, chất liệu lụa vải, phụ kiện và nét đẹp văn hóa Việt Nam.",
      "3. Nếu câu hỏi hoàn toàn ngoài lề văn hóa/trang phục, từ chối lịch sự và hướng người dùng quay lại chủ đề trang phục truyền thống.",
      "4. Không phán đúng/sai tuyệt đối; tôn trọng sự đa dạng của 54 dân tộc anh em.",
      "5. Kết thúc bằng [nguon: id1, id2] khi cung cấp kiến thức từ tư liệu văn hóa."
    ],
    viDu: FEW_SHOT_CHATBOT,
    context: context || "Không có thông tin phù hợp trong kho dữ liệu văn hóa.",
    cauHoi,
    nhietDo: 0.3,
    callerKey: "co_em_chat",
  });

  if (!res.ok || typeof res.data !== "string" || !res.data.trim()) {
    const fallback = taoCauTraLoiFallback(cauHoi, boDoHienTai);
    return {
      ok: true,
      cauTraLoi: fallback.cauTraLoi,
      nguonIds: fallback.nguonIds,
      tuCache: false,
      loi: false,
    };
  }

  const rawText = res.data;
  // Trích xuất [nguon: id1, id2] hoặc [nguồn: id1, id2]
  const nguonMatch = rawText.match(/\[nguon?:\s*([^\]]+)\]/i);
  let nguonIds: string[] = [];
  let cauTraLoi = rawText;

  if (nguonMatch) {
    nguonIds = nguonMatch[1]
      .split(/[,;]/)
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
    cauTraLoi = rawText.replace(/\[nguon?:\s*[^\]]+\]/i, "").trim();
  }

  return {
    ok: true,
    cauTraLoi,
    nguonIds,
    tuCache: res.tuCache,
  };
}

export interface GoiYPhanTichBoiCanh {
  tongQuan: string;
  trangPhucId: string;
  tenTrangPhuc: string;
  lyDo: string;
  phoiMau: {
    mauChinh: string;
    mauPhoi: string;
    yNghia: string;
  };
  phuKien: string[];
  luuYVanHoa: string;
  dipTuongUng: string[];
  vungTuongUng?: string;
  phongCachKhuyenNghi: "truyen_thong" | "cach_tan_nhe" | "ca_tinh";
}


/**
 * Phân tích bối cảnh do người dùng tự nhập tự do bằng Gemini AI
 */
export async function phanTichBoiCanhVaGoiY(boiCanhMoTa: string): Promise<GoiYPhanTichBoiCanh> {
  const fallback = taoGoiYFallback(boiCanhMoTa);
  if (!boiCanhMoTa || !boiCanhMoTa.trim()) return fallback;

  const schema = {
    type: "object",
    properties: {
      tongQuan: { type: "string" },
      trangPhucId: {
        type: "string",
      },
      tenTrangPhuc: { type: "string" },
      lyDo: { type: "string" },
      phoiMau: {
        type: "object",
        properties: {
          mauChinh: { type: "string" },
          mauPhoi: { type: "string" },
          yNghia: { type: "string" },
        },
        required: ["mauChinh", "mauPhoi", "yNghia"],
      },
      phuKien: {
        type: "array",
        items: { type: "string" },
      },
      luuYVanHoa: { type: "string" },
      dipTuongUng: {
        type: "array",
        items: { type: "string" },
      },
      vungTuongUng: { type: "string" },
      phongCachKhuyenNghi: {
        type: "string",
      },
    },
    required: ["tongQuan", "trangPhucId", "tenTrangPhuc", "lyDo", "phoiMau", "phuKien", "luuYVanHoa", "dipTuongUng", "phongCachKhuyenNghi"],
  };

  try {
    const res = await callGemini({
      vaiTro: `Bạn là cố vấn thời trang văn hóa truyền thống "Cò Em" của ứng dụng Cò Em — Việt Phục Remix. Bạn am hiểu tường tận lễ nghi, lịch sử, văn hóa trang phục Việt Nam qua các triều đại và vùng miền.`,
      context: `Danh sách trang phục có sẵn trong hệ thống:
- aodai: Áo dài (truyền thống & cách tân, hợp cưới hỏi, kỷ yếu, lễ hội, dạo phố)
- ngu_than: Áo ngũ thân tay chẽn (trang trọng, cổ phong, cung đình Huế, lễ hội)
- ao_tac: Áo Tấc ngũ thân tay thụng (đại lễ, cưới hỏi, tế tự trang nghiêm)
- ao_giao_linh: Áo Giao lĩnh cổ chéo (cổ phục Lý - Trần - Lê, lễ hội cổ phong)
- tu_than: Áo tứ thân (phụ nữ Kinh Bắc Bộ, hội làng, trẩy hội, quan họ)
- ba_ba: Áo bà ba (Nam Bộ, sông nước, bình dị, thoải mái, đời thường)
- muong_vay: Áo pắn & Váy cạp Mường (Hòa Bình, lễ hội cồng chiêng, cạp váy Đông Sơn)
- co_thai: Áo cỏm Thái (Tây Bắc, ôm sát cúc bướm bạc, hội hoa ban)
- mong_lanh: Trang phục Mông (núi cao, thổ cẩm dệt lanh, vẽ sáp ong)
- dao_do: Trang phục Dao Đỏ (khăn vấn đỏ rực, chuông bạc, lễ cưới & lễ hội vùng cao)
- tay_cham: Áo chàm Tày (Việt Bắc, hồ Ba Bể, hội Lồng Tồng, thanh nhã)
- lo_lo_hoa: Trang phục Lô Lô Hoa (Hà Giang, ghép vải tam giác rực rỡ)
- ha_nhi: Trang phục Hà Nhì (Y Tý - Lào Cai, áo chàm hai lớp ấm áp đính bạc)
- pa_then: Trang phục Pà Thẻn (Hà Giang, sắc đỏ lửa thiêng rực rỡ)
- ede_tho_cam: Trang phục Ê Đê (Đắk Lắk, Tây Nguyên, buôn làng, cồng chiêng)
- bana_tho_cam: Trang phục Ba Na (Gia Lai - Kon Tum, nhà Rông, thổ cẩm đen-đỏ-trắng)
- caho_tho_cam: Trang phục Cơ Ho (Lâm Đồng - Đà Lạt, thổ cẩm trắng ngà Lâm Viên)
- champa_tho_cam: Trang phục Chăm (Ninh Thuận, tháp Chàm, lễ hội Katê)
- sampot: Sampot Khmer (Nam Bộ, lễ Chol Chnam Thmay, lễ cưới Khmer)`,
      cauHoi: `Người dùng mô tả bối cảnh / hoàn cảnh chuẩn bị trang phục của họ như sau:
"${boiCanhMoTa.trim()}"

Hãy phân tích bối cảnh này (thời tiết, tính trang trọng, không gian văn hóa, đối tượng tham dự), từ đó chọn trang phục phù hợp nhất từ danh sách trên, hướng dẫn phối màu sắc chuẩn mực văn hóa, đề xuất 2-3 phụ kiện và đưa ra lời dặn văn hóa tinh tế từ Cò Em.`,
      schema,
      nhietDo: 0.3,
      callerKey: "phan_tich_boi_canh",
    });

    if (res.ok && res.data && typeof res.data === "object") {
      const parsed = res.data as Partial<GoiYPhanTichBoiCanh>;
      return {
        tongQuan: parsed.tongQuan || fallback.tongQuan,
        trangPhucId: parsed.trangPhucId || fallback.trangPhucId,
        tenTrangPhuc: parsed.tenTrangPhuc || fallback.tenTrangPhuc,
        lyDo: parsed.lyDo || fallback.lyDo,
        phoiMau: parsed.phoiMau || fallback.phoiMau,
        phuKien: Array.isArray(parsed.phuKien) && parsed.phuKien.length > 0 ? parsed.phuKien : fallback.phuKien,
        luuYVanHoa: parsed.luuYVanHoa || fallback.luuYVanHoa,
        dipTuongUng: Array.isArray(parsed.dipTuongUng) && parsed.dipTuongUng.length > 0 ? parsed.dipTuongUng : fallback.dipTuongUng,
        vungTuongUng: parsed.vungTuongUng || fallback.vungTuongUng,
        phongCachKhuyenNghi: (parsed.phongCachKhuyenNghi as any) || fallback.phongCachKhuyenNghi,
      };
    }
  } catch (err) {
    console.warn("Lỗi phân tích bối cảnh:", err);
  }

  return fallback;
}
