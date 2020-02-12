// Frameworks
import { createDfuseClient } from '@dfuse/client';
import * as _ from 'lodash';

// App Components
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';

// Queries
import { streamTransactionQuery } from './queries/StreamTransactionQuery';

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

}
Transactions.__instance = null;

export default Transactions;
