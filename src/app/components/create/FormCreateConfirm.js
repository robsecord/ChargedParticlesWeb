// Frameworks
import React, { useState, useEffect, useContext, useRef } from 'react';
import * as _ from 'lodash';

// App Components
import { Helpers } from '../../../utils/helpers';
import { GLOBALS } from '../../../utils/globals';

// Data Context for State
import { RootContext } from '../../stores/root.store';
import { WalletContext } from '../../stores/wallet.store';

// Material UI
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

// Rimble UI
import NetworkIndicator from '@rimble/network-indicator';

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';

// Create Route
const FormCreateConfirm = ({ back, next }) => {
    const classes = useRootStyles();

    const [ rootState ] = useContext(RootContext);
    const { createParticleData } = rootState;
    const isNonFungible = (createParticleData.classification !== 'plasma');

    const [ walletState ] = useContext(WalletContext);
    const { networkId } = walletState;

    const [paymentType, setPaymentType] = useState('eth');

    const paymentInputLabelRef = useRef(null);
    const [paymentInputLabelWidth, setPaymentInputLabelWidth] = useState(0);
    useEffect(() => {
        setPaymentInputLabelWidth(paymentInputLabelRef.current.offsetWidth);
    }, []);

    const _updatePaymentType = evt => {
        setPaymentType(evt.target.value);
    };

    const _handleSubmit = async evt => {
        evt.preventDefault();

        try {
            let tmp;
            let formData = {
                ...createParticleData,
                isNonFungible
            };
            if (isNonFungible) {
                tmp = parseFloat(formData.creatorFee);
                formData.creatorFee = `${_.round(tmp * GLOBALS.DEPOSIT_FEE_MODIFIER / 100)}`;
            } else {
                tmp = parseFloat(formData.ethPerToken) * GLOBALS.ETH_UNIT;
                formData.ethPerToken = tmp.toLocaleString('fullwide', {useGrouping: false});

                tmp = _.parseInt(formData.amountToMint, 10) * GLOBALS.ETH_UNIT;
                formData.amountToMint = tmp.toLocaleString('fullwide', {useGrouping: false});
            }

            tmp = _.parseInt(formData.supply, 10) * GLOBALS.ETH_UNIT;
            formData.supply = tmp.toLocaleString('fullwide', {useGrouping: false});

            // Submit Form
            next(formData);
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
        <Box py={2}>
            <Grid container spacing={3} className={classes.gridRow}>
                <Grid item xs={12} sm={6}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        className={classes.gridRow}
                    >
                        <Grid item xs={6}>
                            <Button
                                type="button"
                                variant="outlined"
                                size="large"
                                onClick={back}
                            >
                                back
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel ref={paymentInputLabelRef} id="particlePaymentLabel">
                                    Payment
                                </InputLabel>
                                <Select
                                    id="particlePayment"
                                    labelId="particlePaymentLabel"
                                    labelWidth={paymentInputLabelWidth}
                                    value={paymentType}
                                    onChange={_updatePaymentType}
                                >
                                    <MenuItem value={'eth'}>ETH - {Helpers.getFriendlyPrice('eth', isNonFungible)}</MenuItem>
                                    <MenuItem value={'ion'} disabled>ION - coming soon</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        className={classes.gridRow}
                    >
                        <Grid item xs={6}>
                            <NetworkIndicator
                                currentNetwork={networkId}
                                requiredNetwork={_.parseInt(GLOBALS.CHAIN_ID, 10)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={_handleSubmit}
                            >
                                Create Particle
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
};

export default FormCreateConfirm;
