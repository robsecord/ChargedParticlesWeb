// Frameworks
import React, { useState, useContext, useEffect } from 'react';
import * as _ from 'lodash';

// Data Context for State
import { WalletContext } from '../../stores/wallet.store';
import { TransactionContext } from '../../stores/transaction.store';

// Material UI
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// App Components
import Transactions from '../../blockchain/transactions';
import ParticleCard from '../ParticleCard';
import Loading from '../Loading';
import FormMintSingleSeries from './FormMintSingleSeries';
import FormMintSingleCollection from './FormMintSingleCollection';
import FormMintSinglePlasma from './FormMintSinglePlasma';
import { Helpers } from '../../../utils/helpers';
import useRootStyles from '../../layout/styles/root.styles';

let _fetchedParticles = {};
let _newSearch = false;

const _contractMethodCalls = [
    {contract: 'ChargedParticles', method: 'getMaxSupply',   as: 'maxSupply',   fields: ['typeId']},
    {contract: 'ChargedParticles', method: 'getTotalMinted', as: 'totalMinted', fields: ['typeId']},
    {contract: 'ChargedParticles', method: 'getMintingFee',  as: 'mintFee',     fields: ['typeId']},
];

const FormMintSingle = ({ typeId, onSubmit }) => {
    const classes = useRootStyles();

    const [ walletState ] = useContext(WalletContext);
    const { connectedAddress } = walletState;

    const [ txState ] = useContext(TransactionContext);
    const {
        loadState,
        loadError,
        loadTransactions,
    } = txState;

    const [ currentParticle, setCurrentParticle ] = useState({});

    let isMounted = true;
    useEffect(() => {
        if (!_.isEmpty(typeId)) {
            (async () => {
                _newSearch = true;
                const transactions = Transactions.instance();
                const partialQuery = transactions.generateSearchQuery({
                    index: '1',
                    value: Helpers.toBigNumber(typeId),
                    format: 'hex'
                });
                await transactions.loadPublicParticle({partialQuery});
            })();
        }
    }, [typeId]);

    useEffect(() => {
        if (_newSearch && loadState === 'complete') {
            if (_.isEmpty(loadError)) {
                const onlyFirst = _.first(loadTransactions);
                const transactions = Helpers.cleanCommonTxnFields([onlyFirst]);
                const loadedParticleData = _.first(transactions) || {};

                if (_fetchedParticles[loadedParticleData.typeId]) {
                    setCurrentParticle(_fetchedParticles[loadedParticleData.typeId]);
                } else {
                    // Fetch Particle Data from IPFS + Contract
                    (async () => {
                        try {
                            const metadata = await Helpers.fetchParticleMetadata(transactions);
                            const contractData = await Helpers.fetchParticleContractData(transactions, _contractMethodCalls);

                            if (isMounted) {
                                const particle = {
                                    ...metadata[loadedParticleData.typeId],
                                    ...contractData[loadedParticleData.typeId],
                                };
                                _fetchedParticles[loadedParticleData.typeId] = particle;
                                setCurrentParticle(particle);
                            }
                        }
                        catch (err) {
                            console.error(err);
                        }
                    })();
                }
            }
        }
    }, [loadState, loadError, loadTransactions, setCurrentParticle]);

    useEffect(() => {
        return () => {
            Transactions.instance().clearLoad();
            isMounted = false;
        };
    }, []);


    const _getCurrentParticlePanel = () => {
        return (
            <Box pb={5}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <ParticleCard
                            particle={currentParticle}
                            noFooter={true}
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const _getCurrentParticleForm = () => {
        if (currentParticle.isPrivate && currentParticle.creator !== connectedAddress) {
            return (
                <>
                    <p>Private Particle - cannot mint.</p>
                </>
            );
        }

        let content;
        if (currentParticle.isNF) {
            if (currentParticle.isSeries) {
                content = _getSeriesForm();
            } else {
                content = _getCollectionForm();
            }
        } else {
            content = _getPlasmaForm();
        }

        return (
            <Box pb={5}>
                <Grid container spacing={3} className={classes.gridRow}>
                    <Grid item xs={12}>
                        <Paper>
                            <Box pt={2} pb={1} px={3}>
                                {content}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const _getSeriesForm = () => {
        return (
            <FormMintSingleSeries
                particle={currentParticle}
                onSubmit={onSubmit}
            />
        );
    };

    const _getCollectionForm = () => {
        return (
            <FormMintSingleCollection
                particle={currentParticle}
                onSubmit={onSubmit}
            />
        );
    };

    const _getPlasmaForm = () => {
        return (
            <FormMintSinglePlasma
                particle={currentParticle}
                onSubmit={onSubmit}
            />
        );
    };


    if (_.isEmpty(typeId)) {
        return '';
    }

    if (!_.isEmpty(loadError)) {
        return (
            <p>Load Error: {loadError}</p>
        );
    }

    if (loadState === 'loading') {
        return (
            <Loading />
        );
    }

    if (_.isEmpty(currentParticle)) {
        return (
            <>
                <p>Couldn't load particle with ID: {typeId}</p>
            </>
        );
    }

    return (
        <>
            {_getCurrentParticlePanel()}
            {_getCurrentParticleForm()}
        </>
    )
};

export default FormMintSingle;
