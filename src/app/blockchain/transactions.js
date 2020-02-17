// Frameworks
import { createDfuseClient } from '@dfuse/client';
import * as _ from 'lodash';

// App Components
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';

// Queries
import { streamTransactionQuery } from './queries/StreamTransactionQuery';
import { searchTransactionEvent } from './queries/SearchTransactionEvent';

// Transaction Events
const transactionEventMap = {
    'CREATE_PARTICLE_TYPE': {
        method: 'ParticleTypeCreated(uint256,string,bool,bool,string,uint256)',
        hash: '0xc201e7d2252eddeae969c897081b09a2442f097cb2b71d5257d1b22b26f265da'
    }
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
        // TODO: check for "transactionHash" in localStorage
        console.log('TODO: Resume Incomplete Streams..');
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

        // TODO: save "transactionHash" to localStorage

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
                // TODO: clear "transactionHash" from localStorage
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

        const method = transactionEventMap[eventId].method;
        // const query = `signer:${_.toLower(owner)} method:'${method}'`;

        const methodHash = transactionEventMap[eventId].hash;
        const query = `signer:${_.toLower(owner)} method:'${method}' topic.0:${methodHash}`;

        let searchTransactions = [];

        console.log('calling dFuse search with query: ', query);

        const response = await this.client.graphql(searchTransactionEvent, {
            variables: {
                query,
                indexName: 'LOGS',
                lowBlockNum: '0',
                highBlockNum: '-1',
                sort: 'DESC',
                limit: '10',
                cursor: ''
            }
        });

        console.log('response', response);

        if (response.errors) {
            this.txDispatch({type: 'SEARCH_ERROR', payload: {
                searchError: JSON.stringify(response.errors)
            }});
            return;
        }

        const edges = response.data.searchTransactions.edges || [];
        if (edges.length > 0) {
            searchTransactions = edges.map(edge => edge.node);
        }
        this.txDispatch({type: 'SEARCH_COMPLETE', payload: {searchTransactions}});
    }

}
Transactions.__instance = null;

export default Transactions;
