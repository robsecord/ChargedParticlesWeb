import React, { createContext, useReducer } from 'react';
import NetworkReducer from './network.reducer'


const initialState = {
    // networkId: 0,
    // isNetworkConnected: false,
    // networkErrors: [],
    // connectionState: {},
};

const NetworkStore = ({children}) => {
    const [state, dispatch] = useReducer(NetworkReducer, initialState);
    return (
        <NetworkContext.Provider value={[state, dispatch]}>
            {children}
        </NetworkContext.Provider>
    )
};

export const NetworkContext = createContext(initialState);
export default NetworkStore;
