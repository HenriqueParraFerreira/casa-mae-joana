import type Phaser from 'phaser';
import { Critter } from './Critter';

export class Rat extends Critter {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'rat');
    this.body.setSize(32, 22);
  }
}
