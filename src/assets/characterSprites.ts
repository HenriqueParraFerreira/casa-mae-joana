import Phaser from 'phaser';
import { PixelBuffer } from './PixelBuffer';

/**
 * Personagens em alta densidade (2x), exibidos com escala 0.5.
 *
 * A família da casa:
 * - ELIS (7 anos): pequena, cabelo preto na altura dos ombros, olhos
 *   castanho-escuros, vestido rosa.
 * - ELENA (10 anos): um pouco mais alta que a Elis, cabelo preto abaixo
 *   dos ombros, olhos castanho-claros, vestido verde-água.
 * - NONA: a avó das meninas; cabelo grisalho em coque, óculos redondos,
 *   avental e colher de pau. Comanda a cozinha.
 * - JOANA (42 anos): a mãe; cabelo castanho-claro longo abaixo dos
 *   ombros, óculos de gatinho. Cuida do jardim.
 */

export type HumanVariant = 'elis' | 'elena' | 'nona' | 'joana';
export const HUMAN_VARIANTS: HumanVariant[] = ['elis', 'elena', 'nona', 'joana'];

interface VariantSpec {
  headCy: number;      // centro da cabeça (px de textura; menor = mais alta)
  headR: number;
  hair: string;
  hairShine: string;
  hairLen: 'shoulder' | 'long' | 'bun';
  eye: string;
  skin: string;
  skinShade: string;
  dress: string;
  dressDark: string;
  shoes: string;
  apron?: string;
  prop?: 'spoon' | 'wateringcan';
  glasses?: 'round' | 'cat';
}

const SPECS: Record<HumanVariant, VariantSpec> = {
  elis: {
    headCy: 50, headR: 11,
    hair: '#241f1f', hairShine: '#3c3438', hairLen: 'shoulder',
    eye: '#4a3020',
    skin: '#e8b48e', skinShade: '#cf9a74',
    dress: '#e07a9a', dressDark: '#c46484', shoes: '#8a3a48'
  },
  elena: {
    headCy: 34, headR: 10,
    hair: '#241f1f', hairShine: '#3c3438', hairLen: 'long',
    eye: '#a5744a',
    skin: '#e8b48e', skinShade: '#cf9a74',
    dress: '#5a9aa0', dressDark: '#488088', shoes: '#3a5a60'
  },
  nona: {
    headCy: 16, headR: 10,
    hair: '#9a948c', hairShine: '#bcb6ac', hairLen: 'bun',
    eye: '#6e4a2e',
    skin: '#e0a882', skinShade: '#c48f6c',
    dress: '#a05a68', dressDark: '#844854', shoes: '#3a3028',
    apron: '#f0e8d8', prop: 'spoon', glasses: 'round'
  },
  joana: {
    headCy: 16, headR: 10,
    hair: '#a5825a', hairShine: '#c4a078', hairLen: 'long',
    eye: '#6e4a2e',
    skin: '#e8b48e', skinShade: '#cf9a74',
    dress: '#6a9a5a', dressDark: '#54804a', shoes: '#4a3a28',
    prop: 'wateringcan', glasses: 'cat'
  }
};

function drawHuman(v: VariantSpec, frame: number): PixelBuffer {
  const pb = new PixelBuffer(64, 128);
  const cx = 32;
  const legSwing = [6, 2, -6, 2][frame % 4];
  const hc = v.headCy;
  const dressTop = hc + v.headR + 2;
  const dressBot = 96 + Math.floor((hc - 16) / 8); // criança = vestido mais curto
  const legTop = dressBot - 6;

  // Pernas (pele) e sapatos
  pb.rect(cx - 10 + legSwing, legTop, 8, 116 - legTop, v.skin);
  pb.rect(cx + 2 - legSwing, legTop, 8, 116 - legTop, v.skin);
  pb.rect(cx - 12 + legSwing, 116, 12, 6, v.shoes);
  pb.rect(cx - legSwing, 116, 12, 6, v.shoes);
  pb.rect(cx - 12 + legSwing, 116, 12, 2, '#5a5048');
  pb.rect(cx - legSwing, 116, 12, 2, '#5a5048');

  // Vestido trapezoidal com sombra lateral
  for (let y = dressTop; y < dressBot; y++) {
    const half = 11 + Math.floor((y - dressTop) / 3.4);
    pb.rect(cx - half, y, half * 2, 1, v.dress);
  }
  pb.dither(cx - 18, dressBot - 14, 9, 14, v.dressDark);
  pb.rect(cx - 10, dressTop + 2, 20, 2, v.dressDark); // golinha

  if (v.apron) {
    // Avental com alças e bolso (Joana)
    for (let y = dressTop + 20; y < dressBot - 4; y++) {
      const half = 6 + Math.floor((y - dressTop - 20) / 4);
      pb.rect(cx - half, y, half * 2, 1, v.apron);
    }
    pb.rect(cx - 4, dressTop + 6, 3, 14, v.apron);
    pb.rect(cx + 1, dressTop + 6, 3, 14, v.apron);
    pb.rect(cx - 5, dressBot - 26, 10, 8, v.dress);
  }

  // Braços balançando
  const armSwing = Math.round(legSwing * 0.7);
  const armTop = dressTop + 4;
  const armLen = Math.max(18, 28 - Math.floor((hc - 16) / 3));
  pb.rect(cx - 17, armTop + armSwing, 6, armLen, v.dressDark);
  pb.rect(cx + 11, armTop - armSwing, 6, armLen, v.dress);
  pb.rect(cx - 17, armTop + armLen + armSwing, 6, 6, v.skin);
  pb.rect(cx + 11, armTop + armLen - armSwing, 6, 6, v.skin);
  const handY = armTop + armLen - armSwing;
  if (v.prop === 'spoon') {
    pb.rect(cx + 13, handY - 14, 4, 16, '#9a6a38');
    pb.ellipse(cx + 15, handY - 18, 4, 4, '#b98a5a');
    pb.ellipse(cx + 15, handY - 18, 2, 2, '#8a5a30');
  } else if (v.prop === 'wateringcan') {
    // Regador verdinho com bico
    pb.rect(cx + 12, handY + 2, 12, 10, '#7a9a84');
    pb.rect(cx + 12, handY + 2, 12, 2, '#94b49e');
    pb.line(cx + 24, handY + 4, cx + 29, handY - 1, '#7a9a84');
    pb.rect(cx + 28, handY - 3, 3, 3, '#94b49e');
    pb.line(cx + 13, handY, cx + 22, handY, '#5e7a66'); // alça
  }

  // Cabeça
  pb.ellipse(cx, hc, v.headR, v.headR, v.skin);
  pb.dither(cx - v.headR + 2, hc + 6, 6, 3, v.skinShade);

  // Cabelo por comprimento
  const r = v.headR;
  if (v.hairLen === 'bun') {
    pb.rect(cx - r, hc - r - 2, r * 2, 6, v.hair);
    pb.ellipse(cx, hc - r - 4, 6, 4, v.hair);
    pb.set(cx - 2, hc - r - 6, v.hairShine);
    pb.rect(cx - r - 2, hc - r + 2, 4, 10, v.hair);
    pb.rect(cx + r - 2, hc - r + 2, 4, 10, v.hair);
  } else {
    // Franja + laterais
    pb.rect(cx - r, hc - r - 2, r * 2, 7, v.hair);
    pb.dither(cx - r + 2, hc - r - 2, r * 2 - 4, 3, v.hairShine);
    const strandBottom = v.hairLen === 'shoulder' ? hc + r + 8 : hc + r + 20;
    pb.rect(cx - r - 3, hc - r + 2, 5, strandBottom - (hc - r + 2), v.hair);
    pb.rect(cx + r - 2, hc - r + 2, 5, strandBottom - (hc - r + 2), v.hair);
    if (v.hairLen === 'long') {
      // Mechas caindo nas costas, abaixo dos ombros
      pb.rect(cx - r - 4, hc + r, 4, 16, v.hair);
      pb.dither(cx - r - 4, hc + r, 4, 16, v.hairShine);
    }
    if (v.hairLen === 'shoulder') {
      // Presilha da Elis
      pb.rect(cx - r - 1, hc - 3, 3, 2, '#ffd04a');
    }
  }

  // Rosto: olho com brilho, sobrancelha, bochecha
  pb.rect(cx + 4, hc - 3, 4, 4, v.eye);
  pb.set(cx + 5, hc - 2, '#ffffff');
  pb.rect(cx + 3, hc - 6, 6, 2, v.hair);
  pb.set(cx + 8, hc + 4, '#d98f8a');
  pb.line(cx + 2, hc + 6, cx + 6, hc + 6, '#a86a5a'); // sorriso

  // Óculos (desenhados por cima do rosto)
  if (v.glasses === 'cat') {
    // Armação de gatinho: lente com cantinho levantado + hastinha
    const gy = hc - 5;
    const frame = '#4a3550';
    pb.rect(cx + 2, gy, 9, 1, frame);
    pb.rect(cx + 2, gy + 6, 9, 1, frame);
    pb.rect(cx + 2, gy, 1, 7, frame);
    pb.rect(cx + 10, gy, 1, 6, frame);
    pb.set(cx + 10, gy - 1, frame);
    pb.set(cx + 11, gy - 2, frame); // asinha de gatinho
    pb.line(cx + 2, gy + 3, cx - 8, gy + 4, frame); // haste até a orelha
  } else if (v.glasses === 'round') {
    // Óculos redondos de vovó
    const gy = hc - 4;
    const frame = '#3a3a42';
    pb.rect(cx + 3, gy, 7, 1, frame);
    pb.rect(cx + 3, gy + 6, 7, 1, frame);
    pb.rect(cx + 2, gy + 1, 1, 5, frame);
    pb.rect(cx + 10, gy + 1, 1, 5, frame);
    pb.line(cx + 2, gy + 3, cx - 8, gy + 4, frame);
  }

  pb.outline('#241a1a');
  return pb;
}

function drawDog(frame: number): PixelBuffer {
  const pb = new PixelBuffer(80, 52);
  const body = '#c78d4e';
  const dark = '#9a6535';
  const light = '#e0b078';
  const groundY = 48;
  const bob = (frame % 2) * 2;

  pb.ellipse(38, 28 - bob, 22, 12, body);
  pb.dither(20, 16 - bob, 36, 5, dark);       // "sela" escura no dorso
  pb.ellipse(38, 36 - bob, 16, 4, light);      // barriga clara
  // Cabeça com focinho e nariz
  pb.ellipse(64, 20 - bob, 10, 10, body);
  pb.rect(70, 18 - bob, 9, 7, body);
  pb.rect(70, 23 - bob, 9, 2, light);
  pb.rect(77, 18 - bob, 3, 4, '#3a2a20');      // nariz
  pb.rect(66, 15 - bob, 4, 4, '#4a3428');      // olho
  pb.set(67, 16 - bob, '#ffffff');
  // Orelha caída com sombra
  pb.rect(58, 10 - bob, 6, 12, dark);
  pb.rect(58, 10 - bob, 2, 12, '#7a4e28');
  // Coleira vermelha com plaquinha
  pb.rect(56, 26 - bob, 8, 4, '#c0464a');
  pb.set(59, 30 - bob, '#e8c860');
  // Rabo animado
  const wag = [4, 0, -2, 0][frame % 4];
  pb.line(16, 24 - bob, 6, 14 - bob + wag, body);
  pb.line(16, 25 - bob, 6, 15 - bob + wag, body);
  pb.rect(4, 12 - bob + wag, 3, 3, dark);
  // Pernas correndo
  const off = [[4, -4, 4, -4], [0, 0, 0, 0], [-4, 4, -4, 4], [0, 0, 0, 0]][frame % 4];
  const xs = [22, 30, 46, 54];
  for (let i = 0; i < 4; i++) {
    const col = i === 1 || i === 2 ? dark : body;
    pb.rect(xs[i] + off[i], 36 - bob, 6, groundY - 36 + bob - Math.abs(off[i] / 2), col);
  }
  pb.outline('#241a1a');
  return pb;
}

function drawRat(frame: number): PixelBuffer {
  const pb = new PixelBuffer(36, 24);
  const body = '#8d8494';
  const dark = '#6e6f78';
  pb.ellipse(18, 14, 10, 6, body);
  pb.dither(10, 9, 16, 3, dark);
  pb.ellipse(27, 12, 5, 4, body);
  pb.rect(31, 11, 3, 3, '#d1857e');      // focinho
  pb.rect(27, 9, 2, 2, '#241a1a');       // olho
  pb.set(28, 9, '#ffffff');
  pb.ellipse(23, 6, 3, 3, '#c9a0a8');    // orelha
  pb.ellipse(23, 6, 1, 1, '#a87888');
  // Rabo curvado (2 frames)
  if (frame === 0) {
    pb.line(8, 14, 1, 8, '#c9a0a8');
    pb.line(8, 15, 1, 9, '#c9a0a8');
  } else {
    pb.line(8, 14, 0, 16, '#c9a0a8');
    pb.line(8, 15, 0, 17, '#c9a0a8');
  }
  pb.rect(13, 20, 3, 2, body);
  pb.rect(22, 20, 3, 2, body);
  pb.line(31, 13, 35, 12, '#e8e4da');    // bigode
  pb.outline('#241a1a');
  return pb;
}

function drawBird(frame: number): PixelBuffer {
  const pb = new PixelBuffer(32, 28);
  const body = '#c96f43';
  const wing = '#8a4a2e';
  const belly = '#e89a6a';
  pb.ellipse(16, 16, 8, 6, body);
  pb.ellipse(16, 19, 6, 3, belly);
  pb.ellipse(22, 10, 5, 4, body);
  pb.rect(26, 9, 5, 3, '#e8b53a');       // bico
  pb.set(26, 12, '#c99020');
  pb.rect(22, 7, 3, 3, '#241a1a');       // olho
  pb.set(23, 8, '#ffffff');
  // Asa (2 frames: em cima / embaixo)
  if (frame === 0) {
    pb.ellipse(12, 10, 6, 4, wing);
    pb.dither(8, 8, 8, 2, '#a86040');
  } else {
    pb.ellipse(12, 18, 6, 4, wing);
    pb.dither(8, 18, 8, 2, '#a86040');
  }
  pb.line(8, 16, 2, 12, '#6a4a3a');      // rabinho
  pb.line(8, 17, 2, 13, '#6a4a3a');
  pb.rect(13, 22, 2, 4, '#e8b53a');      // patinhas
  pb.rect(18, 22, 2, 4, '#e8b53a');
  pb.outline('#241a1a');
  return pb;
}

/** Gera as três humanas, cachorro, rato e pássaro. */
export function generateCharacterTextures(scene: Phaser.Scene): void {
  for (const variant of HUMAN_VARIANTS) {
    for (let f = 0; f < 4; f++) {
      drawHuman(SPECS[variant], f).toTexture(scene, `human-${variant}-walk-${f}`);
    }
  }
  for (let f = 0; f < 4; f++) {
    drawDog(f).toTexture(scene, `dog-run-${f}`);
  }
  drawRat(0).toTexture(scene, 'rat-0');
  drawRat(1).toTexture(scene, 'rat-1');
  drawBird(0).toTexture(scene, 'bird-0');
  drawBird(1).toTexture(scene, 'bird-1');
}
