import Phaser from 'phaser';
import { ART_SCALE, DEPTH, FONT } from '../consts';
import { sound } from '../audio/SoundEngine';
import { burst, floatBubble } from '../systems/Effects';
import { VisionCone } from '../systems/VisionCone';
import type { HumanVariant } from '../assets/characterSprites';
import type { GameCtx } from '../systems/GameCtx';
import type { HumanDef } from '../levels/types';
import type { Cat } from './Cat';

type HState = 'patrol' | 'alert' | 'chase' | 'carry' | 'return' | 'pet';

interface VariantInfo {
  name: string;
  bodyH: number;
  bodyOffY: number;
  /** Altura do "olho" (origem do cone) em relação ao centro, em px de mundo. */
  eyeOff: number;
  range: number;
  grabLine: string;
}

const VARIANT_INFO: Record<HumanVariant, VariantInfo> = {
  elis: { name: 'Elis', bodyH: 96, bodyOffY: 30, eyeOff: -8, range: 195, grabLine: 'Gatinho!!' },
  elena: { name: 'Elena', bodyH: 106, bodyOffY: 20, eyeOff: -16, range: 225, grabLine: 'Vem cá, fofinho!' },
  nona: { name: 'Nona', bodyH: 120, bodyOffY: 6, eyeOff: -24, range: 250, grabLine: 'Peguei você, pestinha!' },
  joana: { name: 'Joana', bodyH: 120, bodyOffY: 6, eyeOff: -24, range: 250, grabLine: 'Peguei você!' }
};

/**
 * Humano: patrulha com cone de visão. Ao ver um gato, corre atrás, pega
 * pelo cangote e o carrega de volta ao último checkpoint. Sem punição
 * além do passeio. A Mãe Joana tem patrulha imprevisível.
 */
export class Human extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private gctx: GameCtx;
  private minX: number;
  private maxX: number;
  private walkSpeed: number;
  private chaseSpeed: number;
  readonly mama: boolean;
  /** Amigável: só passeia (jardinagem), nunca persegue os gatos. */
  readonly friendly: boolean;
  readonly variant: HumanVariant;
  private info: VariantInfo;
  private nameLabel: Phaser.GameObjects.Text;
  private cookAtPx?: number;

  private hstate: HState = 'patrol';
  private dir = 1;
  private waitUntil = 0;
  private stateUntil = 0;
  private target: Cat | null = null;
  private carrying: Cat | null = null;
  private carryStart = 0;
  private lostSightAt = 0;
  private nextStep = 0;
  private nextWhim = 0;
  private cone: VisionCone;
  private cooked = false;

  constructor(gctx: GameCtx, def: HumanDef, x: number, y: number) {
    const variant: HumanVariant = def.variant ?? (def.mama ? 'nona' : 'elena');
    super(gctx, x, y, `human-${variant}-walk-0`);
    this.gctx = gctx;
    this.variant = variant;
    this.info = VARIANT_INFO[variant];
    this.mama = def.mama ?? false;
    this.friendly = def.friendly ?? false;
    this.minX = def.minX;
    this.maxX = def.maxX;
    this.walkSpeed = def.speed ?? (this.mama ? 70 : 60);
    this.chaseSpeed = this.walkSpeed * 2.3;
    this.cookAtPx = def.cookAt;
    gctx.add.existing(this);
    gctx.physics.add.existing(this);
    this.setScale(ART_SCALE);
    // Valores em pixels da textura 2x (escala 0.5 -> mundo); a altura do
    // corpo acompanha a estatura de cada uma (Elis < Elena < Joana)
    this.body.setSize(40, this.info.bodyH);
    this.body.setOffset(12, this.info.bodyOffY);
    this.setDepth(DEPTH.ENEMY);
    this.cone = new VisionCone(gctx, this.info.range);
    // Plaquinha com o nome
    this.nameLabel = gctx.add.text(x, y, this.info.name, {
      fontFamily: FONT, fontSize: '11px', fontStyle: 'bold', color: '#fff8e8',
      stroke: '#241a1a', strokeThickness: 3, resolution: 2
    }).setOrigin(0.5).setDepth(DEPTH.BUBBLE).setAlpha(0.9);
  }

  private get eyeY(): number {
    return this.y + this.info.eyeOff;
  }

  private animKey(): string {
    return `human-${this.variant}-walk`;
  }

  private walkAnim(moving: boolean): void {
    if (moving) {
      if (this.anims.currentAnim?.key !== this.animKey()) this.play(this.animKey());
    } else {
      this.anims.stop();
      this.setTexture(`human-${this.variant}-walk-1`);
    }
  }

  /** Charme da Macchia: para tudo por `ms` para fazer carinho. */
  charm(ms: number, cat: Cat): void {
    if (this.hstate === 'carry') return;
    this.hstate = 'pet';
    this.stateUntil = this.gctx.time.now + ms;
    this.target = null;
    this.setVelocityX(0);
    this.setFlipX(cat.x < this.x);
    floatBubble(this.gctx, this.x, this.y - 44, '❤ Que fofura!');
    burst(this.gctx, 'p-heart', this.x, this.y - 30, { count: 6, speed: 50, gravity: -50 });
  }

  update(time: number): void {
    this.nameLabel.setPosition(this.x, this.y + this.info.eyeOff - 20);
    const showCone = !this.friendly && (this.hstate === 'patrol' || this.hstate === 'alert');
    this.cone.setVisible(showCone);
    if (showCone) this.cone.draw(this.x + this.dir * 8, this.eyeY, this.dir);

    switch (this.hstate) {
      case 'patrol': this.doPatrol(time); break;
      case 'alert': this.doAlert(time); break;
      case 'chase': this.doChase(time); break;
      case 'carry': this.doCarry(time); break;
      case 'return': this.doReturn(); break;
      case 'pet': this.doPet(time); break;
    }

    // Passinhos
    if (Math.abs(this.body.velocity.x) > 10 && time > this.nextStep) {
      this.nextStep = time + (this.hstate === 'chase' ? 220 : 380);
      sound.footstep();
    }
  }

  private doPatrol(time: number): void {
    if (time < this.waitUntil) {
      this.setVelocityX(0);
      this.walkAnim(false);
    } else {
      this.setVelocityX(this.dir * this.walkSpeed);
      this.setFlipX(this.dir < 0);
      this.walkAnim(true);
      if (this.dir > 0 && this.x >= this.maxX) this.turnAround(time);
      else if (this.dir < 0 && this.x <= this.minX) this.turnAround(time);
      // Mãe Joana: pausas e reviradas imprevisíveis + paradinha no fogão
      if (this.mama) {
        if (this.cookAtPx !== undefined && !this.cooked && Math.abs(this.x - this.cookAtPx) < 6) {
          this.cooked = true;
          this.waitUntil = time + Phaser.Math.Between(2200, 3600);
          floatBubble(this.gctx, this.x, this.y - 44,
            this.friendly ? '~ regando as flores ~' : '~ mexendo a panela ~');
          this.gctx.time.delayedCall(4500, () => { this.cooked = false; });
        } else if (time > this.nextWhim) {
          this.nextWhim = time + Phaser.Math.Between(1500, 4000);
          const roll = Phaser.Math.Between(0, 9);
          if (roll < 3) this.dir *= -1;
          else if (roll < 5) this.waitUntil = time + Phaser.Math.Between(400, 1200);
        }
      }
    }
    // Detecção (humanos amigáveis só passeiam)
    if (this.friendly) return;
    // Gato descansando na almofada do checkpoint é deixado em paz —
    // evita o ciclo pega-solta-pega no mesmo lugar
    const rp = this.gctx.respawnPoint();
    const candidates = this.gctx.cats.filter(
      (c) => Phaser.Math.Distance.Between(c.x, c.y, rp.x, rp.y) > 70
    );
    const seen = this.cone.detect(
      this.x + this.dir * 8, this.eyeY, this.dir, candidates, this.gctx.visionRects, time
    );
    if (seen) {
      this.hstate = 'alert';
      this.stateUntil = time + 450;
      this.target = seen;
      this.setVelocityX(0);
      sound.alert();
      floatBubble(this.gctx, this.x, this.y - 46, '!');
    }
  }

  private turnAround(time: number): void {
    this.dir *= -1;
    this.waitUntil = time + (this.mama ? Phaser.Math.Between(200, 900) : 500);
  }

  private doAlert(time: number): void {
    this.walkAnim(false);
    if (time >= this.stateUntil) {
      this.hstate = 'chase';
      this.lostSightAt = time;
    }
  }

  private doChase(time: number): void {
    const t = this.target;
    if (!t || t.carriedBy || t.atExit || time < t.immuneUntil) {
      this.hstate = 'return';
      return;
    }
    const dx = t.x - this.x;
    this.dir = dx >= 0 ? 1 : -1;
    this.setVelocityX(this.dir * this.chaseSpeed);
    this.setFlipX(this.dir < 0);
    this.walkAnim(true);
    if (this.cone.canSee(this.x + this.dir * 8, this.eyeY, this.dir, t.x, t.y, this.gctx.visionRects) ||
        Math.abs(dx) < 40) {
      this.lostSightAt = time;
    }
    if (time - this.lostSightAt > 2200) {
      this.hstate = 'return';
      floatBubble(this.gctx, this.x, this.y - 46, '?');
      return;
    }
    if (Math.abs(dx) < 22 && Math.abs(t.y - this.y) < 56) this.grab(t, time);
  }

  private grab(cat: Cat, time: number): void {
    this.carrying = cat;
    this.target = null;
    cat.onCarried(this);
    this.hstate = 'carry';
    this.carryStart = time;
    sound.grab();
    floatBubble(this.gctx, this.x, this.y - 46, this.info.grabLine);
    burst(this.gctx, 'p-star', cat.x, cat.y, { count: 6, speed: 70 });
  }

  private doCarry(time: number): void {
    const cat = this.carrying;
    if (!cat) {
      this.hstate = 'return';
      return;
    }
    const dest = this.gctx.respawnPoint();
    const dx = dest.x - this.x;
    if (Math.abs(dx) < 14) {
      cat.onDropped(dest);
      this.carrying = null;
      this.hstate = 'return';
      floatBubble(this.gctx, this.x, this.y - 46, 'Fica aí, bichano!');
      return;
    }
    // Esbarrou em algo (bancada, muro) ou está demorando: solta na hora
    // e o gato volta num pufe para a almofada — nunca fica presa
    const blocked = this.body.blocked.left || this.body.blocked.right;
    if (blocked || time - this.carryStart > 5000) {
      cat.onDropped({ x: this.x, y: this.y });
      cat.sendToCheckpoint();
      floatBubble(this.gctx, this.x, this.y - 46, 'Vai pra sua almofada!');
      this.carrying = null;
      this.hstate = 'return';
      return;
    }
    this.dir = dx >= 0 ? 1 : -1;
    this.setVelocityX(this.dir * this.walkSpeed * 2);
    this.setFlipX(this.dir < 0);
    this.walkAnim(true);
  }

  private doReturn(): void {
    const center = (this.minX + this.maxX) / 2;
    if (this.x >= this.minX && this.x <= this.maxX) {
      this.hstate = 'patrol';
      return;
    }
    this.dir = center >= this.x ? 1 : -1;
    this.setVelocityX(this.dir * this.walkSpeed);
    this.setFlipX(this.dir < 0);
    this.walkAnim(true);
  }

  private doPet(time: number): void {
    this.setVelocityX(0);
    this.walkAnim(false);
    if (Math.floor(time / 400) % 2 === 0 && time > this.nextWhim) {
      this.nextWhim = time + 500;
      burst(this.gctx, 'p-heart', this.x + (this.flipX ? -12 : 12), this.y - 20,
        { count: 1, speed: 30, gravity: -60 });
    }
    if (time >= this.stateUntil) this.hstate = 'patrol';
  }

  destroy(fromScene?: boolean): void {
    this.cone.destroy();
    this.nameLabel.destroy();
    super.destroy(fromScene);
  }
}
