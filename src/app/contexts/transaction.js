import React, { createContext, useReducer } from 'react';


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
export const TransactionContext = createContext(initialState);

const TransactionReducer = (state, action) => {
    switch (action.type) {
        case 'BEGIN_STREAMING':
            return {
                ...state,
                transactionHash: action.payload.transactionHash,
                streamState: 'streaming',
                streamError: '',
                streamTransitions: [],
            };
        case 'STREAM_ERROR':
            return {
                ...state,
                streamError: action.payload.streamError
            };
        case 'STREAM_TRANSITION':
            return {
                ...state,
                streamTransitions: action.payload.streamTransitions
            };
        case 'STREAM_COMPLETE':
            return {
                ...state,
                transactionHash: '',
                streamState: 'completed'
            };
        case 'CLEAR_STREAM':
            return {
                ...state,
                transactionHash: '',
                streamState: ''
            };

        case 'BEGIN_SEARCH':
            return {
                ...state,
                searchState: 'searching',
                searchTransactions: [],
                searchError: '',
            };
        case 'SEARCH_ERROR':
            return {
                ...state,
                searchState: 'complete',
                searchError: action.payload
            };
        case 'SEARCH_COMPLETE':
            return {
                ...state,
                searchState: 'complete',
                searchTransactions: action.payload
            };

        case 'CLEAR_SEARCH':
            return {
                ...state,
                searchState: '',
                searchTransactions: [],
                searchError: '',
            };

        case 'BEGIN_LOAD':
            return {
                ...state,
                loadState: 'loading',
                loadTransactions: [],
                loadError: '',
            };
        case 'LOAD_ERROR':
            return {
                ...state,
                loadState: 'complete',
                loadError: action.payload
            };
        case 'LOAD_COMPLETE':
            return {
                ...state,
                loadState: 'complete',
                loadTransactions: action.payload
            };

        case 'CLEAR_LOAD':
            return {
                ...state,
                loadState: '',
                loadTransactions: [],
                loadError: '',
            };
        default:
            return state;
    }
};

const TransactionContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(TransactionReducer, initialState);
    return (
        <TransactionContext.Provider value={[state, dispatch]}>
            {children}
        </TransactionContext.Provider>
    )
};

export default TransactionContextProvider;
