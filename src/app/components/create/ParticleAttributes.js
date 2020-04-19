// Frameworks
import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import * as _ from 'lodash';

// App Components
import AttrListContainer from '../attributeList/AttrListContainer';
import ColorInput from '../ColorInput';

// Data Context for State
import { useRootContext } from '../../contexts/root';
import { useNetworkContext } from '../../contexts/network';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';
const useCustomStyles = makeStyles(theme => ({
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
        minHeight: 300,
    },
}));

const ParticleAttributes = ({ back, next }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();

    const [ rootState, rootDispatch ] = useRootContext();
    const { createParticleData } = rootState;

    const [ networkState ] = useNetworkContext();
    const { connectionState } = networkState;

    const [backgroundColor,      setBackgroundColor]      = useState(createParticleData.backgroundColor || '#fff');
    const [particleImage,        setParticleImage]        = useState(createParticleData.image || 'Upload Image *');
    const [particleAttributes,   setParticleAttributes]   = useState(createParticleData.attributes || []);
    const [particleImageBuffer,  setParticleImageBuffer]  = useState(createParticleData.imageBuffer || null);
    const [particleImageBase64,  setParticleImageBase64]  = useState(createParticleData.imageBase64 || null);

    const [formValidated,        setFormValidated]        = useState(false);
    const [isParticleImageValid, setParticleImageValid]   = useState(true);

    useEffect(() => {
        setFormValidated(_validateForm());

        const formData = _getFormData();
        rootDispatch({
            type    : 'UPDATE_CREATION_DATA',
            payload : formData
        });
    }, [
        connectionState,
        particleImage,
        particleAttributes,
        particleImageBuffer,
        particleImageBase64,
        backgroundColor,
    ]);

    const _getFormData = () => {
        return {
            image       : particleImage,
            attributes  : particleAttributes,
            imageBuffer : particleImageBuffer,
            imageBase64 : particleImageBase64,
            backgroundColor,
        };
    };

    const _validateAll = () => {
        setParticleImageValid(!_.isEmpty(particleImageBuffer));
    };

    const _validateForm = () => {
        const conditions = [
            _.isEmpty(connectionState),
            !_.isEmpty(particleImageBuffer),
        ];
        return _.every(conditions, Boolean);
    };

    const _cleanParticleIconDisplay = (filename) => {
        return _.last(filename.split('\\'));
    };

    const _updateParticleImage = evt => {
        evt.preventDefault();
        evt.stopPropagation();

        const value = evt.target.value;
        const file = evt.target.files[0];
        if (_.isUndefined(file)) { return; }

        const fileExt = _.last(value.split('.'));
        setParticleImage(value);
        setParticleImageValid(!_.isEmpty(value));

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            const buffer = Buffer(reader.result);
            setParticleImageBuffer(buffer);
            setParticleImageBase64(`data:image/${fileExt};base64,${buffer.toString('base64')}`);
        };
    };

    const _handleColorChange = ({hex}) => {
        setBackgroundColor(hex);
    };

    const _onAttributesUpdate = (attributes) => {
        setParticleAttributes(attributes);
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
            <Box pt={2}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Typography>
                            Select an <strong>Image</strong> &amp; <strong>Background</strong> for this <strong>Series</strong>.
                        </Typography>
                        <ul>
                            <li>This is the Unique Image for the Item - the Image of your Particle.</li>
                            <li>All Particles of this Type will be Minted with a copy of this Image and a Unique Series Number.</li>
                        </ul>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={3} className={classes.gridRow}>
                            <Grid item xs={12} sm={6}>
                                <ColorInput
                                    id="backgroundColor"
                                    initialColor={backgroundColor}
                                    onChange={_handleColorChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <FormControl
                                required
                                error={!isParticleImageValid}
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
                                                    id="particleTypeImage"
                                                    type="file"
                                                    accept="image/*"
                                                    className={customClasses.fileInput}
                                                    onChange={_updateParticleImage}
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
                                        label={_cleanParticleIconDisplay(particleImage)}
                                    />
                                </FormGroup>
                                <FormHelperText error={true}>{!isParticleImageValid ? 'Particle Image required' : ''}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {
                            !_.isEmpty(particleImageBase64) && (
                                <Card className={customClasses.imageCard}>
                                    <CardMedia
                                        className={customClasses.imageCardMedia}
                                        image={particleImageBase64}
                                        title="Particle Image"
                                        style={{backgroundColor}}
                                    />
                                </Card>
                            )
                        }
                    </Grid>
                </Grid>
            </Box>

            <Box py={5}><Divider /></Box>

            <Grid container spacing={3} className={classes.gridRow}>
                <Grid item xs={12}>
                    <Typography>
                        Customize your Particles with Custom Attributes
                    </Typography>
                    <ul>
                        <li>These attributes are useful for adding unique display-characteristics to your particles.</li>
                        <li>
                            These Custom-Attributes follow the Token Metadata Standards for ERC721 & ERC1155. You can read more about custom attributes here:
                            <a href="https://docs.opensea.io/docs/metadata-standards#section-attributes" target="_new">OpenSea Documentation</a>!
                        </li>
                    </ul>
                </Grid>

                <Grid item xs={12}>
                    <AttrListContainer
                        initialAttributes={particleAttributes}
                        onUpdate={_onAttributesUpdate}
                    />
                </Grid>
            </Grid>













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

export default ParticleAttributes;
