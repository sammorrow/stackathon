import Phaser from 'phaser';

export default {
  init: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#000';
    this.game.time.advancedTiming = true;

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //physics system
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 1000;
    this.game.physics.p2.setImpactEvents(true);
    this.game.world.enableBodySleeping = true;
  },
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    this.game.input.mouse.capture = true;
    this.state.start('Preload');
  }
};
