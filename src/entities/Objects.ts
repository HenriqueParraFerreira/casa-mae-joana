import Phaser from 'phaser';
import { ART_SCALE, DEPTH, TILE } from '../consts';
import { sound } from '../audio/SoundEngine';
import { burst, floatBubble, impactFlash, screenShake } from '../systems/Effects';
import type { GameCtx } from '../systems/GameCtx';
import type { BreakableDef } from '../levels/types';
import type { Cat } from './Cat';

/** Porta fechada (corpo sólido) que abre por placa, tranca ou combinação. */
export class Door extends Phaser.Physics.Arcade.Image {
  declare body: Phaser.Physics.Arcade.StaticBody;
  readonly id: string;
  opened = false;
  /** Alguma tranca/mecanismo referencia esta porta (não abre só com placa). */
  hasLock = false;
  platePressed = false;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number, hPx: number) {
    super(scene, x, y, 'door');
    this.id = id;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setDisplaySize(20, hPx);
    this.body.setSize(16, hPx);
    this.body.updateFromGameObject();
    this.setDepth(DEPTH.DOOR);
  }

  open(): void {
    if (this.opened) return;
    this.opened = true;
    sound.doorOpen();
    burst(this.scene, 'p-sparkle', this.x, this.y - 20, { count: 10, speed: 70 });
    floatBubble(this.scene, this.x, this.y - this.displayHeight / 2 - 14, 'Abriu!');
    this.body.enable = false;
    this.scene.tweens.add({
      targets: this,
      alpha: 0.15,
      y: this.y - 10,
      duration: 400,
      ease: 'Sine.easeOut'
    });
  }

  /** Chamado por frame pela GameScene depois de atualizar as placas. */
  refresh(): void {
    if (!this.opened && this.platePressed && !this.hasLock) this.open();
  }
}

/** Placa de pressão que abre/participa da abertura de portas. */
export class Plate extends Phaser.GameObjects.Image {
  readonly doorId: string;
  readonly momentary: boolean;
  pressed = false;
  private latched = false;

  constructor(scene: Phaser.Scene, x: number, y: number, doorId: string, momentary: boolean) {
    super(scene, x, y, 'plate-off');
    this.doorId = doorId;
    this.momentary = momentary;
    scene.add.existing(this);
    this.setScale(ART_SCALE);
    this.setDepth(DEPTH.OBJECT);
  }

  update(cats: Cat[]): void {
    const zone = new Phaser.Geom.Rectangle(this.x - 16, this.y - 18, 32, 22);
    let now = false;
    for (const cat of cats) {
      if (cat.carriedBy) continue;
      const b = cat.body;
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height), zone)) {
        now = true;
        break;
      }
    }
    if (now && !this.momentary) this.latched = true;
    const pressed = this.latched || now;
    if (pressed && !this.pressed) {
      sound.plateOn();
      burst(this.scene, 'p-sparkle', this.x, this.y - 6, { count: 4, speed: 40 });
    }
    this.pressed = pressed;
    this.setTexture(pressed ? 'plate-on' : 'plate-off');
  }
}

/** Objeto quebrável pela Pata de Ferro da Mia (vaso, tranca, mecanismo). */
export class Breakable extends Phaser.Physics.Arcade.Image {
  declare body: Phaser.Physics.Arcade.StaticBody;
  readonly def: BreakableDef;
  broken = false;

  constructor(scene: Phaser.Scene, def: BreakableDef, x: number, y: number) {
    super(scene, x, y, def.tex);
    this.def = def;
    scene.add.existing(this);
    this.setScale(ART_SCALE);
    scene.physics.add.existing(this, true);
    this.body.updateFromGameObject(); // alinha o corpo estático à escala
    this.setDepth(DEPTH.OBJECT);
    if (def.tex !== 'vase') this.body.enable = false; // só o vaso bloqueia passagem
  }

  /** true se quebrou. */
  tryBreak(gctx: GameCtx): boolean {
    if (this.broken) return false;
    const targetDoor = gctx.doors.find(
      (d) => d.id === this.def.doorId || d.id === this.def.comboDoorId
    );
    if (this.def.comboDoorId && targetDoor && !targetDoor.platePressed) {
      // A tranca só cede com o puxador pressionado ao mesmo tempo
      sound.thud();
      this.scene.tweens.add({ targets: this, x: this.x + 3, duration: 45, yoyo: true, repeat: 3 });
      floatBubble(this.scene, this.x, this.y - 26, 'Firme! Falta pisar no puxador!');
      return false;
    }
    this.broken = true;
    sound.smash();
    screenShake(this.scene);
    impactFlash(this.scene);
    burst(this.scene, 'p-star', this.x, this.y, { count: 12, speed: 140, lifespan: 600 });
    burst(this.scene, 'p-smoke', this.x, this.y, { count: 6, speed: 60 });
    this.body.enable = false;
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleY: 0.3,
      y: this.y + this.displayHeight * 0.3,
      duration: 300,
      ease: 'Sine.easeIn'
    });
    targetDoor?.open();
    return true;
  }
}

/** Caixote/rolo pesado — só a Macchia empurra (passiva dela). */
export class Crate extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private gctx: GameCtx;
  readonly roller: boolean;
  private targetXpx?: number;
  private snapped = false;
  private lastCreak = 0;

  constructor(gctx: GameCtx, x: number, y: number, roller: boolean, targetXTiles?: number) {
    super(gctx, x, y, roller ? 'roller' : 'crate');
    this.gctx = gctx;
    this.roller = roller;
    this.targetXpx = targetXTiles !== undefined ? targetXTiles * TILE : undefined;
    gctx.add.existing(this);
    gctx.physics.add.existing(this);
    this.setScale(ART_SCALE);
    // pushable=false: gatos não empurram por colisão (só a Macchia, via código),
    // mas o caixote continua sendo separado de corpos estáticos (chão, móveis).
    this.setPushable(false);
    this.setDepth(DEPTH.OBJECT);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.snapped) return;
    let push = 0;
    const mac = this.gctx.cats.find((c) => c.kind === 'macchia');
    if (mac && mac.isActiveCat && !mac.carriedBy && mac.moveDir !== 0) {
      const b = this.body;
      const cb = mac.body;
      const vOverlap = Math.min(b.bottom, cb.bottom) - Math.max(b.top, cb.top);
      if (vOverlap > 6) {
        if (mac.moveDir > 0 && cb.right >= b.left - 5 && cb.right <= b.left + 8) push = 1;
        else if (mac.moveDir < 0 && cb.left <= b.right + 5 && cb.left >= b.right - 8) push = -1;
      }
    }
    this.setVelocityX(push * 48);
    if (push !== 0) {
      if (this.roller) this.rotation += push * delta * 0.006;
      if (time > this.lastCreak + 400) {
        this.lastCreak = time;
        sound.push();
        burst(this.scene, 'p-dust', this.x - push * 18, this.body.bottom, { count: 2, speed: 30 });
      }
      if (this.targetXpx !== undefined && Math.abs(this.x - this.targetXpx) < 8) this.snapTarget();
    }
  }

  private snapTarget(): void {
    this.snapped = true;
    this.setX(this.targetXpx as number);
    this.setVelocity(0, 0);
    this.body.setAllowGravity(false);
    sound.snap();
    burst(this.scene, 'p-sparkle', this.x, this.y - 20, { count: 10, speed: 80 });
    floatBubble(this.scene, this.x, this.y - 34, 'Encaixou!');
  }
}
