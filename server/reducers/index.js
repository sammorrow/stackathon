const combineReducers = require('redux').combineReducers

const globalPlayersReducer = require("./globalPlayers")

module.exports = combineReducers({ globalPlayersReducer });
