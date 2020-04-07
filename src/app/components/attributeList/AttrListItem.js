// Frameworks
import React from 'react';
import * as _ from 'lodash';

// Material UI
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CheckIcon from '@material-ui/icons/Check';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';


const AttrListItem = ({ type, name, value, maxValue, onRemove }) => {

    const max = !_.isEmpty(maxValue) ? ` of ${maxValue}` : '';
    const text = `${_.startCase(type)} -- ${name}: ${value}${max}`;

    return (
        <ListItem>
            <ListItemIcon>
                <CheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={text} />
            <ListItemSecondaryAction>
                <IconButton aria-label="Delete Attribute" onClick={onRemove}>
                    <DeleteOutlined />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default AttrListItem;
