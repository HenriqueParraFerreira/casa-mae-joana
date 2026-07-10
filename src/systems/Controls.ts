import Phaser from 'phaser';
import { touchJustC, touchJustJump, touchJustX, touchState } from './TouchControls';

export interface GameKeys {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  x: Phaser.Input.Keyboard.Key;
  c: Phaser.Input.Keyboard.Key;
  one: Phaser.Input.Keyboard.Key;
  two: Phaser.Input.Keyboard.Key;
  three: Phaser.Input.Keyboard.Key;
  tab: Phaser.Input.Keyboard.Key;
  m: Phaser.Input.Keyboard.Key;
  esc: Phaser.Input.Keyboard.Key;
}

export function createKeys(scene: Phaser.Scene): GameKeys {
  const kb = scene.input.keyboard;
  if (!kb) throw new Error('Teclado indisponível');
  const K = Phaser.Input.Keyboard.KeyCodes;
  const keys = {
    left: kb.addKey(K.LEFT),
    right: kb.addKey(K.RIGHT),
    up: kb.addKey(K.UP),
    down: kb.addKey(K.DOWN),
    a: kb.addKey(K.A),
    d: kb.addKey(K.D),
    w: kb.addKey(K.W),
    s: kb.addKey(K.S),
    space: kb.addKey(K.SPACE),
    x: kb.addKey(K.X),
    c: kb.addKey(K.C),
    one: kb.addKey(K.ONE),
    two: kb.addKey(K.TWO),
    three: kb.addKey(K.THREE),
    tab: kb.addKey(K.TAB),
    m: kb.addKey(K.M),
    esc: kb.addKey(K.ESC)
  };
  // TAB não deve tirar o foco do jogo
  kb.addCapture([K.TAB, K.SPACE, K.UP, K.DOWN, K.LEFT, K.RIGHT]);
  return keys;
}

export function holdLeft(k: GameKeys): boolean {
  return k.left.isDown || k.a.isDown || touchState.left;
}

export function holdRight(k: GameKeys): boolean {
  return k.right.isDown || k.d.isDown || touchState.right;
}

export function justJump(k: GameKeys): boolean {
  return Phaser.Input.Keyboard.JustDown(k.space) ||
    Phaser.Input.Keyboard.JustDown(k.up) ||
    Phaser.Input.Keyboard.JustDown(k.w) ||
    touchJustJump();
}

export function justX(k: GameKeys): boolean {
  return Phaser.Input.Keyboard.JustDown(k.x) || touchJustX();
}

export function justC(k: GameKeys): boolean {
  return Phaser.Input.Keyboard.JustDown(k.c) || touchJustC();
}
