/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SERVER BACKEND CHÍNH CHO DỰ ÁN VIỆT PHỤC REMIX (EXPRESS FULL-STACK ENTRYPOINT)
 * Kiến trúc phân tầng bảo mật:
 * - /server/routes/authRoutes.ts: Xác thực OTP, Session & Admin Server-side
 * - /server/routes/storageRoutes.ts: Cô lập dữ liệu cá nhân (Character, Outfits, Orders) & Ký ức
 * - /server/routes/aiRoutes.ts: Proxy Gemini AI, Virtual Try-On Vision, Maps & Lyria
 */

import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { securityHeadersMiddleware, rateLimiterMiddleware } from "./server/security.ts";
import { authRouter } from "./server/routes/authRoutes.ts";
import { storageRouter } from "./server/routes/storageRoutes.ts";
import { aiRouter } from "./server/routes/aiRoutes.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ limit: "12mb", extended: true }));
app.use(securityHeadersMiddleware);
app.use("/api/", rateLimiterMiddleware(180, 60000));

// Đăng ký các phân hệ API
app.use("/api/auth", authRouter);
app.use("/api", storageRouter);
app.use("/api", aiRouter);

async function startServer() {
  let viteInstance: any = null;

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    viteInstance = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteInstance.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist/index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server Việt Phục Remix đang hoạt động an toàn tại cổng ${port}`);

    if (viteInstance) {
      Promise.all([
        viteInstance.transformRequest("/src/main.tsx"),
        viteInstance.transformRequest("/src/App.tsx"),
        viteInstance.transformRequest("/src/index.css"),
      ]).catch(() => {
        // ignore warmup errors
      });
    }
  });
}

startServer();
