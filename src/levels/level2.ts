import { FLOOR, type LevelData } from './types';

/**
 * FASE 2 — O CORREDOR DAS PORTAS
 * Dois humanos patrulhando com cone de visão, esconderijos (plantas),
 * primeiro Charme e a porta trancada com combinação (puxador + tranca).
 */
export const level2: LevelData = {
  id: 2,
  name: 'O Corredor das Portas',
  widthTiles: 80,
  bgTop: 0xb08a68,
  bgBottom: 0xe0c8a8,
  platforms: [
    { x: 0, y: FLOOR, w: 80, h: 2, tex: 'wood' },
    // Batente da porta trancada — para no alto, deixando o vão onde a
    // Macchia pisa no puxador
    { x: 68, y: 0, w: 1, h: 13, tex: 'wall' },
    // Prateleira contínua até o puxador: 4 tiles acima do chão — só o
    // PULO DUPLO da Macchia alcança (é de mão única: pula por baixo e
    // aterrissa em cima), e o chão fica livre para a Mia ir à tranca
    { x: 63.5, y: 16.5, w: 6.5, h: 0.5, tex: 'shelf' }
  ],
  furniture: [],
  decor: [
    { tex: 'door-deco', x: 10, y: 17 },
    { tex: 'door-deco', x: 24, y: 17 },
    { tex: 'door-deco', x: 44, y: 17 },
    { tex: 'door-deco', x: 58, y: 17 },
    { tex: 'window', x: 14, y: 7.5 },
    { tex: 'window', x: 40, y: 7.5 },
    { tex: 'painting', x: 30, y: 9 },
    { tex: 'painting', x: 52, y: 9 },
    { tex: 'lamp', x: 18.5, y: 18.75 },
    { tex: 'plant', x: 22, y: 18.25 },
    { tex: 'plant', x: 30, y: 18.25 },
    { tex: 'plant', x: 46, y: 18.25 },
    { tex: 'plant', x: 56, y: 18.25 }
  ],
  visionBlockers: [
    { x: 21.9, y: 18.25, w: 1.3, h: 2.25 },
    { x: 29.9, y: 18.25, w: 1.3, h: 2.25 },
    { x: 45.9, y: 18.25, w: 1.3, h: 2.25 },
    { x: 55.9, y: 18.25, w: 1.3, h: 2.25 }
  ],
  spawns: {
    mia: { x: 3, y: 19.4 },
    zorro: { x: 5, y: 19.4 },
    macchia: { x: 7, y: 19.4 }
  },
  exit: { x: 74, y: 16.5, w: 3.5, h: 4 },
  checkpoints: [
    { x: 13, y: 20.2 },
    { x: 38, y: 20.2 },
    { x: 62, y: 20.2 }
  ],
  humans: [
    // As irmãs brincando pelo corredor: Elis (7) e Elena (10)
    { x: 20, minX: 14, maxX: 30, variant: 'elis', speed: 65 },
    // A patrulha da Elena termina antes do cantinho da porta trancada,
    // para dar um respiro na hora do puzzle
    { x: 48, minX: 40, maxX: 56, variant: 'elena', speed: 70 }
  ],
  dogs: [],
  critters: [],
  breakables: [
    { tex: 'lock', x: 67.6, y: 19.9, comboDoorId: 'combo' }
  ],
  crates: [],
  doors: [
    { id: 'combo', x: 68.5, y: 17, h: 3.5 }
  ],
  plates: [
    // Puxador em cima do batente: só vale ENQUANTO pisado (combinação!)
    { x: 68.5, y: 16.2, doorId: 'combo', momentary: true }
  ],
  guidePath: [
    { x: 6, y: 20.1 }, { x: 10, y: 20.1 }, { x: 14, y: 20.1 }, { x: 18, y: 20.1 },
    { x: 22, y: 19.5 }, { x: 26, y: 20.1 }, { x: 30, y: 19.5 }, { x: 34, y: 20.1 },
    { x: 38, y: 20.1 }, { x: 42, y: 20.1 }, { x: 46, y: 19.5 }, { x: 50, y: 20.1 },
    { x: 56, y: 19.5 }, { x: 61, y: 20.1 }, { x: 64.5, y: 16.4 }, { x: 68.5, y: 15.8 },
    { x: 71, y: 20.1 }, { x: 75, y: 19.6 }
  ],
  signs: [
    { x: 6, y: 15.8, text: 'Cuidado! As irmãs ELIS e ELENA\nadoram gatos... demais! Se te\nVIREM, te levam pro checkpoint!' },
    { x: 13, y: 13.2, text: 'Esconda-se atrás das plantas\npara escapar do cone amarelo.' },
    { x: 37, y: 14.5, text: 'MACCHIA (3): aperte C perto\ndeles — CHARME! Todo mundo\npara 5s pro carinho.' },
    { x: 60, y: 12.5, text: 'PORTA TRANCADA: MACCHIA (3) sobe\nna prateleira com o PULO DUPLO e pisa\nno puxador ENQUANTO MIA (1) quebra\na tranca embaixo com X!' }
  ]
};
