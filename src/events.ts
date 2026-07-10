import Phaser from 'phaser';

/** Barramento de eventos compartilhado entre cenas (GameScene <-> UIScene). */
export const bus = new Phaser.Events.EventEmitter();
