// Frameworks
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

import IWalletBase from './base';
import { GLOBALS } from '../../utils/globals';

class FortmaticWallet extends IWalletBase {
    constructor(siteTitle, siteLogo, dispatch) {
        super(GLOBALS.WALLET_TYPE_FORTMATIC, siteTitle, siteLogo, dispatch);
    }

    async prepare({rpcUrl, chainId, options}) {
        const chainName = this.getChainName(chainId);

        // Initialize Fortmatic
        this.fortmatic = new Fortmatic(options.uniqueId, chainName);

        // Initialize a Web3 Provider object
        this.provider = this.fortmatic.getProvider();

        // Initialize a Web3 object
        this.web3 = new Web3(this.provider);

        // Initialize Base
        await super.prepare();
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
