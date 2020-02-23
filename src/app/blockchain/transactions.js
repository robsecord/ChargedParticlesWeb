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
    // 'CREATE_PARTICLE_TYPE': {
    //     eventName: 'ParticleTypeCreated',
    //     method: 'ParticleTypeCreated(uint256,string,bool,bool,string,uint256,uint16)',
    //     hash: '0xf21712078d07c8f6113360cff723aa378a66ea4fbf84b7f963aaaf5aabe999c0',
    // },

    'UPDATE_PARTICLE_TYPE': {   // find latest in logs for full record
        contract    : ChargedParticles,
        eventName   : 'ParticleTypeUpdated',
        method      : 'ParticleTypeUpdated(uint256,string,bool,bool,string,uint256,uint16)',
        hash        : '0xc428215361d42d56e92ee4eab4f93562276ccfce64238f55f138d86f97ea22d2',
    },

    'MINT_PARTICLE': {
        contract    : ChargedParticles,
        eventName   : 'ParticleMinted',
        method      : 'ParticleMinted(uint256,uint256,string)',
        hash        : '0x72b3b853f3f2ac9829ae716e6e9a4be69b8eb03f54e331e72004bf4f16e0f622',
    },

    'BURN_PARTICLE': {
        contract    : ChargedParticles,
        eventName   : 'ParticleBurned',
        method      : 'ParticleBurned(uint256,uint256)',
        hash        : '0x06cbc21e86440195808ffdb1a12a5fb80b27daa8686e0270b784b1a84b4dec51',
    },

    'ENERGIZE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'EnergizedParticle',
        method      : 'EnergizedParticle(address,uint256,bytes16,uint256,uint256)',
        hash        : '0x86bc5fbc42fef15a4ea86854606b3656142f755038ff4758177d34ff0dab948e',
    },

    'DISCHARGE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'DischargedParticle',
        method      : 'DischargedParticle(address,uint256,address,bytes16,uint256,uint256)',
        hash        : '0x2e9c971780e3865718eb2e4c20e3f5fda964d6e023641a0008212b53999cca1d',
    },

    'RELEASE_PARTICLE': {
        contract    : ChargedParticlesEscrow,
        eventName   : 'ReleasedParticle',
        method      : 'ReleasedParticle(address,uint256,address,bytes16,uint256)',
        hash        : '0x562bf32d1b1932a57a7e89b5ef87929b9b93b912bda6144ed92270744d6f1774',
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

    async searchTransactionsByEvent({eventId, owner}) {
        this.txDispatch({type: 'BEGIN_SEARCH', payload: {}});

        const contract = transactionEventMap[eventId].contract.instance();
        const contractAddress = _.toLower(contract.getAddress());
        const eventName = transactionEventMap[eventId].eventName;
        const methodHash = transactionEventMap[eventId].hash;
        const query = `address: ${contractAddress} signer:${_.toLower(owner)} topic.0:${methodHash}`;
        console.log('query', query);

        const response = await this.client.graphql(searchTransactionEvent, {
            variables: {
                query,
                limit: '11',
                lowBlockNum: '6000000'
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

            _.forEach(node.matchingLogs, (logEntry) => {
                // Validate Topic (Method Hash)
                if (logEntry.topics[0] !== methodHash) {
                    console.log(`Skipping wrong topic ${logEntry.topics[0]}`);
                    return;
                }

                // Get Decoded Transaction Data
                const decoded = Helpers.decodeLog({eventName, logEntry});
                searchTransactions.push(decoded);
            });
        });

        this.txDispatch({type: 'SEARCH_COMPLETE', payload: {searchTransactions}});
    }

}
Transactions.__instance = null;

export default Transactions;
