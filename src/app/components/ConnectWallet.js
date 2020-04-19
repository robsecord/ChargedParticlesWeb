// Frameworks
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import * as _ from 'lodash';

// Material UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import StarIcon from '@material-ui/icons/Star';
import CloseIcon from '@material-ui/icons/Close';

// App Components
import Wallet from '../wallets';
import { WalletProviders } from '../wallets/providers';
import TabPanel from './TabPanel';
import Loading from '../components/Loading';

// Data Context for State
import { useRootContext } from '../contexts/root';
import { useWalletContext } from '../contexts/wallet';

// Common
import { GLOBALS } from '../../utils/globals';


// Custom Styles
const useCustomStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    dialogContent: {
        '&, &:first-child': {
            padding: 0,
        }
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 4,
        width: 40,

        [theme.breakpoints.up('md')]: {
            top: 12,
            right: 12,
        },
    },
    logoButton: {
        margin: '0.5rem',
        '&.Mui-disabled': {
            opacity: 0.5
        }
    },
    logoBox: {
        width: '10rem',
        height: '8rem',
        padding: '1rem',
    },
    logoSvg: {
        '& svg': {
            width: 70,
            height: 'auto',
        },
    },
    logoTitle: {
        margin: '5px 0 0',
    },

    // Vendor Icons
    authereum: {
        '& svg': {
            transform: 'scale(1.35)',
        }
    },
    portis: {
        '& svg': {
            width: 'auto',
            height: 70,
        }
    },
    torus: {
        '& svg': {
            transform: 'scale(0.9)',
        }
    },

    walletConnect: {
        '& img': {
            width: 100,
        }
    }
}));


function LogoWrapper({ walletKey, onConnecting, onConnected }) {
    if (_.isUndefined(WalletProviders[walletKey])) { return ''; }

    const wallet = Wallet.instance();
    const customClasses = useCustomStyles();
    const { name, className, logo, isDisabled } = WalletProviders[walletKey];
    const logoClass = customClasses[className] || '';

    const _walletConnect = async () => {
        try {
            onConnecting();
            await wallet.prepare(walletKey);
            await wallet.connect();
            onConnected();
        }
        catch (err) {
            onConnected();
            console.error(err);
        }
    };

    return (
        <Button
            variant="outlined"
            className={customClasses.logoButton}
            disabled={isDisabled}
            onClick={_walletConnect}
        >
            <Box className={customClasses.logoBox}>
                <div className={classNames(customClasses.logoSvg, logoClass)}>{logo}</div>
                <p className={customClasses.logoTitle}>{name}</p>
            </Box>
        </Button>
    );
}
LogoWrapper.propTypes = {
    walletKey: PropTypes.string.isRequired,
};

function a11yProps(index) {
    return {
        id: `wallets-tab-${index}`,
        'aria-controls': `wallets-tabpanel-${index}`,
    };
}


// Login Route
function ConnectWallet() {
    const [ rootState, rootDispatch ] = useRootContext();
    const { showConnectWalletModal } = rootState;
    const [ walletState ] = useWalletContext();
    const { connectedAddress } = walletState;
    const isLoggedIn = !_.isEmpty(connectedAddress);

    const wallet = Wallet.instance();
    const theme = useTheme();
    const customClasses = useCustomStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [connecting, setConnecting] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const _handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };
    const _handleTabChangeIndex = index => {
        setCurrentTab(index);
    };

    const _handleConnecting = () => {
        setConnecting(true);
    };

    const _handleClose = () => {
        rootDispatch({type: 'SHOW_WALLET_MODAL', payload: false});
        setConnecting(false);
    };

    const logoEventHandlers = {
        onConnecting: _handleConnecting,
        onConnected: _handleClose,
    };

    const _logout = async () => {
        try {
            await wallet.disconnect();
        }
        catch (err) {
            console.error(err);
        }
    };

    const _nativeWallet = () => {
        const injected = wallet.checkInjectedProviders();
        if (!injected.injectedAvailable) { return ''; }

        if (injected.isMetaMask) {
            return (
                <LogoWrapper
                    walletKey={GLOBALS.WALLET_TYPE_METAMASK}
                    {...logoEventHandlers}
                />
            );
        }
    };

    const _recommendedWallets = () => {
        return (
            <Box py={5}>
                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_FORTMATIC} {...logoEventHandlers} />
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_AUTHEREUM} {...logoEventHandlers} />
                    {_nativeWallet()}
                </Grid>
            </Box>
        );
    };

    const _alternativeWallets = () => {
        return (
            <Box py={5}>
                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_WALLETCONNECT} {...logoEventHandlers} />
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_PORTIS} {...logoEventHandlers} />
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_TORUS} {...logoEventHandlers} />
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_ARKANE} {...logoEventHandlers} />
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_SQUARELINK} {...logoEventHandlers} />
                </Grid>
            </Box>
        );
    };

    const _getDialogContent = () => {
        return (
            <>
                <DialogContent className={customClasses.dialogContent}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={currentTab}
                            onChange={_handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="Wallet Options"
                            centered={fullScreen}
                            variant={!fullScreen && 'fullWidth'}
                        >
                            <Tab label={!fullScreen && 'Recommended'} icon={<StarIcon />} {...a11yProps(0)} />
                            <Tab label={!fullScreen && 'Alternatives'} icon={<BeenhereIcon />} {...a11yProps(1)} />
                        </Tabs>
                        <IconButton
                            aria-label="close"
                            aria-haspopup="true"
                            color="inherit"
                            className={customClasses.closeButton}
                            onClick={_handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={currentTab}
                        onChangeIndex={_handleTabChangeIndex}
                    >
                        <TabPanel group="wallets" value={currentTab} index={0} boxSpacing={3}>
                            {_recommendedWallets()}
                        </TabPanel>
                        <TabPanel group="wallets" value={currentTab} index={1} boxSpacing={3}>
                            {_alternativeWallets()}
                        </TabPanel>
                    </SwipeableViews>
                    <Backdrop className={customClasses.backdrop} open={connecting}>
                        <Loading msg={'Connecting Wallet'} />
                    </Backdrop>
                </DialogContent>
                {
                    isLoggedIn && (
                        <DialogActions>
                            <Button
                                variant="outlined"
                                onClick={_logout}
                            >
                                Logout
                            </Button>
                        </DialogActions>
                    )
                }
            </>
        );
    };

    return (
        <Backdrop className={customClasses.backdrop} open={showConnectWalletModal}>
            <Dialog
                fullScreen={fullScreen}
                open={showConnectWalletModal}
                onClose={_handleClose}
                maxWidth={'md'}
                aria-labelledby="responsive-dialog-title"
            >
                {_getDialogContent()}
            </Dialog>
        </Backdrop>
    );
}

export { ConnectWallet };
