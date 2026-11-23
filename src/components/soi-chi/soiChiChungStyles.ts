/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export const SOI_CHI_CHUNG_CSS = `
.soi-chi-screen {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: var(--chu-chinh, #0f172a);
  font-family: var(--font-than, sans-serif);
}

.soi-chi-screen__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: 0.05;
  pointer-events: none;
  z-index: 1;
}

.soi-chi-screen__header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--nen-the, #ffffff);
  border-bottom: 1px solid var(--vien-the, rgba(217, 164, 65, 0.25));
  gap: 12px;
  flex-wrap: wrap;
}

.soi-chi-screen__brand-tag {
  display: inline-block;
  font-size: var(--size-sm);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vang-chinh, #ca8a04);
  font-weight: 600;
  margin-bottom: 2px;
}

.soi-chi-screen__title {
  font-family: var(--font-tieu-de, serif);
  font-size: var(--size-lg);
  font-weight: 700;
  margin: 0;
  color: var(--chu-chinh, #0f172a);
}

.soi-chi-screen__sub {
  font-size: var(--size-sm);
  color: var(--chu-mo, #64748b);
  margin: 2px 0 0;
}

.soi-chi-screen__back-btn {
  padding: 8px 16px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(202, 138, 4, 0.4));
  color: var(--chu-chinh, #0f172a);
  border-radius: 12px;
  font-size: var(--size-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.soi-chi-screen__back-btn:hover {
  background: var(--vang-chinh, #ca8a04);
  color: #ffffff;
}

/* THANH CHỌN 2 NHÓM */
.soi-chi-screen__selectors-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 20px;
  background: var(--nen-the, #ffffff);
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  flex-wrap: wrap;
}

.soi-chi-screen__selector-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 220px;
  max-width: 340px;
}

.soi-chi-screen__selector-label {
  font-size: var(--size-sm);
  color: var(--vang-chinh, #ca8a04);
  font-weight: 600;
}

.soi-chi-screen__select-wrapper {
  position: relative;
}

.soi-chi-screen__select {
  width: 100%;
  padding: 8px 12px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1.5px solid var(--vien-the, rgba(202, 138, 4, 0.4));
  border-radius: 12px;
  color: var(--chu-chinh, #0f172a);
  font-size: var(--size-md);
  font-family: var(--font-than, sans-serif);
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
}

.soi-chi-screen__select:focus {
  border-color: var(--vang-chinh, #ca8a04);
  box-shadow: 0 0 0 2px rgba(202, 138, 4, 0.2);
}

.soi-chi-screen__swap-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-top: 18px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1.5px solid var(--vang-chinh, #ca8a04);
  border-radius: 50%;
  color: var(--vang-chinh, #ca8a04);
  font-size: var(--size-lg);
  cursor: pointer;
  transition: all 0.2s ease;
}

.soi-chi-screen__swap-btn:hover {
  background: var(--vang-chinh, #ca8a04);
  color: #ffffff;
  transform: rotate(180deg);
}

/* THANH GỢI Ý PRESET */
.soi-chi-screen__presets {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--nen-the-phu, #f7faf5);
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.06));
}

.soi-chi-screen__presets-label {
  font-size: var(--size-sm);
  color: var(--chu-mo, #64748b);
  white-space: nowrap;
  font-weight: 600;
}

.soi-chi-screen__preset-btn {
  padding: 4px 10px;
  background: var(--nen-the, #ffffff);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.12));
  border-radius: 12px;
  color: var(--chu-phu, #334155);
  font-size: var(--size-sm);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.soi-chi-screen__preset-btn:hover {
  border-color: var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
  background: var(--nen-the-phu, #f7faf5);
}

/* MOBILE TABS */
.soi-chi-screen__mobile-tabs {
  position: relative;
  z-index: 10;
  display: none;
  overflow-x: auto;
  gap: 6px;
  padding: 8px 16px;
  background: var(--nen-the, #ffffff);
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
}

@media (max-width: 860px) {
  .soi-chi-screen__mobile-tabs {
    display: flex;
  }
}

.soi-chi-screen__mobile-tab {
  padding: 6px 12px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.12));
  border-radius: 12px;
  color: var(--chu-phu, #334155);
  font-size: var(--size-sm);
  white-space: nowrap;
  cursor: pointer;
}

.soi-chi-screen__mobile-tab--active {
  background: rgba(202, 138, 4, 0.15);
  border-color: var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
  font-weight: 600;
}

/* GRID 3 CỘT */
.soi-chi-screen__grid {
  position: relative;
  z-index: 10;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr minmax(300px, 1.2fr) 1fr;
  gap: 16px;
  padding: 18px;
  align-items: start;
}

@media (max-width: 860px) {
  .soi-chi-screen__grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 12px;
  }

  .soi-col--hidden-mobile {
    display: none !important;
  }
}

/* KHỐI CỘT */
.soi-col {
  background: var(--nen-the, #ffffff);
  border: 1px solid var(--vien-the, rgba(202, 138, 4, 0.25));
  border-radius: var(--vien-lech-a, 4px 18px 6px 20px);
  box-shadow: var(--shadow-the, 0 4px 20px rgba(0, 0, 0, 0.06));
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;
}

.soi-col--center {
  background: var(--nen-the, #ffffff);
  border: 2px solid var(--vang-chinh, #ca8a04);
  box-shadow: 0 8px 30px rgba(202, 138, 4, 0.12);
}

.soi-col__header {
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
}

.soi-col__header--center {
  text-align: center;
  border-bottom-color: var(--vien-the, rgba(202, 138, 4, 0.3));
}

.soi-col__tag {
  display: inline-block;
  font-size: var(--size-sm);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vang-chinh, #ca8a04);
  margin-bottom: 2px;
  font-weight: 600;
}

.soi-col__thread-icon {
  font-size: var(--size-lg);
  margin-bottom: 2px;
}

.soi-col__title {
  font-family: var(--font-tieu-de, serif);
  font-size: var(--size-lg);
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--chu-chinh, #0f172a);
  line-height: 1.3;
}

.soi-col__title--center {
  color: var(--vang-chinh, #ca8a04);
  font-size: var(--size-lg);
}

.soi-col__sub--center {
  font-size: var(--size-sm);
  color: var(--chu-mo, #64748b);
  margin: 0;
}

.soi-col__badge-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.soi-col__region-badge {
  padding: 2px 8px;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid var(--vang-chinh, #ca8a04);
  border-radius: 12px;
  color: var(--vang-chinh, #ca8a04);
  font-size: var(--size-sm);
  font-weight: 600;
}

.soi-col__count-badge {
  padding: 2px 8px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.1));
  border-radius: 12px;
  color: var(--chu-phu, #334155);
  font-size: var(--size-sm);
}

.soi-col__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* THẺ TRANG PHỤC Ở CỘT RIÊNG */
.soi-costume-card {
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.soi-costume-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.soi-costume-card__name {
  font-family: var(--font-tieu-de, serif);
  font-size: var(--size-lg);
  font-weight: 700;
  margin: 0;
  color: var(--chu-chinh, #0f172a);
}

.soi-costume-card__explore-btn {
  background: none;
  border: none;
  color: var(--vang-chinh, #ca8a04);
  font-size: var(--size-sm);
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  text-decoration: underline;
}

.soi-costume-card__facts-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.soi-fact-item {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.soi-fact-item__bullet {
  font-size: var(--size-sm);
  flex-shrink: 0;
}

.soi-fact-item__text {
  font-size: var(--size-sm);
  color: var(--chu-chinh, #0f172a);
  line-height: 1.45;
  margin: 0;
}

/* DANH SÁCH THẺ SỢI CHỈ CHUNG */
.soi-thread-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.soi-thread-card {
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(202, 138, 4, 0.3));
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.soi-thread-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.soi-thread-card__icon {
  font-size: var(--size-lg);
}

.soi-thread-card__title {
  font-family: var(--font-tieu-de, serif);
  font-size: var(--size-lg);
  font-weight: 700;
  color: var(--vang-chinh, #ca8a04);
  margin: 0;
}

.soi-thread-card__evidence {
  padding: 8px 10px;
  background: var(--nen-the, #ffffff);
  border-radius: 12px;
  border-left: 3px solid var(--vang-chinh, #ca8a04);
}

/* HỘP KHÔNG CÓ DỮ LIỆU ĐIỂM CHUNG TRỰC TIẾP */
.soi-nodata-box {
  text-align: center;
  padding: 24px 16px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px dashed var(--vien-the, rgba(0, 0, 0, 0.15));
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.soi-nodata-box__icon {
  font-size: var(--size-lg);
}

.soi-nodata-box__text {
  font-family: var(--font-tieu-de, serif);
  font-size: var(--size-md);
  color: var(--chu-chinh, #0f172a);
  font-style: normal;
  font-weight: 700;
  margin: 0;
}

.soi-nodata-box__sub {
  font-size: var(--size-sm);
  color: var(--chu-mo, #64748b);
  line-height: 1.45;
  margin: 0;
  max-width: 320px;
}

.soi-nodata-box__link-btn {
  margin-top: 4px;
  background: none;
  border: none;
  color: var(--vang-chinh, #ca8a04);
  font-size: var(--size-sm);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-weight: 600;
}
`;
