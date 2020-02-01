// Frameworks
import React from 'react';
import { navigate } from '@reach/router';

// Material UI
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';

// App Components
import SEO from '../layout/SEO';


// Main Route
const Main = () => {
    const classes = useRootStyles();

    const _goToAccelerator = () => {
        navigate(GLOBALS.ACCELERATOR_ROOT);
    };

    return (
        <div className={classes.tabBar}>
            <SEO title="Charged Particles" />
            <Container fixed>
                <p>About Charged Particles!</p>
                <p>
                    <Button onClick={_goToAccelerator}>Particle Accelerator</Button>
                </p>
            </Container>
        </div>
    );
};

export default Main;
