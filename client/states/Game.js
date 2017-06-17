import { enemyObj, platformObj } from '../prefabs/'
import Phaser from 'phaser';
import p2 from 'p2';

export default {

  //custom methods
  removeRope(full){
    this.game.physics.p2.removeSpring(this.rope);
    if (full){
      this.player.customParams.isHooked = false;
      this.rope = null;
    }
    if (this.ropeBitmapData){
      this.ropeBitmapData.clear();
      this.ropeBitmapData = null;
    }
  },
  setRope: function(sprite, x, y){
    this.removeRope()
    this.createRope(sprite, x, y);
    //this.drawRope(this.anchoredSprite)
    console.log(this.ROPE_LENGTH)
  },
  touchingDown: function(sprite) {
    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;
    for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {        var c = this.game.physics.p2.world.narrowphase.contactEquations[i];
      // cycles through all the contactEquations until it finds our "sprite"
      if (c.bodyA === sprite.body.data || c.bodyB === sprite.body.data){
        var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
        if (c.bodyA === sprite.body.data) d *= -1;
        if (d > 0.5) result = true;
      }
    }
    return result;
  },

  createRope: function(anchorSprite, targetX, targetY) {
      // Add bitmap data to draw the rope
      if (anchorSprite){
        this.anchoredSprite = anchorSprite
      }
      if (targetX){
        this.ropeAnchorX = -(targetX);
        this.ropeAnchorY = -(targetY);
      }
      this.ropeBitmapData = this.game.add.bitmapData(this.game.world.width, this.game.world.height);

      this.ropeBitmapData.ctx.beginPath();
      this.ropeBitmapData.ctx.lineWidth = "4";
      this.ropeBitmapData.ctx.strokeStyle = "#000000";
      this.ropeBitmapData.ctx.stroke();

      // Create a new sprite using the bitmap data
      this.line = this.game.add.sprite(0, 0, this.ropeBitmapData);
      // Keep track of where the rope is anchored
      // Create a spring between the player and block to act as the rope
      this.rope = this.game.physics.p2.createSpring(
          this.anchoredSprite,  // sprite 1
          this.player, // sprite 2
          this.ROPE_LENGTH, // length of the rope
          100,        // stiffness
          100,         // damping
          [this.ropeAnchorX, this.ropeAnchorY]

      );
      this.player.customParams.isHooked = true;
      // Draw a line from the player to the platform to visually represent the spring
      this.line = new Phaser.Line(
          this.player.x, this.player.y,
          this.ropeAnchorX, this.ropeAnchorY);
  },

    drawRope: function(anchorSprite) {
      if (anchorSprite){
        let setDrawX = anchorSprite.world.x, setDrawY = anchorSprite.world.y;
        if (this.ropeBitmapData){
        // Change the bitmap data to reflect the new rope position
          this.ropeBitmapData.clear();
          this.ropeBitmapData.ctx.beginPath();
          this.ropeBitmapData.ctx.moveTo(this.player.x, this.player.y);
          this.ropeBitmapData.ctx.lineTo(setDrawX, setDrawY);
          this.ropeBitmapData.ctx.lineWidth = 4;
          this.ropeBitmapData.ctx.stroke();
          this.ropeBitmapData.ctx.closePath();
          this.ropeBitmapData.render();
        }
      }
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
    this.MAX_SPEED = 500;
    this.ROPE_LENGTH = 100;
    this.MAX_ROPE_LENGTH = 200;
    this.MIN_ROPE_LENGTH = 75;
    this.ROPE_RESET = 300;

    this.ropeTimer = 0;
    //initialize groups
    this.platformPool = this.add.group();
    this.enemyPool = this.add.group();

    //cursor keys to move the player
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
  create: function() {

      let self = this
      enemyObj.Slime.prototype.update = function(){
        this.body.velocity.x = 100;
    }
    //  platformObj.PlatformMedium.prototype.update = function(){
    //     this.body.velocity.y = 0;
    // }
    //load current level
    this.loadLevel();

    //show on-screen touch controls
    // this.createOnscreenControls();
  },


  update: function() {
    this.drawRope(this.anchoredSprite);
    this.game.debug.text('FPS: ' + this.game.time.fps || '--', 20, 20);

    //rope check
      //break rope here!
    //speed checks
    if (this.player.body.velocity.x > this.MAX_SPEED){
      this.player.body.velocity.x = this.MAX_SPEED;
    } else if (this.player.body.velocity.x < -this.MAX_SPEED){
      this.player.body.velocity.x = -this.MAX_SPEED;
    }

    this.game.physics.arcade.collide(this.player, this.platform);
    this.player.body.velocity.x = 0;

    this.enemyPool.forEach(enemy => {
      if(enemy.top >= this.world.height - 42){
        enemy.kill()
      }
    });

    this.platformPool.forEach(platform => {
      if(platform.top >= this.world.height - 42){
        platform.kill()
      }
    });

    if(this.player.top >= this.world.height - 42){
      this.gameOver()
    }

    if(this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');
    } else if(this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');
    } else {
      this.player.animations.stop();
      this.player.frame = 3;
    }

    // if ((this.cursors.up.isDown && this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) && (this.player.body.blocked.down || this.player.body.touching.down)){
    //   this.player.body.velocity.x = currentVelocity;
    //   this.player.body.velocity.y = -this.JUMPING_SPEED;

    if((this.cursors.down.isDown && this.ropeTimer + this.ROPE_RESET < Date.now() && (this.ROPE_LENGTH + 6) < this.MAX_ROPE_LENGTH && this.player.customParams.isHooked)){
      this.ropeTimer = Date.now();
      this.ROPE_LENGTH += 5;
      this.setRope();

    } else if ((this.cursors.up.isDown && this.ropeTimer + this.ROPE_RESET < Date.now() && (this.ROPE_LENGTH - 6) > this.MIN_ROPE_LENGTH && this.player.customParams.isHooked)){
      this.ropeTimer = Date.now();
      this.ROPE_LENGTH -= 5;
      this.setRope();
    } else if ((this.cursors.up.isDown && this.touchingDown(this.player) && !this.player.customParams.isHooked)){
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    } else if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      this.removeRope("full")
    }
  },

  loadLevel: function(){

    this.map = this.add.tilemap('level-one');

    //join the tile images to the json data
    this.map.addTilesetImage('goodly-2x', 'gameTiles');
    this.map.setCollisionBetween(1, 100);


    //create layers
    this.skyLayer = this.map.createLayer('skyLayer');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.collisionLayer = this.map.createLayer('collisionLayer');
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);

    //collision layer should be collisionLayer
    this.map.setCollisionBetween(1, 160, true, 'collisionLayer');


    //create collision groups
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.platformCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.terrainCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.tileObjects = this.game.physics.p2.convertTilemap(this.map, 'collisionLayer');

    //add platforms
    var self = this;
    this.tileObjects.forEach(tile => {
      tile.setCollisionGroup(this.terrainCollisionGroup);
      tile.collides([
        this.playerCollisionGroup, this.platformCollisionGroup,
        this.enemyCollisionGroup
        ]);
    })
    //resize the world to fit the layer
    this.collisionLayer.resizeWorld();

    //create player
    let playerArr = this.findObjectsByType('player', this.map, 'Object Layer 1')
    this.player = this.add.sprite(playerArr[0].x, playerArr[0].y, 'player', 0);
    // this.player.animations.add('walking', [0, 1], 6, true);
    this.game.physics.p2.enable(this.player);
    this.player.body.clearShapes();
    this.player.body.loadPolygon('sprite_physics', 'betty');
    this.player.body.adjustCenterOfMass();
    this.player.body.setCollisionGroup(this.playerCollisionGroup);
    this.player.body.collides([
      this.terrainCollisionGroup, this.platformCollisionGroup,
      this.enemyCollisionGroup
    ])
    this.player.customParams = {isHooked: false};
    this.player.body.collideWorldBounds = true;

    //create platforms
    let platformArr = this.findObjectsByType('platform', this.map, 'Object Layer 1')
    platformArr.forEach(el => {
      let platform = new platformObj.PlatformMedium(self, +el.x, +el.y, 'platform-medium')
      this.game.add.existing(platform)
      this.platformPool.add(platform)
    });

    this.platform = new platformObj.PlatformMedium(self, 100, 100, 'platform-medium')
    this.game.add.existing(this.platform);
    this.platformPool.add(this.platform);

    //create enemies
    let enemyArr = this.findObjectsByType('enemy', this.map, 'Object Layer 1')
    enemyArr.forEach(el => {
      let newFoe = new enemyObj.Slime(this, el.x, el.y, 'slime', 10)
      this.game.add.existing(newFoe)
      this.enemyPool.add(newFoe)
    });

    //clean-up
    this.game.physics.p2.updateBoundsCollisionGroup();
    this.game.camera.follow(this.player);
    // this.createRope(this.platform, this.platform.world.x, this.platform.world.y + this.platform.height);
    //send background to the back
    this.game.world.sendToBack(this.backgroundLayer);
    this.game.world.sendToBack(this.skyLayer);
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
