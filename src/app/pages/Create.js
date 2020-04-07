// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import UseAnimations from 'react-useanimations';
import * as _ from 'lodash';

// Material UI
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';

// App Components
import SEO from '../../components/seo';
import CreateWizard from '../components/create/CreateWizard';
import LoadingModal from '../components/LoadingModal';
import Transactions from '../blockchain/transactions';
import { ContractHelpers } from '../blockchain/contract-helpers';
import { AcceleratorTabs } from '../components/AcceleratorTabs';

// Data Context for State
import { WalletContext } from '../stores/wallet.store';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


// Create Route
const Create = ({ location }) => {
    const classes = useRootStyles();

    const [ walletState ] = useContext(WalletContext);
    const { allReady, connectedAddress } = walletState;

    const [ isSubmitting, setSubmitting ] = useState(false);
    const [ txData, setTxData ] = useState({});
    const [ loadingProgress, setLoadingProgress ] = useState('');

    useEffect(() => {
        if (isSubmitting && !_.isEmpty(txData)) {
            const { transactionHash } = txData;
            console.log('Create - transaction sent;');
            console.log('  txData', txData);

            // dFuse - watch transaction
            (async () => {
                const transactions = Transactions.instance();
                await transactions.streamTransaction({transactionHash});
            })();

            setLoadingProgress('Transaction created, monitoring has begun in the background...');
            setTimeout(() => {
                // All Done, clean up
                setSubmitting(false);
                setTxData({});
            }, 3000);

            // Redirect to Manage Screen
            // ...
        }
    }, [isSubmitting, txData, setSubmitting, setTxData]);

    const _handleError = (errorMsg) => {
        setLoadingProgress(errorMsg);
        setTimeout(() => {
            setSubmitting(false);
        }, 3000);
    };

    const handleSubmit = async (formData) => {
        let txReceipt;
        try {
            setSubmitting(true);

            const options = {
                from: connectedAddress,
                particleData: formData,
                onProgress: setLoadingProgress,
                payWithIons: formData.payWithIons,
            };

            let response;
            if (formData.isNonFungible) {
                response = await ContractHelpers.createParticle(options);
            } else {
                response = await ContractHelpers.createPlasma(options);
            }

            const {tx, args, transactionHash} = response;
            txReceipt = transactionHash;
            setTxData({transactionHash, params: {tx, args}, type: 'CreateParticle'});
            return true;
        }
        catch (err) {
            if (/gateway timeout/i.test(err)) {
                _handleError('Failed to save Image and/or Metadata to IPFS!');
            } else if (_.isUndefined(txReceipt)) {
                _handleError('Transaction cancelled by user.');
                console.info(err);
            } else {
                _handleError('An unexpected error has occurred!');
                console.error(err);
            }
            return false;
        }
    };

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

        return (
            <form autoComplete={'off'}>
                <CreateWizard
                    onSubmitForm={handleSubmit}
                />
            </form>
        );
    };

    return (
        <>
            <SEO title={'Create Particles'} />
            <AcceleratorTabs location={location} />

            <Typography
                variant={'h5'}
                component={'h3'}
                className={classes.pageHeader}
            >
                Create a new Particle Type!
            </Typography>

            {_getContent()}

            <LoadingModal
                title={'Creating Particle!'}
                progress={loadingProgress}
                isOpen={isSubmitting}
            />
        </>
    )
};

export default Create;
