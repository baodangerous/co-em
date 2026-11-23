/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { VungId } from "../data/vung";
import { ThoiTietState, ThongTinViTri } from "../lib/thoitiet";
import { domdom } from "../copy/coem";
import { locTrangPhucGoiY } from "../lib/rules";
import { keGoiYThoiTiet, dinhDangThoiTietChuoi } from "../lib/loiKe";
import ChonViTriSection from "./ChonViTriSection";
import { CloudRain, Sun, Snowflake, Wind, X } from "lucide-react";

interface Props {
  weatherState: ThoiTietState;
  onSelectVung: (vungId: VungId) => void;
  onSelectCostume?: (trangPhucId: string) => void;
  onViTriChange?: (newViTri: ThongTinViTri) => void;
}

export default function WeatherChip({
  weatherState,
  onSelectVung,
  onSelectCostume,
  onViTriChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const { vung, thoiTiet, khungGio, nhietDo, moTaThoiTiet, doAm, viTri } = weatherState;

  const tenNoi = viTri?.ten || vung.noi;

  const matchingCostumes = locTrangPhucGoiY({ thoiTiet });

  const chipText = dinhDangThoiTietChuoi({
    noi: tenNoi,
    nhietDo,
    thoiTiet,
    moTa: moTaThoiTiet,
  });

  const detailHeaderText = dinhDangThoiTietChuoi({
    noi: tenNoi,
    nhietDo,
    thoiTiet,
    moTa: moTaThoiTiet,
    doAm,
    kemDoAm: true,
  });

  const cauNoiThoiTiet = keGoiYThoiTiet({
    noi: tenNoi,
    nhietDo,
    thoiTiet,
    khungGio,
    moTa: moTaThoiTiet,
    doAm,
    kemDoAm: true,
    soBo: matchingCostumes.length,
  });

  const cauNoiKhungGio = domdom.thoiTiet.cauNoiTheoKhungGio[khungGio] ?? "";

  const renderWeatherIcon = (size = "w-3.5 h-3.5") => {
    switch (thoiTiet) {
      case "mua":
        return <CloudRain className={`${size} text-sky-500`} />;
      case "nong":
        return <Sun className={`${size} text-amber-500`} />;
      case "lanh":
        return <Snowflake className={`${size} text-blue-400`} />;
      default:
        return <Wind className={`${size} text-emerald-500`} />;
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-9 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold font-sans bg-[var(--nen-the-phu)] hover:bg-[var(--xanh-nhe)] text-[var(--chu-chinh)] border border-[var(--vien-the)] hover:border-[var(--xanh-la)] transition cursor-pointer whitespace-nowrap"
        title="Nhấn để xem gợi ý trang phục theo thời tiết"
        aria-label={`Thời tiết: ${chipText}. Nhấn để xem chi tiết.`}
      >
        <span className="flex items-center justify-center shrink-0" aria-hidden="true">
          {renderWeatherIcon("w-3.5 h-3.5")}
        </span>
        <span className="leading-none">{chipText}</span>
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="vpr-weather-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vpr-weather-title"
          >
            <div
              className="vpr-weather-modal__backdrop"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div className="vpr-weather-modal__card">
              <div className="vpr-weather-modal__header">
                <div className="vpr-weather-modal__title-wrap">
                  <span className="vpr-weather-modal__icon" aria-hidden="true">
                    {renderWeatherIcon("w-5 h-5")}
                  </span>
                  <div>
                    <h3 id="vpr-weather-title" className="vpr-weather-modal__title">
                      {domdom.thoiTiet.tieuDeGoiY}
                    </h3>
                    <p className="vpr-weather-modal__sub">
                      {detailHeaderText}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="vpr-weather-modal__close-btn"
                  aria-label={domdom.thoiTiet.dongGoiY}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Đóng</span>
                </button>
              </div>

              <div className="vpr-weather-modal__body">
                <div className="vpr-weather-modal__section">
                  <ChonViTriSection
                    weatherState={weatherState}
                    onViTriChange={(newLoc) => {
                      if (onViTriChange) onViTriChange(newLoc);
                    }}
                    onSelectVung={onSelectVung}
                  />
                </div>

                <div className="vpr-weather-modal__voice-box">
                  <p className="vpr-weather-modal__voice-main">
                    "{cauNoiThoiTiet}"
                  </p>
                  {cauNoiKhungGio && (
                    <p className="vpr-weather-modal__voice-sub">
                      "{cauNoiKhungGio}"
                    </p>
                  )}
                  <span className="vpr-weather-modal__voice-tag">
                    📜 Gợi ý theo luật văn hóa
                  </span>
                </div>

                <div className="vpr-weather-modal__section">
                  <label className="vpr-weather-modal__label">
                    {domdom.thoiTiet.trangPhucPhuHop} ({matchingCostumes.length} bộ):
                  </label>
                  <div className="vpr-weather-modal__costumes">
                    {matchingCostumes.map((c) => (
                      <div key={c.id} className="vpr-costume-item">
                        <div className="vpr-costume-item__info">
                          <span className="vpr-costume-item__name">{c.ten}</span>
                          <span className="vpr-costume-item__desc">{c.moTaNgan}</span>
                        </div>
                        {onSelectCostume && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              onSelectCostume(c.id);
                            }}
                            className="vpr-costume-item__btn"
                          >
                            Xem →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 px-4 rounded-full border border-[var(--vien-the)] bg-[var(--nen-the-phu)] hover:bg-[var(--nen-the)] text-[var(--chu-chinh)] text-xs font-semibold cursor-pointer transition-colors mt-1"
                >
                  ✕ Đóng cửa sổ
                </button>

                <div className="vpr-weather-modal__credit">
                  <span>{domdom.thoiTiet.ghiCong}</span>{" "}
                  <span className="text-stone-400">{domdom.thoiTiet.giayPhep}</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style>{`
        .vpr-weather-chip {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          background: var(--nen-the);
          color: var(--nen-sang);
          border: 1px solid var(--vien-the);
          border-radius: 999px;
          font-family: var(--font-than);
          font-size: var(--size-sm);
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(8px);
          box-shadow: var(--shadow-the);
        }

        .vpr-weather-chip:hover {
          border-color: var(--vang-nghe);
          background: var(--nen-the-phu);
        }

        .vpr-weather-chip__text {
          white-space: nowrap;
          color: var(--nen-sang);
        }

        .vpr-weather-modal {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .vpr-weather-modal__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
        }

        .vpr-weather-modal__card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          max-height: 85vh;
          overflow-y: auto;
          background: var(--nen-the);
          border: 1px solid var(--vien-the);
          border-radius: var(--vien-lech-a);
          box-shadow: var(--shadow-the);
          color: var(--nen-sang);
          box-sizing: border-box;
        }

        .vpr-weather-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(138, 129, 117, 0.25);
        }

        .vpr-weather-modal__title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .vpr-weather-modal__title {
          margin: 0;
          font-family: var(--font-tieu-de);
          font-size: var(--size-lg);
          font-weight: 700;
          color: var(--vang-nghe);
        }

        .vpr-weather-modal__sub {
          margin: 2px 0 0;
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--tro-tram);
        }

        .vpr-weather-modal__close-btn {
          background: var(--nen-the-phu);
          border: 1px solid var(--vien-the);
          border-radius: 9999px;
          color: var(--chu-phu);
          font-family: var(--font-than);
          font-size: var(--size-sm);
          font-weight: 600;
          cursor: pointer;
          padding: 5px 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .vpr-weather-modal__body {
          padding: 16px 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .vpr-weather-modal__section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vpr-weather-modal__label {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          text-transform: uppercase;
          color: var(--tro-tram);
          font-weight: 600;
        }

        .vpr-weather-modal__voice-box {
          padding: 12px 14px;
          background: var(--nen-the-phu);
          border: 1px solid var(--vien-the);
          border-radius: var(--vien-lech-b);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .vpr-weather-modal__voice-main {
          margin: 0;
          font-family: var(--font-than);
          font-size: var(--size-md);
          color: var(--nen-sang);
        }

        .vpr-weather-modal__voice-sub {
          margin: 0;
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--chu-mo);
        }

        .vpr-weather-modal__voice-tag {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--vang-nghe);
          margin-top: 2px;
          font-weight: 600;
        }

        .vpr-weather-modal__costumes {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 170px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .vpr-costume-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 10px;
          background: var(--nen-the-phu);
          border: 1px solid var(--vien-the);
          border-radius: var(--vien-lech-b);
          gap: 8px;
        }

        .vpr-costume-item__info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .vpr-costume-item__name {
          font-family: var(--font-tieu-de);
          font-size: var(--size-md);
          color: var(--nen-sang);
          font-weight: 700;
        }

        .vpr-costume-item__desc {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--chu-mo);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vpr-costume-item__btn {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          padding: 5px 10px;
          border: none;
          border-radius: 999px;
          background: var(--vang-nghe);
          color: #111A1D;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .vpr-weather-modal__credit {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--tro-tram);
          text-align: center;
          margin-top: 4px;
        }
      `}</style>
    </>
  );
}
