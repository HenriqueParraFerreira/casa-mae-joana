import Phaser from 'phaser';
import { PixelBuffer } from './PixelBuffer';

/**
 * Tiles em 64x64 (2x de densidade — os TileSprites usam tileScale 0.5),
 * com veios de madeira, nós e textura fina.
 */

function woodTile(base: string, dark: string, light: string): PixelBuffer {
  const pb = new PixelBuffer(64, 64);
  pb.rect(0, 0, 64, 64, base);
  for (let row = 0; row < 4; row++) {
    const y = row * 16;
    pb.rect(0, y, 64, 2, light);          // topo da tábua iluminado
    pb.rect(0, y + 14, 64, 2, dark);      // sombra entre tábuas
    // Emenda desencontrada
    const seam = (row * 26 + 10) % 64;
    pb.rect(seam, y, 2, 14, dark);
    // Veios da madeira
    for (let g = 0; g < 3; g++) {
      const gx = (row * 17 + g * 22 + 6) % 56;
      pb.line(gx, y + 4 + g * 3, gx + 10, y + 5 + g * 3, dark);
    }
    // Nó de madeira ocasional
    if (row % 2 === 0) {
      const kx = (row * 31 + 40) % 58;
      pb.ellipse(kx, y + 8, 2, 1, dark);
      pb.set(kx, y + 8, '#5e3c1e');
    }
  }
  return pb;
}

function wallTile(): PixelBuffer {
  const pb = new PixelBuffer(64, 64);
  pb.rect(0, 0, 64, 64, '#e8dcc3');
  // Painéis verticais sutis
  pb.rect(0, 0, 1, 64, '#ddd0b2');
  pb.rect(32, 0, 1, 64, '#ddd0b2');
  pb.rect(31, 0, 1, 64, '#f2e8d2');
  // Ruído fino de textura
  for (let i = 0; i < 40; i++) {
    const x = (i * 13 + 5) % 64;
    const y = (i * 23 + 11) % 64;
    pb.set(x, y, i % 3 === 0 ? '#f0e4cc' : '#ddd0b2');
  }
  return pb;
}

function carpetTile(): PixelBuffer {
  const pb = new PixelBuffer(64, 64);
  pb.rect(0, 0, 64, 64, '#b5524a');
  pb.dither(0, 0, 64, 64, '#a8483f');
  // Losangos decorativos com miolo
  for (const [cx, cy] of [[16, 16], [48, 16], [16, 48], [48, 48]]) {
    for (let d = 0; d < 5; d++) {
      pb.set(cx - d, cy - 4 + d, '#d9a03a');
      pb.set(cx + d, cy - 4 + d, '#d9a03a');
      pb.set(cx - d, cy + 4 - d, '#d9a03a');
      pb.set(cx + d, cy + 4 - d, '#d9a03a');
    }
    pb.rect(cx - 1, cy - 1, 2, 2, '#e8dcc3');
  }
  // Fio da trama
  for (let x = 0; x < 64; x += 4) pb.set(x, 32, '#c2635a');
  return pb;
}

function grassTile(): PixelBuffer {
  const pb = new PixelBuffer(64, 64);
  pb.rect(0, 0, 64, 64, '#7cb45b');
  pb.rect(0, 0, 64, 4, '#96cc72');
  pb.dither(0, 4, 64, 3, '#96cc72');
  // Folhinhas e capim
  for (let i = 0; i < 26; i++) {
    const x = (i * 17 + 3) % 62;
    const y = 8 + ((i * 11) % 52);
    if (i % 3 === 0) {
      pb.line(x, y + 3, x, y, '#5e9440');
      pb.line(x + 2, y + 3, x + 3, y + 1, '#5e9440');
    } else {
      pb.set(x, y, i % 2 === 0 ? '#96cc72' : '#5e9440');
    }
  }
  // Florzinha perdida
  pb.set(40, 30, '#e8dcc3');
  pb.set(12, 50, '#ffd04a');
  return pb;
}

function counterTile(): PixelBuffer {
  const pb = new PixelBuffer(64, 64);
  pb.rect(0, 0, 64, 64, '#cdd2da');
  pb.rect(0, 0, 64, 8, '#e8ecf0');           // tampo claro
  pb.rect(0, 8, 64, 2, '#9aa2ae');
  // Portinha com sombra e puxador metálico
  pb.rect(6, 16, 52, 42, '#bec4cd');
  pb.rect(6, 16, 52, 2, '#d8dce4');
  pb.rect(6, 56, 52, 2, '#a8aeba');
  pb.rect(28, 30, 8, 14, '#8a92a0');
  pb.rect(28, 30, 2, 14, '#6e7684');
  // Respingos/speckle do mármore do tampo
  for (let i = 0; i < 10; i++) pb.set((i * 13 + 4) % 60, 2 + (i % 4), '#c8ccd4');
  return pb;
}

function shelfTile(): PixelBuffer {
  const pb = new PixelBuffer(64, 32);
  pb.rect(0, 0, 64, 32, '#8a5a34');
  pb.rect(0, 0, 64, 4, '#b98a5a');
  pb.rect(0, 4, 64, 1, '#a5713f');
  pb.rect(0, 28, 64, 4, '#6a4426');
  // Veios
  pb.line(6, 12, 26, 13, '#7a4e2c');
  pb.line(34, 18, 58, 19, '#7a4e2c');
  pb.line(14, 22, 30, 23, '#7a4e2c');
  return pb;
}

/** Gera tiles repetíveis usados nos TileSprites das plataformas. */
export function generateTileTextures(scene: Phaser.Scene): void {
  woodTile('#b98a5a', '#96683c', '#cfa06c').toTexture(scene, 'tile-wood');
  woodTile('#8a5a34', '#6a4426', '#a5713f').toTexture(scene, 'tile-wood-dark');
  wallTile().toTexture(scene, 'tile-wall');
  carpetTile().toTexture(scene, 'tile-carpet');
  grassTile().toTexture(scene, 'tile-grass');
  counterTile().toTexture(scene, 'tile-counter');
  shelfTile().toTexture(scene, 'tile-shelf');
}
