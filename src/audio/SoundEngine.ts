import { SaveGame } from '../systems/SaveGame';
import { MusicPlayer } from './Music';
import type { CatKind } from '../consts';

/**
 * Todo o áudio do jogo é sintetizado via Web Audio API — nenhum arquivo
 * externo. Osciladores para tons, buffers de ruído para percussão/efeitos.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private music: MusicPlayer | null = null;
  muted = SaveGame.getMuted();

  /** Cria/retoma o contexto — chamar a partir de um gesto do usuário. */
  unlock(): void {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.5;
      this.sfxGain.connect(this.master);
      this.music = new MusicPlayer(this.ctx, this.master);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    SaveGame.setMuted(this.muted);
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : 1, this.ctx.currentTime, 0.02);
    }
    return this.muted;
  }

  startMusic(kind: 'main' | 'victory'): void {
    this.music?.start(kind);
  }

  stopMusic(): void {
    this.music?.stop();
  }

  /** Tom simples com envelope e glide opcional. */
  private tone(
    freq: number, dur: number, type: OscillatorType = 'square',
    vol = 0.2, glideTo?: number, delay = 0
  ): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (glideTo !== undefined) osc.frequency.linearRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  /** Rajada de ruído filtrado (impactos, passos, fumaça). */
  private noise(dur: number, filterFreq: number, vol = 0.25, delay = 0): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime + delay;
    const len = Math.ceil(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(g).connect(this.sfxGain);
    src.start(t);
  }

  meow(cat: CatKind): void {
    if (cat === 'mia') {
      // Grave e sábio
      this.tone(340, 0.28, 'triangle', 0.3, 250);
      this.tone(170, 0.28, 'sine', 0.15, 125);
    } else if (cat === 'zorro') {
      // Agudo e rápido
      this.tone(750, 0.09, 'square', 0.15, 950);
      this.tone(900, 0.1, 'square', 0.15, 650, 0.09);
    } else {
      // Longo e manhoso
      this.tone(480, 0.5, 'triangle', 0.28, 380);
      this.tone(430, 0.3, 'sine', 0.12, 460, 0.18);
    }
  }

  jump(): void { this.tone(300, 0.15, 'square', 0.12, 550); }
  land(): void { this.noise(0.08, 500, 0.15); }
  smash(): void {
    this.noise(0.25, 2400, 0.4);
    this.tone(180, 0.2, 'sawtooth', 0.2, 60);
  }
  thud(): void { this.tone(120, 0.12, 'sine', 0.25, 80); this.noise(0.06, 300, 0.15); }
  dash(): void { this.noise(0.15, 3500, 0.2); this.tone(500, 0.12, 'square', 0.08, 900); }
  slide(): void { this.noise(0.25, 1200, 0.15); }
  purr(): void {
    // Ronronado: pulsos graves em sequência
    for (let i = 0; i < 12; i++) this.tone(62, 0.06, 'sawtooth', 0.14, 55, i * 0.075);
  }
  squeak(): void { this.tone(1100, 0.07, 'square', 0.12, 1500); this.tone(1400, 0.07, 'square', 0.1, 900, 0.08); }
  chirp(): void { this.tone(1600, 0.06, 'sine', 0.12, 2100); this.tone(1900, 0.08, 'sine', 0.1, 1400, 0.07); }
  footstep(): void { this.noise(0.05, 400, 0.07); }
  bark(): void {
    this.tone(220, 0.08, 'sawtooth', 0.25, 160);
    this.noise(0.08, 900, 0.2);
    this.tone(200, 0.09, 'sawtooth', 0.22, 140, 0.12);
  }
  alert(): void { this.tone(700, 0.1, 'square', 0.18, 1000); this.tone(1000, 0.15, 'square', 0.15, 700, 0.1); }
  grab(): void { this.tone(400, 0.3, 'triangle', 0.2, 180); }
  drop(): void { this.tone(250, 0.15, 'triangle', 0.18, 400); }
  switchCat(): void { this.tone(600, 0.06, 'square', 0.1, 800); this.tone(800, 0.08, 'square', 0.1, 1100, 0.05); }
  push(): void { this.noise(0.1, 250, 0.08); }
  doorOpen(): void {
    this.tone(200, 0.2, 'triangle', 0.18, 320);
    this.tone(320, 0.25, 'triangle', 0.18, 480, 0.15);
  }
  plateOn(): void { this.tone(500, 0.08, 'square', 0.15, 350); }
  checkpoint(): void {
    // Arpejo alegre
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => this.tone(n, 0.14, 'square', 0.14, undefined, i * 0.09));
  }
  wisdom(): void {
    const notes = [880, 1109, 1319];
    notes.forEach((n, i) => this.tone(n, 0.3, 'sine', 0.1, undefined, i * 0.12));
  }
  snap(): void { this.tone(880, 0.1, 'square', 0.15); this.tone(1175, 0.15, 'square', 0.12, undefined, 0.08); }
  victory(): void {
    const seq = [523, 523, 523, 659, 784, 784, 1047];
    const dur = [0.12, 0.12, 0.12, 0.18, 0.14, 0.14, 0.5];
    let t = 0;
    seq.forEach((n, i) => {
      this.tone(n, dur[i], 'square', 0.18, undefined, t);
      this.tone(n / 2, dur[i], 'triangle', 0.14, undefined, t);
      t += dur[i] + 0.02;
    });
  }
  uiClick(): void { this.tone(700, 0.05, 'square', 0.1); }
}

export const sound = new SoundEngine();
