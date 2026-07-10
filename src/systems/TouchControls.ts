import Phaser from 'phaser';
import { FONT, GAME_H, GAME_W } from '../consts';

/**
 * Controles de toque para tablets/celulares: ◀ ▶ segurados para andar,
 * PULAR / X / C como toques. Só aparecem em dispositivos com touch.
 * O estado é lido pelo Controls.ts junto com o teclado.
 */

interface TouchState {
  left: boolean;
  right: boolean;
  jumpQueued: boolean;
  xQueued: boolean;
  cQueued: boolean;
}

export const touchState: TouchState = {
  left: false,
  right: false,
  jumpQueued: false,
  xQueued: false,
  cQueued: false
};

export function resetTouchState(): void {
  touchState.left = false;
  touchState.right = false;
  touchState.jumpQueued = false;
  touchState.xQueued = false;
  touchState.cQueued = false;
}

/** Consome a fila (um toque = uma ação, como JustDown). */
export function touchJustJump(): boolean {
  if (touchState.jumpQueued) {
    touchState.jumpQueued = false;
    return true;
  }
  return false;
}

export function touchJustX(): boolean {
  if (touchState.xQueued) {
    touchState.xQueued = false;
    return true;
  }
  return false;
}

export function touchJustC(): boolean {
  if (touchState.cQueued) {
    touchState.cQueued = false;
    return true;
  }
  return false;
}

export function isTouchDevice(scene: Phaser.Scene): boolean {
  return scene.sys.game.device.input.touch;
}

/**
 * Converte dicas escritas para teclado em dicas para os botões de toque.
 * (As placas das fases são autoradas pensando no teclado.)
 */
export function adaptTextForTouch(text: string): string {
  const swaps: [string, string][] = [
    ['Ande com SETAS ou WASD', 'Ande com os botões ◀ e ▶'],
    ['SETAS ou WASD', 'os botões ◀ ▶'],
    ['Pule com ESPAÇO', 'Pule com o botão PULAR'],
    ['ESPAÇO 2x no ar', 'PULAR 2x no ar'],
    ['ESPAÇO', 'PULAR'],
    ['Troque de gato:\n1, 2, 3 ou TAB', 'Troque de gato tocando\nnos retratos lá no alto!'],
    ['1, 2, 3 ou TAB', 'os retratos no alto'],
    ['aperte X', 'toque no botão X'],
    ['aperte C', 'toque no botão C'],
    ['com X!', 'com o botão X!'],
    ['com X ', 'com o botão X ']
  ];
  let out = text;
  for (const [from, to] of swaps) out = out.split(from).join(to);
  return out;
}

function makeButton(
  scene: Phaser.Scene, x: number, y: number, r: number,
  label: string, fontSize: number, color: number,
  onDown: () => void, onUp?: () => void
): void {
  const g = scene.add.graphics().setDepth(50);
  const draw = (pressed: boolean): void => {
    g.clear();
    g.fillStyle(color, pressed ? 0.85 : 0.4);
    g.lineStyle(3, 0x241a1a, pressed ? 0.9 : 0.5);
    g.fillCircle(x, y, r);
    g.strokeCircle(x, y, r);
  };
  draw(false);
  scene.add.text(x, y, label, {
    fontFamily: FONT, fontSize: `${fontSize}px`, fontStyle: 'bold',
    color: '#241a1a', resolution: 2
  }).setOrigin(0.5).setDepth(51).setAlpha(0.9);
  const zone = scene.add.zone(x, y, r * 2.4, r * 2.4)
    .setInteractive()
    .setDepth(52);
  zone.on('pointerdown', () => {
    draw(true);
    onDown();
  });
  const release = (): void => {
    draw(false);
    onUp?.();
  };
  zone.on('pointerup', release);
  zone.on('pointerout', release);
}

/** Cria os botões na cena de HUD (coordenadas lógicas 1280x720). */
export function createTouchControls(scene: Phaser.Scene): void {
  resetTouchState();
  // Andar (segurar)
  makeButton(scene, 92, GAME_H - 88, 52, '◀', 34, 0xfff8e8,
    () => { touchState.left = true; },
    () => { touchState.left = false; });
  makeButton(scene, 220, GAME_H - 88, 52, '▶', 34, 0xfff8e8,
    () => { touchState.right = true; },
    () => { touchState.right = false; });
  // Ações (toque)
  makeButton(scene, GAME_W - 88, GAME_H - 92, 56, 'PULAR', 15, 0x8fd44a,
    () => { touchState.jumpQueued = true; });
  makeButton(scene, GAME_W - 210, GAME_H - 70, 40, 'X', 26, 0xd9a03a,
    () => { touchState.xQueued = true; });
  makeButton(scene, GAME_W - 178, GAME_H - 176, 40, 'C', 26, 0x6a8ac0,
    () => { touchState.cQueued = true; });
}
