// Frameworks
import React, { useState, useEffect, useRef, useContext } from 'react';

// Data Context for State
import { RootContext } from '../../stores/root.store';

// Material UI
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';

const customFeeSettings = {
    'higher': {min: 1, max: 10, step: 0.1},
    'lower': {min: 0, max: 1, step: 0.01},
};


// Create Route
const FormCreateNonFungible = ({ back, next }) => {
    const classes = useRootStyles();

    const [ rootState, rootDispatch ] = useContext(RootContext);
    const { createParticleData } = rootState;

    const [particleAssetPair,   setParticleAssetPair]   = useState(createParticleData.assetPair || 'chai');
    const [particleCreatorFee,  setParticleCreatorFee]  = useState(createParticleData.creatorFee || 0.25);
    const [creatorFeeMode,      setCreatorFeeMode]      = useState(createParticleData.creatorFee > 1 ? 'higher' : 'lower');

    const inputLabelRef = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    useEffect(() => {
        setLabelWidth(inputLabelRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        const formData = _getFormData();
        rootDispatch({
            type    : 'UPDATE_CREATION_DATA',
            payload : formData
        });
    }, [
        particleAssetPair,
        particleCreatorFee,
    ]);

    const _getFormData = () => {
        return {
            assetPair: particleAssetPair,
            creatorFee: particleCreatorFee,
        };
    };

    const updateParticleAssetPair = evt => {
        setParticleAssetPair(evt.target.value);
    };

    const updateParticleCreatorFee = evt => {
        setParticleCreatorFee(evt.target.value);
    };

    const slideParticleCreatorFee = (evt, newValue) => {
        setParticleCreatorFee(newValue);
    };

    const toggleHigherFees = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        setParticleCreatorFee(customFeeSettings.lower.max);
        setCreatorFeeMode(creatorFeeMode === 'lower' ? 'higher' : 'lower');
    };

    const _handleSubmit = async evt => {
        evt.preventDefault();
        next();
    };

    return (
        <>
            <Box py={2}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel ref={inputLabelRef} id="particleAssetPairLabel">
                                Asset-Pair
                            </InputLabel>
                            <Select
                                id="particleAssetPair"
                                labelId="particleAssetPairLabel"
                                labelWidth={labelWidth}
                                value={particleAssetPair}
                                onChange={updateParticleAssetPair}
                            >
                                <MenuItem value={'chai'}>DAI - CHAI</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={0}>
                            <Grid item xs={9} md={6}>
                                <TextField
                                    id="particleTypeCreatorFee"
                                    label="Deposit Fee (as %)"
                                    variant="outlined"
                                    type="number"
                                    min={customFeeSettings[creatorFeeMode].min}
                                    max={customFeeSettings[creatorFeeMode].max}
                                    step={customFeeSettings[creatorFeeMode].step}
                                    value={particleCreatorFee}
                                    onChange={updateParticleCreatorFee}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} md={6}>
                                <Button onClick={toggleHigherFees} color="secondary">
                                    {creatorFeeMode === 'higher' ? 'lower' : 'higher'}
                                </Button>
                            </Grid>
                        </Grid>

                        <Slider
                            min={customFeeSettings[creatorFeeMode].min}
                            max={customFeeSettings[creatorFeeMode].max}
                            step={customFeeSettings[creatorFeeMode].step}
                            value={particleCreatorFee}
                            onChange={slideParticleCreatorFee}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Divider />

            <Box py={2}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12} sm={6}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            className={classes.gridRow}
                        >
                            <Button
                                type="button"
                                variant="outlined"
                                size="large"
                                onClick={back}
                            >
                                back
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            className={classes.gridRow}
                            style={{textAlign:'right'}}
                        >
                            <Button
                                type="button"
                                variant={'contained'}
                                color={'primary'}
                                size="large"
                                onClick={_handleSubmit}
                            >
                                next
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
};

export default FormCreateNonFungible;
