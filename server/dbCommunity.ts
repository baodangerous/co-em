/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CƠ SỞ DỮ LIỆU CỘNG ĐỒNG & QUẢN TRỊ (COMMUNITY & ADMIN DB)
 * - Lưu trữ thực tế trên SQLite: bài đăng Chợ Phiên, đơn đặt may làng nghề, đăng ký workshop, cấu hình & danh mục quản trị
 * - Cô lập PII (SĐT, Email) chỉ trả về đầy đủ cho Admin/Moderator
 */

import db from "./db.ts";

export interface VillageOrderRow {
  id: string;
  user_id?: string;
  village_id: string;
  village_name: string;
  costume_name: string;
  customer_name: string;
  customer_phone: string;
  note: string;
  status: "new" | "contacted" | "completed";
  created_at: string;
}

export interface WorkshopRegRow {
  id: string;
  user_id?: string;
  workshop_id: string;
  workshop_title: string;
  workshop_date: string;
  workshop_time: string;
  workshop_location: string;
  full_name: string;
  phone: string;
  email: string;
  attendee_count: number;
  motivation_note: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface CommunityPostRow {
  id: string;
  user_id?: string;
  nguoi_dang: string;
  nhom_id: string;
  trang_phuc_id: string;
  mau_id: string;
  phu_kien_ids: string[];
  dip: string;
  vung: string;
  nhan: "chuan" | "sang_tao" | "can_xem_lai";
  caption: string;
  nhan_vat_config: Record<string, unknown>;
  binh_chon: { hop_dip: number; phoi_mau: number; ton_trong_vung_mien: number };
  trang_thai_duyet: "approved" | "pending" | "hidden";
  tao_luc: string;
}

const COMMUNITY_DDL = `
  CREATE TABLE IF NOT EXISTS village_orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    village_id TEXT,
    village_name TEXT,
    costume_name TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    note TEXT,
    status TEXT DEFAULT 'new',
    created_at TEXT
  );
  CREATE TABLE IF NOT EXISTS workshop_registrations (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    workshop_id TEXT,
    workshop_title TEXT,
    workshop_date TEXT,
    workshop_time TEXT,
    workshop_location TEXT,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    attendee_count INTEGER DEFAULT 1,
    motivation_note TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at TEXT
  );
  CREATE TABLE IF NOT EXISTS community_posts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    nguoi_dang TEXT,
    nhom_id TEXT,
    trang_phuc_id TEXT,
    mau_id TEXT,
    phu_kien_ids TEXT,
    dip TEXT,
    vung TEXT,
    nhan TEXT,
    caption TEXT,
    nhan_vat_config TEXT,
    binh_chon TEXT,
    trang_thai_duyet TEXT DEFAULT 'approved',
    tao_luc TEXT
  );
  CREATE TABLE IF NOT EXISTS admin_kv (
    kv_key TEXT PRIMARY KEY,
    kv_value TEXT,
    updated_at TEXT
  );
`;

class CommunityDbManager {
  private initialized = false;
  private memKv = new Map<string, unknown>();
  private memOrders: VillageOrderRow[] = [];
  private memRegs: WorkshopRegRow[] = [];
  private memPosts: CommunityPostRow[] = [];

  private ensureInit() {
    if (this.initialized) return;
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      sqlite.exec(COMMUNITY_DDL);
    }
    this.initialized = true;
  }

  public getKv<T>(key: string, fallback: T): T {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      const row = sqlite.prepare(`SELECT kv_value FROM admin_kv WHERE kv_key = ?`).get(key) as
        | { kv_value: string }
        | undefined;
      if (row?.kv_value) {
        try {
          return JSON.parse(row.kv_value) as T;
        } catch {
          return fallback;
        }
      }
      return fallback;
    }
    return (this.memKv.get(key) as T) ?? fallback;
  }

  public setKv(key: string, value: unknown): void {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      sqlite
        .prepare(
          `INSERT INTO admin_kv (kv_key, kv_value, updated_at) VALUES (?, ?, ?)
           ON CONFLICT(kv_key) DO UPDATE SET kv_value=excluded.kv_value, updated_at=excluded.updated_at`
        )
        .run(key, JSON.stringify(value), new Date().toISOString());
      return;
    }
    this.memKv.set(key, value);
  }

  public addVillageOrder(row: VillageOrderRow): void {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      sqlite
        .prepare(
          `INSERT INTO village_orders (id, user_id, village_id, village_name, costume_name, customer_name, customer_phone, note, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          row.id,
          row.user_id || "",
          row.village_id,
          row.village_name,
          row.costume_name,
          row.customer_name,
          row.customer_phone,
          row.note,
          row.status,
          row.created_at
        );
      return;
    }
    this.memOrders.unshift(row);
  }

  public listVillageOrders(): VillageOrderRow[] {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      return sqlite
        .prepare(`SELECT * FROM village_orders ORDER BY created_at DESC LIMIT 200`)
        .all() as VillageOrderRow[];
    }
    return this.memOrders.slice(0, 200);
  }

  public updateVillageOrderStatus(id: string, status: VillageOrderRow["status"]): boolean {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      const info = sqlite
        .prepare(`UPDATE village_orders SET status = ? WHERE id = ?`)
        .run(status, id);
      return (info?.changes || 0) > 0;
    }
    const target = this.memOrders.find((o) => o.id === id);
    if (!target) return false;
    target.status = status;
    return true;
  }

  public addWorkshopRegistration(row: WorkshopRegRow): void {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      sqlite
        .prepare(
          `INSERT INTO workshop_registrations (id, user_id, workshop_id, workshop_title, workshop_date, workshop_time, workshop_location, full_name, phone, email, attendee_count, motivation_note, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          row.id,
          row.user_id || "",
          row.workshop_id,
          row.workshop_title,
          row.workshop_date,
          row.workshop_time,
          row.workshop_location,
          row.full_name,
          row.phone,
          row.email,
          row.attendee_count,
          row.motivation_note,
          row.status,
          row.created_at
        );
      return;
    }
    this.memRegs.unshift(row);
  }

  public listWorkshopRegistrations(): WorkshopRegRow[] {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      return sqlite
        .prepare(`SELECT * FROM workshop_registrations ORDER BY created_at DESC LIMIT 200`)
        .all() as WorkshopRegRow[];
    }
    return this.memRegs.slice(0, 200);
  }

  public updateWorkshopRegistrationStatus(id: string, status: WorkshopRegRow["status"]): boolean {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      const info = sqlite
        .prepare(`UPDATE workshop_registrations SET status = ? WHERE id = ?`)
        .run(status, id);
      return (info?.changes || 0) > 0;
    }
    const target = this.memRegs.find((r) => r.id === id);
    if (!target) return false;
    target.status = status;
    return true;
  }

  public listCommunityPosts(includeAll = false): CommunityPostRow[] {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      const sql = includeAll
        ? `SELECT * FROM community_posts ORDER BY tao_luc DESC LIMIT 100`
        : `SELECT * FROM community_posts WHERE trang_thai_duyet = 'approved' ORDER BY tao_luc DESC LIMIT 100`;
      const rows = sqlite.prepare(sql).all() as any[];
      return rows.map((r) => ({
        ...r,
        phu_kien_ids: JSON.parse(r.phu_kien_ids || "[]"),
        nhan_vat_config: JSON.parse(r.nhan_vat_config || "{}"),
        binh_chon: JSON.parse(r.binh_chon || '{"hop_dip":0,"phoi_mau":0,"ton_trong_vung_mien":0}'),
      }));
    }
    return (includeAll
      ? this.memPosts
      : this.memPosts.filter((p) => p.trang_thai_duyet === "approved")
    ).slice(0, 100);
  }

  public saveCommunityPost(post: CommunityPostRow): void {
    this.ensureInit();
    const sqlite = db.getRawSqlite();
    if (sqlite) {
      sqlite
        .prepare(
          `INSERT INTO community_posts (id, user_id, nguoi_dang, nhom_id, trang_phuc_id, mau_id, phu_kien_ids, dip, vung, nhan, caption, nhan_vat_config, binh_chon, trang_thai_duyet, tao_luc)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET binh_chon=excluded.binh_chon, trang_thai_duyet=excluded.trang_thai_duyet, nhan=excluded.nhan`
        )
        .run(
          post.id,
          post.user_id || "",
          post.nguoi_dang,
          post.nhom_id,
          post.trang_phuc_id,
          post.mau_id,
          JSON.stringify(post.phu_kien_ids),
          post.dip,
          post.vung,
          post.nhan,
          post.caption,
          JSON.stringify(post.nhan_vat_config),
          JSON.stringify(post.binh_chon),
          post.trang_thai_duyet,
          post.tao_luc
        );
      return;
    }
    const idx = this.memPosts.findIndex((p) => p.id === post.id);
    if (idx >= 0) this.memPosts[idx] = post;
    else this.memPosts.unshift(post);
  }

  public getCommunityPostById(id: string): CommunityPostRow | null {
    return this.listCommunityPosts(true).find((p) => p.id === id) || null;
  }
}

export const communityDb = new CommunityDbManager();

