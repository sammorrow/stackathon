const initialState = {  players: [],
                        playerLevelAndPositions: {}
                     } ;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_PLAYERS':
            state.players = action.players;
            return state
        case 'GET_STATE':
            state.playerLevelAndPositions = action.playerLevelAndPositions;
            return state
        default:
            return state;
    }
}

export default reducer;
