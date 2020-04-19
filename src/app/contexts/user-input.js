// Frameworks
import React, { createContext, useReducer } from 'react';


const initialState = {
    assetAmount: {
        input: 0,
    }
};
export const UserInputContext = createContext(initialState);

const UserInputReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_ASSET_AMOUNT':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

const UserInputContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(UserInputReducer, initialState);
    return (
        <UserInputContext.Provider value={[state, dispatch]}>
            {children}
        </UserInputContext.Provider>
    )
};

export default UserInputContextProvider;
