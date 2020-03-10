
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
                searchError: action.payload.searchError
            };
        case 'SEARCH_COMPLETE':
            return {
                ...state,
                searchState: 'complete',
                searchTransactions: action.payload.searchTransactions
            };

        case 'CLEAR_SEARCH':
            return {
                ...state,
                searchState: '',
                searchTransactions: [],
                searchError: '',
            };
        default:
            return state;
    }
};

export default TransactionReducer;
