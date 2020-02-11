// Frameworks
import React, { useContext } from 'react';
import * as _ from 'lodash';

// Rimble UI
import { Flash } from 'rimble-ui';

// Data Context for State
import { RootContext } from '../stores/root.store';


function ConnectionWarning() {
    const [ rootState ] = useContext(RootContext);
    const { connectionWarning } = rootState;

    if (_.isEmpty(connectionWarning)) {
        return '';
    }

    return (
        <Flash mt={2} mb={4} variant="danger">
            {connectionWarning}
        </Flash>
    );
}

export { ConnectionWarning };
