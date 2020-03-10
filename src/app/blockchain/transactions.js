// Frameworks
import { createDfuseClient } from '@dfuse/client';
import * as _ from 'lodash';

// App Components
import {
    ChargedParticles,
    ChargedParticlesEscrow
} from '../blockchain/contracts';
import { LocalCache } from '../../utils/local-cache';
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
        method      : 'ParticleTypeUpdated(uint256,string,bool,bool,string,uint256,string)',
    },

    'UPDATE_PLASMA_TYPE': {   // find latest in logs for full record
        contract    : ChargedParticles,
        eventName   : 'PlasmaTypeUpdated',
        method      : 'PlasmaTypeUpdated(uint256,string,bool,uint256,uint256,string)',
    },

    'MINT_PARTICLE': {
        contract    : ChargedParticles,
        eventName   : 'ParticleMinted',
        method      : '',
    },

    'BURN_PARTICLE': {
        contract    : ChargedParticles,
        eventName   : 'ParticleBurned',
        method      : '',
    },

    'ENERGIZE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'EnergizedParticle',
        method      : '',
    },

    'DISCHARGE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'DischargedParticle',
        method      : '',
    },

    'RELEASE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'ReleasedParticle',
        method      : '',
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
        this.activeSearchId = null;
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
        const transactionHash = LocalCache.get('streamTxHash');
        if (_.isEmpty(transactionHash)) { return; }

        (async () => {
            await this.streamTransaction({transactionHash});
        })();
    }

    clearSearch() {
        if (!this.txDispatch) { return; }
        this.txDispatch({type: 'CLEAR_SEARCH'});
    }

    cancelSearch() {
        this.activeSearchId = null;
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
        if (!this.txDispatch) { return; }
        this.txDispatch({type: 'BEGIN_STREAMING', payload: {transactionHash}});

        let currentTransitions = [];
        let confirmations = 0;
        let count = 0;
        let forceEnd = false;

        LocalCache.set('streamTxHash', transactionHash);

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
                LocalCache.set('streamTxHash', '');
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
        const partialQuery = `topic.3:${GLOBALS.BOOLEAN_FALSE_HEX}`;
        await this._searchCreatedTypes({partialQuery});
    }


    async searchPublicParticles({symbolSearch}) {
        const symbolHash = Helpers.keccakStr(symbolSearch);
        const partialQuery = `topic.2:${symbolHash}`;
        await this._searchCreatedTypes({partialQuery});
    }


    async getCreatedParticlesByOwner({owner}) {
        const partialQuery = `signer:${_.toLower(owner)}`;
        await this._searchCreatedTypes({partialQuery, onVerifyNode: (node) => {
            return (_.toLower(node.from) === _.toLower(owner)); // Validate Owner
        }});
    }


    async _searchCreatedTypes({partialQuery, limit = '11', cursor = '', onVerifyNode}) {
        if (!this.txDispatch) { return; }
        this.txDispatch({type: 'BEGIN_SEARCH', payload: {}});

        const particleEventId = 'UPDATE_PARTICLE_TYPE';
        const plasmaEventId = 'UPDATE_PLASMA_TYPE';
        const contract = transactionEventMap[particleEventId].contract.instance();
        const contractAddress = _.toLower(contract.getAddress());

        const particleEventName = transactionEventMap[particleEventId].eventName;
        const particleMethodHash = Helpers.keccakStr(transactionEventMap[particleEventId].method);
        const plasmaEventName = transactionEventMap[plasmaEventId].eventName;
        const plasmaMethodHash = Helpers.keccakStr(transactionEventMap[plasmaEventId].method);

        const query = `address: ${contractAddress} (topic.0:${particleMethodHash} OR topic.0:${plasmaMethodHash}) ${partialQuery}`;
        console.log('query', query);
        const activeSearchId = Helpers.keccakStr(query);
        this.activeSearchId = activeSearchId;

        const response = await this.client.graphql(searchTransactionEvent, {
            variables: {
                query,
                limit,
                cursor,
                lowBlockNum: GLOBALS.STARTING_BLOCK,
            }
        });

        if (this.activeSearchId !== activeSearchId) {
            return; // Another search initiated after this one; ignore current
        }

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

            // Verify Node
            if (_.isFunction(onVerifyNode) && !onVerifyNode(node)) { return; }

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


}
Transactions.__instance = null;

export default Transactions;
