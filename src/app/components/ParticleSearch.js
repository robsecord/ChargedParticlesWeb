// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// App Components
import Transactions from '../blockchain/transactions';
import { useDebounce } from '../../utils/use-debounce';

// Material UI
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

// Data Context for State
import { TransactionContext } from '../stores/transaction.store';


let _newSearch = false;

function ParticleSearch({ initialValue = '', onSearch }) {
    const [searchSymbol, setSearchSymbol] = useState(initialValue);

    const [ txState ] = useContext(TransactionContext);
    const {
        searchState,
        searchError,
        searchTransactions,
    } = txState;

    const debouncedSearchSymbol = useDebounce(searchSymbol, 500);
    const isSearching = searchState === 'searching';

    useEffect(() => {
        if (_.size(debouncedSearchSymbol) >= 2) {
            (async () => {
                _newSearch = true;
                const transactions = Transactions.instance();
                const partialQuery = transactions.generateSearchQuery({index: '2', value: debouncedSearchSymbol});
                await transactions.searchPublicParticles({partialQuery});
            })();
        }
    }, [debouncedSearchSymbol]);

    useEffect(() => {
        if (_newSearch && searchState === 'complete') {
            let results;
            if (searchError) {
                results = {success: false, searchSymbol, searchError};
            } else {
                results = {success: true, searchSymbol};
                results.data = searchTransactions;
            }
            _newSearch = false;
            onSearch(results);
        }
    }, [searchSymbol, searchState, searchError, searchTransactions, onSearch]);

    useEffect(() => {
        return () => {
            Transactions.instance().clearSearch();
        };
    }, []);

    const _handleSearchSymbolChanged = (evt) => {
        evt.preventDefault();
        setSearchSymbol(_.toUpper(evt.target.value));
    };

    return (
        <TextField
            label="Search by Symbol"
            variant="outlined"
            value={searchSymbol}
            onChange={_handleSearchSymbolChanged}
            fullWidth
            InputProps={{
                endAdornment: (<>
                    {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                </>),
            }}
        />
    );
}

export default ParticleSearch;
