/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HỘP TRÒ CHUYỆN CỐ VẤN VĂN HÓA CÒ EM (NARRATOR CHAT)
 * Cải tiến: Tốc độ phản hồi tức thì, gợi ý thông minh, sao chép câu trả lời,
 * xóa lịch sử trò chuyện và hỗ trợ nhập giọng nói tiếng Việt.
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import { coem } from "../../copy/coem";
import { hoiCoVanVanHoa } from "../../lib/gemini";
import { nguon } from "../../data/nguon";
import { trangPhuc } from "../../data/trangphuc";
import { openGiuChuanVanHoa } from "../../lib/giuChuan";
import CoMascot from "../mascot/CoMascot";

export interface ChatMessage {
  id: string;
  sender: "user" | "coem";
  text: string;
  nguonIds?: string[];
  isError?: boolean;
  thoiGian: number;
}

export interface CoEmChatProps {
  currentScreen?: string;
  selectedTrangPhucId?: string;
  mauId?: string;
  phuKienIds?: string[];
  isOpen?: boolean;
  onToggle?: () => void;
  hideTrigger?: boolean;
}

export type DomDomChatProps = CoEmChatProps;

export default function CoEmChat({
  selectedTrangPhucId,
  mauId,
  phuKienIds,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  hideTrigger = false,
}: CoEmChatProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleOpen = controlledOnToggle || (() => setInternalIsOpen((prev) => !prev));
  
  const closeChat = () => {
    if (controlledOnToggle && controlledIsOpen) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  const initialMessage: ChatMessage = useMemo(
    () => ({
      id: "welcome",
      sender: "coem",
      text: coem.chat.chaoDau,
      thoiGian: Date.now(),
    }),
    []
  );

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const tenTrangPhucHienTai = selectedTrangPhucId
    ? trangPhuc.find((t) => t.id === selectedTrangPhucId)?.ten
    : undefined;

  // Danh sách câu hỏi gợi ý thông minh linh hoạt theo bối cảnh
  const danhSachGoiY = useMemo(() => {
    const list: string[] = [];
    if (tenTrangPhucHienTai) {
      list.push(`Kể thêm về ${tenTrangPhucHienTai}`);
      list.push(`Nên phối phụ kiện gì với ${tenTrangPhucHienTai}?`);
    }
    list.push("Áo tứ thân Kinh Bắc có gì đặc sắc?");
    list.push("5 khuy áo ngũ thân có ý nghĩa gì?");
    list.push("Áo bà ba & chiếc khăn rằn Nam Bộ");
    list.push("Lụa Vạn Phúc & Lãnh Mỹ A khác nhau sao?");
    list.push("Gợi ý trang phục đi dự lễ cưới thanh lịch");
    return list;
  }, [tenTrangPhucHienTai]);

  // Kiểm tra hỗ trợ nhận dạng giọng nói (Web Speech API)
  const isSpeechSupported = typeof window !== "undefined" && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  const toggleSpeechRecognition = () => {
    if (!isSpeechSupported) return;

    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.lang = "vi-VN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = async (cauHoiGui?: string) => {
    const textToSend = (cauHoiGui ?? inputVal).trim();
    if (!textToSend || loading) return;

    setInputVal("");
    if (isListening && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: textToSend,
      thoiGian: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await hoiCoVanVanHoa(textToSend, {
        trangPhucId: selectedTrangPhucId,
        mauId,
        phuKienIds,
      });

      const botMsg: ChatMessage = {
        id: "b_" + Date.now(),
        sender: "coem",
        text: res.cauTraLoi,
        nguonIds: res.nguonIds,
        isError: res.loi,
        thoiGian: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "coem",
          text: coem.common.error,
          isError: true,
          thoiGian: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome_" + Date.now(),
        sender: "coem",
        text: coem.chat.chaoDau,
        thoiGian: Date.now(),
      },
    ]);
  };

  const handleCopyText = async (id: string, text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      // Bỏ qua lỗi copy
    }
  };

  const layTenNguon = (id: string) => {
    const found = nguon.find((n) => n.id === id);
    return found ? found.ten : id;
  };

  const handleBaoSai = (messageText: string) => {
    openGiuChuanVanHoa(`Cò Em Chat: "${messageText.slice(0, 80)}..."`);
  };

  const formatThoiGian = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Nút chat nổi ở góc: Cò Em nhỏ đặc trưng */}
      {!hideTrigger && (
        <button
          type="button"
          onClick={toggleOpen}
          className="fixed bottom-5 right-5 z-40 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer group"
          aria-label={coem.chat.nutMoChat}
          title="Trò chuyện với Cố vấn Cò Em"
          style={{
            width: "56px",
            height: "56px",
          }}
        >
          {/* Vầng sáng vàng ấm lan tỏa */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-35 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(202, 138, 4, 0.6) 0%, rgba(234, 179, 8, 0.2) 70%, transparent 100%)",
              animationDuration: "3s",
            }}
          />

          {/* Nền tròn viền vàng di sản */}
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center border shadow-lg overflow-hidden bg-white"
            style={{
              borderColor: "var(--vang-chinh)",
              boxShadow: "0 6px 20px rgba(26, 48, 34, 0.15), 0 0 12px rgba(234, 179, 8, 0.3)",
            }}
          >
            {/* Cò Em Mascot */}
            <div className="w-11 h-11 flex items-center justify-center transform translate-y-0.5">
              <CoMascot size={46} mood="cuoi" animate={true} />
            </div>

            {/* Dấu chấm báo trạng thái */}
            <span
              className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-white ${
                loading ? "bg-amber-400 animate-pulse" : "bg-[var(--xanh-la)]"
              }`}
              style={{
                boxShadow: loading ? "0 0 6px rgba(245, 158, 11, 0.8)" : "0 0 6px var(--xanh-la)",
              }}
            />
          </div>
        </button>
      )}

      {/* Cửa sổ chat / Bong bóng Cò Em */}
      {isOpen && (
        <div
          className="fixed bottom-[calc(var(--dock-h,64px)+16px)] right-4 md:right-6 z-50 w-[94vw] max-w-[385px] h-[525px] max-h-[calc(100vh-var(--top-bar-h,56px)-var(--dock-h,64px)-28px)] flex flex-col border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{
            background: "var(--nen-the)",
            borderColor: "var(--vien-the)",
            borderRadius: "var(--vien-lech-a)",
            boxShadow: "var(--shadow-the)",
            color: "var(--chu-chinh, #0F172A)",
          }}
        >
          {/* Header */}
          <div
            className="p-3 px-4 border-b flex items-center justify-between"
            style={{
              borderColor: "var(--vien-the)",
              background: "var(--nen-the-phu)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border overflow-hidden bg-white shadow-xs"
                style={{
                  borderColor: "var(--vang-chinh)",
                }}
              >
                <CoMascot size={32} mood="cuoi" animate={false} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3
                    className="text-sm font-semibold leading-tight text-[var(--nen-toi)]"
                    style={{ fontFamily: "var(--font-than)" }}
                  >
                    {coem.chat.tieuDe}
                  </h3>
                  <span
                    className="text-[10px] px-1.5 py-0.2 border rounded font-semibold bg-[var(--xanh-nhe)] border-[var(--xanh-mint)] text-[var(--xanh-chinh)]"
                  >
                    {coem.chat.phuDe}
                  </span>
                </div>
                {tenTrangPhucHienTai ? (
                  <p className="text-[11px] mt-0.5 truncate max-w-[190px] text-[var(--tro-tram)]">
                    {coem.chat.dangXem}: <span className="font-semibold text-[var(--vang-chinh)]">{tenTrangPhucHienTai}</span>
                  </p>
                ) : (
                  <p className="text-[10.5px] mt-0.5 text-emerald-600 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Sẵn sàng giải đáp tức thì
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Nút làm mới cuộc trò chuyện */}
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-full border border-[var(--vien-the)] bg-[var(--nen-the)] hover:bg-stone-100 text-[var(--chu-phu)] transition-colors cursor-pointer shadow-xs"
                title="Làm mới cuộc trò chuyện"
                aria-label="Làm mới trò chuyện"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
              </button>

              {/* Nút đóng */}
              <button
                type="button"
                onClick={closeChat}
                className="px-2.5 py-1 rounded-full text-xs font-bold border border-[var(--vien-the)] bg-[var(--nen-the)] hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-[var(--chu-phu)] transition-colors cursor-pointer shadow-xs"
                aria-label={coem.chat.dongChat}
                title="Đóng cửa sổ trò chuyện"
              >
                ✕ Đóng
              </button>
            </div>
          </div>

          {/* Quick suggestion chips (cuộn ngang mượt mà) */}
          <div
            className="p-2 px-3 border-b flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth"
            style={{ borderColor: "var(--vien-the)", background: "var(--nen-the-phu)" }}
          >
            {danhSachGoiY.map((cauGoiY, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleSend(cauGoiY)}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 border transition-all text-left cursor-pointer hover:border-amber-500 hover:text-amber-700 font-medium shrink-0 active:scale-95 shadow-2xs"
                style={{
                  borderColor: "var(--vien-the)",
                  color: "var(--chu-chinh, #0F172A)",
                  background: "var(--nen-the)",
                  borderRadius: "var(--vien-lech-b)",
                }}
              >
                💬 {cauGoiY}
              </button>
            ))}
          </div>

          {/* Vùng tin nhắn cuộn */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className="p-2.5 px-3 rounded-lg max-w-[88%] leading-relaxed border group"
                    style={{
                      background: isUser
                        ? "var(--nen-the-phu)"
                        : "var(--nen-the)",
                      color: "var(--chu-chinh, #0F172A)",
                      borderColor: isUser
                        ? "var(--vang-chinh)"
                        : m.isError
                        ? "rgba(239, 68, 68, 0.5)"
                        : "var(--vien-the)",
                      borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                    {/* Chip nguồn dưới mỗi câu trả lời */}
                    {m.nguonIds && m.nguonIds.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t flex flex-wrap gap-1 items-center" style={{ borderColor: "rgba(217, 164, 65, 0.2)" }}>
                        <span className="text-[10px] text-stone-400">Nguồn:</span>
                        {m.nguonIds.map((nid) => (
                          <span
                            key={nid}
                            className="text-[10px] px-1.5 py-0.5 border rounded"
                            style={{
                              borderColor: "rgba(217, 164, 65, 0.3)",
                              color: "var(--vang-chinh)",
                              background: "rgba(217, 164, 65, 0.12)",
                            }}
                          >
                            📖 {layTenNguon(nid)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Thanh công cụ phụ: Thời gian, Sao chép & Báo sai */}
                    <div className="mt-2 pt-1 border-t border-stone-200/40 flex items-center justify-between text-[10px] text-stone-400">
                      <span>{formatThoiGian(m.thoiGian)}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyText(m.id, m.text)}
                          className="px-1.5 py-0.5 rounded border border-transparent hover:border-stone-300 text-[10px] text-[var(--chu-mo)] hover:text-amber-700 transition-colors cursor-pointer"
                          title="Sao chép nội dung tin nhắn"
                        >
                          {copiedId === m.id ? "✓ Đã chép" : "📋 Chép"}
                        </button>

                        {!isUser && m.id !== "welcome" && (
                          <button
                            type="button"
                            onClick={() => handleBaoSai(m.text)}
                            className="px-1.5 py-0.5 rounded border border-transparent hover:border-amber-300 text-[10px] text-[var(--chu-mo)] hover:text-amber-600 transition-colors cursor-pointer"
                            title="Góp ý hoặc báo sai sót văn hóa về câu trả lời này"
                          >
                            🚩 {coem.chat.baoSai}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Trạng thái đang tìm: Cò Em đang lật tìm câu trả lời */}
            {loading && (
              <div className="flex items-start gap-2">
                <div
                  className="p-2.5 px-3 rounded-lg border max-w-[85%] flex items-center gap-2.5 bg-[var(--nen-the-phu)] border-[var(--vien-the)] text-[var(--vang-chinh)] shadow-xs animate-pulse"
                  style={{
                    borderRadius: "12px 12px 12px 2px",
                  }}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <CoMascot size={20} mood="nghi" animate={true} />
                  </div>
                  <span className="italic text-[11.5px] font-medium text-amber-800 dark:text-amber-300">
                    {coem.chat.dangTim}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập liệu chân cửa sổ */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 px-3 border-t bg-[var(--nen-the-phu)] border-[var(--vien-the)] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              disabled={loading}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={isListening ? "Đang lắng nghe giọng bạn..." : coem.chat.placeholder}
              className={`flex-1 bg-[var(--nen-the)] border text-[var(--chu-chinh)] text-xs px-2.5 py-2 rounded-lg focus:outline-none transition-colors placeholder:text-[var(--chu-mo)] ${
                isListening ? "border-amber-500 ring-2 ring-amber-300/40" : "border-[var(--vien-the)] focus:border-[var(--vang-chinh)]"
              }`}
            />

            {/* Nút nhập bằng giọng nói tiếng Việt */}
            {isSpeechSupported && (
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                disabled={loading}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                    : "bg-[var(--nen-the)] border-[var(--vien-the)] text-[var(--chu-phu)] hover:text-amber-600 hover:border-amber-400"
                }`}
                title={isListening ? "Đang ghi âm (nhấn để dừng)" : "Nhập câu hỏi bằng giọng nói tiếng Việt"}
                aria-label="Nhập bằng giọng nói"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="px-3.5 py-2 text-xs font-bold border border-[var(--vang-chinh)] bg-[var(--vang-chinh)] text-white hover:brightness-110 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              style={{
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              {coem.chat.nutGui}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
