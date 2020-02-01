
const RootReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACCELERATOR_TAB':
            return {
                ...state,
                acceleratorTab: action.payload
            };
        default:
            return state;
    }
};

export default RootReducer;
