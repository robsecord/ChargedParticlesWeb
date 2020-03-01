// Frameworks
import { ArkaneConnect } from '@arkane-network/arkane-connect';

import IWalletBase from './base';
import { GLOBALS } from '../../utils/globals';

class ArkaneWallet extends IWalletBase {
    constructor(siteTitle, siteLogo, dispatch) {
        super(GLOBALS.WALLET_TYPE_ARKANE, siteTitle, siteLogo, dispatch);
    }

    async prepare({rpcUrl, chainId, options}) {
        // Initialize Arkane Network
        let params = void(0);
        if (options.uniqueId === 'Arketype') {
            params = {environment: 'staging'};
        }
        this.arkaneConnect = new ArkaneConnect(options.uniqueId, params);
    }

    async connect() {
        const account = await this.arkaneConnect.flows.getAccount('ETHEREUM');
        if (account.isAuthenticated) {
            await this.changeUserAccount(account.wallets);
        }
    }
}

export default ArkaneWallet;
