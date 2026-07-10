/**
 * Dados declarativos das fases. Todas as coordenadas em TILES (32px),
 * podendo ser fracionárias. y cresce para baixo; o chão padrão fica em
 * y=20.5 (topo do piso). O LevelBuilder converte para pixels.
 */

export interface Pt {
  x: number;
  y: number;
}

export type PlatformTex = 'wood' | 'wood-dark' | 'wall' | 'carpet' | 'grass' | 'counter' | 'shelf';

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  tex: PlatformTex;
}

/** Móvel sólido (vira corpo estático do tamanho da textura). x,y = canto superior esquerdo em tiles. */
export interface FurnitureDef {
  tex: string;
  x: number;
  y: number;
}

/** Decoração sem colisão. */
export interface DecorDef {
  tex: string;
  x: number;
  y: number;
  flip?: boolean;
}

export interface SignDef {
  x: number;
  y: number;
  text: string;
  w?: number;
}

export interface HumanDef {
  x: number;
  minX: number;
  maxX: number;
  speed?: number;
  /** Quem é: Elis (7), Elena (10), Nona (a avó) ou Joana (a mãe). */
  variant?: 'elis' | 'elena' | 'nona' | 'joana';
  /** Patrulha imprevisível (pausas e reviradas aleatórias). */
  mama?: boolean;
  /** Amigável: só passeia, nunca persegue (a Joana jardinando). */
  friendly?: boolean;
  /** Pausa longa "cozinhando/regando" nesse x (tiles). */
  cookAt?: number;
}

export interface DogDef {
  x: number;
  minX: number;
  maxX: number;
  speed?: number;
}

export interface CritterDef {
  x: number;
  y: number;
  kind: 'rat' | 'bird';
}

export interface BreakableDef {
  tex: 'vase' | 'lock' | 'mech';
  x: number;
  y: number;
  /** Porta aberta ao quebrar. */
  doorId?: string;
  /** Se definido, só quebra enquanto a placa dessa porta estiver pressionada. */
  comboDoorId?: string;
}

export interface CrateDef {
  x: number;
  y: number;
  roller?: boolean;
  /** Rolo trava (vira plataforma fixa) ao chegar nesse x em tiles. */
  targetX?: number;
}

export interface DoorDef {
  id: string;
  x: number;
  y: number;
  /** Altura em tiles do corpo sólido (visual é a textura 'door'). */
  h: number;
}

export interface PlateDef {
  x: number;
  y: number;
  doorId: string;
  /** true = só conta enquanto pressionada (combos); false = trava ligada. */
  momentary?: boolean;
}

/** Retângulo (tiles) que bloqueia a visão dos humanos — esconderijos. */
export interface VisionBlockerDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LevelData {
  id: number;
  name: string;
  widthTiles: number;
  bgTop: number;
  bgBottom: number;
  platforms: PlatformDef[];
  furniture: FurnitureDef[];
  decor: DecorDef[];
  visionBlockers: VisionBlockerDef[];
  spawns: { mia: Pt; zorro: Pt; macchia: Pt };
  exit: { x: number; y: number; w: number; h: number };
  checkpoints: Pt[];
  humans: HumanDef[];
  dogs: DogDef[];
  critters: CritterDef[];
  breakables: BreakableDef[];
  crates: CrateDef[];
  doors: DoorDef[];
  plates: PlateDef[];
  /** Rota da Sabedoria da Mia (pegadas douradas). */
  guidePath: Pt[];
  signs: SignDef[];
}

/** Topo do piso padrão, em tiles. */
export const FLOOR = 20.5;
