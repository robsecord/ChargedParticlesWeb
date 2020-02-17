// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// App Components
import Transactions from '../blockchain/transactions';
import { ContractHelpers } from '../blockchain/contract-helpers.js';

// Data Context for State
import { RootContext } from '../stores/root.store';
import { WalletContext } from '../stores/wallet.store';
import { TransactionContext } from '../stores/transaction.store';

// Material UI
import Typography from '@material-ui/core/Typography';

// Rimble UI
import {
    Box,
    Flex,
    Loader,
    Heading,
} from 'rimble-ui';

// Toast Styles
import 'react-toastify/dist/ReactToastify.css';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


// Manage Route
const Manage = () => {
    const [ rootState ] = useContext(RootContext);
    const { networkId } = rootState;

    const [ walletState ] = useContext(WalletContext);
    const { allReady, connectedAddress } = walletState;

    const [ txState ] = useContext(TransactionContext);
    const {
        searchState,
        searchError,
        searchTransactions,
    } = txState;

    useEffect(() => {
        // dFuse - search transactions
        if (allReady && searchState !== 'searching') {
            (async () => {
                const transactions = Transactions.instance();
                await transactions.searchTransactionsByEvent({
                    eventId: 'CREATE_PARTICLE_TYPE',
                    owner: connectedAddress
                });
            })();
        }

    }, [allReady, networkId, connectedAddress]);

    return (
        <>
            <Heading as={"h2"} mt={30}>Manage your Particles!</Heading>
            <ul>
                <li>State: {searchState}</li>
                <li>Error: {searchError}</li>
                <li>Transactions: {JSON.stringify(searchTransactions)}</li>
            </ul>
        </>
    );
};

export default Manage;
