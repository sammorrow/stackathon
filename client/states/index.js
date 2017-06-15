import gameState from './Game';
import bootState from './Boot';
import preloadState from './Preload';

let StateObj = {};

StateObj.Game = gameState;
StateObj.Boot = bootState;
StateObj.Preload = preloadState;

export default StateObj;
