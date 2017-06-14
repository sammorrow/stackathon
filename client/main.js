import PIXI from '../node_modules/phaser/build/custom/pixi';
import p2 from '../node_modules/phaser/build/custom/p2';
import Phaser from 'phaser';

(function(Phaser) {

  var game = new Phaser.Game(
    750, 500,
    Phaser.AUTO,
    'game',
    {
      preload: preload,
      create: create,
      update: update
    }
  )


  let player;

  let facing = 'left';
  let hozMove = 160;
  let vertMove = -120;
  let jumpTimer = 0;

  function preload(){
    game.load.spritesheet('player', 'assets/images/vegeta.png', 49, 98)
  }

  function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#FFFFFF';

    player = game.add.sprite(2 * 48, 6 * 48, 'player')
    game.physics.enable(player);
    player.body.gravity.y = 100;
    player.body.collideWorldBounds = true;

  }
  function update(){
    player.body.velocity.x = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){

      player.body.velocity.x = -hozMove;
      if (facing !== 'left'){
        facing = 'left'
      }
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){

      player.body.velocity.x = hozMove;
      if (facing !== 'right'){
        facing = 'right'
      }
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && player.body.onFloor() && game.time.now > jumpTimer){
      player.body.velocity.y = vertMove;
      jumpTimer = game.time.now + 650;
    }

    if (facing === 'left'){
      player.frame = 0;
    } else {
      player.frame = 1;
    }
  }

}(Phaser));
