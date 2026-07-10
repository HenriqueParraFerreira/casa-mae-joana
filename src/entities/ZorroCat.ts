import Phaser from 'phaser';
import { Cat } from './Cat';
import { sound } from '../audio/SoundEngine';
import { floatBubble } from '../systems/Effects';
import { ART_SCALE, DEPTH } from '../consts';
import type { GameCtx } from '../systems/GameCtx';
import type { Critter } from './Critter';

/** Zorro: frajola preto e branco, pequeno, hiperativo. O mais rápido. */
export class ZorroCat extends Cat {
  private dashUntil = 0;
  private slideUntil = 0;
  private dashTarget: Critter | null = null;
  private trail: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(gctx: GameCtx, x: number, y: number) {
    super(gctx, x, y, 'zorro');
    this.speed = 230;
    this.jumpVel = 440;
    this.cooldownX = 900;
    this.cooldownC = 800;
    this.setNormalBody();
  }

  private setNormalBody(): void {
    // Valores em pixels da textura 2x (escala 0.5 -> mundo)
    this.body.setSize(36, 30);
    this.body.setOffset(10, 8);
  }

  private setSlideBody(): void {
    this.body.setSize(36, 18);
    this.body.setOffset(10, 20);
  }

  /** CAÇADOR: dash curto em direção ao rato/pássaro mais próximo. */
  useX(time: number): void {
    let target: Critter | null = null;
    let bestDist = 170;
    for (const c of this.gctx.critters) {
      if (!c.alive) continue;
      const d = Phaser.Math.Distance.Between(this.x, this.y, c.x, c.y);
      if (d < bestDist) {
        bestDist = d;
        target = c;
      }
    }
    const dir = target ? Math.sign(target.x - this.x) || 1 : (this.flipX ? -1 : 1);
    this.dashTarget = target;
    this.dashUntil = time + 280;
    this.setFlipX(dir < 0);
    this.setVelocityX(dir * 460);
    // Impulso vertical mais generoso para alcançar alvos empoleirados
    if (target && target.y < this.y - 10) this.setVelocityY(-300);
    sound.dash();
    floatBubble(this.gctx, this.x, this.y - 24, 'Xô!');
    this.startTrail(300);
  }

  /** ANDARILHO: desliza sob móveis e frestas (hitbox abaixa). */
  useC(time: number): void {
    if (!this.body.onFloor()) return;
    const dir = this.moveDir !== 0 ? this.moveDir : (this.flipX ? -1 : 1);
    this.slideUntil = time + 500;
    this.setSlideBody();
    this.setVelocityX(dir * 310);
    this.setFlipX(dir < 0);
    sound.slide();
    this.startTrail(500);
  }

  private startTrail(dur: number): void {
    this.trail?.destroy();
    this.trail = this.gctx.add.particles(0, 0, 'p-dust', {
      follow: this,
      followOffset: { x: 0, y: 6 },
      frequency: 25,
      lifespan: 300,
      speed: { min: 10, max: 40 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 }
    });
    this.trail.setDepth(DEPTH.PARTICLE);
    this.gctx.time.delayedCall(dur + 300, () => {
      this.trail?.destroy();
      this.trail = null;
    });
  }

  protected handleSpecialMovement(time: number): boolean {
    // Dash do Caçador: espanta bichinhos no caminho
    if (time < this.dashUntil) {
      for (const c of this.gctx.critters) {
        if (c.alive && Phaser.Math.Distance.Between(this.x, this.y, c.x, c.y) < 42) {
          c.flee(this.body.velocity.x >= 0 ? 1 : -1);
        }
      }
      this.setTexture('cat-zorro-jump');
      return true;
    }
    // Fim do dash: se mirou um bichinho e chegou perto, espanta mesmo
    // assim (garante o acerto — jogo infantil, sem pixel-perfect)
    if (this.dashTarget) {
      const t = this.dashTarget;
      if (t.alive && Phaser.Math.Distance.Between(this.x, this.y, t.x, t.y) < 70) {
        t.flee(t.x >= this.x ? 1 : -1);
      }
      this.dashTarget = null;
    }
    // Deslize: mantém hitbox baixa até ter espaço para levantar
    if (time < this.slideUntil) {
      this.setScale(ART_SCALE * 1.1, ART_SCALE * 0.62);
      return true;
    }
    if (this.scaleY < ART_SCALE) {
      if (this.hasHeadroom()) {
        this.setScale(ART_SCALE, ART_SCALE);
        this.setNormalBody();
      } else {
        // Preso sob a fresta: continua deslizando devagarinho
        this.slideUntil = time + 120;
        const dir = this.flipX ? -1 : 1;
        this.setVelocityX(dir * 160);
        return true;
      }
    }
    return false;
  }

  private hasHeadroom(): boolean {
    const b = this.body;
    const bodies = this.gctx.physics.overlapRect(b.x, b.y - 12, b.width, 12, false, true);
    return bodies.length === 0;
  }
}
