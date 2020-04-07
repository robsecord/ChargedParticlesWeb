// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// Data Context for State
import { RootContext } from '../../stores/root.store';

// Material UI
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Typography from '@material-ui/core/Typography';

import useRootStyles from '../../layout/styles/root.styles';

const _mintFeeOptions = {
    step: 0.00001,
    min: 0,
    max: 10,
    type: 'number',
};

const _maxSupplyInputOptions = {
    step: 10,
    min: 0,
    max: 999999999999999, // = 1 QUADRILLION - 1;  Need larger?  Set to 0 for unlimited (nearly, 2^256-1)
    type: 'number',
};


const ParticleEconomics = () => {
    const classes = useRootStyles();

    const [ rootState, rootDispatch ] = useContext(RootContext);
    const { connectionState, createParticleData } = rootState;

    const [supply,  setSupply]  = useState(createParticleData.supply || 0);
    const [mintFee, setMintFee] = useState(createParticleData.mintFee || 0);

    useEffect(() => {
        rootDispatch({
            type    : 'UPDATE_CREATION_DATA',
            payload : {supply, mintFee}
        });
    }, [
        connectionState,
        supply,
        mintFee,
    ]);

    const _handleMintFeeBlur = () => {
        if (mintFee < _mintFeeOptions.min) {
            setMintFee(_mintFeeOptions.min);
        } else if (mintFee > _mintFeeOptions.max) {
            setMintFee(_mintFeeOptions.max);
        }
    };

    const _updateMintFee = evt => {
        const value = _.trim(evt.target.value);
        setMintFee(value);
    };

    const _handleSupplyBlur = () => {
        if (_.isEmpty(supply) || supply < _maxSupplyInputOptions.min) {
            setSupply(_maxSupplyInputOptions.min);
        } else if (supply > _maxSupplyInputOptions.max) {
            setSupply(_maxSupplyInputOptions.max);
        }
    };

    const _updateSupply = evt => {
        setSupply(evt.target.value);
    };

    return (
        <Grid container spacing={3} className={classes.gridRow}>
            <Grid item xs={12}>
                <Typography>
                    Specify the Max-Supply of Particles that are allowed to be Minted for this Particle Type.
                </Typography>
                <ul>
                    <li>Public Particles may be minted by anyone willing to pay the <em>Mint Fee</em> (free for the Creator).</li>
                    <li>Private Particles may be minted for free, but only by the Creator (You).</li>
                </ul>
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="particleTypeSupply">Max-Supply</InputLabel>
                    <OutlinedInput
                        id="particleTypeSupply"
                        onChange={_updateSupply}
                        onBlur={_handleSupplyBlur}
                        value={supply}
                        fullWidth
                        labelWidth={94}
                        inputProps={_maxSupplyInputOptions}
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                {
                    !createParticleData.isPrivate && (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="mintFee">Mint Fee</InputLabel>
                            <OutlinedInput
                                id="mintFee"
                                startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                                onChange={_updateMintFee}
                                onBlur={_handleMintFeeBlur}
                                value={createParticleData.isPrivate ? 0 : mintFee}
                                fullWidth
                                labelWidth={72}
                                disabled={createParticleData.isPrivate}
                                inputProps={_mintFeeOptions}
                            />
                        </FormControl>
                    )
                }
            </Grid>
        </Grid>
    );
};

export default ParticleEconomics;
