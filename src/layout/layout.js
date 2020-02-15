// Frameworks
import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { navigate, useStaticQuery, graphql } from 'gatsby';

// Rimble UI
import {
    theme as rimbleTheme,
    Box
} from 'rimble-ui';

// Material UI
// see https://v3.material-ui.com/style/color/
// see https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=EC407A&secondary.color=8E24AA
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#EC407A',
        },
        secondary: {
            main: '#8E24AA',
        },
    },
});

// Layout Components
import { ParticleBG } from '../components/ParticleBG';
import Header from '../components/header';
import './styles/reset.css';
import './styles/overrides.css';

// Common
import { GLOBALS } from '../utils/globals';

// Custom Theme
import useRootStyles from './styles/root.styles';


// Layout Wrapper
const Layout = ({children, noHeader}) => {
    const rootClasses = useRootStyles();
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
        <ThemeProvider theme={{...rimbleTheme, ...theme}}>
            {
                !noHeader && (
                    <Header siteTitle={data.site.siteMetadata.title} onClick={_goHome}/>
                )
            }
            <ParticleBG />
            <div className={rootClasses.primaryContainer}>
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
