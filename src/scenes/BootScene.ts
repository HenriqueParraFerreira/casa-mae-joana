import Phaser from 'phaser';
import { CAT_KINDS, FONT, GAME_H, GAME_W } from '../consts';
import { setupHiResCamera } from '../systems/Effects';
import { generateCatTextures } from '../assets/catSprites';
import { generateCharacterTextures, HUMAN_VARIANTS } from '../assets/characterSprites';
import { generateTileTextures } from '../assets/tileSprites';
import { generateFurnitureTextures } from '../assets/furnitureSprites';
import { generateMiscTextures } from '../assets/miscSprites';

/**
 * Gera TODOS os assets proceduralmente (sem arquivos externos) exibindo
 * uma barra de progresso, e registra as animações globais.
 */
export class BootScene extends Phaser.Scene {
  private tasks: { label: string; run: () => void }[] = [];
  private taskIdx = 0;
  private bar!: Phaser.GameObjects.Graphics;
  private label!: Phaser.GameObjects.Text;

  constructor() {
    super('BootScene');
  }

  create(): void {
    setupHiResCamera(this);
    const cx = GAME_W / 2;
    const cy = GAME_H / 2;
    this.add.text(cx, cy - 70, 'A Casa da Mãe Joana', {
      fontFamily: FONT, fontSize: '36px', fontStyle: 'bold', color: '#ffe08a', resolution: 2
    }).setOrigin(0.5);
    this.label = this.add.text(cx, cy + 40, 'Preparando os gatos...', {
      fontFamily: FONT, fontSize: '16px', color: '#e8dcc3', resolution: 2
    }).setOrigin(0.5);
    const frame = this.add.graphics();
    frame.lineStyle(3, 0xe8dcc3, 1);
    frame.strokeRect(cx - 202, cy - 12, 404, 26);
    this.bar = this.add.graphics();

    this.tasks = [
      { label: 'Penteando a Mia, o Zorro e a Macchia...', run: () => generateCatTextures(this) },
      { label: 'Acordando a Mãe Joana...', run: () => generateCharacterTextures(this) },
      { label: 'Encerando o piso...', run: () => generateTileTextures(this) },
      { label: 'Arrumando os móveis...', run: () => generateFurnitureTextures(this) },
      { label: 'Escondendo os vasos...', run: () => generateMiscTextures(this) },
      { label: 'Ensaiando os miados...', run: () => this.createAnims() }
    ];
    this.taskIdx = 0;
  }

  update(): void {
    if (this.taskIdx < this.tasks.length) {
      const task = this.tasks[this.taskIdx];
      this.label.setText(task.label);
      task.run();
      this.taskIdx++;
      const p = this.taskIdx / this.tasks.length;
      this.bar.clear();
      this.bar.fillStyle(0xd9a03a, 1);
      this.bar.fillRect(GAME_W / 2 - 198, GAME_H / 2 - 8, 396 * p, 18);
      if (this.taskIdx === this.tasks.length) {
        this.time.delayedCall(250, () => this.scene.start('MenuScene'));
      }
    }
  }

  private createAnims(): void {
    for (const kind of CAT_KINDS) {
      this.anims.create({
        key: `cat-${kind}-walk`,
        frames: [0, 1, 2, 3].map((f) => ({ key: `cat-${kind}-walk-${f}` })),
        frameRate: 12,
        repeat: -1
      });
      this.anims.create({
        key: `cat-${kind}-sit`,
        frames: [{ key: `cat-${kind}-sit-0` }, { key: `cat-${kind}-sit-1` }],
        frameRate: 1.2,
        repeat: -1
      });
    }
    for (const variant of HUMAN_VARIANTS) {
      this.anims.create({
        key: `human-${variant}-walk`,
        frames: [0, 1, 2, 3].map((f) => ({ key: `human-${variant}-walk-${f}` })),
        frameRate: 8,
        repeat: -1
      });
    }
    this.anims.create({
      key: 'dog-run',
      frames: [0, 1, 2, 3].map((f) => ({ key: `dog-run-${f}` })),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'rat-idle',
      frames: [{ key: 'rat-0' }, { key: 'rat-1' }],
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: 'bird-idle',
      frames: [{ key: 'bird-0' }, { key: 'bird-1' }],
      frameRate: 5,
      repeat: -1
    });
  }
}
