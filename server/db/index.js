const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/superhookrace');

const Leaderboard = db.define('leaderboard', {
    name: {
      type: Sequelize.STRING
    },
    score: {
        type: Sequelize.STRING
    },
    deaths: {
        type: Sequelize.STRING
    },

});

module.exports = {
    Leaderboard
};
