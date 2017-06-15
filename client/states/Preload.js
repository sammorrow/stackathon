import Phaser from 'phaser';

//loading the game assets
export default {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('goal', 'assets/images/goal.png');
    this.load.image('slime', 'assets/images/slime.png');
    this.load.spritesheet('player', 'assets/images/vegeta-small.png', 32, 64)
    this.load.spritesheet('fly', 'assets/images/fly_spritesheet.png', 35, 18, 2, 1, 2);
    this.load.image('arrowButton', 'assets/images/arrowButton.png');
    this.load.image('actionButton', 'assets/images/actionButton.png');

    // this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');
    this.load.image('gameTiles', 'assets/images/goodly-2x.png');

    // this.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level1', 'assets/levels/testmap-5.json', null, Phaser.Tilemap.TILED_JSON);



  },
  create: function() {
    this.state.start('Game');
  }
};
