// Frameworks
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { navigate, useStaticQuery, graphql } from 'gatsby';

import './styles/reset.css';
import './styles/overrides.css';
import theme from './styles/root.theme.js';

// Rimble UI
import {
    Box
} from 'rimble-ui';

// Layout Components
import { ParticleBG } from '../components/ParticleBG';
import Header from '../components/header';

// Common
import { GLOBALS } from '../utils/globals';

// Custom Theme
import useLandingStyles from '../layout/styles/landing.styles';


// Layout Wrapper
const Layout = ({children, noHeader}) => {
    const classes = useLandingStyles();
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    const _goHome = () => { navigate(GLOBALS.ACCELERATOR_ROOT) };

    return (
        <ThemeProvider theme={theme}>
            {
                !noHeader && (
                    <Header siteTitle={data.site.siteMetadata.title} onClick={_goHome}/>
                )
            }
            <ParticleBG />
            <div className={classes.primaryContainer}>
                <main>{children}</main>
                <footer>
                    <Box mt={4}>
                        &copy; {new Date().getFullYear()}, Charged Particles
                    </Box>
                </footer>
            </div>
        </ThemeProvider>
    );
};

Layout.propTypes = {
    children: PropTypes.array.isRequired,
    noHeader: PropTypes.bool,
};

Layout.defaultProps = {
    noHeader: false,
};

export default Layout;
