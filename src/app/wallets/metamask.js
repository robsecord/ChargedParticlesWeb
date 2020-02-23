// Frameworks
import Web3 from 'web3';

import IWalletBase from './base';
import { GLOBALS } from '../../utils/globals';

class MetamaskWallet extends IWalletBase {
    constructor(siteTitle, siteLogo, dispatch) {
        super(GLOBALS.WALLET_TYPE_METAMASK, siteTitle, siteLogo, dispatch);
    }

    static isEnabled() {
        const isModern = !!window.ethereum;
        const isLegacy = (typeof window.web3 !== 'undefined');
        return (isModern || isLegacy) && window.web3.currentProvider.isMetaMask;
    }

    async prepare({rpcUrl, chainId}) {
        // Detect Injected Web3
        if (!MetamaskWallet.isEnabled()) {
            throw new Error('Error: MetaMask is not installed on this browser!');
        }

        // Initialize a Web3 Provider object
        this.provider = window.ethereum || window.web3.currentProvider;

        // Initialize a Web3 object
        this.web3 = new Web3(this.provider);

        // Prepare Base
        await super.prepare();
    }

    async connect() {
        await this.web3.currentProvider.enable(); // send("eth_requestAccounts");
        return await super.connect();
    }
}

export default MetamaskWallet;
