/**
 * Generates client-side synthesized harmonic chime & long zen sounds using native Web Audio API.
 * 100% offline-ready, zero external audio file downloads.
 */

export type SoundToneType = "zen_bowl" | "bell_chime" | "digital_harp";

class SoundSynthesizer {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays a deep, long-resonating Tibetan Zen Singing Bowl (~3.8 seconds)
   * Uses 432Hz Solfeggio fundamental frequency with gentle beating overtone & warm decay.
   */
  playZenBowl(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 3.8;

    // 1. Fundamental Warm Resonance (432 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(432, now);
    gain1.gain.setValueAtTime(0.28, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + duration);

    // 2. Beating Shimmer Tone (434 Hz) creates that iconic singing bowl pulsating vibration
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(434.2, now);
    gain2.gain.setValueAtTime(0.18, now);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + duration);

    // 3. Perfect Fifth overtone (648 Hz) for rich body
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(648, now + 0.05);
    gain3.gain.setValueAtTime(0.12, now + 0.05);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.5);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.05);
    osc3.stop(now + duration);

    // 4. Sparkling Octave Chime (864 Hz)
    const osc4 = ctx.createOscillator();
    const gain4 = ctx.createGain();
    osc4.type = "triangle";
    osc4.frequency.setValueAtTime(864, now + 0.08);
    gain4.gain.setValueAtTime(0.08, now + 0.08);
    gain4.gain.exponentialRampToValueAtTime(0.0001, now + duration - 1.0);
    osc4.connect(gain4);
    gain4.connect(ctx.destination);
    osc4.start(now + 0.08);
    osc4.stop(now + duration);
  }

  /**
   * Plays a bright multi-harmonic long acoustic bell chime (~3.0 seconds)
   */
  playBellChime(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 3.0;

    // Tone 1: 587.33 Hz (D5) ramping to A5 (880 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.2);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + duration);

    // Tone 2: Harmonic overtone for rich metallic resonance (1320 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1320, now + 0.1);
    gain2.gain.setValueAtTime(0.16, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + duration);

    // Tone 3: High Sparkle overtone (1760 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(1760, now + 0.15);
    gain3.gain.setValueAtTime(0.09, now + 0.15);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.8);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.15);
    osc3.stop(now + duration);
  }

  /**
   * Plays an uplifting 4-note ascending harp chord arpeggio (~2.5s)
   */
  playDigitalHarp(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 Major Chord
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.0);
    });
  }

  /**
   * Plays the tone based on user preference
   */
  playTone(tone: SoundToneType = "zen_bowl"): void {
    switch (tone) {
      case "zen_bowl":
        this.playZenBowl();
        break;
      case "bell_chime":
        this.playBellChime();
        break;
      case "digital_harp":
        this.playDigitalHarp();
        break;
      default:
        this.playZenBowl();
    }
  }

  /**
   * Plays a subtle click sound for button ticks
   */
  playClick(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const soundEffects = new SoundSynthesizer();
