// Frameworks
import React from 'react';
import UseAnimations from 'react-useanimations';

// Material UI
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';

// App Components
import SEO from '../../components/seo';
import CreateWizard from '../components/create/CreateWizard';
import { ContractHelpers } from '../blockchain/contract-helpers';
import { AcceleratorTabs } from '../components/AcceleratorTabs';

// Data Context for State
import { useWalletContext } from '../contexts/wallet';
import { useTransactionContext } from '../contexts/transaction';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


// Create Route
const Create = ({ location }) => {
    const classes = useRootStyles();

    const [ walletState ] = useWalletContext();
    const { allReady, connectedAddress } = walletState;

    const [, txDispatch ] = useTransactionContext();

    const handleSubmit = async (formData) => {
        const options = {
            txDispatch,
            from: connectedAddress,
            particleData: formData,
            payWithIons: formData.payWithIons,
        };

        if (formData.isNonFungible) {
            await ContractHelpers.createParticle(options);
        } else {
            await ContractHelpers.createPlasma(options);
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
        </>
    )
};

export default Create;
