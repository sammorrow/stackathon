import { enemyObj, platformObj } from '../prefabs/'
import Phaser from 'phaser';
import p2 from 'p2';

import store from '../store.js'

export default {

  //custom methods

  moveToPointer: function(obj1, speed) {
    var angle = Math.atan2(this.game.camera.y + this.game.input.y - obj1.world.y, this.game.camera.x + this.game.input.x - obj1.world.x);
    obj1.body.velocity.x = Math.cos(angle) * speed;
    obj1.body.velocity.y = Math.sin(angle) * speed;
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

  fireHook: function(){
    this.ropeBitmapData = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
    this.ropeBitmapData.ctx.strokeStyle = "#f4a460"
    this.ropeBitmapData.ctx.lineWidth = "6";
    this.line = this.game.add.sprite(0, 0, this.ropeBitmapData)

    let hook = this.hookPool.getFirstExists(false)
    if (hook){
      hook.exists = true;
      hook.lifespan = 230;
      this.game.physics.p2.enable(hook)
      hook.body.data.gravityScale = 0;
      hook.body.setRectangle(5);
      hook.body.setCollisionGroup(this.hookCollisionGroup);
      hook.body.collides([
        this.platformCollisionGroup,
        this.terrainCollisionGroup
      ])
      hook.body.onBeginContact.add(body => {
        if (body && body.sprite && body.sprite.key === "platform-medium"){
          this.setRope(body.sprite)
          hook.kill();
        }
      })
      hook.reset(this.player.world.x, this.player.world.y);
      this.currentHook = hook;
      this.moveToPointer(hook, 2000)
      setTimeout(() => {
        if (this.ropeBitmapData) this.ropeBitmapData.clear();
        this.ropeBitmapData = null;
        this.ACTIVE_HOOK = false
      }, 350)
    }
  },

  removeRope: function(){
      var allConstraints = this.game.physics.p2.world.constraints.splice(0,this.game.physics.p2.world.constraints.length);
      if (allConstraints.length > 0){
        for (let i = 0; i <= allConstraints.length; i++){
          this.game.physics.p2.removeConstraint(allConstraints[i]);
        }
      }
    if (this.ROPE_ANCHOR && this.ROPE_ANCHOR.body) this.player.body.velocity.x = this.ROPE_ANCHOR.body.velocity.x;
    this.ropeLinks.forEach(link => {
      link.kill();
    })
    this.anchors.forEach(anchor => {
      anchor.kill();
    })
    this.ropeLinks = [];
    this.anchors = [];
    this.ROPE_ANCHOR = null;
    this.player.customParams.isHooked = false;
    this.ACTIVE_HOOK = false;
    this.currentHook = null;
  },

  setRope: function(sprite){
    if (this.ropeBitmapData) this.ropeBitmapData.clear();
    this.ropeBitmapData = null;
    this.ROPE_LENGTH = (Math.sqrt(Math.pow(((sprite.world.x) - (this.player.world.x)), 2) + Math.pow(((sprite.world.y) - (this.player.world.y)), 2)))
    // let basePoint = [sprite.world.x, player.world.y];
    let sideLength;
    if (this.player.world.y > sprite.world.y) sideLength = this.player.world.y - sprite.world.y;
    else sideLength = sprite.world.y - this.player.world.y;
    this.COSINE = Math.sin(sideLength / this.ROPE_LENGTH);
    this.removeRope()
    this.createRope(sprite);
  },

  createRope: function(anchorSprite) {
    let newRect, lastRect, x, y;
    let ropeLength =  Math.floor(this.ROPE_LENGTH / 30)
    for (var i = 0; i < ropeLength; i++){
      if (anchorSprite.world.x >= this.player.world.x) x = anchorSprite.world.x - ((20 * i + 1) * this.COSINE);
      else x = anchorSprite.world.x + ((20 * i)  * this.COSINE);
      if (anchorSprite.world.y >= this.player.world.y) y = anchorSprite.world.y - ((20 * i + 1) * (this.COSINE));
      else y = anchorSprite.world.y + ((20 * i)  * (this.COSINE));
      // console.log("X", x, "Y", y)
      if (i === 0){
        newRect = this.anchorPool.getFirstExists(false)
        this.anchors.push(newRect)
      } else {
        newRect = this.ropePool.getFirstExists(false)
        this.ropeLinks.push(newRect);
      }
      newRect.exists = true;
      newRect.reset(x, y);
      this.game.physics.p2.enable(newRect, false);
      newRect.body.setCircle(20);
      newRect.body.setCollisionGroup(this.ropeCollisionGroup)
      newRect.body.collides([
        this.terrainCollisionGroup,
        ])
      if (i === 0){
        newRect.body.static = true;
        newRect.body.mass = 1;
        newRect.body.angularDamping = 1;
      } else {
        newRect.body.angularDamping = 1;
        newRect.body.mass = 1 / i;
        this.game.physics.p2.createRevoluteConstraint(newRect, [0, -10], lastRect, [0, 10], this.MAX_FORCE)
      }
      lastRect = newRect;
    }
    lastRect.body.velocity.x = this.player.body.velocity.x;
    this.player.body.velocity.x = 0;
    this.ROPE_ANCHOR = lastRect;
    this.game.physics.p2.createRevoluteConstraint(lastRect, [0, 0], this.player, [0, -20], this.MAX_FORCE)
    this.player.customParams.isHooked = true;
    this.ROPE_RESET_TIMER = Date.now();
  },

  drawRope: function(hookSprite) {
    let setDrawX = hookSprite.world.x, setDrawY = hookSprite.world.y;
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
  },


  restart: function(){
      this.game.state.start('Game')
  },

  gameOver: function(){
      this.player.kill();
      this.restart();
  },

  levelChange: function(){
     if (this.goal.properties.nextLevel === "endScreen") this.game.state.start("End screen")
     else this.game.state.start('Game', true, false, this.goal.properties.nextLevel)
  },


  findObjectsByType: function(type, map, layer){
    return map.objects[layer].filter(el => {
      return el.type == type;
    });
  },

  init: function(currentLevel) {
    this.CURRENT_LEVEL = currentLevel ? currentLevel : 'level-one';

    //constants
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 500;
    this.MAX_SPEED = 3000;
    this.AIR_ACCELERATION = 30;
    this.AIR_CONTROL = 400;
    this.FRICTION = 100;

    this.ACTIVE_HOOK = false;
    this.ROPE_LENGTH = 100;
    this.ROPE_RESET_TIMER = 0;
    this.SWINGING_SPEED = 300;

    this.MAX_FORCE = 10000;

    this.ropeTimer = 0;
    this.ropeLinks = [];
    this.anchors = [];
    this.everyTen = 0;

    //initialize groups
    this.platformPool = this.add.group();
    this.enemyPool = this.add.group();

    //cursor keys to move the player
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
  create: function() {

    this.hookPool = this.game.add.group();
    this.hookPool.createMultiple(10, 'hook', 0, false);
    this.ropePool = this.game.add.group();
    this.ropePool.createMultiple(150, 'rope', 0, false);
    this.anchorPool = this.game.add.group();
    this.anchorPool.createMultiple(10, 'anchor', 0, false);

    enemyObj.Slime.prototype.update = function(){
        this.body.velocity.x = -100;
    }

    //load current level
    this.loadLevel();

    //show on-screen touch controls
    // this.createOnscreenControls();
  },


  update: function() {
    this.game.debug.text('FPS: ' + this.game.time.fps || '--', 20, 20);

    this.everyTen++
    //multi!
    if(this.everyTen === 50){
      store.dispatch({type: "GIVE_STATE", player: [this.player.world.x, this.player.world.y]});
      this.everyTen = 0;
  }

    //rope check
      if (this.currentHook){
        this.drawRope(this.currentHook)
      }
    //speed checks
    if (this.player.body.velocity.x > this.MAX_SPEED){
      this.player.body.velocity.x = this.MAX_SPEED;
    } else if (this.player.body.velocity.x < -this.MAX_SPEED){
      this.player.body.velocity.x = -this.MAX_SPEED;
    }


    // if (this.touchingDown(this.player) && this.player.body.velocity.x - this.FRICTION > 0) this.player.body.velocity.x -= this.FRICTION;
    // else if (this.touchingDown(this.player) && this.player.body.velocity.x < 0 && this.player.body.velocity.x + this.FRICTION < 0) this.player.body.velocity.x += this.FRICTION;
    // else if (this.touchingDown(this.player)) this.player.body.velocity.x = 0;

    if(this.touchingDown(this.player)) this.player.body.velocity.x = 0;

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
    this.playerInput();
  },

  loadLevel: function(){

    this.map = this.add.tilemap(this.CURRENT_LEVEL);

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
    this.goalCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.hookCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.platformCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.terrainCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.ropeCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.tileObjects = this.game.physics.p2.convertTilemap(this.map, 'collisionLayer');

    //add platforms
    var self = this;
    this.tileObjects.forEach(tile => {
      tile.setCollisionGroup(this.terrainCollisionGroup);
      tile.collides([
        this.playerCollisionGroup, this.platformCollisionGroup,
        this.enemyCollisionGroup, this.ropeCollisionGroup,
        this.hookCollisionGroup
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
    // this.player.body.adjustCenterOfMass();
    this.player.body.setCollisionGroup(this.playerCollisionGroup);
    this.player.body.collides([
      this.terrainCollisionGroup, this.platformCollisionGroup,
      this.enemyCollisionGroup, this.goalCollisionGroup
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

    //set goal
    this.goal = this.findObjectsByType('goal', this.map, 'Object Layer 1')[0];
    this.goalPost = new Phaser.Sprite(this.game, this.goal.x, this.goal.y, 'goal');
    this.game.add.existing(this.goalPost)
    this.game.physics.p2.enable(this.goalPost);
    this.goalPost.body.kinematic = true;
    this.goalPost.body.setCollisionGroup(this.goalCollisionGroup)
    this.goalPost.body.collides([
      this.playerCollisionGroup
    ])
    this.goalPost.body.onBeginContact.add(body => {
      if (body && body.sprite && body.sprite.key === "player"){
          console.log(this.goal)
          this.levelChange()
        }
    })

    //clean-up
    this.game.physics.p2.updateBoundsCollisionGroup();
    this.game.camera.follow(this.player);

    //send background to the back
    this.game.world.sendToBack(this.backgroundLayer);
    this.game.world.sendToBack(this.skyLayer);
  },

  playerInput: function(){
    //left movement when on ground
    if ((this.cursors.left.isDown || this.player.customParams.isMovingLeft) && !this.player.customParams.isHooked && this.touchingDown(this.player)) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      // this.player.play('walking');
    //left movement when hooked
    } else if ((this.cursors.left.isDown || this.player.customParams.isMovingLeft) && this.player.customParams.isHooked) {
      this.ROPE_ANCHOR.body.velocity.x -= this.SWINGING_SPEED;
      this.player.scale.setTo(1, 1);
    //left movement in the air
    } else if ((this.cursors.left.isDown || this.player.customParams.isMovingLeft) && !this.player.customParams.isHooked && !this.touchingDown(this.player)) {
      if(Math.abs(this.player.body.velocity.x - this.AIR_ACCELERATION) < this.AIR_CONTROL) this.player.body.velocity.x -= this.AIR_ACCELERATION;

    //now for the right
    } else if ((this.cursors.right.isDown || this.player.customParams.isMovingRight) && !this.player.customParams.isHooked && this.touchingDown(this.player)) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      //this.player.play('walking');
    } else if ((this.cursors.right.isDown || this.player.customParams.isMovingRight) &&     this.player.customParams.isHooked) {
      this.ROPE_ANCHOR.body.velocity.x += this.SWINGING_SPEED;
      this.player.scale.setTo(1, 1);
    } else if ((this.cursors.right.isDown || this.player.customParams.isMovingRight) && !this.player.customParams.isHooked && !this.touchingDown(this.player)) {
      if(Math.abs(this.player.body.velocity.x + this.AIR_ACCELERATION) < this.AIR_CONTROL) this.player.body.velocity.x += this.AIR_ACCELERATION;
    } else {
      this.player.animations.stop();
      this.player.frame = 3;
    }
    if ((this.cursors.up.isDown && this.touchingDown(this.player) && !this.player.customParams.isHooked)){
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    } else if (this.ROPE_RESET_TIMER + 200 < Date.now() && !this.player.customParams.isHooked && this.input.activePointer.leftButton.isDown && !this.ACTIVE_HOOK){
      this.ACTIVE_HOOK = true;
      this.fireHook()
    } else if (this.ROPE_RESET_TIMER + 200 < Date.now() && this.player.customParams.isHooked && this.input.activePointer.leftButton.isUp){
      this.removeRope()
    }
  }
};


    // if ((this.cursors.up.isDown && this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) && (this.player.body.blocked.down || this.player.body.touching.down)){
    //   this.player.body.velocity.x = currentVelocity;
    //   this.player.body.velocity.y = -this.JUMPING_SPEED;

    // if((this.cursors.down.isDown && this.ropeTimer + this.ROPE_RESET < Date.now() && (this.ROPE_LENGTH + 6) < this.MAX_ROPE_LENGTH && this.player.customParams.isHooked)){
    //   this.ropeTimer = Date.now();
    //   this.ROPE_LENGTH += 5;
    //   this.setRope();

    // } else if ((this.cursors.up.isDown && this.ropeTimer + this.ROPE_RESET < Date.now() && (this.ROPE_LENGTH - 6) > this.MIN_ROPE_LENGTH && this.player.customParams.isHooked)){
    //   this.ropeTimer = Date.now();
    //   this.ROPE_LENGTH -= 5;
    //   this.setRope();

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
