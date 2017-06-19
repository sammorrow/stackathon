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

  init: function(){
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

    this.nameText = this.game.add.text(10, 150, `Your name is: ${this.userName}`, style);
    this.errorDisplay = this.game.add.text(10, 170, ``, errorStyle)

    this.game.add.text(10, 70, 'Enter a unique name:', style)
    this.game.add.text(10, 200, 'Choose a character:', style)
    this.game.add.sprite(10, 230, 'player')
    this.game.add.sprite(80, 230, 'stackie')
    this.characterText = this.game.add.text(10, 310, `Your character is: ${this.characterName}`, style);

    this.game.add.text(300, 30, 'SUPER HOOK RACING', bigTextStyle )

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
