import {
  getActiveAudioContext,
  getAudioVolume,
  isAudioEnabled,
  isBirdAmbienceEnabled,
} from "../audio";

let queNhaBirdTimer: number | null = null;

// 5. TIẾNG VẢI LỤA SỘT SOẠT (SILK & BROCADE RUSTLE)
// =========================================================================

/**
 * Tiếng vải lụa sột soạt: Nhiễu hồng lọc dải băng đa tầng ~1350Hz-2200Hz.
 * Thích hợp khi chạm đổi màu sắc, chất liệu vải, lật tà áo, vuốt hoa văn.
 */
export function playFabricRustle(): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const masterVol = getAudioVolume();
    const duration = 0.16 + (Math.random() * 0.04 - 0.02); // 140ms - 180ms
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Pink / brown noise tự nhiên
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555;
      b1 = 0.99332 * b1 + white * 0.075;
      b2 = 0.969 * b2 + white * 0.153;
      data[i] = (b0 + b1 + b2) * 0.09;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Bộ lọc bandpass mô phỏng độ mịn của sợi tơ tằm, gấm sa
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const centerFreq = 1450 + (Math.random() * 300 - 150);
    filter.frequency.setValueAtTime(centerFreq, ctx.currentTime);
    filter.Q.setValueAtTime(2.2, ctx.currentTime);

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const peakVol = 0.065 * masterVol;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakVol, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration + 0.01);
  } catch {
    // Bỏ qua lỗi
  }
}

// =========================================================================
// 6. TIẾNG BƯỚC CHÂN / TIẾNG GUỐC (FOOTSTEPS & CLOGS)
// =========================================================================

/**
 * Tiếng bước chân phân loại theo loại giày guốc:
 * - Guốc mộc: Tiếng gỗ gõ giòn cộp cộp
 * - Hài thêu: Bước chân nhung đệm êm
 * - Sneaker: Tiếng đệm cao su êm ái
 */
export function playFootstepSound(footwearType = "guoc_moc"): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const masterVol = getAudioVolume();
    const now = ctx.currentTime;

    if (footwearType === "guoc_moc") {
      // Guốc mộc gõ cộp cộp (2 nhịp bước)
      triggerClogStep(ctx, now, 330, 0.07 * masterVol);
      triggerClogStep(ctx, now + 0.11, 390, 0.06 * masterVol);
    } else if (footwearType === "hai_theu") {
      // Hài thêu nhung êm ái
      triggerSoftStep(ctx, now, 180, 0.045 * masterVol);
      playFabricRustle();
    } else {
      // Sneaker hoặc dép da cổ
      triggerSoftStep(ctx, now, 150, 0.05 * masterVol);
    }
  } catch {
    // Bỏ qua
  }
}

function triggerClogStep(ctx: AudioContext, startTime: number, freq: number, gainVol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq * 1.8, startTime);
  osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.025);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(gainVol, startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.055);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 0.06);
}

function triggerSoftStep(ctx: AudioContext, startTime: number, freq: number, gainVol: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 1.4, startTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.7, startTime + 0.04);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(gainVol, startTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 0.07);
}

export function playClogSteps(): void {
  playFootstepSound("guoc_moc");
}

// =========================================================================
// 7. TIẾNG CHUÔNG BẠC (SILVER BELL / JEWELRY CHIME)
// =========================================================================

export function playSilverBell(): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const masterVol = getAudioVolume();
    const now = ctx.currentTime;
    const duration = 0.65;
    const harmonics = [
      { freq: 1760, vol: 0.05 * masterVol },
      { freq: 2640, vol: 0.025 * masterVol },
      { freq: 3520, vol: 0.015 * masterVol },
    ];

    harmonics.forEach(({ freq, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    });
  } catch {
    // Bỏ qua
  }
}

// =========================================================================
// 8. TIẾNG CHIM HÓT KHI Ở QUÊ NHÀ (COUNTRYSIDE BIRDSOUND SYNTHESIS)
// =========================================================================

/**
 * Tổng hợp tiếng chim hót đồng quê (chim chiền chiện / chim chích ríu rít):
 * Dùng điều chế tần số (FM sweeps) mô phỏng tiếng chim hót trong trẻo, tự nhiên
 */
export function playBirdChirpSound(): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const masterVol = getAudioVolume();
    const now = ctx.currentTime;
    const baseVol = 0.045 * masterVol;

    // Chim hót gồm 2-3 tiếng ríu rít nối tiếp
    const chirps = [
      { delay: 0.0, startF: 3200, peakF: 4600, endF: 3500, dur: 0.12 },
      { delay: 0.14, startF: 3400, peakF: 4900, endF: 3600, dur: 0.15 },
      { delay: 0.32, startF: 3600, peakF: 5200, endF: 3300, dur: 0.18 },
    ];

    chirps.forEach(({ delay, startF, peakF, endF, dur }) => {
      const t = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(startF, t);
      osc.frequency.linearRampToValueAtTime(peakF, t + dur * 0.4);
      osc.frequency.exponentialRampToValueAtTime(endF, t + dur);

      // Thêm rung nhẹ (vibrato ríu rít)
      const vibrato = ctx.createOscillator();
      const vGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(32, t);
      vGain.gain.setValueAtTime(140, t);
      vibrato.connect(vGain);
      vGain.connect(osc.frequency);
      vibrato.start(t);
      vibrato.stop(t + dur);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(baseVol, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + dur + 0.02);
    });
  } catch {
    // Bỏ qua
  }
}

/**
 * Khởi động tiếng chim hót định kỳ khi ở màn hình Quê Nhà (QueNhaScreen)
 * Trả về hàm huỷ (cleanup) để gỡ bỏ khi rời khỏi màn hình
 */
export function startQueNhaBirdAmbience(): () => void {
  stopQueNhaBirdAmbience();

  if (!isAudioEnabled() || !isBirdAmbienceEnabled()) {
    return () => {};
  }

  // Phát một lần mở màn sau 1 giây
  window.setTimeout(() => {
    if (isAudioEnabled() && isBirdAmbienceEnabled()) {
      playBirdChirpSound();
    }
  }, 1000);

  // Lặp lại ngẫu nhiên cứ 8 đến 16 giây một lần tiếng chim hót thoang thoảng
  const scheduleNext = () => {
    const nextInterval = 8000 + Math.random() * 8000;
    queNhaBirdTimer = window.setTimeout(() => {
      if (isAudioEnabled() && isBirdAmbienceEnabled()) {
        playBirdChirpSound();
      }
      scheduleNext();
    }, nextInterval);
  };

  scheduleNext();

  return stopQueNhaBirdAmbience;
}

export function stopQueNhaBirdAmbience(): void {
  if (queNhaBirdTimer !== null) {
    window.clearTimeout(queNhaBirdTimer);
    queNhaBirdTimer = null;
  }
}

// =========================================================================
// 9. CÁC HÀM TIỆN ÍCH TƯƠNG THÍCH NGƯỢC (BACKWARD COMPATIBILITY ALIASES)
// =========================================================================

export const playSilkRustleSound = playFabricRustle;
export const phatTiengVaiSotSoat = playFabricRustle;
export const phatTiengChuongBac = playSilverBell;
export const phatTiengBuocGuoc = playClogSteps;
export const playChimeSound = playSilverBell;
