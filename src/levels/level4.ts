import { FLOOR, type LevelData } from './types';

/**
 * FASE 4 — A COZINHA (a mais difícil)
 * Mãe Joana cozinhando com patrulha imprevisível, 3 ratos bloqueando
 * passagens, e o puzzle do ROLLERCAT: Macchia empurra o rolo, Zorro
 * cruza e pisa no botão, Mia quebra o mecanismo.
 */
export const level4: LevelData = {
  id: 4,
  name: 'A Cozinha',
  widthTiles: 90,
  bgTop: 0x88a898,
  bgBottom: 0xdce4d4,
  platforms: [
    { x: 0, y: FLOOR, w: 90, h: 2, tex: 'wood' },
    // Bancadas com o vão do rato #1
    { x: 10, y: 18.5, w: 8, h: 2, tex: 'counter' },
    { x: 19.5, y: 18.5, w: 6, h: 2, tex: 'counter' },
    // Armário suspenso que impede pular por cima do vão
    { x: 17, y: 14, w: 4.5, h: 1.5, tex: 'wood-dark' },
    // Tampo da mesa (a toalha embaixo é cenário: dá para se esconder!)
    { x: 33, y: 18.13, w: 4, h: 0.4, tex: 'wood-dark' },
    // Muro do ROLLERCAT
    { x: 50, y: 17.25, w: 1, h: 3.25, tex: 'wall' },
    // Batente da portinhola (hatch)
    { x: 54, y: 0, w: 1, h: 17, tex: 'wall' },
    // Portal do rato #2
    { x: 62, y: 0, w: 2, h: 17.5, tex: 'wall' },
    // Portal do rato #3
    { x: 71, y: 0, w: 2, h: 17.5, tex: 'wall' },
    // Batente da porta dos fundos
    { x: 78, y: 0, w: 1, h: 17, tex: 'wall' }
  ],
  furniture: [],
  decor: [
    // Geladeira, fogão e toalha da mesa são cenário (não bloqueiam);
    // a geladeira e a mesa servem de esconderijo contra a Nona
    { tex: 'f-fridge', x: 6, y: 16.5 },
    { tex: 'f-stove', x: 27, y: 17.5 },
    { tex: 'tablecloth', x: 33, y: 18.13 },
    { tex: 'window', x: 43, y: 7 },
    { tex: 'painting', x: 34, y: 9 },
    { tex: 'plant', x: 57, y: 18.25 },
    { tex: 'window', x: 67, y: 7.5 },
    { tex: 'lamp', x: 76, y: 18.75 },
    { tex: 'plant', x: 83, y: 18.25 }
  ],
  visionBlockers: [
    // Toalha da mesa: esconderijo embaixo da mesa
    { x: 33, y: 18.13, w: 4, h: 2.37 },
    // Atrás da geladeira também dá para se esconder
    { x: 6, y: 16.5, w: 2, h: 4 }
  ],
  spawns: {
    mia: { x: 2.5, y: 19.4 },
    zorro: { x: 4, y: 19.4 },
    macchia: { x: 5.2, y: 19.4 }
  },
  exit: { x: 84, y: 16.5, w: 3.5, h: 4 },
  checkpoints: [
    { x: 8.6, y: 20.2 },
    { x: 39.5, y: 20.2 },
    { x: 67.5, y: 20.2 }
  ],
  humans: [
    // A NONA, avó da Elis e da Elena, comanda a cozinha
    { x: 32, minX: 26, maxX: 49, variant: 'nona', mama: true, cookAt: 28.5 }
  ],
  dogs: [],
  critters: [
    { x: 18.75, y: 20.2, kind: 'rat' },
    { x: 63, y: 20.2, kind: 'rat' },
    { x: 72, y: 20.2, kind: 'rat' }
  ],
  breakables: [
    // Mecanismo BEM NA porta dos fundos: quebrar = abrir (solução à vista)
    { tex: 'mech', x: 76.6, y: 19.4, doorId: 'backdoor' }
  ],
  crates: [
    // O ROLO! Empurre até encaixar no muro
    { x: 44, y: 19.4, roller: true, targetX: 49.4 }
  ],
  doors: [
    { id: 'hatch', x: 54.5, y: 17, h: 3.5 },
    { id: 'backdoor', x: 78.5, y: 17, h: 3.5 }
  ],
  plates: [
    // Botão depois do muro: abre a portinhola (fica ligado)
    { x: 52.3, y: 20.3, doorId: 'hatch' }
  ],
  guidePath: [
    { x: 4, y: 20.1 }, { x: 8, y: 20.1 }, { x: 11, y: 17.9 }, { x: 15, y: 17.9 },
    { x: 18.75, y: 20.1 }, { x: 22, y: 17.9 }, { x: 26, y: 20.1 }, { x: 31, y: 20.1 },
    { x: 35, y: 20.1 }, { x: 39.5, y: 20.1 }, { x: 44, y: 19.2 }, { x: 49.4, y: 18.6 },
    { x: 50.5, y: 16.6 }, { x: 52.3, y: 20.1 }, { x: 54.5, y: 20.1 }, { x: 58, y: 20.1 },
    { x: 60, y: 20.1 }, { x: 63, y: 20.1 }, { x: 67.5, y: 20.1 }, { x: 72, y: 20.1 },
    { x: 76.6, y: 19.5 }, { x: 78.5, y: 20.1 }, { x: 82, y: 20.1 }, { x: 85, y: 19.6 }
  ],
  signs: [
    { x: 6, y: 14.8, text: 'Shhh! A NONA está cozinhando.\nA patrulha da vovó\né IMPREVISÍVEL!' },
    { x: 14, y: 11.8, text: 'Ratos bloqueiam passagens!\nZORRO (2): aperte X\n— CAÇADOR!' },
    { x: 35, y: 14.6, text: 'Esconda-se EMBAIXO\nda mesa!' },
    { x: 44, y: 12.5, text: 'ROLLERCAT! MACCHIA empurra o rolo\naté o muro e ZORRO cruza por cima\npara pisar no botão!' },
    { x: 68, y: 14.5, text: 'Quase lá! Falta pouco\npara a porta dos fundos.' },
    { x: 75.5, y: 15.2, text: 'MIA (1): quebre o MECANISMO\ncom X para abrir a\nporta dos fundos!' }
  ]
};
