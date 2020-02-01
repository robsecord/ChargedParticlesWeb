// Frameworks
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

import IWalletBase from './base';
import { GLOBALS } from '../../utils/globals';

class FortmaticWallet extends IWalletBase {
    constructor(site, store) {
        super(GLOBALS.WALLET_TYPE_FORTMATIC, site, store);
    }

    async init({rpcUrl, chainId, options}) {
        // Initialize Fortmatic
        this.fortmatic = new Fortmatic(options.uniqueId);

        // Initialize a Web3 Provider object
        this.provider = this.fortmatic.getProvider();

        // Initialize a Web3 object
        this.web3 = new Web3(this.provider);

        // Initialize Base
        await super.init();
    }

    async disconnect() {
        // Disconnect Fortmatic
        if (this.fortmatic) {
            this.fortmatic.user.logout();
        }

        // Disconnect Base
        await super.disconnect();
    }
}

export default FortmaticWallet;
