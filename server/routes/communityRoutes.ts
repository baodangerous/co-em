/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MODULE ĐỊNH TUYẾN CỘNG ĐỒNG & QUẢN TRỊ (COMMUNITY & ADMIN ROUTES)
 * - Đồng bộ bài đăng Chợ Phiên, đơn đặt may làng nghề, đăng ký workshop vào SQLite
 * - Bảo vệ toàn bộ endpoint quản trị (/api/admin/*) bằng middleware requireAdmin trên máy chủ
 * - Che giấu PII (SĐT, Email) nếu người gọi không phải Admin
 */

import { Router, type Request, type Response } from "express";
import crypto from "crypto";
import db from "../db.ts";
import {
  communityDb,
  type CommunityPostRow,
  type VillageOrderRow,
  type WorkshopRegRow,
} from "../dbCommunity.ts";
import { sanitizeString, sanitizeErrorMessage, rateLimiterMiddleware } from "../security.ts";
import { getAuthenticatedUser, requireAdmin } from "./authRoutes.ts";

export const communityRouter = Router();

function maskPhone(phone: string): string {
  const clean = String(phone || "").trim();
  if (clean.length <= 4) return "****";
  return `${clean.slice(0, 3)}****${clean.slice(-2)}`;
}

function maskEmail(email: string): string {
  const clean = String(email || "").trim();
  const [local, domain] = clean.split("@");
  if (!local || !domain) return "***@***";
  return `${local.slice(0, 2)}***@${domain}`;
}

// 1. Bootstrap dữ liệu cộng đồng công khai
communityRouter.get("/community/bootstrap", (req: Request, res: Response) => {
  try {
    const { user, role } = getAuthenticatedUser(req);
    const isAdmin = Boolean(user && (role === "admin" || role === "moderator"));

    const posts = communityDb.listCommunityPosts(isAdmin);
    const villages = communityDb.getKv("villages", null);
    const workshops = communityDb.getKv("workshops", null);
    const customCostumes = communityDb.getKv("custom_costumes", []);
    const hiddenCostumeIds = communityDb.getKv("hidden_costumes", []);
    const settings = communityDb.getKv("settings", null);

    res.json({
      ok: true,
      data: {
        posts,
        villages,
        workshops,
        customCostumes,
        hiddenCostumeIds,
        settings,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 2. Đăng bài phối đồ lên Chợ Phiên
communityRouter.post(
  "/community/posts",
  rateLimiterMiddleware(15, 600_000, "community-post"),
  (req: Request, res: Response) => {
    try {
      const { user } = getAuthenticatedUser(req);
      const body = req.body || {};
      const trangPhucId = sanitizeString(body.trangPhucId).slice(0, 64);
      if (!trangPhucId) {
        res.status(400).json({ ok: false, error: "Thiếu mã trang phục." });
        return;
      }

      const settings = communityDb.getKv<{ requirePostModeration?: boolean }>("settings", {});
      const status = settings?.requirePostModeration ? "pending" : "approved";

      const post: CommunityPostRow = {
        id: `cp_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
        user_id: user?.id,
        nguoi_dang: user
          ? `${user.name} (Nhà Sưu Tầm)`
          : sanitizeString(body.nguoiDang).slice(0, 80) || "Bạn (Nhà Sưu Tầm)",
        nhom_id: sanitizeString(body.nhomId).slice(0, 48) || "kb",
        trang_phuc_id: trangPhucId,
        mau_id: sanitizeString(body.mauId).slice(0, 32) || "m_do",
        phu_kien_ids: Array.isArray(body.phuKienIds)
          ? body.phuKienIds.slice(0, 10).map((x: unknown) => sanitizeString(x).slice(0, 64))
          : [],
        dip: sanitizeString(body.dip).slice(0, 48) || "le_hoi",
        vung: sanitizeString(body.vung).slice(0, 32) || "bac",
        nhan: body.nhan === "sang_tao" ? "sang_tao" : "chuan",
        caption: sanitizeString(body.caption).slice(0, 300) || "Chia sẻ bộ phối Việt phục!",
        nhan_vat_config:
          typeof body.nhanVatConfig === "object" && body.nhanVatConfig !== null
            ? (body.nhanVatConfig as Record<string, unknown>)
            : {},
        binh_chon: { hop_dip: 1, phoi_mau: 1, ton_trong_vung_mien: 1 },
        trang_thai_duyet: status,
        tao_luc: new Date().toISOString(),
      };

      communityDb.saveCommunityPost(post);
      res.json({ ok: true, data: post });
    } catch (err) {
      res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
    }
  }
);

// 3. Bình chọn bài đăng Chợ Phiên
communityRouter.post(
  "/community/posts/:id/vote",
  rateLimiterMiddleware(60, 60_000, "community-vote"),
  (req: Request, res: Response) => {
    try {
      const id = sanitizeString(req.params.id).slice(0, 80);
      const post = communityDb.getCommunityPostById(id);
      if (!post) {
        res.status(404).json({ ok: false, error: "Không tìm thấy bài đăng." });
        return;
      }

      const reason = req.body?.reason as "hop_dip" | "phoi_mau" | "ton_trong_vung_mien";
      const prevReason = req.body?.prevReason as "hop_dip" | "phoi_mau" | "ton_trong_vung_mien" | undefined;
      const validReasons = new Set(["hop_dip", "phoi_mau", "ton_trong_vung_mien"]);

      if (prevReason && validReasons.has(prevReason) && post.binh_chon[prevReason] > 0) {
        post.binh_chon[prevReason] -= 1;
      }
      if (reason && validReasons.has(reason)) {
        post.binh_chon[reason] = (post.binh_chon[reason] || 0) + 1;
      }

      communityDb.saveCommunityPost(post);
      res.json({ ok: true, data: post });
    } catch (err) {
      res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
    }
  }
);

// 4. Đặt may Làng Nghề
communityRouter.post(
  "/community/village-orders",
  rateLimiterMiddleware(15, 600_000, "village-order"),
  (req: Request, res: Response) => {
    try {
      const { user } = getAuthenticatedUser(req);
      const body = req.body || {};
      const customerName = sanitizeString(body.customerName).slice(0, 80);
      const customerPhone = sanitizeString(body.customerPhone).slice(0, 24);
      const villageId = sanitizeString(body.villageId).slice(0, 64);

      if (!villageId || !customerName || !customerPhone) {
        res.status(400).json({
          ok: false,
          error: "Vui lòng điền đầy đủ họ tên và số điện thoại liên hệ.",
        });
        return;
      }

      const row: VillageOrderRow = {
        id: `order_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
        user_id: user?.id,
        village_id: villageId,
        village_name: sanitizeString(body.villageName).slice(0, 120),
        costume_name: sanitizeString(body.costumeName).slice(0, 120),
        customer_name: customerName,
        customer_phone: customerPhone,
        note: sanitizeString(body.note).slice(0, 400),
        status: "new",
        created_at: new Date().toISOString(),
      };

      communityDb.addVillageOrder(row);
      res.json({ ok: true, data: row });
    } catch (err) {
      res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
    }
  }
);

// 5. Đăng ký Workshop thực hành
communityRouter.post(
  "/community/workshop-registrations",
  rateLimiterMiddleware(15, 600_000, "ws-reg"),
  (req: Request, res: Response) => {
    try {
      const { user } = getAuthenticatedUser(req);
      const body = req.body || {};
      const fullName = sanitizeString(body.fullName).slice(0, 80);
      const phone = sanitizeString(body.phone).slice(0, 24);
      const email = sanitizeString(body.email).slice(0, 120);
      const workshopId = sanitizeString(body.workshopId).slice(0, 64);

      if (!workshopId || !fullName || !phone || !email) {
        res.status(400).json({
          ok: false,
          error: "Vui lòng điền đầy đủ họ tên, số điện thoại và email.",
        });
        return;
      }

      const row: WorkshopRegRow = {
        id: `wsreg_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
        user_id: user?.id,
        workshop_id: workshopId,
        workshop_title: sanitizeString(body.workshopTitle).slice(0, 140),
        workshop_date: sanitizeString(body.workshopDate).slice(0, 64),
        workshop_time: sanitizeString(body.workshopTime).slice(0, 64),
        workshop_location: sanitizeString(body.workshopLocation).slice(0, 140),
        full_name: fullName,
        phone,
        email,
        attendee_count: Math.max(1, Math.min(5, Number(body.attendeeCount) || 1)),
        motivation_note: sanitizeString(body.motivationNote).slice(0, 500),
        status: "confirmed",
        created_at: new Date().toISOString(),
      };

      communityDb.addWorkshopRegistration(row);
      res.json({ ok: true, data: row });
    } catch (err) {
      res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
    }
  }
);

// =========================================================================
// ENDPOINT QUẢN TRỊ VIÊN (YÊU CẦU ROLE ADMIN / MODERATOR TRÊN MÁY CHỦ)
// =========================================================================

communityRouter.get("/admin/overview", requireAdmin, (_req: Request, res: Response) => {
  try {
    const users = db.listAllUsers();
    const villageOrders = communityDb.listVillageOrders();
    const wsRegistrations = communityDb.listWorkshopRegistrations();
    const posts = communityDb.listCommunityPosts(true);
    res.json({
      ok: true,
      data: { users, villageOrders, wsRegistrations, posts },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

communityRouter.get("/community/village-orders", (req: Request, res: Response) => {
  const { user, role } = getAuthenticatedUser(req);
  const isAdmin = Boolean(user && (role === "admin" || role === "moderator"));
  const orders = communityDb.listVillageOrders();
  res.json({
    ok: true,
    data: isAdmin
      ? orders
      : orders.map((o) => ({ ...o, customer_phone: maskPhone(o.customer_phone) })),
  });
});

communityRouter.get("/community/workshop-registrations", (req: Request, res: Response) => {
  const { user, role } = getAuthenticatedUser(req);
  const isAdmin = Boolean(user && (role === "admin" || role === "moderator"));
  const regs = communityDb.listWorkshopRegistrations();
  res.json({
    ok: true,
    data: isAdmin
      ? regs
      : regs.map((r) => ({ ...r, phone: maskPhone(r.phone), email: maskEmail(r.email) })),
  });
});

communityRouter.patch("/admin/village-orders/:id", requireAdmin, (req: Request, res: Response) => {
  const id = sanitizeString(req.params.id).slice(0, 80);
  const status = req.body?.status;
  if (!["new", "contacted", "completed"].includes(status)) {
    res.status(400).json({ ok: false, error: "Trạng thái đơn không hợp lệ." });
    return;
  }
  const updated = communityDb.updateVillageOrderStatus(id, status);
  res.json({ ok: updated });
});

communityRouter.patch("/admin/workshop-registrations/:id", requireAdmin, (req: Request, res: Response) => {
  const id = sanitizeString(req.params.id).slice(0, 80);
  const status = req.body?.status;
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    res.status(400).json({ ok: false, error: "Trạng thái đăng ký không hợp lệ." });
    return;
  }
  const updated = communityDb.updateWorkshopRegistrationStatus(id, status);
  res.json({ ok: updated });
});

communityRouter.patch("/admin/posts/:id", requireAdmin, (req: Request, res: Response) => {
  const id = sanitizeString(req.params.id).slice(0, 80);
  const post = communityDb.getCommunityPostById(id);
  if (!post) {
    res.status(404).json({ ok: false, error: "Không tìm thấy bài đăng." });
    return;
  }
  if (["approved", "pending", "hidden"].includes(req.body?.trangThaiDuyet)) {
    post.trang_thai_duyet = req.body.trangThaiDuyet;
  }
  if (["chuan", "sang_tao", "can_xem_lai"].includes(req.body?.nhan)) {
    post.nhan = req.body.nhan;
  }
  communityDb.saveCommunityPost(post);
  res.json({ ok: true, data: post });
});

communityRouter.put("/admin/kv/:key", requireAdmin, (req: Request, res: Response) => {
  const key = sanitizeString(req.params.key).slice(0, 48);
  const allowedKeys = new Set(["villages", "workshops", "custom_costumes", "hidden_costumes", "settings"]);
  if (!allowedKeys.has(key)) {
    res.status(400).json({ ok: false, error: "Khóa cấu hình không hợp lệ." });
    return;
  }
  communityDb.setKv(key, req.body?.value ?? null);
  res.json({ ok: true });
});

