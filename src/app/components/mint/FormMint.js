// Frameworks
import React, { useState } from 'react';
import { navigate } from 'gatsby';
import * as _ from 'lodash';

// Material UI
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// App Components
import ParticleSearch from '../ParticleSearch';
import FormMintSingle from './FormMintSingle';
import { GLOBALS } from '../../../utils/globals';
import useRootStyles from '../../layout/styles/root.styles';


const FormMint = ({ typeId, onSubmitForm }) => {
    const classes = useRootStyles();

    const [ searchResults, setSearchResults ] = useState({});

    const _handleSearchResults = (searchResult) => {
        setSearchResults(searchResult);
    };

    const _handleTypeSelect = (particleTypeId) => (evt) => {
        setSearchResults({});
        navigate(`${GLOBALS.ACCELERATOR_ROOT}/mint/${particleTypeId}`);
    };

    const _getSearchResults = () => {
        let response = '';
        let found;
        let foundId;
        let foundSymbol;

        if (_.isEmpty(searchResults)) {
            if (_.isEmpty(typeId)) {
                response = 'Please begin by searching for a Particle Symbol';
            }
        } else if (!searchResults.success) {
            response = `Error: ${searchResults.searchError}`;
        }else if (_.size(searchResults.data) === 0) {
            response = 'No results found';
        } else {
            console.log('searchResults', searchResults);
            found = _.first(searchResults.data) || {};
            foundId = _.get(found, '_particleTypeId', _.get(found, '_plasmaTypeId', ''));
            foundSymbol = searchResults.searchSymbol;
            response = (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={_handleTypeSelect(foundId)}
                >
                    Select {foundSymbol}
                </Button>
            );
        }
        return (
            <Box px={3} py={1.25}>
                <Typography variant="body1" noWrap>
                    {response}
                </Typography>
            </Box>
        );
    };

    return (
        <>
            <Box pb={5}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12} sm={6}>
                        <ParticleSearch
                            initialValue={''}
                            onSearch={_handleSearchResults}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {_getSearchResults()}
                    </Grid>
                </Grid>
            </Box>

            <form autoComplete="off">
                <FormMintSingle typeId={typeId} onSubmit={onSubmitForm} />
            </form>
        </>
    )
};

export default FormMint;
