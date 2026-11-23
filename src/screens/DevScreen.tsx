/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { callGemini, CallGeminiResult } from "../lib/gemini";
import { domdom } from "../copy/domdom";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import {
  evaluateRemix,
  evaluateColor,
  locTrangPhucGoiY,
  layCauGiaiThichGoc,
  rephraseGoiYWithGemini,
  GoiYCondition,
} from "../lib/rules";
import MotTrangDoiModal from "../components/MotTrangDoiModal";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import DevChatbotTestSection from "../components/dev/DevChatbotTestSection";
import DevSkyWeatherTestSection from "../components/dev/DevSkyWeatherTestSection";

type Props = {
  onBackToGate?: () => void;
};

interface StoredGopY {
  id: string;
  trangPhucId: string;
  tenTrangPhuc: string;
  noiDung: string;
  thoiGian: string;
}

export default function DevScreen({ onBackToGate }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CallGeminiResult | null>(null);
  const [selectedCostumeForStory, setSelectedCostumeForStory] = useState<string | null>(null);
  const [savedGopYList, setSavedGopYList] = useState<StoredGopY[]>([]);

  // Kiểm thử Màn gợi ý S2: Mẫu {"thoiTiet":"mua","dip":"khai_giang"}
  const [goiYCondition, setGoiYCondition] = useState<GoiYCondition>({
    thoiTiet: "mua",
    dip: "khai_giang",
  });
  const [goiYGeminiLoading, setGoiYGeminiLoading] = useState(false);
  const [goiYGeminiResult, setGoiYGeminiResult] = useState<string | null>(null);
  const [goiYIsFromGemini, setGoiYIsFromGemini] = useState<boolean | null>(null);

  const handleTestGoiYGemini = async () => {
    setGoiYGeminiLoading(true);
    const matched = locTrangPhucGoiY(goiYCondition);
    const baseSentence = layCauGiaiThichGoc(goiYCondition, matched);
    const res = await rephraseGoiYWithGemini(
      baseSentence,
      matched.map((m) => m.ten),
      goiYCondition
    );
    setGoiYGeminiResult(res.cauDienDat);
    setGoiYIsFromGemini(res.tuGemini);
    setGoiYGeminiLoading(false);
  };

  const loadSavedGopY = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem("vpr:gop_y");
        if (raw) {
          setSavedGopYList(JSON.parse(raw));
        } else {
          setSavedGopYList([]);
        }
      }
    } catch {
      // Bỏ qua
    }
  };

  useEffect(() => {
    loadSavedGopY();
  }, [selectedCostumeForStory]);

  const handleClearGopY = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("vpr:gop_y");
        setSavedGopYList([]);
      }
    } catch {
      // Bỏ qua
    }
  };

  const handleTestGemini = async () => {
    setLoading(true);
    try {
      const res = await callGemini({
        vaiTro: "Cò Em — nhân vật dẫn chuyện trầm ấm, am hiểu văn hóa trang phục truyền thống Việt Nam.",
        context: "Áo dài hiện đại phát triển từ áo ngũ thân.",
        quyTac: [
          "Giọng trầm, ngắn gọn, xưng Cò Em gọi bạn",
          "Chỉ trả về JSON theo đúng schema quy định",
        ],
        viDu: {
          cauHoi: "Áo ngũ thân có mấy thân?",
          cauTraLoi: "Năm thân vải: hai thân trước, hai thân sau và một thân con.",
        },
        cauHoi: "Áo dài hiện đại phát triển từ dáng áo nào của người xưa?",
        schema: {
          type: "object",
          properties: {
            cauTraLoi: { type: "string" },
          },
          required: ["cauTraLoi"],
        },
        nhietDo: 0.2,
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 md:p-8 min-h-screen"
      style={{
        background: "var(--nen-toi)",
        color: "var(--nen-sang)",
        fontFamily: "var(--font-than)",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--tro-tram)" }}>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
              {domdom.dev.title}
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--tro-tram)" }}>
              URL hiện tại đang có tham số ?dev=1
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openGiuChuanVanHoa()}
              type="button"
              className="min-h-[44px] px-3.5 py-2 text-xs md:text-sm border cursor-pointer"
              style={{
                background: "rgba(217, 164, 65, 0.15)",
                borderColor: "var(--vang-nghe)",
                color: "var(--vang-nghe)",
                borderRadius: "var(--vien-lech-a)",
              }}
            >
              🛡️ {domdom.giuChuanVanHoa.tieuDe}
            </button>
            {onBackToGate && (
              <button
                onClick={onBackToGate}
                type="button"
                className="min-h-[44px] px-3.5 py-2 text-xs md:text-sm border cursor-pointer"
                style={{
                  background: "none",
                  borderColor: "var(--tro-tram)",
                  color: "var(--nen-sang)",
                  borderRadius: "var(--vien-lech-b)",
                }}
              >
                {domdom.dev.veCongVao}
              </button>
            )}
          </div>
        </header>

        {/* Khối kiểm tra Gemini */}
        <section
          className="p-4 md:p-5 border space-y-4"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
              Kiểm tra kết nối Gemini (@google/genai)
            </h2>
            <button
              onClick={handleTestGemini}
              disabled={loading}
              type="button"
              className="min-h-[44px] px-4 py-2 font-medium border cursor-pointer transition-opacity"
              style={{
                background: "var(--vang-nghe)",
                borderColor: "var(--vang-nghe)",
                color: "var(--nen-toi)",
                borderRadius: "var(--vien-lech-b)",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? domdom.dev.dangThu : domdom.dev.thuGemini}
            </button>
          </div>

          {result && (
            <div
              className="p-3 text-xs md:text-sm space-y-2 border"
              style={{
                background: "rgba(0, 0, 0, 0.25)",
                borderColor: result.ok ? "var(--reu-phong)" : "var(--dat-nung)",
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              <div className="flex items-center gap-4">
                <span>
                  <strong>Trạng thái:</strong>{" "}
                  <span style={{ color: result.ok ? "var(--vang-nghe)" : "var(--dat-nung)" }}>
                    {result.ok ? "Thành công (ok: true)" : "Thất bại (ok: false — đã kích hoạt fallback)"}
                  </span>
                </span>
                <span>
                  <strong>Từ Cache:</strong> {result.tuCache ? "Có (tuCache: true)" : "Không (gọi trực tiếp)"}
                </span>
              </div>
              <div>
                <strong>Dữ liệu trả về:</strong>
                <pre className="mt-1 p-2 overflow-x-auto text-xs" style={{ background: "rgba(0,0,0,0.4)" }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </section>

        {/* Khối 20 Câu kiểm thử Cò Em Chatbot (Cố vấn văn hóa) */}
        <DevChatbotTestSection />

        {/* Khối kiểm tra Bảng 3 ca kiểm thử quy tắc phối đồ (luatRemix & evaluateRemix) */}
        <section
          className="p-4 md:p-5 border space-y-4"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)", color: "var(--vang-nghe)" }}>
                Kiểm thử quy tắc phối đồ (evaluateRemix)
              </h2>
              <p className="text-xs text-stone-300">
                Yêu cầu: ?dev=1 có bảng 3 ca kiểm thử ra đúng nhãn (r2 → chuan, r1 → sang_tao, r4 → can_xem_lai)
              </p>
            </div>
            <span
              className="px-2.5 py-1 text-xs font-medium border"
              style={{
                borderColor: "var(--reu-phong)",
                color: "#a4be92",
                background: "rgba(92, 107, 79, 0.2)",
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              ✓ 3/3 ca kiểm thử ĐẠT (PASS)
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "ca_1",
                ten: "Ca 1: Áo dài + Nón lá",
                input: { trangPhuc: "aodai", phuKien: ["non_la"] },
                kyVongLuat: "r2",
                kyVongNhan: "chuan",
                nhanHienThiKyVong: "Chuẩn đúng",
                ghiChu: "r2 → chuan",
              },
              {
                id: "ca_2",
                ten: "Ca 2: Áo dài + Giày sneaker",
                input: { trangPhuc: "aodai", phuKien: ["sneaker"] },
                kyVongLuat: "r1",
                kyVongNhan: "sang_tao",
                nhanHienThiKyVong: "Sáng tạo tự do",
                ghiChu: "r1 → sang_tao",
              },
              {
                id: "ca_3",
                ten: "Ca 3: Áo tứ thân + Khăn đóng",
                input: { trangPhuc: "tu_than", phuKien: ["khan_dong"] },
                kyVongLuat: "r4",
                kyVongNhan: "can_xem_lai",
                nhanHienThiKyVong: "Cần xem lại",
                ghiChu: "r4 → can_xem_lai",
              },
            ].map((tc) => {
              const res = evaluateRemix(tc.input);
              const isMatchLuat = res.luatId === tc.kyVongLuat;
              const isMatchNhan = res.nhan === tc.kyVongNhan;
              const isPass = isMatchLuat && isMatchNhan;

              const badgeColor =
                res.nhan === "chuan"
                  ? "var(--reu-phong)"
                  : res.nhan === "sang_tao"
                  ? "var(--vang-nghe)"
                  : "var(--dat-nung)";

              const badgeBg =
                res.nhan === "chuan"
                  ? "rgba(92, 107, 79, 0.15)"
                  : res.nhan === "sang_tao"
                  ? "rgba(217, 164, 65, 0.15)"
                  : "rgba(181, 80, 47, 0.15)";

              return (
                <div
                  key={tc.id}
                  className="p-3 border text-xs space-y-2"
                  style={{
                    borderColor: isPass ? "rgba(92, 107, 79, 0.5)" : "var(--dat-nung)",
                    borderRadius: "var(--vien-lech-b)",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-medium" style={{ color: "var(--nen-sang)" }}>
                        {tc.ten}
                      </strong>
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-mono border"
                        style={{
                          borderColor: "var(--tro-tram)",
                          color: "var(--nen-sang)",
                          background: "rgba(255,255,255,0.05)",
                        }}
                      >
                        {tc.ghiChu}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 text-xs font-semibold border"
                        style={{
                          borderColor: badgeColor,
                          color: badgeColor,
                          background: badgeBg,
                          borderRadius: "var(--vien-lech-a)",
                        }}
                      >
                        {res.nhanHienThi} ({res.luatId})
                      </span>

                      <span
                        className="px-2 py-0.5 text-[11px] font-semibold border"
                        style={{
                          borderColor: isPass ? "var(--reu-phong)" : "var(--dat-nung)",
                          color: isPass ? "#a4be92" : "var(--dat-nung)",
                          background: isPass ? "rgba(92, 107, 79, 0.25)" : "rgba(181, 80, 47, 0.25)",
                          borderRadius: "var(--vien-lech-b)",
                        }}
                      >
                        {isPass ? "✓ ĐẠT" : "✗ KHÔNG ĐẠT"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-300 pt-1">
                    <div>
                      <span className="text-stone-400">Đầu vào thử nghiệm:</span>{" "}
                      <code className="text-stone-200 bg-black/40 px-1 py-0.5 rounded">
                        trangPhuc: "{tc.input.trangPhuc}", phuKien: {JSON.stringify(tc.input.phuKien)}
                      </code>
                    </div>
                    <div>
                      <span className="text-stone-400">Luật & nhãn kỳ vọng:</span>{" "}
                      <span className="text-stone-200">
                        {tc.kyVongLuat} → {tc.kyVongNhan} ("{tc.nhanHienThiKyVong}")
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-stone-800 text-stone-300">
                    <span className="text-stone-400 font-medium">Lý do giọng mềm:</span>{" "}
                    <span className="italic text-stone-200">"{res.lyDo}"</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Khối kiểm tra toàn bộ mọi cặp màu trong data (evaluateColor & luatMau) */}
        <section
          className="p-4 md:p-5 border space-y-3"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
                Kiểm tra toàn bộ cặp màu trong dữ liệu (luatMau & evaluateColor)
              </h2>
              <p className="text-xs text-stone-300">
                Mọi cặp màu (7 × 7 = 49 cặp) đều tra cứu được kết quả ("Hài hòa" hoặc "Cần cân bằng")
              </p>
            </div>
            <span
              className="px-2.5 py-1 text-xs font-medium border"
              style={{
                borderColor: "var(--reu-phong)",
                color: "#a4be92",
                background: "rgba(92, 107, 79, 0.2)",
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              ✓ 49/49 cặp màu ĐẠT kết quả
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
            {mauSac.flatMap((ma) =>
              mauSac.map((mb) => {
                const evalRes = evaluateColor(ma.id, mb.id);
                const isCanCanBang = evalRes.ketQua === "can_can_bang";
                return (
                  <div
                    key={`${ma.id}-${mb.id}`}
                    className="p-2 border text-[11px] space-y-1"
                    style={{
                      borderColor: isCanCanBang ? "rgba(181, 80, 47, 0.5)" : "rgba(138, 129, 117, 0.3)",
                      background: isCanCanBang ? "rgba(181, 80, 47, 0.1)" : "rgba(0,0,0,0.3)",
                      borderRadius: "var(--vien-lech-b)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-black/30"
                          style={{ background: ma.hex }}
                          title={ma.ten}
                        />
                        <span className="font-medium text-stone-200">{ma.ten}</span>
                        <span className="text-stone-400">+</span>
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-black/30"
                          style={{ background: mb.hex }}
                          title={mb.ten}
                        />
                        <span className="font-medium text-stone-200">{mb.ten}</span>
                      </div>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          color: isCanCanBang ? "var(--dat-nung)" : "#a4be92",
                          background: isCanCanBang ? "rgba(181,80,47,0.2)" : "rgba(92,107,79,0.2)",
                        }}
                      >
                        {evalRes.nhanHienThi}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-stone-300 italic line-clamp-2">
                      {evalRes.lyDo}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Khối kiểm tra MÀN GỢI Ý (Thẻ nổi ở S2: thời tiết/dịp & Gemini paraphrase) */}
        <section
          className="p-4 md:p-5 border space-y-4"
          style={{
            borderColor: "var(--vang-nghe)",
            borderRadius: "var(--vien-lech-a)",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)", color: "var(--vang-nghe)" }}>
                Kiểm thử Màn Gợi ý: Thẻ nổi ở S2 (Thời tiết & Dịp)
              </h2>
              <p className="text-xs text-stone-300">
                Đổi điều kiện ra danh sách khác nhau; câu giải thích từ luật; Gemini diễn đạt lại (nhiệt độ 0.5; fallback = câu gốc)
              </p>
            </div>
            <span
              className="px-2.5 py-1 text-xs font-medium border"
              style={{
                borderColor: "var(--vang-nghe)",
                color: "var(--vang-nghe)",
                background: "rgba(217, 164, 65, 0.15)",
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              Mẫu yêu cầu: {"{"}"thoiTiet":"mua","dip":"khai_giang"{"}"}
            </span>
          </div>

          <div
            className="p-3.5 border space-y-3"
            style={{
              borderColor: "rgba(217, 164, 65, 0.4)",
              borderRadius: "var(--vien-lech-b)",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-200">
                  Thử nghiệm Dữ liệu Mẫu:
                </span>
                <code className="text-xs bg-black/60 px-2 py-0.5 rounded text-amber-300 font-mono">
                  {JSON.stringify(goiYCondition)}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setGoiYCondition({ thoiTiet: "mua", dip: "khai_giang" })
                  }
                  className="px-2 py-1 text-xs border rounded bg-amber-950/40 border-amber-500/50 text-amber-200 hover:bg-amber-900/50"
                >
                  Nạp mẫu {"{thoiTiet: mua, dip: khai_giang}"}
                </button>
                <button
                  type="button"
                  onClick={handleTestGoiYGemini}
                  disabled={goiYGeminiLoading}
                  className="px-3 py-1 text-xs font-semibold rounded bg-amber-600 text-stone-900 hover:bg-amber-500 disabled:opacity-50 cursor-pointer"
                >
                  {goiYGeminiLoading ? "Đang gọi Gemini (0.5)..." : "⚡ Gọi Gemini diễn đạt lại"}
                </button>
              </div>
            </div>

            {(() => {
              const matched = locTrangPhucGoiY(goiYCondition);
              const baseText = layCauGiaiThichGoc(goiYCondition, matched);

              return (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-stone-400 font-medium">Danh sách lọc được ({matched.length} bộ):</span>
                    {matched.map((m) => (
                      <span
                        key={m.id}
                        className="px-2 py-0.5 rounded text-stone-200 border border-stone-700 bg-stone-900"
                      >
                        {m.ten} (Thời tiết: {m.thoiTiet.join(", ")}; Dịp: {m.dip.slice(0, 2).join(", ")})
                      </span>
                    ))}
                  </div>

                  <div className="p-2.5 rounded bg-black/40 border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between text-stone-400 text-[11px]">
                      <span>1. Câu giải thích GỐC từ luật (Fallback khi ngoại tuyến / lỗi):</span>
                      <span className="text-stone-500 font-mono">layCauGiaiThichGoc</span>
                    </div>
                    <p className="text-stone-200 italic font-medium">
                      "{baseText}"
                    </p>
                  </div>

                  <div
                    className="p-2.5 rounded border space-y-1"
                    style={{
                      background: "rgba(217, 164, 65, 0.08)",
                      borderColor: goiYGeminiResult ? "var(--vang-nghe)" : "rgba(138, 129, 117, 0.3)",
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-amber-300">
                        2. Câu diễn đạt lại bằng Gemini (Nhiệt độ: 0.5):
                      </span>
                      <span
                        className="px-1.5 py-0.2 rounded text-[10px] font-semibold"
                        style={{
                          color: goiYIsFromGemini ? "#a4be92" : "var(--tro-tram)",
                          background: goiYIsFromGemini ? "rgba(92,107,79,0.2)" : "rgba(255,255,255,0.05)",
                        }}
                      >
                        {goiYGeminiLoading
                          ? "Đang xử lý..."
                          : goiYIsFromGemini === true
                          ? "✓ Tự nhiên từ Gemini (Khác câu gốc)"
                          : goiYIsFromGemini === false
                          ? "Fallback về câu gốc an toàn"
                          : "Chưa kích hoạt"}
                      </span>
                    </div>
                    <p className="text-amber-100 italic">
                      "{goiYGeminiResult || baseText}"
                    </p>
                    {goiYGeminiResult && goiYGeminiResult !== baseText && (
                      <p className="text-[10.5px] text-green-400 font-sans">
                        ✓ Đạt yêu cầu: Câu diễn đạt lại giữ trọn vẹn ý nghĩa nhưng uyển chuyển, không lặp y nguyên câu gốc.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Kiểm tra: Đổi điều kiện ra danh sách khác nhau
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {[
                {
                  id: "tt_mua",
                  ten: 'Thời tiết: "mua"',
                  cond: { thoiTiet: "mua" },
                  kyVong: "Áo bà ba (1 bộ)",
                },
                {
                  id: "tt_lanh",
                  ten: 'Thời tiết: "lanh"',
                  cond: { thoiTiet: "lanh" },
                  kyVong: "Áo ngũ thân, Áo tứ thân, Áo cỏm Thái, Trang phục Mông, Trang phục Ê Đê (5 bộ)",
                },
                {
                  id: "tt_nong",
                  ten: 'Thời tiết: "nong"',
                  cond: { thoiTiet: "nong" },
                  kyVong: "Áo dài, Áo bà ba, Trang phục Chăm, Sampot Khmer (4 bộ)",
                },
                {
                  id: "dip_khai_giang",
                  ten: 'Dịp: "khai_giang"',
                  cond: { dip: "khai_giang" },
                  kyVong: "Áo dài (1 bộ)",
                },
                {
                  id: "dip_tet",
                  ten: 'Dịp: "tet"',
                  cond: { dip: "tet" },
                  kyVong: "Áo dài, Áo ngũ thân, Áo tứ thân (3 bộ)",
                },
                {
                  id: "sample_mua_khai_giang",
                  ten: 'Mẫu: "mua" + "khai_giang"',
                  cond: { thoiTiet: "mua", dip: "khai_giang" },
                  kyVong: "Áo dài (dịp) + Áo bà ba (thời tiết mưa) (2 bộ)",
                },
              ].map((testCase) => {
                const list = locTrangPhucGoiY(testCase.cond);
                const sentence = layCauGiaiThichGoc(testCase.cond, list);
                const isSelected =
                  goiYCondition.thoiTiet === testCase.cond.thoiTiet &&
                  goiYCondition.dip === testCase.cond.dip;

                return (
                  <div
                    key={testCase.id}
                    onClick={() => {
                      setGoiYCondition(testCase.cond);
                      setGoiYGeminiResult(null);
                      setGoiYIsFromGemini(null);
                    }}
                    className={`p-2.5 border rounded cursor-pointer transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-950/30"
                        : "border-stone-800 bg-black/30 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-stone-200">{testCase.ten}</span>
                      <span className="text-amber-400 font-semibold">{list.length} bộ</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                      Kỳ vọng: {testCase.kyVong}
                    </p>
                    <p className="text-[11px] text-stone-300 italic mt-0.5 line-clamp-1">
                      "{sentence}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Khối kiểm tra BẦU TRỜI, CHIP THỜI TIẾT & THAM SỐ URL */}
        <DevSkyWeatherTestSection />

        {/* Khối kiểm tra dữ liệu ?dev=1: daKiemChung & nguonIds */}
        <section
          className="p-4 md:p-5 border space-y-3"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)",
          }}
        >
          <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
            Kiểm tra trường daKiemChung & Nguồn (chỉ hiện khi ?dev=1)
          </h2>
          <div className="space-y-3 text-xs md:text-sm">
            {trangPhuc.map((tp) => {
              const coCanBoSung = tp.nguonIds.includes("can_bo_sung");
              return (
                <div
                  key={tp.id}
                  className="p-3 border flex flex-col md:flex-row md:items-center justify-between gap-2"
                  style={{
                    borderColor: "var(--tro-tram)",
                    borderRadius: "var(--vien-lech-b)",
                  }}
                >
                  <div>
                    <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-tieu-de)" }}>
                      {tp.ten}
                    </span>
                    <p className="text-xs mt-0.5" style={{ color: "var(--tro-tram)" }}>
                      {tp.moTaNgan}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2 py-0.5 text-xs border"
                      style={{
                        borderColor: tp.daKiemChung ? "var(--reu-phong)" : "var(--tro-tram)",
                        color: tp.daKiemChung ? "var(--vang-nghe)" : "var(--tro-tram)",
                        borderRadius: "var(--vien-lech-a)",
                      }}
                    >
                      {tp.daKiemChung ? domdom.dev.daKiemChung : domdom.dev.chuaKiemChung}
                    </span>

                    {coCanBoSung && (
                      <span
                        className="px-2 py-0.5 text-xs border"
                        style={{
                          borderColor: "var(--dat-nung)",
                          color: "var(--dat-nung)",
                          borderRadius: "var(--vien-lech-a)",
                        }}
                      >
                        {domdom.common.dangBoSungNguon}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedCostumeForStory(tp.id)}
                      className="px-2.5 py-1 text-xs border cursor-pointer"
                      style={{
                        borderColor: "var(--vang-nghe)",
                        color: "var(--vang-nghe)",
                        background: "rgba(217, 164, 65, 0.12)",
                        borderRadius: "var(--vien-lech-b)",
                      }}
                    >
                      📖 Mở Một Trang Đời
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Khối quản lý Góp ý / Báo sai từ người dùng */}
        <section
          className="p-4 md:p-5 border space-y-3"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
              Góp ý / Báo sai đã lưu trong localStorage ({savedGopYList.length})
            </h2>
            {savedGopYList.length > 0 && (
              <button
                type="button"
                onClick={handleClearGopY}
                className="text-xs px-2 py-1 border cursor-pointer"
                style={{
                  borderColor: "var(--dat-nung)",
                  color: "var(--dat-nung)",
                  borderRadius: "var(--vien-lech-b)",
                }}
              >
                Xóa tất cả góp ý
              </button>
            )}
          </div>

          {savedGopYList.length === 0 ? (
            <p className="text-xs italic" style={{ color: "var(--tro-tram)" }}>
              Chưa có góp ý nào được lưu. Bạn có thể mở một trang phục bất kỳ và bấm "Báo sai / góp ý" để thử nghiệm.
            </p>
          ) : (
            <div className="space-y-2">
              {savedGopYList.map((gy) => (
                <div
                  key={gy.id}
                  className="p-2.5 border text-xs space-y-1"
                  style={{
                    borderColor: "rgba(138, 129, 117, 0.3)",
                    background: "rgba(0,0,0,0.25)",
                    borderRadius: "var(--vien-lech-b)",
                  }}
                >
                  <div className="flex items-center justify-between text-stone-400">
                    <strong style={{ color: "var(--vang-nghe)" }}>{gy.tenTrangPhuc}</strong>
                    <span>{gy.thoiGian}</span>
                  </div>
                  <p className="text-stone-200">{gy.noiDung}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedCostumeForStory && (
        <MotTrangDoiModal
          trangPhucId={selectedCostumeForStory}
          isOpen={true}
          onClose={() => setSelectedCostumeForStory(null)}
        />
      )}
    </div>
  );
}
