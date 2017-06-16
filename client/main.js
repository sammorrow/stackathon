import PIXI from '../node_modules/phaser/build/custom/pixi';
import p2 from '../node_modules/phaser/build/custom/p2';
import Phaser from 'phaser';
import gameObj from './states';

let Platformer = {};

Platformer.game = new Phaser.Game(620, 360, Phaser.AUTO);

Platformer.game.state.add('Boot', gameObj.Boot);
Platformer.game.state.add('Preload', gameObj.Preload);
Platformer.game.state.add('Game', gameObj.Game);
Platformer.game.state.start('Boot');
