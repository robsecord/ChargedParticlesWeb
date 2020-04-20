// Frameworks
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UseAnimations from 'react-useanimations';
import clsx from 'clsx';
import * as _ from 'lodash';

// App Components
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';

// Data Context for State
import { useNetworkContext } from '../contexts/network';
import { useTransactionContext } from '../contexts/transaction';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Zoom from '@material-ui/core/Zoom';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';

// Rimble UI
import {
    Box,
    Flex,
    Heading,
    Icon,
} from 'rimble-ui';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


// Custom Styles
const useCustomStyles = makeStyles(theme => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
        color: theme.palette.common.white,
        backgroundColor: orange[400],
        '&:hover': {
            backgroundColor: orange[600],
        },
    },
    fabError: {
        backgroundColor: red[400],
        '&:hover': {
            backgroundColor: red[600],
        },
    },
    fabCompleted: {
        backgroundColor: green[400],
        '&:hover': {
            backgroundColor: green[600],
        },
    },
    processingModal: {
        maxHeight: '70vh',
        overflow: 'scroll',
    },
    streamState: {
        margin: '7px 0'
    },
    infoText: {
        fontSize: '0.9em'
    },
    txLink: {
        fontSize: '0.7em'
    }
}));


const TX_COMPLETE_DELAY = 10 * 1000;
const STATE_MSG = {
    'UNKNOWN'   : 'Transaction pooled and waiting to be included in a block...',
    'TX_INIT'   : 'Transaction created, monitoring has begun in the background...',
    'TX_PROMPT' : 'Creating Blockchain Transaction...',
    'IPFS_IMG'  : 'Saving Image to IPFS...',
    'IPFS_META' : 'Saving Metadata to IPFS...',
    'PENDING'   : 'Transaction pending block selection by miners...',
    'IN_BLOCK'  : 'Transaction has been included in a block for execution...',
    'REPLACED'  : 'Transaction replaced and has been re-pooled...',
    'CONFIRMED' : 'Transaction Completed, awaiting confirmations...',
    'COMPLETED' : 'Transaction Completed Successfully!',
};

let _clearStreamTimeout = 0;

const TxStreamView = () => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();
    const [ networkState ] = useNetworkContext();
    const { networkId } = networkState;
    const [ txState, txDispatch ] = useTransactionContext();
    const {
        transactionHash,
        streamState,
        streamError,
        streamTransitions
    } = txState;

    const [ isOpenModal, setOpenModal ] = useState(false);
    const [ currentStreamState, setCurrentStreamState ] = useState(STATE_MSG.UNKNOWN);
    const [ confirmationCount, setConfirmationCount ] = useState(-1);
    const [ includedInBlock, setIncludedInBlock ] = useState(0);

    const hasError = (!_.isEmpty(streamError));
    const isCleared = (_.isEmpty(streamState));
    const isCompleted = (streamState === 'completed');
    const isProcessing = !isCleared && !isCompleted && !hasError;// && !_.isEmpty(transactionHash);
    const networkName = Helpers.getNetworkName(networkId);

    const transitionDuration = {
        enter: 500,
        exit: 500,
    };

    useEffect(() => {
        if (isCompleted) {
            if (!isCleared && !isOpenModal && !hasError) {
                toast('🦄 Transaction Complete!');
            }

            clearTimeout(_clearStreamTimeout);
            _clearStreamTimeout = setTimeout(() => {
                if (isCleared) { return; }
                _clearAll();
                txDispatch({type: 'CLEAR_STREAM'});
            }, TX_COMPLETE_DELAY);
        }
    }, [isCompleted, hasError, isCleared, isOpenModal]);

    useEffect(() => {
        const latest = _.first(streamTransitions);
        if (!_.isUndefined(latest)) {
            // console.log('streamTransitions', streamTransitions);
            // console.log('latest', latest);
            // console.log('-------------------------------------');

            const currentState = latest.to;
            const currentTransition = latest.transition;
            // console.log('currentState', currentState);
            // console.log('currentTransition', currentTransition);

            if (currentState === 'CREATE') {
                setCurrentStreamState(STATE_MSG[currentTransition]);
                setOpenModal(true);
            } else if (currentState === 'PENDING') {
                setCurrentStreamState(STATE_MSG.PENDING);
            } else if (currentState === 'REPLACED') {
                setCurrentStreamState(STATE_MSG.REPLACED);
            } else if (currentState === 'IN_BLOCK') {
                if (currentTransition === 'CONFIRMED') {
                    setCurrentStreamState(STATE_MSG.CONFIRMED);
                } else {
                    setCurrentStreamState(STATE_MSG.IN_BLOCK);
                }
            } else {
                setCurrentStreamState(STATE_MSG.UNKNOWN);
            }

            if (currentState === 'IN_BLOCK') {
                if (currentTransition === 'INIT') {
                    const blockNumber = _.get(latest, 'data.transactionLifecycle.transition.blockHeader.number', 0);
                    setIncludedInBlock(blockNumber);
                }

                if (currentTransition === 'CONFIRMED') {
                    const confirmations = _.get(latest, 'data.transactionLifecycle.transition.confirmations', 0);
                    setConfirmationCount(confirmations);

                    if (confirmations >= GLOBALS.MIN_BLOCK_CONFIRMATIONS) {
                        setCurrentStreamState(STATE_MSG.COMPLETED);
                    }
                }
            }
        }
    }, [streamTransitions, setCurrentStreamState, setConfirmationCount, setIncludedInBlock]);

    const _clearAll = () => {
        setIncludedInBlock(0);
        setConfirmationCount(-1);
        setCurrentStreamState('');
        setOpenModal(false);
    };

    const onFabClick = () => {
        if (isCompleted) { return; }
        setOpenModal(true);
    };

    const handleModalClosed = () => {
        setOpenModal(false);
    };

    const viewOnEtherscan = () => {
        const subdomain = networkName === 'mainnet' ? '' : `${networkName}.`;
        const url = `https://${subdomain}etherscan.io/tx/${transactionHash}`;
        window.open(url);
    };

    return (
        <>
            <Zoom
                in={isCompleted && !isOpenModal}
                timeout={transitionDuration}
                unmountOnExit
            >
                <Fab
                    aria-label="Completed!"
                    className={clsx(customClasses.fab, customClasses.fabCompleted)}
                    color="inherit"
                    onClick={onFabClick}
                >
                    <CheckIcon />
                </Fab>
            </Zoom>

            <Zoom
                in={hasError && !isOpenModal}
                timeout={transitionDuration}
                unmountOnExit
            >
                <Fab
                    aria-label="Error!"
                    className={clsx(customClasses.fab, customClasses.fabError)}
                    color="inherit"
                    onClick={onFabClick}
                >
                    <ClearIcon />
                </Fab>
            </Zoom>

            <Zoom
                in={isProcessing && !isOpenModal}
                timeout={transitionDuration}
                unmountOnExit
            >
                <Fab
                    aria-label="Processing.."
                    className={customClasses.fab}
                    color="inherit"
                    onClick={onFabClick}
                >
                    <UseAnimations
                        strokeColor={orange[500]}
                        fillColor="#EEE"
                        animationKey="loading2"
                        size={24}
                        style={{marginTop: 6}}
                    />
                </Fab>
            </Zoom>

            <Modal
                aria-labelledby="processing-modal"
                aria-describedby="processing-modal-description"
                open={isOpenModal && !isCleared}
                onClose={handleModalClosed}
            >
                <div className={clsx(classes.simpleModal, customClasses.processingModal)}>
                    <Flex flexWrap={"wrap"}>
                        <Box width={1/12}>
                            <UseAnimations
                                strokeColor="#4e3fce"
                                fillColor="#EEE"
                                animationKey="loading2"
                                size={24}
                                style={{marginTop: 6}}
                            />
                        </Box>
                        <Box width={11/12} pl={10}>
                            <Heading as={"h2"} mt={1} mb={10}>Processing Transaction..</Heading>

                            <LinearProgress width={1} />

                            <Typography className={customClasses.streamState}>
                                {currentStreamState}
                            </Typography>
                            {
                                includedInBlock > 0 && (
                                    <Typography className={customClasses.infoText}>
                                        Included in Block: {includedInBlock}
                                    </Typography>
                                )
                            }
                            {
                                confirmationCount > -1 && (
                                    <Typography className={customClasses.infoText}>
                                        Confirmations: {confirmationCount} of {GLOBALS.MIN_BLOCK_CONFIRMATIONS}...
                                    </Typography>
                                )
                            }
                            <Grid
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                            >
                                {
                                    (!_.isEmpty(transactionHash)) && (
                                        <Button
                                            size="small"
                                            className={customClasses.txLink}
                                            onClick={viewOnEtherscan}
                                        >
                                            view on etherscan&nbsp;
                                            <Icon name="Launch" size="12" />
                                        </Button>
                                    )
                                }
                            </Grid>
                        </Box>
                    </Flex>
                </div>
            </Modal>
        </>
    );
};

export default TxStreamView;
