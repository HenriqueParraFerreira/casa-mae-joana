import Phaser from 'phaser';

/**
 * Buffer de pixels para desenhar sprites em pixel art e transformar em
 * texturas do Phaser (via canvas). Cores são strings CSS ('#rrggbb') ou null.
 */
export class PixelBuffer {
  readonly w: number;
  readonly h: number;
  private px: (string | null)[];

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.px = new Array<string | null>(w * h).fill(null);
  }

  set(x: number, y: number, c: string | null): void {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.px[y * this.w + x] = c;
  }

  get(x: number, y: number): string | null {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.px[y * this.w + x];
  }

  rect(x: number, y: number, w: number, h: number, c: string): void {
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    }
  }

  /** Retângulo preenchido só onde (x+y) é par — dithering leve. */
  dither(x: number, y: number, w: number, h: number, c: string): void {
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        if ((x + i + y + j) % 2 === 0) this.set(x + i, y + j, c);
      }
    }
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, c: string): void {
    for (let j = -ry; j <= ry; j++) {
      const t = j / (ry + 0.5);
      const half = Math.floor(rx * Math.sqrt(Math.max(0, 1 - t * t)) + 0.5);
      for (let i = -half; i <= half; i++) this.set(cx + i, cy + j, c);
    }
  }

  line(x0: number, y0: number, x1: number, y1: number, c: string): void {
    x0 = Math.round(x0); y0 = Math.round(y0);
    x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  /** Contorno de 1px: pinta pixels vazios adjacentes a pixels preenchidos. */
  outline(c = '#241a1a'): void {
    const marks: number[] = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.get(x, y) !== null) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) {
          marks.push(y * this.w + x);
        }
      }
    }
    for (const m of marks) this.px[m] = c;
  }

  /** Substitui uma cor por outra (útil para variações de frame). */
  replace(from: string, to: string): void {
    for (let i = 0; i < this.px.length; i++) {
      if (this.px[i] === from) this.px[i] = to;
    }
  }

  toTexture(scene: Phaser.Scene, key: string): void {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const ct = scene.textures.createCanvas(key, this.w, this.h);
    if (!ct) throw new Error(`Falha ao criar textura: ${key}`);
    const ctx = ct.getContext();
    ctx.clearRect(0, 0, this.w, this.h);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const c = this.px[y * this.w + x];
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    ct.refresh();
  }
}
