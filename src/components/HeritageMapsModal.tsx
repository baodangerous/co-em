/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MapPin, Navigation, ExternalLink, RefreshCw, X, Sparkles, Building2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const REGION_SUGGESTIONS = [
  { name: "Hà Nội & Bắc Bộ", query: "Làng lụa Vạn Phúc Hà Đông và Hoàng Thành Thăng Long" },
  { name: "Cố Đô Huế", query: "Đại Nội Huế, Làng nón bài thơ Tây Hồ và cổ vật triều Nguyễn" },
  { name: "Quảng Nam & Hội An", query: "Làng dệt lụa Mã Châu và phố cổ Hội An" },
  { name: "Tây Nguyên", query: "Làng dệt thổ cẩm Đắk Lắk và không gian văn hóa cồng chiêng" },
  { name: "Nam Bộ & Miền Tây", query: "Chợ Bến Thành và làng nghề dệt chiếu Tân Châu" },
];

export default function HeritageMapsModal({ isOpen, onClose, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery || REGION_SUGGESTIONS[0].query);
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string>("");
  const [places, setPlaces] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMapsGrounding = async (targetQuery = query) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/maps/heritage-places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: targetQuery }),
      });

      const data = await res.json();
      if (data.ok && data.data) {
        setResultText(data.data.text || "");
        setPlaces(data.data.places || []);
      } else {
        setErrorMsg(data.error || "Không thể tải thông tin địa điểm.");
      }
    } catch {
      setErrorMsg("Không thể kết nối đến dịch vụ Google Maps.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !resultText) {
      fetchMapsGrounding(query);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-400/40 dark:border-emerald-500/20 text-slate-800 dark:text-slate-100 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-emerald-600" />
          Bản Đồ Di Sản Thực Tế
        </div>

        <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-1">
          Bản Đồ Di Tích & Làng Nghề Cổ Phục
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
          Tra cứu vị trí làng nghề dệt lụa và bảo tàng di sản từ Google Maps.
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {REGION_SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(item.query);
                fetchMapsGrounding(item.query);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              {item.name}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchMapsGrounding();
          }}
          className="flex gap-2 mb-4"
        >
          <div className="relative flex-1">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập tên di tích, làng nghề dệt lụa..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-full shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Tìm Kiếm</span>
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left text-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              <p>Đang tra cứu địa điểm trên Google Maps...</p>
            </div>
          ) : errorMsg ? (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs">
              {errorMsg}
            </div>
          ) : (
            <>
              {resultText && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 whitespace-pre-line text-slate-800 dark:text-slate-200 text-sm">
                  {resultText}
                </div>
              )}

              {places.length > 0 && (
                <div className="space-y-2 mt-3">
                  <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Địa Điểm Xác Thực:
                  </h4>
                  {places.map((place, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-sm text-emerald-900 dark:text-emerald-200 truncate m-0">
                          {place.title || place.uri || `Địa điểm ${idx + 1}`}
                        </p>
                        {place.uri && (
                          <p className="text-xs text-slate-500 truncate m-0">{place.uri}</p>
                        )}
                      </div>
                      {place.uri && (
                        <a
                          href={place.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1 text-xs font-semibold flex-shrink-0"
                        >
                          <span>Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
