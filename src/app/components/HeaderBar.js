// Frameworks
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';

// App Components
import { AppTitleLink } from './AppTitleLink';
import { WalletButton } from './WalletButton';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


const HeaderBar = ({ title, drawerToggle }) => {
    const rootClasses = useRootStyles();

    return (
        <AppBar position="fixed" className={rootClasses.appBar}>
            <Toolbar>
                <Hidden smUp implementation="css">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        href="#"
                        onClick={drawerToggle}
                        className={rootClasses.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                </Hidden>

                <AppTitleLink title={title} />

                <WalletButton />
            </Toolbar>
        </AppBar>
    );
};

HeaderBar.propTypes = {
    title: PropTypes.string.isRequired,
    drawerToggle: PropTypes.func.isRequired,
};

export { HeaderBar };
