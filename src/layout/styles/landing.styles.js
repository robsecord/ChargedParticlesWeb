// Frameworks
import React from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    primaryContainer: {
        margin: `0 auto`,
        maxWidth: 960,
        padding: `0 1.0875rem 1.45rem`,
        paddingTop: 0,
    },
    particleBackground: {
        position: 'fixed',
        width: '100vw',
        height: '100vh',
    },
    heroContainer: {
        height: '100vh',
    },
    heroHeader: {
        margin: '0',
    },
    heroPadding: {
        padding: '30px',
    },
    heroMargin: {
        margin: '100px 0',
    },
    glowTitle: {
        position: 'relative',
        color: '#fff',
        fontWeight: '100',
        fontFamily: 'Montserrat, Arial, sans-serif',
        fontSize: '40px',
        padding: '0',
        margin: '50px',
        lineHeight: '1',
        textShadow: '0 0 5px #ff006c, 0 0 10px #ff006c, 0 0 15px #ff006c, 0 0 20px #ff417d, 0 0 35px #ff417d, 0 0 40px #ff417d, 0 0 50px #ff417d, 0 0 75px #ff417d',
    },
    glowHeader: {
        position: 'relative',
        color: '#fff',
        fontWeight: '100',
        fontSize: '30px',
        padding: '0',
        margin: '30px 0 20px',
        lineHeight: '1',
        textShadow: '0 0 5px #ff006c, 0 0 10px #ff006c, 0 0 15px #ff006c, 0 0 20px #ff417d, 0 0 30px #ff417d, 0 0 35px #ff417d',
    },
    downArrow: {
        color: '#fff',
        fontWeight: '700',
        fontSize: '40px',
    },

}));
