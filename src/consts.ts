export const TILE = 32;
export const GAME_W = 1280;
export const GAME_H = 720;
export const GRAVITY = 1000;
/**
 * Alta resolução: o canvas tem o dobro do tamanho lógico (2560x1440) e
 * todas as câmeras usam zoom 2 — o mundo continua medido em 1280x720.
 * As texturas são desenhadas com o dobro de pixels e exibidas com
 * ART_SCALE, então cada pixel de arte = meio pixel de mundo.
 */
export const BASE_ZOOM = 2;
export const ART_SCALE = 0.5;
/** Zoom extra da câmera durante a gameplay (1 = enquadramento original). */
export const GAMEPLAY_ZOOM = 1.3;
/** Zoom total da câmera do jogo. */
export const GAME_ZOOM = BASE_ZOOM * GAMEPLAY_ZOOM;

export type CatKind = 'mia' | 'zorro' | 'macchia';
export const CAT_KINDS: CatKind[] = ['mia', 'zorro', 'macchia'];

export const CAT_NAMES: Record<CatKind, string> = {
  mia: 'Mia',
  zorro: 'Zorro',
  macchia: 'Macchia'
};

export const DEPTH = {
  BG: -10,
  DECOR: 0,
  PLATFORM: 2,
  DOOR: 3,
  OBJECT: 4,
  CONE: 5,
  ENEMY: 6,
  CAT: 7,
  PARTICLE: 8,
  BUBBLE: 9,
  OVERLAY: 100
};

/** Eventos do barramento global (bus). */
export const EV = {
  CAT_SWITCHED: 'cat-switched',
  MUTE_CHANGED: 'mute-changed',
  CHECKPOINT: 'checkpoint',
  CAT_CAUGHT: 'cat-caught',
  CAT_AT_EXIT: 'cat-at-exit',
  LEVEL_COMPLETE: 'level-complete',
  REQUEST_SWITCH: 'request-switch'
};

export const FONT = 'Courier New, monospace';

export const TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: FONT,
  fontStyle: 'bold',
  color: '#3a2c22'
};
