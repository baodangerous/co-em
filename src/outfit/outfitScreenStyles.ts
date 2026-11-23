/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Styles cho màn hình Xưởng Phối Đồ 2D (OutfitScreen).
 */

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export const OUTFIT_SCREEN_CSS = `
.outfit-screen {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  background: transparent;
  color: var(--nen-toi);
  font-family: var(--font-than);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.outfit-screen__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: .03;
  pointer-events: none;
}

.outfit-screen__header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--nen-sidebar);
  border-bottom: 1px solid var(--sidebar-border);
  flex-wrap: wrap;
  gap: 12px;
  backdrop-filter: blur(8px);
}

.outfit-screen__brand-name {
  display: block;
  font-family: var(--font-tieu-de);
  font-size: var(--size-lg);
  font-weight: 700;
  color: var(--nen-toi);
}

.outfit-screen__brand-sub {
  display: block;
  font-size: var(--size-sm);
  color: var(--xanh-chinh);
  font-weight: 600;
}

.outfit-screen__header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.outfit-screen__pill-btn {
  height: 36px;
  padding: 0 12px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  color: var(--nen-toi);
  border-radius: 12px !important;
  font-size: var(--size-sm);
  font-weight: 600;
  font-family: var(--font-than);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.outfit-screen__pill-btn:hover {
  background: var(--xanh-nhe);
  border-color: var(--xanh-la);
  color: var(--xanh-dam);
}

.outfit-screen__pill-btn--highlight {
  border-color: var(--vang-nghe);
  background: var(--vang-nhe);
  color: var(--vang-chinh);
  font-weight: 600;
}

.outfit-screen__back-btn {
  height: 36px;
  padding: 0 12px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  color: var(--nen-toi);
  border-radius: 12px !important;
  font-size: var(--size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.outfit-screen__back-btn:hover {
  background: var(--xanh-nhe);
  border-color: var(--xanh-la);
}

.outfit-screen__body {
  position: relative;
  z-index: 10;
  max-width: 86rem;
  margin: 0 auto;
  padding: 16px 20px 60px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

@media (min-width: 1024px) {
  .outfit-screen__body {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 36px;
  }

  .outfit-screen__preview-section {
    position: sticky;
    top: 72px;
    flex: 0 0 320px;
    max-width: 320px;
    width: 320px;
  }

  .outfit-screen__controls-section {
    flex: 1 1 0;
    min-width: 0;
    max-width: 760px;
  }
}

.outfit-screen__preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.outfit-screen__stage {
  position: relative;
  width: 100%;
  max-width: 320px;
  max-height: 480px;
  aspect-ratio: 320 / 480;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(245, 251, 247, 0.88) 100%);
  border: 1.5px solid var(--vien-the);
  border-radius: 20px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
  box-shadow: var(--shadow-the);
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform var(--nhip-cham) ease, background var(--nhip-cham) ease, border-color var(--nhip-cham) ease;
}

html[data-theme="dark"] .outfit-screen__stage,
html.theme-dark .outfit-screen__stage,
html.dark .outfit-screen__stage {
  background: linear-gradient(180deg, rgba(16, 37, 66, 0.85) 0%, rgba(11, 25, 46, 0.95) 100%) !important;
  border-color: rgba(56, 189, 248, 0.35) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.15) !important;
}

.outfit-screen__stage--performing {
  animation: characterTiltSway 1.5s ease-in-out;
}

@keyframes characterTiltSway {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(2deg) translateY(-2px) scale(1.01); }
  60% { transform: rotate(-1.5deg) translateY(-1px) scale(1.01); }
  100% { transform: rotate(0deg) scale(1); }
}

.outfit-screen__avatar-svg {
  width: 100%;
  height: 100%;
  max-height: 520px;
}

.outfit-screen__firefly-trace {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 25;
}

.outfit-screen__firefly-sparkle {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vang-sang);
  box-shadow: 0 0 16px 6px rgba(250, 204, 21, 0.7);
  animation: fireflyFlight 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes fireflyFlight {
  0% { top: 65%; left: -20px; opacity: 0; }
  20% { opacity: 1; }
  50% { top: 30%; left: 45%; transform: scale(1.3); opacity: 0.95; }
  80% { opacity: 0.8; }
  100% { top: 15%; left: 105%; opacity: 0; }
}

.outfit-screen__stage-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.outfit-screen__stage-tag {
  font-family: var(--font-tieu-de);
  font-size: var(--size-lg);
  font-weight: 700;
  color: var(--nen-toi);
}

.outfit-screen__stage-badge {
  font-size: var(--size-sm);
  color: var(--vang-chinh);
  font-weight: 600;
}

.outfit-screen__finish-btn {
  background: var(--vang-nghe) !important;
  border: 1px solid var(--vang-chinh);
  color: #1A3022 !important;
  border-radius: 12px !important;
  font-family: var(--font-than);
  box-shadow: 0 2px 8px rgba(202, 138, 4, 0.2);
  transition: all 0.2s ease;
}

.outfit-screen__finish-btn:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.outfit-screen__cat-gui-btn {
  background: var(--xanh-chinh);
  border: 1px solid var(--xanh-dam);
  color: #FFFFFF;
  border-radius: 12px !important;
  font-family: var(--font-than);
  box-shadow: 0 2px 8px rgba(21, 128, 61, 0.2);
  transition: all 0.2s ease;
}

.outfit-screen__cat-gui-btn:hover {
  background: var(--xanh-la);
  transform: translateY(-1px);
}

.outfit-screen__completed-toast {
  padding: 10px 14px;
  background: var(--xanh-nhe);
  border: 1px solid var(--xanh-mint);
  border-radius: 12px !important;
  font-size: var(--size-md);
  box-shadow: var(--shadow-the);
}

.outfit-screen__toast-sparkle {
  color: var(--vang-chinh);
}

.outfit-screen__controls-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.outfit-control-card {
  padding: 16px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: 16px !important;
  box-shadow: var(--shadow-the);
  box-sizing: border-box;
}
`;
