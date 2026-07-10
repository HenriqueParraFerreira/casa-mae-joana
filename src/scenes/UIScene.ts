import Phaser from 'phaser';
import { CAT_KINDS, CAT_NAMES, EV, FONT, GAME_W, type CatKind } from '../consts';
import { bus } from '../events';
import { sound } from '../audio/SoundEngine';
import { setupHiResCamera } from '../systems/Effects';
import { createTouchControls, isTouchDevice } from '../systems/TouchControls';

interface Portrait {
  frame: Phaser.GameObjects.Graphics;
  img: Phaser.GameObjects.Image;
  name: Phaser.GameObjects.Text;
  kind: CatKind;
}

/** HUD paralelo: retratos dos 3 gatos (ativo em destaque), mudo e título. */
export class UIScene extends Phaser.Scene {
  private portraits: Portrait[] = [];
  private muteBtn!: Phaser.GameObjects.Image;

  constructor() {
    super('UIScene');
  }

  create(data: { levelId: number; levelName: string }): void {
    setupHiResCamera(this);
    // A cena é reutilizada entre fases: sempre recomeça com retratos novos
    this.portraits = [];
    CAT_KINDS.forEach((kind, i) => {
      const x = 42 + i * 78;
      const y = 44;
      const frame = this.add.graphics();
      const img = this.add.image(x, y, `portrait-${kind}`);
      img.setInteractive({ useHandCursor: true });
      img.on('pointerdown', () => {
        sound.uiClick();
        bus.emit(EV.REQUEST_SWITCH, i);
      });
      const name = this.add.text(x, y + 36, `${i + 1} ${CAT_NAMES[kind]}`, {
        fontFamily: FONT, fontSize: '12px', fontStyle: 'bold', color: '#fff8e8', resolution: 2
      }).setOrigin(0.5);
      this.portraits.push({ frame, img, name, kind });
    });
    this.highlight('mia');

    // Botão de mudo
    this.muteBtn = this.add.image(GAME_W - 36, 36, sound.muted ? 'spk-off' : 'spk-on')
      .setScale(0.8)
      .setInteractive({ useHandCursor: true });
    this.muteBtn.on('pointerdown', () => {
      sound.unlock();
      bus.emit(EV.MUTE_CHANGED, sound.toggleMute());
    });

    // Botão de pausa (essencial no touch; inofensivo no desktop)
    const pauseBtn = this.add.text(GAME_W - 88, 36, '❚❚', {
      fontFamily: FONT, fontSize: '22px', fontStyle: 'bold', color: '#fff8e8',
      stroke: '#241a1a', strokeThickness: 4, resolution: 2
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    pauseBtn.on('pointerdown', () => {
      sound.uiClick();
      this.scene.launch('PauseScene', { level: data.levelId });
      this.scene.pause('GameScene');
    });

    // Controles de toque (só em tablets/celulares)
    if (isTouchDevice(this)) createTouchControls(this);

    // Nome da fase (some sozinho)
    const title = this.add.text(GAME_W / 2, 60, `Fase ${data.levelId} — ${data.levelName}`, {
      fontFamily: FONT, fontSize: '26px', fontStyle: 'bold', color: '#fff8e8',
      stroke: '#241a1a', strokeThickness: 5, resolution: 2
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, alpha: 0, delay: 2600, duration: 700 });

    const onSwitch = (kind: CatKind): void => this.highlight(kind);
    const onMute = (muted: boolean): void => {
      this.muteBtn.setTexture(muted ? 'spk-off' : 'spk-on');
    };
    bus.on(EV.CAT_SWITCHED, onSwitch);
    bus.on(EV.MUTE_CHANGED, onMute);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      bus.off(EV.CAT_SWITCHED, onSwitch);
      bus.off(EV.MUTE_CHANGED, onMute);
    });
  }

  private highlight(kind: CatKind): void {
    for (const p of this.portraits) {
      const active = p.kind === kind;
      p.frame.clear();
      p.frame.fillStyle(active ? 0xd9a03a : 0x3a2c22, active ? 0.95 : 0.6);
      p.frame.lineStyle(3, active ? 0xffe08a : 0x241a1a, 1);
      const size = active ? 66 : 56;
      p.frame.fillRoundedRect(p.img.x - size / 2, p.img.y - size / 2, size, size, 10);
      p.frame.strokeRoundedRect(p.img.x - size / 2, p.img.y - size / 2, size, size, 10);
      p.img.setScale(active ? 1.05 : 0.85);
      p.img.setAlpha(active ? 1 : 0.85);
      p.name.setColor(active ? '#ffe08a' : '#fff8e8');
    }
  }
}
