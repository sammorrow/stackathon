import Phaser from 'phaser';

let PlatformMedium = function(game, x, y, key) {
  Phaser.Sprite.call(this, game, x, y, key);
  game.physics.arcade.enable(this);
  this.collideWorldBounds = true;
  this.body.collideWorldBounds = true;
  this.body.immovable = true;
  this.body.moves = false;
}

PlatformMedium.prototype = Object.create(Phaser.Sprite.prototype);
PlatformMedium.prototype.constructor = PlatformMedium;

PlatformMedium.prototype.physicsEnable = ()  => {
  this.body.immovable = false;
  this.body.moves = true;
}

export default {
  PlatformMedium: PlatformMedium
}
