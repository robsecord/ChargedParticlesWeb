// Frameworks
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as _ from 'lodash';

// App Components
import { useWalletContext } from './wallet';
import { Helpers } from '../../utils/helpers';


const initialState = {
    networkId: 0,
    isNetworkConnected: false,
    networkErrors: [],
    connectionState: {},
};
export const NetworkContext = createContext(initialState);

export function useNetworkContext() {
    return useContext(NetworkContext);
}

const NetworkReducer = (state, action) => {
    switch (action.type) {
        case 'CONNECTION_STATE':
            return {
                ...state,
                connectionState: action.payload
            };
        case 'CONNECTED_NETWORK':
            return {
                ...state,
                networkId          : action.payload.networkId,
                isNetworkConnected : action.payload.isNetworkConnected,
                networkErrors      : action.payload.networkErrors,
            };
        case 'DISCONNECTED_NETWORK':
            return {
                ...state,
                isNetworkConnected : action.payload.isNetworkConnected,
                networkErrors      : action.payload.networkErrors,
            };
        default:
            return state;
    }
};

export default function Provider({children}) {
    const [state, dispatch] = useReducer(NetworkReducer, initialState);
    return (
        <NetworkContext.Provider value={[state, dispatch]}>
            {children}
        </NetworkContext.Provider>
    )
}

export function Updater() {
    const [, dispatch ] = useNetworkContext();
    const [ walletState ] = useWalletContext();
    const { networkId } = walletState;

    const { correctNetwork, correctNetworkName } = Helpers.getCorrectNetwork();

    useEffect(() => {
        const isModernWeb3 = !!window.ethereum;
        const isLegacyWeb3 = (typeof window.web3 !== 'undefined');

        if (!isLegacyWeb3 && !isModernWeb3) {
            dispatch({
                type: 'CONNECTION_STATE',
                payload: {type: 'NON_WEB3', message: 'Not a Web3 capable browser'}
            });
        } else if (_.isUndefined(networkId) || networkId === 0) {
            dispatch({
                type: 'CONNECTION_STATE',
                payload: {type: 'WEB3_DISCONNECTED', message: 'Please connect your Web3 Wallet'}
            });
        } else if (networkId !== correctNetwork) {
            dispatch({
                type: 'CONNECTION_STATE',
                payload: {type: 'WEB3_WRONG_NETWORK', message: `Wrong Ethereum network, please connect to ${correctNetworkName}.`}
            });
        } else {
            dispatch({
                type: 'CONNECTION_STATE',
                payload: {}  // Web3, Connected, Correct Network
            });
        }
    }, [networkId, dispatch]);


    return null;
}
