// Frameworks
import React from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

// Custom Styles
const useCustomStyles = makeStyles(theme => ({
    dot: {
        float: 'left',
        width: '8px',
        height: '8px',
        marginRight: '10px',
        background: theme.palette.error.main,
        borderRadius: '50%',
        overflow: 'hidden',
    },
    active: {
        background: theme.palette.success.main,
    },
}));

function ConnectionDot({ connected }) {
    const customClasses = useCustomStyles();
    const classes = [customClasses.dot];
    if (connected) {
        classes.push(customClasses.active);
    }
    return (
        <div className={classes.join(' ')}>&nbsp;</div>
    );
}

export { ConnectionDot };
