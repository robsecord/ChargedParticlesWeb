// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// Data Context for State
import { RootContext } from '../../stores/root.store';
import { WalletContext } from '../../stores/wallet.store';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
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

let _fungibleClearTrigger = null;
let _fungibleValdationTrigger = null;

// Create Route
const FormCreateFungible = ({ onUpdate, triggerClear, triggerValidation, isPrivate, maxSupply }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();
    const [ rootState ] = useContext(RootContext);
    const { connectionState } = rootState;
    const [ walletState ] = useContext(WalletContext);
    const { allReady, connectedAddress } = walletState;

    const mintableMaxSupply = (maxSupply > 0) ? maxSupply : _amountToMintInputOptions.max;
    const mintableStep = Math.max(_.round(mintableMaxSupply / 1000), 1);

    const [mintReceiver,            setMintReceiver]        = useState('');
    const [amountToMint,            setAmountToMint]        = useState(0);
    const [amountToReserve,         setAmountToReserve]     = useState(mintableMaxSupply);
    const [ethPerToken,             setEthPerToken]         = useState(0);
    const [isMintReceiverValid,     setMintReceiverValid]   = useState(true);

    useEffect(() => {
        if (allReady && _.isEmpty(mintReceiver)) {
            setMintReceiver(connectedAddress);
            setMintReceiverValid(!_.isEmpty(connectedAddress));
        }
    }, []);

    useEffect(() => {
        const formValidated = _validateForm();
        onUpdate({
            formValidated,
            mintReceiver,
            amountToMint,
            ethPerToken,
        });
    }, [
        connectionState,
        mintReceiver,
        amountToMint,
        ethPerToken,
    ]);

    useEffect(() => {
        if (triggerValidation !== _fungibleValdationTrigger) {
            _fungibleValdationTrigger = triggerValidation;
            _validateAll();
        }
        if (triggerClear !== _fungibleClearTrigger) {
            _fungibleClearTrigger = triggerClear;
            _clearAll();
        }
        return () => {
            _fungibleClearTrigger = null;
            _fungibleValdationTrigger = null;
        };
    }, [triggerValidation, triggerClear]);

    const _validateAll = () => {
        setMintReceiverValid(!_.isEmpty(mintReceiver));
    };

    const _validateForm = () => {
        const conditions = [
            _.isEmpty(connectionState),
            !_.isEmpty(mintReceiver),
        ];
        return _.every(conditions, Boolean);
    };

    const _clearAll = () => {
        setMintReceiver('');
        setAmountToMint(0);
        setAmountToReserve(mintableMaxSupply);
        setEthPerToken(0);

        setMintReceiverValid(true);
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

    const _updateMintReceiver = evt => {
        const value = _.trim(evt.target.value);
        setMintReceiver(value);
        setMintReceiverValid(!_.isEmpty(value));
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

    return (
        <>
            <Grid container spacing={3} className={classes.gridRow}>
                <Grid item xs={6}>
                    <p className={customClasses.subHeading}>Initial Mint</p>
                    <TextField
                        id="mintReceiver"
                        label="Mint To"
                        variant="outlined"
                        onChange={_updateMintReceiver}
                        value={mintReceiver}
                        fullWidth
                        required
                        error={!isMintReceiverValid}
                    />
                </Grid>
                <Grid item xs={6}>
                    {
                        isPrivate
                            ? (
                                <p className={customClasses.subHeading}><s>Public Mint</s></p>
                            )
                            : (
                                <p className={customClasses.subHeading}>Public Mint</p>
                            )
                    }
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="ethPerToken">Token Price</InputLabel>
                        <OutlinedInput
                            id="ethPerToken"
                            startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                            onChange={_updateEthPerToken}
                            onBlur={_handleEthPerTokenBlur}
                            value={isPrivate ? 0 : ethPerToken}
                            fullWidth
                            labelWidth={100}
                            disabled={isPrivate}
                            inputProps={_ethPerTokenOptions}
                        />
                    </FormControl>
                </Grid>
            </Grid>


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
                        <InputLabel htmlFor="particleTypeSupply">Amount to {isPrivate ? 'Reserve' : 'Sell'}</InputLabel>
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

            <Box px={5}>
                <Slider
                    min={_amountToMintInputOptions.min}
                    max={mintableMaxSupply}
                    step={mintableStep}
                    value={amountToMint}
                    onChange={_slideAmountToMint}
                />
            </Box>
        </>
    )
};

export default FormCreateFungible;
