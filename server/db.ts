/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HỆ THỐNG CƠ SỞ DỮ LIỆU ĐỒNG BỘ & CÔ LẬP DỮ LIỆU NGƯỜI DÙNG (DATABASE SYSTEM)
 * - Khởi tạo SQLite đồng bộ (WAL mode) hiệu năng cao, không đọc/ghi JSON toàn cục lặp lại mỗi request
 * - Tự động dọn dẹp OTP/Session hết hạn và giới hạn kích thước AI cache
 * - Cô lập nghiêm ngặt dữ liệu cá nhân (Outfits, Orders, Characters) theo userId
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";
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
const require = createRequire(import.meta.url);

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class DatabaseManager {
  private dbFile = path.join(DATA_DIR, "coem_heritage.db");
  private jsonBackupFile = path.join(DATA_DIR, "coem_heritage.json");
  private sqliteDb: any = null;
  private isSqliteActive = false;
  private memStore: JsonStoreShape | null = null;
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      const { DatabaseSync } = require("node:sqlite");
      this.sqliteDb = new DatabaseSync(this.dbFile);
      this.sqliteDb.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA temp_store = MEMORY;");
      this.sqliteDb.exec(SQLITE_SCHEMA_DDL);

      for (const migration of [
        "ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'member';",
        "ALTER TABLE sessions ADD COLUMN role TEXT DEFAULT 'member';",
        "ALTER TABLE characters ADD COLUMN user_id TEXT;",
        "ALTER TABLE outfits ADD COLUMN user_id TEXT;",
        "ALTER TABLE memories ADD COLUMN user_id TEXT;",
        "ALTER TABLE orders ADD COLUMN user_id TEXT;",
      ]) {
        try {
          this.sqliteDb.exec(migration);
        } catch {
          // Column already exists
        }
      }

      this.isSqliteActive = true;
      this.seedInitialData();
      this.pruneExpiredRecords();

      const timer = setInterval(() => this.pruneExpiredRecords(), 10 * 60 * 1000);
      timer.unref?.();
    } catch {
      this.fallbackToJson();
    }
  }

  private fallbackToJson() {
    this.isSqliteActive = false;
    this.memStore = this.loadJsonFromDisk();
    if (!fs.existsSync(this.jsonBackupFile)) {
      this.flushJsonSync();
    }
    this.seedInitialData();
    this.pruneExpiredRecords();
  }

  private loadJsonFromDisk(): JsonStoreShape {
    try {
      if (!fs.existsSync(this.jsonBackupFile)) return createEmptyJsonStore();
      const parsed = JSON.parse(fs.readFileSync(this.jsonBackupFile, "utf-8"));
      return { ...createEmptyJsonStore(), ...parsed };
    } catch {
      return createEmptyJsonStore();
    }
  }

  private getMemStore(): JsonStoreShape {
    if (!this.memStore) {
      this.memStore = this.loadJsonFromDisk();
    }
    return this.memStore;
  }

  private flushJsonSync(): void {
    if (!this.memStore) return;
    const tempFile = `${this.jsonBackupFile}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(this.memStore), "utf-8");
    fs.renameSync(tempFile, this.jsonBackupFile);
  }

  private scheduleJsonFlush(): void {
    if (this.isSqliteActive) return;
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      if (!this.memStore) return;
      const payload = JSON.stringify(this.memStore);
      const tempFile = `${this.jsonBackupFile}.tmp`;
      fs.promises
        .writeFile(tempFile, payload, "utf-8")
        .then(() => fs.promises.rename(tempFile, this.jsonBackupFile))
        .catch(() => {});
    }, 250);
    this.flushTimer.unref?.();
  }

  private seedInitialData() {
    for (const mem of INITIAL_MEMORIES_SEED) {
      if (!this.getMemoryById(mem.id)) {
        this.saveMemory(mem);
      }
    }
  }

  public pruneExpiredRecords(): void {
    const now = Date.now();
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        this.sqliteDb.prepare(`DELETE FROM otp_codes WHERE expires_at < ?`).run(now);
        this.sqliteDb.prepare(`DELETE FROM sessions WHERE expires_at < ?`).run(now);
      } catch {
        // Ignore cleanup errors
      }
      return;
    }

    const json = this.getMemStore();
    let changed = false;
    const beforeOtp = json.otp_codes.length;
    json.otp_codes = json.otp_codes.filter((o) => o.expires_at >= now);
    if (json.otp_codes.length !== beforeOtp) changed = true;

    for (const [token, sess] of Object.entries(json.sessions)) {
      if (sess.expires_at < now) {
        delete json.sessions[token];
        changed = true;
      }
    }
    if (changed) this.scheduleJsonFlush();
  }

  public getEngineInfo(): "sqlite" | "json" {
    return this.isSqliteActive ? "sqlite" : "json";
  }

  public getRawSqlite(): any {
    return this.isSqliteActive ? this.sqliteDb : null;
  }

  public listAllUsers(): UserRecord[] {
    if (this.isSqliteActive && this.sqliteDb) {
      return this.sqliteDb
        .prepare(`SELECT id, email, name, role, avatar, created_at, last_login FROM users ORDER BY last_login DESC LIMIT 200`)
        .all() as UserRecord[];
    }
    return Object.values(this.getMemStore().users);
  }

  // 1. USERS & OTP & SESSIONS
  public saveUser(user: UserRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO users (id, email, name, role, avatar, created_at, last_login)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET email=excluded.email, name=excluded.name, role=excluded.role, avatar=excluded.avatar, last_login=excluded.last_login`
        )
        .run(
          user.id,
          user.email,
          user.name,
          user.role || "member",
          user.avatar || "",
          user.created_at,
          user.last_login
        );
      return;
    }
    const json = this.getMemStore();
    json.users[user.id] = user;
    this.scheduleJsonFlush();
  }

  public getUserByEmail(email: string): UserRecord | null {
    const norm = email.toLowerCase().trim();
    if (this.isSqliteActive && this.sqliteDb) {
      const row = this.sqliteDb.prepare(`SELECT * FROM users WHERE LOWER(email) = ?`).get(norm);
      return (row as UserRecord) || null;
    }
    const json = this.getMemStore();
    return Object.values(json.users).find((u) => u.email.toLowerCase().trim() === norm) || null;
  }

  public getUserById(id: string): UserRecord | null {
    if (this.isSqliteActive && this.sqliteDb) {
      const row = this.sqliteDb.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
      return (row as UserRecord) || null;
    }
    return this.getMemStore().users[id] || null;
  }

  public saveOtp(otp: OtpRecord): void {
    const normEmail = otp.email.toLowerCase().trim();
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb.prepare(`DELETE FROM otp_codes WHERE LOWER(email) = ?`).run(normEmail);
      this.sqliteDb
        .prepare(
          `INSERT INTO otp_codes (id, email, code, expires_at, attempts, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(otp.id, normEmail, otp.code, otp.expires_at, otp.attempts, otp.created_at);
      return;
    }
    const json = this.getMemStore();
    json.otp_codes = json.otp_codes.filter((o) => o.email.toLowerCase() !== normEmail);
    json.otp_codes.push(otp);
    this.scheduleJsonFlush();
  }

  public getLatestOtp(email: string): OtpRecord | null {
    const norm = email.toLowerCase().trim();
    if (this.isSqliteActive && this.sqliteDb) {
      const row = this.sqliteDb
        .prepare(`SELECT * FROM otp_codes WHERE LOWER(email) = ? ORDER BY expires_at DESC LIMIT 1`)
        .get(norm);
      return (row as OtpRecord) || null;
    }
    const list = this.getMemStore().otp_codes.filter((o) => o.email.toLowerCase() === norm);
    return list.sort((a, b) => b.expires_at - a.expires_at)[0] || null;
  }

  public incrementOtpAttempts(id: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb.prepare(`UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?`).run(id);
      return;
    }
    const json = this.getMemStore();
    const target = json.otp_codes.find((o) => o.id === id);
    if (target) {
      target.attempts = (target.attempts || 0) + 1;
      this.scheduleJsonFlush();
    }
  }

  public deleteOtp(id: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb.prepare(`DELETE FROM otp_codes WHERE id = ?`).run(id);
      return;
    }
    const json = this.getMemStore();
    json.otp_codes = json.otp_codes.filter((o) => o.id !== id);
    this.scheduleJsonFlush();
  }

  public saveSession(session: SessionRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO sessions (token, user_id, email, role, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(token) DO UPDATE SET expires_at=excluded.expires_at, role=excluded.role`
        )
        .run(
          session.token,
          session.user_id,
          session.email,
          session.role || "member",
          session.expires_at,
          session.created_at
        );
      return;
    }
    const json = this.getMemStore();
    json.sessions[session.token] = session;
    this.scheduleJsonFlush();
  }

  public getSession(token: string): SessionRecord | null {
    if (!token) return null;
    if (this.isSqliteActive && this.sqliteDb) {
      const row = this.sqliteDb.prepare(`SELECT * FROM sessions WHERE token = ?`).get(token) as
        | SessionRecord
        | undefined;
      if (!row) return null;
      if (row.expires_at < Date.now()) {
        this.deleteSession(token);
        return null;
      }
      return row;
    }

    const json = this.getMemStore();
    const jsonSession = json.sessions[token];
    if (!jsonSession) return null;
    if (jsonSession.expires_at < Date.now()) {
      this.deleteSession(token);
      return null;
    }
    return jsonSession;
  }

  public deleteSession(token: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
      return;
    }
    const json = this.getMemStore();
    delete json.sessions[token];
    this.scheduleJsonFlush();
  }

  // 2. CHARACTERS (Cô lập theo chủ sở hữu)
  public saveCharacter(record: CharacterRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO characters (id, user_id, name, gioi, tuoi, vocDang, tongDa, toc, huongNhin, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET user_id=excluded.user_id, name=excluded.name, gioi=excluded.gioi, tuoi=excluded.tuoi, vocDang=excluded.vocDang, tongDa=excluded.tongDa, toc=excluded.toc, huongNhin=excluded.huongNhin, updated_at=excluded.updated_at
           WHERE characters.user_id = excluded.user_id OR characters.user_id = '' OR characters.user_id IS NULL`
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
      return;
    }
    const json = this.getMemStore();
    const existing = json.characters[record.id];
    if (existing && existing.user_id && existing.user_id !== record.user_id) return;
    json.characters[record.id] = record;
    this.scheduleJsonFlush();
  }

  public getCharacter(id = "default", requestUserId?: string): CharacterRecord | null {
    if (this.isSqliteActive && this.sqliteDb) {
      const row = this.sqliteDb.prepare(`SELECT * FROM characters WHERE id = ?`).get(id) as
        | CharacterRecord
        | undefined;
      if (!row) return null;
      if (row.user_id && row.user_id !== requestUserId) return null;
      return row;
    }
    const record = this.getMemStore().characters[id];
    if (!record) return null;
    if (record.user_id && record.user_id !== requestUserId) return null;
    return record;
  }

  // 3. OUTFITS (Cô lập dữ liệu cá nhân theo userId)
  public saveOutfit(record: OutfitRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO outfits (id, user_id, title, trang_phuc_id, mau_hex, phu_kien_ids, nhan_vat_config, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET title=excluded.title, trang_phuc_id=excluded.trang_phuc_id, mau_hex=excluded.mau_hex, phu_kien_ids=excluded.phu_kien_ids, nhan_vat_config=excluded.nhan_vat_config, notes=excluded.notes
           WHERE outfits.user_id = excluded.user_id OR outfits.user_id = '' OR outfits.user_id IS NULL`
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
      return;
    }
    const json = this.getMemStore();
    const idx = json.outfits.findIndex((o) => o.id === record.id);
    if (idx >= 0) {
      const existing = json.outfits[idx];
      if (existing.user_id && existing.user_id !== record.user_id) return;
      json.outfits[idx] = record;
    } else {
      json.outfits.unshift(record);
    }
    this.scheduleJsonFlush();
  }

  public getAllOutfits(userId?: string): OutfitRecord[] {
    if (!userId) return [];
    if (this.isSqliteActive && this.sqliteDb) {
      const rows = this.sqliteDb
        .prepare(`SELECT * FROM outfits WHERE user_id = ? ORDER BY created_at DESC`)
        .all(userId);
      return rows.map((r: any) => ({
        ...r,
        phu_kien_ids: JSON.parse(r.phu_kien_ids || "[]"),
        nhan_vat_config: JSON.parse(r.nhan_vat_config || "{}"),
      }));
    }
    return this.getMemStore().outfits.filter((o) => o.user_id === userId);
  }

  public deleteOutfit(id: string, userId?: string): boolean {
    if (!userId) return false;
    if (this.isSqliteActive && this.sqliteDb) {
      const info = this.sqliteDb
        .prepare(`DELETE FROM outfits WHERE id = ? AND user_id = ?`)
        .run(id, userId);
      return (info?.changes || 0) > 0;
    }
    const json = this.getMemStore();
    const target = json.outfits.find((o) => o.id === id);
    if (!target || target.user_id !== userId) return false;
    json.outfits = json.outfits.filter((o) => o.id !== id);
    this.scheduleJsonFlush();
    return true;
  }

  // 4. MEMORIES (Cộng đồng công khai)
  public saveMemory(record: MemoryRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      this.sqliteDb
        .prepare(
          `INSERT INTO memories (id, user_id, sender_name, content, trang_phuc_name, era, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET content=excluded.content, trang_phuc_name=excluded.trang_phuc_name, era=excluded.era
           WHERE memories.user_id = excluded.user_id AND excluded.user_id != ''`
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
      return;
    }
    const json = this.getMemStore();
    const idx = json.memories.findIndex((m) => m.id === record.id);
    if (idx >= 0) json.memories[idx] = record;
    else json.memories.unshift(record);
    this.scheduleJsonFlush();
  }

  public getAllMemories(): MemoryRecord[] {
    if (this.isSqliteActive && this.sqliteDb) {
      return this.sqliteDb
        .prepare(`SELECT * FROM memories ORDER BY created_at DESC LIMIT 100`)
        .all() as MemoryRecord[];
    }
    return this.getMemStore().memories.slice(0, 100);
  }

  public getMemoryById(id: string): MemoryRecord | null {
    if (this.isSqliteActive && this.sqliteDb) {
      const row = this.sqliteDb.prepare(`SELECT * FROM memories WHERE id = ?`).get(id);
      return (row as MemoryRecord) || null;
    }
    return this.getMemStore().memories.find((m) => m.id === id) || null;
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
      return;
    }
    const json = this.getMemStore();
    json.orders.unshift(record);
    this.scheduleJsonFlush();
  }

  public getAllOrders(userId?: string): OrderRecord[] {
    if (!userId) return [];
    if (this.isSqliteActive && this.sqliteDb) {
      return this.sqliteDb
        .prepare(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`)
        .all(userId) as OrderRecord[];
    }
    return this.getMemStore().orders.filter((o) => o.user_id === userId);
  }

  // 6. AI CACHE (Giới hạn tối đa 400 mục)
  public getAiCache(key: string): unknown | null {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const row = this.sqliteDb
          .prepare(`SELECT response_data FROM ai_cache WHERE cache_key = ?`)
          .get(key) as { response_data: string } | undefined;
        if (row?.response_data) return JSON.parse(row.response_data);
      } catch {
        return null;
      }
      return null;
    }
    return this.getMemStore().ai_cache[key] || null;
  }

  public setAiCache(key: string, data: unknown): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        this.sqliteDb
          .prepare(
            `INSERT INTO ai_cache (cache_key, response_data, created_at)
             VALUES (?, ?, ?)
             ON CONFLICT(cache_key) DO UPDATE SET response_data=excluded.response_data, created_at=excluded.created_at`
          )
          .run(key, JSON.stringify(data), new Date().toISOString());

        const countRow = this.sqliteDb
          .prepare(`SELECT COUNT(*) as total FROM ai_cache`)
          .get() as { total: number };
        if (countRow && countRow.total > 400) {
          this.sqliteDb
            .prepare(
              `DELETE FROM ai_cache WHERE cache_key IN (SELECT cache_key FROM ai_cache ORDER BY created_at ASC LIMIT 50)`
            )
            .run();
        }
      } catch {
        // Ignore cache write errors
      }
      return;
    }
    const json = this.getMemStore();
    json.ai_cache[key] = data;
    const keys = Object.keys(json.ai_cache);
    if (keys.length > 400) {
      delete json.ai_cache[keys[0]];
    }
    this.scheduleJsonFlush();
  }
}

export const db = new DatabaseManager();
export default db;
