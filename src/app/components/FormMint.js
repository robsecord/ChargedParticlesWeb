// Frameworks
import React, { useState, useContext, useEffect, useRef } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { navigate } from 'gatsby';
import * as _ from 'lodash';

// Data Context for State
import { WalletContext } from '../stores/wallet.store';

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
import ParticleSearchbox from '../components/ParticleSearchbox';
import { GLOBALS } from '../../utils/globals';
import { Helpers } from '../../utils/helpers';

import useRootStyles from '../layout/styles/root.styles';
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



// Create Route
const FormMint = ({ typeId, onSubmitForm }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();
    const theme = useTheme();

    console.log('typeId', typeId);

    const _handleSubmit = async evt => {
        evt.preventDefault();
        onSubmitForm();
    };

    return (
            <form autoComplete="off">
                <Box pb={5}>
                    <Grid container spacing={3} className={classes.gridRow}>
                        <Grid item xs={12}>


                            <ParticleSearchbox
                                onSelect={(selectedOption) => {
                                    console.log('Form Mint - onSelect', selectedOption);
                                    const typeId = selectedOption.particleTypeId || selectedOption.plasmaTypeId;
                                    if (!_.isEmpty(typeId)) {
                                        navigate(`${GLOBALS.ACCELERATOR_ROOT}/mint/${typeId}`);
                                    }
                                }}
                            />


                        </Grid>
                    </Grid>
                </Box>

                <p>Type ID: {typeId}</p>
            </form>
    )
};

export default FormMint;
