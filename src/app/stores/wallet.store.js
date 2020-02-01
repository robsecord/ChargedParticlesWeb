import React, { createContext, useReducer } from 'react';
import WalletReducer from './wallet.reducer';


const initialState = {
    networkId           : 0,

    allReady            : false,

    // Connected Wallet
    connectedType       : '', // Wallet Connected if not Empty
    connectedAddress    : '',
    connectedName       : '',
    connectedBalance    : 0,
};

const WalletStore = ({children}) => {
    const [state, dispatch] = useReducer(WalletReducer, initialState);
    return (
        <WalletContext.Provider value={[state, dispatch]}>
            {children}
        </WalletContext.Provider>
    )
};

export const WalletContext = createContext(initialState);
export default WalletStore;
