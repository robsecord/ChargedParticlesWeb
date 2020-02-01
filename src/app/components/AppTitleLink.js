// Frameworks
import React from 'react';
import { navigate } from '@reach/router';

// Material UI
import Typography from '@material-ui/core/Typography';

// Common
import { GLOBALS } from '../../utils/globals';


const AppTitleLink = ({ title }) => {
    const _goHome = () => {
        navigate(GLOBALS.ACCELERATOR_ROOT);
    };

    return (
        <Typography variant="h6" noWrap onClick={_goHome}>
            {title}
        </Typography>
    );
};

export { AppTitleLink };
