import Phaser from 'phaser';

export default {
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

  createObjects: function(objectName) {
    // Create a group to hold the collision shapes
    var objects = this.game.add.group();
    objects.enableBody = true;
    objects.physicsBodyType = Phaser.Physics.P2JS;
    objects.createMultiple(40, objectName);

    objects.forEach(function(child){
        child.body.clearShapes();
        child.body.loadPolygon('sprite_physics', objectName);
    }, this);
    return objects;
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
