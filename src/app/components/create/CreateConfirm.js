// Frameworks
import React, { useState, useEffect, useContext, useRef } from 'react';
import { navigate } from 'gatsby';
import * as _ from 'lodash';

// App Components
import DisplayContractValue from '../DisplayContractValue';
import { Helpers } from '../../../utils/helpers';
import { GLOBALS } from '../../../utils/globals';

// Data Context for State
import { RootContext } from '../../contexts/root';
import { WalletContext } from '../../contexts/wallet';

// Material UI
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

// Rimble UI
import NetworkIndicator from '@rimble/network-indicator';

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';


const CreateConfirm = ({ back, next }) => {
    const classes = useRootStyles();

    const [ rootState ] = useContext(RootContext);
    const { createParticleData } = rootState;
    const isNonFungible = (createParticleData.classification !== 'plasma');

    const [ walletState ] = useContext(WalletContext);
    const { connectedBalance, connectedAddress } = walletState;

    const [paymentType, setPaymentType] = useState('eth');
    const [ionBalance, setIonBalance] = useState(0);

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
                tmp = parseFloat(formData.energizeFee);
                formData.energizeFee = `${_.round(tmp * GLOBALS.DEPOSIT_FEE_MODIFIER / 100)}`;
            } else {
                tmp = _.parseInt(formData.amountToMint, 10) * GLOBALS.ETH_UNIT;
                formData.amountToMint = tmp.toLocaleString('fullwide', {useGrouping: false});
            }

            tmp = parseFloat(formData.mintFee) * GLOBALS.ETH_UNIT;
            formData.mintFee = tmp.toLocaleString('fullwide', {useGrouping: false});

            tmp = _.parseInt(formData.supply, 10) * GLOBALS.ETH_UNIT;
            formData.supply = tmp.toLocaleString('fullwide', {useGrouping: false});

            formData.accessType = `${_.parseInt(formData.accessType, 10)}`;

            formData.payWithIons = (paymentType === 'ion');

            // Submit Form
            next(formData);
        }
        catch (err) {
            console.error(err);
        }
    };

    const _goMintIons = () => {
        navigate(`${GLOBALS.ACCELERATOR_ROOT}/mint/${GLOBALS.ION_TOKEN_ID}`);
    };

    const _wrapBalance = (value) => {
        return (
            <Box py={2}>
                <Typography component={'p'} variant={'body1'}>
                    {value}
                </Typography>
            </Box>
        );
    };

    const _getIonBalance = () => {
        if (_.isEmpty(connectedAddress)) { return ''; }
        return (
            <Grid container spacing={3} className={classes.gridRow}>
                <Grid item xs={12} sm={8}>
                    <DisplayContractValue
                        contractName="ChargedParticles"
                        method="balanceOf"
                        methodArgs={[connectedAddress, GLOBALS.ION_TOKEN_ID]}
                        formatValue={Helpers.toEtherWithLocale}
                        defaultValue={'0'}
                        render={value => _wrapBalance(`Your balance: ${value} IONs`)}
                        onValue={({ raw }) => {
                            setIonBalance(Helpers.toEther(raw));
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    {
                        (ionBalance < 10) && (
                            <Box py={2}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    size="small"
                                    onClick={_goMintIons}
                                >
                                    get some
                                </Button>
                            </Box>
                        )
                    }
                </Grid>
            </Grid>
        );
    };

    const _getEthBalance = () => {
        if (_.isEmpty(connectedAddress)) { return ''; }
        const value = Helpers.toEtherWithLocale(connectedBalance, GLOBALS.ETH_DISPLAY_PRECISION);
        return _wrapBalance(`Your balance: ${value} ETH`);
    };

    return (
        <>
            <Box py={5}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12} sm={6}>
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
                                <MenuItem value={'eth'}>{Helpers.getFriendlyPrice('eth', isNonFungible)} ETH</MenuItem>
                                <MenuItem value={'ion'}>{Helpers.getFriendlyPrice('ion', isNonFungible)} ION</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {(paymentType === 'eth') && _getEthBalance()}
                        {(paymentType === 'ion') && _getIonBalance()}
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
                                Create Particle
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
};

export default CreateConfirm;
