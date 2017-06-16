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
    this.inputEnabled = true;
    this.events.onInputDown.add(() => {
      ctx.setRope(this, this.world.x, this.world.y)
    });
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
