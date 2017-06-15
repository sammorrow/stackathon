import PIXI from '../node_modules/phaser/build/custom/pixi';
import p2 from '../node_modules/phaser/build/custom/p2';
import Phaser from 'phaser';
import ZPlat from './states';

ZPlat.game = new Phaser.Game(480, 360, Phaser.AUTO);

ZPlat.game.state.add('Boot', ZPlat.Boot);
ZPlat.game.state.add('Preload', ZPlat.Preload);
ZPlat.game.state.add('Game', ZPlat.Game);

ZPlat.game.state.start('Boot');
