import Phaser from 'phaser';
import { EV } from '../consts';
import { bus } from '../events';
import { sound } from '../audio/SoundEngine';
import { floatBubble } from './Effects';
import { gameplayZoom } from './TouchControls';
import type { GameKeys } from './Controls';
import type { Cat } from '../entities/Cat';

/**
 * Gerencia qual gato está ativo (1/2/3/TAB), com pan suave de câmera e
 * levíssimo zoom no gato ativo.
 */
export class CatSwitcher {
  private scene: Phaser.Scene;
  readonly cats: Cat[];
  activeIdx = 0;

  constructor(scene: Phaser.Scene, cats: Cat[]) {
    this.scene = scene;
    this.cats = cats;
    cats[0].isActiveCat = true;
    const cam = scene.cameras.main;
    cam.startFollow(cats[0], true, 0.12, 0.12);
    bus.emit(EV.CAT_SWITCHED, cats[0].kind);
  }

  get active(): Cat {
    return this.cats[this.activeIdx];
  }

  update(keys: GameKeys): void {
    if (Phaser.Input.Keyboard.JustDown(keys.one)) this.switchTo(0);
    else if (Phaser.Input.Keyboard.JustDown(keys.two)) this.switchTo(1);
    else if (Phaser.Input.Keyboard.JustDown(keys.three)) this.switchTo(2);
    else if (Phaser.Input.Keyboard.JustDown(keys.tab)) this.switchNext();
  }

  switchNext(): void {
    for (let step = 1; step <= 2; step++) {
      const idx = (this.activeIdx + step) % 3;
      if (!this.cats[idx].atExit) {
        this.switchTo(idx);
        return;
      }
    }
  }

  switchTo(idx: number): void {
    if (idx === this.activeIdx || idx < 0 || idx > 2) return;
    const cat = this.cats[idx];
    if (cat.atExit) {
      floatBubble(this.scene, cat.x, cat.y - 26, 'Já cheguei!');
      return;
    }
    this.active.isActiveCat = false;
    this.active.moveDir = 0;
    this.activeIdx = idx;
    cat.isActiveCat = true;
    sound.switchCat();
    cat.meow();
    bus.emit(EV.CAT_SWITCHED, cat.kind);

    // Câmera desliza suave até o novo gato + pulso de zoom
    const cam = this.scene.cameras.main;
    cam.stopFollow();
    cam.pan(cat.x, cat.y, 380, 'Sine.easeInOut', false, (_c, progress) => {
      if (progress === 1) cam.startFollow(cat, true, 0.12, 0.12);
    });
    const z = gameplayZoom(this.scene);
    this.scene.tweens.add({
      targets: cam,
      zoom: z * 1.05,
      duration: 200,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => cam.setZoom(z)
    });
  }

  /** Se o gato ativo chegou na saída, passa para o próximo que falta. */
  onCatReachedExit(cat: Cat): void {
    if (cat === this.active) this.switchNext();
  }
}
