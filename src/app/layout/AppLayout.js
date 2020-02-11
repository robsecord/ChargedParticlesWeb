// Frameworks
import React, { useContext, useEffect, useState } from 'react';
import * as _ from 'lodash';

// Material UI
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

// Rimble UI
import { theme as rimbleTheme } from 'rimble-ui';

// Custom Styles
import './styles/overrides.css';
import useRootStyles from './styles/root.styles';

// App Components
import siteOptions from '../../utils/site-options';
import Wallet from '../wallets';
import { GLOBALS } from '../../utils/globals';
import { HeaderBar } from '../components/HeaderBar';
import { Sidemenu } from '../components/Sidemenu';

// Contract Data
import {
    ChargedParticles,
    ChargedParticlesEscrow
} from '../blockchain/contracts';
import ChargedParticlesData from '../blockchain/contracts/ChargedParticles';
import ChargedParticlesEscrowData from '../blockchain/contracts/ChargedParticlesEscrow';

// Transactions Monitor
import Transactions from '../blockchain/transactions';

// Data Context for State
import { RootContext } from '../stores/root.store';
import { WalletContext } from '../stores/wallet.store';

const theme = createMuiTheme();


function AppLayout({ children }) {
    const classes = useRootStyles();
    const wallet = Wallet.instance();
    const [, rootDispatch] = useContext(RootContext);
    const [walletState, walletDispatch] = useContext(WalletContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { allReady: isWalletReady, connectedType, networkId } = walletState;
    const siteTitle = siteOptions.metadata.title;

    const correctNetwork = _.parseInt(GLOBALS.CHAIN_ID, 10);

    // Prepare Wallet Interface
    useEffect(() => {
        wallet.init({walletDispatch});
    }, [wallet, walletDispatch]);

    // Reconnect to Contracts on network change
    useEffect(() => {
        if (isWalletReady) {
            const web3 = wallet.getWeb3();

            const chargedParticlesAddress = _.get(ChargedParticlesData.networks[networkId], 'address', '');
            const chargedParticlesEscrowAddress = _.get(ChargedParticlesEscrowData.networks[networkId], 'address', '');

            ChargedParticles.prepare({web3, address: chargedParticlesAddress});
            ChargedParticles.reconnect();

            ChargedParticlesEscrow.prepare({web3, address: chargedParticlesEscrowAddress});
            ChargedParticlesEscrow.reconnect();
        }
    }, [isWalletReady, connectedType, networkId, wallet]);

    // Reconnect to Network Monitor on network change
    useEffect(() => {
        if (isWalletReady) {
            const transactions = Transactions.instance();
            transactions.init({rootDispatch});
            transactions.connectToNetwork({networkId});
        }
    }, [isWalletReady, connectedType, networkId, wallet]);

    useEffect(() => {
        const isModernWeb3 = !!window.ethereum;
        const isLegacyWeb3 = (typeof window.web3 !== 'undefined');

        if (!isLegacyWeb3 && !isModernWeb3) {
            rootDispatch({type: 'CONNECTION_WARNING', payload: 'Not a Web3 capable browser'});
        } else if (_.isUndefined(networkId) || networkId === 0) {
            rootDispatch({type: 'CONNECTION_WARNING', payload: 'Not connected to network'});
        } else if (networkId !== correctNetwork) {
            rootDispatch({type: 'CONNECTION_WARNING', payload: 'Wrong Ethereum network'});
        } else {
            rootDispatch({type: 'CONNECTION_WARNING', payload: ''});
        }
    }, [networkId, rootDispatch]);


    const _handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const _handleCloseDrawer = () => {
        setMobileOpen(false);
    };


    return (
        <ThemeProvider theme={{...rimbleTheme, ...theme}}>
            <div className={classes.root}>
                <CssBaseline />
                <HeaderBar
                    title={siteTitle}
                    drawerToggle={_handleDrawerToggle}
                />
                <Hidden smUp implementation="css">
                    <nav className={classes.drawer} aria-label="mailbox folders">
                        <Drawer
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={_handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            <Sidemenu title={siteTitle} closeDrawer={_handleCloseDrawer} />
                        </Drawer>
                    </nav>
                </Hidden>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </main>
            </div>
        </ThemeProvider>
    );
}

export default AppLayout;
