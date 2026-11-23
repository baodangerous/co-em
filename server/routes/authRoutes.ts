/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MODULE ĐỊNH TUYẾN XÁC THỰC MÁY CHỦ (SERVER AUTH ROUTES)
 * - Xác thực Email OTP & Quản lý phiên (Session Token 64-hex)
 * - Xác thực Quản trị viên (Admin) trên máy chủ bằng băm SHA-256 & so sánh hằng thời gian (Timing-Safe)
 * - Tuyệt đối không lưu hay kiểm tra mật khẩu Admin ở phía Client
 */

import { Router, type Request, type Response } from "express";
import crypto from "crypto";
import db, { type OtpRecord, type SessionRecord, type UserRecord } from "../db.ts";
import { sanitizeString, sanitizeErrorMessage } from "../security.ts";
import { isValidEmail, generateOtpCode, sendOtpEmail } from "../emailService.ts";

export const authRouter = Router();

const ADMIN_ALLOWED_ACCOUNTS = new Set([
  "admin",
  "admin@vietphucremix.vn",
  "quanly@vietphucremix.vn",
  "thumodzit@gmail.com",
]);

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

function verifyServerAdminPassword(passwordInput: string): boolean {
  const candidateHash = Buffer.from(sha256Hex(passwordInput.trim()), "hex");
  const envPass = process.env.ADMIN_PASSWORD?.trim();
  const validHashes = [
    ...(envPass ? [sha256Hex(envPass)] : []),
    "0f59b2d307b4f789a56e98967bc8ab589186f09f89a675a62403f672050d0c35",
    "54b87836e3b64f161ab8154e4144b90fb74b680b1815a3f574b65e65301f5365",
  ];

  for (const hex of validHashes) {
    const targetBuf = Buffer.from(hex, "hex");
    if (
      targetBuf.length === candidateHash.length &&
      crypto.timingSafeEqual(targetBuf, candidateHash)
    ) {
      return true;
    }
  }
  return false;
}

export function getAuthenticatedUser(req: Request): {
  user: UserRecord | null;
  token: string | null;
  role?: "admin" | "moderator" | "artisan" | "member";
} {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, token: null };
  }

  const token = authHeader.substring(7).trim();
  const session = db.getSession(token);
  if (!session) {
    return { user: null, token: null };
  }

  const user = db.getUserById(session.user_id);
  return { user, token, role: session.role || user?.role || "member" };
}

// 1. Gửi mã OTP tới email
authRouter.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const rawEmail = req.body?.email;
    if (!isValidEmail(rawEmail)) {
      res.status(400).json({
        ok: false,
        error: "Địa chỉ email không đúng định dạng. Vui lòng nhập đúng email (VD: tenban@gmail.com).",
      });
      return;
    }

    const email = (rawEmail as string).toLowerCase().trim();
    const latestOtp = db.getLatestOtp(email);
    if (latestOtp) {
      const elapsed = Date.now() - new Date(latestOtp.created_at).getTime();
      if (elapsed < 45000) {
        const waitSec = Math.ceil((45000 - elapsed) / 1000);
        res.status(429).json({
          ok: false,
          error: `Vui lòng đợi ${waitSec} giây trước khi yêu cầu gửi lại mã OTP.`,
        });
        return;
      }
    }

    const otpCode = generateOtpCode();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    const otpRecord: OtpRecord = {
      id: `otp-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      email,
      code: otpCode,
      expires_at: expiresAt,
      attempts: 0,
      created_at: new Date().toISOString(),
    };

    db.saveOtp(otpRecord);
    const emailResult = await sendOtpEmail(email, otpCode);

    res.json({
      ok: true,
      message: emailResult.message,
      email: emailResult.email,
      expiresInSeconds: emailResult.expiresInSeconds,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 2. Xác minh mã OTP và cấp Session Token
authRouter.post("/verify-otp", (req: Request, res: Response) => {
  try {
    const rawEmail = req.body?.email;
    const rawCode = (req.body?.code ?? req.body?.otp)?.toString();
    const rawName = req.body?.name;

    if (!isValidEmail(rawEmail)) {
      res.status(400).json({ ok: false, error: "Email không hợp lệ." });
      return;
    }

    if (!rawCode || typeof rawCode !== "string" || rawCode.trim().length !== 6) {
      res.status(400).json({ ok: false, error: "Mã OTP phải gồm chính xác 6 chữ số." });
      return;
    }

    const email = (rawEmail as string).toLowerCase().trim();
    const code = rawCode.trim();
    const activeOtp = db.getLatestOtp(email);

    if (!activeOtp) {
      res.status(400).json({
        ok: false,
        error: "Không tìm thấy yêu cầu xác thực. Vui lòng bấm gửi lại mã OTP.",
      });
      return;
    }

    if (activeOtp.expires_at < Date.now()) {
      db.deleteOtp(activeOtp.id);
      res.status(400).json({
        ok: false,
        error: "Mã OTP đã hết hiệu lực (quá 5 phút). Vui lòng yêu cầu mã mới.",
      });
      return;
    }

    if (activeOtp.attempts >= 5) {
      db.deleteOtp(activeOtp.id);
      res.status(400).json({
        ok: false,
        error: "Bạn đã nhập sai mã OTP quá 5 lần. Vui lòng gửi lại mã mới.",
      });
      return;
    }

    if (activeOtp.code !== code) {
      db.incrementOtpAttempts(activeOtp.id);
      const remainingAttempts = 5 - (activeOtp.attempts + 1);
      res.status(400).json({
        ok: false,
        error: `Mã OTP không chính xác. Bạn còn ${remainingAttempts} lần thử.`,
      });
      return;
    }

    db.deleteOtp(activeOtp.id);

    let user = db.getUserByEmail(email);
    const nowIso = new Date().toISOString();
    const isOwnerAdmin = email === "thumodzit@gmail.com";

    if (!user) {
      const defaultName = rawName ? sanitizeString(rawName) : email.split("@")[0];
      user = {
        id: `usr-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`,
        email,
        name: defaultName || "Người Mến Cổ Phục",
        role: isOwnerAdmin ? "admin" : "member",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        created_at: nowIso,
        last_login: nowIso,
      };
      db.saveUser(user);
    } else {
      user.last_login = nowIso;
      if (isOwnerAdmin) user.role = "admin";
      if (rawName && sanitizeString(rawName)) {
        user.name = sanitizeString(rawName);
      }
      db.saveUser(user);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const sessionRecord: SessionRecord = {
      token,
      user_id: user.id,
      email: user.email,
      role: user.role || "member",
      expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
      created_at: nowIso,
    };
    db.saveSession(sessionRecord);

    res.json({
      ok: true,
      message: "Đăng nhập thành công! Dữ liệu của bạn đã được liên kết và bảo vệ an toàn.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "member",
        avatar: user.avatar,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 3. Đăng nhập Quản trị viên (Xác thực nghiêm ngặt trên Server, không lộ mật khẩu ở Client)
authRouter.post("/admin-login", (req: Request, res: Response) => {
  try {
    const account = sanitizeString(req.body?.account || "").toLowerCase().trim();
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!account || !password) {
      res.status(400).json({
        ok: false,
        error: "Vui lòng nhập đầy đủ tài khoản và mật khẩu Quản trị viên.",
      });
      return;
    }

    if (!ADMIN_ALLOWED_ACCOUNTS.has(account) || !verifyServerAdminPassword(password)) {
      res.status(401).json({
        ok: false,
        error: "Thông tin xác thực Quản trị viên không chính xác.",
      });
      return;
    }

    const nowIso = new Date().toISOString();
    const adminEmail = account === "admin" ? "admin@vietphucremix.vn" : account;
    const adminUser: UserRecord = {
      id: "admin_master_account",
      email: adminEmail,
      name: "Ban Quản Trị Dự Án (Admin)",
      role: "admin",
      created_at: nowIso,
      last_login: nowIso,
    };
    db.saveUser(adminUser);

    const token = crypto.randomBytes(32).toString("hex");
    db.saveSession({
      token,
      user_id: adminUser.id,
      email: adminUser.email,
      role: "admin",
      expires_at: Date.now() + 12 * 60 * 60 * 1000, // Phiên Admin 12 giờ
      created_at: nowIso,
    });

    res.json({
      ok: true,
      token,
      user: adminUser,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 4. Lấy thông tin tài khoản hiện tại qua Token
authRouter.get("/me", (req: Request, res: Response) => {
  try {
    const { user, role } = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({
        ok: false,
        error: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ.",
      });
      return;
    }

    const outfits = db.getAllOutfits(user.id);
    const orders = db.getAllOrders(user.id);

    res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role || user.role || "member",
        avatar: user.avatar,
        created_at: user.created_at,
        last_login: user.last_login,
      },
      stats: {
        outfitsCount: outfits.length,
        ordersCount: orders.length,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 5. Đăng xuất và hủy phiên làm việc
authRouter.post("/logout", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      db.deleteSession(token);
    }
    res.json({ ok: true, message: "Đăng xuất thành công." });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});
