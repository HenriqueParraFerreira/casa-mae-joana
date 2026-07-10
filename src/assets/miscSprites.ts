import Phaser from 'phaser';
import { PixelBuffer } from './PixelBuffer';

/**
 * Objetos interativos, UI e partículas em alta densidade (2x) — exibidos
 * com escala 0.5 no mundo.
 */

function vase(): PixelBuffer {
  const pb = new PixelBuffer(80, 176);
  // Corpo do vaso alto, com silhueta curva
  for (let y = 0; y < 168; y++) {
    const t = y / 168;
    const half = Math.round(16 + 20 * Math.sin(Math.PI * (0.15 + t * 0.85)));
    pb.rect(40 - half, y + 4, half * 2, 1, '#6a9ab8');
  }
  pb.rect(16, 4, 48, 8, '#5a86a2');
  pb.rect(16, 4, 48, 2, '#7cabc8');
  // Brilho de cerâmica e sombra
  pb.dither(22, 40, 12, 100, '#88b2cc');
  pb.rect(26, 44, 4, 80, '#9cc2d8');
  pb.dither(54, 40, 10, 100, '#5a86a2');
  // Faixas decorativas gregas
  pb.rect(12, 80, 56, 6, '#e8dcc3');
  for (let x = 14; x < 66; x += 8) pb.rect(x, 82, 4, 2, '#6a9ab8');
  pb.rect(16, 116, 48, 4, '#e8dcc3');
  // RACHADURA bem visível, ramificada
  pb.line(40, 20, 28, 60, '#241a1a');
  pb.line(28, 60, 44, 104, '#241a1a');
  pb.line(44, 104, 32, 148, '#241a1a');
  pb.line(28, 60, 16, 76, '#241a1a');
  pb.line(44, 104, 56, 118, '#241a1a');
  pb.outline();
  return pb;
}

function crate(): PixelBuffer {
  const pb = new PixelBuffer(64, 64);
  pb.rect(0, 0, 64, 64, '#b98a5a');
  pb.rect(0, 0, 64, 6, '#cfa06c');
  pb.rect(0, 58, 64, 6, '#96683c');
  pb.rect(0, 0, 6, 64, '#a5713f');
  pb.rect(58, 0, 6, 64, '#a5713f');
  // Travas diagonais duplas
  pb.line(4, 4, 58, 58, '#96683c');
  pb.line(5, 4, 59, 58, '#96683c');
  pb.line(58, 4, 4, 58, '#96683c');
  pb.line(59, 4, 5, 58, '#96683c');
  // Pregos
  for (const [px, py] of [[8, 8], [54, 8], [8, 54], [54, 54]]) {
    pb.set(px, py, '#6a4426');
    pb.set(px + 1, py, '#e0c090');
  }
  // Veio da madeira
  pb.line(12, 30, 30, 31, '#a5713f');
  pb.outline();
  return pb;
}

function roller(): PixelBuffer {
  const pb = new PixelBuffer(72, 72);
  pb.ellipse(36, 36, 32, 32, '#6a8ac0');
  pb.ellipse(36, 36, 26, 26, '#88a8d8');
  pb.ellipse(36, 36, 10, 10, '#e8dcc3');
  pb.ellipse(36, 36, 5, 5, '#d9a03a');
  // Estrela de 4 pontas no centro
  pb.rect(35, 24, 3, 8, '#d9a03a');
  pb.rect(35, 41, 3, 8, '#d9a03a');
  pb.rect(24, 35, 8, 3, '#d9a03a');
  pb.rect(41, 35, 8, 3, '#d9a03a');
  // Brilho e sombra de volume
  pb.dither(14, 12, 20, 14, '#a8c4e8');
  pb.dither(42, 48, 16, 12, '#5a76a8');
  // Raios do rolo
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    pb.line(36 + Math.cos(a) * 12, 36 + Math.sin(a) * 12, 36 + Math.cos(a) * 24, 36 + Math.sin(a) * 24, '#5a76a8');
  }
  pb.outline();
  return pb;
}

function cushion(on: boolean): PixelBuffer {
  const pb = new PixelBuffer(88, 36);
  const base = on ? '#d9787c' : '#b5524a';
  const top = on ? '#e896a0' : '#c06a5e';
  pb.ellipse(44, 20, 40, 12, base);
  pb.ellipse(44, 16, 36, 10, top);
  pb.ellipse(44, 14, 28, 6, on ? '#f0aab4' : '#cc7668');
  // Costura e borlas douradas
  for (let x = 12; x < 76; x += 8) pb.set(x, 26, '#e8c860');
  pb.ellipse(6, 18, 3, 3, '#e8c860');
  pb.ellipse(82, 18, 3, 3, '#e8c860');
  pb.set(44, 8, '#e8c860');
  if (on) {
    // Brilhinho de checkpoint ativo
    pb.set(20, 4, '#ffe08a');
    pb.set(68, 4, '#ffe08a');
    pb.rect(43, 0, 3, 3, '#ffe08a');
  }
  pb.outline();
  return pb;
}

function plate(on: boolean): PixelBuffer {
  const pb = new PixelBuffer(56, 20);
  const h = on ? 6 : 12;
  pb.rect(4, 18 - h, 48, h, on ? '#7cb45b' : '#c0464a');
  pb.rect(4, 18 - h, 48, 3, on ? '#96cc72' : '#d96a6e');
  pb.rect(4, 18 - h, 4, h, on ? '#5e9440' : '#a83a3e');
  pb.rect(0, 14, 56, 6, '#8a92a0');
  pb.rect(0, 14, 56, 2, '#a8aeba');
  pb.outline();
  return pb;
}

function padlock(): PixelBuffer {
  const pb = new PixelBuffer(48, 60);
  pb.rect(8, 24, 32, 32, '#d9a03a');
  pb.rect(8, 24, 32, 6, '#e8c860');
  pb.rect(8, 50, 32, 6, '#b8842a');
  // Alça de metal
  pb.rect(14, 8, 6, 18, '#b0b6c0');
  pb.rect(28, 8, 6, 18, '#b0b6c0');
  pb.rect(14, 6, 20, 6, '#b0b6c0');
  pb.rect(14, 6, 20, 2, '#d0d6e0');
  // Buraco de chave
  pb.ellipse(24, 38, 4, 4, '#8a6420');
  pb.rect(22, 40, 4, 8, '#8a6420');
  // Rachadura convidativa
  pb.line(12, 28, 24, 44, '#241a1a');
  pb.line(24, 44, 18, 52, '#241a1a');
  pb.set(11, 27, '#fff0b0');
  pb.outline();
  return pb;
}

function mechanism(): PixelBuffer {
  const pb = new PixelBuffer(72, 72);
  pb.rect(4, 4, 64, 64, '#5a5a66');
  pb.rect(4, 4, 64, 4, '#787886');
  // Engrenagem grande
  pb.ellipse(26, 28, 16, 16, '#8a92a0');
  pb.ellipse(26, 28, 8, 8, '#5a5a66');
  pb.ellipse(26, 28, 3, 3, '#b0b6c0');
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    pb.rect(26 + Math.cos(a) * 17 - 1, 28 + Math.sin(a) * 17 - 1, 3, 3, '#8a92a0');
  }
  // Engrenagem pequena
  pb.ellipse(50, 48, 12, 12, '#b0b6c0');
  pb.ellipse(50, 48, 6, 6, '#5a5a66');
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    pb.rect(50 + Math.cos(a) * 13 - 1, 48 + Math.sin(a) * 13 - 1, 3, 3, '#b0b6c0');
  }
  // Parafusos e faísca de fragilidade
  for (const [px, py] of [[10, 10], [60, 10], [10, 60], [60, 60]]) {
    pb.rect(px, py, 3, 3, '#3a3a42');
  }
  pb.line(12, 12, 32, 40, '#e8b53a');
  pb.line(32, 40, 26, 52, '#e8b53a');
  pb.outline();
  return pb;
}

function door(): PixelBuffer {
  // Porta de perfil: painel fino e alto
  const pb = new PixelBuffer(40, 224);
  pb.rect(0, 0, 40, 224, '#9a6a3c');
  pb.rect(4, 4, 32, 216, '#b98a5a');
  pb.rect(4, 4, 4, 216, '#cfa06c');
  pb.rect(8, 20, 24, 76, '#9a6a3c');
  pb.rect(10, 22, 20, 72, '#a5713f');
  pb.rect(8, 116, 24, 76, '#9a6a3c');
  pb.rect(10, 118, 20, 72, '#a5713f');
  // Maçaneta
  pb.ellipse(32, 108, 4, 4, '#e8c860');
  pb.set(31, 106, '#fff0b0');
  pb.outline();
  return pb;
}

function doorway(): PixelBuffer {
  const pb = new PixelBuffer(56, 232);
  pb.rect(0, 0, 56, 232, '#3a2c26');
  pb.rect(0, 0, 8, 232, '#7a5028');
  pb.rect(48, 0, 8, 232, '#7a5028');
  pb.rect(0, 0, 56, 8, '#7a5028');
  pb.rect(2, 0, 2, 232, '#9a6a3c');
  pb.rect(52, 0, 2, 232, '#9a6a3c');
  pb.dither(12, 16, 32, 200, '#4a3830');
  return pb;
}

function exitDoor(): PixelBuffer {
  const pb = new PixelBuffer(144, 240);
  pb.rect(0, 0, 144, 240, '#7a5028');
  pb.rect(4, 0, 4, 240, '#9a6a3c');
  pb.rect(136, 0, 4, 240, '#9a6a3c');
  pb.rect(12, 12, 120, 228, '#ffe9ad');
  pb.dither(12, 12, 120, 228, '#ffd97a');
  // Raios de luz dourada
  for (const rx of [24, 56, 88, 116]) {
    pb.rect(rx, 12, 8, 228, '#fff4d0');
    pb.rect(rx + 2, 12, 3, 228, '#ffffff');
  }
  pb.dither(12, 200, 120, 40, '#ffcf60');
  pb.outline();
  return pb;
}

function particle(size: number, draw: (pb: PixelBuffer) => void): PixelBuffer {
  const pb = new PixelBuffer(size, size);
  draw(pb);
  return pb;
}

function speaker(on: boolean): PixelBuffer {
  const pb = new PixelBuffer(52, 52);
  const c = '#fff8e8';
  // Caixa + corneta
  pb.rect(4, 20, 10, 14, c);
  for (let i = 0; i < 12; i++) {
    const grow = Math.floor(i * 1.2);
    pb.rect(14 + i, Math.max(20 - grow, 4), 2, Math.min(14 + grow * 2, 44), c);
  }
  if (on) {
    // Ondinhas de som
    pb.line(32, 20, 34, 26, c);
    pb.line(34, 26, 32, 32, c);
    pb.line(33, 20, 35, 26, c);
    pb.line(38, 16, 42, 26, c);
    pb.line(42, 26, 38, 36, c);
    pb.line(39, 16, 43, 26, c);
  } else {
    // X vermelho grosso
    for (const o of [0, 1, 2]) {
      pb.line(32 + o, 18, 46 + o, 34, '#e86a6a');
      pb.line(46 - o, 18, 32 - o + 14, 34 - 16, '#e86a6a');
      pb.line(46 + o, 18, 32 + o, 34, '#e86a6a');
    }
  }
  pb.outline();
  return pb;
}

function lockIcon(): PixelBuffer {
  const pb = new PixelBuffer(32, 36);
  pb.rect(6, 16, 20, 16, '#8a8078');
  pb.rect(6, 16, 20, 3, '#a8a098');
  pb.rect(10, 6, 4, 12, '#8a8078');
  pb.rect(18, 6, 4, 12, '#8a8078');
  pb.rect(10, 4, 12, 4, '#8a8078');
  pb.rect(14, 20, 4, 8, '#4a4440');
  pb.outline();
  return pb;
}

export function generateMiscTextures(scene: Phaser.Scene): void {
  vase().toTexture(scene, 'vase');
  crate().toTexture(scene, 'crate');
  roller().toTexture(scene, 'roller');
  cushion(false).toTexture(scene, 'cushion');
  cushion(true).toTexture(scene, 'cushion-on');
  plate(false).toTexture(scene, 'plate-off');
  plate(true).toTexture(scene, 'plate-on');
  padlock().toTexture(scene, 'lock');
  mechanism().toTexture(scene, 'mech');
  door().toTexture(scene, 'door');
  doorway().toTexture(scene, 'doorway');
  exitDoor().toTexture(scene, 'exit-door');
  speaker(true).toTexture(scene, 'spk-on');
  speaker(false).toTexture(scene, 'spk-off');
  lockIcon().toTexture(scene, 'ui-lock');

  // Partículas (2x, exibidas com scale ~0.5 nos emissores)
  particle(12, (pb) => {
    pb.ellipse(6, 6, 4, 4, '#d8c8a8');
    pb.ellipse(5, 5, 2, 2, '#f0e8d8');
  }).toTexture(scene, 'p-dust');
  particle(18, (pb) => {
    pb.rect(8, 0, 2, 18, '#ffe08a');
    pb.rect(0, 8, 18, 2, '#ffe08a');
    pb.line(3, 3, 14, 14, '#ffe08a');
    pb.line(14, 3, 3, 14, '#ffe08a');
    pb.rect(6, 6, 6, 6, '#fff4d0');
  }).toTexture(scene, 'p-star');
  particle(18, (pb) => {
    pb.ellipse(5, 6, 4, 4, '#e86a8a');
    pb.ellipse(12, 6, 4, 4, '#e86a8a');
    pb.rect(2, 7, 14, 4, '#e86a8a');
    pb.rect(4, 11, 10, 2, '#e86a8a');
    pb.rect(6, 13, 6, 2, '#e86a8a');
    pb.rect(8, 15, 2, 2, '#e86a8a');
    pb.rect(4, 5, 3, 2, '#f8a8c0');
  }).toTexture(scene, 'p-heart');
  particle(20, (pb) => {
    pb.ellipse(10, 10, 8, 8, '#c8c0b8');
    pb.ellipse(8, 8, 4, 4, '#e0d8d0');
    pb.ellipse(13, 12, 3, 3, '#b0a8a0');
  }).toTexture(scene, 'p-smoke');
  particle(10, (pb) => {
    pb.rect(4, 0, 2, 10, '#fff4d0');
    pb.rect(0, 4, 10, 2, '#fff4d0');
    pb.rect(3, 3, 4, 4, '#ffe08a');
  }).toTexture(scene, 'p-sparkle');
  particle(10, (pb) => { pb.rect(0, 0, 10, 8, '#ffffff'); }).toTexture(scene, 'p-confetti');
  particle(20, (pb) => {
    pb.ellipse(10, 13, 6, 4, '#ffd04a');
    pb.ellipse(4, 5, 2, 2, '#ffd04a');
    pb.ellipse(9, 3, 2, 2, '#ffd04a');
    pb.ellipse(14, 4, 2, 2, '#ffd04a');
    pb.set(17, 7, '#ffd04a');
  }).toTexture(scene, 'p-paw');
}
