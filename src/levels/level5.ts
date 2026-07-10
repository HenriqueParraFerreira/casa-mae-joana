import { FLOOR, type LevelData } from './types';

/**
 * FASE 5 — O QUINTAL DA FRENTE
 * Fase curta de celebração: sol, flores, últimos pulinhos fáceis e a
 * toalha da soneca da vitória.
 */
export const level5: LevelData = {
  id: 5,
  name: 'O Quintal da Frente',
  widthTiles: 45,
  bgTop: 0x8ecae6,
  bgBottom: 0xffe8b0,
  platforms: [
    { x: 0, y: FLOOR, w: 45, h: 2, tex: 'grass' },
    // Canteiros do jardim: pulinhos fáceis
    { x: 12, y: 19, w: 2, h: 1.5, tex: 'wood-dark' },
    { x: 17, y: 18, w: 2.5, h: 2.5, tex: 'wood-dark' },
    { x: 23, y: 19, w: 2, h: 1.5, tex: 'wood-dark' }
  ],
  furniture: [],
  decor: [
    { tex: 'sun', x: 3, y: 1.5 },
    { tex: 'fence', x: 1, y: 18.5 }, { tex: 'fence', x: 2, y: 18.5 }, { tex: 'fence', x: 3, y: 18.5 },
    { tex: 'fence', x: 5, y: 18.5 }, { tex: 'fence', x: 7, y: 18.5 }, { tex: 'fence', x: 9, y: 18.5 },
    { tex: 'fence', x: 27, y: 18.5 }, { tex: 'fence', x: 29, y: 18.5 }, { tex: 'fence', x: 31, y: 18.5 },
    { tex: 'fence', x: 33, y: 18.5 }, { tex: 'fence', x: 42, y: 18.5 }, { tex: 'fence', x: 43, y: 18.5 },
    { tex: 'flower-0', x: 4, y: 19.75 }, { tex: 'flower-1', x: 6, y: 19.75 },
    { tex: 'flower-0', x: 10, y: 19.75 }, { tex: 'flower-1', x: 12.5, y: 18.2 },
    { tex: 'flower-0', x: 15, y: 19.75 }, { tex: 'flower-1', x: 21, y: 19.75 },
    { tex: 'flower-0', x: 26, y: 19.75 }, { tex: 'flower-1', x: 28, y: 19.75 },
    { tex: 'flower-0', x: 31, y: 19.75 }, { tex: 'flower-1', x: 34, y: 19.75 },
    { tex: 'flower-0', x: 41, y: 19.75 }
  ],
  visionBlockers: [],
  spawns: {
    mia: { x: 2.5, y: 19.4 },
    zorro: { x: 4.5, y: 19.4 },
    macchia: { x: 6.5, y: 19.4 }
  },
  exit: { x: 36, y: 16.5, w: 4.5, h: 4 },
  checkpoints: [
    { x: 21, y: 20.2 }
  ],
  humans: [
    // A mamãe JOANA cuidando do jardim — só passeia, não pega ninguém
    { x: 27, minX: 26, maxX: 33, speed: 40, variant: 'joana', friendly: true, mama: true, cookAt: 29.5 }
  ],
  dogs: [],
  critters: [],
  breakables: [],
  crates: [],
  doors: [],
  plates: [],
  guidePath: [
    { x: 6, y: 20.1 }, { x: 10, y: 20.1 }, { x: 13, y: 18.6 }, { x: 18, y: 17.6 },
    { x: 24, y: 18.6 }, { x: 28, y: 20.1 }, { x: 32, y: 20.1 }, { x: 38, y: 19.8 }
  ],
  signs: [
    { x: 6, y: 15.5, text: 'VOCÊS CONSEGUIRAM!\nO quintal é de vocês.\nAproveitem o sol!' },
    { x: 24, y: 14.8, text: 'A mamãe JOANA está cuidando\ndo jardim. Dá um oi!' },
    { x: 31, y: 17, text: 'Deitem os três na toalha\npara a soneca da vitória!' }
  ]
};
