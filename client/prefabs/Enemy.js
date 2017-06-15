import Phaser from 'phaser';

let Slime = function(game, x, y, key, health) {
  Phaser.Sprite.call(this, game, x, y, key);
  this.animations.add('hit', [0, 1], 25, false)
  this.health = health;
  game.physics.arcade.enable(this);
  this.body.bounce.x = 1
  this.body.velocity.x = 100;
  this.body.collideWorldBounds = true;
}

Slime.prototype = Object.create(Phaser.Sprite.prototype);
Slime.prototype.constructor = Slime;

Slime.prototype.physicsEnable = game => {
  this.enableBody = true;
  game.physics.arcade.enable(this)
}

export default {Slime: Slime}
