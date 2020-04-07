// Frameworks
import React, { useState, useEffect, useRef, useContext } from 'react';
import * as _ from 'lodash';

// App Components
import ParticleEconomics from './ParticleEconomics';

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
import Typography from '@material-ui/core/Typography';

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';

const customFeeSettings = {
    'higher': {min: 1, max: 10, step: 0.1},
    'lower': {min: 0, max: 1, step: 0.01},
};


const NonFungibleParticle = ({ back, next }) => {
    const classes = useRootStyles();

    const [ rootState, rootDispatch ] = useContext(RootContext);
    const { createParticleData } = rootState;

    const [assetPair,       setParticleAssetPair]   = useState(createParticleData.assetPair || 'chai');
    const [energizeFee,     setParticleEnergizeFee] = useState(createParticleData.energizeFee || 0.25);
    const [energizeFeeMode, setEnergizeFeeMode]     = useState(createParticleData.energizeFee > 1 ? 'higher' : 'lower');

    const inputLabelRef = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    useEffect(() => {
        setLabelWidth(inputLabelRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        rootDispatch({
            type    : 'UPDATE_CREATION_DATA',
            payload : {assetPair, energizeFee}
        });
    }, [
        assetPair,
        energizeFee,
    ]);

    const updateParticleAssetPair = evt => {
        setParticleAssetPair(evt.target.value);
    };

    const updateParticleEnergizeFee = evt => {
        setParticleEnergizeFee(evt.target.value);
    };

    const slideParticleEnergizeFee = (evt, newValue) => {
        setParticleEnergizeFee(newValue);
    };

    const toggleHigherFees = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        setParticleEnergizeFee(customFeeSettings.lower.max);
        setEnergizeFeeMode(energizeFeeMode === 'lower' ? 'higher' : 'lower');
    };

    const _handleSubmit = async evt => {
        evt.preventDefault();
        next();
    };

    return (
        <>
            <Box py={2}>
                <ParticleEconomics />

                <Box py={5}><Divider /></Box>

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Typography>
                            Specify the Charge-Dynamics of your Particles, as well as any Energize Fees.
                        </Typography>
                        <ul>
                            <li>The Asset/Interest Pairing specifies which Asset Token (such as DAI) is used to Energize your Particles, and which Interest Token (such as CHAI) generates the Charge.</li>
                            <li>Asset Tokens must be deposited each time a Particle is Minted and/or Energized.  The creator earns the <em>Energize Fee</em> as a percentage of the deposited Asset Token, but held in the Interest Token, earning the creator interest on collected fees.</li>
                            <li>You can modify the Min &amp; Max amount of Asset Tokens that a single Particle can hold after you have created the Particle Type.</li>
                        </ul>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel ref={inputLabelRef} id="assetPairLabel">
                                Asset-Pair
                            </InputLabel>
                            <Select
                                id="assetPair"
                                labelId="assetPairLabel"
                                labelWidth={labelWidth}
                                value={assetPair}
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
                                    id="particleTypeEnergizeFee"
                                    label="Energize Fee (as %)"
                                    variant="outlined"
                                    type="number"
                                    min={customFeeSettings[energizeFeeMode].min}
                                    max={customFeeSettings[energizeFeeMode].max}
                                    step={customFeeSettings[energizeFeeMode].step}
                                    value={energizeFee}
                                    onChange={updateParticleEnergizeFee}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3} md={6}>
                                <Button onClick={toggleHigherFees} color="secondary">
                                    {energizeFeeMode === 'higher' ? 'lower' : 'higher'}
                                </Button>
                            </Grid>
                        </Grid>

                        <Slider
                            min={customFeeSettings[energizeFeeMode].min}
                            max={customFeeSettings[energizeFeeMode].max}
                            step={customFeeSettings[energizeFeeMode].step}
                            value={energizeFee}
                            onChange={slideParticleEnergizeFee}
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

export default NonFungibleParticle;
