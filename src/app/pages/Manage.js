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
import Typography from '@material-ui/core/Typography';

// Toast Styles
import 'react-toastify/dist/ReactToastify.css';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


// Manage Route
const Manage = () => {
    const classes = useRootStyles();

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
                    eventId: 'UPDATE_PARTICLE_TYPE',
                    owner: connectedAddress
                });
            })();
        }

    }, [allReady, networkId, connectedAddress]);


    const _getHeader = () => {
        return (
            <Typography
                variant={'h5'}
                component={'h3'}
                className={classes.pageHeader}
            >
                Manage your Particles!
            </Typography>
        );
    };

    if (!allReady) {
        return (
            <>
                {_getHeader()}
                <Alert
                    variant="outlined"
                    severity="warning"
                    icon={<UseAnimations animationKey="alertTriangle" size={24} />}
                >
                    You must connect your account in order to see your Particle Types!
                </Alert>
            </>
        );
    }

    if (searchState !== 'complete') {
        return (
            <>
                {_getHeader()}
                <Loading/>
            </>
        );
    }

    if (!_.isEmpty(searchError)) {
        return (
            <>
                {_getHeader()}
                <Alert
                    variant="outlined"
                    severity="error"
                    icon={<UseAnimations animationKey="alertOctagon" size={24} />}
                >
                    {searchError}
                </Alert>
            </>
        );
    }

    if (_.isEmpty(searchTransactions)) {
        return (
            <>
                {_getHeader()}
                <Alert
                    variant="outlined"
                    severity="warning"
                    icon={<UseAnimations animationKey="alertTriangle" size={24} />}
                >
                    You do not have any created Particle Types!
                </Alert>
            </>
        );
    }

    // Display Particle Types
    return (
        <>
            {_getHeader()}

            <ParticleTypesList
                owner={connectedAddress}
                transactions={searchTransactions}
            />
        </>
    );
};

export default Manage;
