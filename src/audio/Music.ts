/**
 * Música de fundo em chiptune: loop de 8 compassos agendado com lookahead
 * no relógio do AudioContext. Melodia em square, baixo em triangle.
 */

// Semitons relativos a C5 para a melodia (null = pausa), 8 passos por compasso
const MELODY: (number | null)[] = [
  // Compassos 1-2: tema saltitante
  0, null, 4, null, 7, null, 4, null,
  0, null, 4, 7, 9, 7, 4, null,
  // 3-4
  -3, null, 0, null, 4, null, 0, null,
  2, 4, 5, 4, 2, null, -1, null,
  // 5-6: resposta
  0, null, 4, null, 7, null, 9, null,
  12, null, 9, 7, 9, null, 7, null,
  // 7-8: fecho
  5, null, 4, null, 2, null, 4, 5,
  7, null, 4, null, 0, null, null, null
];

// Baixo: 2 notas por compasso (semitons relativos a C3)
const BASS: (number | null)[] = [
  0, 7, 0, 7,
  -3, 4, 5, 7,
  0, 7, 9, 7,
  5, 4, 0, 0
];

const VICTORY_MELODY: (number | null)[] = [
  0, 4, 7, 12, null, 12, 12, null,
  9, null, 12, null, 14, null, 16, null,
  12, null, 7, null, 9, 11, 12, null,
  7, 4, 0, null, 4, null, 7, null,
  0, 4, 7, 12, null, 16, 16, null,
  14, 12, 14, null, 16, null, 12, null,
  9, null, 14, 12, 11, null, 9, null,
  7, 9, 12, null, 12, null, null, null
];

function semitone(base: number, st: number): number {
  return base * Math.pow(2, st / 12);
}

export class MusicPlayer {
  private ctx: AudioContext;
  private out: GainNode;
  private timer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private kind: 'main' | 'victory' = 'main';

  constructor(ctx: AudioContext, dest: AudioNode) {
    this.ctx = ctx;
    this.out = ctx.createGain();
    this.out.gain.value = 0.16;
    this.out.connect(dest);
  }

  start(kind: 'main' | 'victory'): void {
    if (this.timer !== null && this.kind === kind) return;
    this.stop();
    this.kind = kind;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.1;
    const tick = (): void => {
      // Agenda com 200ms de antecedência
      while (this.nextTime < this.ctx.currentTime + 0.2) {
        this.scheduleStep(this.step, this.nextTime);
        this.step++;
        this.nextTime += this.stepDur();
      }
      this.timer = window.setTimeout(tick, 60);
    };
    tick();
  }

  stop(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private stepDur(): number {
    // Colcheias a ~132 BPM (main) / 140 (victory)
    return this.kind === 'main' ? 0.227 : 0.214;
  }

  private scheduleStep(step: number, t: number): void {
    const melody = this.kind === 'main' ? MELODY : VICTORY_MELODY;
    const i = step % melody.length;
    const note = melody[i];
    if (note !== null) {
      this.playNote(semitone(523.25, note), t, this.stepDur() * 0.9, 'square', 0.5);
    }
    // Baixo em semínimas
    if (i % 2 === 0) {
      const b = BASS[Math.floor(i / 2) % BASS.length];
      if (b !== null) {
        this.playNote(semitone(130.81, b), t, this.stepDur() * 1.6, 'triangle', 0.8);
      }
    }
    // "Chimbal" de ruído nos contratempos
    if (i % 4 === 2) this.hat(t);
  }

  private playNote(freq: number, t: number, dur: number, type: OscillatorType, vol: number): void {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol * 0.28, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(this.out);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  private hat(t: number): void {
    const len = Math.ceil(this.ctx.sampleRate * 0.03);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6000;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    src.connect(filter).connect(g).connect(this.out);
    src.start(t);
  }
}
