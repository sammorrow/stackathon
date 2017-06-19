const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
// const createLogger = require('redux-logger').createLogger;
const thunkMiddleware = require('redux-thunk');
const reducer = require('./reducers');

module.exports = createStore(
  reducer
);

/*
  applyMiddleware(
    thunkMiddleware
  )

*/
