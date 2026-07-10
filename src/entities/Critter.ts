import Phaser from 'phaser';
import { ART_SCALE, DEPTH } from '../consts';
import { sound } from '../audio/SoundEngine';
import { burst, floatBubble } from '../systems/Effects';

/**
 * Base de rato e pássaro: bloqueiam passagens estreitas (corpo imóvel) e
 * só saem espantados pelo Caçador do Zorro.
 */
export class Critter extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  readonly critterKind: 'rat' | 'bird';
  alive = true;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: 'rat' | 'bird') {
    super(scene, x, y, `${kind}-0`);
    this.critterKind = kind;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(ART_SCALE);
    this.body.setImmovable(true);
    this.body.setAllowGravity(false);
    this.setDepth(DEPTH.ENEMY);
    this.play(`${kind}-idle`);
  }

  /** Espantado pelo Zorro: foge com fumacinha cômica. */
  flee(dirX: number): void {
    if (!this.alive) return;
    this.alive = false;
    this.body.enable = false;
    burst(this.scene, 'p-smoke', this.x, this.y, { count: 8, speed: 70 });
    if (this.critterKind === 'rat') {
      sound.squeak();
      floatBubble(this.scene, this.x, this.y - 18, '!!');
      this.scene.tweens.add({
        targets: this,
        x: this.x + 220 * (dirX >= 0 ? 1 : -1),
        alpha: 0,
        duration: 500,
        ease: 'Sine.easeIn',
        onComplete: () => this.destroy()
      });
    } else {
      sound.chirp();
      floatBubble(this.scene, this.x, this.y - 18, 'Piu!');
      this.scene.tweens.add({
        targets: this,
        y: this.y - 180,
        x: this.x + 60 * (dirX >= 0 ? 1 : -1),
        alpha: 0,
        duration: 600,
        ease: 'Sine.easeOut',
        onComplete: () => this.destroy()
      });
    }
  }
}
