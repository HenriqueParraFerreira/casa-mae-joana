import Phaser from 'phaser';
import { BASE_ZOOM, DEPTH, FONT, GAME_H, GAME_W } from '../consts';

/**
 * Configura a câmera de uma cena de layout fixo para o modo alta
 * resolução: zoom 2 centrado no espaço lógico de 1280x720.
 */
export function setupHiResCamera(scene: Phaser.Scene): void {
  const cam = scene.cameras.main;
  cam.setZoom(BASE_ZOOM);
  cam.centerOn(GAME_W / 2, GAME_H / 2);
}

/** Explosão única de partículas que se autodestrói. */
export function burst(
  scene: Phaser.Scene, key: string, x: number, y: number,
  opts: { count?: number; speed?: number; lifespan?: number; gravity?: number; tint?: number[] } = {}
): void {
  const { count = 8, speed = 90, lifespan = 500, gravity = 0, tint } = opts;
  const emitter = scene.add.particles(0, 0, key, {
    speed: { min: speed * 0.4, max: speed },
    angle: { min: 0, max: 360 },
    lifespan,
    scale: { start: 0.5, end: 0 },
    gravityY: gravity,
    emitting: false,
    ...(tint ? { tint } : {})
  });
  emitter.setDepth(DEPTH.PARTICLE);
  emitter.explode(count, x, y);
  scene.time.delayedCall(lifespan + 100, () => emitter.destroy());
}

export function screenShake(scene: Phaser.Scene, intensity = 0.008, dur = 120): void {
  scene.cameras.main.shake(dur, intensity);
}

/** Flash branco curtinho de impacto. */
export function impactFlash(scene: Phaser.Scene): void {
  scene.cameras.main.flash(60, 255, 255, 255);
}

/** Balãozinho de fala pixelado que flutua e some. */
export function floatBubble(scene: Phaser.Scene, x: number, y: number, text: string): void {
  const container = makeBubble(scene, x, y, text, 0.95);
  container.setDepth(DEPTH.BUBBLE);
  scene.tweens.add({
    targets: container,
    y: y - 22,
    alpha: 0,
    delay: 500,
    duration: 700,
    ease: 'Sine.easeIn',
    onComplete: () => container.destroy()
  });
}

/** Balão de fala/placa fixo (tutoriais). */
export function makeBubble(
  scene: Phaser.Scene, x: number, y: number, text: string, alpha = 0.92, wrapWidth?: number
): Phaser.GameObjects.Container {
  const label = scene.add.text(0, 0, text, {
    fontFamily: FONT,
    fontSize: '13px',
    fontStyle: 'bold',
    color: '#3a2c22',
    align: 'center',
    // Renderiza o texto em 2x para ficar nítido com o zoom da câmera
    resolution: 2,
    ...(wrapWidth ? { wordWrap: { width: wrapWidth } } : {})
  }).setOrigin(0.5);
  const w = label.width + 16;
  const h = label.height + 12;
  const g = scene.add.graphics();
  g.fillStyle(0xfff8e8, 1);
  g.lineStyle(2, 0x3a2c22, 1);
  g.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
  g.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);
  // Rabinho do balão
  g.fillTriangle(-5, h / 2 - 1, 5, h / 2 - 1, 0, h / 2 + 7);
  g.lineBetween(-5, h / 2, 0, h / 2 + 7);
  g.lineBetween(5, h / 2, 0, h / 2 + 7);
  const container = scene.add.container(x, y, [g, label]);
  container.setAlpha(alpha);
  container.setDepth(DEPTH.BUBBLE);
  return container;
}

/** Escala base do sprite (gatos usam ART_SCALE; padrão 1). */
function baseScale(sprite: Phaser.GameObjects.Sprite): number {
  return (sprite.getData('baseScale') as number | undefined) ?? 1;
}

/** Squash & stretch de aterrissagem (relativo à escala base). */
export function landSquash(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite): void {
  const s = baseScale(sprite);
  scene.tweens.add({
    targets: sprite,
    scaleX: s * 1.25,
    scaleY: s * 0.72,
    duration: 70,
    yoyo: true,
    ease: 'Sine.easeOut',
    onComplete: () => sprite.setScale(s, s)
  });
}

/** Stretch do pulo (relativo à escala base). */
export function jumpStretch(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite): void {
  const s = baseScale(sprite);
  scene.tweens.add({
    targets: sprite,
    scaleX: s * 0.82,
    scaleY: s * 1.22,
    duration: 90,
    yoyo: true,
    ease: 'Sine.easeOut',
    onComplete: () => sprite.setScale(s, s)
  });
}

/**
 * Transição de íris circular centrada em (worldX, worldY), combinada com
 * fade. A máscara invertida requer WebGL; o fade cobre o caso Canvas.
 */
export function irisOut(scene: Phaser.Scene, worldX: number, worldY: number, onDone: () => void): void {
  const cam = scene.cameras.main;
  const sx = (worldX - cam.worldView.x) * cam.zoom;
  const sy = (worldY - cam.worldView.y) * cam.zoom;
  const cover = scene.add.graphics().setScrollFactor(0).setDepth(DEPTH.OVERLAY);
  cover.fillStyle(0x14100f, 1);
  cover.fillRect(0, 0, GAME_W, GAME_H);
  const maskG = scene.make.graphics();
  const mask = maskG.createGeometryMask();
  mask.setInvertAlpha(true);
  cover.setMask(mask);
  const state = { r: Math.max(GAME_W, GAME_H) };
  scene.tweens.add({
    targets: state,
    r: 0,
    duration: 750,
    ease: 'Sine.easeIn',
    onUpdate: () => {
      maskG.clear();
      maskG.fillStyle(0xffffff, 1);
      maskG.fillCircle(sx, sy, state.r);
    },
    onComplete: () => {
      cover.clearMask(true);
      onDone();
    }
  });
  cam.fadeOut(750, 20, 16, 15);
}

export function fadeIn(scene: Phaser.Scene): void {
  scene.cameras.main.fadeIn(500, 20, 16, 15);
}
