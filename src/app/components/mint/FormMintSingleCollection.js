// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// Data Context for State
import { RootContext } from '../../stores/root.store';

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


const FormMintSingleCollection = ({ particle, onSubmit }) => {
    const classes = useRootStyles();


    console.log('FormMintSingleCollection - particle:', particle);



    const _handleSubmit = (evt) => {
        evt.preventDefault();
        onSubmit({ test: '123' });
    };



    return (
        <>
            <Box pt={2}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Grid container spacing={3} className={classes.gridRow}>
                            <Grid item xs={6}>
                                Collection
                            </Grid>
                            <Grid item xs={6}>
                                <ul>
                                    <li>INPUT - All NFT Data for a single NFT</li>
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

export default FormMintSingleCollection;