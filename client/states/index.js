import gameState from './Game';
import bootState from './Boot';
import preloadState from './Preload';
import menuState from './Menu';
import endState from './End'

let StateObj = {};

StateObj.Game = gameState;
StateObj.Boot = bootState;
StateObj.Preload = preloadState;
StateObj.Menu = menuState;
StateObj.End = endState;


export default StateObj;
