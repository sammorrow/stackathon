'use strict';
const socketio = require('socket.io');
const express = require('express');
const volleyball = require('volleyball');
const path = require('path');
const store = require('./store');

const app = express();

var server = app.listen(3000, function () {
  console.log('Server listening on port', 3000);
});


var io = socketio(server);

io.on('connection', function (socket) {
    console.log('A new client has connected!');
    socket.on('disconnect', function () {
      console.log('A client has left. What a shame');
    });
    socket.on("sendPlayerPos", function(payload){
      console.log(payload)
      store.dispatch({type: 'SET_GLOBAL_POSITIONS', playerPos: payload})
      console.log(store.getState())
      socket.broadcast.emit('sendNetworkInfo',  store.getState().globalPlayersReducer.players, store.getState().globalPlayersReducer.playerLevelsAndPositions);
    });
    socket.on("sendPlayerInfo", function(nameStr){
      console.log("nameStr", store.getState().globalPlayersReducer)
      if (store.getState().globalPlayersReducer.players && !store.getState().globalPlayersReducer.players.includes(nameStr)){
        store.dispatch({type: 'SET_PLAYERS', player: nameStr})
        socket.emit('nameConfirm', nameStr);
      }
    });
      socket.on("sendScore", score => {
        store.dispatch({type: 'SUBMIT_LEADERBOARD', score})
      });

});

app.get('/leaderboard', (req, res, next) => {
  res.send(store.getState().globalPlayersReducer.leaderboard)
})

app.use(volleyball);
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.static(path.join(__dirname, '..', 'node_modules')))

app.use(express.static(__dirname));

app.get("/", (req, res, next) => {
  res.sendFile("/home/sam/stackathon/client/index.html")
})

app.get("*", (req, res, next) => {
  res.sendFile("/home/sam/stackathon/client/index.html")
})
