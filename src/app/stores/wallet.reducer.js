
const WalletReducer = (state, action) => {
    switch (action.type) {
        case 'ALL_READY':
            return {
                ...state,
                allReady: action.payload
            };
        case 'CONNECTED_ACCOUNT':
            return {
                ...state,
                networkId        : action.payload.networkId,
                connectedType    : action.payload.type,
                connectedAddress : action.payload.address,
                connectedName    : action.payload.name,
                connectedBalance : action.payload.balance,
            };
        case 'LOGOUT':
            return {
                ...state,
                networkId        : 0,
                connectedType    : '',
                connectedAddress : '',
                connectedName    : '',
                connectedBalance : 0,
            };
        default:
            return state;
    }
};

export default WalletReducer;
