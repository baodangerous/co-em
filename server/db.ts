/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỆ THỐNG CƠ SỞ DỮ LIỆU ĐỒNG BỘ & CÔ LẬP DỮ LIỆU NGƯỜI DÙNG (DATABASE SYSTEM)
 * - Cô lập nghiêm ngặt dữ liệu cá nhân (Outfits, Orders, Characters) theo userId
 * - Ngăn chặn truy cập trái phép hoặc rò rỉ dữ liệu giữa các tài khoản
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createEmptyJsonStore,
  INITIAL_MEMORIES_SEED,
  SQLITE_SCHEMA_DDL,
  type CharacterRecord,
  type JsonStoreShape,
  type MemoryRecord,
  type OrderRecord,
  type OtpRecord,
  type OutfitRecord,
  type SessionRecord,
  type UserRecord,
} from "./dbTypes.ts";

export type {
  UserRecord,
  OtpRecord,
  SessionRecord,
  CharacterRecord,
  OutfitRecord,
  MemoryRecord,
  OrderRecord,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data_store");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class DatabaseManager {
  private dbFile = path.join(DATA_DIR, "coem_heritage.db");
  private jsonBackupFile = path.join(DATA_DIR, "coem_heritage.json");
  private sqliteDb: any = null;
  private isSqliteActive = false;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      const sqliteModule = Function("return import('node:sqlite')")();
      sqliteModule
        .then(({ DatabaseSync }: any) => {
          try {
            this.sqliteDb = new DatabaseSync(this.dbFile);
            this.sqliteDb.exec(SQLITE_SCHEMA_DDL);
            for (const table of ["characters", "outfits", "memories", "orders"]) {
              try {
                this.sqliteDb.exec(`ALTER TABLE ${table} ADD COLUMN user_id TEXT;`);
              } catch {
                // Column already exists
              }
            }
            this.isSqliteActive = true;
            this.seedInitialData();
          } catch {
            this.fallbackToJson();
          }
        })
        .catch(() => this.fallbackToJson());
    } catch {
      this.fallbackToJson();
    }
  }

  private fallbackToJson() {
    this.isSqliteActive = false;
    if (!fs.existsSync(this.jsonBackupFile)) {
      fs.writeFileSync(this.jsonBackupFile, JSON.stringify(createEmptyJsonStore(), null, 2), "utf-8");
    }
    this.seedInitialData();
  }

  private seedInitialData() {
    for (const mem of INITIAL_MEMORIES_SEED) {
      if (!this.getMemoryById(mem.id)) {
        this.saveMemory(mem);
      }
    }
  }

  private readJsonStore(): JsonStoreShape {
    try {
      if (!fs.existsSync(this.jsonBackupFile)) return createEmptyJsonStore();
      const parsed = JSON.parse(fs.readFileSync(this.jsonBackupFile, "utf-8"));
      return { ...createEmptyJsonStore(), ...parsed };
    } catch {
      return createEmptyJsonStore();
    }
  }

  private writeJsonStore(data: JsonStoreShape): void {
    const tempFile = `${this.jsonBackupFile}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, this.jsonBackupFile);
  }

  // 1. USERS & OTP & SESSIONS
  public saveUser(user: UserRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO users (id, email, name, avatar, created_at, last_login)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET email=excluded.email, name=excluded.name, avatar=excluded.avatar, last_login=excluded.last_login`
        )
        .run(user.id, user.email, user.name, user.avatar || "", user.created_at, user.last_login);
    }
    const json = this.readJsonStore();
    json.users[user.id] = user;
    this.writeJsonStore(json);
  }

  public getUserByEmail(email: string): UserRecord | null {
    const norm = email.toLowerCase().trim();
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const row = this.sqliteDb.prepare(`SELECT * FROM users WHERE LOWER(email) = ?`).get(norm);
        if (row) return row as UserRecord;
      } catch {
        // Fallback
      }
    }
    const json = this.readJsonStore();
    return Object.values(json.users).find((u) => u.email.toLowerCase().trim() === norm) || null;
  }

  public getUserById(id: string): UserRecord | null {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const row = this.sqliteDb.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
        if (row) return row as UserRecord;
      } catch {
        // Fallback
      }
    }
    return this.readJsonStore().users[id] || null;
  }

  public saveOtp(otp: OtpRecord): void {
    const normEmail = otp.email.toLowerCase().trim();
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO otp_codes (id, email, code, expires_at, attempts, created_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET code=excluded.code, expires_at=excluded.expires_at, attempts=excluded.attempts`
        )
        .run(otp.id, normEmail, otp.code, otp.expires_at, otp.attempts, otp.created_at);
    }
    const json = this.readJsonStore();
    json.otp_codes = json.otp_codes.filter((o) => o.email.toLowerCase() !== normEmail);
    json.otp_codes.push(otp);
    this.writeJsonStore(json);
  }

  public getLatestOtp(email: string): OtpRecord | null {
    const norm = email.toLowerCase().trim();
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const row = this.sqliteDb
          .prepare(`SELECT * FROM otp_codes WHERE LOWER(email) = ? ORDER BY expires_at DESC LIMIT 1`)
          .get(norm);
        if (row) return row as OtpRecord;
      } catch {
        // Fallback
      }
    }
    const list = this.readJsonStore().otp_codes.filter((o) => o.email.toLowerCase() === norm);
    return list.sort((a, b) => b.expires_at - a.expires_at)[0] || null;
  }

  public incrementOtpAttempts(id: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        this.sqliteDb.prepare(`UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?`).run(id);
      } catch {
        // Fallback
      }
    }
    const json = this.readJsonStore();
    const target = json.otp_codes.find((o) => o.id === id);
    if (target) {
      target.attempts = (target.attempts || 0) + 1;
      this.writeJsonStore(json);
    }
  }

  public deleteOtp(id: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        this.sqliteDb.prepare(`DELETE FROM otp_codes WHERE id = ?`).run(id);
      } catch {
        // Fallback
      }
    }
    const json = this.readJsonStore();
    json.otp_codes = json.otp_codes.filter((o) => o.id !== id);
    this.writeJsonStore(json);
  }

  public saveSession(session: SessionRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO sessions (token, user_id, email, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(token) DO UPDATE SET expires_at=excluded.expires_at`
        )
        .run(session.token, session.user_id, session.email, session.expires_at, session.created_at);
    }
    const json = this.readJsonStore();
    json.sessions[session.token] = session;
    this.writeJsonStore(json);
  }

  public getSession(token: string): SessionRecord | null {
    if (!token) return null;
    const json = this.readJsonStore();
    const jsonSession = json.sessions[token];
    if (jsonSession) {
      if (jsonSession.expires_at < Date.now()) {
        this.deleteSession(token);
        return null;
      }
      return jsonSession;
    }
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const row = this.sqliteDb.prepare(`SELECT * FROM sessions WHERE token = ?`).get(token) as
          | SessionRecord
          | undefined;
        if (row) {
          if (row.expires_at < Date.now()) {
            this.deleteSession(token);
            return null;
          }
          return row;
        }
      } catch {
        // Fallback
      }
    }
    return null;
  }

  public deleteSession(token: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        this.sqliteDb.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
      } catch {
        // Fallback
      }
    }
    const json = this.readJsonStore();
    delete json.sessions[token];
    this.writeJsonStore(json);
  }

  // 2. CHARACTERS (Cô lập theo chủ sở hữu)
  public saveCharacter(record: CharacterRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO characters (id, user_id, name, gioi, tuoi, vocDang, tongDa, toc, huongNhin, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET user_id=excluded.user_id, name=excluded.name, gioi=excluded.gioi, tuoi=excluded.tuoi, vocDang=excluded.vocDang, tongDa=excluded.tongDa, toc=excluded.toc, huongNhin=excluded.huongNhin, updated_at=excluded.updated_at`
        )
        .run(
          record.id,
          record.user_id || "",
          record.name,
          record.gioi,
          record.tuoi,
          record.vocDang,
          record.tongDa,
          record.toc,
          record.huongNhin,
          record.updated_at
        );
    }
    const json = this.readJsonStore();
    json.characters[record.id] = record;
    this.writeJsonStore(json);
  }

  public getCharacter(id = "default", requestUserId?: string): CharacterRecord | null {
    const json = this.readJsonStore();
    const record = json.characters[id];
    if (record) {
      if (record.user_id && record.user_id !== requestUserId) return null;
      return record;
    }
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const row = this.sqliteDb.prepare(`SELECT * FROM characters WHERE id = ?`).get(id) as
          | CharacterRecord
          | undefined;
        if (row) {
          if (row.user_id && row.user_id !== requestUserId) return null;
          return row;
        }
      } catch {
        // Fallback
      }
    }
    return null;
  }

  // 3. OUTFITS (Cô lập dữ liệu cá nhân, tuyệt đối không trả về toàn bộ CSDL khi thiếu userId)
  public saveOutfit(record: OutfitRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO outfits (id, user_id, title, trang_phuc_id, mau_hex, phu_kien_ids, nhan_vat_config, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET user_id=excluded.user_id, title=excluded.title, trang_phuc_id=excluded.trang_phuc_id, mau_hex=excluded.mau_hex, phu_kien_ids=excluded.phu_kien_ids, nhan_vat_config=excluded.nhan_vat_config, notes=excluded.notes`
        )
        .run(
          record.id,
          record.user_id || "",
          record.title,
          record.trang_phuc_id,
          record.mau_hex,
          JSON.stringify(record.phu_kien_ids),
          JSON.stringify(record.nhan_vat_config),
          record.notes || "",
          record.created_at
        );
    }
    const json = this.readJsonStore();
    const idx = json.outfits.findIndex((o) => o.id === record.id);
    if (idx >= 0) json.outfits[idx] = record;
    else json.outfits.unshift(record);
    this.writeJsonStore(json);
  }

  public getAllOutfits(userId?: string): OutfitRecord[] {
    if (!userId) return [];
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const rows = this.sqliteDb
          .prepare(`SELECT * FROM outfits WHERE user_id = ? ORDER BY created_at DESC`)
          .all(userId);
        return rows.map((r: any) => ({
          ...r,
          phu_kien_ids: JSON.parse(r.phu_kien_ids || "[]"),
          nhan_vat_config: JSON.parse(r.nhan_vat_config || "{}"),
        }));
      } catch {
        // Fallback
      }
    }
    return this.readJsonStore().outfits.filter((o) => o.user_id === userId);
  }

  public deleteOutfit(id: string, userId?: string): boolean {
    if (!userId) return false;
    const json = this.readJsonStore();
    const target = json.outfits.find((o) => o.id === id);
    if (!target || target.user_id !== userId) return false;

    if (this.isSqliteActive && this.sqliteDb) {
      try {
        this.sqliteDb.prepare(`DELETE FROM outfits WHERE id = ? AND user_id = ?`).run(id, userId);
      } catch {
        // Fallback
      }
    }
    json.outfits = json.outfits.filter((o) => o.id !== id);
    this.writeJsonStore(json);
    return true;
  }

  // 4. MEMORIES (Cộng đồng công khai)
  public saveMemory(record: MemoryRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO memories (id, user_id, sender_name, content, trang_phuc_name, era, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET content=excluded.content, trang_phuc_name=excluded.trang_phuc_name, era=excluded.era`
        )
        .run(
          record.id,
          record.user_id || "",
          record.sender_name,
          record.content,
          record.trang_phuc_name,
          record.era,
          record.created_at
        );
    }
    const json = this.readJsonStore();
    const idx = json.memories.findIndex((m) => m.id === record.id);
    if (idx >= 0) json.memories[idx] = record;
    else json.memories.unshift(record);
    this.writeJsonStore(json);
  }

  public getAllMemories(): MemoryRecord[] {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        return this.sqliteDb
          .prepare(`SELECT * FROM memories ORDER BY created_at DESC LIMIT 100`)
          .all() as MemoryRecord[];
      } catch {
        // Fallback
      }
    }
    return this.readJsonStore().memories.slice(0, 100);
  }

  public getMemoryById(id: string): MemoryRecord | null {
    return this.getAllMemories().find((m) => m.id === id) || null;
  }

  // 5. ORDERS (Cô lập nghiêm ngặt theo userId)
  public saveOrder(record: OrderRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO orders (id, user_id, item_id, item_name, size, quantity, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          record.id,
          record.user_id || "",
          record.item_id,
          record.item_name,
          record.size,
          record.quantity,
          record.status,
          record.created_at
        );
    }
    const json = this.readJsonStore();
    json.orders.unshift(record);
    this.writeJsonStore(json);
  }

  public getAllOrders(userId?: string): OrderRecord[] {
    if (!userId) return [];
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        return this.sqliteDb
          .prepare(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`)
          .all(userId) as OrderRecord[];
      } catch {
        // Fallback
      }
    }
    return this.readJsonStore().orders.filter((o) => o.user_id === userId);
  }

  // 6. AI CACHE
  public getAiCache(key: string): unknown | null {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const row = this.sqliteDb
          .prepare(`SELECT response_data FROM ai_cache WHERE cache_key = ?`)
          .get(key) as { response_data: string } | undefined;
        if (row?.response_data) return JSON.parse(row.response_data);
      } catch {
        // Fallback
      }
    }
    return this.readJsonStore().ai_cache[key] || null;
  }

  public setAiCache(key: string, data: unknown): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        this.sqliteDb
          .prepare(
            `INSERT INTO ai_cache (cache_key, response_data, created_at)
             VALUES (?, ?, ?)
             ON CONFLICT(cache_key) DO UPDATE SET response_data=excluded.response_data`
          )
          .run(key, JSON.stringify(data), new Date().toISOString());
      } catch {
        // Fallback
      }
    }
    const json = this.readJsonStore();
    json.ai_cache[key] = data;
    this.writeJsonStore(json);
  }
}

export const db = new DatabaseManager();
export default db;
