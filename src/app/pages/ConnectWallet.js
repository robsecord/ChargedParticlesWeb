// Frameworks
import React from 'react';
import { navigate } from '@reach/router';
import * as _ from 'lodash';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

// Rimble UI
import { Button, Box } from 'rimble-ui';

// App Components
import Wallet from '../wallets';

// Common
import { GLOBALS } from '../../utils/globals';


// Custom Styles
const useCustomStyles = makeStyles(theme => ({
    backdrop: {
        background: theme.palette.grey['400'],
        margin: '-24px',
        padding: '24px',
        height: `calc(100vh - ${theme.heights[3]}px)`,
    },
    container: {
        marginTop: theme.heights[3]
    },
}));


// Login Route
function ConnectWallet() {
    const wallet = Wallet.instance();
    const customClasses = useCustomStyles();

    const _walletConnect = (walletType) => async () => {
        try {
            await wallet.prepare(walletType);
            await wallet.connect();
            navigate(GLOBALS.ACCELERATOR_ROOT);
        }
        catch (err) {
            console.error(err);
        }
    };

    const walletButtons = _.map(Wallet.typeMap(), (walletData, walletType) => {
        const disabled = !Wallet.isEnabled(walletType);
        return (
            <Box key={walletType} mb={2}>
                <Button size="small" onClick={_walletConnect(walletType)} disabled={disabled}>{walletData.name}</Button>
            </Box>
        );
    });

    return (
        <div className={customClasses.backdrop}>
            <Container className={customClasses.container} maxWidth="sm">
                <Paper elevation={2}>
                    {walletButtons}
                </Paper>
            </Container>
        </div>
    );
}

export default ConnectWallet;
