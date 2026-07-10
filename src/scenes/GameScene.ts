import Phaser from 'phaser';
import { EV, GAME_H, GAME_ZOOM } from '../consts';
import { bus } from '../events';
import { sound } from '../audio/SoundEngine';
import { SaveGame } from '../systems/SaveGame';
import { LEVELS } from '../levels';
import { buildLevel } from '../systems/LevelBuilder';
import { createKeys, type GameKeys } from '../systems/Controls';
import { CatSwitcher } from '../systems/CatSwitcher';
import { CheckpointSystem } from '../systems/CheckpointSystem';
import { burst, fadeIn, irisOut } from '../systems/Effects';
import { MiaCat } from '../entities/MiaCat';
import { ZorroCat } from '../entities/ZorroCat';
import { MacchiaCat } from '../entities/MacchiaCat';
import type { Cat } from '../entities/Cat';
import type { Human } from '../entities/Human';
import type { Dog } from '../entities/Dog';
import type { Critter } from '../entities/Critter';
import type { Breakable, Crate, Door, Plate } from '../entities/Objects';
import type { GameCtx } from '../systems/GameCtx';
import type { LevelData } from '../levels/types';

/** Cena principal: carrega os dados da fase atual e orquestra tudo. */
export class GameScene extends Phaser.Scene implements GameCtx {
  cats: Cat[] = [];
  humans: Human[] = [];
  dogs: Dog[] = [];
  critters: Critter[] = [];
  breakables: Breakable[] = [];
  doors: Door[] = [];
  plates: Plate[] = [];
  crates: Crate[] = [];
  visionRects: Phaser.Geom.Rectangle[] = [];
  guidePathPx: { x: number; y: number }[] = [];

  private levelId = 1;
  private levelData!: LevelData;
  private keys!: GameKeys;
  private switcher!: CatSwitcher;
  private checkpoints!: CheckpointSystem;
  private exitRect!: Phaser.Geom.Rectangle;
  private completing = false;

  constructor() {
    super('GameScene');
  }

  init(data: { level?: number }): void {
    this.levelId = Phaser.Math.Clamp(data.level ?? 1, 1, LEVELS.length);
  }

  create(): void {
    this.completing = false;
    this.levelData = LEVELS[this.levelId - 1];
    const worldW = this.levelData.widthTiles * 32;
    this.physics.world.setBounds(0, 0, worldW, GAME_H);
    this.cameras.main.setBounds(0, 0, worldW, GAME_H);
    this.cameras.main.setZoom(GAME_ZOOM);

    const built = buildLevel(this, this.levelData);
    this.humans = built.humans;
    this.dogs = built.dogs;
    this.critters = built.critters;
    this.breakables = built.breakables;
    this.doors = built.doors;
    this.plates = built.plates;
    this.crates = built.crates;
    this.visionRects = built.visionRects;
    this.guidePathPx = built.guidePathPx;
    this.exitRect = built.exitRect;

    this.cats = [
      new MiaCat(this, built.spawns.mia.x, built.spawns.mia.y),
      new ZorroCat(this, built.spawns.zorro.x, built.spawns.zorro.y),
      new MacchiaCat(this, built.spawns.macchia.x, built.spawns.macchia.y)
    ];
    this.checkpoints = new CheckpointSystem(this, built.checkpointPts, {
      x: built.spawns.mia.x, y: built.spawns.mia.y
    });
    this.switcher = new CatSwitcher(this, this.cats);

    // Colisões
    this.physics.add.collider(this.cats, built.solids);
    this.physics.add.collider(this.cats, this.doors);
    this.physics.add.collider(this.cats, this.critters);
    this.physics.add.collider(this.cats, this.crates);
    this.physics.add.collider(this.cats, this.breakables);
    this.physics.add.collider(this.crates, built.solids);
    this.physics.add.collider(this.crates, this.doors);
    this.physics.add.collider(this.crates, this.crates);
    this.physics.add.collider(this.humans, built.solids);
    this.physics.add.collider(this.dogs, built.solids);

    this.keys = createKeys(this);

    // HUD paralelo
    if (this.scene.isActive('UIScene')) this.scene.stop('UIScene');
    this.scene.launch('UIScene', { levelId: this.levelId, levelName: this.levelData.name });

    // Eventos vindos da UI (clicar no retrato troca de gato)
    const onRequestSwitch = (idx: number): void => {
      if (!this.completing) this.switcher.switchTo(idx);
    };
    bus.on(EV.REQUEST_SWITCH, onRequestSwitch);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      bus.off(EV.REQUEST_SWITCH, onRequestSwitch);
    });

    sound.unlock();
    sound.startMusic('main');
    fadeIn(this);
  }

  update(time: number, delta: number): void {
    // Pausa e mudo
    if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
      sound.uiClick();
      this.scene.launch('PauseScene', { level: this.levelId });
      this.scene.pause();
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.m)) {
      bus.emit(EV.MUTE_CHANGED, sound.toggleMute());
    }

    if (!this.completing) this.switcher.update(this.keys);
    for (const cat of this.cats) {
      const useKeys = cat.isActiveCat && !this.completing ? this.keys : null;
      cat.update(time, delta, useKeys);
    }
    for (const h of this.humans) h.update(time);
    for (const d of this.dogs) d.update(time);

    for (const p of this.plates) p.update(this.cats);
    for (const door of this.doors) {
      door.platePressed = this.plates.some((p) => p.doorId === door.id && p.pressed);
      door.refresh();
    }

    this.checkpoints.update(this.cats);
    this.checkExit();
  }

  private checkExit(): void {
    let count = 0;
    for (const cat of this.cats) {
      if (cat.atExit) {
        count++;
        continue;
      }
      if (!cat.carriedBy && Phaser.Geom.Rectangle.Contains(this.exitRect, cat.x, cat.y)) {
        cat.arriveExit();
        count++;
        bus.emit(EV.CAT_AT_EXIT, count);
        this.switcher.onCatReachedExit(cat);
      }
    }
    if (count === 3 && !this.completing) this.completeLevel();
  }

  private completeLevel(): void {
    this.completing = true;
    sound.victory();
    SaveGame.unlock(this.levelId + 1);
    const cx = this.exitRect.centerX;
    const cy = this.exitRect.centerY;
    burst(this, 'p-confetti', cx, cy - 40, {
      count: 40, speed: 220, lifespan: 1200, gravity: 300,
      tint: [0xe86a8a, 0xffd04a, 0x7cb45b, 0x6a8ac0, 0xffffff]
    });
    burst(this, 'p-star', cx, cy, { count: 16, speed: 150, lifespan: 800 });
    this.time.delayedCall(1500, () => {
      irisOut(this, cx, cy, () => {
        this.scene.stop('UIScene');
        if (this.levelId < LEVELS.length) {
          this.scene.restart({ level: this.levelId + 1 });
        } else {
          this.scene.start('VictoryScene');
        }
      });
    });
  }

  // ---- GameCtx ----
  respawnPoint(): { x: number; y: number } {
    return this.checkpoints.respawnPoint();
  }

  activeCat(): Cat {
    return this.switcher.active;
  }
}
