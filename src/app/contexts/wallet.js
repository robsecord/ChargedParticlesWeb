// Frameworks
import React, { createContext, useContext, useEffect, useReducer, useMemo } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

// App Components
import Wallet from '../wallets';

const initialState = {
    networkId           : 0,
    allReady            : false,

    // Connected Wallet
    connectedType       : '', // Wallet Connected if not Empty
    connectedAddress    : '',
    connectedName       : '',
    connectedBalance    : 0,
};
export const WalletContext = createContext(initialState);

export function useWalletContext() {
    return useContext(WalletContext);
}

const WalletReducer = (state, action) => {
    switch (action.type) {
        case 'CONNECTED_ACCOUNT':
            return {
                ...state,
                allReady         : action.payload.allReady,
                networkId        : action.payload.networkId,
                connectedType    : action.payload.type,
                connectedAddress : action.payload.address,
                connectedName    : action.payload.name,
                connectedBalance : action.payload.balance,
            };
        case 'LOGOUT':
            return {
                ...state,
                ...initialState,
            };
        default:
            return state;
    }
};

export default function Provider({children}) {
    const [state, dispatch] = useReducer(WalletReducer, initialState);
    return (
        <WalletContext.Provider value={[state, dispatch]}>
            {children}
        </WalletContext.Provider>
    )
}

export function Updater() {
    const wallet = useMemo(() => Wallet.instance(), [Wallet]);
    const [, walletDispatch ] = useWalletContext();

    const data = useStaticQuery(graphql`
        query SiteDataWalletQuery {
            site {
                siteMetadata {
                    title
                    logoUrl
                }
            }
        }
    `);
    const siteTitle = data.site.siteMetadata.title;
    const siteLogoUrl = data.site.siteMetadata.logoUrl;


    // Prepare Wallet Interface
    useEffect(() => {
        wallet.init({walletDispatch, siteTitle, siteLogoUrl});
    }, [wallet, walletDispatch]);


    return null;
}
