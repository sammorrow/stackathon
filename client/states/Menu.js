import '/home/sam/stackathon/node_modules/phaser-input/build/phaser-input.js';
import Phaser from 'phaser'
import '../eventemitter';
import store from '../store'

window.gameEmitter = new window.EventEmitter();

let style = {font: '14px Arial', fill: '#fff'};
let errorStyle = {font: '14px bold Arial', fill: '#fff'};
let bigTextStyle = {font: '30px bold Arial', fill: '#fff'};

export default {
  onSubmit: function(){
    let noSpaces = this.inputField.value.split("").filter(el => {
      if (el !== " "){
        return el
      }
    })
    if (typeof this.inputField.value === "string" && noSpaces.length && this.inputField.value.length < 9){
      window.gameEmitter.emit("sendPlayerInfo", this.inputField.value, this.characterName)
      setTimeout(()=> {
        if (store.getState().localPlayerReducer.playerName === this.inputField.value) this.userName = store.getState().localPlayerReducer.playerName
        else this.errorMessage = 'Someone took your name. Pick another one.'
      }, 1000)
    } else {
      this.errorMessage = 'Please enter a valid name (includes characters, under 9 characters long)'
    }
  },

  startGame: function(){
    window.startTime = this.game.time.now;
    window.currentDeaths = 0;
    this.state.start('Preload', true, true, 'level-one');
  },

  stackieClick: function(){
    this.characterText.text = "Stackie is locked. Beat the secret level to unlock!"
  },

  bettyClick: function(){
    this.characterText.text = "You have selected: Betty."
  },

  toggleMobile: function(){
    window.mobileOn = !window.mobileOn
    if (window.mobileOn) this.mobileModeIndicator.text = "Mobile mode is on.";
    else this.mobileModeIndicator.text = "Mobile mode is off.";
  },

  toggleFullscreen: function(){
    if (this.scale.scaleMode === Phaser.ScaleManager.NO_SCALE) this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    else this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;

  },

  init: function(){
    window.mobileOn = false;
    this.userName = ''
    this.characterName = 'Betty'
    this.errorMessage = ''
    this.TIME_TO_GO = false;
    this.game.add.plugin(PhaserInput.Plugin);
  },

  create: function(){
    this.inputField = this.game.add.inputField(10, 90, {
      placeHolder: 'Your name...',

    });
    this.game.add.button(10, 110, 'submit', this.onSubmit, this, 0, 0, 0, 0);

    this.game.add.button(700, 10, 'submit', this.toggleMobile, this, 0, 0, 0, 0);
    this.mobileModeIndicator = this.game.add.text(700, 50, 'Mobile mode is off.', style)

    this.game.add.button(700, 100, 'submit', this.toggleFullscreen, this, 0, 0, 0, 0);
    this.game.add.text(700, 150, 'Toggle fullscreen.', style)


    this.nameText = this.game.add.text(10, 150, `Your name is: ${this.userName}`, style);
    this.errorDisplay = this.game.add.text(10, 170, ``, errorStyle)

    this.game.add.text(10, 70, 'Enter a unique name:', style)
    this.game.add.text(10, 200, 'Choose a character:', style)
    this.betty = this.game.add.sprite(10, 230, 'player')
    this.stackie = this.game.add.sprite(80, 230, 'stackie')
    this.characterText = this.game.add.text(10, 310, `You have selected: ${this.characterName}`, style);
    this.stackie.inputEnabled = true;
    this.stackie.events.onInputDown.add(this.stackieClick, this);
    this.betty.inputEnabled = true;
    this.betty.events.onInputDown.add(this.bettyClick, this);

    this.game.add.text(300, 30, 'SUPER HOOK RACING', bigTextStyle )

    this.game.add.text(200, 150, `Rules: Get to the finish!\nArrow keys to move, mouse down to launch a hook, mouse up to release.\nYou can swing while on the hook with the arrow keys as well.`, style)


  },
  update: function(){
    if (this.userName && !this.TIME_TO_GO){
      this.TIME_TO_GO = true;
      this.game.add.text(300, 270, `Let's get racin'!!!`, bigTextStyle)
      this.game.add.button(300, 300, 'submit', this.startGame, this, 0, 0, 0, 0);
    }

    if (this.userName){
      this.nameText.text = `Your name is: ${this.userName}`
    }
    if (this.errorMessage) this.errorDisplay.text = this.errorMessage
    else this.errorDisplay.text = ''
  },

}


//    this.state.start('Game', true, false, 'level-one');
