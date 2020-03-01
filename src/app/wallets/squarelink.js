// Frameworks
import Squarelink from 'squarelink';
import Web3 from 'web3';

import IWalletBase from './base';
import { GLOBALS } from '../../utils/globals';

class SquareLinkWallet extends IWalletBase {
    constructor(siteTitle, siteLogo, dispatch) {
        super(GLOBALS.WALLET_TYPE_SQUARELINK, siteTitle, siteLogo, dispatch);
    }

    async prepare({rpcUrl, chainId, options}) {
        // Initialize SquareLink
        this.sqlk = new Squarelink(options.uniqueId);

        // Initialize a Web3 Provider object
        this.provider = await this._getProvider();

        // Initialize a Web3 object
        this.web3 = new Web3(this.provider);
    }

    async connect() {
        return await this.connect();
    }

    _getProvider() {
        return new Promise(resolve => {
            this.sqlk.getProvider(resolve);
        });
    }
}

export default SquareLinkWallet;
