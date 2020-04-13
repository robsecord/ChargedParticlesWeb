// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// Data Context for State
import { RootContext } from '../../contexts/root';

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

// Custom Styles
import useRootStyles from '../../layout/styles/root.styles';


const FormMintSingleSeries = ({ particle, onSubmit }) => {
    const classes = useRootStyles();


    console.log('FormMintSingleSeries - particle:', particle);



    const _handleSubmit = (evt) => {
        evt.preventDefault();
        onSubmit({ test: '123' });
    };


    // When minting Plasma, need:
    //      Amount to Mint
    //      Receiver

    // When Minting Token of Series, need:
    //      Type ID
    //      (Inherit Token Metadata of Type)
    //      Asset Amount

    // When Minting Token of Collection, need:
    //      Type ID
    //      Token Metadata
    //      Asset Amount

    // Token Metadata
    //      Name
    //      Symbol
    //      Description
    //      Icon            (for Particle Types only)
    //      Image
    //      External URL
    //      Animation URL
    //      Youtube URL
    //      Background Color
    //      Attributes
    //

    // Before Minting, need to check/display:
    //      Creator
    //      Asset Pair
    //      Max Supply
    //      Mint Fee
    //      Energize Fee
    //


    return (
        <>
            <Box pt={2}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Grid container spacing={3} className={classes.gridRow}>
                            <Grid item xs={6}>
                                <p>Series</p>
                                <ul>
                                    <li>NFT Data:</li>
                                </ul>
                            </Grid>
                            <Grid item xs={6}>
                                <ul>
                                    <li>DISPLAY - Inherit NFT Data from Type</li>
                                    <li>DISPLAY - Number of Copies in Circulation</li>
                                    <li>INPUT - Amount to Fund in Asset-Type</li>
                                    <li>INPUT - Receiver</li>
                                </ul>
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
