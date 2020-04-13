import React, { createContext, useReducer } from 'react';


const initialState = {
    // networkId: 0,
    // isNetworkConnected: false,
    // networkErrors: [],
    // connectionState: {},
};
export const NetworkContext = createContext(initialState);

const NetworkReducer = (state, action) => {
    switch (action.type) {

        default:
            return state;
    }
};

const NetworkContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(NetworkReducer, initialState);
    return (
        <NetworkContext.Provider value={[state, dispatch]}>
            {children}
        </NetworkContext.Provider>
    )
};

export default NetworkContextProvider;
