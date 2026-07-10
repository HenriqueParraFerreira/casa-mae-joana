import Phaser from 'phaser';
import { ART_SCALE, CAT_NAMES, DEPTH, type CatKind } from '../consts';
import { sound } from '../audio/SoundEngine';
import { burst, floatBubble, jumpStretch, landSquash } from '../systems/Effects';
import { holdLeft, holdRight, justJump, type GameKeys } from '../systems/Controls';
import type { GameCtx } from '../systems/GameCtx';
import type { Human } from './Human';

/**
 * Classe base dos três gatos. O gato ativo responde ao teclado; os outros
 * ficam sentados com animação fofa onde foram deixados.
 */
export abstract class Cat extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  readonly kind: CatKind;
  readonly catName: string;
  protected gctx: GameCtx;

  speed = 150;
  jumpVel = 420;
  protected cooldownX = 500;
  protected cooldownC = 1000;

  isActiveCat = false;
  carriedBy: Human | null = null;
  immuneUntil = 0;
  atExit = false;
  /** Direção de input atual (-1/0/1) — usada pelos caixotes empurráveis. */
  moveDir = 0;

  private wasOnFloor = true;
  private nextX = 0;
  private nextC = 0;
  private carryWiggle = 0;

  constructor(gctx: GameCtx, x: number, y: number, kind: CatKind) {
    super(gctx, x, y, `cat-${kind}-sit-0`);
    this.gctx = gctx;
    this.kind = kind;
    this.catName = CAT_NAMES[kind];
    gctx.add.existing(this);
    gctx.physics.add.existing(this);
    this.setDepth(DEPTH.CAT);
    this.setCollideWorldBounds(true);
    // Texturas em 2x exibidas na metade: pixel art mais definida
    this.setScale(ART_SCALE);
    this.setData('baseScale', ART_SCALE);
    this.play(`cat-${kind}-sit`);
  }

  abstract useX(time: number): void;
  abstract useC(time: number): void;

  /** Pulo padrão (Macchia sobrescreve para o pulo duplo). */
  protected tryJump(): void {
    if (this.body.onFloor()) this.doJump(this.jumpVel);
  }

  protected doJump(vel: number): void {
    this.setVelocityY(-vel);
    sound.jump();
    jumpStretch(this.gctx, this);
    burst(this.gctx, 'p-dust', this.x, this.body.bottom, { count: 4, speed: 50 });
  }

  update(time: number, _delta: number, keys: GameKeys | null): void {
    if (this.carriedBy) {
      // Pendurado pelo cangote, perninha balançando
      this.carryWiggle += 0.15;
      const h = this.carriedBy;
      this.setPosition(h.x + (h.flipX ? -14 : 14), h.y - 8 + Math.sin(this.carryWiggle) * 2);
      this.setAngle(Math.sin(this.carryWiggle * 0.7) * 14);
      this.setTexture(`cat-${this.kind}-jump`);
      return;
    }
    this.setAngle(0);

    const onFloor = this.body.onFloor();
    if (onFloor && !this.wasOnFloor && this.body.deltaY() >= 0) {
      landSquash(this.gctx, this);
      burst(this.gctx, 'p-dust', this.x, this.body.bottom, { count: 5, speed: 60 });
      if (this.isActiveCat) sound.land();
    }
    this.wasOnFloor = onFloor;

    if (this.atExit || !this.isActiveCat || !keys) {
      this.moveDir = 0;
      if (onFloor) this.setVelocityX(0);
      if (this.anims.currentAnim?.key !== `cat-${this.kind}-sit`) {
        this.play(`cat-${this.kind}-sit`);
      }
      return;
    }

    if (this.handleSpecialMovement(time)) return;

    // Movimento horizontal
    let dir = 0;
    if (holdLeft(keys)) dir = -1;
    else if (holdRight(keys)) dir = 1;
    this.moveDir = dir;
    this.setVelocityX(dir * this.speed);
    if (dir !== 0) this.setFlipX(dir < 0);

    if (justJump(keys)) this.tryJump();

    // Habilidades com cooldown
    if (Phaser.Input.Keyboard.JustDown(keys.x) && time >= this.nextX) {
      this.nextX = time + this.cooldownX;
      this.useX(time);
    }
    if (Phaser.Input.Keyboard.JustDown(keys.c) && time >= this.nextC) {
      this.nextC = time + this.cooldownC;
      this.useC(time);
    }

    // Animações
    if (!onFloor) {
      this.anims.stop();
      this.setTexture(`cat-${this.kind}-jump`);
    } else if (dir !== 0) {
      if (this.anims.currentAnim?.key !== `cat-${this.kind}-walk`) {
        this.play(`cat-${this.kind}-walk`);
      }
    } else if (this.anims.currentAnim?.key !== `cat-${this.kind}-sit`) {
      this.play(`cat-${this.kind}-sit`);
    }
  }

  /** Hook para estados especiais (deslize/dash do Zorro). true = pulou o controle normal. */
  protected handleSpecialMovement(_time: number): boolean {
    return false;
  }

  meow(): void {
    sound.meow(this.kind);
    floatBubble(this.gctx, this.x, this.y - 26, 'Miau!');
  }

  onCarried(human: Human): void {
    this.carriedBy = human;
    this.atExit = false;
    this.body.enable = false;
    this.moveDir = 0;
  }

  onDropped(at: { x: number; y: number }): void {
    this.carriedBy = null;
    this.setAngle(0);
    this.setPosition(at.x, at.y - 20);
    this.body.enable = true;
    this.setVelocity(0, 0);
    // Imunidade longa após ser solto: dá tempo de sobra para escapar
    this.immuneUntil = this.gctx.time.now + 5000;
    sound.drop();
    burst(this.gctx, 'p-star', this.x, this.y - 14, { count: 5, speed: 60 });
    floatBubble(this.gctx, this.x, this.y - 26, 'Ufa!');
  }

  /** Volta imediato ao checkpoint (susto de cachorro / fallback). */
  sendToCheckpoint(): void {
    const pt = this.gctx.respawnPoint();
    burst(this.gctx, 'p-smoke', this.x, this.y, { count: 8, speed: 80 });
    this.setPosition(pt.x, pt.y - 20);
    this.setVelocity(0, 0);
    this.immuneUntil = this.gctx.time.now + 4000;
    burst(this.gctx, 'p-star', pt.x, pt.y - 24, { count: 6, speed: 70 });
    floatBubble(this.gctx, pt.x, pt.y - 34, '!');
  }

  arriveExit(): void {
    this.atExit = true;
    this.setVelocityX(0);
    this.meow();
    burst(this.gctx, 'p-sparkle', this.x, this.y - 10, { count: 10, speed: 70 });
  }
}
