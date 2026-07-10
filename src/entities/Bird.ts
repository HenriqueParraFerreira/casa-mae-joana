import type Phaser from 'phaser';
import { Critter } from './Critter';

export class Bird extends Critter {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bird');
    this.body.setSize(28, 24);
  }
}
