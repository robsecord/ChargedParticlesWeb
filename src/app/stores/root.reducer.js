
const RootReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_WALLET_MODAL':
            return {
                ...state,
                showConnectWalletModal: action.payload
            };
        case 'CONNECTION_STATE':
            return {
                ...state,
                connectionState: action.payload
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
        case 'UPDATE_CREATION_DATA':
            return {
                ...state,
                createParticleData : {
                    ...state.createParticleData,
                    ...action.payload
                },
            };
        case 'CLEAR_CREATION_DATA':
            return {
                ...state,
                createParticleData : {},
            };
        default:
            return state;
    }
};

export default RootReducer;
