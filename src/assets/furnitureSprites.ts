import Phaser from 'phaser';
import { PixelBuffer } from './PixelBuffer';

/**
 * Móveis em alta densidade (2x) — exibidos com escala 0.5. Cada peça tem
 * sombreamento, veios e detalhes que não cabiam na versão 1x.
 */

const WOOD = '#9a6a3c';
const WOOD_D = '#7a5028';
const WOOD_L = '#b98a5a';

function sofa(): PixelBuffer {
  const pb = new PixelBuffer(256, 96);
  pb.rect(8, 40, 240, 48, '#a8564e');
  pb.rect(0, 16, 28, 72, '#96483f');    // braço esq
  pb.rect(228, 16, 28, 72, '#96483f');  // braço dir
  pb.rect(2, 16, 24, 4, '#b06a5e');     // topo dos braços iluminado
  pb.rect(230, 16, 24, 4, '#b06a5e');
  pb.rect(28, 24, 200, 20, '#96483f');  // encosto
  pb.rect(28, 24, 200, 3, '#b06a5e');
  // Almofadas com botões e vinco
  pb.rect(32, 44, 94, 16, '#c06a5e');
  pb.rect(130, 44, 94, 16, '#c06a5e');
  pb.rect(32, 44, 94, 3, '#d97f70');
  pb.rect(130, 44, 94, 3, '#d97f70');
  pb.set(79, 52, '#8a3a30');
  pb.set(177, 52, '#8a3a30');
  pb.dither(32, 60, 192, 12, '#96483f');
  // Pés torneados
  pb.rect(16, 88, 12, 8, WOOD_D);
  pb.rect(228, 88, 12, 8, WOOD_D);
  pb.rect(16, 88, 12, 2, WOOD);
  pb.rect(228, 88, 12, 2, WOOD);
  pb.outline();
  return pb;
}

function dresser(): PixelBuffer {
  const pb = new PixelBuffer(192, 208);
  pb.rect(0, 0, 192, 208, WOOD);
  pb.rect(0, 0, 192, 8, WOOD_L);
  pb.rect(0, 8, 192, 2, '#cfa06c');
  for (let d = 0; d < 3; d++) {
    const y = 20 + d * 60;
    pb.rect(16, y, 160, 48, WOOD_L);
    pb.rect(20, y + 4, 152, 40, WOOD);
    pb.rect(20, y + 4, 152, 3, WOOD_D);      // sombra interna
    // Veios da gaveta
    pb.line(30, y + 20, 80, y + 22, WOOD_D);
    pb.line(100, y + 30, 150, y + 31, WOOD_D);
    // Puxador dourado com brilho
    pb.ellipse(96, y + 24, 7, 7, '#e8c860');
    pb.ellipse(96, y + 24, 3, 3, '#c9a030');
    pb.set(94, y + 21, '#fff0b0');
  }
  pb.dither(0, 200, 192, 8, WOOD_D);
  pb.outline();
  return pb;
}

function wardrobe(): PixelBuffer {
  const pb = new PixelBuffer(192, 256);
  pb.rect(0, 0, 192, 256, WOOD_D);
  pb.rect(0, 0, 192, 10, WOOD);
  pb.rect(0, 0, 192, 3, WOOD_L);
  pb.rect(12, 20, 80, 224, WOOD);
  pb.rect(100, 20, 80, 224, WOOD);
  // Bisotê das portas
  pb.rect(20, 28, 64, 100, WOOD_L);
  pb.rect(24, 32, 56, 92, WOOD);
  pb.rect(108, 28, 64, 100, WOOD_L);
  pb.rect(112, 32, 56, 92, WOOD);
  pb.rect(20, 140, 64, 96, WOOD_L);
  pb.rect(24, 144, 56, 88, WOOD);
  pb.rect(108, 140, 64, 96, WOOD_L);
  pb.rect(112, 144, 56, 88, WOOD);
  // Puxadores
  pb.rect(84, 110, 6, 24, '#e8c860');
  pb.rect(102, 110, 6, 24, '#e8c860');
  pb.outline();
  return pb;
}

function bed(): PixelBuffer {
  const pb = new PixelBuffer(320, 112);
  pb.rect(0, 16, 24, 96, WOOD);          // cabeceira
  pb.rect(0, 16, 24, 4, WOOD_L);
  pb.rect(300, 40, 20, 72, WOOD);        // pé
  pb.rect(16, 52, 296, 32, '#f0e8d8');   // colchão
  // Coberta listrada com dobra
  pb.rect(16, 44, 296, 22, '#7a9ac0');
  pb.rect(16, 44, 296, 4, '#94b2d4');
  for (let x = 30; x < 300; x += 24) pb.rect(x, 50, 2, 14, '#6a88ac');
  pb.dither(16, 62, 296, 6, '#6a88ac');
  // Travesseiro fofinho
  pb.ellipse(60, 46, 28, 12, '#ffffff');
  pb.ellipse(60, 44, 24, 8, '#f4f4f8');
  pb.line(40, 52, 80, 52, '#d8d8e0');
  // Pés
  pb.rect(24, 84, 8, 28, WOOD_D);
  pb.rect(292, 84, 8, 28, WOOD_D);
  pb.outline();
  return pb;
}

function fridge(): PixelBuffer {
  const pb = new PixelBuffer(128, 256);
  pb.rect(0, 0, 128, 256, '#dde4ea');
  pb.rect(0, 0, 128, 6, '#f2f6fa');
  pb.rect(4, 0, 8, 256, '#f2f6fa');           // brilho vertical
  pb.rect(8, 88, 112, 6, '#aab4c0');          // divisão freezer
  pb.rect(100, 28, 10, 48, '#8a92a0');        // puxador cima
  pb.rect(100, 108, 10, 80, '#8a92a0');
  pb.rect(100, 28, 3, 48, '#6e7684');
  pb.rect(100, 108, 3, 80, '#6e7684');
  // Ímãs de geladeira!
  pb.rect(30, 120, 10, 10, '#c0464a');
  pb.ellipse(60, 140, 6, 6, '#7cb45b');
  pb.rect(40, 160, 12, 8, '#e8b53a');
  // Desenho de criança preso na porta
  pb.rect(28, 180, 36, 44, '#fff8e8');
  pb.line(34, 210, 42, 196, '#c0464a');
  pb.line(42, 196, 50, 210, '#c0464a');
  pb.ellipse(46, 190, 5, 5, '#e8b53a');
  pb.dither(8, 230, 112, 20, '#c8d0d8');
  pb.outline();
  return pb;
}

function stove(): PixelBuffer {
  const pb = new PixelBuffer(128, 192);
  pb.rect(0, 0, 128, 192, '#c8ccd4');
  pb.rect(0, 0, 128, 12, '#e8ecf0');
  // Bocas com grelha
  for (const bx of [28, 84]) {
    pb.ellipse(bx, 6, 16, 4, '#3a3a42');
    pb.ellipse(bx, 6, 10, 2, '#5a5a66');
    pb.set(bx - 6, 6, '#3a3a42');
    pb.set(bx + 6, 6, '#3a3a42');
  }
  // Panela no fogo
  pb.rect(12, -6, 34, 8, '#8a4a4a');
  pb.rect(10, -6, 38, 3, '#a86060');
  pb.rect(46, -4, 8, 3, '#8a4a4a');    // cabo
  // Botões do forno
  for (let k = 0; k < 4; k++) {
    pb.ellipse(24 + k * 26, 24, 5, 5, '#8a92a0');
    pb.rect(24 + k * 26, 20, 1, 4, '#3a3a42');
  }
  // Janela do forno com brilho quente
  pb.rect(16, 40, 96, 60, '#3a3a42');
  pb.rect(24, 48, 80, 44, '#5a4432');
  pb.dither(24, 48, 80, 20, '#7a5c40');
  pb.ellipse(64, 76, 24, 10, '#a8703a');   // assado!
  pb.rect(24, 48, 80, 4, '#8a92a0');
  // Barra de pano de prato
  pb.rect(20, 110, 88, 8, '#8a92a0');
  pb.rect(36, 114, 24, 30, '#c0464a');
  pb.rect(36, 114, 24, 4, '#d96a6e');
  pb.outline();
  return pb;
}

function windowFrame(): PixelBuffer {
  const pb = new PixelBuffer(192, 192);
  pb.rect(0, 0, 192, 192, WOOD_L);
  pb.rect(0, 0, 192, 4, '#cfa06c');
  // Céu em faixas (degradê manual)
  pb.rect(12, 12, 168, 168, '#9ad0e8');
  pb.rect(12, 12, 168, 40, '#b4e0f2');
  pb.dither(12, 52, 168, 12, '#b4e0f2');
  pb.dither(12, 110, 168, 14, '#7cb45b');
  pb.rect(12, 124, 168, 56, '#7cb45b');
  pb.dither(12, 124, 168, 8, '#96cc72');
  // Sol com raios
  pb.ellipse(132, 52, 24, 24, '#ffe08a');
  pb.ellipse(132, 52, 16, 16, '#ffd04a');
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    pb.line(132 + Math.cos(a) * 28, 52 + Math.sin(a) * 28, 132 + Math.cos(a) * 34, 52 + Math.sin(a) * 34, '#ffe08a');
  }
  // Nuvens
  pb.ellipse(52, 80, 20, 10, '#ffffff');
  pb.ellipse(68, 76, 12, 8, '#ffffff');
  pb.ellipse(150, 100, 14, 6, '#f4f8fc');
  // Cruzeta com sombra
  pb.rect(88, 12, 12, 168, WOOD_L);
  pb.rect(88, 12, 3, 168, '#cfa06c');
  pb.rect(12, 88, 168, 12, WOOD_L);
  pb.rect(12, 88, 168, 3, '#cfa06c');
  pb.outline();
  return pb;
}

function doorDeco(): PixelBuffer {
  const pb = new PixelBuffer(128, 224);
  pb.rect(0, 0, 128, 224, WOOD);
  pb.rect(8, 8, 112, 216, WOOD_L);
  pb.rect(12, 12, 104, 208, WOOD);
  // Almofadas com bisotê
  pb.rect(20, 24, 88, 80, WOOD_L);
  pb.rect(26, 30, 76, 68, WOOD);
  pb.rect(20, 120, 88, 80, WOOD_L);
  pb.rect(26, 126, 76, 68, WOOD);
  // Maçaneta com espelho
  pb.rect(98, 106, 10, 22, '#c9a030');
  pb.ellipse(103, 112, 6, 6, '#e8c860');
  pb.set(101, 109, '#fff0b0');
  pb.outline();
  return pb;
}

function plant(): PixelBuffer {
  const pb = new PixelBuffer(80, 144);
  // Vaso de barro com friso
  pb.rect(24, 112, 32, 28, '#c06a3e');
  pb.rect(20, 106, 40, 10, '#d97a48');
  pb.rect(20, 106, 40, 3, '#e8925c');
  pb.dither(26, 120, 8, 16, '#a85830');
  // Folhas com nervura central
  const leaves: [number, number, number, number, string][] = [
    [40, 66, 8, 36, '#4e8a3c'],
    [22, 84, 8, 24, '#5e9c48'],
    [58, 84, 8, 24, '#5e9c48'],
    [30, 56, 6, 18, '#6cb454'],
    [50, 56, 6, 18, '#6cb454']
  ];
  for (const [lx, ly, rx, ry, col] of leaves) {
    pb.ellipse(lx, ly, rx, ry, col);
    pb.line(lx, ly - ry + 3, lx, ly + ry - 3, '#3c6e2e');
  }
  pb.outline();
  return pb;
}

function painting(): PixelBuffer {
  const pb = new PixelBuffer(96, 80);
  pb.rect(0, 0, 96, 80, '#d9a03a');
  pb.rect(4, 4, 88, 72, '#c98f2a');
  pb.rect(8, 8, 80, 64, '#e8dcc3');
  // Retrato de um gato ancestral, claro
  pb.ellipse(48, 50, 16, 12, '#8d8494');
  pb.ellipse(58, 36, 9, 8, '#8d8494');
  pb.rect(52, 26, 4, 6, '#8d8494');
  pb.rect(62, 26, 4, 6, '#8d8494');
  pb.rect(55, 33, 2, 2, '#e8b53a');
  pb.rect(60, 33, 2, 2, '#e8b53a');
  pb.line(38, 56, 28, 52, '#6f7681');   // rabo
  pb.dither(10, 62, 76, 8, '#d8c8a8');
  pb.outline();
  return pb;
}

function lamp(): PixelBuffer {
  const pb = new PixelBuffer(56, 112);
  pb.rect(24, 40, 8, 62, '#7a5028');
  pb.rect(26, 40, 2, 62, '#9a6a3c');
  pb.rect(12, 100, 32, 8, '#7a5028');
  pb.rect(12, 100, 32, 2, '#9a6a3c');
  // Cúpula com listras e luz acesa
  for (let y = 0; y < 36; y++) {
    const half = 8 + Math.floor(y / 2.2);
    pb.rect(28 - half, y + 4, half * 2, 1, y % 6 < 3 ? '#e8c078' : '#f2d898');
  }
  pb.dither(12, 8, 32, 10, '#fff0c0');
  pb.rect(14, 38, 28, 3, '#c9a050');
  pb.outline();
  return pb;
}

function curtain(): PixelBuffer {
  const pb = new PixelBuffer(80, 240);
  for (let x = 0; x < 80; x += 16) {
    pb.rect(x, 0, 12, 236, '#c05a68');
    pb.rect(x + 2, 0, 4, 236, '#d97a88');
    pb.rect(x + 9, 0, 3, 236, '#a84856');
  }
  // Ondulação na barra de baixo
  for (let x = 0; x < 80; x += 16) {
    pb.ellipse(x + 6, 234, 6, 4, '#c05a68');
  }
  pb.rect(0, 0, 80, 8, '#8a3a48');
  pb.rect(0, 0, 80, 2, '#a84856');
  pb.outline();
  return pb;
}

function fence(): PixelBuffer {
  const pb = new PixelBuffer(64, 128);
  for (const x of [4, 26, 48]) {
    pb.rect(x, 12, 12, 116, '#c8a068');
    pb.rect(x + 2, 12, 4, 116, '#dfc090');
    pb.rect(x + 9, 12, 3, 116, '#b08850');
    // Ponta triangular
    pb.rect(x + 2, 6, 8, 7, '#c8a068');
    pb.rect(x + 4, 2, 4, 5, '#c8a068');
  }
  // Travessas com sombra
  pb.rect(0, 32, 64, 10, '#b08850');
  pb.rect(0, 32, 64, 3, '#c8a068');
  pb.rect(0, 84, 64, 10, '#b08850');
  pb.rect(0, 84, 64, 3, '#c8a068');
  pb.outline();
  return pb;
}

function sun(): PixelBuffer {
  const pb = new PixelBuffer(112, 112);
  pb.ellipse(56, 56, 28, 28, '#ffd04a');
  pb.ellipse(56, 56, 20, 20, '#ffe08a');
  pb.ellipse(50, 50, 8, 8, '#fff4d0');
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const len = i % 2 === 0 ? 50 : 42;
    pb.line(56 + Math.cos(a) * 34, 56 + Math.sin(a) * 34, 56 + Math.cos(a) * len, 56 + Math.sin(a) * len, '#ffd04a');
    pb.line(57 + Math.cos(a) * 34, 56 + Math.sin(a) * 34, 57 + Math.cos(a) * len, 56 + Math.sin(a) * len, '#ffe08a');
  }
  return pb;
}

function flower(v: number): PixelBuffer {
  const pb = new PixelBuffer(32, 48);
  pb.rect(14, 20, 4, 26, '#4e8a3c');
  pb.ellipse(10, 32, 4, 2, '#5e9c48');
  pb.ellipse(22, 28, 4, 2, '#5e9c48');
  const c = v === 0 ? '#e86a8a' : '#e8b53a';
  const cl = v === 0 ? '#f8a8c0' : '#ffd97a';
  // Pétalas em volta do miolo
  pb.ellipse(16, 8, 4, 4, c);
  pb.ellipse(10, 12, 4, 4, c);
  pb.ellipse(22, 12, 4, 4, c);
  pb.ellipse(12, 17, 4, 3, c);
  pb.ellipse(20, 17, 4, 3, c);
  pb.set(16, 5, cl);
  pb.ellipse(16, 12, 3, 3, '#fff0c0');
  pb.set(16, 11, '#d9a03a');
  pb.outline();
  return pb;
}

function tableLeg(): PixelBuffer {
  const pb = new PixelBuffer(20, 136);
  pb.rect(4, 0, 12, 136, WOOD);
  pb.rect(6, 0, 4, 136, WOOD_L);
  pb.rect(13, 0, 3, 136, WOOD_D);
  pb.outline();
  return pb;
}

function tablecloth(): PixelBuffer {
  const pb = new PixelBuffer(256, 152);
  pb.rect(0, 0, 256, 20, '#e8dcc3');
  pb.rect(0, 0, 256, 4, '#f4ecd8');
  for (let x = 0; x < 256; x += 32) {
    pb.rect(x, 20, 24, 124, '#e8dcc3');
    pb.rect(x + 4, 20, 6, 124, '#d8c8a8');
    pb.rect(x + 16, 20, 3, 124, '#d8c8a8');
    // Barrado bordado
    pb.rect(x + 4, 128, 16, 8, '#c05a4a');
    pb.set(x + 8, 124, '#c05a4a');
    pb.set(x + 14, 124, '#c05a4a');
  }
  pb.outline();
  return pb;
}

export function generateFurnitureTextures(scene: Phaser.Scene): void {
  sofa().toTexture(scene, 'f-sofa');
  dresser().toTexture(scene, 'f-dresser');
  wardrobe().toTexture(scene, 'f-wardrobe');
  bed().toTexture(scene, 'f-bed');
  fridge().toTexture(scene, 'f-fridge');
  stove().toTexture(scene, 'f-stove');
  windowFrame().toTexture(scene, 'window');
  doorDeco().toTexture(scene, 'door-deco');
  plant().toTexture(scene, 'plant');
  painting().toTexture(scene, 'painting');
  lamp().toTexture(scene, 'lamp');
  curtain().toTexture(scene, 'curtain');
  fence().toTexture(scene, 'fence');
  sun().toTexture(scene, 'sun');
  flower(0).toTexture(scene, 'flower-0');
  flower(1).toTexture(scene, 'flower-1');
  tableLeg().toTexture(scene, 'tableleg');
  tablecloth().toTexture(scene, 'tablecloth');
}
