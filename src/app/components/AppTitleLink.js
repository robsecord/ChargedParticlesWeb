// Frameworks
import React from 'react';
import { navigate } from '@reach/router';

// App Components
import Logo from '../../images/logo/ChargedParticles_Pink_Transparent.svg';

// Material UI
import Typography from '@material-ui/core/Typography';

// Common
import { GLOBALS } from '../../utils/globals';


const AppTitleLink = ({ title }) => {
    const _goHome = () => {
        navigate(GLOBALS.ACCELERATOR_ROOT);
    };

    return (
        <>
            <Logo style={{width: '40px', height: 'auto', marginTop: '2px', marginRight: '12px'}} />
            <Typography variant="h6" noWrap onClick={_goHome}>
                {title}
            </Typography>
        </>
    );
};

export { AppTitleLink };
