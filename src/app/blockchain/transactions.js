// Frameworks
import { createDfuseClient } from '@dfuse/client';

// App Components
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';


class Transactions {

    constructor() {
        this.apiKey = GLOBALS.DFUSE_API_KEY;
        this.dispatchState = null;
        this.stream = null;
        this.client = null;
    }

    static instance() {
        if (!Transactions.__instance) {
            Transactions.__instance = new Transactions();
        }
        return Transactions.__instance;
    }

    init({rootDispatch}) {
        this.dispatchState = rootDispatch;
    }

    connectToNetwork({networkId}) {
        this.client = createDfuseClient({
            apiKey: this.apiKey,
            network: Helpers.getNetworkName(networkId),
            streamClientOptions: {
                socketOptions: {
                    onClose: this.onClose,
                    onError: this.onError,
                }
            }
        });
    }

    onClose() {
        this.dispatchState({type: 'DISCONNECTED_NETWORK', payload: {
            isNetworkConnected: false,
            networkErrors: []
        }});
    }

    onError(error) {
        this.dispatchState({type: 'DISCONNECTED_NETWORK', payload: {
            isNetworkConnected: false,
            networkErrors: ["Transactions: An error occurred with the socket.", JSON.stringify(error)]
        }});
    }

}
Transactions.__instance = null;

export default Transactions;
