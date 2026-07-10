import { FLOOR, type LevelData } from './types';

/**
 * FASE 3 — A SALA
 * Verticalidade (estante, sofá, cortinas), entra o cachorro, caixotes
 * empurráveis da Macchia como plataforma e um pássaro atrevido na mureta.
 */
export const level3: LevelData = {
  id: 3,
  name: 'A Sala',
  widthTiles: 80,
  bgTop: 0xc08858,
  bgBottom: 0xecd4b4,
  platforms: [
    { x: 0, y: FLOOR, w: 80, h: 2, tex: 'wood' },
    // Estante da esquerda (escadinha de tábuas)
    { x: 18, y: 18.25, w: 3, h: 0.5, tex: 'shelf' },
    { x: 20.5, y: 16, w: 3, h: 0.5, tex: 'shelf' },
    { x: 18, y: 13.75, w: 3, h: 0.5, tex: 'shelf' },
    // Mureta da sala: alta demais para Mia e Zorro (empurre o caixote!)
    { x: 44, y: 17.25, w: 1.5, h: 3.25, tex: 'wall' },
    // Estante da direita
    { x: 58, y: 18.25, w: 3, h: 0.5, tex: 'shelf' },
    { x: 61.5, y: 16, w: 3, h: 0.5, tex: 'shelf' },
    { x: 58, y: 13.75, w: 3, h: 0.5, tex: 'shelf' }
  ],
  furniture: [
    { tex: 'f-sofa', x: 10, y: 19 }
  ],
  decor: [
    { tex: 'window', x: 26, y: 7 },
    { tex: 'curtain', x: 25, y: 6.8 },
    { tex: 'curtain', x: 29.2, y: 6.8, flip: true },
    { tex: 'painting', x: 36, y: 8.5 },
    { tex: 'lamp', x: 33, y: 18.75 },
    { tex: 'plant', x: 41, y: 18.25 },
    { tex: 'window', x: 66, y: 7 },
    { tex: 'curtain', x: 65, y: 6.8 },
    { tex: 'painting', x: 52, y: 9 },
    { tex: 'plant', x: 74, y: 18.25 }
  ],
  visionBlockers: [],
  spawns: {
    mia: { x: 3, y: 19.4 },
    zorro: { x: 5, y: 19.4 },
    macchia: { x: 7, y: 19.4 }
  },
  exit: { x: 75, y: 16.5, w: 3.5, h: 4 },
  checkpoints: [
    { x: 12, y: 18.8 },  // almofada em cima do sofá, claro
    { x: 46.8, y: 20.2 },
    { x: 72, y: 20.2 }
  ],
  humans: [],
  dogs: [
    { x: 20, minX: 16, maxX: 40 },
    { x: 52, minX: 48, maxX: 70, speed: 150 }
  ],
  critters: [
    // Pássaro folgado na beirada da mureta (lado de quem chega)
    { x: 44.4, y: 17, kind: 'bird' }
  ],
  breakables: [],
  crates: [
    { x: 34, y: 19.5, targetX: 43.4 },
    { x: 37, y: 19.5 }
  ],
  doors: [],
  plates: [],
  guidePath: [
    { x: 6, y: 20.1 }, { x: 10, y: 19 }, { x: 12, y: 17.9 }, { x: 15, y: 20.1 },
    { x: 19, y: 20.1 }, { x: 24, y: 20.1 }, { x: 28, y: 20.1 }, { x: 32, y: 20.1 },
    { x: 36, y: 20.1 }, { x: 40, y: 20.1 }, { x: 43.4, y: 18.6 }, { x: 44.7, y: 16.6 },
    { x: 47, y: 20.1 }, { x: 52, y: 20.1 }, { x: 58, y: 20.1 }, { x: 64, y: 20.1 },
    { x: 70, y: 20.1 }, { x: 76, y: 19.6 }
  ],
  signs: [
    { x: 7, y: 15.5, text: 'AU AU! O cachorro persegue o\ngato ATIVO. Use o CHARME da\nMACCHIA — ou suba no sofá!' },
    { x: 20, y: 11.8, text: 'Estantes são ótimas\npara gatos explorarem!' },
    { x: 33, y: 15, text: 'MACCHIA empurra CAIXOTES!\nLeve um até a mureta\npara fazer escadinha.' },
    { x: 41, y: 12.8, text: 'Um passarinho bloqueia a mureta!\nZORRO (2): aperte X\n— CAÇADOR!' },
    { x: 55, y: 14.8, text: 'Mais um cachorro... valente!\nCharme nele ou corra\ncom o ZORRO!' }
  ]
};
