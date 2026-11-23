/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MODULE ĐỊNH TUYẾN LƯU TRỮ DỮ LIỆU NGƯỜI DÙNG & CỘNG ĐỒNG (STORAGE ROUTES)
 * - Cô lập dữ liệu cá nhân (Nhân vật, Bộ phối đồ, Đơn hàng) theo phiên xác thực
 * - Ngăn chặn truy cập chéo hoặc xóa dữ liệu của người dùng khác
 */

import { Router, type Request, type Response } from "express";
import db, {
  type CharacterRecord,
  type MemoryRecord,
  type OrderRecord,
  type OutfitRecord,
} from "../db.ts";
import { sanitizeString, sanitizeErrorMessage } from "../security.ts";
import { getAuthenticatedUser } from "./authRoutes.ts";

export const storageRouter = Router();

// 1. Kiểm tra sức khỏe hệ thống
storageRouter.get("/health", (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.API_KEY || process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    geminiConfigured: hasKey,
    models: ["gemini-3.8-flash", "gemini-3.1-flash-lite"],
    database: "ready",
    dbEngine: db.getEngineInfo(),
    securityAudit: "passed",
  });
});

// 1B. Đồng bộ toàn bộ dữ liệu cá nhân trong 1 request (Character + Outfits + Orders)
storageRouter.get("/sync", (req: Request, res: Response) => {
  try {
    const { user, role } = getAuthenticatedUser(req);
    if (!user) {
      const guestChar = db.getCharacter("default");
      res.json({
        ok: true,
        authenticated: false,
        character: guestChar,
        outfits: [],
        orders: [],
        serverTime: new Date().toISOString(),
      });
      return;
    }

    const character = db.getCharacter(`user-${user.id}`, user.id);
    const outfits = db.getAllOutfits(user.id);
    const orders = db.getAllOrders(user.id);

    res.json({
      ok: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role || user.role || "member",
        avatar: user.avatar,
      },
      character,
      outfits,
      orders,
      serverTime: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

storageRouter.post("/sync", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({
        ok: false,
        error: "Vui lòng đăng nhập để đồng bộ dữ liệu lên máy chủ.",
      });
      return;
    }

    const body = req.body || {};
    const nowIso = new Date().toISOString();

    if (body.character && typeof body.character === "object") {
      const c = body.character as Record<string, unknown>;
      const charRecord: CharacterRecord = {
        id: `user-${user.id}`,
        user_id: user.id,
        name: sanitizeString(c.name) || user.name || "Người mẫu Việt Phục",
        gioi: c.gioi === "nam" ? "nam" : "nu",
        tuoi:
          c.tuoi === "tre_em"
            ? "tre_em"
            : c.tuoi === "nguoi_cao_tuoi"
            ? "nguoi_cao_tuoi"
            : "nguoi_lon",
        vocDang: sanitizeString(c.vocDang).slice(0, 48) || "dong_ho_cat",
        tongDa:
          typeof c.tongDa === "number"
            ? Math.max(1, Math.min(6, Math.round(c.tongDa)))
            : 2,
        toc: sanitizeString(c.toc).slice(0, 48) || "bui_thap",
        huongNhin: c.huongNhin === "sau" ? "sau" : "truoc",
        updated_at: nowIso,
      };
      db.saveCharacter(charRecord);
    }

    if (Array.isArray(body.outfits)) {
      const limitedOutfits = body.outfits.slice(0, 12);
      for (const raw of limitedOutfits) {
        if (!raw || typeof raw !== "object") continue;
        const o = raw as Record<string, unknown>;
        const tpId = sanitizeString(o.trang_phuc_id || o.trangPhucId).slice(0, 64);
        const id = sanitizeString(o.id).slice(0, 64);
        if (!tpId || !id) continue;

        const record: OutfitRecord = {
          id,
          user_id: user.id,
          title:
            sanitizeString(o.title || o.caption).slice(0, 140) ||
            "Bộ phối đồ Việt phục",
          trang_phuc_id: tpId,
          mau_hex: sanitizeString(o.mau_hex || o.mauId).slice(0, 24) || "#B45309",
          phu_kien_ids: Array.isArray(o.phu_kien_ids || o.phuKienIds)
            ? ((o.phu_kien_ids || o.phuKienIds) as unknown[])
                .slice(0, 10)
                .map((pk) => sanitizeString(pk).slice(0, 64))
            : [],
          nhan_vat_config:
            typeof (o.nhan_vat_config || o.nhanVatConfig) === "object" &&
            (o.nhan_vat_config || o.nhanVatConfig) !== null
              ? ((o.nhan_vat_config || o.nhanVatConfig) as Record<string, unknown>)
              : {},
          notes: sanitizeString(o.notes || o.cauLyDoRemix).slice(0, 500),
          created_at:
            typeof o.created_at === "string" && o.created_at
              ? sanitizeString(o.created_at).slice(0, 64)
              : typeof o.taoLuc === "number"
              ? new Date(o.taoLuc).toISOString()
              : nowIso,
        };
        db.saveOutfit(record);
      }
    }

    res.json({
      ok: true,
      authenticated: true,
      character: db.getCharacter(`user-${user.id}`, user.id),
      outfits: db.getAllOutfits(user.id),
      serverTime: nowIso,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 2. Lưu trữ cấu hình Nhân vật (Cô lập theo User ID)
storageRouter.get("/character", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const charId = user ? `user-${user.id}` : "default";
    const character = db.getCharacter(charId, user?.id);
    res.json({ ok: true, data: character });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

storageRouter.post("/character", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const body = req.body || {};
    const charId = user ? `user-${user.id}` : "default";

    const record: CharacterRecord = {
      id: charId,
      user_id: user?.id,
      name: sanitizeString(body.name) || "Người mẫu Việt Phục",
      gioi: body.gioi === "nam" ? "nam" : "nu",
      tuoi:
        body.tuoi === "tre_em"
          ? "tre_em"
          : body.tuoi === "nguoi_cao_tuoi"
          ? "nguoi_cao_tuoi"
          : "nguoi_lon",
      vocDang: sanitizeString(body.vocDang) || "dong_ho_cat",
      tongDa: typeof body.tongDa === "number" ? Math.max(1, Math.min(6, body.tongDa)) : 2,
      toc: sanitizeString(body.toc) || "bui_thap",
      huongNhin: body.huongNhin === "sau" ? "sau" : "truoc",
      updated_at: new Date().toISOString(),
    };

    db.saveCharacter(record);
    res.json({ ok: true, data: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 3. Bộ phối đồ cá nhân (Chỉ trả về và xóa bộ đồ thuộc sở hữu của người dùng đang đăng nhập)
storageRouter.get("/outfits", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    if (!user) {
      res.json({ ok: true, data: [] });
      return;
    }
    const outfits = db.getAllOutfits(user.id);
    res.json({ ok: true, data: outfits });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

storageRouter.post("/outfits", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({
        ok: false,
        error: "Vui lòng đăng nhập để đồng bộ bộ phối đồ lên máy chủ.",
      });
      return;
    }

    const body = req.body || {};
    if (!body.title || !body.trang_phuc_id) {
      res.status(400).json({ ok: false, error: "Thiếu tiêu đề hoặc mã trang phục" });
      return;
    }

    const record: OutfitRecord = {
      id: sanitizeString(body.id) || `outfit-${Date.now()}`,
      user_id: user.id,
      title: sanitizeString(body.title).slice(0, 120),
      trang_phuc_id: sanitizeString(body.trang_phuc_id).slice(0, 64),
      mau_hex: sanitizeString(body.mau_hex).slice(0, 16) || "#B45309",
      phu_kien_ids: Array.isArray(body.phu_kien_ids)
        ? body.phu_kien_ids.slice(0, 10).map((id: unknown) => sanitizeString(id).slice(0, 64))
        : [],
      nhan_vat_config:
        typeof body.nhan_vat_config === "object" && body.nhan_vat_config !== null
          ? (body.nhan_vat_config as Record<string, unknown>)
          : {},
      notes: sanitizeString(body.notes).slice(0, 500),
      created_at: new Date().toISOString(),
    };

    db.saveOutfit(record);
    res.json({ ok: true, data: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

storageRouter.delete("/outfits/:id", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({ ok: false, error: "Yêu cầu xác thực để xóa bộ phối đồ." });
      return;
    }
    const id = sanitizeString(req.params.id);
    const success = db.deleteOutfit(id, user.id);
    if (!success) {
      res.status(403).json({
        ok: false,
        error: "Không tìm thấy bộ phối đồ hoặc bạn không có quyền xóa.",
      });
      return;
    }
    res.json({ ok: true, deleted: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 4. Ký ức Việt Phục cộng đồng (Giới hạn độ dài chống tấn công làm đầy bộ nhớ)
storageRouter.get("/memories", (_req: Request, res: Response) => {
  try {
    const memories = db.getAllMemories();
    res.json({ ok: true, data: memories });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

storageRouter.post("/memories", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const body = req.body || {};
    const cleanContent = sanitizeString(body.content).slice(0, 1000);
    if (!cleanContent) {
      res.status(400).json({ ok: false, error: "Nội dung ký ức không được để trống" });
      return;
    }

    const sender = user
      ? user.name
      : sanitizeString(body.sender_name).slice(0, 80) || "Đồng điệu vô danh";

    const record: MemoryRecord = {
      id: sanitizeString(body.id).slice(0, 64) || `mem-${Date.now()}`,
      user_id: user?.id,
      sender_name: sender,
      content: cleanContent,
      trang_phuc_name:
        sanitizeString(body.trang_phuc_name).slice(0, 120) || "Việt phục truyền thống",
      era: sanitizeString(body.era).slice(0, 80) || "Di sản nghìn năm",
      created_at: new Date().toISOString(),
    };

    db.saveMemory(record);
    res.json({ ok: true, data: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// 5. Đơn hàng Chợ Phiên (Cô lập nghiêm ngặt theo tài khoản)
storageRouter.get("/orders", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    if (!user) {
      res.json({ ok: true, data: [] });
      return;
    }
    const orders = db.getAllOrders(user.id);
    res.json({ ok: true, data: orders });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

storageRouter.post("/orders", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const body = req.body || {};
    if (!body.item_id || !body.item_name) {
      res.status(400).json({ ok: false, error: "Thiếu thông tin vật phẩm cần đặt may" });
      return;
    }

    const record: OrderRecord = {
      id: sanitizeString(body.id).slice(0, 64) || `ord-${Date.now()}`,
      user_id: user?.id,
      item_id: sanitizeString(body.item_id).slice(0, 64),
      item_name: sanitizeString(body.item_name).slice(0, 120),
      size: sanitizeString(body.size).slice(0, 16) || "M",
      quantity:
        typeof body.quantity === "number" && body.quantity > 0
          ? Math.min(body.quantity, 10)
          : 1,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    db.saveOrder(record);
    res.json({ ok: true, data: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});
