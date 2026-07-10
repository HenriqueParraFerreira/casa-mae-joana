import Phaser from 'phaser';
import { DEPTH } from '../consts';
import type { Cat } from '../entities/Cat';

/**
 * Cone de visão amarelo translúcido dos humanos. Detecta gatos por
 * distância + ângulo + linha de visada (bloqueada por móveis/paredes).
 */
export class VisionCone {
  readonly range: number;
  private readonly halfAngle = Phaser.Math.DegToRad(30);
  private g: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, range = 230) {
    this.range = range;
    this.g = scene.add.graphics().setDepth(DEPTH.CONE);
  }

  setVisible(v: boolean): void {
    this.g.setVisible(v);
  }

  /** Redesenha o cone a partir do "olho" (eyeX, eyeY) na direção dir (+1/-1). */
  draw(eyeX: number, eyeY: number, dir: number): void {
    const center = dir >= 0 ? 0 : Math.PI;
    this.g.clear();
    this.g.fillStyle(0xffe06a, 0.16);
    this.g.slice(eyeX, eyeY, this.range, center - this.halfAngle, center + this.halfAngle, false);
    this.g.fillPath();
    this.g.lineStyle(1, 0xffe06a, 0.35);
    this.g.slice(eyeX, eyeY, this.range, center - this.halfAngle, center + this.halfAngle, false);
    this.g.strokePath();
  }

  canSee(
    eyeX: number, eyeY: number, dir: number,
    tx: number, ty: number, blockers: Phaser.Geom.Rectangle[]
  ): boolean {
    const dx = tx - eyeX;
    const dy = ty - eyeY;
    const dist = Math.hypot(dx, dy);
    if (dist > this.range) return false;
    const angle = Math.atan2(dy, dx);
    const center = dir >= 0 ? 0 : Math.PI;
    let diff = Phaser.Math.Angle.Wrap(angle - center);
    if (Math.abs(diff) > this.halfAngle) return false;
    const line = new Phaser.Geom.Line(eyeX, eyeY, tx, ty);
    for (const rect of blockers) {
      if (Phaser.Geom.Intersects.LineToRectangle(line, rect)) return false;
    }
    return true;
  }

  /** Retorna o gato visível mais próximo (ignorando protegidos). */
  detect(
    eyeX: number, eyeY: number, dir: number,
    cats: Cat[], blockers: Phaser.Geom.Rectangle[], now: number
  ): Cat | null {
    let best: Cat | null = null;
    let bestDist = Infinity;
    for (const cat of cats) {
      if (cat.carriedBy || cat.atExit || now < cat.immuneUntil) continue;
      if (!this.canSee(eyeX, eyeY, dir, cat.x, cat.y, blockers)) continue;
      const d = Phaser.Math.Distance.Between(eyeX, eyeY, cat.x, cat.y);
      if (d < bestDist) {
        bestDist = d;
        best = cat;
      }
    }
    return best;
  }

  destroy(): void {
    this.g.destroy();
  }
}
