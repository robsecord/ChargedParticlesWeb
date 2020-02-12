
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
        default:
            return state;
    }
};

export default TransactionReducer;
