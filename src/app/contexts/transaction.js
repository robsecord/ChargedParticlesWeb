// Frameworks
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import * as _ from 'lodash';

// App Components
import Wallet from '../wallets';
import { useWalletContext } from './wallet';
import { useNetworkContext } from './network';
import { GLOBALS } from '../../utils/globals';

// Contract Data
import {
    ChargedParticles,
    ChargedParticlesEscrow,
    DAI,
} from '../blockchain/contracts';
import ChargedParticlesData from '../blockchain/contracts/ChargedParticles';
import ChargedParticlesEscrowData from '../blockchain/contracts/ChargedParticlesEscrow';

// Transactions Monitor
import Transactions from '../blockchain/transactions';


const initialState = {
    submittedTransaction: {},

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

export function useTransactionContext() {
    return useContext(TransactionContext);
}

const TransactionReducer = (state, action) => {
    switch (action.type) {
        case 'BEGIN_TX':
            return {
                ...state,
                submittedTransaction: {},
                transactionType: action.transactionType,
                transactionHash: '',
                streamState: 'started',
                streamError: '',
                streamTransitions: [],
            };
        case 'SUBMIT_TX':
            return {
                ...state,
                submittedTransaction: action.payload,
                streamState: 'submitted',
            };
        case 'BEGIN_STREAMING':
            return {
                ...state,
                submittedTransaction: {},
                transactionHash: action.payload.transactionHash,
                streamState: 'streaming',
            };
        case 'STREAM_ERROR':
            return {
                ...state,
                streamState: 'completed',
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
                streamState: 'completed',
                streamTransitions: [],
            };
        case 'CLEAR_STREAM':
            return {
                ...state,
                submittedTransaction: {},
                transactionType: '',
                transactionHash: '',
                streamState: '',
                streamError: '',
                streamTransitions: [],
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

export default function Provider({children}) {
    const [state, dispatch] = useReducer(TransactionReducer, initialState);
    return (
        <TransactionContext.Provider value={[state, dispatch]}>
            {children}
        </TransactionContext.Provider>
    )
}

export function Updater() {
    const wallet = useMemo(() => Wallet.instance(), [Wallet]);

    const [ txState, txDispatch ] = useTransactionContext();
    const { submittedTransaction } = txState;

    const [ walletState ] = useWalletContext();
    const { allReady: isWalletReady, networkId } = walletState;

    const [, networkDispatch ] = useNetworkContext();


    // Prepare Contracts and Resume Incomplete Transactions
    useEffect(() => {
        if (isWalletReady) {
            const web3 = wallet.getWeb3();

            const chargedParticlesAddress = _.get(ChargedParticlesData.networks[networkId], 'address', '');
            const chargedParticlesEscrowAddress = _.get(ChargedParticlesEscrowData.networks[networkId], 'address', '');
            const daiAddress = _.get(GLOBALS.ASSET_TOKENS.DAI.ADDRESS, networkId, '');

            ChargedParticles.prepare({web3, address: chargedParticlesAddress});
            ChargedParticles.instance();

            ChargedParticlesEscrow.prepare({web3, address: chargedParticlesEscrowAddress});
            ChargedParticlesEscrow.instance();

            DAI.prepare({web3, address: daiAddress});
            DAI.instance();

            const transactions = Transactions.instance();
            transactions.init({networkDispatch, txDispatch});
            transactions.connectToNetwork({networkId});
            transactions.resumeIncompleteStreams();
        }
    }, [isWalletReady, networkId, wallet]);


    // Watch for Submitted Transactions
    useEffect(() => {
        if (!_.isEmpty(submittedTransaction)) {
            // dFuse - watch transaction
            const { transactionHash } = submittedTransaction;
            (async () => {
                const transactions = Transactions.instance();
                await transactions.streamTransaction({transactionHash});
            })();

            txDispatch({
                type: 'STREAM_TRANSITION', payload: {
                    streamTransitions: [{to: 'CREATE', transition: 'TX_INIT'}]
                }
            });
        }
    }, [submittedTransaction]);

    return null;
}
