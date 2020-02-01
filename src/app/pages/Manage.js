// Frameworks
import React, { useContext } from 'react';
import * as _ from 'lodash';

// Rimble UI
import { Button, Text, Box } from 'rimble-ui';

// App Components
import Wallet from '../wallets';

// Data Context for State
import { WalletContext } from '../stores/wallet.store';

// Manage Route
const Manage = () => {
    const wallet = Wallet.instance();
    const [walletState] = useContext(WalletContext);

    const _isConnectedAccount = () => {
        return !_.isEmpty(walletState.connectedAddress);
    };

    const _walletConnect = (walletType) => async () => {
        try {
            await wallet.prepare(walletType);
            await wallet.connect();
        }
        catch (err) {
            console.error(err);
        }
    };

    const _logout = async () => {
        await wallet.disconnect();
    };

    let accountBlock = '';
    if (_isConnectedAccount()) {
        accountBlock = (
            <Box mt={40}>
                <Text.p>
                    <Button onClick={_logout}>disconnect</Button>
                </Text.p>
            </Box>
        );
    } else {
        accountBlock = (
            <Box mt={40}>
                <Text.p>
                    <Button onClick={_walletConnect(walletState.connectedType)}>connect</Button>
                </Text.p>
            </Box>
        );
    }

    return (
        <>
            <h2>Manage your Particles!</h2>
            <Box mt={20}>
                <Text>Total Value: $___.__</Text>
                <Text mb={20}>24hr Change: +/- __%</Text>
                <Text mb={20}>[Graph Here]</Text>
                <Text>
                    <Button>Send</Button> &nbsp; <Button>Receive</Button>
                </Text>
            </Box>

            {accountBlock}
        </>
    );
};

export default Manage;
