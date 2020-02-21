// Frameworks
import React from 'react';
import { createMuiTheme, createStyles } from '@material-ui/core/styles';

// Material UI
// see https://v3.material-ui.com/style/color/
// see https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=EC407A&secondary.color=8E24AA

export default createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        type: 'dark',
        background: {
            default: '#111',
            paper:   '#222',
        },
        primary: {
            main: '#EC407A',
        },
        secondary: {
            main: '#8E24AA',
        },
    },

    // overrides: {
    //     MuiExpansionPanel: createStyles({
    //         root: {
    //             background: 'transparent',
    //             border: '1px solid #444',
    //         }
    //     })
    // }
});
