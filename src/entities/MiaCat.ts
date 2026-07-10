import Phaser from 'phaser';
import { Cat } from './Cat';
import { sound } from '../audio/SoundEngine';
import { burst, floatBubble } from '../systems/Effects';
import { DEPTH } from '../consts';
import type { GameCtx } from '../systems/GameCtx';

/** Mia: british shorthair cinza, sábia. Lenta e precisa. */
export class MiaCat extends Cat {
  constructor(gctx: GameCtx, x: number, y: number) {
    super(gctx, x, y, 'mia');
    this.speed = 140;
    this.jumpVel = 420;
    this.cooldownX = 450;
    this.cooldownC = 6000;
    // Valores em pixels da textura 2x (a escala 0.5 os traz ao mundo)
    this.body.setSize(40, 36);
    this.body.setOffset(12, 8);
  }

  /** PATA DE FERRO: quebra objetos rachados na frente dela. */
  useX(_time: number): void {
    const dir = this.flipX ? -1 : 1;
    const px = this.x + dir * 24;
    let hit = false;
    for (const b of this.gctx.breakables) {
      if (b.broken) continue;
      // Alcance generoso: jogo infantil, patada perto do alvo conta
      const dist = Math.abs(b.x - px) + Math.abs(b.y - this.y) * 0.5;
      if (Math.abs(b.x - this.x) < 68 && dist < 88) {
        hit = b.tryBreak(this.gctx) || hit;
        if (hit) break;
      }
    }
    if (!hit) {
      // Patada no ar: feedback mesmo sem alvo
      sound.thud();
      burst(this.gctx, 'p-dust', px, this.y, { count: 4, speed: 50 });
    }
  }

  /** SABEDORIA: pegadas douradas revelam o caminho por 4s. */
  useC(_time: number): void {
    sound.wisdom();
    floatBubble(this.gctx, this.x, this.y - 28, 'Por aqui!');
    const path = this.gctx.guidePathPx;
    path.forEach((pt, i) => {
      this.gctx.time.delayedCall(i * 90, () => {
        const paw = this.gctx.add.image(pt.x, pt.y, 'p-paw')
          .setDepth(DEPTH.PARTICLE)
          .setAlpha(0)
          .setScale(0.5)
          .setFlipX(i % 2 === 0);
        this.gctx.tweens.add({ targets: paw, alpha: 1, duration: 200 });
        this.gctx.tweens.add({
          targets: paw,
          alpha: 0,
          y: pt.y - 4,
          delay: 3600,
          duration: 500,
          onComplete: () => paw.destroy()
        });
        if (i % 3 === 0) burst(this.gctx, 'p-sparkle', pt.x, pt.y - 6, { count: 2, speed: 25 });
      });
    });
    // Destaca objetos interativos
    const targets: Phaser.GameObjects.Image[] = [
      ...this.gctx.breakables.filter((b) => !b.broken),
      ...this.gctx.doors.filter((d) => !d.opened),
      ...this.gctx.plates,
      ...this.gctx.crates
    ];
    for (const t of targets) {
      t.setTint(0xffe08a);
      burst(this.gctx, 'p-sparkle', t.x, t.y - 10, { count: 3, speed: 30 });
      this.gctx.time.delayedCall(4000, () => {
        if (t.active) t.clearTint();
      });
    }
  }
}
