import Phaser from 'phaser';

let PlatformMedium = function(ctx, x, y, key) {
  Phaser.Sprite.call(this, ctx.game, x, y, key);
  ctx.game.physics.p2.enable(this);
  this.body.clearShapes()
  this.body.loadPolygon('sprite_physics', 'platform-medium');
  this.body.setCollisionGroup(ctx.platformCollisionGroup);
  this.body.collides([
    ctx.terrainCollisionGroup,
    ctx.playerCollisionGroup,
    ctx.enemyCollisionGroup,
    ctx.platformCollisionGroup
    ]);
  this.body.collideWorldBounds = true;
  this.body.data.gravityScale = 0;
  this.body.kinematic = true;
  this.body.mass = 4;
  this.inputEnabled = true;
  this.events.onInputDown.add(() => {
    ctx.setRope(this, this.world.x, this.world.y)
    // this.body.velocity.y = 10;
    // setTimeout(fastFall.bind(this), 5000)
  });

}

function fastFall(){
  this.body.velocity.y = 1000;
}
PlatformMedium.prototype = Object.create(Phaser.Sprite.prototype);
PlatformMedium.prototype.constructor = PlatformMedium;

// PlatformMedium.prototype.physicsEnable = function(){
//   this.body.immovable = false;
//   this.body.moves = true;
// }

export default {
  PlatformMedium: PlatformMedium
}
