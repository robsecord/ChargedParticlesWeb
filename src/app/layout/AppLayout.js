// Frameworks
import React, { useContext, useEffect, useState } from 'react';

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
import { HeaderBar } from '../components/HeaderBar';
import { Sidemenu } from '../components/Sidemenu';

// Data Context for State
import { WalletContext } from '../stores/wallet.store';

const theme = createMuiTheme();


function AppLayout({ children }) {
    const classes = useRootStyles();
    const wallet = Wallet.instance();
    const [, walletDispatch] = useContext(WalletContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const siteTitle = siteOptions.metadata.title;

    // Prepare Wallet Interface
    useEffect(() => {
        wallet.init({walletDispatch})
            .catch(console.error);
    }, [wallet, walletDispatch]);


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
