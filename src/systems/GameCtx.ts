import type Phaser from 'phaser';
import type { Cat } from '../entities/Cat';
import type { Human } from '../entities/Human';
import type { Dog } from '../entities/Dog';
import type { Critter } from '../entities/Critter';
import type { Breakable, Crate, Door, Plate } from '../entities/Objects';

/**
 * O que as entidades enxergam da GameScene. Interface separada para evitar
 * ciclo de imports em runtime (só `import type` aqui).
 */
export interface GameCtx extends Phaser.Scene {
  cats: Cat[];
  humans: Human[];
  dogs: Dog[];
  critters: Critter[];
  breakables: Breakable[];
  doors: Door[];
  plates: Plate[];
  crates: Crate[];
  /** Retângulos que bloqueiam a visão dos humanos (paredes, móveis, esconderijos). */
  visionRects: Phaser.Geom.Rectangle[];
  /** Rota da Sabedoria da Mia, em pixels. */
  guidePathPx: { x: number; y: number }[];
  /** Ponto de respawn atual (último checkpoint). */
  respawnPoint(): { x: number; y: number };
  activeCat(): Cat;
}
