// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import UseAnimations from 'react-useanimations';
import * as _ from 'lodash';

// Material UI
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';

// App Components
import SEO from '../../components/seo';
import FormMint from '../components/mint/FormMint';
import LoadingModal from '../components/LoadingModal';
import Transactions from '../blockchain/transactions';
import { ContractHelpers } from '../blockchain/contract-helpers';
import { AcceleratorTabs } from '../components/AcceleratorTabs';

// Data Context for State
import { WalletContext } from '../contexts/wallet';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


// Mint Route
const Mint = ({ location, typeId }) => {
    const classes = useRootStyles();
    const [ walletState ] = useContext(WalletContext);
    const { allReady, connectedAddress } = walletState;
    const [ isSubmitting, setSubmitting ] = useState(false);
    const [ txData, setTxData ] = useState({});
    const [ loadingProgress, setLoadingProgress ] = useState('');

    useEffect(() => {
        if (isSubmitting && !_.isEmpty(txData)) {
            const { transactionHash } = txData;
            console.log('Mint - transaction sent;');
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

    const _handleSubmit = async formData => {

        console.log('MINT: submit form', formData);
        return;

        // let txReceipt;
        // try {
        //     setSubmitting(true);
        //
        //     const options = {
        //         from: connectedAddress,
        //         particleData: formData,
        //         onProgress: setLoadingProgress,
        //         payWithIons: false
        //     };
        //
        //     let response;
        //     if (formData.isNonFungible) {
        //         response = await ContractHelpers.mintParticle(options);
        //     } else {
        //         response = await ContractHelpers.mintPlasma(options);
        //     }
        //
        //     const {tx, args, transactionHash} = response;
        //     txReceipt = transactionHash;
        //     setTxData({transactionHash, params: {tx, args}, type: 'MintParticle'});
        //     return true;
        // }
        // catch (err) {
        //     if (/gateway timeout/i.test(err)) {
        //         _handleError('Failed to save Image and/or Metadata to IPFS!');
        //     } else if (_.isUndefined(txReceipt)) {
        //         _handleError('Transaction cancelled by user.');
        //     } else {
        //         _handleError('An unexpected error has occurred!');
        //         console.error(err);
        //     }
        //     return false;
        // }
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
            <FormMint
                typeId={typeId}
                onSubmitForm={_handleSubmit}
            />
        );
    };

    return (
        <>
            <SEO title={'Mint Particles'} />
            <AcceleratorTabs location={location} />

            <Typography
                variant={'h5'}
                component={'h3'}
                className={classes.pageHeader}
            >
                Mint a Particle!
            </Typography>

            {_getContent()}

            <LoadingModal
                title={'Minting Particle!'}
                progress={loadingProgress}
                isOpen={isSubmitting}
            />
        </>
    )
};

export default Mint;
