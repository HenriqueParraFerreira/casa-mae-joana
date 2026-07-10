import Phaser from 'phaser';
import { ART_SCALE, DEPTH, GAME_H, TILE } from '../consts';
import { makeBubble } from './Effects';
import { Human } from '../entities/Human';
import { Dog } from '../entities/Dog';
import { Rat } from '../entities/Rat';
import { Bird } from '../entities/Bird';
import { Breakable, Crate, Door, Plate } from '../entities/Objects';
import type { Critter } from '../entities/Critter';
import type { GameCtx } from './GameCtx';
import type { LevelData } from '../levels/types';

export interface BuiltLevel {
  solids: Phaser.GameObjects.GameObject[];
  visionRects: Phaser.Geom.Rectangle[];
  exitRect: Phaser.Geom.Rectangle;
  doors: Door[];
  plates: Plate[];
  breakables: Breakable[];
  crates: Crate[];
  critters: Critter[];
  humans: Human[];
  dogs: Dog[];
  checkpointPts: { x: number; y: number }[];
  guidePathPx: { x: number; y: number }[];
  spawns: { mia: { x: number; y: number }; zorro: { x: number; y: number }; macchia: { x: number; y: number } };
}

/** Constrói o mundo físico e as entidades a partir dos dados da fase. */
export function buildLevel(gctx: GameCtx, data: LevelData): BuiltLevel {
  const T = TILE;
  const worldW = data.widthTiles * T;

  // Fundo em degradê aconchegante
  const bg = gctx.add.graphics().setDepth(DEPTH.BG);
  bg.fillGradientStyle(data.bgTop, data.bgTop, data.bgBottom, data.bgBottom, 1);
  bg.fillRect(0, 0, worldW, GAME_H);

  const solids: Phaser.GameObjects.GameObject[] = [];
  const visionRects: Phaser.Geom.Rectangle[] = [];

  for (const p of data.platforms) {
    const ts = gctx.add.tileSprite(p.x * T, p.y * T, p.w * T, p.h * T, `tile-${p.tex}`)
      .setOrigin(0, 0)
      .setTileScale(ART_SCALE) // tiles 2x -> padrão de 32px de mundo
      .setDepth(DEPTH.PLATFORM);
    gctx.physics.add.existing(ts, true);
    if (p.tex === 'shelf') {
      // Prateleiras são plataformas de mão única: o gato pula através
      // por baixo e aterrissa em cima
      const body = ts.body as Phaser.Physics.Arcade.StaticBody;
      body.checkCollision.down = false;
      body.checkCollision.left = false;
      body.checkCollision.right = false;
    }
    solids.push(ts);
    visionRects.push(new Phaser.Geom.Rectangle(p.x * T, p.y * T, p.w * T, p.h * T));
  }

  for (const f of data.furniture) {
    const img = gctx.add.image(f.x * T, f.y * T, f.tex)
      .setOrigin(0, 0)
      .setScale(ART_SCALE)
      .setDepth(DEPTH.PLATFORM);
    gctx.physics.add.existing(img, true);
    (img.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
    solids.push(img);
    visionRects.push(new Phaser.Geom.Rectangle(f.x * T, f.y * T, img.displayWidth, img.displayHeight));
  }

  for (const d of data.decor) {
    const img = gctx.add.image(d.x * T, d.y * T, d.tex)
      .setOrigin(0, 0)
      .setScale(ART_SCALE)
      .setDepth(DEPTH.DECOR);
    if (d.flip) img.setFlipX(true);
  }

  for (const vb of data.visionBlockers) {
    visionRects.push(new Phaser.Geom.Rectangle(vb.x * T, vb.y * T, vb.w * T, vb.h * T));
  }

  // Portas (com o vão escuro desenhado atrás)
  const doors: Door[] = [];
  for (const dd of data.doors) {
    const cx = dd.x * T;
    const cy = (dd.y + dd.h / 2) * T;
    gctx.add.image(cx, cy, 'doorway').setDepth(DEPTH.DECOR).setDisplaySize(28, dd.h * T + 4);
    doors.push(new Door(gctx, dd.id, cx, cy, dd.h * T));
  }

  const plates: Plate[] = data.plates.map(
    (pd) => new Plate(gctx, pd.x * T, pd.y * T, pd.doorId, pd.momentary ?? false)
  );

  const breakables: Breakable[] = data.breakables.map(
    (bd) => new Breakable(gctx, bd, bd.x * T, bd.y * T)
  );
  for (const b of breakables) {
    for (const door of doors) {
      if (door.id === b.def.doorId || door.id === b.def.comboDoorId) door.hasLock = true;
    }
  }

  const crates: Crate[] = data.crates.map(
    (cd) => new Crate(gctx, cd.x * T, cd.y * T, cd.roller ?? false, cd.targetX)
  );

  const critters: Critter[] = data.critters.map((cd) =>
    cd.kind === 'rat' ? new Rat(gctx, cd.x * T, cd.y * T) : new Bird(gctx, cd.x * T, cd.y * T)
  );

  const floorY = 20.5 * T;
  const humans: Human[] = data.humans.map((hd) => new Human(
    gctx,
    { ...hd, minX: hd.minX * T, maxX: hd.maxX * T, cookAt: hd.cookAt !== undefined ? hd.cookAt * T : undefined },
    hd.x * T,
    floorY - 33
  ));

  const dogs: Dog[] = data.dogs.map((dd) => new Dog(
    gctx,
    { ...dd, minX: dd.minX * T, maxX: dd.maxX * T },
    dd.x * T,
    floorY - 14
  ));

  for (const s of data.signs) {
    makeBubble(gctx, s.x * T, s.y * T, s.text, 0.92, s.w);
  }

  // Saída
  const exitRect = new Phaser.Geom.Rectangle(data.exit.x * T, data.exit.y * T, data.exit.w * T, data.exit.h * T);
  const ecx = exitRect.centerX;
  if (data.id < 5) {
    gctx.add.image(ecx, exitRect.bottom - 60, 'exit-door').setScale(ART_SCALE).setDepth(DEPTH.DECOR);
  } else {
    // Quintal: toalha de piquenique ao sol
    const towel = gctx.add.tileSprite(exitRect.x, exitRect.bottom - 8, exitRect.width, 8, 'tile-carpet')
      .setOrigin(0, 0).setTileScale(ART_SCALE).setDepth(DEPTH.DECOR);
    towel.setTint(0xffd0a0);
  }
  // Brilho convidativo na saída
  const glow = gctx.add.particles(ecx, exitRect.bottom - 30, 'p-sparkle', {
    frequency: 300,
    lifespan: 900,
    speedY: { min: -40, max: -15 },
    speedX: { min: -15, max: 15 },
    scale: { start: 0.5, end: 0 },
    alpha: { start: 0.9, end: 0 },
    x: { min: -exitRect.width / 2, max: exitRect.width / 2 },
    y: { min: -20, max: 20 }
  });
  glow.setDepth(DEPTH.PARTICLE);

  return {
    solids,
    visionRects,
    exitRect,
    doors,
    plates,
    breakables,
    crates,
    critters,
    humans,
    dogs,
    checkpointPts: data.checkpoints.map((p) => ({ x: p.x * T, y: p.y * T })),
    guidePathPx: data.guidePath.map((p) => ({ x: p.x * T, y: p.y * T })),
    spawns: {
      mia: { x: data.spawns.mia.x * T, y: data.spawns.mia.y * T },
      zorro: { x: data.spawns.zorro.x * T, y: data.spawns.zorro.y * T },
      macchia: { x: data.spawns.macchia.x * T, y: data.spawns.macchia.y * T }
    }
  };
}
