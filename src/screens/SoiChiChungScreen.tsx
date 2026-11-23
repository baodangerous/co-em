/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MÀN HÌNH SỢI CHỈ CHUNG (CULTURAL INTERSECTION SCREEN)
 */

import React, { useState, useMemo } from "react";
import { nhom } from "../data/nhom";
import { domdom } from "../copy/domdom";
import { layDiemRiengCuaNhom, suyDiemChung } from "../lib/soiChiChung";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import SoiChiChungPose from "../narrator/poses/SoiChiChungPose";
import CostumeCardPreview from "../components/CostumeCardPreview";
import {
  ArtifactHighlightBox,
  AnnotatedReferenceLinks,
} from "../components/soi-chi/CulturalArtifactVisuals";
import { SOI_CHI_CHUNG_CSS } from "../components/soi-chi/soiChiChungStyles";

interface Props {
  onBack: () => void;
  initialNhomAId?: string;
  initialNhomBId?: string;
  onSelectCostume?: (trangPhucId: string) => void;
}

export default function SoiChiChungScreen({
  onBack,
  initialNhomAId = "kb",
  initialNhomBId = "thai",
  onSelectCostume,
}: Props) {
  const [selectedIdA, setSelectedIdA] = useState<string>(initialNhomAId);
  const [selectedIdB, setSelectedIdB] = useState<string>(
    initialNhomBId !== initialNhomAId ? initialNhomBId : "thai"
  );
  const [mobileTab, setMobileTab] = useState<"all" | "chung" | "a" | "b">("all");

  const nhomA = useMemo(() => {
    return nhom.find((n) => n.id === selectedIdA) ?? nhom[0];
  }, [selectedIdA]);

  const nhomB = useMemo(() => {
    return nhom.find((n) => n.id === selectedIdB) ?? nhom[1];
  }, [selectedIdB]);

  const diemRiengA = useMemo(() => layDiemRiengCuaNhom(nhomA), [nhomA]);
  const diemRiengB = useMemo(() => layDiemRiengCuaNhom(nhomB), [nhomB]);
  const danhSachDiemChung = useMemo(() => suyDiemChung(nhomA, nhomB), [nhomA, nhomB]);

  const handleSwap = () => {
    const temp = selectedIdA;
    setSelectedIdA(selectedIdB);
    setSelectedIdB(temp);
  };

  const getVungLabel = (vungId: string) => {
    switch (vungId) {
      case "bac":
        return "Bắc Bộ & Vùng cao";
      case "trung":
        return "Trung Bộ";
      case "nam":
        return "Nam Bộ";
      case "taynguyen":
        return "Tây Nguyên";
      default:
        return vungId;
    }
  };

  return (
    <main className="soi-chi-screen">
      <style>{SOI_CHI_CHUNG_CSS}</style>
      <div className="soi-chi-screen__noise" aria-hidden="true" />

      {/* ĐẦU TRANG TINH GỌN */}
      <header className="soi-chi-screen__header">
        <div className="flex items-center gap-3">
          <SoiChiChungPose size={56} animate={true} />
          <div>
            <span className="soi-chi-screen__brand-tag">
              Con người · Hiện vật · Nguồn khảo cứu
            </span>
            <h1 className="soi-chi-screen__title">{domdom.soiChiChung.tieuDe}</h1>
            <p className="soi-chi-screen__sub">
              Đối chiếu 16 cộng đồng
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="soi-chi-screen__back-btn"
          aria-label={domdom.soiChiChung.quayLai}
        >
          ← {domdom.soiChiChung.quayLai}
        </button>
      </header>

      {/* KHỐI CHỌN 2 NHÓM CỘNG ĐỒNG */}
      <section className="soi-chi-screen__selectors-bar" aria-label="Chọn 2 nhóm để so sánh">
        <div className="soi-chi-screen__selector-group">
          <label htmlFor="select-nhom-a" className="soi-chi-screen__selector-label">
            Cộng đồng thứ nhất:
          </label>
          <div className="soi-chi-screen__select-wrapper">
            <select
              id="select-nhom-a"
              value={selectedIdA}
              onChange={(e) => setSelectedIdA(e.target.value)}
              className="soi-chi-screen__select"
            >
              {nhom.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.ten} ({getVungLabel(n.vung)})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          className="soi-chi-screen__swap-btn"
          title="Hoán đổi vị trí 2 nhóm"
          aria-label="Hoán đổi hai nhóm"
        >
          ⇄
        </button>

        <div className="soi-chi-screen__selector-group">
          <label htmlFor="select-nhom-b" className="soi-chi-screen__selector-label">
            Cộng đồng thứ hai:
          </label>
          <div className="soi-chi-screen__select-wrapper">
            <select
              id="select-nhom-b"
              value={selectedIdB}
              onChange={(e) => setSelectedIdB(e.target.value)}
              className="soi-chi-screen__select"
            >
              {nhom.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.ten} ({getVungLabel(n.vung)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* GỢI Ý CẶP ĐỐI CHIẾU NHANH */}
      <div className="soi-chi-screen__presets" aria-label="Gợi ý các cặp đối chiếu tiêu biểu">
        <span className="soi-chi-screen__presets-label">Cặp đối chiếu:</span>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("mong");
            setSelectedIdB("dao");
          }}
          className="soi-chi-screen__preset-btn"
        >
          💍 Mông & Dao Đỏ (Chàm & Bạc)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("thai");
            setSelectedIdB("muong");
          }}
          className="soi-chi-screen__preset-btn"
        >
          🥁 Thái & Mường (Cúc bạc & Cạp váy)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("ede");
            setSelectedIdB("bana");
          }}
          className="soi-chi-screen__preset-btn"
        >
          🧵 Ê Đê & Ba Na (Thổ cẩm Tây Nguyên)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("lolo");
            setSelectedIdB("pathen");
          }}
          className="soi-chi-screen__preset-btn"
        >
          🔥 Lô Lô & Pà Thẻn (Sắc màu Hà Giang)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("kb");
            setSelectedIdB("kh");
          }}
          className="soi-chi-screen__preset-btn"
        >
          👘 Bắc Bộ & Cố đô Huế (Giao lĩnh & Áo Tấc)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("tay");
            setSelectedIdB("hanhi");
          }}
          className="soi-chi-screen__preset-btn"
        >
          🌿 Tày & Hà Nhì (Vải chàm & Xu bạc)
        </button>
      </div>

      {/* TABS CHUYỂN ĐỔI GÓC NHÌN TRÊN MÀN HÌNH NHỎ */}
      <div className="soi-chi-screen__mobile-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "all"}
          onClick={() => setMobileTab("all")}
          className={`soi-chi-screen__mobile-tab ${
            mobileTab === "all" ? "soi-chi-screen__mobile-tab--active" : ""
          }`}
        >
          3 Cột
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "chung"}
          onClick={() => setMobileTab("chung")}
          className={`soi-chi-screen__mobile-tab ${
            mobileTab === "chung" ? "soi-chi-screen__mobile-tab--active" : ""
          }`}
        >
          🧵 Giao thoa ({danhSachDiemChung.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "a"}
          onClick={() => setMobileTab("a")}
          className={`soi-chi-screen__mobile-tab ${
            mobileTab === "a" ? "soi-chi-screen__mobile-tab--active" : ""
          }`}
        >
          {nhomA.ten}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "b"}
          onClick={() => setMobileTab("b")}
          className={`soi-chi-screen__mobile-tab ${
            mobileTab === "b" ? "soi-chi-screen__mobile-tab--active" : ""
          }`}
        >
          {nhomB.ten}
        </button>
      </div>

      {/* BỐ CỤC CHÍNH 3 CỘT */}
      <div className={`soi-chi-screen__grid soi-chi-screen__grid--tab-${mobileTab}`}>
        {/* CỘT 1: CON NGƯỜI & ĐỒ VẬT NHÓM A */}
        <section
          className={`soi-col soi-col--group-a ${
            mobileTab === "b" || mobileTab === "chung" ? "soi-col--hidden-mobile" : ""
          }`}
          aria-labelledby="heading-col-a"
        >
          <header className="soi-col__header">
            <span className="soi-col__tag">Cộng đồng 1</span>
            <h2 id="heading-col-a" className="soi-col__title">
              {nhomA.ten}
            </h2>
            <div className="soi-col__badge-row">
              <span className="soi-col__region-badge">{getVungLabel(nhomA.vung)}</span>
              <span className="soi-col__count-badge">
                {diemRiengA.trangPhucs.length} trang phục
              </span>
            </div>
          </header>

          <div className="soi-col__body">
            {diemRiengA.trangPhucs.map((item) => (
              <article key={item.trangPhuc.id} className="soi-costume-card">
                <div className="soi-costume-card__head">
                  <h3 className="soi-costume-card__name">{item.trangPhuc.ten}</h3>
                  {onSelectCostume && (
                    <button
                      type="button"
                      onClick={() => onSelectCostume(item.trangPhuc.id)}
                      className="soi-costume-card__explore-btn"
                    >
                      Phối thử →
                    </button>
                  )}
                </div>

                <div
                  onClick={() => onSelectCostume?.(item.trangPhuc.id)}
                  className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                  title={`Nhấn để thử phối ${item.trangPhuc.ten}`}
                >
                  <CostumeCardPreview
                    trangPhucId={item.trangPhuc.id}
                    className="!h-[210px] !rounded-none"
                  />
                </div>

                <ArtifactHighlightBox doVat={item.doVatDacTrung} />

                <div className="soi-costume-card__facts-list">
                  <div className="soi-fact-item">
                    <span className="soi-fact-item__bullet">🏛️</span>
                    <p className="soi-fact-item__text">
                      <strong>Nguồn gốc & Niên đại:</strong> {item.nguonGocCotLoi}
                    </p>
                  </div>
                  {item.lichSuCotLoi[0] && (
                    <div className="soi-fact-item">
                      <span className="soi-fact-item__bullet">📜</span>
                      <p className="soi-fact-item__text">
                        <strong>Đặc điểm lịch sử:</strong> {item.lichSuCotLoi[0]}
                      </p>
                    </div>
                  )}
                </div>

                <AnnotatedReferenceLinks sources={item.nguonThamKhao} />
              </article>
            ))}
          </div>
        </section>

        {/* CỘT 2 (Ở GIỮA): SỢI CHỈ CHUNG */}
        <section
          className={`soi-col soi-col--center ${
            mobileTab === "a" || mobileTab === "b" ? "soi-col--hidden-mobile" : ""
          }`}
          aria-labelledby="heading-col-center"
        >
          <header className="soi-col__header soi-col__header--center">
            <div className="soi-col__thread-icon" aria-hidden="true">
              🧵
            </div>
            <h2 id="heading-col-center" className="soi-col__title soi-col__title--center">
              {domdom.soiChiChung.soiChiChung}
            </h2>
            <p className="soi-col__sub--center">
              Giao thoa giữa <strong>{nhomA.ten}</strong> & <strong>{nhomB.ten}</strong>
            </p>
          </header>

          <div className="soi-col__body soi-col__body--center">
            {danhSachDiemChung.length > 0 ? (
              <div className="soi-thread-list">
                {danhSachDiemChung.map((item) => (
                  <article key={item.id} className="soi-thread-card">
                    <div className="soi-thread-card__header">
                      <span className="soi-thread-card__icon" aria-hidden="true">
                        {item.bieuTuong}
                      </span>
                      <h3 className="soi-thread-card__title">{item.tieuDe}</h3>
                    </div>

                    {item.trangPhucMinhHoaIds.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {item.trangPhucMinhHoaIds.map((tpId) => (
                          <div
                            key={tpId}
                            onClick={() => onSelectCostume?.(tpId)}
                            className="rounded-lg overflow-hidden border border-amber-300/60 dark:border-amber-500/30 cursor-pointer"
                          >
                            <CostumeCardPreview
                              trangPhucId={tpId}
                              className="!h-[145px] !rounded-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <ArtifactHighlightBox doVat={item.doVatChung} />

                    <div className="soi-thread-card__evidence space-y-1">
                      <div className="text-xs text-slate-800 dark:text-slate-200">
                        <strong>• Nguồn gốc:</strong> {item.nguonGocCotLoi}
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">
                        <strong>• Lịch sử:</strong> {item.lichSuCotLoi}
                      </div>
                    </div>

                    <AnnotatedReferenceLinks sources={item.nguonThamKhao} />
                  </article>
                ))}
              </div>
            ) : (
              <div className="soi-nodata-box">
                <span className="soi-nodata-box__icon" aria-hidden="true">
                  🌾
                </span>
                <p className="soi-nodata-box__text">{domdom.common.noData}</p>
                <p className="soi-nodata-box__sub">
                  Chưa ghi nhận điểm giao thoa trực tiếp giữa {nhomA.ten} và {nhomB.ten}.
                </p>
                <button
                  type="button"
                  onClick={() => openGiuChuanVanHoa("Sợi chỉ chung")}
                  className="soi-nodata-box__link-btn"
                >
                  Đóng góp nguồn tư liệu khảo cứu →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CỘT 3: CON NGƯỜI & ĐỒ VẬT NHÓM B */}
        <section
          className={`soi-col soi-col--group-b ${
            mobileTab === "a" || mobileTab === "chung" ? "soi-col--hidden-mobile" : ""
          }`}
          aria-labelledby="heading-col-b"
        >
          <header className="soi-col__header">
            <span className="soi-col__tag">Cộng đồng 2</span>
            <h2 id="heading-col-b" className="soi-col__title">
              {nhomB.ten}
            </h2>
            <div className="soi-col__badge-row">
              <span className="soi-col__region-badge">{getVungLabel(nhomB.vung)}</span>
              <span className="soi-col__count-badge">
                {diemRiengB.trangPhucs.length} trang phục
              </span>
            </div>
          </header>

          <div className="soi-col__body">
            {diemRiengB.trangPhucs.map((item) => (
              <article key={item.trangPhuc.id} className="soi-costume-card">
                <div className="soi-costume-card__head">
                  <h3 className="soi-costume-card__name">{item.trangPhuc.ten}</h3>
                  {onSelectCostume && (
                    <button
                      type="button"
                      onClick={() => onSelectCostume(item.trangPhuc.id)}
                      className="soi-costume-card__explore-btn"
                    >
                      Phối thử →
                    </button>
                  )}
                </div>

                <div
                  onClick={() => onSelectCostume?.(item.trangPhuc.id)}
                  className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                  title={`Nhấn để thử phối ${item.trangPhuc.ten}`}
                >
                  <CostumeCardPreview
                    trangPhucId={item.trangPhuc.id}
                    className="!h-[210px] !rounded-none"
                  />
                </div>

                <ArtifactHighlightBox doVat={item.doVatDacTrung} />

                <div className="soi-costume-card__facts-list">
                  <div className="soi-fact-item">
                    <span className="soi-fact-item__bullet">🏛️</span>
                    <p className="soi-fact-item__text">
                      <strong>Nguồn gốc & Niên đại:</strong> {item.nguonGocCotLoi}
                    </p>
                  </div>
                  {item.lichSuCotLoi[0] && (
                    <div className="soi-fact-item">
                      <span className="soi-fact-item__bullet">📜</span>
                      <p className="soi-fact-item__text">
                        <strong>Đặc điểm lịch sử:</strong> {item.lichSuCotLoi[0]}
                      </p>
                    </div>
                  )}
                </div>

                <AnnotatedReferenceLinks sources={item.nguonThamKhao} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
