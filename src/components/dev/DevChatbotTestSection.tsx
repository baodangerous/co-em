/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { hoiCoVanVanHoa } from "../../lib/gemini";
import { domdom } from "../../copy/domdom";
import { nguon } from "../../data/nguon";
import { danhSach20CauKiemThu, ChatbotTestCase } from "../../data/chatbotTests";

export default function DevChatbotTestSection() {
  const [filterNhomChatbot, setFilterNhomChatbot] = useState<string>("Tất cả");
  const [runningAllChatbot, setRunningAllChatbot] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [chatbotTestResults, setChatbotTestResults] = useState<
    Record<
      number,
      {
        loading: boolean;
        traLoi?: string;
        nguonIds?: string[];
        pass?: boolean;
        lyDo?: string;
        tuCache?: boolean;
        loi?: boolean;
      }
    >
  >({});

  const handleRunChatbotTest = async (tc: ChatbotTestCase) => {
    setChatbotTestResults((prev) => ({
      ...prev,
      [tc.id]: { loading: true },
    }));

    try {
      const res = await hoiCoVanVanHoa(tc.cauHoi);
      const evalResult = tc.kiemTraHopLe(res.cauTraLoi, res.nguonIds);

      setChatbotTestResults((prev) => ({
        ...prev,
        [tc.id]: {
          loading: false,
          traLoi: res.cauTraLoi,
          nguonIds: res.nguonIds,
          pass: evalResult.pass,
          lyDo: evalResult.lyDo,
          tuCache: res.tuCache,
          loi: res.loi,
        },
      }));
    } catch {
      setChatbotTestResults((prev) => ({
        ...prev,
        [tc.id]: {
          loading: false,
          traLoi: domdom.common.error,
          nguonIds: [],
          pass: false,
          lyDo: "Lỗi kết nối",
          loi: true,
        },
      }));
    }
  };

  const handleRunAllChatbotTests = async () => {
    if (runningAllChatbot) return;
    setRunningAllChatbot(true);
    setProgressCount(0);

    for (let i = 0; i < danhSach20CauKiemThu.length; i++) {
      const tc = danhSach20CauKiemThu[i];
      setProgressCount(i + 1);
      await handleRunChatbotTest(tc);
      await new Promise((r) => setTimeout(r, 350));
    }

    setRunningAllChatbot(false);
  };

  const handleResetChatbotTests = () => {
    setChatbotTestResults({});
    setProgressCount(0);
  };

  return (
    <section
      className="p-4 md:p-5 border space-y-4"
      style={{
        borderColor: "var(--vang-nghe)",
        borderRadius: "var(--vien-lech-a)",
        background: "rgba(217, 164, 65, 0.04)",
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2
            className="text-base font-semibold flex items-center gap-2"
            style={{ fontFamily: "var(--font-tieu-de)", color: "var(--vang-nghe)" }}
          >
            <span>✨</span> 20 Câu kiểm thử Cò Em Chatbot (Cố vấn văn hóa)
          </h2>
          <p className="text-xs text-stone-300 mt-0.5">
            Gọi Gemini thật qua callGemini (nhiệt độ 0.3), kiểm thử nghiêm ngặt 4 nhóm: Đúng phạm vi, Ngoài phạm vi, Gài bịa, Ép bỏ quy tắc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunAllChatbotTests}
            disabled={runningAllChatbot}
            className="px-3.5 py-1.5 text-xs font-medium border cursor-pointer transition-all disabled:opacity-50"
            style={{
              background: "var(--vang-nghe)",
              borderColor: "var(--vang-nghe)",
              color: "var(--nen-toi)",
              borderRadius: "var(--vien-lech-b)",
            }}
          >
            {runningAllChatbot ? `Đang chạy (${progressCount}/20)...` : "▶ Chạy tất cả 20 câu"}
          </button>

          <button
            type="button"
            onClick={handleResetChatbotTests}
            disabled={runningAllChatbot}
            className="px-2.5 py-1.5 text-xs border cursor-pointer transition-colors text-stone-300 hover:text-white"
            style={{
              borderColor: "var(--tro-tram)",
              borderRadius: "var(--vien-lech-b)",
            }}
          >
            🔄 Đặt lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2 border rounded bg-black/30 border-stone-700">
          <span className="text-stone-400 block text-[11px]">Tổng số câu:</span>
          <strong className="text-base text-stone-100">{danhSach20CauKiemThu.length}</strong>
        </div>
        <div className="p-2 border rounded bg-black/30 border-stone-700">
          <span className="text-stone-400 block text-[11px]">Đã chạy:</span>
          <strong className="text-base text-amber-300">
            {Object.values(chatbotTestResults).filter((r) => !r.loading && r.traLoi).length} / 20
          </strong>
        </div>
        <div className="p-2 border rounded bg-black/30 border-emerald-800/60">
          <span className="text-stone-400 block text-[11px]">Đạt chuẩn (Pass):</span>
          <strong className="text-base text-emerald-400">
            {Object.values(chatbotTestResults).filter((r) => r.pass === true).length}
          </strong>
        </div>
        <div className="p-2 border rounded bg-black/30 border-amber-800/60">
          <span className="text-stone-400 block text-[11px]">Cần xem lại:</span>
          <strong className="text-base text-amber-400">
            {Object.values(chatbotTestResults).filter((r) => r.pass === false).length}
          </strong>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {["Tất cả", "Đúng phạm vi", "Ngoài phạm vi", "Gài bịa", "Ép bỏ quy tắc"].map((nhomTab) => {
          const isActive = filterNhomChatbot === nhomTab;
          const countInNhom =
            nhomTab === "Tất cả"
              ? danhSach20CauKiemThu.length
              : danhSach20CauKiemThu.filter((t) => t.nhom === nhomTab).length;

          return (
            <button
              key={nhomTab}
              type="button"
              onClick={() => setFilterNhomChatbot(nhomTab)}
              className={`text-xs px-2.5 py-1 border transition-colors cursor-pointer ${
                isActive ? "font-semibold" : "opacity-75 hover:opacity-100"
              }`}
              style={{
                borderColor: isActive ? "var(--vang-nghe)" : "var(--tro-tram)",
                color: isActive ? "var(--vang-nghe)" : "var(--nen-sang)",
                background: isActive ? "rgba(217, 164, 65, 0.15)" : "transparent",
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              {nhomTab} ({countInNhom})
            </button>
          );
        })}
      </div>

      <div className="space-y-3 pt-2">
        {danhSach20CauKiemThu
          .filter((tc) => filterNhomChatbot === "Tất cả" || tc.nhom === filterNhomChatbot)
          .map((tc) => {
            const res = chatbotTestResults[tc.id];
            const nhomColor =
              tc.nhom === "Đúng phạm vi"
                ? "text-emerald-400 border-emerald-700/50 bg-emerald-950/30"
                : tc.nhom === "Ngoài phạm vi"
                ? "text-blue-400 border-blue-700/50 bg-blue-950/30"
                : tc.nhom === "Gài bịa"
                ? "text-amber-400 border-amber-700/50 bg-amber-950/30"
                : "text-purple-400 border-purple-700/50 bg-purple-950/30";

            return (
              <div
                key={tc.id}
                className="p-3.5 border text-xs space-y-2"
                style={{
                  borderColor:
                    res?.pass === true
                      ? "rgba(16, 185, 129, 0.4)"
                      : res?.pass === false
                      ? "rgba(245, 158, 11, 0.5)"
                      : "rgba(138, 129, 117, 0.3)",
                  background: "rgba(0, 0, 0, 0.35)",
                  borderRadius: "var(--vien-lech-b)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-stone-400">#{tc.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 border rounded ${nhomColor}`}>
                        {tc.nhom}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-stone-100">
                      {tc.cauHoi}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRunChatbotTest(tc)}
                    disabled={res?.loading || runningAllChatbot}
                    className="px-2.5 py-1 text-xs border shrink-0 cursor-pointer disabled:opacity-40 transition-colors"
                    style={{
                      borderColor: "var(--vang-nghe)",
                      color: "var(--vang-nghe)",
                      background: "rgba(217, 164, 65, 0.12)",
                      borderRadius: "var(--vien-lech-b)",
                    }}
                  >
                    {res?.loading ? "Đang gọi..." : "Chạy câu này"}
                  </button>
                </div>

                <div className="text-[11px] text-stone-400 space-y-0.5 border-l-2 pl-2 border-stone-700">
                  <p>
                    <strong className="text-stone-300">Mục đích:</strong> {tc.mucDich}
                  </p>
                  <p>
                    <strong className="text-stone-300">Kỳ vọng:</strong> {tc.kyVong}
                  </p>
                </div>

                {res && !res.loading && res.traLoi && (
                  <div
                    className="mt-2 p-2.5 rounded border space-y-1.5"
                    style={{
                      background: "rgba(0, 0, 0, 0.45)",
                      borderColor: res.pass
                        ? "rgba(16, 185, 129, 0.3)"
                        : "rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          res.pass ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {res.pass ? "✅ ĐẠT YÊU CẦU" : "⚠️ CẦN XEM LẠI"}: {res.lyDo}
                      </span>
                      <span className="text-stone-400">
                        {res.tuCache ? "⚡ Từ cache" : "🌐 Gọi trực tiếp"}
                      </span>
                    </div>

                    <div className="text-stone-200 text-xs p-2 rounded bg-black/40 border border-stone-800">
                      <strong>Câu trả lời từ Gemini:</strong>
                      <p className="mt-1 whitespace-pre-line text-stone-300">{res.traLoi}</p>
                    </div>

                    {res.nguonIds && res.nguonIds.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] pt-1">
                        <span className="text-stone-400">Nguồn trích xuất:</span>
                        {res.nguonIds.map((nid) => {
                          const tenNguon = nguon.find((n) => n.id === nid)?.ten || nid;
                          return (
                            <span
                              key={nid}
                              className="px-1.5 py-0.2 border rounded text-amber-300 border-amber-600/40 bg-amber-950/20"
                            >
                              📖 {tenNguon}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
}
