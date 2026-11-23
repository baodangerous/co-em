/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * THƯ VIỆN ÂM THANH DÂN TỘC VIỆT NAM (VIETNAMESE FOLK AUDIO LIBRARY)
 * Tổng hợp hoàn toàn bằng Web Audio API thuần (0ms latency, không phụ thuộc file mạng tĩnh).
 * 
 * 1. Nhạc cụ dân gian xuyên suốt:
 *    - Đàn Tranh (16 dây): Cung bậc ngũ cung Hò - Xự - Xang - Xê - Cống (C, D, F, G, A), rung ngón, vuốt dây (glissando)
 *    - Sáo Trúc: Khúc luyến láy nhẹ nhàng mang âm hưởng đồng quê
 *    - Đàn T'rưng: Gõ tre Tây Nguyên trong trẻo, rộn ràng
 * 2. Âm thanh tương tác trang phục:
 *    - Tiếng vải lụa sột soạt: Pink noise lọc dải băng tơ tằm mềm mại khi lật tà áo, chọn hoa văn, đổi màu
 *    - Tiếng bước chân / Tiếng guốc: Guốc mộc gõ cộp cộp, hài thêu nhung êm ái, sneaker năng động
 *    - Tiếng chuông bạc: Ngân vang trang sức khánh bạc
 * 3. Âm thanh thiên nhiên quê nhà:
 *    - Tiếng chim hót đồng quê: Chim chiền chiện / chim chích ríu rít thanh bình quanh luỹ tre làng
 *    - Chế độ phát chim hót tự nhiên dịu nhẹ định kỳ khi ở bối cảnh Quê Nhà
 * 4. Quản lý trạng thái: Âm lượng tổng, chọn nhạc cụ, bật/tắt âm thanh, đồng bộ localStorage & CustomEvent.
 */

// Các khoá lưu trữ cấu hình
const KEY_AUDIO_ENABLED = "vpr:audio_enabled";
const KEY_AUDIO_VOLUME = "vpr:audio_volume";
const KEY_FOLK_INSTRUMENT = "vpr:folk_instrument";
const KEY_BIRD_AMBIENCE = "vpr:bird_ambience";
const KEY_AUDIO_INITIALIZED = "vpr:audio_first_touched";

export const EVENT_AUDIO_CHANGE = "vpr:audio-setting-change";

export type FolkInstrumentType = "dan_tranh" | "sao_truc" | "trung";

let audioCtx: AudioContext | null = null;
// Thang ngũ cung truyền thống (Điệu Bắc / Điệu Nam)
// Hò (C), Xự (D), Xang (F), Xê (G), Cống (A)
const PENTATONIC_SCALE = [
  261.63, // C4 - Hò
  293.66, // D4 - Xự
  349.23, // F4 - Xang
  392.0,  // G4 - Xê
  440.0,  // A4 - Cống
  523.25, // C5 - Hò (quãng 8)
  587.33, // D5 - Xự
  698.46, // F5 - Xang
  783.99, // G5 - Xê
  880.0,  // A5 - Cống
  1046.5, // C6 - Hò (quãng 8 cao)
  1174.66 // D6 - Xự
];

// Mô-típ giai điệu theo màn hình (Flourish khi chuyển cảnh)
const SCREEN_MOTIFS: Record<string, number[]> = {
  gate: [293.66, 392.0, 440.0, 523.25],         // D4 -> G4 -> A4 -> C5 (Thanh thoát mở cổng làng)
  que_nha: [392.0, 440.0, 587.33, 698.46],      // G4 -> A4 -> D5 -> F5 (Ấm áp quê hương)
  s2: [440.0, 523.25, 587.33, 783.99],          // A4 -> C5 -> D5 -> G5 (Quý phái chọn phục trang)
  s3: [523.25, 587.33, 698.46, 880.0],          // C5 -> D5 -> F5 -> A5 (Nghiên cứu chi tiết di sản)
  s4: [587.33, 698.46, 783.99, 1046.5],         // D5 -> F5 -> G5 -> C6 (Rực rỡ phòng phối đồ ảo)
  nhan_vat: [349.23, 440.0, 523.25, 698.46],    // F4 -> A4 -> C5 -> F5 (Tạo hình nhân vật)
  gui_ky_uc: [392.0, 523.25, 698.46, 880.0],    // G4 -> C5 -> F5 -> A5 (Gùi ký ức hoài niệm)
  dong_thoi_gian: [261.63, 349.23, 523.25, 698.46], // C4 -> F4 -> C5 -> F5 (Dòng thời gian ngàn năm)
  ban_do: [293.66, 440.0, 587.33, 880.0],       // D4 -> A4 -> D5 -> A5 (Bản đồ gấm vóc non sông)
  soi_chi_chung: [349.23, 392.0, 523.25, 587.33], // F4 -> G4 -> C5 -> D5 (Sợi chỉ chung kết nối)
  cho_phien: [523.25, 698.46, 783.99, 880.0],   // C5 -> F5 -> G5 -> A5 (Chợ phiên tấp nập)
  chao_ban: [392.0, 440.0, 523.25, 587.33],     // G4 -> A4 -> C5 -> D5 (Lời chào thân thương)
};

/**
 * Lấy hoặc khởi tạo AudioContext an toàn theo chính sách trình duyệt
 */
export function getActiveAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!isAudioEnabled()) return null;

  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  } catch (err) {
    console.warn("Không thể kích hoạt AudioContext:", err);
  }

  return audioCtx;
}

/**
 * Khởi tạo AudioContext sau thao tác chạm đầu tiên của người dùng
 */
export function initAudioOnFirstTouch(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    if (window.localStorage && !window.localStorage.getItem(KEY_AUDIO_INITIALIZED)) {
      window.localStorage.setItem(KEY_AUDIO_INITIALIZED, "1");
      if (window.localStorage.getItem(KEY_AUDIO_ENABLED) === null) {
        window.localStorage.setItem(KEY_AUDIO_ENABLED, "1");
        dispatchAudioChange();
      }
    }
  } catch (err) {
    console.warn("Lỗi init audio gesture:", err);
  }

  return audioCtx;
}

/**
 * Kiểm tra xem âm thanh có đang được bật không
 */
export function isAudioEnabled(): boolean {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    const val = window.localStorage.getItem(KEY_AUDIO_ENABLED);
    if (val !== null) {
      return val === "1" || val === "true";
    }
  } catch {
    // Bỏ qua
  }
  return false;
}

/**
 * Bật hoặc tắt âm thanh toàn hệ thống
 */
export function setAudioEnabled(enabled: boolean): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(KEY_AUDIO_ENABLED, enabled ? "1" : "0");
      if (enabled) {
        initAudioOnFirstTouch();
      } else {
        stopQueNhaBirdAmbience();
      }
      dispatchAudioChange();
    }
  } catch {
    // Bỏ qua
  }
}

/**
 * Lấy mức âm lượng tổng (từ 0.05 đến 1.0, mặc định 0.35 dịu nhẹ)
 */
export function getAudioVolume(): number {
  if (typeof window === "undefined" || !window.localStorage) return 0.35;
  try {
    const val = window.localStorage.getItem(KEY_AUDIO_VOLUME);
    if (val !== null) {
      const parsed = parseFloat(val);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed;
    }
  } catch {
    // Bỏ qua
  }
  return 0.35;
}

/**
 * Cài đặt mức âm lượng tổng
 */
export function setAudioVolume(volume: number): void {
  const clamped = Math.max(0.05, Math.min(1.0, volume));
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(KEY_AUDIO_VOLUME, clamped.toFixed(2));
      dispatchAudioChange();
    }
  } catch {
    // Bỏ qua
  }
}

/**
 * Lấy loại nhạc cụ dân gian đang chọn (Đàn Tranh, Sáo Trúc, T'rưng)
 */
export function getFolkInstrument(): FolkInstrumentType {
  if (typeof window === "undefined" || !window.localStorage) return "dan_tranh";
  try {
    const val = window.localStorage.getItem(KEY_FOLK_INSTRUMENT) as FolkInstrumentType;
    if (val === "dan_tranh" || val === "sao_truc" || val === "trung") return val;
  } catch {
    // Bỏ qua
  }
  return "dan_tranh";
}

/**
 * Thay đổi loại nhạc cụ dân gian
 */
export function setFolkInstrument(inst: FolkInstrumentType): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(KEY_FOLK_INSTRUMENT, inst);
      dispatchAudioChange();
    }
  } catch {
    // Bỏ qua
  }
}

/**
 * Kiểm tra xem tiếng chim hót bối cảnh Quê Nhà có bật không
 */
export function isBirdAmbienceEnabled(): boolean {
  if (typeof window === "undefined" || !window.localStorage) return true;
  try {
    const val = window.localStorage.getItem(KEY_BIRD_AMBIENCE);
    if (val !== null) return val === "1" || val === "true";
  } catch {
    // Bỏ qua
  }
  return true;
}

/**
 * Bật/tắt tiếng chim hót bối cảnh Quê Nhà
 */
export function setBirdAmbienceEnabled(enabled: boolean): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(KEY_BIRD_AMBIENCE, enabled ? "1" : "0");
      if (!enabled) stopQueNhaBirdAmbience();
      dispatchAudioChange();
    }
  } catch {
    // Bỏ qua
  }
}

function dispatchAudioChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(EVENT_AUDIO_CHANGE, {
        detail: {
          enabled: isAudioEnabled(),
          volume: getAudioVolume(),
          instrument: getFolkInstrument(),
          birdAmbience: isBirdAmbienceEnabled(),
        },
      })
    );
  }
}

// =========================================================================
// 1. TỔNG HỢP ÂM SẮC ĐÀN TRANH (VIETNAMESE ZITHER SYNTHESIS)
// =========================================================================

/**
 * Gảy 1 nốt Đàn Tranh với âm sắc kim tơ đặc trưng:
 * - Xung gảy nhanh (pick attack)
 * - Thân đàn gỗ ngô đồng cộng hưởng với hài âm ngũ cung
 * - Rung ngón (vibrato / luyến âm) tạo hồn cốt âm nhạc Việt
 */
export function playDanTranhNote(freq = 523.25, duration = 1.2, intensity = 1.0): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const masterVol = getAudioVolume();
    const now = ctx.currentTime;
    const baseVol = 0.08 * masterVol * intensity;

    // 1. Chuỗi hài âm (harmonics) của dây kim loại Đàn Tranh
    const harmonics = [
      { ratio: 1.0, gain: 1.0, decay: duration },
      { ratio: 2.0, gain: 0.55, decay: duration * 0.75 },
      { ratio: 3.01, gain: 0.32, decay: duration * 0.55 },
      { ratio: 4.02, gain: 0.18, decay: duration * 0.4 },
      { ratio: 5.04, gain: 0.09, decay: duration * 0.3 },
    ];

    // Master gain cho nốt này
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(baseVol, now + 0.005);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Bộ lọc cộng hưởng thân đàn (Paulownia soundboard resonance filter)
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = "lowpass";
    bodyFilter.frequency.setValueAtTime(Math.min(freq * 3.5, 4500), now);
    bodyFilter.Q.setValueAtTime(1.8, now);

    // LFO mô phỏng kỹ thuật "Rung ngón / Nhấn dây" đặc sắc của nghệ nhân Đàn Tranh
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(5.4, now); // ~5.4 Hz tần số rung ngón
    vibratoGain.gain.setValueAtTime(0.0, now);
    // Rung dần sau 90ms chạm dây
    vibratoGain.gain.setValueAtTime(0.0, now + 0.09);
    vibratoGain.gain.linearRampToValueAtTime(freq * 0.016, now + 0.3); // Biên độ rung ~16 cent

    vibrato.connect(vibratoGain);
    vibrato.start(now);
    vibrato.stop(now + duration);

    harmonics.forEach(({ ratio, gain, decay }) => {
      const osc = ctx.createOscillator();
      const hGain = ctx.createGain();

      osc.type = ratio === 1.0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq * ratio, now);

      // Kết nối LFO rung ngón vào tần số dao động
      vibratoGain.connect(osc.frequency);

      hGain.gain.setValueAtTime(0.0001, now);
      hGain.gain.linearRampToValueAtTime(gain, now + 0.004);
      hGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(hGain);
      hGain.connect(bodyFilter);

      osc.start(now);
      osc.stop(now + decay + 0.02);
    });

    // 2. Tiếng gõ móng đàn nhẹ (pick attack click)
    const attackBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.008), ctx.sampleRate);
    const attackData = attackBuffer.getChannelData(0);
    for (let i = 0; i < attackData.length; i++) {
      attackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (attackData.length * 0.3));
    }
    const attackSource = ctx.createBufferSource();
    attackSource.buffer = attackBuffer;

    const attackFilter = ctx.createBiquadFilter();
    attackFilter.type = "highpass";
    attackFilter.frequency.setValueAtTime(2200, now);

    const attackGain = ctx.createGain();
    attackGain.gain.setValueAtTime(baseVol * 0.45, now);
    attackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

    attackSource.connect(attackFilter);
    attackFilter.connect(attackGain);
    attackGain.connect(noteGain);

    attackSource.start(now);

    bodyFilter.connect(noteGain);
    noteGain.connect(ctx.destination);
  } catch {
    // Bỏ qua lỗi audio
  }
}

/**
 * Vuốt dây Đàn Tranh (Glissando / Á âm ngũ cung)
 * Tạo làn sóng âm thanh mềm mại, thanh tao khi chuyển trang
 */
export function playDanTranhGlissando(notes = [392.0, 523.25, 587.33, 783.99, 880.0]): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  notes.forEach((freq, idx) => {
    window.setTimeout(() => {
      playDanTranhNote(freq, 1.4 - idx * 0.12, 0.75 + idx * 0.06);
    }, idx * 75);
  });
}

// =========================================================================
// 2. TỔNG HỢP ÂM SẮC SÁO TRÚC (BAMBOO FLUTE SYNTHESIS)
// =========================================================================

/**
 * Thổi một nốt Sáo Trúc ngân nga thanh bình:
 * - Hơi thở trong ống trúc (breathy noise)
 * - Sóng hài tròn mềm + vibrato luyến láy
 */
export function playSaoTrucNote(freq = 587.33, duration = 0.8): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const masterVol = getAudioVolume();
    const now = ctx.currentTime;
    const baseVol = 0.07 * masterVol;

    // Sóng chính Sáo Trúc (ấm và vút)
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Hài bậc 2 nhẹ
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, now);

    // LFO luyến láy hơi sáo
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5.0, now);
    lfoGain.gain.setValueAtTime(0, now);
    lfoGain.gain.linearRampToValueAtTime(freq * 0.018, now + 0.2);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration);

    // Tiếng hơi thở gió lùa qua lỗ sáo (breath noise)
    const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.05;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(freq, now);
    noiseFilter.Q.setValueAtTime(8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(baseVol * 0.35, now + 0.08);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    // Envelope tiếng sáo
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(baseVol, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  } catch {
    // Bỏ qua
  }
}

/**
 * Thổi một khúc luyến láy ngắn của Sáo Trúc
 */
export function playSaoTrucMelody(notes = [587.33, 698.46, 880.0]): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  notes.forEach((freq, idx) => {
    window.setTimeout(() => {
      playSaoTrucNote(freq, 0.55);
    }, idx * 130);
  });
}

/**
 * Gõ chùm chuông tre T'rưng rộn ràng
 */
export function playTrungChime(notes = [523.25, 698.46, 783.99, 1046.5]): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  notes.forEach((freq, idx) => {
    window.setTimeout(() => {
      playTrungNote(freq, 0.45);
    }, idx * 85);
  });
}

// =========================================================================
// 3. TỔNG HỢP ÂM SẮC T'RƯNG (BAMBOO XYLOPHONE SYNTHESIS)
// =========================================================================

/**
 * Gõ ống tre T'rưng Tây Nguyên giòn giã, vang xa
 */
export function playTrungNote(freq = 698.46, duration = 0.5): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const masterVol = getAudioVolume();
    const now = ctx.currentTime;
    const baseVol = 0.09 * masterVol;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq * 1.35, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.035);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.setValueAtTime(5.5, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(baseVol, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    // Bỏ qua
  }
}

// =========================================================================
// 4. BỘ PHÁT NHẠC CỤ TỔNG HỢP THEO LỰA CHỌN
// =========================================================================

/**
 * Gảy hoặc gõ nốt nhạc theo loại nhạc cụ đang chọn
 */
export function playFolkPluck(freqOrIndex?: number | string): void {
  const inst = getFolkInstrument();
  let targetFreq = 523.25; // C5

  if (typeof freqOrIndex === "number") {
    if (freqOrIndex > 50) {
      targetFreq = freqOrIndex;
    } else {
      const idx = Math.abs(Math.floor(freqOrIndex)) % PENTATONIC_SCALE.length;
      targetFreq = PENTATONIC_SCALE[idx];
    }
  } else {
    // Chọn ngẫu nhiên 1 nốt ngũ cung êm dịu
    const randomIdx = 4 + Math.floor(Math.random() * 5); // C5 -> C6
    targetFreq = PENTATONIC_SCALE[randomIdx] || 523.25;
  }

  if (inst === "sao_truc") {
    playSaoTrucNote(targetFreq, 0.65);
  } else if (inst === "trung") {
    playTrungNote(targetFreq, 0.45);
  } else {
    playDanTranhNote(targetFreq, 1.3, 0.9);
  }
}

/**
 * Hiệu ứng âm thanh nhạc cụ dân gian xuyên suốt khi di chuyển giữa các màn hình
 */
export function playFolkScreenTransition(screenName = "s2"): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  const inst = getFolkInstrument();
  const notes = SCREEN_MOTIFS[screenName] || [392.0, 523.25, 698.46, 880.0];

  if (inst === "sao_truc") {
    // Sáo trúc thổi luyến 2 nốt dìu dặt
    const n1 = notes[0];
    const n2 = notes[notes.length - 1];
    playSaoTrucNote(n1, 0.55);
    window.setTimeout(() => playSaoTrucNote(n2, 0.75), 180);
  } else if (inst === "trung") {
    // T'rưng gõ 3 nốt vui tươi
    notes.slice(0, 3).forEach((f, i) => {
      window.setTimeout(() => playTrungNote(f, 0.4), i * 90);
    });
  } else {
    // Đàn Tranh vuốt ngũ cung (Á âm thanh tao)
    playDanTranhGlissando(notes);
  }
}

// =========================================================================

import {
  playFabricRustle,
  playFootstepSound,
  playClogSteps,
  playSilverBell,
  playBirdChirpSound,
  startQueNhaBirdAmbience,
  stopQueNhaBirdAmbience,
  playSilkRustleSound,
  phatTiengVaiSotSoat,
  phatTiengChuongBac,
  phatTiengBuocGuoc,
  playChimeSound,
} from "./audio/folkSoundEffects";

export {
  playFabricRustle,
  playFootstepSound,
  playClogSteps,
  playSilverBell,
  playBirdChirpSound,
  startQueNhaBirdAmbience,
  stopQueNhaBirdAmbience,
  playSilkRustleSound,
  phatTiengVaiSotSoat,
  phatTiengChuongBac,
  phatTiengBuocGuoc,
  playChimeSound,
};
