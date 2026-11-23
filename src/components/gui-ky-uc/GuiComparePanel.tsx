/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import AvatarSVG from "../AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "../GarmentLayers";
import { NhanVatConfig, tinhSoDo, NHAN_VAT_MAC_DINH } from "../../lib/avatar";
import { trangPhuc } from "../../data/trangphuc";
import { mauSac } from "../../data/mausac";
import { phuKien } from "../../data/phukien";
import { evaluateColor, evaluateRemix } from "../../lib/rules";
import { domdom } from "../../copy/domdom";
import { OutfitSaved } from "../../lib/guiKyUc";

interface GuiComparePanelProps {
  compareOutfits: readonly [OutfitSaved, OutfitSaved];
  globalNhanVatConfig?: NhanVatConfig;
  onCloseCompare: () => void;
}

export default function GuiComparePanel({
  compareOutfits,
  globalNhanVatConfig,
  onCloseCompare,
}: GuiComparePanelProps) {
  return (
    <section className="gui-compare-panel" aria-labelledby="gui-compare-title">
      <div className="gui-compare-panel__head">
        <div className="gui-compare-panel__title-wrap">
          <h2 id="gui-compare-title" className="gui-compare-panel__title">
            {domdom.guiKyUc.soSanhHaiBo}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCloseCompare}
          className="gui-compare-panel__close-btn"
        >
          {domdom.guiKyUc.dongSoSanh} ✕
        </button>
      </div>

      <div className="gui-compare-panel__grid">
        {compareOutfits.map((item, idx) => {
          const tpObj =
            trangPhuc.find((t) => t.id === item.trangPhucId) ?? trangPhuc[0];
          const mauObj =
            mauSac.find((m) => m.id === item.mauId) ?? mauSac[0];
          const pkObjs = item.phuKienIds.map(
            (pkId) => phuKien.find((p) => p.id === pkId) ?? { id: pkId, ten: pkId }
          );

          const charConfig =
            item.nhanVatConfig ?? globalNhanVatConfig ?? NHAN_VAT_MAC_DINH;
          const soDo = tinhSoDo(charConfig);
          const garmentLayers = renderGarmentLayers({
            trangPhucId: item.trangPhucId,
            soDo,
            mauHex: mauObj.hex,
            phuKienIds: item.phuKienIds,
            hoaVanThem: item.hoaVanThem,
            phongCach: item.phongCach,
          });

          const colorEval = evaluateColor(item.mauId, item.phuKienIds);
          const remixEval = evaluateRemix({
            trangPhucId: item.trangPhucId,
            mauId: item.mauId,
            phuKienIds: item.phuKienIds,
            hoaVanThem: item.hoaVanThem,
          });

          return (
            <div key={item.id} className="gui-compare-col">
              <div className="gui-compare-col__tag">
                Bộ {idx === 0 ? "A" : "B"}
              </div>

              <div className="gui-compare-col__avatar">
                <AvatarSVG
                  nhanVat={charConfig}
                  childrenDefs={<CulturalPatternsDefs />}
                  childrenVayQuan={garmentLayers.childrenVayQuan}
                  childrenAo={garmentLayers.childrenAo}
                  childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
                  childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
                />
              </div>

              <h3 className="gui-compare-col__name">{tpObj.ten}</h3>

              <div className="gui-compare-col__detail-row">
                <span className="gui-compare-col__label">Màu sắc:</span>
                <span className="gui-compare-col__color-tag">
                  <span
                    className="gui-compare-col__swatch"
                    style={{ backgroundColor: mauObj.hex }}
                  />
                  {mauObj.ten}
                </span>
              </div>

              <div className="gui-compare-col__detail-row">
                <span className="gui-compare-col__label">Phụ kiện:</span>
                <span className="gui-compare-col__val">
                  {pkObjs.length > 0
                    ? pkObjs.map((p) => p.ten).join(", ")
                    : "Không kèm phụ kiện"}
                </span>
              </div>

              <div className="gui-compare-col__badge-box">
                <div className="gui-badge-title">
                  <span className="gui-badge-dot" />
                  <span>Huy hiệu Màu sắc:</span>{" "}
                  <strong className={`gui-badge-tag gui-badge-tag--${colorEval.ketQua}`}>
                    {colorEval.nhanHienThi}
                  </strong>
                </div>
                <p className="gui-badge-lydo">{colorEval.lyDo}</p>
              </div>

              <div className="gui-compare-col__badge-box">
                <div className="gui-badge-title">
                  <span className="gui-badge-dot" />
                  <span>Huy hiệu Văn hóa:</span>{" "}
                  <strong className={`gui-badge-tag gui-badge-tag--${remixEval.nhan}`}>
                    {remixEval.nhanHienThi}
                  </strong>
                </div>
                <p className="gui-badge-lydo">{remixEval.lyDo}</p>
              </div>

              {item.caption && (
                <div className="gui-compare-col__caption">
                  "{item.caption}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
