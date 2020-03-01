// Frameworks
import React, { useContext } from 'react';
import UseAnimations from 'react-useanimations';
import * as _ from 'lodash';

// Material UI
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';

// Data Context for State
import { RootContext } from '../stores/root.store';


function ConnectionWarning() {
    const [ rootState ] = useContext(RootContext);
    const { connectionState } = rootState;

    if (_.isEmpty(connectionState) || connectionState.type !== 'WEB3_WRONG_NETWORK') {
        return '';
    }

    return (
        <Box mb={3}>
            <Alert
                variant="outlined"
                severity="error"
                icon={<UseAnimations animationKey="alertCircle" size={24} />}
            >
                {connectionState.message}
            </Alert>
        </Box>
    );
}

export { ConnectionWarning };
