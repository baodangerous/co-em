/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { TrangPhuc } from "../types";
import { domdom } from "../copy/coem";
import {
  ThoiTietId,
  TEN_THOI_TIET,
  GoiYCondition,
  locTrangPhucGoiY,
  layCauGiaiThichGoc,
} from "../lib/rules";
import { keGoiYThoiTiet } from "../lib/loiKe";
import { docViTriSession } from "../lib/thoitiet";
import { Sun, Wind, Snowflake, CloudRain, Sparkles, X, type LucideIcon } from "lucide-react";

interface Props {
  onSelectTrangPhuc: (trangPhucId: string) => void;
  onApplyToMainList?: (filteredIds: string[] | null) => void;
  initialCondition?: GoiYCondition;
}

const THOI_TIET_OPTIONS: { id: ThoiTietId; ten: string; icon: LucideIcon }[] = [
  { id: "nong", ten: "Nắng nóng", icon: Sun },
  { id: "mat", ten: "Dịu mát", icon: Wind },
  { id: "lanh", ten: "Se lạnh", icon: Snowflake },
  { id: "mua", ten: "Trời mưa", icon: CloudRain },
];

const DIP_OPTIONS: { id: string; ten: string }[] = [
  { id: "khai_giang", ten: "Khai giảng" },
  { id: "tet", ten: "Tết" },
  { id: "cuoi", ten: "Cưới hỏi" },
  { id: "le_hoi", ten: "Lễ hội" },
  { id: "doi_thuong", ten: "Đời thường" },
  { id: "hoi_lang", ten: "Hội làng" },
  { id: "cho_phien", ten: "Chợ phiên" },
];

export default function GoiYFloatingCard({
  onSelectTrangPhuc,
  onApplyToMainList,
  initialCondition,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThoiTiet, setSelectedThoiTiet] = useState<ThoiTietId | null>(
    (initialCondition?.thoiTiet as ThoiTietId) || null
  );
  const [selectedDip, setSelectedDip] = useState<string | null>(
    initialCondition?.dip || null
  );

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("vpr:open-goi-y", handleOpen);
    return () => window.removeEventListener("vpr:open-goi-y", handleOpen);
  }, []);

  const condition: GoiYCondition = useMemo(
    () => ({
      thoiTiet: selectedThoiTiet,
      dip: selectedDip,
    }),
    [selectedThoiTiet, selectedDip]
  );

  const filteredCostumes: TrangPhuc[] = useMemo(() => {
    return locTrangPhucGoiY(condition);
  }, [condition]);

  const cauHienThi = useMemo(() => {
    if (selectedThoiTiet) {
      const sessionViTri = docViTriSession();
      const tenDip = selectedDip ? domdom.s2.tenDip[selectedDip] ?? selectedDip : "";
      const noiText = sessionViTri ? sessionViTri.ten : (tenDip ? `Dịp ${tenDip}` : "Hôm nay");
      return keGoiYThoiTiet({
        noi: noiText,
        thoiTiet: selectedThoiTiet,
        soBo: filteredCostumes.length,
      });
    }
    return layCauGiaiThichGoc(condition, filteredCostumes);
  }, [condition, filteredCostumes, selectedThoiTiet, selectedDip]);

  const handleApplySample = () => {
    setSelectedThoiTiet("mua");
    setSelectedDip("khai_giang");
    if (!isOpen) setIsOpen(true);
  };

  const handleReset = () => {
    setSelectedThoiTiet(null);
    setSelectedDip(null);
    if (onApplyToMainList) {
      onApplyToMainList(null);
    }
  };

  const hasFilter = Boolean(selectedThoiTiet || selectedDip);

  return (
    <>
      {isOpen && (
        <div
          className="costume-floating-card"
          role="region"
          aria-label="Thẻ gợi ý trang phục"
        >
          <div className="costume-floating-card__header">
            <div className="costume-floating-card__header-title">
              <span className="w-6 h-6 rounded-md bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="costume-floating-card__title">Gợi ý từ Cò Em</h3>
                <p className="costume-floating-card__sub">
                  Chọn thời tiết hoặc dịp phục sức
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="costume-floating-card__close-btn flex items-center justify-center"
              aria-label="Thu gọn thẻ gợi ý"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="costume-floating-card__body">
            <div className="costume-floating-card__section">
              <label className="costume-floating-card__label">
                Thời tiết
              </label>
              <div className="costume-floating-card__pills">
                {THOI_TIET_OPTIONS.map((tt) => {
                  const isSelected = selectedThoiTiet === tt.id;
                  const IconComp = tt.icon;
                  return (
                    <button
                      key={tt.id}
                      type="button"
                      onClick={() =>
                        setSelectedThoiTiet(isSelected ? null : tt.id)
                      }
                      className={`costume-floating-card__pill inline-flex items-center gap-1.5 ${
                        isSelected ? "costume-floating-card__pill--active" : ""
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      <span>{tt.ten}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="costume-floating-card__section">
              <label className="costume-floating-card__label">
                Dịp phục sức
              </label>
              <div className="costume-floating-card__pills">
                {DIP_OPTIONS.map((d) => {
                  const isSelected = selectedDip === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDip(isSelected ? null : d.id)}
                      className={`costume-floating-card__pill ${
                        isSelected ? "costume-floating-card__pill--active" : ""
                      }`}
                    >
                      <span>{d.ten}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="costume-floating-card__quick-row">
              <button
                type="button"
                onClick={handleApplySample}
                className="costume-floating-card__quick-btn inline-flex items-center gap-1.5"
              >
                <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                <span>Thử mẫu: Mưa + Khai giảng</span>
              </button>
              {hasFilter && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="costume-floating-card__reset-btn"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            <div className="costume-floating-card__explanation-box">
              <div className="costume-floating-card__explanation-header">
                <span className="costume-floating-card__explanation-tag inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Gợi ý Cò Em</span>
                </span>
              </div>

              <p className="costume-floating-card__sentence">
                "{cauHienThi}"
              </p>
            </div>

            <div className="costume-floating-card__results-section">
              <div className="costume-floating-card__results-header">
                <span className="costume-floating-card__results-count">
                  Gợi ý ({filteredCostumes.length} bộ):
                </span>
                {onApplyToMainList && (
                  <button
                    type="button"
                    onClick={() =>
                      onApplyToMainList(filteredCostumes.map((c) => c.id))
                    }
                    className="costume-floating-card__apply-btn"
                  >
                    Lọc màn hình
                  </button>
                )}
              </div>

              <div className="costume-floating-card__costumes-list">
                {filteredCostumes.length === 0 ? (
                  <p className="costume-floating-card__empty">
                    Chưa có trang phục phù hợp điều kiện này.
                  </p>
                ) : (
                  filteredCostumes.map((costume) => (
                    <div
                      key={costume.id}
                      className="costume-floating-card__costume-item"
                    >
                      <div className="costume-floating-card__costume-info">
                        <h4 className="costume-floating-card__costume-name">
                          {costume.ten}
                        </h4>
                        <p className="costume-floating-card__costume-desc">
                          {costume.moTaNgan}
                        </p>
                        <div className="costume-floating-card__costume-tags">
                          <span className="costume-tag">
                            {costume.thoiTiet
                              .map((t) => TEN_THOI_TIET[t] ?? t)
                              .join(", ")}
                          </span>
                          <span className="costume-tag costume-tag--dip">
                            {costume.dip
                              .slice(0, 2)
                              .map((d) => domdom.s2.tenDip[d] ?? d)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectTrangPhuc(costume.id)}
                        className="costume-floating-card__choose-btn"
                      >
                        Chọn →
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .costume-floating-card {
          position: fixed;
          bottom: calc(var(--dock-h, 64px) + 16px);
          right: 16px;
          z-index: 50;
          width: calc(100vw - 32px);
          max-width: 420px;
          max-height: calc(100vh - var(--top-bar-h, 56px) - var(--dock-h, 64px) - 32px);
          overflow-y: auto;
          background: rgba(24, 22, 20, 0.98);
          border: 1px solid var(--vang-nghe);
          border-radius: var(--vien-lech-a);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(14px);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        @media (min-width: 769px) {
          .costume-floating-card {
            bottom: 24px;
            right: 24px;
            max-height: calc(100vh - var(--top-bar-h, 56px) - 48px);
          }
        }

        .costume-floating-card__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 14px 16px 10px;
          border-bottom: 1px solid rgba(138, 129, 117, 0.25);
        }

        .costume-floating-card__header-title {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .costume-floating-card__title {
          margin: 0;
          font-family: var(--font-tieu-de);
          font-size: var(--size-lg);
          color: var(--vang-nghe);
          font-weight: 700;
        }

        .costume-floating-card__sub {
          margin: 2px 0 0;
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--tro-tram);
        }

        .costume-floating-card__close-btn {
          background: transparent;
          border: none;
          color: var(--tro-tram);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .costume-floating-card__close-btn:hover {
          color: var(--nen-sang);
        }

        .costume-floating-card__body {
          padding: 14px 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .costume-floating-card__section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .costume-floating-card__label {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--tro-tram);
          font-weight: 600;
          text-transform: uppercase;
        }

        .costume-floating-card__pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .costume-floating-card__pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          font-size: var(--size-sm);
          font-family: var(--font-than);
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          color: var(--nen-sang);
          border: 1px solid var(--tro-tram);
          border-radius: 999px;
          cursor: pointer;
        }

        .costume-floating-card__pill--active {
          background: rgba(217, 164, 65, 0.22);
          border-color: var(--vang-nghe);
          color: var(--vang-nghe);
        }

        .costume-floating-card__quick-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .costume-floating-card__quick-btn {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 999px;
          background: rgba(92, 107, 79, 0.2);
          border: 1px dashed var(--reu-phong);
          color: #a4be92;
          cursor: pointer;
        }

        .costume-floating-card__reset-btn {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          font-weight: 600;
          color: var(--tro-tram);
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .costume-floating-card__explanation-box {
          padding: 12px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(217, 164, 65, 0.35);
          border-radius: var(--vien-lech-b);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .costume-floating-card__explanation-tag {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--vang-nghe);
          font-weight: 600;
        }

        .costume-floating-card__sentence {
          margin: 0;
          font-family: var(--font-than);
          font-size: var(--size-md);
          color: var(--nen-sang);
        }

        .costume-floating-card__results-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .costume-floating-card__results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .costume-floating-card__results-count {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          font-weight: 600;
          color: var(--tro-tram);
        }

        .costume-floating-card__apply-btn {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(92, 107, 79, 0.25);
          border: 1px solid var(--reu-phong);
          color: #a4be92;
          cursor: pointer;
        }

        .costume-floating-card__costumes-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          max-height: 180px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .costume-floating-card__costume-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(138, 129, 117, 0.3);
          border-radius: var(--vien-lech-b);
          gap: 8px;
        }

        .costume-floating-card__costume-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .costume-floating-card__costume-name {
          margin: 0;
          font-family: var(--font-tieu-de);
          font-size: var(--size-md);
          font-weight: 700;
          color: var(--nen-sang);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .costume-floating-card__costume-desc {
          margin: 0;
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--tro-tram);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .costume-floating-card__costume-tags {
          display: flex;
          gap: 4px;
          margin-top: 2px;
        }

        .costume-tag {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          padding: 1px 6px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--tro-tram);
          border: 1px solid rgba(138, 129, 117, 0.2);
        }

        .costume-tag--dip {
          color: #a4be92;
          background: rgba(92, 107, 79, 0.15);
          border-color: rgba(92, 107, 79, 0.3);
        }

        .costume-floating-card__choose-btn {
          font-family: var(--font-than);
          font-size: var(--size-sm);
          font-weight: 600;
          padding: 6px 12px;
          background: var(--dat-nung);
          color: var(--nen-sang);
          border: none;
          border-radius: 999px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .costume-floating-card__empty {
          margin: 0;
          font-family: var(--font-than);
          font-size: var(--size-sm);
          color: var(--tro-tram);
          text-align: center;
          padding: 12px 0;
        }
      `}</style>
    </>
  );
}
