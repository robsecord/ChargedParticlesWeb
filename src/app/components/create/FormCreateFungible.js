// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// Data Context for State
import { RootContext } from '../../stores/root.store';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Slider from '@material-ui/core/Slider';

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';
const useCustomStyles = makeStyles(theme => ({
    subHeading: {
        marginTop: 0,
        fontSize: '0.7rem',
        color: theme.palette.grey[500],
        textAlign: 'center',
        textTransform: 'uppercase',

        '& s': {
            textDecorationColor: 'white',
            textDecorationThickness: '3px',
        }
    },
}));

const _ethPerTokenOptions = {
    step: 0.00001,
    min: 0,
    max: 10,
    type: 'number',
};

const _amountToMintInputOptions = {
    step: 10,
    min: 0,
    max: 999999999999999, // = 1 QUADRILLION - 1;  Need larger?  Set to 0 for unlimited (nearly, 2^256-1)
    type: 'number',
};

// Create Route
const FormCreateFungible = ({ back, next }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();

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
    const [ethPerToken,     setEthPerToken]     = useState(createParticleData.ethPerToken || 0);

    useEffect(() => {
        const formData = _getFormData();
        rootDispatch({
            type    : 'UPDATE_CREATION_DATA',
            payload : formData
        });
    }, [
        connectionState,
        amountToMint,
        ethPerToken,
    ]);

    const _getFormData = () => {
        return {
            amountToMint,
            ethPerToken,
        };
    };

    const _updateAmounts = (toMint) => {
        // if (_.isEmpty(toMint)) { toMint = '0'; }
        setAmountToMint(toMint);
        setAmountToReserve(Math.max(mintableMaxSupply - toMint, 0));
    };

    const _handleEthPerTokenBlur = () => {
        if (ethPerToken < _ethPerTokenOptions.min) {
            setEthPerToken(_ethPerTokenOptions.min);
        } else if (ethPerToken > _ethPerTokenOptions.max) {
            setEthPerToken(_ethPerTokenOptions.max);
        }
    };

    const _handleAmountBlur = () => {
        if (amountToMint < _amountToMintInputOptions.min) {
            _updateAmounts(_amountToMintInputOptions.min);
        } else if (amountToMint > mintableMaxSupply) {
            _updateAmounts(mintableMaxSupply);
        }
    };

    const _updateEthPerToken = evt => {
        const value = _.trim(evt.target.value);
        setEthPerToken(value);
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

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={8}>
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
                                        labelWidth={125}
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
                                        labelWidth={125}
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
                    <Grid item xs={4}>
                        {
                            !createParticleData.isPrivate && (
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="ethPerToken">Token Price</InputLabel>
                                    <OutlinedInput
                                        id="ethPerToken"
                                        startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                                        onChange={_updateEthPerToken}
                                        onBlur={_handleEthPerTokenBlur}
                                        value={createParticleData.isPrivate ? 0 : ethPerToken}
                                        fullWidth
                                        labelWidth={100}
                                        disabled={createParticleData.isPrivate}
                                        inputProps={_ethPerTokenOptions}
                                    />
                                </FormControl>
                            )
                        }
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

export default FormCreateFungible;
