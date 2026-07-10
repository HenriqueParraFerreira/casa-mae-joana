import Phaser from 'phaser';
import { GAME_H, GAME_W, GRAVITY } from './consts';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';
import { PauseScene } from './scenes/PauseScene';
import { VictoryScene } from './scenes/VictoryScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  // Canvas em alta resolução; o mundo lógico continua 1280x720 (zoom 2)
  width: GAME_W * 2,
  height: GAME_H * 2,
  backgroundColor: '#14100f',
  pixelArt: true,
  roundPixels: true,
  input: { activePointers: 4 },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, MenuScene, GameScene, UIScene, PauseScene, VictoryScene]
});

// Acesso para depuração/testes automatizados
declare global {
  interface Window { __game?: Phaser.Game }
}
window.__game = game;

// iOS/Android: pede paisagem (o jogo é horizontal) e refaz o layout ao girar
const rotateOverlay = document.getElementById('rotate-overlay');
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

function updateOrientation(): void {
  if (rotateOverlay) {
    const portrait = window.innerHeight > window.innerWidth;
    rotateOverlay.style.display = portrait && isTouch ? 'flex' : 'none';
  }
  // A barra de endereço do iOS muda a altura útil: refaz o encaixe
  setTimeout(() => game.scale.refresh(), 150);
}

window.addEventListener('resize', updateOrientation);
window.addEventListener('orientationchange', updateOrientation);
updateOrientation();
