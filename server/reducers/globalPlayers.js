
const initialState = {  players: [],
                        playerLevelsAndPositions: {},
                        leaderboard: [
                            {time: 300, deaths: 30, name: 'xXxRoPeGoDxXx'},
                            {time: 200, deaths: 30, name: 'Sally Slugger'},
                            {time: 175, deaths: 30, name: `A dog`},
                            {time: 100, deaths: 5, name: `Nick 'Knack' Pattywack`},
                            {time: 60, deaths: 2, name: 'ROPEMASTERX'},
                            ]
                     };

//not a prob with only one other player

let newPlayersArr, newPlayersPosObj, leaderboardArr;
let position = 0;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PLAYERS':
            newPlayersArr = state.players.concat([action.player])
            state.players = newPlayersArr;
            return state;
        case 'SUBMIT_LEADERBOARD':
            state.leaderboard.forEach((el, idx) => {
               if (action.score.time < el.time) position = idx + 1;
            })
            if (position === 5){
                leaderboardArr = state.leaderboard.slice(1, 5).concat(action.score)
            } else if (position) {
                leaderboardArr = state.leaderboard.slice(1, position).concat(action.score).concat(state.leaderboard.slice(position, state.leaderboard.length))
            }

            position = 0;
            state.leaderboard = leaderboardArr;
            return state
        case 'SET_GLOBAL_POSITIONS':
            newPlayersPosObj = Object.assign({}, state.playerLevelsAndPositions, action.playerPos)
            state.playerLevelsAndPositions = newPlayersPosObj;
            return state
        default:
            return state;
    }
}

module.exports = reducer;
