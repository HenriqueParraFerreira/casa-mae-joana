import Phaser from 'phaser';
import { PixelBuffer } from './PixelBuffer';
import type { CatKind } from '../consts';

/**
 * Sprites dos gatos em alta densidade (2x): as texturas têm o dobro de
 * pixels e são exibidas com escala 0.5, então cada pixel de arte vale
 * meio pixel de mundo — arte mais definida no mesmo tamanho de jogo.
 */

interface CatColors {
  body: string;
  dark: string;
  light: string;
  belly: string;
  earIn: string;
  eye: string;
  nose: string;
}

interface CatSpec {
  kind: CatKind;
  cw: number;
  ch: number;
  bodyRx: number;
  bodyRy: number;
  headR: number;
  colors: CatColors;
  pattern: 'solid' | 'tuxedo' | 'calico';
  plumeTail: boolean;
}

type Pose =
  | { kind: 'walk'; frame: number }
  | { kind: 'sit'; lick: boolean }
  | { kind: 'jump' };

export const CAT_SPECS: Record<CatKind, CatSpec> = {
  mia: {
    kind: 'mia', cw: 64, ch: 48, bodyRx: 18, bodyRy: 12, headR: 12,
    colors: {
      body: '#9299a3', dark: '#6f7681', light: '#bcc3cd', belly: '#ced3da',
      earIn: '#c98f96', eye: '#e8b53a', nose: '#c9707c'
    },
    pattern: 'solid', plumeTail: false
  },
  zorro: {
    kind: 'zorro', cw: 56, ch: 40, bodyRx: 14, bodyRy: 8, headR: 10,
    colors: {
      body: '#2b2b31', dark: '#1c1c22', light: '#4a4a54', belly: '#f2f0ea',
      earIn: '#c98f96', eye: '#8fd44a', nose: '#e298a4'
    },
    pattern: 'tuxedo', plumeTail: false
  },
  macchia: {
    kind: 'macchia', cw: 76, ch: 56, bodyRx: 24, bodyRy: 16, headR: 14,
    colors: {
      body: '#8a5c32', dark: '#5e3c1e', light: '#a5713f', belly: '#a8825a',
      earIn: '#c9857a', eye: '#e0a832', nose: '#b06858'
    },
    pattern: 'calico', plumeTail: true
  }
};

const CALICO_DARK = '#5a3a20';
const CALICO_BLACK = '#2e241a';
const CALICO_GOLD = '#c98f3a';

function drawPattern(pb: PixelBuffer, s: CatSpec, bx: number, by: number): void {
  const c = s.colors;
  if (s.pattern === 'tuxedo') {
    // Peito e barriga brancos com borda irregular
    pb.ellipse(bx + 2, by + 4, s.bodyRx - 5, 4, c.belly);
    pb.ellipse(bx - 3, by + 5, 4, 3, c.belly);
    pb.dither(bx - s.bodyRx + 6, by + 2, 8, 2, c.belly);
  } else if (s.pattern === 'calico') {
    // Tricolor bem manchada: marrom escuro, preto e dourado pelo corpo todo
    pb.ellipse(bx - 12, by - 6, 10, 8, CALICO_DARK);
    pb.ellipse(bx + 10, by - 8, 8, 6, CALICO_BLACK);
    pb.ellipse(bx - 2, by + 4, 8, 6, CALICO_GOLD);
    pb.ellipse(bx + 16, by + 4, 6, 4, CALICO_DARK);
    pb.ellipse(bx - 18, by + 6, 6, 4, CALICO_BLACK);
    pb.ellipse(bx + 2, by - s.bodyRy + 3, 6, 3, CALICO_GOLD);
    pb.dither(bx - 8, by - 2, 6, 4, CALICO_DARK);
    pb.ellipse(bx, by + s.bodyRy - 3, s.bodyRx - 10, 2, c.belly);
  } else {
    // Mia: dorso sombreado com listras sutis + barriga clara
    pb.dither(bx - s.bodyRx + 4, by - s.bodyRy + 1, s.bodyRx * 2 - 8, 4, c.dark);
    for (let i = 0; i < 3; i++) {
      pb.rect(bx - 8 + i * 8, by - s.bodyRy + 2, 2, 4, c.dark);
    }
    pb.ellipse(bx, by + s.bodyRy - 3, s.bodyRx - 6, 3, c.belly);
  }
  // Brilho no topo do corpo (luz vindo de cima)
  pb.dither(bx - s.bodyRx + 6, by - s.bodyRy, s.bodyRx, 2, s.colors.light);
}

function drawHead(pb: PixelBuffer, s: CatSpec, hx: number, hy: number): void {
  const c = s.colors;
  const r = s.headR;
  pb.ellipse(hx, hy, r, r - 2, c.body);
  // Orelhas triangulares com parte interna
  for (let i = 0; i < 6; i++) {
    pb.rect(hx - r + 2 + i, hy - r + 3 - i, 6 - i, 2 + i, c.body);
    pb.rect(hx + r - 8 + i, hy - r - 2 + i, 6 - i, 2, c.body);
  }
  pb.rect(hx - r + 4, hy - r + 1, 2, 4, c.earIn);
  pb.rect(hx + r - 6, hy - r + 1, 2, 4, c.earIn);

  if (s.pattern === 'tuxedo') {
    // Focinho branco (a máscara preta fica em volta dos olhos)
    pb.ellipse(hx + 2, hy + 4, 6, 4, c.belly);
    pb.ellipse(hx - 5, hy + 5, 3, 2, c.belly);
  } else if (s.pattern === 'calico') {
    // Manchas na cabeça também
    pb.ellipse(hx - 4, hy - 6, 6, 4, CALICO_DARK);
    pb.ellipse(hx + 6, hy - 4, 4, 4, CALICO_BLACK);
    pb.ellipse(hx - 8, hy + 2, 4, 2, CALICO_GOLD);
  } else {
    // Bochechas claras da Mia
    pb.dither(hx - r + 3, hy + 2, 5, 3, c.light);
  }

  // Olhos grandes com pupila em fenda e brilho
  const eyeY = hy - 2;
  for (const ex of [hx - 6, hx + 3]) {
    pb.rect(ex, eyeY, 4, 4, c.eye);
    pb.rect(ex + 1, eyeY, 1, 4, '#241a1a');   // fenda vertical
    pb.set(ex + 3, eyeY, '#ffffff');           // brilho
    pb.rect(ex, eyeY - 1, 4, 1, c.dark);       // pálpebra
  }
  // Nariz, boca e queixo
  pb.rect(hx - 1, hy + 4, 3, 2, c.nose);
  pb.set(hx, hy + 6, '#241a1a');
  pb.line(hx - 3, hy + 7, hx - 1, hy + 6, '#241a1a');
  pb.line(hx + 1, hy + 6, hx + 3, hy + 7, '#241a1a');
  // Bigodes
  pb.line(hx + r - 2, hy + 3, hx + r + 5, hy + 2, '#e8e4da');
  pb.line(hx + r - 2, hy + 5, hx + r + 5, hy + 5, '#e8e4da');
  pb.line(hx - r + 2, hy + 3, hx - r - 4, hy + 2, '#e8e4da');
}

function drawTail(pb: PixelBuffer, s: CatSpec, tx: number, ty: number, wag: number): void {
  const c = s.colors;
  if (s.plumeTail) {
    // Cauda felpuda de maine coon com anéis manchados
    pb.ellipse(tx - 5, ty - 5 - wag, 6, 5, CALICO_DARK);
    pb.ellipse(tx - 11, ty - 11 - wag, 6, 5, c.body);
    pb.ellipse(tx - 15, ty - 17 - wag, 5, 4, CALICO_BLACK);
    pb.dither(tx - 13, ty - 13 - wag, 5, 3, c.light);
  } else {
    // Cauda fina em curva, com ponta destacada (2px de espessura)
    for (const o of [0, 1]) {
      pb.line(tx, ty + o, tx - 8, ty - 8 - wag + o, c.body);
      pb.line(tx - 8, ty - 8 - wag + o, tx - 12, ty - 16 - wag + o, c.body);
    }
    pb.rect(tx - 14, ty - 19 - wag, 3, 3, s.pattern === 'tuxedo' ? s.colors.belly : s.colors.dark);
  }
}

function drawCat(s: CatSpec, pose: Pose): PixelBuffer {
  const pb = new PixelBuffer(s.cw, s.ch);
  const c = s.colors;
  const groundY = s.ch - 3;

  if (pose.kind === 'sit') {
    const bx = Math.floor(s.cw / 2) - 4;
    const by = groundY - s.bodyRy - 4;
    // Traseiro sentado (maior) + peito ereto
    pb.ellipse(bx - 4, by, s.bodyRx - 4, s.bodyRy + 3, c.body);
    pb.ellipse(bx + 7, by - 4, 8, s.bodyRy, c.body);
    const hx = bx + 10;
    const hy = by - s.bodyRy - 6;
    drawPattern(pb, s, bx - 2, by);
    // Cauda enroladinha na frente
    drawTail(pb, s, bx - s.bodyRx + 2, groundY - 2, pose.lick ? 4 : 0);
    // Patas dianteiras retas
    pb.rect(bx + 8, by + 4, 4, s.bodyRy + 2, c.body);
    pb.set(bx + 9, groundY - 1, c.light);
    if (pose.lick) {
      // Pata levantada até a boca + língua rosa
      pb.rect(hx - 2, hy + 6, 4, 6, c.body);
      pb.rect(hx - 1, hy + 6, 2, 2, '#e8899a');
    } else {
      pb.rect(bx + 14, by + 4, 4, s.bodyRy + 2, c.body);
      pb.set(bx + 15, groundY - 1, c.light);
    }
    drawHead(pb, s, hx, hy);
  } else {
    const bx = Math.floor(s.cw / 2) - 2;
    const stretch = pose.kind === 'jump' ? 2 : 0;
    const bob = pose.kind === 'walk' && pose.frame % 2 === 1 ? 2 : 0;
    const by = groundY - s.bodyRy - 8 + bob - stretch;
    const legTop = by + s.bodyRy - 4;
    const legH = groundY - legTop;
    const xs = [bx - s.bodyRx + 5, bx - s.bodyRx + 11, bx + s.bodyRx - 14, bx + s.bodyRx - 8];

    if (pose.kind === 'jump') {
      // Patas recolhidas
      pb.rect(xs[0], legTop + 2, 4, 4, c.dark);
      pb.rect(xs[3], legTop + 2, 4, 4, c.dark);
    } else {
      // Patas de trás (mais escuras = profundidade)
      const off = [[2, -2, 2, -2], [0, 0, 0, 0], [-2, 2, -2, 2], [0, 0, 0, 0]][pose.frame % 4];
      pb.rect(xs[1] + off[1], legTop, 4, legH - Math.abs(off[1]), c.dark);
      pb.rect(xs[2] + off[2], legTop, 4, legH - Math.abs(off[2]), c.dark);
    }

    pb.ellipse(bx, by, s.bodyRx + stretch, s.bodyRy - stretch, c.body);
    drawPattern(pb, s, bx, by);

    if (pose.kind !== 'jump') {
      // Patas da frente (por cima do corpo)
      const off = [[2, -2, 2, -2], [0, 0, 0, 0], [-2, 2, -2, 2], [0, 0, 0, 0]][pose.frame % 4];
      for (const i of [0, 3]) {
        const paw = s.pattern === 'tuxedo' ? c.belly : c.light;
        pb.rect(xs[i] + off[i], legTop, 4, legH - Math.abs(off[i]), c.body);
        pb.rect(xs[i] + off[i], groundY - 2 - Math.abs(off[i]), 4, 2, paw);
      }
    }

    drawTail(pb, s, bx - s.bodyRx, by, pose.kind === 'jump' ? 6 : (pose.kind === 'walk' ? (pose.frame % 2) * 2 : 0));
    const hx = bx + s.bodyRx + 2;
    const hy = by - s.bodyRy + 4 - stretch;
    drawHead(pb, s, hx, hy);
  }

  pb.outline('#241a1a');
  return pb;
}

function drawPortrait(scene: Phaser.Scene, s: CatSpec): void {
  const pb = new PixelBuffer(56, 56);
  const c = s.colors;
  const hx = 28, hy = 33;
  pb.ellipse(hx, hy, 18, 16, c.body);
  // Orelhas grandes com interior
  for (let i = 0; i < 10; i++) {
    pb.rect(hx - 18 + i, hy - 14 - i + 2, 10 - i, 3 + i, c.body);
    pb.rect(hx + 9 + i, hy - 12 - i + 0, 10 - i, 3, c.body);
  }
  pb.rect(hx - 14, hy - 15, 4, 6, c.earIn);
  pb.rect(hx + 10, hy - 15, 4, 6, c.earIn);

  if (s.pattern === 'tuxedo') pb.ellipse(hx, hy + 8, 10, 6, c.belly);
  if (s.pattern === 'calico') {
    pb.ellipse(hx - 8, hy - 8, 8, 6, CALICO_DARK);
    pb.ellipse(hx + 10, hy - 6, 6, 6, CALICO_BLACK);
    pb.ellipse(hx - 2, hy + 6, 6, 4, CALICO_GOLD);
    pb.ellipse(hx + 6, hy - 14, 6, 4, CALICO_GOLD);
  }
  if (s.pattern === 'solid') {
    pb.dither(hx - 12, hy - 14, 24, 4, c.dark);
    pb.dither(hx - 14, hy + 6, 8, 4, c.light);
    pb.dither(hx + 6, hy + 6, 8, 4, c.light);
  }
  // Olhos grandes com fenda e brilho duplo
  for (const ex of [hx - 10, hx + 4]) {
    pb.rect(ex, hy - 2, 6, 6, c.eye);
    pb.rect(ex + 2, hy - 2, 2, 6, '#241a1a');
    pb.set(ex + 4, hy - 2, '#ffffff');
    pb.set(ex, hy + 2, '#ffffff');
    pb.rect(ex, hy - 3, 6, 1, c.dark);
  }
  pb.rect(hx - 2, hy + 6, 4, 3, c.nose);
  pb.line(hx - 4, hy + 11, hx, hy + 9, '#241a1a');
  pb.line(hx, hy + 9, hx + 4, hy + 11, '#241a1a');
  // Bigodes
  pb.line(hx + 12, hy + 6, hx + 20, hy + 5, '#e8e4da');
  pb.line(hx - 12, hy + 6, hx - 20, hy + 5, '#e8e4da');
  pb.outline('#241a1a');
  pb.toTexture(scene, `portrait-${s.kind}`);
}

/** Gera todas as texturas de gato: andar (4), sentado (2), pulo, retrato. */
export function generateCatTextures(scene: Phaser.Scene): void {
  for (const kind of Object.keys(CAT_SPECS) as CatKind[]) {
    const s = CAT_SPECS[kind];
    for (let f = 0; f < 4; f++) {
      drawCat(s, { kind: 'walk', frame: f }).toTexture(scene, `cat-${kind}-walk-${f}`);
    }
    drawCat(s, { kind: 'sit', lick: false }).toTexture(scene, `cat-${kind}-sit-0`);
    drawCat(s, { kind: 'sit', lick: true }).toTexture(scene, `cat-${kind}-sit-1`);
    drawCat(s, { kind: 'jump' }).toTexture(scene, `cat-${kind}-jump`);
    drawPortrait(scene, s);
  }
}
