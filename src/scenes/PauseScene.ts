import Phaser from 'phaser';
import { FONT, GAME_H, GAME_W } from '../consts';
import { sound } from '../audio/SoundEngine';
import { setupHiResCamera } from '../systems/Effects';
import { isTouchDevice } from '../systems/TouchControls';

const TXT = { fontFamily: FONT, resolution: 2 };

/** Menu de pausa (ESC): continuar, recomeçar fase, voltar ao menu. */
export class PauseScene extends Phaser.Scene {
  private levelId = 1;

  constructor() {
    super('PauseScene');
  }

  init(data: { level: number }): void {
    this.levelId = data.level;
  }

  create(): void {
    setupHiResCamera(this);
    const cx = GAME_W / 2;
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x14100f, 0.65).setOrigin(0);

    const panel = this.add.graphics();
    panel.fillStyle(0xfff8e8, 0.97);
    panel.lineStyle(4, 0x241a1a, 1);
    panel.fillRoundedRect(cx - 260, 90, 520, 540, 14);
    panel.strokeRoundedRect(cx - 260, 90, 520, 540, 14);

    this.add.text(cx, 135, 'PAUSA', {
      ...TXT, fontSize: '38px', fontStyle: 'bold', color: '#3a2c22'
    }).setOrigin(0.5);

    this.makeButton(cx, 200, 'Continuar', () => this.resumeGame());
    this.makeButton(cx, 262, 'Recomeçar fase', () => {
      this.scene.stop();
      const gs = this.scene.get('GameScene');
      gs.scene.restart({ level: this.levelId });
    });
    this.makeButton(cx, 324, 'Menu', () => {
      this.scene.stop('GameScene');
      this.scene.stop('UIScene');
      this.scene.stop();
      this.scene.start('MenuScene');
    });

    this.add.text(cx, 385, '— controles —', {
      ...TXT, fontSize: '15px', color: '#8a6a4a'
    }).setOrigin(0.5);
    const controls = isTouchDevice(this)
      ? '◀  ▶ ................. andar\n' +
        'PULAR ................ pular\n' +
        'X .......... habilidade do gato\n' +
        'C .......... segunda habilidade\n' +
        'retratos no alto ...... trocar de gato\n' +
        'alto-falante ......... som liga/desliga\n' +
        '❚❚ ................... pausa'
      : 'SETAS ou WASD ........ andar\n' +
        'ESPAÇO ............... pular\n' +
        'X .......... habilidade do gato\n' +
        'C .......... segunda habilidade\n' +
        '1 / 2 / 3 ou TAB ...... trocar de gato\n' +
        'M .................... som liga/desliga\n' +
        'ESC .................. pausa';
    this.add.text(cx, 490, controls, {
      ...TXT, fontSize: '15px', color: '#3a2c22', lineSpacing: 8
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-ESC', () => this.resumeGame());
  }

  private resumeGame(): void {
    sound.uiClick();
    this.scene.stop();
    this.scene.resume('GameScene');
  }

  private makeButton(x: number, y: number, label: string, onClick: () => void): void {
    const w = 300;
    const h = 48;
    const g = this.add.graphics();
    const draw = (hover: boolean): void => {
      g.clear();
      g.fillStyle(hover ? 0xffd04a : 0xd9a03a, 1);
      g.lineStyle(3, 0x241a1a, 1);
      g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 10);
      g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 10);
    };
    draw(false);
    this.add.text(x, y, label, {
      ...TXT, fontSize: '19px', fontStyle: 'bold', color: '#241a1a'
    }).setOrigin(0.5);
    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => draw(true));
    zone.on('pointerout', () => draw(false));
    zone.on('pointerdown', () => {
      sound.uiClick();
      onClick();
    });
  }
}
