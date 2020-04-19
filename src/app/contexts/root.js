// Frameworks
import React, { createContext, useContext, useReducer } from 'react';


const initialState = {
    showConnectWalletModal: false,

    createParticleData: {},

    errors: null
};
export const RootContext = createContext(initialState);

export function useRootContext() {
    return useContext(RootContext);
}


const RootReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_WALLET_MODAL':
            return {
                ...state,
                showConnectWalletModal: action.payload
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

export default function Provider({children}) {
    const [state, dispatch] = useReducer(RootReducer, initialState);
    return (
        <RootContext.Provider value={[state, dispatch]}>
            {children}
        </RootContext.Provider>
    )
}

