import React, { createContext, useReducer } from 'react';
import TransactionReducer from './transaction.reducer'


const initialState = {
    // For Streaming Transactions
    transactionHash: '',
    streamState: '',
    streamError: '',
    streamTransitions: [],

    // For Searching Particle Types
    searchState: '',
    searchError: '',
    searchTransactions: [],

    // For Loading a Particle Type to Mint
    loadState: '',
    loadError: '',
    loadTransactions: [],
};

const TransactionStore = ({children}) => {
    const [state, dispatch] = useReducer(TransactionReducer, initialState);
    return (
        <TransactionContext.Provider value={[state, dispatch]}>
            {children}
        </TransactionContext.Provider>
    )
};

export const TransactionContext = createContext(initialState);
export default TransactionStore;
