import { enemyObj, platformObj } from '../prefabs/'
import Phaser from 'phaser';

export default {

  //custom methods
  restart: function(){
      this.game.state.start('Game')
  },

  gameOver: function(){
      this.player.kill();
      this.restart();
  },

  findObjectsByType: function(type, map, layer){
    return map.objects[layer].filter(el => {
      return el.type == type;
    });
  },

  init: function() {
    //constants
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 500;

    //gravity
    this.game.physics.arcade.gravity.y = 1000;

    //initialize groups

    this.platformPool = this.add.group();
    this.enemyPool = this.add.group();

    //cursor keys to move the player
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
  create: function() {

      let self = this
      enemyObj.Slime.prototype.update = function(){
        self.game.physics.arcade.collide(this, self.player);
    }
    //load current level
    this.loadLevel();

    //show on-screen touch controls
    // this.createOnscreenControls();
  },


  update: function() {
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    this.game.physics.arcade.collide(this.enemyPool, this.collisionLayer);
    //this.game.physics.arcade.collide(this.enemy, this.player);
    this.game.physics.arcade.collide(this.player, this.platform);

    this.player.body.velocity.x = 0;

    if(this.player.top >= this.world.height-48 || this.player.left <= 0){
      this.gameOver()
    }

    if(this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');
    }
    else if(this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');
    }
    else {
      this.player.animations.stop();
      this.player.frame = 3;
    }

    if((this.cursors.up.isDown || this.player.customParams.mustJump) && (this.player.body.blocked.down || this.player.body.touching.down)) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    }
  },
  loadLevel: function(){

    this.map = this.add.tilemap('level-one');

    //join the tile images to the json data
    this.map.addTilesetImage('goodly-2x', 'gameTiles');

    //create layers
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');
    this.skyLayer = this.map.createLayer('skyLayer');

    //send background to the back
    this.game.world.sendToBack(this.backgroundLayer);
    this.game.world.sendToBack(this.skyLayer);

    //collision layer should be collisionLayer
    this.map.setCollisionBetween(1, 160, true, 'collisionLayer');

    //resize the world to fit the layer
    this.collisionLayer.resizeWorld();

    //create player
    let playerArr = this.findObjectsByType('player', this.map, 'objectLayer')
    this.player = this.add.sprite(playerArr[0].x, playerArr[0].y, 'player', 0);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {};
    this.player.body.collideWorldBounds = true;

    //add platforms
    // this.platform = new platformObj.PlatformMedium(this.game, 400, 300, 'platform-medium')
    // this.game.add.existing(this.platform)
//this.platform.physicsEnable(this.game)

    //create enemy
    let enemyArr = this.findObjectsByType('enemy', this.map, 'objectLayer')
    enemyArr.forEach(el => {
      let newFoe = new enemyObj.Slime(this.game, el.x, el.y, 'slime', 10)
      this.game.add.existing(newFoe)
      this.enemyPool.add(newFoe)
    });

    //follow player with the camera
    this.game.camera.follow(this.player);
  }
};

  // createOnscreenControls: function(){
  //   this.leftArrow = this.add.button(20, this.game.height - 60, 'arrowButton');
  //   this.rightArrow = this.add.button(110, this.game.height - 60, 'arrowButton');
  //   this.actionButton = this.add.button(this.game.width - 100, this.game.height - 60, 'actionButton');

  //   this.leftArrow.alpha = 0.5;
  //   this.rightArrow.alpha = 0.5;
  //   this.actionButton.alpha = 0.5;

  //   this.leftArrow.fixedToCamera = true;
  //   this.rightArrow.fixedToCamera = true;
  //   this.actionButton.fixedToCamera = true;

  //   this.actionButton.events.onInputDown.add(function(){
  //     this.player.customParams.mustJump = true;
  //   }, this);

  //   this.actionButton.events.onInputUp.add(function(){
  //     this.player.customParams.mustJump = false;
  //   }, this);

  //   //left
  //   this.leftArrow.events.onInputDown.add(function(){
  //     this.player.customParams.isMovingLeft = true;
  //   }, this);

  //   this.leftArrow.events.onInputUp.add(function(){
  //     this.player.customParams.isMovingLeft = false;
  //   }, this);

  //   this.leftArrow.events.onInputOver.add(function(){
  //     this.player.customParams.isMovingLeft = true;
  //   }, this);

  //   this.leftArrow.events.onInputOut.add(function(){
  //     this.player.customParams.isMovingLeft = false;
  //   }, this);

  //   //right
  //   this.rightArrow.events.onInputDown.add(function(){
  //     this.player.customParams.isMovingRight = true;
  //   }, this);

  //   this.rightArrow.events.onInputUp.add(function(){
  //     this.player.customParams.isMovingRight = false;
  //   }, this);

  //   this.rightArrow.events.onInputOver.add(function(){
  //     this.player.customParams.isMovingRight = true;
  //   }, this);

  //   this.rightArrow.events.onInputOut.add(function(){
  //     this.player.customParams.isMovingRight = false;
  //   }, this);
  // }
