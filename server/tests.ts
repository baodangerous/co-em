/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * BỘ KIỂM THỬ BACKEND TOÀN DIỆN (AUTOMATED BACKEND, AUTH & SECURITY TEST SUITE)
 * Tự khởi chạy Express server trên cổng tạm (ephemeral port) để kiểm thử đầy đủ HTTP endpoints.
 */

import http from "http";
import express from "express";
import db from "./db.ts";
import type { CharacterRecord, OutfitRecord, MemoryRecord, OrderRecord } from "./db.ts";
import { communityDb } from "./dbCommunity.ts";
import {
  redactSecrets,
  sanitizeErrorMessage,
  sanitizeString,
  securityHeadersMiddleware,
  hashOtpCode,
  timingSafeEqualHex,
} from "./security.ts";
import { isValidEmail, generateOtpCode } from "./emailService.ts";
import { authRouter } from "./routes/authRoutes.ts";
import { storageRouter } from "./routes/storageRoutes.ts";
import { communityRouter } from "./routes/communityRoutes.ts";
import { aiRouter } from "./routes/aiRoutes.ts";

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, failureMessage = ""): void {
  if (condition) {
    results.push({ name: testName, passed: true });
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    results.push({ name: testName, passed: false, message: failureMessage });
    console.error(`  ✗ [FAIL] ${testName}: ${failureMessage}`);
  }
}

function makeRequest(
  port: number,
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<{ status: number; headers: http.IncomingHttpHeaders; data: any }> {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : "";
    const headers: Record<string, string | number> = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const req = http.request(
      { hostname: "127.0.0.1", port, path, method, headers },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          let parsed: any;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode || 0, headers: res.headers, data: parsed });
        });
      }
    );

    req.on("error", (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTestSuite() {
  console.log("\n============================================================");
  console.log(" BẮT ĐẦU CHẠY BỘ KIỂM THỬ BACKEND, AUTH & BẢO MẬT DỰ ÁN CÒ EM");
  console.log("============================================================\n");

  const app = express();
  app.use(express.json({ limit: "2mb" }));
  app.use(securityHeadersMiddleware);
  app.use("/api/auth", authRouter);
  app.use("/api", storageRouter);
  app.use("/api", communityRouter);
  app.use("/api", aiRouter);

  const server = await new Promise<http.Server | null>((resolve) => {
    const srv = app.listen(0, "127.0.0.1", () => resolve(srv));
    srv.on("error", () => resolve(null));
  });
  const addr = server?.address();
  const port = typeof addr === "object" && addr ? addr.port : 0;

  try {
    // 1. CRYPTO, OTP & SECURITY HELPERS
    console.log("--- 1. KIỂM THỬ BẢO MẬT, OTP HASH & SANITIZATION ---");
    assert(
      isValidEmail("nguoidung.test@gmail.com") &&
        !isValidEmail("invalid-email") &&
        !isValidEmail("@missing.com"),
      "Kiểm tra định dạng email hợp lệ",
      "isValidEmail không chuẩn"
    );

    const otpCode = generateOtpCode();
    assert(/^\d{6}$/.test(otpCode), "Sinh mã OTP 6 chữ số ngẫu nhiên", `Code: ${otpCode}`);

    const otpHash = hashOtpCode("test@gmail.com", otpCode);
    assert(
      otpHash !== otpCode &&
        otpHash.length === 64 &&
        timingSafeEqualHex(otpHash, hashOtpCode("TEST@gmail.com", otpCode)) &&
        !timingSafeEqualHex(otpHash, hashOtpCode("test@gmail.com", "000000")),
      "Băm OTP bằng HMAC-SHA256 & so sánh hằng thời gian",
      `Hash len: ${otpHash.length}`
    );

    const mockApiKey = "AIzaSyD-fakeKeyForTestingSecurity1234";
    const sanitized = redactSecrets(`Error with key ${mockApiKey} at /home/user/app/server.ts`);
    assert(
      !sanitized.includes(mockApiKey) &&
        !sanitized.includes("/home/user/app") &&
        sanitized.includes("[REDACTED]"),
      "Khử sạch API key và đường dẫn nội bộ",
      sanitized
    );

    const safeErr = sanitizeErrorMessage(new Error("Fatal at /var/www/internal/db.sqlite"));
    assert(!safeErr.includes("/var/www/internal") && safeErr.length <= 160, "Cắt gọn lỗi an toàn", safeErr);

    const cleanStr = sanitizeString("<script>alert('xss')</script>Nguyễn Hoàng Nam");
    assert(!cleanStr.includes("<script>") && cleanStr.includes("Nguyễn Hoàng Nam"), "Chống XSS", cleanStr);

    // 2. DATABASE ENGINE & IDOR ISOLATION
    console.log("\n--- 2. KIỂM THỬ CSDL & CÔ LẬP DỮ LIỆU (IDOR PROTECTION) ---");
    const testChar: CharacterRecord = {
      id: "test-user-01",
      user_id: "u-01",
      name: "Thục Anh",
      gioi: "nu",
      tuoi: "nguoi_lon",
      vocDang: "dong_ho_cat",
      tongDa: 2,
      toc: "bui_thap",
      huongNhin: "truoc",
      updated_at: new Date().toISOString(),
    };
    db.saveCharacter(testChar);
    const loadedChar = db.getCharacter("test-user-01", "u-01");
    const crossUserChar = db.getCharacter("test-user-01", "u-02");
    assert(
      loadedChar?.name === "Thục Anh" && crossUserChar === null,
      "Cô lập nhân vật theo user_id",
      `loaded=${loadedChar?.name}, cross=${crossUserChar}`
    );

    const testOutfit: OutfitRecord = {
      id: `test-outfit-${Date.now()}`,
      user_id: "u-01",
      title: "Áo Tấc Thiên Thanh",
      trang_phuc_id: "aotac",
      mau_hex: "#0284C7",
      phu_kien_ids: ["nonla"],
      nhan_vat_config: { gioi: "nu" },
      created_at: new Date().toISOString(),
    };
    db.saveOutfit(testOutfit);
    assert(
      db.deleteOutfit(testOutfit.id, "u-02") === false && db.deleteOutfit(testOutfit.id, "u-01") === true,
      "Chỉ chủ sở hữu mới xóa được bộ phối đồ",
      "IDOR check failed"
    );

    const memId = `test-mem-${Date.now()}`;
    const testMemory: MemoryRecord = {
      id: memId,
      user_id: "u-01",
      sender_name: "Thanh Hằng",
      content: "Ký ức áo Nhật Bình",
      trang_phuc_name: "Áo Nhật Bình",
      era: "Triều Nguyễn",
      created_at: new Date().toISOString(),
    };
    db.saveMemory(testMemory);
    db.saveMemory({ ...testMemory, user_id: "u-02", content: "Bị ghi đè trái phép" });
    assert(
      db.getMemoryById(memId)?.content === "Ký ức áo Nhật Bình",
      "Chống ghi đè ký ức của người dùng khác (IDOR)",
      db.getMemoryById(memId)?.content
    );

    const testOrder: OrderRecord = {
      id: `test-ord-${Date.now()}`,
      user_id: "u-01",
      item_id: "aodai",
      item_name: "Áo Dài Lụa",
      size: "L",
      quantity: 1,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    db.saveOrder(testOrder);
    assert(
      db.getAllOrders("u-01").some((o) => o.id === testOrder.id) &&
        !db.getAllOrders("u-02").some((o) => o.id === testOrder.id),
      "Cô lập đơn hàng theo user_id",
      "Order isolation failed"
    );

    communityDb.setKv("settings", { projectName: "Cò Em Test", requirePostModeration: false });
    assert(
      communityDb.getKv<{ projectName?: string }>("settings", {}).projectName === "Cò Em Test",
      "Lưu và đọc cấu hình cộng đồng trong SQLite",
      "communityDb KV failed"
    );

    // 3. HTTP ENDPOINTS
    if (port > 0) {
      console.log(`\n--- 3. KIỂM THỬ HTTP ENDPOINTS (PORT ${port}) ---`);
      const healthRes = await makeRequest(port, "GET", "/api/health");
      assert(
        healthRes.status === 200 &&
          healthRes.data.status === "ok" &&
          healthRes.headers["x-content-type-options"] === "nosniff" &&
          healthRes.headers["x-frame-options"] === "SAMEORIGIN",
        "GET /api/health trả 200 & đủ Security Headers",
        `Status: ${healthRes.status}`
      );

      const unauthChar = await makeRequest(port, "POST", "/api/character", { gioi: "nam" });
      assert(unauthChar.status === 401, "POST /api/character từ chối khi chưa đăng nhập (401)", `Status: ${unauthChar.status}`);

      const unauthOrder = await makeRequest(port, "POST", "/api/orders", {
        item_id: "aodai",
        item_name: "Áo Dài",
      });
      assert(unauthOrder.status === 401, "POST /api/orders từ chối khi chưa đăng nhập (401)", `Status: ${unauthOrder.status}`);

      const unauthAdmin = await makeRequest(port, "GET", "/api/admin/overview");
      assert(unauthAdmin.status === 401, "GET /api/admin/overview từ chối khi chưa đăng nhập (401)", `Status: ${unauthAdmin.status}`);

      const bootRes = await makeRequest(port, "GET", "/api/community/bootstrap");
      assert(bootRes.status === 200 && bootRes.data.ok === true, "GET /api/community/bootstrap hoạt động", `Status: ${bootRes.status}`);

      const villageOrderRes = await makeRequest(port, "POST", "/api/community/village-orders", {
        villageId: "van_phuc",
        villageName: "Làng Lụa Vạn Phúc",
        costumeName: "Áo Ngũ Thân",
        customerName: "Minh Anh",
        customerPhone: "0912345678",
        note: "Đo may áo",
      });
      assert(
        villageOrderRes.status === 200 && villageOrderRes.data.data?.customer_phone === "0912345678",
        "POST /api/community/village-orders lưu đúng SĐT khách hàng",
        JSON.stringify(villageOrderRes.data)
      );

      const maskedOrdersRes = await makeRequest(port, "GET", "/api/community/village-orders");
      const firstMasked = maskedOrdersRes.data?.data?.[0]?.customer_phone || "";
      assert(
        maskedOrdersRes.status === 200 && firstMasked.includes("****"),
        "GET /api/community/village-orders tự động che SĐT với người dùng thường",
        `Phone: ${firstMasked}`
      );

      // Auth OTP flow
      const testEmail = `sync.${Date.now()}@gmail.com`;
      const sendRes = await makeRequest(port, "POST", "/api/auth/send-otp", { email: testEmail });
      assert(sendRes.status === 200 && sendRes.data.ok === true, "POST /api/auth/send-otp thành công", `Status: ${sendRes.status}`);

      // Simulate known OTP hash in DB for end-to-end verify test
      const fixedCode = "654321";
      db.saveOtp({
        id: `otp-e2e-${Date.now()}`,
        email: testEmail,
        code: hashOtpCode(testEmail, fixedCode),
        expires_at: Date.now() + 300_000,
        attempts: 0,
        created_at: new Date().toISOString(),
      });

      const verifyRes = await makeRequest(port, "POST", "/api/auth/verify-otp", {
        email: testEmail,
        code: fixedCode,
        name: "Người Dùng Test",
      });
      const token = verifyRes.data?.token || "";
      assert(verifyRes.status === 200 && Boolean(token), "POST /api/auth/verify-otp cấp Session Token", `Status: ${verifyRes.status}`);

      // Member cannot access admin endpoint (403)
      const memberAdminRes = await makeRequest(port, "GET", "/api/admin/overview", undefined, token);
      assert(memberAdminRes.status === 403, "Tài khoản member bị chặn khỏi /api/admin/overview (403)", `Status: ${memberAdminRes.status}`);

      // Authenticated /api/sync
      const syncPost = await makeRequest(
        port,
        "POST",
        "/api/sync",
        {
          character: { gioi: "nam", vocDang: "chu_nhat", tongDa: 3, toc: "ngan" },
          outfits: [{ id: `sync-o-${Date.now()}`, title: "<b>Áo Giao Lĩnh</b>", trang_phuc_id: "giaolinh", mau_hex: "m_do" }],
        },
        token
      );
      const syncGet = await makeRequest(port, "GET", "/api/sync", undefined, token);
      assert(
        syncPost.status === 200 &&
          syncGet.status === 200 &&
          syncGet.data?.character?.gioi === "nam" &&
          !String(syncGet.data?.outfits?.[0]?.title || "").includes("<b>"),
        "POST/GET /api/sync đồng bộ & khử XSS thành công",
        `Status: ${syncPost.status}/${syncGet.status}`
      );

      await makeRequest(port, "POST", "/api/auth/logout", undefined, token);
    } else {
      console.warn("Lưu ý: Môi trường sandbox không cho phép bind cổng HTTP tạm, bỏ qua nhóm HTTP tests.");
    }
  } finally {
    server?.close();
  }

  console.log("\n============================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(` TỔNG SỐ TEST: ${total} | ĐẠT: ${passed} | THẤT BẠI: ${failed}`);
  console.log("============================================================\n");
  if (failed > 0) process.exit(1);
}

runTestSuite();
