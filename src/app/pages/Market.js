// Frameworks
import React, { useEffect, useContext } from 'react';
import UseAnimations from 'react-useanimations';
import * as _ from 'lodash';

// Material UI
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';

// App Components
import SEO from '../../components/seo';
import Transactions from '../blockchain/transactions';
import Loading from '../components/Loading';
import ParticleTypesList from '../components/ParticleTypesList';
import { AcceleratorTabs } from '../components/AcceleratorTabs';

// Data Context for State
import { RootContext } from '../stores/root.store';
import { WalletContext } from '../stores/wallet.store';
import { TransactionContext } from '../stores/transaction.store';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';

// Toast Styles
import 'react-toastify/dist/ReactToastify.css';


// Market Route
const Market = ({ location }) => {
    const classes = useRootStyles();
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
                await transactions.getPublicParticles();
            })();
        }
    }, [allReady, networkId, isNetworkConnected, connectedAddress]);

    useEffect(() => {
        return () => {
            Transactions.instance().clearSearch();
        };
    }, []);


    const _getContent = () => {
        if (!allReady) {
            return (
                <Alert
                    variant="outlined"
                    severity="warning"
                    icon={<UseAnimations animationKey="alertTriangle" size={24} />}
                >
                    You must connect your account in order to Mint Particles!
                </Alert>
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

        if (searchState !== 'complete') {
            return (
                <Loading/>
            );
        }

        if (_.isEmpty(searchTransactions)) {
            return (
                <Alert
                    variant="outlined"
                    severity="warning"
                    icon={<UseAnimations animationKey="alertTriangle" size={24} />}
                >
                    There are no Particles available for Public Minting.
                </Alert>
            );
        }

        return (
            <ParticleTypesList
                owner={connectedAddress}
                transactions={searchTransactions}
                allowCache={false}
            />
        );
    };


    // Display Particle Types
    return (
        <>
            <SEO title={'Available Particles'} />
            <AcceleratorTabs location={location} />

            <Typography
                variant={'h5'}
                component={'h3'}
                className={classes.pageHeader}
            >
                Available Particles!
            </Typography>

            {_getContent()}
        </>
    );
};

export default Market;
