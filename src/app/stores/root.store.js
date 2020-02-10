import React, { createContext, useReducer } from 'react';
import RootReducer from './root.reducer'


const initialState = {
    acceleratorTab: 0,

    networkId: 0,
    isNetworkConnected: false,
    networkErrors: [],

    errors: null
};

const RootStore = ({children}) => {
    const [state, dispatch] = useReducer(RootReducer, initialState);
    return (
        <RootContext.Provider value={[state, dispatch]}>
            {children}
        </RootContext.Provider>
    )
};

export const RootContext = createContext(initialState);
export default RootStore;
