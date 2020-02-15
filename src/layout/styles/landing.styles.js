// Frameworks
import React from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    primaryContainer: {
        margin: `0 auto`,
        maxWidth: 960,
        padding: `0 20px 30px`,
        paddingTop: 0,

        [theme.breakpoints.down('sm')]: {
            maxWidth: 'none',
            width: '100%',
        },
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
        fontWeight: '100 !important',
        fontFamily: 'Montserrat, Arial, sans-serif !important',
        fontSize: '40px !important',
        padding: '0 !important',
        margin: '50px !important',
        lineHeight: '1 !important',
        textShadow: '0 0 5px #ff006c, 0 0 10px #ff006c, 0 0 15px #ff006c, 0 0 20px #ff417d, 0 0 35px #ff417d, 0 0 40px #ff417d, 0 0 50px #ff417d, 0 0 75px #ff417d',

        [theme.breakpoints.down('sm')]: {
            fontSize: '28px !important',
            margin: '34px 20px !important',
        },
    },
    glowHeader: {
        position: 'relative',
        color: '#fff',
        fontWeight: '100 !important',
        fontSize: '30px !important',
        padding: '0 !important',
        margin: '30px 0 20px !important',
        lineHeight: '1 !important',
        textShadow: '0 0 5px #ff006c, 0 0 10px #ff006c, 0 0 15px #ff006c, 0 0 20px #ff417d, 0 0 30px #ff417d, 0 0 35px #ff417d',
    },
    downArrow: {
        color: '#fff',
        fontWeight: '700',
        fontSize: '40px',
    },
    centerAlign: {
        textAlign: 'center',
    }
}));
