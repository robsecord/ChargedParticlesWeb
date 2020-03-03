// Frameworks
import React, { useState, useEffect, useRef } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';

const customFeeSettings = {
    'higher': {min: 1, max: 10, step: 0.1},
    'lower': {min: 0, max: 1, step: 0.01},
};

let _nonFungibleClearTrigger = null;

// Create Route
const FormCreateNonFungible = ({ onUpdate, triggerClear, isPrivate, maxSupply }) => {
    const classes = useRootStyles();

    const [particleAssetPair,   setParticleAssetPair]   = useState('chai');
    const [particleCreatorFee,  setParticleCreatorFee]  = useState(0.25);
    const [creatorFeeMode,      setCreatorFeeMode]      = useState('lower');

    const inputLabelRef = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    useEffect(() => {
        setLabelWidth(inputLabelRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        onUpdate({
            formValidated: true,
            particleAssetPair,
            particleCreatorFee,
        });
    }, [
        particleAssetPair,
        particleCreatorFee,
    ]);

    useEffect(() => {
        if (triggerClear !== _nonFungibleClearTrigger) {
            _nonFungibleClearTrigger = triggerClear;
            _clearAll();
        }
        return () => {
            _nonFungibleClearTrigger = null;
        };
    }, [triggerClear]);


    const _clearAll = () => {
        setParticleAssetPair('chai');
        setParticleCreatorFee(0.25);
        setCreatorFeeMode('lower');
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

    return (
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
    )
};

export default FormCreateNonFungible;
