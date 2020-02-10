// Frameworks
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme, Box } from 'rimble-ui';
import { navigate, useStaticQuery, graphql } from 'gatsby';

// Layout Components
import Header from './header';
import './layout.css';

// Common
import { GLOBALS } from '../utils/globals';

const customTheme = {

};

// Layout Wrapper
const Layout = ({children}) => {
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
        <ThemeProvider theme={Object.assign({}, theme, customTheme)}>
            <Header siteTitle={data.site.siteMetadata.title} onClick={_goHome}/>
            <div
                style={{
                    margin: `0 auto`,
                    maxWidth: 960,
                    padding: `0 1.0875rem 1.45rem`,
                    paddingTop: 0,
                }}
            >
                <main>{children}</main>
                <footer>
                    <Box mt={4}>
                        &copy; {new Date().getFullYear()}, <a href={GLOBALS.BASE_URL}>Charged Particles Network</a>
                    </Box>
                </footer>
            </div>
        </ThemeProvider>
    );
};

export default Layout;
