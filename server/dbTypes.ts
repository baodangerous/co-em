/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * KIỂU DỮ LIỆU & DỮ LIỆU KHỞI TẠO CƠ SỞ DỮ LIỆU MÁY CHỦ (DB TYPES & SEEDS)
 */

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role?: "admin" | "moderator" | "artisan" | "member";
  avatar?: string;
  created_at: string;
  last_login: string;
}

export interface OtpRecord {
  id: string;
  email: string;
  code: string;
  expires_at: number; // timestamp ms
  attempts: number;
  created_at: string;
}

export interface SessionRecord {
  token: string;
  user_id: string;
  email: string;
  role?: "admin" | "moderator" | "artisan" | "member";
  expires_at: number; // timestamp ms
  created_at: string;
}

export interface CharacterRecord {
  id: string;
  user_id?: string;
  name: string;
  gioi: "nu" | "nam";
  tuoi: "nguoi_lon" | "tre_em" | "nguoi_cao_tuoi";
  vocDang: string;
  tongDa: number;
  toc: string;
  huongNhin: "truoc" | "sau";
  updated_at: string;
}

export interface OutfitRecord {
  id: string;
  user_id?: string;
  title: string;
  trang_phuc_id: string;
  mau_hex: string;
  phu_kien_ids: string[];
  nhan_vat_config: Record<string, unknown>;
  notes?: string;
  created_at: string;
}

export interface MemoryRecord {
  id: string;
  user_id?: string;
  sender_name: string;
  content: string;
  trang_phuc_name: string;
  era: string;
  created_at: string;
}

export interface OrderRecord {
  id: string;
  user_id?: string;
  item_id: string;
  item_name: string;
  size: string;
  quantity: number;
  status: "pending" | "confirmed" | "completed";
  created_at: string;
}

export interface JsonStoreShape {
  users: Record<string, UserRecord>;
  otp_codes: OtpRecord[];
  sessions: Record<string, SessionRecord>;
  characters: Record<string, CharacterRecord>;
  outfits: OutfitRecord[];
  memories: MemoryRecord[];
  orders: OrderRecord[];
  ai_cache: Record<string, unknown>;
}

export function createEmptyJsonStore(): JsonStoreShape {
  return {
    users: {},
    otp_codes: [],
    sessions: {},
    characters: {},
    outfits: [],
    memories: [],
    orders: [],
    ai_cache: {},
  };
}

export const INITIAL_MEMORIES_SEED: MemoryRecord[] = [
  {
    id: "mem-01",
    sender_name: "Hoàng Oanh",
    content:
      "Bà nội tôi từng mặc Áo Tấc màu thiên thanh trong ngày thành hôn năm 1954 tại đất kinh kỳ Huế.",
    trang_phuc_name: "Áo Tấc Ngũ Thân Tay Thụ",
    era: "Triều Nguyễn",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "mem-02",
    sender_name: "Minh Triết",
    content:
      "Tôi yêu thích nét khoáng đạt của tà Áo Giao Lĩnh thời Hậu Lê với phong cách cổ phong trang nhã.",
    trang_phuc_name: "Áo Giao Lĩnh",
    era: "Thời Lê Trung Hưng",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const SQLITE_SCHEMA_DDL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'member',
    avatar TEXT,
    created_at TEXT,
    last_login TEXT
  );
  CREATE TABLE IF NOT EXISTS otp_codes (
    id TEXT PRIMARY KEY,
    email TEXT,
    code TEXT,
    expires_at INTEGER,
    attempts INTEGER,
    created_at TEXT
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT,
    email TEXT,
    role TEXT DEFAULT 'member',
    expires_at INTEGER,
    created_at TEXT
  );
  CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT,
    gioi TEXT,
    tuoi TEXT,
    vocDang TEXT,
    tongDa INTEGER,
    toc TEXT,
    huongNhin TEXT,
    updated_at TEXT
  );
  CREATE TABLE IF NOT EXISTS outfits (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    trang_phuc_id TEXT,
    mau_hex TEXT,
    phu_kien_ids TEXT,
    nhan_vat_config TEXT,
    notes TEXT,
    created_at TEXT
  );
  CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    sender_name TEXT,
    content TEXT,
    trang_phuc_name TEXT,
    era TEXT,
    created_at TEXT
  );
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    item_id TEXT,
    item_name TEXT,
    size TEXT,
    quantity INTEGER,
    status TEXT,
    created_at TEXT
  );
  CREATE TABLE IF NOT EXISTS ai_cache (
    cache_key TEXT PRIMARY KEY,
    response_data TEXT,
    created_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);
  CREATE INDEX IF NOT EXISTS idx_outfits_user ON outfits(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_characters_user ON characters(user_id);
`;
