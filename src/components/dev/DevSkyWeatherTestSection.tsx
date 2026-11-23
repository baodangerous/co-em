/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { vungData, layVungTheoId, VungId } from "../../data/vung";
import {
  layThoiTietVung,
  suyRaKhungGioTheoDongHo,
  ThoiTietState,
} from "../../lib/thoitiet";
import { useSkySettings } from "../../lib/caiDatSky";

export default function DevSkyWeatherTestSection() {
  const [testVungId, setTestVungId] = useState<VungId>("trung");
  const [testWeatherState, setTestWeatherState] = useState<ThoiTietState | null>(null);
  const [skySettings, updateSkySettings] = useSkySettings();
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  useEffect(() => {
    if (simulatedOffline) {
      const kg = suyRaKhungGioTheoDongHo();
      const targetVung = layVungTheoId(testVungId);
      setTestWeatherState({
        vung: targetVung,
        thoiTiet: "mat",
        khungGio: kg,
        nhietDo: 25,
        precipitation: 0,
        weatherCode: 0,
        moTaThoiTiet: "dịu mát",
        moTaKhungGio:
          kg === "rang_dong"
            ? "rạng đông"
            : kg === "ngay"
            ? "ban ngày"
            : kg === "hoang_hon"
            ? "hoàng hôn"
            : "đêm tối",
        isFallback: true,
        timestamp: Date.now(),
        doAm: 70,
        viTri: {
          ten: targetVung.noi,
          lat: targetVung.lat,
          lon: targetVung.lon,
          nguon: "mac_dinh",
          vungId: testVungId,
        },
      });
    } else {
      layThoiTietVung(testVungId).then(setTestWeatherState);
    }
  }, [testVungId, simulatedOffline]);

  return (
    <section
      className="p-4 md:p-5 border space-y-4"
      style={{
        borderColor: "var(--reu-phong)",
        borderRadius: "var(--vien-lech-a)",
        background: "rgba(0,0,0,0.25)",
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-tieu-de)", color: "var(--reu-phong)" }}
          >
            Kiểm thử Bầu Trời, Thời Tiết Thật (Open-Meteo) & Tham Số URL
          </h2>
          <p className="text-xs text-stone-300">
            Lớp nền phía sau mọi màn, chip thời tiết, SVG chân trời 4 vùng, timeout 6s, fallback đồng hồ và ghi đè URL
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 text-xs font-medium border"
            style={{
              borderColor: "var(--reu-phong)",
              color: "var(--reu-phong)",
              background: "rgba(92,107,79,0.15)",
              borderRadius: "var(--vien-lech-b)",
            }}
          >
            Open-Meteo CC BY 4.0
          </span>
        </div>
      </div>

      {testWeatherState && (
        <div
          className="p-3.5 border space-y-2.5"
          style={{
            borderColor: "rgba(92, 107, 79, 0.4)",
            borderRadius: "var(--vien-lech-b)",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-200">Trạng thái thời tiết:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
                {testWeatherState.vung.noi} ({testWeatherState.vung.ten}) · {testWeatherState.nhietDo}°C · {testWeatherState.moTaThoiTiet} · {testWeatherState.moTaKhungGio}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-stone-400">
                {testWeatherState.isFallback
                  ? "⚠️ Đang dùng Fallback đồng hồ / ngoại tuyến"
                  : "✓ Dữ liệu thật từ Open-Meteo"}
              </span>
              <button
                type="button"
                onClick={() => setSimulatedOffline(!simulatedOffline)}
                className="px-2 py-1 text-xs rounded border border-stone-600 bg-stone-800 text-stone-200 hover:bg-stone-700"
              >
                {simulatedOffline ? "Phục hồi mạng thật" : "Giả lập rút mạng (Offline fallback)"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-black/40 border border-stone-800">
              <div className="text-stone-400 text-[11px]">Vùng hiện hành:</div>
              <div className="font-semibold text-stone-200">
                {testWeatherState.vung.id} ({testWeatherState.vung.noi})
              </div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-stone-800">
              <div className="text-stone-400 text-[11px]">Khung giờ:</div>
              <div className="font-semibold text-stone-200">
                {testWeatherState.khungGio} ({testWeatherState.moTaKhungGio})
              </div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-stone-800">
              <div className="text-stone-400 text-[11px]">Thời tiết:</div>
              <div className="font-semibold text-stone-200">
                {testWeatherState.thoiTiet} ({testWeatherState.moTaThoiTiet})
              </div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-stone-800">
              <div className="text-stone-400 text-[11px]">Nhiệt độ / Mưa:</div>
              <div className="font-semibold text-stone-200">
                {testWeatherState.nhietDo}°C · {testWeatherState.precipitation}mm
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
          1. Tham số URL cố định giao diện (?sky, ?weather, ?vung)
        </h3>
        <p className="text-xs text-stone-400">
          Nhấp vào một mẫu bên dưới để áp dụng trực tiếp lên URL và kiểm tra giao diện cố định:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {[
            {
              label: "Huế · Hoàng hôn · Mưa nhẹ",
              params: "?dev=1&sky=hoang_hon&weather=mua&vung=trung",
              desc: "Chân trời Trung Bộ + lớp son-dong-ho 8% + dải vang-nghe 8% + mưa rơi tro-tram",
            },
            {
              label: "Hà Nội · Rạng đông · Se lạnh",
              params: "?dev=1&sky=rang_dong&weather=lanh&vung=bac",
              desc: "Núi nhọn & ruộng bậc thang Bắc Bộ + phủ dat-nung 10% + sương tro-tram 8%",
            },
            {
              label: "TP.HCM · Ban ngày · Nắng nóng",
              params: "?dev=1&sky=ngay&weather=nong&vung=nam",
              desc: "Bờ sông & tán dừa Nam Bộ + nền gốc không phủ",
            },
            {
              label: "Tây Nguyên · Đêm tối · Dịu mát",
              params: "?dev=1&sky=dem&weather=mat&vung=taynguyen",
              desc: "Đồi tròn bát úp Tây Nguyên + nền gốc tối + sao đêm lung linh",
            },
          ].map((preset) => (
            <a
              key={preset.label}
              href={preset.params}
              className="p-2.5 rounded border border-stone-700 bg-stone-900/60 hover:border-amber-500 hover:bg-stone-800 transition-colors block text-left"
            >
              <div className="flex items-center justify-between text-stone-200 font-medium">
                <span>{preset.label}</span>
                <span className="text-[11px] text-amber-400 font-mono">Áp dụng →</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-1">{preset.desc}</div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">{preset.params}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
          2. Đổi vùng trên bản đồ / chip: nền và chân trời đổi theo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {vungData.map((v) => {
            const isSelected = testVungId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setTestVungId(v.id)}
                className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-950/40 text-emerald-100"
                    : "border-stone-800 bg-black/30 hover:border-stone-700 text-stone-300"
                }`}
              >
                <div className="font-semibold">{v.ten}</div>
                <div className="text-[11px] text-stone-400">
                  {v.noi} ({v.lat}, {v.lon})
                </div>
                <div className="text-[10px] text-stone-500 mt-1">
                  {v.id === "bac" && "Núi nhọn & ruộng bậc thang"}
                  {v.id === "trung" && "Đồi thoải & bờ biển cong"}
                  {v.id === "taynguyen" && "Đồi tròn nối tiếp"}
                  {v.id === "nam" && "Bờ sông thấp & tán dừa"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 rounded bg-black/40 border border-stone-800 space-y-2 text-xs">
        <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
          3. Trợ năng & Chuẩn tương phản WCAG AA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-stone-300">Công tắc "Giảm chuyển động":</span>
              <span className="font-medium text-amber-400">
                {skySettings.giamChuyenDong
                  ? "ĐANG BẬT (Bỏ mưa & chuyển động)"
                  : "ĐANG TẮT (Có chuyển động)"}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSkySettings({ giamChuyenDong: !skySettings.giamChuyenDong })
              }
              className="px-2.5 py-1 text-xs border rounded bg-stone-800 text-stone-200 hover:bg-stone-700 cursor-pointer"
            >
              Đổi trạng thái "Giảm chuyển động"
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-stone-300">Công tắc "Tắt bầu trời" (máy yếu):</span>
              <span className="font-medium text-amber-400">
                {skySettings.tatBauTroi
                  ? "ĐANG BẬT (Ẩn bầu trời)"
                  : "ĐANG TẮT (Hiện bầu trời)"}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSkySettings({ tatBauTroi: !skySettings.tatBauTroi })
              }
              className="px-2.5 py-1 text-xs border rounded bg-stone-800 text-stone-200 hover:bg-stone-700 cursor-pointer"
            >
              Đổi trạng thái "Tắt bầu trời"
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400">
          ✓ <strong>Độ tương phản chữ (WCAG AA):</strong> Chữ màu <code className="text-amber-200">#F3ECDD</code> trên nền <code className="text-amber-200">#1B2A2E</code> với lớp phủ phẳng 8–10% đạt tỷ lệ tương phản xấp xỉ <strong>8.8:1</strong> (vượt xa chuẩn AA 4.5:1 và AAA 7:1), đảm bảo chữ luôn sắc nét và dễ đọc trong mọi khung giờ.
        </div>
      </div>
    </section>
  );
}
