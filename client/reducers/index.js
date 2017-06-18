import { combineReducers } from 'redux';

import localPlayerReducer from "./localPlayer"
import networkPlayersReducer from "./networkPlayers"

export default combineReducers({ localPlayerReducer, networkPlayersReducer });
