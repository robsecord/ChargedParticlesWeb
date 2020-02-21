// Frameworks
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Buffer } from 'buffer';
import * as _ from 'lodash';

// App Components
import { GLOBALS } from '../../utils/globals';
import { Helpers } from '../../utils/helpers';

// Data Context for State
import { RootContext } from '../stores/root.store';
import { WalletContext } from '../stores/wallet.store';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

// Rimble UI
import NetworkIndicator from '@rimble/network-indicator';


const useCustomStyles = makeStyles(theme => ({
    gridRow: {
        marginTop: '0.5rem',
    },
    formControl: {
        width: '100%'
    },
    switchLabel: {
        pointerEvents: 'none',
        marginTop: -9,
    },
    switchControl: {
        marginTop: 8,
        marginLeft: 7,
        marginRight: 2,
    },
    fileInput: {
        display: 'none',
    },
    fileName: {
        display: 'inline-block',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    fileNameLabel: {
        width: '80%',
    },
    outlined: {
        background: 'transparent',
        border: '1px solid #444',
    },
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

const customFeeSettings = {
    'higher': {min: 1, max: 10, step: 0.1},
    'lower': {min: 0, max: 1, step: 0.01},
};


// Create Route
const FormCreateParticle = ({ onSubmitForm }) => {
    const classes = useCustomStyles();
    const [ rootState ] = useContext(RootContext);
    const { connectionWarning } = rootState;
    const [ walletState ] = useContext(WalletContext);
    const { allReady, networkId, connectedAddress } = walletState;

    const [particleName,        setParticleName]        = useState('');
    const [particleSymbol,      setParticleSymbol]      = useState('');
    const [particleIcon,        setParticleIcon]        = useState('Upload Particle Icon *');
    const [particleIconBuffer,  setParticleIconBuffer]  = useState('');
    const [particleCreator,     setParticleCreator]     = useState('');
    const [particleDesc,        setParticleDesc]        = useState('');
    const [particleSupply,      setParticleSupply]      = useState(0);
    const [particleAssetPair,   setParticleAssetPair]   = useState('chai');
    const [particleCreatorFee,  setParticleCreatorFee]  = useState(0.25);
    const [particlePaymentType, setParticlePaymentType] = useState('eth');
    const [creatorFeeMode,      setCreatorFeeMode]      = useState('lower');
    const [isNonFungible,       setNonFungible]         = useState(true);
    const [isPrivate,           setPrivate]             = useState(false);

    const [formValidated,          setFormValidated]        = useState(false);
    const [isParticleNameValid,    setParticleNameValid]    = useState(true);
    const [isParticleSymbolValid,  setParticleSymbolValid]  = useState(true);
    const [isParticleDescValid,    setParticleDescValid]    = useState(true);
    const [isParticleCreatorValid, setParticleCreatorValid] = useState(true);
    const [isParticleIconValid,    setParticleIconValid]    = useState(true);

    const inputLabelRef = useRef(null);
    const paymentInputLabelRef = useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const [paymentTypeLabelWidth, setPaymentTypeLabelWidth] = React.useState(0);
    useEffect(() => {
        setLabelWidth(inputLabelRef.current.offsetWidth);
        setPaymentTypeLabelWidth(paymentInputLabelRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        if (allReady && _.isEmpty(particleCreator)) {
            setParticleCreator(connectedAddress);
        }
    }, [allReady, connectedAddress, setParticleCreator]);

    useEffect(() => {
        validateForm();
    }, [
        setFormValidated,
        connectionWarning,
        particleName,
        particleSymbol,
        particleDesc,
        particleCreator,
        particleIconBuffer,
    ]);

    const validateAll = () => {
        setParticleNameValid(!_.isEmpty(particleName));
        setParticleSymbolValid(!_.isEmpty(particleSymbol));
        setParticleCreatorValid(!_.isEmpty(particleCreator));
        setParticleIconValid(!_.isEmpty(particleIconBuffer));
        setParticleDescValid(!_.isEmpty(particleDesc));
    };

    const validateForm = () => {
        const conditions = [
            _.isEmpty(connectionWarning),
            !_.isEmpty(particleName),
            !_.isEmpty(particleSymbol),
            !_.isEmpty(particleDesc),
            !_.isEmpty(particleCreator),
            !_.isEmpty(particleIconBuffer),
        ];
        setFormValidated(_.every(conditions, Boolean));
    };

    const _cleanParticleIconDisplay = (filename) => {
        return _.last(filename.split('\\'));
    };

    const updateParticleName = evt => {
        const value = _.trim(evt.target.value);
        setParticleName(value);
        setParticleNameValid(!_.isEmpty(value));
    };

    const updateParticleSymbol = evt => {
        const value = _.trim(evt.target.value);
        setParticleSymbol(_.toUpper(value));
        setParticleSymbolValid(!_.isEmpty(value));
    };

    const updateParticleCreator = evt => {
        const value = _.trim(evt.target.value);
        setParticleCreator(value);
        setParticleCreatorValid(!_.isEmpty(value));
    };

    const updateParticleIcon = evt => {
        evt.preventDefault();
        evt.stopPropagation();

        const value = evt.target.value;
        const file = evt.target.files[0];
        if (_.isUndefined(file)) { return; }

        setParticleIcon(value);
        setParticleIconValid(!_.isUndefined(file));

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setParticleIconBuffer(Buffer(reader.result));
        };
    };

    const updateParticleDesc = evt => {
        const value = _.trim(evt.target.value);
        setParticleDesc(value);
        setParticleDescValid(!_.isEmpty(value));
    };

    const updateParticleSupply = evt => {
        setParticleSupply(evt.target.value);
    };

    const updateParticleAssetPair = evt => {
        setParticleAssetPair(evt.target.value);
    };

    const updateParticleCreatorFee = evt => {
        setParticleCreatorFee(evt.target.value);
    };

    const updateParticlePaymentType = evt => {
        setParticlePaymentType(evt.target.value);
    };

    const slideParticleCreatorFee = (evt, newValue) => {
        setParticleCreatorFee(newValue);
    };

    const toggleNonFungible = (evt, expanded) => {
        setNonFungible(expanded);
    };

    const togglePrivate = (evt, _private) => {
        setPrivate(_private);
    };

    const toggleHigherFees = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        setParticleCreatorFee(customFeeSettings.lower.max);
        setCreatorFeeMode(creatorFeeMode === 'lower' ? 'higher' : 'lower');
    };

    const handleSubmit = async evt => {
        evt.preventDefault();
        if (!formValidated) {
            return validateAll();
        }

        try {
            const formData = {
                particleName,
                particleSymbol,
                particleDesc,
                particleCreator,
                particleIconBuffer,
                isNonFungible,
                isPrivate
            };

            formData.particleAssetPair  = particleAssetPair; // Helpers.toBytes16(particleAssetPair);
            formData.particleSupply     = `${particleSupply}000000000000000000`;  //particleSupply * GLOBALS.ETH_UNIT;
            formData.particleCreatorFee = particleCreatorFee * GLOBALS.DEPOSIT_FEE_MODIFIER / 100;

            // Pass Form Data to Parent
            onSubmitForm({formData});
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
            <form>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={6}>
                        <TextField
                            id="particleTypeName"
                            label="Name"
                            variant="outlined"
                            onChange={updateParticleName}
                            value={particleName}
                            fullWidth
                            required
                            error={!isParticleNameValid}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            id="particleTypeSymbol"
                            label="Symbol"
                            variant="outlined"
                            onChange={updateParticleSymbol}
                            value={particleSymbol}
                            fullWidth
                            required
                            error={!isParticleSymbolValid}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <TextField
                            id="particleTypeDesc"
                            label="Description"
                            variant="outlined"
                            onChange={updateParticleDesc}
                            value={particleDesc}
                            multiline
                            rows="4"
                            fullWidth
                            required
                            error={!isParticleDescValid}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="particleTypeCreator"
                            label="Creator"
                            variant="outlined"
                            onChange={updateParticleCreator}
                            value={particleCreator}
                            fullWidth
                            required
                            error={!isParticleCreatorValid}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    className={classes.switchControl}
                                    checked={isPrivate}
                                    onChange={togglePrivate}
                                    value="private"
                                    required
                                />
                            }
                            label="Private Minting"
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="particleTypeSupply"
                            label="Max-Supply"
                            variant="outlined"
                            type="number"
                            min={0}
                            max={1e27}
                            onChange={updateParticleSupply}
                            value={particleSupply}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <FormControl
                                required
                                error={!isParticleIconValid}
                                component="fieldset"
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <>
                                                <input
                                                    id="particleTypeIcon"
                                                    type="file"
                                                    accept="image/*"
                                                    className={classes.fileInput}
                                                    onChange={updateParticleIcon}
                                                    required
                                                />
                                                <IconButton
                                                    color="secondary"
                                                    aria-label="upload icon"
                                                    component="span"
                                                >
                                                    <PhotoCamera />
                                                </IconButton>
                                            </>
                                        }
                                        label={_cleanParticleIconDisplay(particleIcon)}
                                    />
                                </FormGroup>
                                <FormHelperText error={true}>{!isParticleIconValid ? 'Particle Icon required' : ''}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <ExpansionPanel defaultExpanded onChange={toggleNonFungible} className={classes.outlined}>
                            <ExpansionPanelSummary>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            className={classes.switchControl}
                                            checked={isNonFungible}
                                            readOnly
                                            required
                                        />
                                    }
                                    label={isNonFungible ? 'Non-Fungible' : 'Fungible'}
                                    className={classes.switchLabel}
                                />
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
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
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={3}
                    className={classes.gridRow}
                >
                    <Grid item sm={4} md={3}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel ref={paymentInputLabelRef} id="particlePaymentLabel">
                                Payment
                            </InputLabel>
                            <Select
                                id="particlePayment"
                                labelId="particlePaymentLabel"
                                labelWidth={paymentTypeLabelWidth}
                                value={particlePaymentType}
                                onChange={updateParticlePaymentType}
                            >
                                <MenuItem value={'eth'}>ETH - {Helpers.getFriendlyPrice('eth', isNonFungible)}</MenuItem>
                                <MenuItem value={'ion'} disabled>ION - coming soon</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={3}
                    className={classes.gridRow}
                >
                    <Grid item sm={4} md={3}>
                        <Button
                            type="button"
                            // disabled={!formValidated}
                            variant="contained"
                            color={formValidated ? 'primary' : 'default'}
                            size="large"
                            onClick={handleSubmit}
                            className={formValidated ? '' : classes.visiblyDisabledButton}
                        >
                            Create Particle
                        </Button>
                    </Grid>
                    <Grid item sm={4} md={3}>
                        <NetworkIndicator
                            currentNetwork={networkId}
                            requiredNetwork={_.parseInt(GLOBALS.CHAIN_ID, 10)}
                        />
                    </Grid>
                </Grid>
            </form>
    )
};

export default FormCreateParticle;
