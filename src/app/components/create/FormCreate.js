// Frameworks
import React, { useState, useContext, useEffect, useRef } from 'react';
import SwipeableViews from 'react-swipeable-views';
import * as _ from 'lodash';

// Data Context for State
import { WalletContext } from '../../stores/wallet.store';

// Material UI
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';

// Rimble UI
import NetworkIndicator from '@rimble/network-indicator';

// App Components
import FormCreateCommon from './FormCreateCommon';
import FormCreateFungible from './FormCreateFungible';
import FormCreateNonFungible from './FormCreateNonFungible';
import TabPanel from '../TabPanel';
import { GLOBALS } from '../../../utils/globals';
import { Helpers } from '../../../utils/helpers';

import useRootStyles from '../../layout/styles/root.styles';
const useCustomStyles = makeStyles(theme => ({
    visiblyDisabledButton: {
        background: theme.palette.action.disabledBackground,
        border: '1px solid #444',
        color: theme.palette.text.disabled,

        '&:hover': {
            background: theme.palette.action.disabledBackground,
            opacity: theme.palette.action.disabledOpacity,
        }
    }
}));


function a11yProps(index) {
    return {
        id: `particle-type-tab-${index}`,
        'aria-controls': `particle-type-tabpanel-${index}`,
    };
}

const NON_FUNGIBLE_TAB = 0;
const FUNGIBLE_TAB = 2;


// Create Route
const FormCreate = ({ onSubmitForm }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();
    const theme = useTheme();
    const [ walletState ] = useContext(WalletContext);
    const { networkId } = walletState;

    const [commonFields,        setCommonFields]        = useState({formValidated: false});
    const [fungibleFields,      setFungibleFields]      = useState({formValidated: false});
    const [nonFungibleFields,   setNonFungibleFields]   = useState({formValidated: true});

    const [paymentType,         setPaymentType]         = useState('eth');
    const [isPrivate,           setPrivate]             = useState(false);
    const [maxSupply,           setMaxSupply]           = useState(0);
    const [fungibilityTab,      setFungibilityTab]      = useState(0);
    const [formValidated,       setFormValidated]       = useState(false);
    const [triggerClear,        setTriggerClear]        = useState(null);
    const [triggerValidation,   setTriggerValidation]   = useState(null);

    const isNonFungible = fungibilityTab === NON_FUNGIBLE_TAB;

    const paymentInputLabelRef = useRef(null);
    const [paymentInputLabelWidth, setPaymentInputLabelWidth] = useState(0);
    useEffect(() => {
        setPaymentInputLabelWidth(paymentInputLabelRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        setFormValidated(_isAllValidated());
    }, [
        commonFields,
        fungibleFields,
        nonFungibleFields,
        fungibilityTab,
        setFormValidated,
    ]);

    const _isAllValidated = () => {
        if (!commonFields.formValidated) { return false; }
        if (fungibilityTab === FUNGIBLE_TAB && !fungibleFields.formValidated) { return false; }
        if (fungibilityTab === NON_FUNGIBLE_TAB && !nonFungibleFields.formValidated) { return false; }
        return true;
    };
    const _triggerValidation = () => {
        setTriggerValidation(Helpers.now());
    };
    const _triggerClearAll = () => {
        setTriggerClear(Helpers.now());
    };

    const _updatePaymentType = evt => {
        setPaymentType(evt.target.value);
    };

    const _handleFungibilityTab = (event, newValue) => {
        setFungibilityTab(newValue);
    };
    const _handleFungibilityTabIndex = index => {
        setFungibilityTab(index);
    };

    const _onCommonFieldsUpdate = (fields) => {
        setCommonFields(fields);
        setPrivate(fields.isPrivate);
        setMaxSupply(_.parseInt(fields.particleSupply, 10));
    };

    const _onFungibleUpdate = (fields) => {
        setFungibleFields(fields);
    };

    const _onNonFungibleUpdate = (fields) => {
        setNonFungibleFields(fields);
    };

    const _handleSubmit = async evt => {
        evt.preventDefault();
        if (!_isAllValidated()) {
            return _triggerValidation();
        }

        try {
            let result;
            let formData;
            if (fungibilityTab === FUNGIBLE_TAB) {
                formData = {
                    ...commonFields,
                    ...fungibleFields,
                    isNonFungible: false
                };

                result = parseFloat(formData.ethPerToken) * GLOBALS.ETH_UNIT;
                formData.ethPerToken = result.toLocaleString('fullwide', {useGrouping: false});

                result = _.parseInt(formData.amountToMint, 10) * GLOBALS.ETH_UNIT;
                formData.amountToMint = result.toLocaleString('fullwide', {useGrouping: false});
            } else {
                formData = {
                    ...commonFields,
                    ...nonFungibleFields,
                    isNonFungible: true
                };

                result = parseFloat(formData.particleCreatorFee);
                formData.particleCreatorFee = `${_.round(result * GLOBALS.DEPOSIT_FEE_MODIFIER / 100)}`;
            }

            result = _.parseInt(formData.particleSupply, 10) * GLOBALS.ETH_UNIT;
            formData.particleSupply = result.toLocaleString('fullwide', {useGrouping: false});

            // Pass Form Data to Parent
            if (await onSubmitForm({formData})) {
                _triggerClearAll();
            }
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
            <form autoComplete="off">
                <FormCreateCommon
                    onUpdate={_onCommonFieldsUpdate}
                    triggerClear={triggerClear}
                    triggerValidation={triggerValidation}
                />

                <Box py={5}>
                    <Grid container spacing={3} className={classes.gridRow}>
                        <Grid item xs={12}>
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={fungibilityTab}
                                    onChange={_handleFungibilityTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    aria-label="Token Type"
                                    centered
                                >
                                    <Tab label="Non-fungible" {...a11yProps(0)} />
                                    <Tab label="or" disabled />
                                    <Tab label="Fungible" {...a11yProps(2)} />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={fungibilityTab}
                                onChangeIndex={_handleFungibilityTabIndex}
                            >
                                <TabPanel group="wallets" value={fungibilityTab} index={0} boxSpacingY={3}>
                                    <FormCreateNonFungible
                                        onUpdate={_onNonFungibleUpdate}
                                        isPrivate={isPrivate}
                                        maxSupply={maxSupply}
                                        triggerClear={triggerClear}
                                    />
                                </TabPanel>
                                <TabPanel group="wallets" value={fungibilityTab} index={1} />
                                <TabPanel group="wallets" value={fungibilityTab} index={2} boxSpacingY={3}>
                                    <FormCreateFungible
                                        onUpdate={_onFungibleUpdate}
                                        isPrivate={isPrivate}
                                        maxSupply={maxSupply}
                                        triggerClear={triggerClear}
                                        triggerValidation={triggerValidation}
                                    />
                                </TabPanel>
                            </SwipeableViews>
                        </Grid>
                    </Grid>
                </Box>

                <Divider />

                <Box py={3}>
                    <Grid container spacing={3} className={classes.gridRow}>
                        <Grid item xs={12} sm={6}>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                                className={classes.gridRow}
                            >
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
                                justify="flex-end"
                                alignItems="center"
                                className={classes.gridRow}
                                style={{textAlign:'right'}}
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
                                        // disabled={!formValidated}
                                        variant="contained"
                                        color={formValidated ? 'primary' : 'default'}
                                        size="large"
                                        onClick={_handleSubmit}
                                        className={formValidated ? '' : customClasses.visiblyDisabledButton}
                                    >
                                        Create Particle
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
    )
};

export default FormCreate;
