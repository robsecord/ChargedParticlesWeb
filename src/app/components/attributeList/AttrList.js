// Frameworks
import React from 'react';
import * as _ from 'lodash';

// Material UI
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Alert from '@material-ui/lab/Alert';

import AttrListItem from "./AttrListItem";

const AttrList = ({ attributes, onRemove }) => {
    if (_.size(attributes) < 1) {
        return (
            <Box py={4}>
                <Alert variant="outlined" severity="info">
                    No Attributes Selected.
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <List style={{ overflow: "scroll" }}>
                {_.map(attributes, (attr, idx) => (
                    <AttrListItem
                        {...attr}
                        key={`Attribute.${idx}`}
                        onRemove={() => onRemove(idx)}
                    />
                ))}
            </List>
        </Box>
    )
};

export default AttrList;
