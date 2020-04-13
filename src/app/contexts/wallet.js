import React, { createContext, useReducer } from 'react';


const initialState = {
    networkId           : 0,

    allReady            : false,

    // Connected Wallet
    connectedType       : '', // Wallet Connected if not Empty
    connectedAddress    : '',
    connectedName       : '',
    connectedBalance    : 0,
};
export const WalletContext = createContext(initialState);

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
                allReady         : false,
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

const WalletContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(WalletReducer, initialState);
    return (
        <WalletContext.Provider value={[state, dispatch]}>
            {children}
        </WalletContext.Provider>
    )
};

export default WalletContextProvider;
