// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// App Components
import { Helpers } from '../../../utils/helpers';
import { GLOBALS } from '../../../utils/globals';

// Data Context for State
import { RootContext } from '../../contexts/root';
import { WalletContext } from '../../contexts/wallet';

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
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';

const _amountToMintInputOptions = {
    step: 1,
    min: 1,
};

const FormMintSinglePlasma = ({ particle, onSubmit }) => {
    const classes = useRootStyles();

    const [ rootState ] = useContext(RootContext);
    const { connectionState } = rootState;

    const [ walletState ] = useContext(WalletContext);
    const { allReady, connectedAddress } = walletState;

    const mintFee = Helpers.toEther(particle.mintFee);
    const maxSupply = parseFloat(Helpers.toEther(particle.maxSupply));
    const totalMinted = parseFloat(Helpers.toEther(particle.totalMinted));
    const availableSupply = maxSupply - totalMinted;

    const [amountToMint,    setAmountToMint]  = useState(_amountToMintInputOptions.min);
    const [receiver,        setReceiver]      = useState('');
    const [isReceiverValid, setReceiverValid] = useState(true);
    const [formValidated,   setFormValidated] = useState(false);

    // console.log('FormMintSinglePlasma');
    // console.log(' - particle:', particle);
    // console.log(' - maxSupply:', maxSupply);
    // console.log(' - totalMinted:', totalMinted);
    // console.log(' - availableSupply:', availableSupply);
    // console.log(' - mintFee:', mintFee);


    useEffect(() => {
        if (allReady && _.isEmpty(receiver)) {
            setReceiver(connectedAddress);
            setReceiverValid(!_.isEmpty(connectedAddress));
        }
    }, []);

    useEffect(() => {
        setFormValidated(_validateForm());
    }, [connectionState, receiver, setFormValidated]);


    const _validateAll = () => {
        setReceiverValid(!_.isEmpty(receiver));
    };

    const _validateForm = () => {
        const conditions = [
            _.isEmpty(connectionState),
            !_.isEmpty(receiver),
        ];
        return _.every(conditions, Boolean);
    };

    const _handleSubmit = (evt) => {
        evt.preventDefault();
        if (!formValidated) {
            return _validateAll();
        }
        onSubmit({
            receiver,
            amountToMint,
        });
    };

    const _updateReceiver = evt => {
        const value = _.trim(evt.target.value);
        setReceiver(value);
        setReceiverValid(!_.isEmpty(value));
    };

    const _handleAmountBlur = () => {
        if (amountToMint < _amountToMintInputOptions.min) {
            setAmountToMint(_amountToMintInputOptions.min);
        } else if (amountToMint > availableSupply) {
            setAmountToMint(availableSupply);
        }
    };

    const _updateAmountToMint = evt => {
        const value = _.trim(evt.target.value);
        setAmountToMint(value);
    };

    const _slideAmountToMint = (evt, newValue) => {
        setAmountToMint(newValue);
    };


    return (
        <>
            <Box pt={2}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Grid container spacing={3} className={classes.gridRow}>
                            <Grid item xs={6}>
                                <TextField
                                    id="mintReceiver"
                                    label="Receiver"
                                    variant="outlined"
                                    onChange={_updateReceiver}
                                    value={receiver}
                                    fullWidth
                                    required
                                    error={!isReceiverValid}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <p>TODO: ENS Name Here..</p>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.gridRow}>
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
                                        labelWidth={130}
                                        inputProps={{
                                            ..._amountToMintInputOptions,
                                            max: availableSupply,
                                        }}
                                    />
                                </FormControl>

                                <Box px={5} py={1}>
                                    <Slider
                                        min={_amountToMintInputOptions.min}
                                        max={availableSupply}
                                        step={_amountToMintInputOptions.step}
                                        value={parseFloat(amountToMint)}
                                        onChange={_slideAmountToMint}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box py={1.5}>
                                    <Typography>
                                        <small>@ &nbsp; {Helpers.toEther(particle.mintFee)} ETH</small> &nbsp;
                                        = &nbsp; <strong>{_.round(mintFee * amountToMint, GLOBALS.ETH_DISPLAY_PRECISION)} ETH</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Box>

            <Divider />

            <Box py={2}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
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
                                variant={formValidated ? 'contained' : 'outlined'}
                                color={formValidated ? 'primary' : 'default'}
                                size="large"
                                onClick={_handleSubmit}
                            >
                                Mint
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
};

export default FormMintSinglePlasma;
