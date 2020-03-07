// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// App Components
import Transactions from '../blockchain/transactions';
import { useDebounce } from '../../utils/use-debounce';
import { Helpers } from '../../utils/helpers';

// Material UI
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

// Data Context for State
import { TransactionContext } from '../stores/transaction.store';


function ParticleSearchbox({ onSelect }) {
    const [open, setOpen] = useState(false);
    const [searchSymbol, setSearchSymbol] = useState('');
    const [options, setOptions] = useState([]);

    const [ txState ] = useContext(TransactionContext);
    const {
        searchState,
        searchError,
        searchTransactions,
    } = txState;

    const debouncedSearchSymbol = useDebounce(searchSymbol, 500);
    const loading = open && searchState === 'searching';

    useEffect(() => {
        let active = true;

        if (!open || _.size(debouncedSearchSymbol) < 2) {
            return undefined;
        }

        (async () => {
            const transactions = Transactions.instance();
            await transactions.searchPublicParticles({symbolSearch: debouncedSearchSymbol});
        })();

        return () => {
            active = false;
        };
    }, [open, debouncedSearchSymbol]);

    useEffect(() => {
        if (searchState === 'complete') {
            const opts = [];

            console.log('searchTransactions', searchTransactions);

            setOptions(opts);
        }
    }, [searchState, searchTransactions]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const _handleSearchSymbolChanged = (evt) => {
        setSearchSymbol(_.toUpper(evt.target.value));
    };

    return (
        <Autocomplete
            id="symbol-search"
            style={{ width: '100%' }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            noOptionsText={'Please search for a Symbol'}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={option => option.name}
            options={options}
            loading={loading}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Search Particles"
                    variant="outlined"
                    value={searchSymbol}
                    onChange={_handleSearchSymbolChanged}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {searchState === 'searching' ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}

export default ParticleSearchbox;
