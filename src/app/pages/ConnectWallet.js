// Frameworks
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import * as _ from 'lodash';

// Material UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import StarIcon from '@material-ui/icons/Star';
import CloseIcon from '@material-ui/icons/Close';

// App Components
import Wallet from '../wallets';
import { WalletProviders } from '../wallets/providers.js';
import TabPanel from '../components/TabPanel.js';

// Data Context for State
import { RootContext } from '../stores/root.store';

// Common
import { GLOBALS } from '../../utils/globals';


// Custom Styles
const useCustomStyles = makeStyles(theme => ({
    backdrop: {
        background: theme.palette.grey['800'],
        margin: '-24px',
        padding: '24px',
        height: `calc(100vh - ${theme.heights[3]}px)`,
    },
    container: {
        marginTop: theme.heights[3]
    },
    closeButton: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '40px',
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


function LogoWrapper({ walletKey }) {
    if (_.isUndefined(WalletProviders[walletKey])) { return ''; }

    const wallet = Wallet.instance();
    const customClasses = useCustomStyles();
    const { name, className, logo, isDisabled } = WalletProviders[walletKey];
    const logoClass = customClasses[className] || '';

    const _walletConnect = async () => {
        try {
            await wallet.prepare(walletKey);
            await wallet.connect();
            navigate(GLOBALS.ACCELERATOR_ROOT);
        }
        catch (err) {
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
    const [ rootState ] = useContext(RootContext);
    const { connectionState } = rootState;

    const wallet = Wallet.instance();

    const theme = useTheme();
    const customClasses = useCustomStyles();

    const [currentTab, setCurrentTab] = React.useState(0);
    const _handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };
    const _handleTabChangeIndex = index => {
        setCurrentTab(index);
    };

    const _close = async () => {
        navigate(GLOBALS.ACCELERATOR_ROOT);
    };

    const _logout = async () => {
        try {
            await wallet.disconnect();
            navigate(GLOBALS.ACCELERATOR_ROOT);
        }
        catch (err) {
            console.error(err);
        }
    };

    const _nativeWallet = () => {
        const injected = wallet.checkInjectedProviders();
        if (!injected.injectedAvailable) { return ''; }

        if (injected.isMetaMask) {
            return (<LogoWrapper walletKey={GLOBALS.WALLET_TYPE_METAMASK} />);
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
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_FORTMATIC} />
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_AUTHEREUM} />
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
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_WALLETCONNECT} />
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_PORTIS} />
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_TORUS} />
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_ARKANE} />
                    <LogoWrapper walletKey={GLOBALS.WALLET_TYPE_SQUARELINK} />
                </Grid>
            </Box>
        );
    };

    return (
        <div className={customClasses.backdrop}>
            <Container className={customClasses.container} maxWidth="md">
                <Paper elevation={3}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={currentTab}
                            onChange={_handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="Wallet Options"
                            centered
                        >
                            <Tab label="Recommended" icon={<StarIcon />} {...a11yProps(0)} />
                            <Tab label="Alternatives" icon={<BeenhereIcon />} {...a11yProps(1)} />
                        </Tabs>
                        <IconButton
                            aria-label="close"
                            aria-haspopup="true"
                            color="inherit"
                            className={customClasses.closeButton}
                            onClick={_close}
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
                    <Divider />
                    <Grid
                        container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                    >
                        <Box p={2}>
                            <Button
                                variant="outlined"
                                onClick={_logout}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
}

export default ConnectWallet;
