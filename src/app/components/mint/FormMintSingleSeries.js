// Frameworks
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';

// App Components
import Wallet from '../../wallets';
import UnlockableAssetInput from '../UnlockableAssetInput';
import { Helpers } from '../../../utils/helpers';
import { GLOBALS } from '../../../utils/globals';

// Data Context for State
import { useNetworkContext } from '../../contexts/network';
import { useWalletContext } from '../../contexts/wallet';

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

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';


const FormMintSingleSeries = ({ particle, onSubmit }) => {
    const classes = useRootStyles();
    const wallet = Wallet.instance();

    const [ networkState ] = useNetworkContext();
    const { connectionState } = networkState;

    const [ walletState ] = useWalletContext();
    const { allReady, connectedAddress } = walletState;

    const [receiver,            setReceiver]         = useState('');
    const [receiverEns,         setReceiverEns]      = useState('');
    const [assetAmount,         setAssetAmount]      = useState(0);
    const [isReceiverValid,     setReceiverValid]    = useState(true);
    const [isAssetAmountValid,  setAssetAmountValid] = useState(true);
    const [formValidated,       setFormValidated]    = useState(false);


    useEffect(() => {
        if (allReady && _.isEmpty(receiver)) {
            setReceiver(connectedAddress);
            setReceiverValid(!_.isEmpty(connectedAddress));
        }
    }, []);

    useEffect(() => {
        (async () => {
            if (!_.isEmpty(receiver)) {
                const ensName = await wallet.getEnsName(receiver);
                if (!_.isUndefined(ensName)) {
                    setReceiverEns(ensName);
                }
            }
        })();
    }, [wallet, receiver, setReceiverEns]);

    useEffect(() => {
        setFormValidated(_validateForm());
    }, [connectionState, receiver, isAssetAmountValid, setFormValidated]);


    const _validateAll = () => {
        setReceiverValid(!_.isEmpty(receiver));
        setAssetAmountValid(isAssetAmountValid);
    };

    const _validateForm = () => {
        const conditions = [
            _.isEmpty(connectionState),
            !_.isEmpty(receiver),
            isAssetAmountValid,
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
            assetAmount,
        });
    };

    const _updateReceiver = evt => {
        const value = _.trim(evt.target.value);
        setReceiver(value);
        setReceiverValid(!_.isEmpty(value));
    };

    const _updateAssetAmount = ({amount, assetPairId, isValid}) => {
        console.log('amount', amount, assetPairId, isValid);
        setAssetAmount(amount);
        setAssetAmountValid(isValid);
    };

    return (
        <>
            <Box pt={2} pb={3}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Grid container spacing={3} className={classes.gridRow}>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
                                <p>{receiverEns}</p>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Grid container spacing={3} className={classes.gridRow}>
                            <Grid item xs={12} sm={6}>
                                <UnlockableAssetInput
                                    particle={particle}
                                    onUpdate={_updateAssetAmount}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <p>...</p>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Box>

            <Divider />

            <Box py={2} px={3}>
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
                                variant={'contained'}
                                color={'primary'}
                                size="large"
                                onClick={_handleSubmit}
                                disabled={!formValidated}
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

export default FormMintSingleSeries;
