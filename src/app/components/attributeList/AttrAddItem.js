// Frameworks
import React, { useState, useEffect, useRef } from 'react';
import * as _ from 'lodash';

// Material UI
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';


const AttrAddItem = ({ onAddItem }) => {
    const [type,          setType]          = useState('');
    const [name,          setName]          = useState('');
    const [value,         setValue]         = useState('');
    const [maxValue,      setMaxValue]      = useState('');

    const [formValidated, setFormValidated] = useState(false);
    const [isNameValid,   setNameValid]     = useState(true);
    const [isValueValid,  setValueValid]    = useState(true);

    const isNumericValue = !/properties|date/i.test(type);
    let valueLabel = 'Number Value';
    if (type === 'properties') { valueLabel = 'Text Value'; }
    if (type === 'date') { valueLabel = 'Date Value'; }

    useEffect(() => {
        setFormValidated(_validateForm());
    }, [
        type,
        name,
        value,
        maxValue,
    ]);

    const _getFormData = () => {
        return {
            type,
            name,
            value,
            maxValue,
        };
    };

    const _validateAll = () => {
        setNameValid(!_.isEmpty(name));
        setValueValid(!_.isEmpty(value));
    };

    const _validateForm = () => {
        const conditions = [
            !_.isEmpty(name),
            !_.isEmpty(value),
        ];
        return _.every(conditions, Boolean);
    };

    const _updateType = evt => {
        setType(evt.target.value);
        setValue('');
        setMaxValue('');
    };

    const _updateName = evt => {
        const val = evt.target.value;
        setName(val);
        setNameValid(!_.isEmpty(val));
    };

    const _updateValue = evt => {
        const val = evt.target.value;
        setValue(val);
        setValueValid(!_.isEmpty(val));
    };

    const _updateMaxValue = evt => {
        const val = evt.target.value;
        setMaxValue(val);
    };

    const _addItem = () => {
        if (!formValidated) {
            return _validateAll();
        }
        onAddItem(_getFormData());
        setName('');
        setValue('');
        setMaxValue('');
    };

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid xs={5} item>
                    <TextField
                        id="attributeType"
                        label="Attribute Type"
                        variant="outlined"
                        size="small"
                        value={type}
                        onChange={_updateType}
                        select
                        fullWidth
                        required
                    >
                        <MenuItem value={'properties'}>Properties</MenuItem>
                        <MenuItem value={'rankings'}>Rankings</MenuItem>
                        <MenuItem value={'boost_number'}>Boost-Number</MenuItem>
                        <MenuItem value={'boost_percentage'}>Boost-Percent</MenuItem>
                        <MenuItem value={'stats'}>Stats</MenuItem>
                        <MenuItem value={'date'} disabled>Date (coming soon)</MenuItem>
                    </TextField>
                </Grid>
                <Grid xs={5} item>
                    <TextField
                        id="attributeName"
                        label="Name"
                        variant="outlined"
                        size="small"
                        onChange={_updateName}
                        value={name}
                        fullWidth
                        required
                        error={!isNameValid}
                    />
                </Grid>
                <Grid xs={5} item>
                    <TextField
                        id="attributeValue"
                        label={valueLabel}
                        variant="outlined"
                        size="small"
                        type={isNumericValue ? 'number' : 'text'}
                        value={value}
                        onChange={_updateValue}
                        fullWidth
                        required
                        error={!isValueValid}
                    />
                </Grid>
                <Grid xs={5} item>
                    {
                        isNumericValue && (
                            <TextField
                                id="attributeMaxValue"
                                label="Max Value"
                                variant="outlined"
                                size="small"
                                type="number"
                                value={maxValue}
                                onChange={_updateMaxValue}
                                fullWidth
                            />
                        )
                    }
                </Grid>
                <Grid xs={2} item>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={_addItem}
                        fullWidth
                    >
                        <AddCircleOutlineIcon /> &nbsp; Add
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AttrAddItem;
