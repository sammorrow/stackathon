const initialState = {  player: {},
                        playerName: '' } ;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PLAYER':
            return Object.assign({}, state, { playerName: action.playerName })
        case 'GIVE_STATE':
            return Object.assign({}, state, { player: action.player })
        default:
            return state;
    }
}

export default reducer;
