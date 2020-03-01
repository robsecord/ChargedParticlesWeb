// Frameworks
import React, { useEffect, useContext } from 'react';
import UseAnimations from 'react-useanimations';
import * as _ from 'lodash';

// App Components
import Transactions from '../blockchain/transactions';
import Loading from '../components/Loading.js';
import ParticleTypesList from '../components/ParticleTypesList';

// Data Context for State
import { RootContext } from '../stores/root.store';
import { WalletContext } from '../stores/wallet.store';
import { TransactionContext } from '../stores/transaction.store';

// Material UI
import Alert from '@material-ui/lab/Alert';

// Toast Styles
import 'react-toastify/dist/ReactToastify.css';


// Manage Route
const Manage = () => {
    const [ rootState ] = useContext(RootContext);
    const { networkId, isNetworkConnected } = rootState;

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
        if (allReady && isNetworkConnected && searchState !== 'searching') {
            (async () => {
                const transactions = Transactions.instance();
                await transactions.getCreatedParticlesByOwner({owner: connectedAddress});
            })();
        }
    }, [allReady, networkId, isNetworkConnected, connectedAddress]);


    if (searchState !== 'complete') {
        return (
            <Loading/>
        );
    }

    if (!_.isEmpty(searchError)) {
        return (
            <Alert
                variant="outlined"
                severity="error"
                icon={<UseAnimations animationKey="alertOctagon" size={24} />}
            >
                {searchError}
            </Alert>
        );
    }

    if (_.isEmpty(searchTransactions)) {
        return (
            <Alert
                variant="outlined"
                severity="warning"
                icon={<UseAnimations animationKey="alertTriangle" size={24} />}
            >
                You do not have any created Particle Types!
            </Alert>
        );
    }

    // Display Particle Types
    return (
        <>
            <ParticleTypesList
                owner={connectedAddress}
                transactions={searchTransactions}
                allowCache={true}
            />
        </>
    );
};

export default Manage;
