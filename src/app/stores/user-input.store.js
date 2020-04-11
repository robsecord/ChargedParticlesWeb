import React, { createContext, useReducer } from 'react';
import UserInputReducer from './user-input.reducer'


const initialState = {
};

const UserInputStore = ({children}) => {
    const [state, dispatch] = useReducer(UserInputReducer, initialState);
    return (
        <UserInputContext.Provider value={[state, dispatch]}>
            {children}
        </UserInputContext.Provider>
    )
};

export const UserInputContext = createContext(initialState);
export default UserInputStore;
