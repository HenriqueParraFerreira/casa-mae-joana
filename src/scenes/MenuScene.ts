import Phaser from 'phaser';
import { CAT_KINDS, CAT_NAMES, FONT, GAME_H, GAME_W } from '../consts';
import { sound } from '../audio/SoundEngine';
import { SaveGame } from '../systems/SaveGame';
import { setupHiResCamera } from '../systems/Effects';
import { LEVELS } from '../levels';

const TXT = { fontFamily: FONT, resolution: 2 };

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    setupHiResCamera(this);
    const cx = GAME_W / 2;
    // Fundo aconchegante
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x6a4a6a, 0x6a4a6a, 0xc08858, 0xc08858, 1);
    bg.fillRect(0, 0, GAME_W, GAME_H);
    // "Piso" do menu
    this.add.tileSprite(0, GAME_H - 64, GAME_W, 64, 'tile-wood').setOrigin(0, 0).setTileScale(0.5);

    this.add.text(cx + 4, 124, 'A Casa da Mãe Joana', {
      ...TXT, fontSize: '58px', fontStyle: 'bold', color: '#241a1a'
    }).setOrigin(0.5);
    this.add.text(cx, 120, 'A Casa da Mãe Joana', {
      ...TXT, fontSize: '58px', fontStyle: 'bold', color: '#ffe08a'
    }).setOrigin(0.5);
    this.add.text(cx, 172, 'Três gatos. Uma casa. Muita bagunça.', {
      ...TXT, fontSize: '18px', color: '#f0e0c8'
    }).setOrigin(0.5);

    // Os três protagonistas, sentadinhos
    const catX = [cx - 120, cx, cx + 130];
    CAT_KINDS.forEach((kind, i) => {
      const cat = this.add.sprite(catX[i], GAME_H - 78, `cat-${kind}-sit-0`).setScale(1.25);
      cat.play(`cat-${kind}-sit`);
      if (i === 2) cat.setFlipX(true);
      this.add.text(catX[i], GAME_H - 40, CAT_NAMES[kind], {
        ...TXT, fontSize: '15px', fontStyle: 'bold', color: '#fff8e8'
      }).setOrigin(0.5);
    });

    const unlocked = SaveGame.getUnlocked();

    // Botão JOGAR
    this.makeButton(cx, 250, 260, 56, unlocked > 1 ? 'CONTINUAR' : 'JOGAR', 22, () => {
      this.startLevel(unlocked);
    });

    // Seleção de fases (destravam em ordem)
    this.add.text(cx, 320, '— fases —', {
      fontFamily: FONT, fontSize: '15px', color: '#f0e0c8'
    }).setOrigin(0.5);
    LEVELS.forEach((lv, i) => {
      const n = i + 1;
      const bx = cx + (i - 2) * 180;
      const isOpen = n <= unlocked;
      this.makeButton(bx, 380, 164, 66, `${n}\n${lv.name}`, 13, () => {
        if (isOpen) this.startLevel(n);
        else sound.thud();
      }, isOpen);
      if (!isOpen) this.add.image(bx + 66, 360, 'ui-lock').setScale(0.5);
    });

    this.add.text(cx, 480,
      'SETAS/WASD: andar    ESPAÇO: pular    X e C: habilidades\n1/2/3 ou TAB: trocar de gato    M: som    ESC: pausa', {
        ...TXT, fontSize: '14px', color: '#f0e0c8', align: 'center', lineSpacing: 6
      }).setOrigin(0.5);

    this.add.text(cx, GAME_H - 12, 'feito com Phaser, carinho e três gatos de verdade', {
      ...TXT, fontSize: '11px', color: '#d8c0a0'
    }).setOrigin(0.5, 1);

    // Áudio precisa de um gesto do usuário
    this.input.once('pointerdown', () => this.ensureAudio());
    this.input.keyboard?.once('keydown', () => this.ensureAudio());
    this.input.keyboard?.on('keydown-ENTER', () => this.startLevel(unlocked));
    this.input.keyboard?.on('keydown-M', () => {
      this.ensureAudio();
      sound.toggleMute();
    });
  }

  private ensureAudio(): void {
    sound.unlock();
    sound.startMusic('main');
  }

  private makeButton(
    x: number, y: number, w: number, h: number, label: string,
    size: number, onClick: () => void, enabled = true
  ): void {
    const g = this.add.graphics();
    const draw = (hover: boolean): void => {
      g.clear();
      g.fillStyle(enabled ? (hover ? 0xffd04a : 0xd9a03a) : 0x8a8078, 1);
      g.lineStyle(3, 0x241a1a, 1);
      g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 10);
      g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 10);
    };
    draw(false);
    const txt = this.add.text(x, y, label, {
      ...TXT, fontSize: `${size}px`, fontStyle: 'bold',
      color: enabled ? '#241a1a' : '#4a4440', align: 'center'
    }).setOrigin(0.5);
    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: enabled });
    zone.on('pointerover', () => draw(true));
    zone.on('pointerout', () => draw(false));
    zone.on('pointerdown', () => {
      this.ensureAudio();
      sound.uiClick();
      onClick();
    });
    if (!enabled) txt.setAlpha(0.7);
  }

  private startLevel(n: number): void {
    this.ensureAudio();
    this.scene.start('GameScene', { level: n });
  }
}
