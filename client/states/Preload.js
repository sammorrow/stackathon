import Phaser from 'phaser';

//loading the game assets
export default {
  init: function(currentLevel) {
      this.LEVEL = currentLevel || null;
  },

  preload: function() {


    //load game assets
    this.load.image('goal', 'assets/images/goal.png');
    this.load.image('slime', 'assets/images/slime.png');
    this.load.image('rope', 'assets/images/rope-segment.png');
    this.load.image('hook', 'assets/images/hook.png');
    this.load.image('anchor', 'assets/images/hook.png');
    this.load.image('submit', 'assets/images/GoButton.png');


    //platforms
    this.load.image('platform-medium', 'assets/images/platform-medium.png');
    this.load.physics('sprite_physics', 'assets/physics/physics.json')

    //player
    this.load.spritesheet('player', 'assets/images/betty.png', 256, 256)
    this.load.spritesheet('stackie', 'assets/images/stackie.png', 64, 64)
    this.load.spritesheet('fly', 'assets/images/fly_spritesheet.png', 35, 18, 2, 1, 2);
    this.load.image('arrowButton', 'assets/images/arrowButton.png');
    this.load.image('actionButton', 'assets/images/actionButton.png');

    //map
    this.load.image('gameTiles', 'assets/images/goodly-2x.png');


    if (this.LEVEL === 'level-one'){
          this.load.tilemap('level-one', 'assets/levels/level-one.json', null, Phaser.Tilemap.TILED_JSON);

    } else if (this.LEVEL === 'level-two'){
          this.load.tilemap('level-two', 'assets/levels/level-seven.json', null, Phaser.Tilemap.TILED_JSON);

    } else if (this.LEVEL === 'level-four'){
          this.load.tilemap('level-four', 'assets/levels/level-eight.json', null, Phaser.Tilemap.TILED_JSON);
    }


    // this.load.tilemap('level-one', 'assets/levels/level-one.json', null, Phaser.Tilemap.TILED_JSON);
    // // this.load.tilemap('level-two', 'assets/levels/level-four.json', null, Phaser.Tilemap.TILED_JSON);
    // this.load.tilemap('level-two', 'assets/levels/level-seven.json', null, Phaser.Tilemap.TILED_JSON);
    // this.load.tilemap('level-four', 'assets/levels/level-eight.json', null, Phaser.Tilemap.TILED_JSON);
  },
  create: function() {
    this.LEVEL ? this.state.start('Game',  false, false, this.LEVEL) : this.state.start('Menu');
  }
};
