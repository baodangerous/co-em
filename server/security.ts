/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ TIỆN ÍCH BẢO MẬT & CHỐNG RÒ RỈ THÔNG TIN MẬT (SERVER SECURITY MODULE)
 * - Khử độc chuỗi ký tự (Sanitize input, XSS prevention)
 * - Tẩy sạch bí mật, khóa API và đường dẫn hệ thống khỏi lỗi và phản hồi
 * - Giới hạn tần suất gọi (Rate limiting)
 * - Chống lộ biến môi trường và thông tin nhạy cảm lên frontend
 */

import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Danh sách các từ khóa hoặc mẫu nhạy cảm cần lọc sạch
const SENSITIVE_PATTERNS = [
  /AIza[0-9A-Za-z-_]{20,}/g, // Google API Key (bất kỳ chuỗi bắt đầu bằng AIza có độ dài >= 24)
  /Bearer\s+[A-Za-z0-9._-]+/gi, // Bearer Tokens
  /(?:\/[a-zA-Z0-9._-]+){2,}/g, // Bất kỳ đường dẫn tệp tuyệt đối nào (/var/..., /home/..., /app/...)
  /sk-[a-zA-Z0-9]{20,}/g, // Generic Secret Keys
];

/**
 * Tẩy sạch chuỗi để không chứa khóa bí mật hay đường dẫn nội bộ
 */
export function redactSecrets(text: string): string {
  if (!text || typeof text !== "string") return text;

  let cleaned = text;

  // Lấy giá trị thực tế của biến môi trường nhạy cảm để xóa nếu có
  const sensitiveEnvKeys = ["GEMINI_API_KEY", "API_KEY", "SECRET", "PRIVATE_KEY"];
  for (const envKey of sensitiveEnvKeys) {
    const val = process.env[envKey];
    if (val && val.length > 5) {
      cleaned = cleaned.split(val).join("[REDACTED_SECRET]");
    }
  }

  for (const pattern of SENSITIVE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[REDACTED]");
  }

  return cleaned;
}

/**
 * Xử lý lỗi an toàn: KHÔNG lộ stack trace, KHÔNG lộ đường dẫn file, KHÔNG lộ API key
 */
export function sanitizeErrorMessage(err: unknown): string {
  if (!err) return "Đã xảy ra lỗi không xác định.";

  const rawMsg = err instanceof Error ? err.message : String(err);
  const safeMsg = redactSecrets(rawMsg);

  // Chỉ trả về thông điệp thân thiện, không trả về chi tiết kỹ thuật nhạy cảm
  if (safeMsg.includes("429") || safeMsg.toLowerCase().includes("quota")) {
    return "Hệ thống tạm thời bận do lưu lượng cao. Vui lòng thử lại sau vài giây.";
  }
  if (safeMsg.includes("503") || safeMsg.toLowerCase().includes("unavailable")) {
    return "Dịch vụ trí tuệ nhân tạo đang bảo trì. Ứng dụng sẽ tự động sử dụng kho tri thức có sẵn.";
  }

  return safeMsg.slice(0, 160);
}

/**
 * Khử độc đầu vào (Chống XSS / Injection)
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 1000);
}

/**
 * Middleware bảo mật HTTP Headers
 */
export function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Permissions-Policy", "camera=(self), microphone=(), geolocation=(self)");
  next();
}

/**
 * So sánh chuỗi hex theo hằng thời gian (Timing-Safe)
 */
export function timingSafeEqualHex(hexA: string, hexB: string): boolean {
  if (!hexA || !hexB || hexA.length !== hexB.length) return false;
  try {
    const bufA = Buffer.from(hexA, "hex");
    const bufB = Buffer.from(hexB, "hex");
    return bufA.length === bufB.length && bufA.length > 0 && crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Băm mã OTP theo email để không lưu plaintext OTP trong CSDL
 */
export function hashOtpCode(email: string, code: string): string {
  const secret = process.env.OTP_HASH_SECRET || process.env.ADMIN_PASSWORD || "vpr-otp-salt-v1";
  return crypto
    .createHmac("sha256", secret)
    .update(`${email.toLowerCase().trim()}:${code.trim()}`)
    .digest("hex");
}

/**
 * Kiểm tra JSON theo schema đơn giản và chặt chẽ
 */
export function validateSchema(data: unknown, schema: Record<string, unknown>, depth = 0): boolean {
  if (!schema || depth > 8) return depth <= 8;
  const expectedType = schema.type as string | undefined;

  if (expectedType === "object") {
    if (typeof data !== "object" || data === null || Array.isArray(data)) return false;
    const obj = data as Record<string, unknown>;
    if (Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (typeof field === "string" && (obj[field] === undefined || obj[field] === null)) {
          return false;
        }
      }
    }
    if (schema.properties && typeof schema.properties === "object") {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, propSchema] of Object.entries(props)) {
        if (obj[key] !== undefined && obj[key] !== null) {
          if (!validateSchema(obj[key], propSchema, depth + 1)) return false;
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
        if (!validateSchema(item, itemSchema, depth + 1)) return false;
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
 * Middleware giới hạn tần suất yêu cầu theo bộ nhớ in-memory (hỗ trợ bucket riêng theo route)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60_000);
cleanupInterval.unref?.();

export function rateLimiterMiddleware(maxRequests = 180, windowMs = 60000, keyPrefix = "global") {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown_client";
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    const record = requestCounts.get(key);
    if (!record || now > record.resetTime) {
      if (requestCounts.size > 5000) {
        for (const [k, v] of requestCounts.entries()) {
          if (now > v.resetTime) requestCounts.delete(k);
        }
      }
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      res.status(429).json({
        ok: false,
        error: "Quá nhiều yêu cầu. Vui lòng chờ một chút trước khi thử lại.",
      });
      return;
    }

    next();
  };
}
