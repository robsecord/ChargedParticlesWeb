// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// App Components
import ParticleEconomics from './ParticleEconomics';

// Data Context for State
import { RootContext } from '../../contexts/root';

// Material UI
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';

const _amountToMintInputOptions = {
    step: 10,
    min: 0,
    max: 999999999999999, // = 1 QUADRILLION - 1;  Need larger?  Set to 0 for unlimited (nearly, 2^256-1)
    type: 'number',
};


const FungibleParticle = ({ back, next }) => {
    const classes = useRootStyles();

    const [ rootState, rootDispatch ] = useContext(RootContext);
    const { connectionState, createParticleData } = rootState;

    const mintableMaxSupply = _.parseInt((createParticleData.supply > 0) ? createParticleData.supply : _amountToMintInputOptions.max, 10);
    const mintableStep = Math.max(_.round(mintableMaxSupply / 1000), 1);

    let mintAmount = createParticleData.amountToMint || 0;
    if (mintAmount > mintableMaxSupply) {
        mintAmount = mintableMaxSupply;
    }
    const reserve = mintableMaxSupply - mintAmount;

    const [amountToMint,    setAmountToMint]    = useState(mintAmount);
    const [amountToReserve, setAmountToReserve] = useState(reserve);

    useEffect(() => {
        rootDispatch({
            type    : 'UPDATE_CREATION_DATA',
            payload : {amountToMint}
        });
    }, [
        connectionState,
        amountToMint,
    ]);

    const _updateAmounts = (toMint) => {
        // if (_.isEmpty(toMint)) { toMint = '0'; }
        setAmountToMint(toMint);
        setAmountToReserve(Math.max(mintableMaxSupply - toMint, 0));
    };

    const _handleAmountBlur = () => {
        if (amountToMint < _amountToMintInputOptions.min) {
            _updateAmounts(_amountToMintInputOptions.min);
        } else if (amountToMint > mintableMaxSupply) {
            _updateAmounts(mintableMaxSupply);
        }
    };

    const _updateAmountToMint = evt => {
        const value = _.trim(evt.target.value);
        _updateAmounts(value);
    };

    const _slideAmountToMint = (evt, newValue) => {
        _updateAmounts(newValue);
    };

    const _handleSubmit = async evt => {
        evt.preventDefault();
        next();
    };

    return (
        <>
            <Box pt={2}>
                <ParticleEconomics />

                <Box py={5}><Divider /></Box>

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Typography>
                            Specify the amount of Particles to pre-mint.
                        </Typography>
                        <ul>
                            <li>You may choose to pre-mint any amount of particles to yourself.</li>
                            {
                                createParticleData.isPrivate
                                    ? (<li>The remaining particles will be held in reserve for you to mint at a later time.</li>)
                                    : (<li>The remaining particles will be available for public sale on the Market Page.</li>)
                            }
                        </ul>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={3} className={classes.gridRow}>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="particleTypeSupply">Amount to Mint</InputLabel>
                                    <OutlinedInput
                                        id="amountToMint"
                                        onChange={_updateAmountToMint}
                                        onBlur={_handleAmountBlur}
                                        value={amountToMint}
                                        fullWidth
                                        labelWidth={126}
                                        inputProps={{
                                            ..._amountToMintInputOptions,
                                            step: mintableStep,
                                            max: mintableMaxSupply,
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="particleTypeSupply">Amount to {createParticleData.isPrivate ? 'Reserve' : 'Sell'}</InputLabel>
                                    <OutlinedInput
                                        id="amountToReserve"
                                        value={amountToReserve}
                                        readOnly
                                        fullWidth
                                        labelWidth={122}
                                        inputProps={{
                                            ..._amountToMintInputOptions,
                                            step: mintableStep,
                                            max: mintableMaxSupply,
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Box px={5} py={1}>
                            <Slider
                                min={_amountToMintInputOptions.min}
                                max={mintableMaxSupply}
                                step={mintableStep}
                                value={amountToMint}
                                onChange={_slideAmountToMint}
                            />
                        </Box>
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

export default FungibleParticle;
