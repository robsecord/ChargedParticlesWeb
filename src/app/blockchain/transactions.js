// Frameworks
import { createDfuseClient } from '@dfuse/client';
import { reactLocalStorage } from 'reactjs-localstorage';
import * as _ from 'lodash';

// App Components
import {
    ChargedParticles,
    ChargedParticlesEscrow
} from '../blockchain/contracts';
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';

// Queries
import { streamTransactionQuery } from './queries/StreamTransactionQuery';
import { searchTransactionEvent } from './queries/SearchTransactionEvent';

// Transaction Events
const transactionEventMap = {
    'UPDATE_PARTICLE_TYPE': {   // find latest in logs for full record
        contract    : ChargedParticles,
        eventName   : 'ParticleTypeUpdated',
        method      : 'ParticleTypeUpdated(uint256,bool,string,uint256,uint256,string)',
        hash        : '0x0e765999116ed5a7da01db4a1521b59990ede384e1ffecc3706071c1449bb6c8',
    },

    'UPDATE_PLASMA_TYPE': {   // find latest in logs for full record
        contract    : ChargedParticles,
        eventName   : 'PlasmaTypeUpdated',
        method      : 'PlasmaTypeUpdated(uint256,bool,uint256,uint256,uint256,address,string)',
        hash        : '0x2d76c9a224d03480129a7d0a39091104393c1405db65700feeaef8312b54fb4f',
    },

    'MINT_PARTICLE': {
        contract    : ChargedParticles,
        eventName   : 'ParticleMinted',
        method      : '',
        hash        : '0x',
    },

    'BURN_PARTICLE': {
        contract    : ChargedParticles,
        eventName   : 'ParticleBurned',
        method      : '',
        hash        : '0x',
    },

    'ENERGIZE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'EnergizedParticle',
        method      : '',
        hash        : '0x',
    },

    'DISCHARGE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'DischargedParticle',
        method      : '',
        hash        : '0x',
    },

    'RELEASE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'ReleasedParticle',
        method      : '',
        hash        : '0x',
    },
};

class Transactions {

    constructor() {
        this.apiKey = GLOBALS.DFUSE_API_KEY;
        this.rootDispatch = null;
        this.txDispatch = null;
        this.networkId = 0;
        this.stream = null;
        this.client = null;
    }

    static instance() {
        if (!Transactions.__instance) {
            Transactions.__instance = new Transactions();
        }
        return Transactions.__instance;
    }

    init({rootDispatch, txDispatch}) {
        this.rootDispatch = rootDispatch;
        this.txDispatch = txDispatch;
    }

    connectToNetwork({networkId}) {
        const networkName = Helpers.getNetworkName(networkId);
        this.networkId = networkId;
        this.client = createDfuseClient({
            apiKey: this.apiKey,
            network: `${networkName}.eth.dfuse.io`,
            streamClientOptions: {
                socketOptions: {
                    onClose: this.onClose,
                    onError: this.onError,
                }
            }
        });
        this.rootDispatch({type: 'CONNECTED_NETWORK', payload: {
            networkId,
            isNetworkConnected: true,
            networkErrors: []
        }});
    }

    resumeIncompleteStreams() {
        const transactionHash = reactLocalStorage.get('CP_streamTxHash');
        if (_.isEmpty(transactionHash)) { return; }

        console.log('resumeIncompleteStreams');

        (async () => {
            await this.streamTransaction({transactionHash});
        })();
    }

    onClose() {
        this.rootDispatch({type: 'DISCONNECTED_NETWORK', payload: {
            isNetworkConnected: false,
            networkErrors: []
        }});
    }

    onError(error) {
        this.rootDispatch({type: 'DISCONNECTED_NETWORK', payload: {
            isNetworkConnected: false,
            networkErrors: ["Transactions: An error occurred with the socket.", JSON.stringify(error)]
        }});
    }

    async streamTransaction({transactionHash}) {
        this.txDispatch({type: 'BEGIN_STREAMING', payload: {transactionHash}});

        let currentTransitions = [];
        let confirmations = 0;
        let count = 0;
        let forceEnd = false;

        reactLocalStorage.set('CP_streamTxHash', transactionHash);

        this.stream = await this.client.graphql(streamTransactionQuery, (message) => {

            if (message.type === 'error') {
                this.txDispatch({type: 'STREAM_ERROR', payload: {
                    streamError: message.errors[0]['message']
                }});
            }

            if (message.type === 'data') {
                const newTransition = {
                    key         : `transition-${count}`,
                    transition  : message['data']['transactionLifecycle']['transitionName'],
                    from        : message['data']['transactionLifecycle']['previousState'],
                    to          : message['data']['transactionLifecycle']['currentState'],
                    data        : message['data']
                };
                count++;
                currentTransitions = [...currentTransitions, newTransition];
                confirmations = _.get(newTransition, 'data.transactionLifecycle.transition.confirmations', 0);

                if (confirmations >= GLOBALS.MIN_BLOCK_CONFIRMATIONS) {
                    forceEnd = true;
                } else {
                    this.txDispatch({
                        type: 'STREAM_TRANSITION', payload: {
                            streamTransitions: currentTransitions.reverse()
                        }
                    });
                }
            }

            if (message.type === 'complete' || forceEnd) {
                reactLocalStorage.set('CP_streamTxHash', '');
                this.txDispatch({type: 'STREAM_COMPLETE'});
                this.stream.close();
            }
        },{
            variables: {
                hash:  transactionHash
            }
        });

        await this.stream.join();
    }

    async getPublicParticles() {
        this.txDispatch({type: 'BEGIN_SEARCH', payload: {}});

        const particleEventId = 'UPDATE_PARTICLE_TYPE';
        const plasmaEventId = 'UPDATE_PLASMA_TYPE';
        const contract = transactionEventMap[particleEventId].contract.instance();
        const contractAddress = _.toLower(contract.getAddress());

        const particleEventName = transactionEventMap[particleEventId].eventName;
        const particleMethodHash = transactionEventMap[particleEventId].hash;
        const plasmaEventName = transactionEventMap[plasmaEventId].eventName;
        const plasmaMethodHash = transactionEventMap[plasmaEventId].hash;

        const query = `address: ${contractAddress} (topic.0:${particleMethodHash} OR topic.0:${plasmaMethodHash}) topic.2:${GLOBALS.BOOLEAN_FALSE_HEX}`;
        const response = await this.client.graphql(searchTransactionEvent, {
            variables: {
                query,
                limit: '11',
                lowBlockNum: GLOBALS.STARTING_BLOCK,
                cursor: '',
            }
        });

        if (response.errors) {
            this.txDispatch({type: 'SEARCH_ERROR', payload: {
                searchError: JSON.stringify(response.errors)
            }});
            return;
        }

        const edges = response.data.searchTransactions.edges || [];
        if (edges.length <= 0) {
            this.txDispatch({type: 'SEARCH_COMPLETE', payload: {searchTransactions: []}});
            return;
        }

        const searchTransactions = [];
        _.forEach(edges, ({node}) => {
            const receiver = node.from;

            // Parse matching topics
            _.forEach(node.matchingLogs, (logEntry) => {
                let decoded;
                if (logEntry.topics[0] === particleMethodHash) {
                    decoded = Helpers.decodeLog({eventName: particleEventName, logEntry});
                    searchTransactions.push({
                        ...decoded,
                        _owner: receiver
                    });
                }
                if (logEntry.topics[0] === plasmaMethodHash) {
                    decoded = Helpers.decodeLog({eventName: plasmaEventName, logEntry});
                    searchTransactions.push({
                        ...decoded,
                        _owner: receiver
                    });
                }
            });
        });

        this.txDispatch({type: 'SEARCH_COMPLETE', payload: {searchTransactions}});
    }


    async getCreatedParticlesByOwner({owner}) {
        this.txDispatch({type: 'BEGIN_SEARCH', payload: {}});

        const particleEventId = 'UPDATE_PARTICLE_TYPE';
        const plasmaEventId = 'UPDATE_PLASMA_TYPE';
        const contract = transactionEventMap[particleEventId].contract.instance();
        const contractAddress = _.toLower(contract.getAddress());

        const particleEventName = transactionEventMap[particleEventId].eventName;
        const particleMethodHash = transactionEventMap[particleEventId].hash;
        const plasmaEventName = transactionEventMap[plasmaEventId].eventName;
        const plasmaMethodHash = transactionEventMap[plasmaEventId].hash;

        const query = `address: ${contractAddress} signer:${_.toLower(owner)} (topic.0:${particleMethodHash} OR topic.0:${plasmaMethodHash})`;
        const response = await this.client.graphql(searchTransactionEvent, {
            variables: {
                query,
                limit: '11',
                lowBlockNum: GLOBALS.STARTING_BLOCK,
                cursor: '',
            }
        });

        if (response.errors) {
            this.txDispatch({type: 'SEARCH_ERROR', payload: {
                    searchError: JSON.stringify(response.errors)
                }});
            return;
        }

        const edges = response.data.searchTransactions.edges || [];
        if (edges.length <= 0) {
            this.txDispatch({type: 'SEARCH_COMPLETE', payload: {searchTransactions: []}});
            return;
        }

        const searchTransactions = [];
        _.forEach(edges, ({node}) => {
            const receiver = node.from;

            // Validate Owner
            if (_.toLower(receiver) !== _.toLower(owner)) {
                console.log(`Skipping log event due to owner mismatch. Expected ${owner}, got ${receiver}`);
                return;
            }

            // Parse matching topics
            _.forEach(node.matchingLogs, (logEntry) => {
                let decoded;
                if (logEntry.topics[0] === particleMethodHash) {
                    decoded = Helpers.decodeLog({eventName: particleEventName, logEntry});
                    searchTransactions.push({
                        ...decoded,
                        _owner: owner
                    });
                }
                if (logEntry.topics[0] === plasmaMethodHash) {
                    decoded = Helpers.decodeLog({eventName: plasmaEventName, logEntry});
                    searchTransactions.push({
                        ...decoded,
                        _owner: owner
                    });
                }
            });
        });
        this.txDispatch({type: 'SEARCH_COMPLETE', payload: {searchTransactions}});
    }

}
Transactions.__instance = null;

export default Transactions;
