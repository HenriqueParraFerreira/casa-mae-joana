import Phaser from 'phaser';
import { ART_SCALE, DEPTH } from '../consts';
import { sound } from '../audio/SoundEngine';
import { burst, floatBubble } from '../systems/Effects';
import type { GameCtx } from '../systems/GameCtx';
import type { DogDef } from '../levels/types';
import type { Cat } from './Cat';

type DState = 'patrol' | 'chase' | 'pet';

/**
 * Cachorro: patrulha rápida; persegue o gato ativo mais próximo. Se
 * alcança, dá um susto que manda o gato de volta ao checkpoint. É
 * distraível pelo Charme da Macchia.
 */
export class Dog extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private gctx: GameCtx;
  private minX: number;
  private maxX: number;
  private speed: number;
  private dstate: DState = 'patrol';
  private dir = 1;
  private stateUntil = 0;
  private nextBark = 0;

  constructor(gctx: GameCtx, def: DogDef, x: number, y: number) {
    super(gctx, x, y, 'dog-run-0');
    this.gctx = gctx;
    this.minX = def.minX;
    this.maxX = def.maxX;
    this.speed = def.speed ?? 130;
    gctx.add.existing(this);
    gctx.physics.add.existing(this);
    this.setScale(ART_SCALE);
    // Valores em pixels da textura 2x (escala 0.5 -> mundo)
    this.body.setSize(60, 40);
    this.body.setOffset(10, 8);
    this.setDepth(DEPTH.ENEMY);
    this.play('dog-run');
  }

  charm(ms: number, cat: Cat): void {
    this.dstate = 'pet';
    this.stateUntil = this.gctx.time.now + ms;
    this.setVelocityX(0);
    this.setFlipX(cat.x < this.x);
    this.anims.stop();
    floatBubble(this.gctx, this.x, this.y - 26, '♥ au!');
    burst(this.gctx, 'p-heart', this.x, this.y - 18, { count: 5, speed: 40, gravity: -50 });
  }

  update(time: number): void {
    if (this.dstate === 'pet') {
      this.setVelocityX(0);
      if (time >= this.stateUntil) {
        this.dstate = 'patrol';
        this.play('dog-run');
      }
      return;
    }

    const cat = this.gctx.activeCat();
    const canChase = !cat.carriedBy && !cat.atExit && time >= cat.immuneUntil;
    const dx = cat.x - this.x;
    const dy = Math.abs(cat.y - this.y);

    if (this.dstate === 'patrol') {
      this.setVelocityX(this.dir * this.speed);
      this.setFlipX(this.dir < 0);
      if (this.dir > 0 && this.x >= this.maxX) this.dir = -1;
      else if (this.dir < 0 && this.x <= this.minX) this.dir = 1;
      if (canChase && Math.abs(dx) < 190 && dy < 52) {
        this.dstate = 'chase';
        sound.bark();
        floatBubble(this.gctx, this.x, this.y - 26, 'AU AU!');
      }
    } else {
      // chase
      if (!canChase || Math.abs(dx) > 330 || dy > 90) {
        this.dstate = 'patrol';
        return;
      }
      this.dir = dx >= 0 ? 1 : -1;
      this.setVelocityX(this.dir * this.speed * 1.6);
      this.setFlipX(this.dir < 0);
      if (time > this.nextBark) {
        this.nextBark = time + 900;
        sound.bark();
      }
      if (Math.abs(dx) < 24 && dy < 30) {
        // Susto! Gato volta pro checkpoint
        floatBubble(this.gctx, cat.x, cat.y - 26, '!');
        cat.sendToCheckpoint();
        this.dstate = 'patrol';
        this.dir *= -1;
        // Pulinho feliz de dever cumprido
        if (this.body.onFloor()) this.setVelocityY(-200);
      }
    }
  }
}
