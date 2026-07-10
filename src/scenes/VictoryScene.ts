import Phaser from 'phaser';
import { CAT_KINDS, CAT_NAMES, FONT, GAME_H, GAME_W } from '../consts';
import { sound } from '../audio/SoundEngine';
import { makeBubble, setupHiResCamera } from '../systems/Effects';

const TXT = { fontFamily: FONT, resolution: 2 };

/** Celebração final: os três gatos deitados juntos no sol do quintal. */
export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create(): void {
    setupHiResCamera(this);
    const cx = GAME_W / 2;
    // Céu de fim de tarde
    const bg = this.add.graphics();
    bg.fillGradientStyle(0xffb86a, 0xffb86a, 0xffe8b0, 0xffe8b0, 1);
    bg.fillRect(0, 0, GAME_W, GAME_H);
    this.add.image(cx, 150, 'sun').setScale(1.6);
    this.add.tileSprite(0, GAME_H - 96, GAME_W, 96, 'tile-grass').setOrigin(0, 0).setTileScale(0.5);
    for (let i = 0; i < 12; i++) {
      this.add.image(60 + i * 110, GAME_H - 96, 'fence').setOrigin(0.5, 1).setScale(0.5);
    }
    for (let i = 0; i < 8; i++) {
      this.add.image(90 + i * 160, GAME_H - 88, `flower-${i % 2}`).setOrigin(0.5, 1).setScale(0.5);
    }
    // Toalha da soneca
    const towel = this.add.tileSprite(cx - 180, GAME_H - 110, 360, 14, 'tile-carpet')
      .setOrigin(0, 0).setTileScale(0.5);
    towel.setTint(0xffd0a0);

    // Os três, deitados juntos ao sol
    const catX = [cx - 100, cx, cx + 105];
    CAT_KINDS.forEach((kind, i) => {
      const cat = this.add.sprite(catX[i], GAME_H - 122, `cat-${kind}-sit-0`).setScale(1.2);
      cat.play(`cat-${kind}-sit`);
      if (i === 2) cat.setFlipX(true);
      this.tweens.add({
        targets: cat,
        y: cat.y - 4,
        duration: 900 + i * 150,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.time.delayedCall(1200 + i * 700, () => {
        makeBubble(this, catX[i] + 20, GAME_H - 170, 'Zzz...');
      });
    });

    // Chuva de confete
    const confetti = this.add.particles(0, -10, 'p-confetti', {
      x: { min: 0, max: GAME_W },
      lifespan: 4000,
      speedY: { min: 60, max: 140 },
      speedX: { min: -30, max: 30 },
      rotate: { min: 0, max: 360 },
      scale: { min: 0.4, max: 0.7 },
      frequency: 60,
      tint: [0xe86a8a, 0xffd04a, 0x7cb45b, 0x6a8ac0, 0xffffff]
    });
    confetti.setDepth(50);

    this.add.text(cx + 3, 293, 'VITÓRIA!', {
      ...TXT, fontSize: '64px', fontStyle: 'bold', color: '#241a1a'
    }).setOrigin(0.5);
    this.add.text(cx, 290, 'VITÓRIA!', {
      ...TXT, fontSize: '64px', fontStyle: 'bold', color: '#fff8e8'
    }).setOrigin(0.5);
    this.add.text(cx, 345, 'Os três gatos atravessaram a casa inteira\ne conquistaram o quintal da frente!', {
      ...TXT, fontSize: '18px', color: '#5a3c22', align: 'center', lineSpacing: 6
    }).setOrigin(0.5);

    // Créditos
    const credits = [
      '~ elenco ~',
      `${CAT_NAMES.mia} — a sábia pata de ferro`,
      `${CAT_NAMES.zorro} — o caçador andarilho`,
      `${CAT_NAMES.macchia} — o charme que salta alto`,
      '',
      'Elis e Elena — as irmãs que quase pegam os gatos',
      'Nona — a avó, chef da cozinha',
      'Joana — a mãe jardineira (e o coração da casa)'
    ];
    credits.forEach((line, i) => {
      const t = this.add.text(cx, 410 + i * 24, line, {
        ...TXT, fontSize: '15px', color: '#7a5028', align: 'center'
      }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: t, alpha: 1, delay: 800 + i * 400, duration: 500 });
    });

    // Botão menu
    const btn = this.add.text(cx, GAME_H - 30, '[ voltar ao menu ]', {
      ...TXT, fontSize: '18px', fontStyle: 'bold', color: '#241a1a'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setColor('#7a5028'));
    btn.on('pointerout', () => btn.setColor('#241a1a'));
    btn.on('pointerdown', () => {
      sound.uiClick();
      this.scene.start('MenuScene');
    });
    this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('MenuScene'));

    sound.victory();
    sound.startMusic('victory');
    this.cameras.main.fadeIn(600, 20, 16, 15);
  }
}
