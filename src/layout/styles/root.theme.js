// Frameworks
import React from 'react';
import { createMuiTheme, createStyles } from '@material-ui/core/styles';

import { GLOBALS } from '../../utils/globals';

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
            default: GLOBALS.BRANDING.BACKGROUND.DEFAULT,
            paper:   GLOBALS.BRANDING.BACKGROUND.PAPER,
        },
        primary: {
            main: GLOBALS.BRANDING.PRIMARY,
        },
        secondary: {
            main: GLOBALS.BRANDING.SECONDARY,
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
