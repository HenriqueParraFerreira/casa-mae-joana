import { Cat } from './Cat';
import { sound } from '../audio/SoundEngine';
import { burst, floatBubble } from '../systems/Effects';
import type { GameCtx } from '../systems/GameCtx';

/** Macchia: maine coon tricolor GRANDE, carinhosa. Empurra caixotes (passiva). */
export class MacchiaCat extends Cat {
  private airJumps = 0;

  constructor(gctx: GameCtx, x: number, y: number) {
    super(gctx, x, y, 'macchia');
    this.speed = 170;
    this.jumpVel = 460;
    this.cooldownX = 250;
    this.cooldownC = 7000;
    // Valores em pixels da textura 2x (escala 0.5 -> mundo)
    this.body.setSize(52, 44);
    this.body.setOffset(12, 8);
  }

  protected tryJump(): void {
    if (this.body.onFloor()) {
      this.airJumps = 0;
      this.doJump(this.jumpVel);
    } else if (this.airJumps < 1) {
      this.airDoubleJump();
    }
  }

  /** SALTO ALTO: segundo impulso no ar, bem alto. */
  useX(_time: number): void {
    if (this.body.onFloor()) {
      this.airJumps = 0;
      this.doJump(this.jumpVel);
    } else if (this.airJumps < 1) {
      this.airDoubleJump();
    }
  }

  private airDoubleJump(): void {
    this.airJumps++;
    this.doJump(440);
    burst(this.gctx, 'p-star', this.x, this.body.bottom, { count: 8, speed: 90 });
    floatBubble(this.gctx, this.x, this.y - 28, 'Uhu!');
  }

  /** CHARME: ronrona; humanos e cachorros por perto param 5s para o carinho. */
  useC(_time: number): void {
    sound.purr();
    burst(this.gctx, 'p-heart', this.x, this.y - 16, { count: 12, speed: 70, lifespan: 900, gravity: -60 });
    floatBubble(this.gctx, this.x, this.y - 30, 'Prrrr...');
    const charmed: { charm(ms: number, cat: Cat): void; x: number }[] = [
      ...this.gctx.humans,
      ...this.gctx.dogs
    ];
    let any = false;
    for (const target of charmed) {
      if (Math.abs(target.x - this.x) < 200) {
        target.charm(5000, this);
        any = true;
      }
    }
    if (!any) {
      floatBubble(this.gctx, this.x, this.y - 46, '(ninguém por perto...)');
    }
  }
}
