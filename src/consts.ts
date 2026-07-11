/** Versão mostrada no menu — atualizar a cada deploy relevante. */
export const GAME_VERSION = 'v1.6';

export const TILE = 32;

/**
 * Largura lógica adaptável: em celular/tablet o canvas nasce com a
 * proporção exata da tela (sem faixas pretas laterais); no desktop
 * mantém o clássico 1280x720. Calculada uma vez, no carregamento.
 */
function computeGameWidth(): number {
  if (typeof window === 'undefined') return 1280;
  const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0;
  if (!isTouch) return 1280;
  const long = Math.max(window.innerWidth, window.innerHeight);
  const short = Math.max(1, Math.min(window.innerWidth, window.innerHeight));
  const aspect = Math.min(2.34, Math.max(16 / 9, long / short));
  return Math.round((720 * aspect) / 2) * 2;
}

export const GAME_W = computeGameWidth();
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
/** Zoom extra da câmera durante a gameplay no computador. */
export const GAMEPLAY_ZOOM = 1.3;
/** Zoom extra no celular/tablet: tela pequena pede tudo bem maior. */
export const MOBILE_GAMEPLAY_ZOOM = 3.0;

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
