// Frameworks
import Portis from '@portis/web3';
import Web3 from 'web3';

import IWalletBase from './base';
import { GLOBALS } from '../../utils/globals';

class PortisWallet extends IWalletBase {
    constructor(siteTitle, siteLogo, dispatch) {
        super(GLOBALS.WALLET_TYPE_PORTIS, siteTitle, siteLogo, dispatch);
    }

    async prepare({rpcUrl, chainId, options}) {
        const chainName = this.getChainName(chainId);

        // Initialize Portis
        this.portis = new Portis(options.uniqueId, chainName);

        // Initialize a Web3 Provider object
        this.provider = this.portis.provider;

        // Initialize a Web3 object
        this.web3 = new Web3(this.provider);

        this.hookCustomEvents();

        // Initialize Base
        await super.prepare();
    }

    async disconnect() {
        // Disconnect Portis
        if (this.portis) {
            this.portis.logout();
        }

        // Disconnect Base
        await super.disconnect();
    }

    hookCustomEvents() {
        this.portis.onLogout(async () => {
            await super.disconnect();
        });

        this.portis.onActiveWalletChanged(async account => {
            await this.changeUserAccount([account]);
        });

        this.portis.onError(err => {
            console.error(err);
        });
    }
}

export default PortisWallet;
