// Frameworks
import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


export default ({msg = 'Loading..'}) => {
    const classes = useRootStyles();
    return (
        <div className={classes.loadingContainer}>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Paper elevation={2} className={classes.loadingPaper}>
                    <CircularProgress />
                    <span>{msg}</span>
                </Paper>
            </Grid>
        </div>
    );
};
