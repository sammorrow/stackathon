import Phaser from 'phaser';

let Slime = function(ctx, x, y, key, health) {
  Phaser.Sprite.call(this, ctx.game, x, y, key);
  this.animations.add('hit', [0, 1], 25, false)
  this.health = health;
  ctx.game.physics.p2.enable(this);

  this.body.clearShapes()
  this.body.loadPolygon('sprite_physics', 'slime');
  this.body.setCollisionGroup(ctx.enemyCollisionGroup);
  this.body.collides([
    ctx.terrainCollisionGroup,
    ctx.playerCollisionGroup,
    ctx.enemyCollisionGroup,
    ctx.platformCollisionGroup
  ]);
  this.body.collideWorldBounds = true;
  this.value = 5;
}

Slime.prototype = Object.create(Phaser.Sprite.prototype);
Slime.prototype.constructor = Slime;
export default {Slime: Slime}
