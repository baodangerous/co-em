/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Xác thực Firebase ID Token phía máy chủ bằng chứng chỉ công khai X.509 của Google (không cần firebase-admin).
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIREBASE_CERT_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let cachedCerts: { certs: Record<string, string>; expiresAt: number } | null = null;
let cachedProjectId: string | null = null;

function getFirebaseProjectId(): string {
  if (cachedProjectId) return cachedProjectId;
  if (process.env.FIREBASE_PROJECT_ID) {
    cachedProjectId = process.env.FIREBASE_PROJECT_ID;
    return cachedProjectId || "";
  }
  try {
    const cfgPath = path.resolve(__dirname, "../firebase-applet-config.json");
    const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    cachedProjectId = typeof cfg.projectId === "string" ? cfg.projectId : "";
  } catch {
    cachedProjectId = "";
  }
  return cachedProjectId || "";
}

async function fetchGooglePublicCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cachedCerts && now < cachedCerts.expiresAt) {
    return cachedCerts.certs;
  }

  const res = await fetch(FIREBASE_CERT_URL);
  if (!res.ok) {
    throw new Error("Không thể tải chứng chỉ xác thực Google.");
  }

  const cacheControl = res.headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeMs = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) * 1000 : 3600_000;

  const certs = (await res.json()) as Record<string, string>;
  cachedCerts = { certs, expiresAt: now + maxAgeMs };
  return certs;
}

export interface VerifiedFirebaseClaims {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseClaims> {
  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("ID token không đúng định dạng JWT.");
  }

  const [headerB64, payloadB64, sigB64] = parts;
  const header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf8")) as {
    alg?: string;
    kid?: string;
  };
  const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as {
    aud?: string;
    iss?: string;
    sub?: string;
    exp?: number;
    iat?: number;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  };

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Thuật toán hoặc key ID của token không hợp lệ.");
  }

  const projectId = getFirebaseProjectId();
  if (!projectId) {
    throw new Error("Chưa cấu hình Firebase Project ID trên máy chủ.");
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || payload.exp <= nowSec) {
    throw new Error("Firebase ID token đã hết hạn.");
  }
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new Error("Firebase ID token không thuộc dự án hợp lệ.");
  }
  if (!payload.sub || typeof payload.sub !== "string") {
    throw new Error("Thiếu thông tin định danh người dùng trong token.");
  }

  const certs = await fetchGooglePublicCerts();
  const certPem = certs[header.kid];
  if (!certPem) {
    throw new Error("Không tìm thấy chứng chỉ công khai tương ứng.");
  }

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();

  const signature = Buffer.from(sigB64, "base64url");
  if (!verifier.verify(certPem, signature)) {
    throw new Error("Chữ ký Firebase ID token không hợp lệ.");
  }

  return {
    uid: payload.sub,
    email: (payload.email || "").toLowerCase().trim(),
    emailVerified: Boolean(payload.email_verified),
    name: payload.name,
    picture: payload.picture,
  };
}
