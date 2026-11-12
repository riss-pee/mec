/**
 * Procedural Audio Engine using Web Audio API for satisfying bead click/clack sounds.
 * Avoids any external assets to guarantee instant loading and robust playback.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

export function setAudioMuted(muted: boolean) {
  isAudioMuted = muted;
}

export function isAudioEnabled(): boolean {
  return !isAudioMuted;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playBeadSound(isSlideBack = false, intensity = 1.0) {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Create sound node graph
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (isSlideBack) {
      // Slightly lower-pitched wooden slide-back clack
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 * intensity, now);
      osc.frequency.exponentialRampToValueAtTime(80 * intensity, now + 0.08);

      // Bandpass filter to isolate the "woody" frequencies
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.Q.setValueAtTime(3, now);

      // Volume envelope
      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(0.12 * intensity, now + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      // Brighter, crisper click for hitting the active board
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 * intensity, now);
      osc.frequency.exponentialRampToValueAtTime(180 * intensity, now + 0.05);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(2, now);

      // Volume envelope
      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(0.15 * intensity, now + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.start(now);
      osc.stop(now + 0.08);

      // Add a tiny noise burst for friction click
      const bufferSize = ctx.sampleRate * 0.02; // 20ms of noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 2000;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04 * intensity, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseNode.start(now);
      noiseNode.stop(now + 0.02);
    }
  } catch (e) {
    // Fail silently if browser blocks audio
    console.warn('Audio play blocked or failed:', e);
  }
}

/**
 * Play a success chime for completing a challenge successfully
 */
export function playSuccessChime() {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Quick arpeggio: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gainNode.gain.setValueAtTime(0, now + idx * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  } catch (e) {
    console.warn('Audio play blocked or failed:', e);
  }
}
