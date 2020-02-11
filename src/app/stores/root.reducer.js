
const RootReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACCELERATOR_TAB':
            return {
                ...state,
                acceleratorTab: action.payload
            };
        case 'CONNECTION_WARNING':
            return {
                ...state,
                connectionWarning: action.payload
            };
        case 'CONNECTED_NETWORK':
            return {
                ...state,
                networkId          : action.payload.networkId,
                isNetworkConnected : action.payload.isNetworkConnected,
                networkErrors      : action.payload.networkErrors,
            };
        case 'DISCONNECTED_NETWORK':
            return {
                ...state,
                isNetworkConnected : action.payload.isNetworkConnected,
                networkErrors      : action.payload.networkErrors,
            };
        default:
            return state;
    }
};

export default RootReducer;
