// Frameworks
import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { ToastContainer } from 'react-toastify';

// Custom Styles
import theme from '../../layout/styles/root.theme';
import useRootStyles from './styles/root.styles';

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

// App Components
import { HeaderBar } from '../components/HeaderBar';
import { Sidemenu } from '../components/Sidemenu';
import { ConnectionWarning } from '../components/ConnectionWarning';
import { ConnectWallet } from '../components/ConnectWallet';
import TxStreamView from '../components/TxStreamView';


function AppLayout({ children }) {
    const classes = useRootStyles();
    const [mobileOpen, setMobileOpen] = useState(false);

    const data = useStaticQuery(graphql`
        query AppLayoutQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);
    const siteTitle = data.site.siteMetadata.title;

    const _handleDrawerToggle = (evt) => {
        evt.preventDefault();
        setMobileOpen(!mobileOpen);
    };

    const _handleCloseDrawer = () => {
        setMobileOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <HeaderBar
                title={siteTitle}
                drawerToggle={_handleDrawerToggle}
            />
            <Hidden mdUp implementation="css">
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

                <div className={classes.tabBar}>
                    <Container maxWidth="md">
                        <ConnectionWarning />
                        {children}
                    </Container>
                </div>

                <ConnectWallet />
                <TxStreamView />
            </main>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default AppLayout;
