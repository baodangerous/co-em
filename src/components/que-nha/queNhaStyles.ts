/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export const QUE_NHA_CSS = `
.que-nha {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: transparent;
  color: var(--nen-toi);
  padding-top: 16px;
  padding-bottom: calc(var(--dock-h, 64px) + 24px);
  box-sizing: border-box;
}

.que-nha__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
}

.que-nha__fly {
  position: absolute;
  right: max(3%, calc(50% - 32rem));
  top: 96px;
  pointer-events: none;
  z-index: 3;
  opacity: 0.95;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.12));
}

@media (max-width: 1080px) {
  .que-nha__fly {
    right: 18px;
    top: 76px;
    transform: scale(0.85);
  }
}

@media (max-width: 720px) {
  .que-nha__fly {
    display: none;
  }
}

.que-nha__brand {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 62rem;
  width: calc(100% - 32px);
  margin: 0 auto 16px;
  padding: 12px 24px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(202, 138, 4, 0.35);
  border-radius: 9999px;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(21, 128, 61, 0.12);
}

html[data-theme="dark"] .que-nha__brand,
html.dark .que-nha__brand {
  background: rgba(11, 25, 46, 0.92);
  border-color: rgba(250, 204, 21, 0.4);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}

.que-nha__brand-text {
  display: flex;
  align-items: center;
  gap: 10px;
}

.que-nha__name {
  font-family: var(--font-co-dien);
  font-size: var(--size-lg);
  font-weight: 700;
  color: var(--nen-toi);
}

.que-nha__steps-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.que-nha__step-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: var(--size-sm);
  font-weight: 600;
  color: var(--tro-tram);
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 200ms ease;
}

.que-nha__step-pill--active {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  color: #78350F;
  border-color: #D97706;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.2);
}

html[data-theme="dark"] .que-nha__step-pill {
  color: #94A3B8;
  background: rgba(255, 255, 255, 0.08);
}

html[data-theme="dark"] .que-nha__step-pill--active {
  background: linear-gradient(135deg, rgba(202, 138, 4, 0.35) 0%, rgba(217, 119, 6, 0.25) 100%);
  color: #FEF08A;
  border-color: #FDE047;
}

.que-nha__container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px 24px;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
}

.que-nha__card {
  width: 100%;
  max-width: 62rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px 32px 24px;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(202, 138, 4, 0.38);
  border-radius: 28px;
  box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(21, 128, 61, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  animation: hienLen 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (max-width: 768px) {
  .que-nha__card {
    padding: 20px 16px;
    gap: 16px;
    border-radius: 22px;
  }
}

.que-nha__card-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.que-nha__domdom-line {
  margin: 0;
  font-family: var(--font-than);
  font-size: var(--size-md);
  color: #B45309;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

html[data-theme="dark"] .que-nha__domdom-line {
  color: #FDE047;
}

.que-nha__question-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.que-nha__question {
  margin: 0;
  font-family: var(--font-co-dien);
  font-size: var(--size-lg);
  font-weight: 700;
  line-height: 1.35;
  color: var(--nen-toi);
  border-left: 4px solid var(--dat-nung);
  padding-left: 14px;
}

.que-nha__selected-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid rgba(202, 138, 4, 0.35);
  color: #B45309;
  font-size: var(--size-sm);
  font-weight: 600;
  white-space: nowrap;
}

html[data-theme="dark"] .que-nha__selected-badge {
  background: rgba(253, 224, 71, 0.15);
  border-color: rgba(253, 224, 71, 0.4);
  color: #FEF08A;
}

.que-nha__sub-hint {
  margin: 0;
  font-size: var(--size-sm);
  color: var(--tro-tram);
  line-height: 1.4;
}

.que-nha__subline {
  margin: 0;
  font-size: var(--size-md);
  line-height: 1.45;
  color: #92400E;
  background: rgba(254, 243, 199, 0.7);
  border-left: 3px solid #D97706;
  padding: 10px 14px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

html[data-theme="dark"] .que-nha__subline {
  color: #FEF08A;
  background: rgba(202, 138, 4, 0.18);
  border-left-color: #FDE047;
}

.que-nha__options {
  display: grid;
  gap: 14px;
  margin: 4px 0 6px;
}

.que-nha__options--grid {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

@media (max-width: 640px) {
  .que-nha__options--grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.que-nha__options--stack {
  grid-template-columns: 1fr;
  gap: 12px;
}

.que-nha__option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  min-height: 72px;
  background: #FFFFFF;
  color: var(--nen-toi);
  border: 1.5px solid rgba(203, 213, 225, 0.9);
  border-radius: 18px;
  font-family: var(--font-than);
  text-align: left;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.que-nha__option-btn--lg {
  padding: 16px 20px;
  min-height: 78px;
}

.que-nha__option-btn--special {
  grid-column: 1 / -1;
  background: #F8FAFC;
  border-color: rgba(202, 138, 4, 0.45);
}

.que-nha__option-btn:hover {
  background: #FFFDF5;
  border-color: #CA8A04;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(202, 138, 4, 0.16);
}

.que-nha__option-btn--active {
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%) !important;
  border: 2px solid #D97706 !important;
  color: #78350F !important;
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.22), inset 0 0 0 1px #F59E0B !important;
  transform: translateY(-2px);
}

html[data-theme="dark"] .que-nha__option-btn {
  background: #102542;
  border: 1.5px solid rgba(56, 189, 248, 0.25);
  color: #F8FAFC;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

html[data-theme="dark"] .que-nha__option-btn:hover {
  background: #173259;
  border-color: #FDE047;
  box-shadow: 0 8px 22px rgba(250, 204, 21, 0.22);
}

html[data-theme="dark"] .que-nha__option-btn--active {
  background: linear-gradient(135deg, rgba(202, 138, 4, 0.35) 0%, rgba(217, 119, 6, 0.22) 100%) !important;
  border: 2px solid #FDE047 !important;
  color: #FEF08A !important;
  box-shadow: 0 8px 28px rgba(250, 204, 21, 0.25) !important;
}

/* KHUNG TRANH MINH HỌA DI SẢN TINH TẾ */
.que-nha__vignette-frame {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(202, 138, 4, 0.16);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: transform 200ms ease;
}

.que-nha__option-btn:hover .que-nha__vignette-frame {
  transform: scale(1.06);
}

.que-nha__option-btn--active .que-nha__vignette-frame {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(217, 119, 6, 0.4);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.que-nha__option-title {
  font-size: var(--size-md);
  font-weight: 600;
  line-height: 1.35;
  color: inherit;
}

.que-nha__marker-badge {
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 200ms ease;
}

.que-nha__marker-circle {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  border: 2px solid #CBD5E1;
  background: transparent;
  transition: all 200ms ease;
}

html[data-theme="dark"] .que-nha__marker-circle {
  border-color: #475569;
}

.que-nha__option-btn:hover .que-nha__marker-circle {
  border-color: #CA8A04;
}

.que-nha__marker-badge--active {
  background: #D97706;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.35);
}

html[data-theme="dark"] .que-nha__marker-badge--active {
  background: #F59E0B;
}

/* KHỐI TƯ VẤN BỐI CẢNH RIÊNG TỰ DO */
.que-nha__ai-section {
  margin-top: 14px;
  padding: 16px 18px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, rgba(254, 249, 195, 0.75) 100%);
  border: 1.5px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.08);
}

html[data-theme="dark"] .que-nha__ai-section {
  background: linear-gradient(135deg, rgba(16, 37, 66, 0.8) 0%, rgba(20, 48, 86, 0.9) 100%);
  border-color: rgba(250, 204, 21, 0.3);
}

.que-nha__ai-result {
  margin-top: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  border: 1.5px solid rgba(217, 119, 6, 0.35);
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.12);
  animation: hienLen 300ms ease-out both;
}

html[data-theme="dark"] .que-nha__ai-result {
  background: rgba(11, 25, 46, 0.95);
  border-color: rgba(250, 204, 21, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.que-nha__actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  flex-wrap: wrap;
  padding-top: 14px;
  border-top: 1px solid rgba(203, 213, 225, 0.5);
}

html[data-theme="dark"] .que-nha__actions {
  border-top-color: rgba(56, 189, 248, 0.15);
}

.que-nha__btn {
  padding: 10px 20px;
  min-height: 44px;
  font-family: var(--font-than);
  font-size: var(--size-md);
  cursor: pointer;
  transition: all var(--nhip-vua) ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
}

.que-nha__btn--pri {
  background: linear-gradient(135deg, #D97706 0%, #B45309 100%) !important;
  color: #FFFFFF !important;
  border: 1px solid #B45309;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.35);
}

.que-nha__btn--pri:hover {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
}

.que-nha__btn--sub {
  background: #FFFFFF !important;
  color: var(--nen-toi) !important;
  border: 1.5px solid rgba(203, 213, 225, 0.9);
  border-radius: 14px;
}

html[data-theme="dark"] .que-nha__btn--sub {
  background: #102542 !important;
  color: #F8FAFC !important;
  border-color: rgba(56, 189, 248, 0.25);
}

.que-nha__btn--sub:hover {
  border-color: #CA8A04;
  background: #FFFDF5 !important;
  transform: translateY(-1px);
}

html[data-theme="dark"] .que-nha__btn--sub:hover {
  background: #173259 !important;
  border-color: #FDE047;
}

@keyframes hienLen {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
