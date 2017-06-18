const initialState = {  players: {} } ;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_PLAYERS':
            return Object.assign({}, state, { players: action.players })
        default:
            return state;
    }
}

export default reducer;
