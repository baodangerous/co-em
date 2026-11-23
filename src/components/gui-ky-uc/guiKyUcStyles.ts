/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const GUI_KY_UC_CSS = `
.gui-screen {
  position: relative;
  min-height: 100vh;
  background-color: var(--nen-bright);
  color: var(--chu-chinh);
  font-family: var(--font-than);
  overflow-x: hidden;
  padding-bottom: 40px;
}

.gui-screen__noise {
  display: none;
}

.gui-screen__toast {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 70;
  padding: 8px 18px;
  background: #059669;
  color: #ffffff;
  border-radius: 12px;
  font-size: 0.84rem;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  animation: popToast 0.3s ease-out;
}

@keyframes popToast {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.gui-screen__header {
  position: relative;
  z-index: 10;
  max-width: 1080px;
  margin: 12px auto 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border: 1px solid var(--vien-the);
  border-radius: 16px;
  background: var(--nen-the);
  box-shadow: var(--shadow-the);
}

.gui-screen__brand-sub {
  display: block;
  font-size: 0.78rem;
  color: var(--chu-phu);
  margin-top: 2px;
}

.gui-screen__brand-name {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--chu-chinh);
}

.gui-screen__user-tag {
  font-size: 0.85rem;
  color: var(--chu-phu);
  font-weight: 500;
  margin-left: 8px;
  font-family: var(--font-than);
}

.gui-screen__header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.gui-screen__count-badge {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vang-nghe);
  padding: 6px 12px;
  background: var(--nen-the-phu);
  border: 1px solid var(--vien-the);
  border-radius: 10px;
}

.gui-screen__back-btn {
  padding: 6px 12px;
  background: var(--nen-the-phu);
  border: 1px solid var(--vien-the);
  border-radius: 10px;
  color: var(--chu-chinh);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gui-screen__back-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.gui-screen__body {
  position: relative;
  z-index: 2;
  max-width: 1080px;
  margin: 0 auto;
  padding: 20px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ================= SO SÁNH ================= */
.gui-compare-panel {
  padding: 18px 20px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: 16px;
  box-shadow: var(--shadow-the);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.gui-compare-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.gui-compare-panel__title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gui-compare-panel__title {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--chu-chinh);
}

.gui-compare-panel__close-btn {
  background: var(--nen-the-phu);
  border: 1px solid var(--vien-the);
  color: var(--chu-phu);
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.gui-compare-panel__close-btn:hover {
  color: var(--chu-chinh);
  border-color: var(--chu-chinh);
}

.gui-compare-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.gui-compare-col {
  padding: 16px;
  background: var(--nen-the-phu);
  border: 1px solid var(--vien-the);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gui-compare-col__tag {
  align-self: flex-start;
  font-size: 0.75rem;
  padding: 3px 10px;
  background: var(--nen-the);
  color: var(--vang-nghe);
  border: 1px solid var(--vien-the);
  border-radius: 8px;
  font-weight: 700;
}

.gui-compare-col__avatar {
  width: 140px;
  height: 190px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gui-compare-col__name {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--chu-chinh);
  text-align: center;
}

.gui-compare-col__detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  padding: 5px 0;
  border-bottom: 1px solid var(--vien-the);
}

.gui-compare-col__label {
  color: var(--chu-phu);
}

.gui-compare-col__val {
  color: var(--chu-chinh);
  font-weight: 500;
}

.gui-compare-col__color-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--chu-chinh);
  font-weight: 500;
}

.gui-compare-col__swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--vien-the);
}

.gui-compare-col__badge-box {
  padding: 10px 12px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gui-badge-title {
  font-size: 0.8rem;
  color: var(--chu-phu);
  display: flex;
  align-items: center;
  gap: 6px;
}

.gui-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.gui-badge-tag {
  color: var(--chu-chinh);
  font-weight: 700;
}

.gui-badge-tag--hai_hoa,
.gui-badge-tag--chuan_dung {
  color: #059669;
}

html.dark .gui-badge-tag--hai_hoa,
html.dark .gui-badge-tag--chuan_dung {
  color: #34d399;
}

.gui-badge-tag--can_can_bang,
.gui-badge-tag--can_xem_lai {
  color: #dc2626;
}

html.dark .gui-badge-tag--can_can_bang,
html.dark .gui-badge-tag--can_xem_lai {
  color: #f87171;
}

.gui-badge-tag--sang_tao_tu_do {
  color: var(--vang-nghe);
}

.gui-badge-lydo {
  margin: 0;
  font-size: 0.78rem;
  color: var(--chu-phu);
  line-height: 1.4;
}

.gui-compare-col__caption {
  font-size: 0.8rem;
  font-style: normal;
  color: var(--chu-chinh);
  text-align: center;
  padding: 8px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: 8px;
}

/* ================= DANH SÁCH THẺ ================= */
.gui-empty-box {
  text-align: center;
  padding: 48px 24px;
  background: var(--nen-the);
  border: 1px dashed var(--vien-the);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.gui-empty-box__text {
  margin: 0;
  font-size: 0.92rem;
  color: var(--chu-phu);
  max-width: 420px;
}

.gui-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 18px;
}

.gui-card {
  display: flex;
  flex-direction: column;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-the);
  transition: all 0.2s ease;
}

.gui-card:hover {
  border-color: #10b981;
}

.gui-card--comparing {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}

.gui-card__avatar-wrap {
  width: 100%;
  height: 230px;
  background: var(--nen-the-phu);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--vien-the);
  padding: 12px 0;
}

.gui-card__avatar-svg {
  height: 100%;
  max-width: 100%;
}

.gui-card__content {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.gui-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.gui-card__name {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--chu-chinh);
}

.gui-card__date {
  font-size: 0.76rem;
  color: var(--chu-phu);
}

.gui-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--chu-phu);
}

.gui-card__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.gui-card__swatch {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid var(--vien-the);
}

.gui-card__caption-box {
  min-height: 46px;
  padding: 8px 10px;
  background: var(--nen-the-phu);
  border: 1px solid var(--vien-the);
  border-radius: 10px;
}

.gui-card__caption {
  margin: 0;
  font-size: 0.82rem;
  font-style: normal;
  line-height: 1.45;
  color: var(--chu-chinh);
}

/* Chỉnh sửa chú thích */
.gui-edit-caption {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gui-edit-caption__input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  background: var(--nen-the);
  border: 1px solid #10b981;
  border-radius: 8px;
  color: var(--chu-chinh);
  font-family: var(--font-than);
  font-size: 0.82rem;
  resize: none;
  outline: none;
}

.gui-edit-caption__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.gui-edit-caption__save-wrap {
  display: flex;
  gap: 6px;
}

.gui-btn-mini {
  padding: 4px 10px;
  font-size: 0.76rem;
  font-weight: 600;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: 8px;
  color: var(--chu-chinh);
  cursor: pointer;
}

.gui-btn-mini--primary {
  background: #059669;
  color: #ffffff;
  border-color: transparent;
}

.gui-btn-mini--gemini {
  color: var(--vang-nghe);
  border-color: var(--vien-the);
}

/* Các nút tác vụ */
.gui-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--vien-the);
}

.gui-action-btn {
  font-size: 0.76rem;
  font-weight: 600;
  padding: 5px 10px;
  background: var(--nen-the-phu);
  border: 1px solid var(--vien-the);
  border-radius: 8px;
  color: var(--chu-chinh);
  cursor: pointer;
  transition: all 0.15s ease;
}

.gui-action-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.gui-action-btn--active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  font-weight: 700;
}

html.dark .gui-action-btn--active {
  color: #34d399;
}

.gui-action-btn--export {
  color: var(--chu-chinh);
}

.gui-action-btn--wear {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #047857;
}

html.dark .gui-action-btn--wear {
  color: #34d399;
}

.gui-action-btn--wear:hover {
  background: #059669;
  color: #ffffff;
}

.gui-action-btn--delete {
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.25);
  margin-left: auto;
}

html.dark .gui-action-btn--delete {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.gui-action-btn--delete:hover {
  background: rgba(239, 68, 68, 0.12);
}

.gui-btn {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.gui-btn--primary {
  background: #059669;
  border: none;
  color: #ffffff;
}

@media (max-width: 640px) {
  .gui-compare-panel__grid {
    grid-template-columns: 1fr;
  }
}
`;
