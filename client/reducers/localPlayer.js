const initialState = {  player: {} } ;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GIVE_STATE':
            return Object.assign({}, state, { player: action.player })
        default:
            return state;
    }
}

export default reducer;
