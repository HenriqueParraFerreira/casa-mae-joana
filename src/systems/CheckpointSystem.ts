import Phaser from 'phaser';
import { ART_SCALE, DEPTH, EV } from '../consts';
import { bus } from '../events';
import { sound } from '../audio/SoundEngine';
import { burst, floatBubble } from './Effects';
import type { Cat } from '../entities/Cat';

interface Cushion {
  img: Phaser.GameObjects.Image;
  x: number;
  y: number;
}

/**
 * Checkpoints são almofadas de gato. Ao encostar, os três gatos ficam
 * "salvos" ali — é para onde os humanos os carregam de volta.
 */
export class CheckpointSystem {
  private scene: Phaser.Scene;
  private cushions: Cushion[] = [];
  private currentIdx = -1;
  private defaultSpawn: { x: number; y: number };

  constructor(scene: Phaser.Scene, points: { x: number; y: number }[], defaultSpawn: { x: number; y: number }) {
    this.scene = scene;
    this.defaultSpawn = defaultSpawn;
    for (const pt of points) {
      const img = scene.add.image(pt.x, pt.y, 'cushion')
        .setScale(ART_SCALE)
        .setDepth(DEPTH.OBJECT);
      this.cushions.push({ img, x: pt.x, y: pt.y });
    }
  }

  update(cats: Cat[]): void {
    for (let i = 0; i < this.cushions.length; i++) {
      if (i === this.currentIdx) continue;
      const cu = this.cushions[i];
      for (const cat of cats) {
        if (cat.carriedBy) continue;
        if (Phaser.Math.Distance.Between(cat.x, cat.y, cu.x, cu.y - 8) < 34) {
          this.activate(i);
          break;
        }
      }
    }
  }

  private activate(idx: number): void {
    if (this.currentIdx >= 0) this.cushions[this.currentIdx].img.setTexture('cushion');
    this.currentIdx = idx;
    const cu = this.cushions[idx];
    cu.img.setTexture('cushion-on');
    sound.checkpoint();
    burst(this.scene, 'p-sparkle', cu.x, cu.y - 10, { count: 14, speed: 90, lifespan: 700 });
    floatBubble(this.scene, cu.x, cu.y - 28, 'Checkpoint!');
    this.scene.tweens.add({
      targets: cu.img,
      scaleX: ART_SCALE * 1.25,
      scaleY: ART_SCALE * 1.25,
      duration: 140,
      yoyo: true
    });
    bus.emit(EV.CHECKPOINT);
  }

  respawnPoint(): { x: number; y: number } {
    if (this.currentIdx >= 0) {
      const cu = this.cushions[this.currentIdx];
      return { x: cu.x, y: cu.y - 6 };
    }
    return this.defaultSpawn;
  }
}
