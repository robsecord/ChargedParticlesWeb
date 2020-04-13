// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import { Buffer } from 'buffer';
import * as _ from 'lodash';

// Data Context for State
import { RootContext } from '../../contexts/root';
import { WalletContext } from '../../contexts/wallet';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PhotoCamera from '@material-ui/icons/PhotoCamera';


import useRootStyles from '../../layout/styles/root.styles';
const useCustomStyles = makeStyles(theme => ({
    switchLabel: {
        pointerEvents: 'none',
        marginTop: -9,
    },
    switchControl: {
        marginTop: 8,
        marginLeft: 7,
        marginRight: 2,
    },
    fileInputFieldset: {
        width: '85%',
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
        verticalAlign: 'middle',
    },

    imageCard: {
        maxWidth: 300,
    },
    imageCardMedia: {
        height: 300,
    },
}));


const ParticleIdentity = ({ back, next }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();

    const [ rootState, rootDispatch ] = useContext(RootContext);
    const { connectionState, createParticleData } = rootState;

    const [ walletState ] = useContext(WalletContext);
    const { allReady, connectedAddress } = walletState;

    const [particleName,        setParticleName]        = useState(createParticleData.name || '');
    const [particleDesc,        setParticleDesc]        = useState(createParticleData.desc || '');
    const [particleSymbol,      setParticleSymbol]      = useState(createParticleData.symbol || '');
    const [particleCreator,     setParticleCreator]     = useState(createParticleData.creator || '');
    const [isPrivate,           setPrivate]             = useState(createParticleData.isPrivate || false);

    const [particleIcon,        setParticleIcon]        = useState(createParticleData.icon || 'Upload Icon *');
    const [particleIconBuffer,  setParticleIconBuffer]  = useState(createParticleData.iconBuffer || null);
    const [particleIconBase64,  setParticleIconBase64]  = useState(createParticleData.iconBase64 || null);

    const [formValidated,          setFormValidated]        = useState(false);
    const [isParticleNameValid,    setParticleNameValid]    = useState(true);
    const [isParticleSymbolValid,  setParticleSymbolValid]  = useState(true);
    const [isParticleDescValid,    setParticleDescValid]    = useState(true);
    const [isParticleCreatorValid, setParticleCreatorValid] = useState(true);
    const [isParticleIconValid,    setParticleIconValid]    = useState(true);

    useEffect(() => {
        if (allReady && _.isEmpty(particleCreator)) {
            setParticleCreator(connectedAddress);
            setParticleCreatorValid(!_.isEmpty(connectedAddress));
        }
    }, []);

    useEffect(() => {
        setFormValidated(_validateForm());

        const formData = _getFormData();
        rootDispatch({
            type    : 'UPDATE_CREATION_DATA',
            payload : formData
        });
    }, [
        connectionState,
        particleName,
        particleSymbol,
        particleDesc,
        particleCreator,
        particleIcon,
        particleIconBuffer,
        particleIconBase64,
        isPrivate,
    ]);

    const _getFormData = () => {
        return {
            name        : _.trim(particleName),
            desc        : _.trim(particleDesc),
            symbol      : particleSymbol,
            creator     : particleCreator,
            icon        : particleIcon,
            iconBuffer  : particleIconBuffer,
            iconBase64  : particleIconBase64,
            isPrivate,
        };
    };

    const _validateAll = () => {
        setParticleNameValid(!_.isEmpty(particleName));
        setParticleSymbolValid(!_.isEmpty(particleSymbol));
        setParticleCreatorValid(!_.isEmpty(particleCreator));
        setParticleIconValid(!_.isEmpty(particleIconBuffer));
        setParticleDescValid(!_.isEmpty(particleDesc));
    };

    const _validateForm = () => {
        const conditions = [
            _.isEmpty(connectionState),
            !_.isEmpty(particleName),
            !_.isEmpty(particleSymbol),
            !_.isEmpty(particleDesc),
            !_.isEmpty(particleCreator),
            !_.isEmpty(particleIconBuffer),
        ];
        return _.every(conditions, Boolean);
    };

    const _cleanParticleIconDisplay = (filename) => {
        return _.last(filename.split('\\'));
    };

    const _updateParticleName = evt => {
        const value = evt.target.value;
        setParticleName(value);
        setParticleNameValid(!_.isEmpty(value));
    };

    const _updateParticleSymbol = evt => {
        const value = _.trim(_.toUpper(evt.target.value));
        setParticleSymbol(value);
        setParticleSymbolValid(!_.isEmpty(value));
    };

    const _updateParticleCreator = evt => {
        const value = _.trim(evt.target.value);
        setParticleCreator(value);
        setParticleCreatorValid(!_.isEmpty(value));
    };

    const _updateParticleIcon = evt => {
        evt.preventDefault();
        evt.stopPropagation();

        const value = evt.target.value;
        const file = evt.target.files[0];
        if (_.isUndefined(file)) { return; }

        const fileExt = _.last(value.split('.'));
        setParticleIcon(value);
        setParticleIconValid(!_.isEmpty(value));

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            const buffer = Buffer(reader.result);
            setParticleIconBuffer(buffer);
            setParticleIconBase64(`data:image/${fileExt};base64,${buffer.toString('base64')}`);
        };
    };

    const _updateParticleDesc = evt => {
        const value = evt.target.value;
        setParticleDesc(value);
        setParticleDescValid(!_.isEmpty(value));
    };

    const _togglePrivate = (evt, _private) => {
        setPrivate(_private);
    };

    const _handleSubmit = async evt => {
        evt.preventDefault();
        if (!formValidated) {
            return _validateAll();
        }
        next();
    };

    return (
        <>
            <Box py={3}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={6}>
                        <TextField
                            id="particleTypeName"
                            label="Name"
                            variant="outlined"
                            onChange={_updateParticleName}
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
                            onChange={_updateParticleSymbol}
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
                            onChange={_updateParticleDesc}
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
                    <Grid item xs={12}>
                        <TextField
                            id="particleTypeCreator"
                            label="Creator"
                            variant="outlined"
                            onChange={_updateParticleCreator}
                            value={particleCreator}
                            fullWidth
                            required
                            error={!isParticleCreatorValid}
                        />
                    </Grid>
                </Grid>

                <Box pt={5}><Divider /></Box>

                <Box py={5}>
                    <Grid container spacing={3} className={classes.gridRow}>
                        <Grid item xs={12}>
                            <Typography>
                                Do you want to display your {_.startCase(createParticleData.classification)} on the Market Page?
                            </Typography>
                            <ul>
                                <li>Public Minting allows anyone to mint your particles by paying the <em>Mint Fee</em> to you. These particles are displayed on the Market Page and are searchable.</li>
                                <li>Private Minting allows only the {_.startCase(createParticleData.classification)} Creator (You) to mint particles, bypassing the <em>Mint Fee</em>.</li>
                                <li>You can always sell your minted particles on 3rd-party marketplaces.</li>
                            </ul>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        className={customClasses.switchControl}
                                        checked={isPrivate}
                                        onChange={_togglePrivate}
                                        value="private"
                                        required
                                    />
                                }
                                label={isPrivate ? 'Private Minting' : 'Public Minting'}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box pb={5}><Divider /></Box>

                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Typography>
                            Select an <strong>Icon</strong> for the Particle Type.
                        </Typography>
                        <ul>
                            <li>This is NOT the Image for the Item, this is only an Icon related to the Particle "Type".</li>
                            <li>This icon is only used for display within the Charged Particles universe to visually represent the Particle "Type".</li>
                        </ul>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Avatar alt="Type Icon" src={particleIconBase64}>?</Avatar>
                            <FormControl
                                required
                                error={!isParticleIconValid}
                                component="fieldset"
                                className={customClasses.fileInputFieldset}
                            >
                                <FormGroup>
                                    <FormControlLabel
                                        classes={{
                                            root: customClasses.fileName,
                                            label: customClasses.fileNameLabel,
                                        }}
                                        control={
                                            <>
                                                <input
                                                    id="particleTypeIcon"
                                                    type="file"
                                                    accept="image/*"
                                                    className={customClasses.fileInput}
                                                    onChange={_updateParticleIcon}
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
                                // disabled={!formValidated}
                                variant={formValidated ? 'contained' : 'outlined'}
                                color={formValidated ? 'primary' : 'default'}
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
    );
}

export default ParticleIdentity;
