import React, { createContext, useReducer } from 'react';


const initialState = {

};
export const UserInputContext = createContext(initialState);

const UserInputReducer = (state, action) => {
    switch (action.type) {

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
