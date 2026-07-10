import { FLOOR, type LevelData } from './types';

/**
 * FASE 1 — O QUARTO (tutorial)
 * Ensina: mover/pular, trocar de gato, Pata de Ferro (vaso), Pulo Duplo +
 * caixote (cômoda alta), Deslize (fresta sob a porta) e checkpoint.
 */
export const level1: LevelData = {
  id: 1,
  name: 'O Quarto',
  widthTiles: 60,
  bgTop: 0x9a86ac,
  bgBottom: 0xd8c4b0,
  platforms: [
    { x: 0, y: FLOOR, w: 60, h: 2, tex: 'wood' },
    // Batente com o vaso rachado embaixo (única passagem)
    { x: 13.5, y: 0, w: 1.5, h: 17.5, tex: 'wall' },
    // Parede da porta com fresta de 14px embaixo (o Zorro desliza)
    { x: 38, y: 0, w: 1, h: 17, tex: 'wall' }
  ],
  furniture: [
    { tex: 'f-dresser', x: 23, y: 17.25 },
    { tex: 'f-bed', x: 30, y: 18.75 }
  ],
  decor: [
    { tex: 'window', x: 4, y: 7 },
    { tex: 'painting', x: 17.5, y: 9 },
    { tex: 'lamp', x: 11, y: 18.75 },
    { tex: 'plant', x: 44, y: 18.25 },
    { tex: 'painting', x: 48, y: 8.5 },
    { tex: 'window', x: 50, y: 7 }
  ],
  visionBlockers: [],
  spawns: {
    mia: { x: 3, y: 19.4 },
    zorro: { x: 5, y: 19.4 },
    macchia: { x: 7, y: 19.4 }
  },
  exit: { x: 55, y: 16.5, w: 3.5, h: 4 },
  checkpoints: [
    { x: 19, y: 20.2 },
    { x: 28.5, y: 20.2 }
  ],
  humans: [],
  dogs: [],
  critters: [],
  breakables: [
    { tex: 'vase', x: 14.25, y: 19.1 }
  ],
  crates: [
    { x: 24.5, y: 16.6 }
  ],
  doors: [
    // Porta com folga embaixo: fresta para o deslize do Zorro
    { id: 'porta1', x: 38.5, y: 17, h: 3.06 }
  ],
  plates: [
    { x: 40.8, y: 20.3, doorId: 'porta1' }
  ],
  guidePath: [
    { x: 6, y: 20.1 }, { x: 10, y: 20.1 }, { x: 14.2, y: 19.4 }, { x: 18, y: 20.1 },
    { x: 22.3, y: 19.6 }, { x: 24.5, y: 16.8 }, { x: 27.5, y: 19.2 }, { x: 31, y: 18 },
    { x: 34, y: 18 }, { x: 37, y: 20.1 }, { x: 40.5, y: 20.1 }, { x: 44, y: 20.1 },
    { x: 48, y: 20.1 }, { x: 52, y: 20.1 }, { x: 56, y: 19.6 }
  ],
  signs: [
    { x: 4, y: 16.9, text: 'Ande com SETAS ou WASD\nPule com ESPAÇO!' },
    { x: 9.5, y: 15.2, text: 'Troque de gato:\n1, 2, 3 ou TAB' },
    { x: 12, y: 12.8, text: 'MIA (1): aperte X perto do\nvaso rachado — PATA DE FERRO!' },
    { x: 20.5, y: 13.8, text: 'MACCHIA (3): ESPAÇO 2x no ar\n— PULO DUPLO! Lá em cima,\nempurre o caixote!' },
    { x: 28.5, y: 16.6, text: 'Almofada = CHECKPOINT!' },
    { x: 34.5, y: 13.5, text: 'ZORRO (2): correndo, aperte C\n— DESLIZE pela fresta\nembaixo da porta!' },
    { x: 42.5, y: 16.2, text: 'Pise no botão para\nabrir a porta!' },
    { x: 50, y: 14.5, text: 'MIA (1): aperte C — SABEDORIA!\nPegadas douradas mostram o caminho.\nLevem os TRÊS até a saída!' }
  ]
};
