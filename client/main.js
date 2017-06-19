import PIXI from '../node_modules/phaser/build/custom/pixi';
import p2 from '../node_modules/phaser/build/custom/p2';
import Phaser from 'phaser';
import gameObj from './states';
import store from './store'
import 'index'

// Here is our constructor function, available globally (set to the window object!)

let socket;
socket = io(window.location.origin);
socket.on('connect', function () {
    console.log('I have made a persistent two-way connection to the server!');
});

socket.on('nameConfirm', (playerName) => {
  console.log(playerName)
  store.dispatch({type: 'SET_PLAYER', playerName})
});

socket.on('sendNetworkInfo', (activePlayers, playerData) => {
  store.dispatch({type: 'GET_PLAYERS', players: activePlayers});
  store.dispatch({type: 'GET_STATE', playerLevelAndPositions: playerData});

});

window.gameEmitter.on('sendPlayerPos', function(payload){
  socket.emit("sendPlayerPos", payload)
});

window.gameEmitter.on('sendPlayerInfo', function(nameStr){
  socket.emit("sendPlayerInfo", nameStr)
});

window.gameEmitter.on('finalScore', function(score){
  socket.emit("sendScore", score)
});


let Platformer = {};

Platformer.game = new Phaser.Game(900, 500, Phaser.AUTO, 'game');

Platformer.game.state.add('Boot', gameObj.Boot);
Platformer.game.state.add('Preload', gameObj.Preload);
Platformer.game.state.add('Menu', gameObj.Menu);
Platformer.game.state.add('Game', gameObj.Game);
Platformer.game.state.add('End', gameObj.End);

Platformer.game.state.start('Boot');
