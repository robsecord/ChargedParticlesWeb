// Frameworks
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';

// App Components
import { ContractHelpers } from '../blockchain/contract-helpers';

// Data Context for State
import { useNetworkContext } from '../contexts/network';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';


const InlineBox = withStyles(theme => ({
    root: {
        display: 'inline-block'
    }
}))(Box);


const DisplayContractValue = ({
    contractName,
    method,
    methodArgs,
    render,
    formatValue,
    className = '',
    defaultValue = '',
    onValue = ({ raw, formatted }) => {}
}) => {
    const [ networkState ] = useNetworkContext();
    const { isNetworkConnected } = networkState;

    const [ isLoading, setLoading ] = useState(true);
    const [ displayValue, setDisplayValue ] = useState(defaultValue);

    let isMounted = true;
    useEffect(() => {
        if (isNetworkConnected && isLoading) {
            (async () => {
                try {
                    const raw = await ContractHelpers.readContractValue(contractName, method, ...methodArgs);
                    const formatted = _getFormattedValue(raw);
                    if (isMounted) {
                        setDisplayValue(formatted);
                        onValue({raw, formatted});
                    }
                }
                catch (err) {
                    isMounted && setDisplayValue(defaultValue);
                }
                finally {
                    isMounted && setLoading(false);
                }
            })();
        }

        return () => {
            isMounted = false;
        };
    }, [isMounted, isNetworkConnected, isLoading, setLoading, setDisplayValue]);

    const _getLoading = () => {
        return (
            <InlineBox mx={2}>
                <CircularProgress color="inherit" size={12} />
            </InlineBox>
        );
    };

    const _getFormattedValue = (value) => {
        let formatted = value;
        if (_.isFunction(formatValue)) {
            formatted = formatValue(value);
        }
        return formatted;
    };

    const _getRenderedValue = (value) => {
        let rendered;
        if (_.isFunction(render)) {
            rendered = render(value);
        } else {
            rendered = (
                <Typography className={className} component={'span'} variant={'body1'}>
                    {value}
                </Typography>
            );
        }
        return rendered;
    };


    if (isLoading) {
        return _getLoading();
    }
    return _getRenderedValue(displayValue);
};

export default DisplayContractValue;
