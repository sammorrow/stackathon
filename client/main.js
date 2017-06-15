import PIXI from '../node_modules/phaser/build/custom/pixi';
import p2 from '../node_modules/phaser/build/custom/p2';
import Phaser from 'phaser';
import { GameState } from './states';


const GameState = {
  init: function(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000
  },

  preload:  function(){
    this.load.spritesheet('player', 'assets/images/vegeta.png', 49, 98)

    this.load.image('gameTiles', 'assets/images/phase-2.png')
    this.load.tilemap('level', 'assets/levels/testmap-7.json', null, Phaser.TILED_JSON);
  },

  create:  function(){
    this.map = this.add.tilemap('level');
    //join the tile images to the json data
    this.map.addTilesetImage('phase-2', 'gameTiles');
        console.log(this.map)

    this.collisionLayer = this.map.createLayer('level');


    // this.backgroundLayer = this.map.createLayer('backgroundLayer');

    this.player = this.add.sprite(2 * 48, 6 * 48, 'player')
    this.player.anchor.setTo(0.5);
    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

  },

  update:  function(){

    let facing = 'left';
    let hozMove = 160;
    let vertMove = -120;
    let jumpTimer = 0;

    this.player.body.velocity.x = 0;
    if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)){

      this.player.body.velocity.x = -hozMove;
      if (facing !== 'left'){
        facing = 'left'
      }
    } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){

      this.player.body.velocity.x = hozMove;
      if (facing !== 'right'){
        facing = 'right'
      }
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.body.onFloor() && this.time.now > jumpTimer){
      this.player.body.velocity.y = vertMove;
      jumpTimer = this.time.now + 650;
    }

    if (facing === 'left'){
      this.player.frame = 0;
    } else {
      this.player.frame = 1;
    }
  }
}

const game = new Phaser.Game(750, 500, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');


var ZPlat = ZPlat || {};

ZPlat.game = new Phaser.Game(480, 360, Phaser.AUTO);

ZPlat.game.state.add('Boot', ZPlat.BootState);
ZPlat.game.state.add('Preload', ZPlat.PreloadState);
ZPlat.game.state.add('Game', ZPlat.GameState);

ZPlat.game.state.start('Boot');
