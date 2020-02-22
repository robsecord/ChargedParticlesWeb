// Frameworks
import * as _ from 'lodash';

// Internals
import { GLOBALS } from '../../utils/globals';

// Wallets
import { WalletProviders } from '../wallets/providers.js';


class Wallet {
    constructor() {
        this.dispatchState = null;
    }

    static instance() {
        if (!Wallet.__instance) {
            Wallet.__instance = new Wallet();
        }
        return Wallet.__instance;
    }

    init({walletDispatch}) {
        this.dispatchState = walletDispatch;
    }

    static isEnabled(type) {
        return (WalletProviders[type].wallet).isEnabled();
    }

    async prepare(type = GLOBALS.WALLET_TYPE_METAMASK) {
        const walletData = WalletProviders[type];
        const walletClass = walletData.wallet;
        this.wallet = new walletClass(this.dispatchState);
        await this.wallet.prepare({options: walletData.options, ...Wallet._getEnv()});
    }

    async connect() {
        if (!this.wallet) { return; }
        return await this.wallet.connect();
    }

    async disconnect() {
        if (!this.wallet) { return; }
        await this.wallet.disconnect();
    }

    static getName(type) {
        return (WalletProviders[type]).name || 'Unknown';
    }

    getWeb3() {
        if (!this.wallet) { return; }
        return this.wallet.web3;
    }

    getProvider() {
        if (!this.wallet) { return; }
        return this.wallet.provider;
    }

    checkInjectedProviders() {
        const result = {
            injectedAvailable: !!window.ethereum || !!window.web3
        };
        if (result.injectedAvailable) {
            let fallbackProvider = true;
            _.forEach(WalletProviders, (providerInfo) => {
                result[providerInfo.check] = this.verifyInjectedProvider(providerInfo.check);
                if (result[providerInfo.check] === true) {
                    fallbackProvider = false;
                }
            });
            // Nitfy Wallet fix
            if (result['isMetamask']) {
                if (this.verifyInjectedProvider('isNiftyWallet')) {
                    result['isMetamask'] = false;
                    result['isNiftyWallet'] = true;
                }
            }
            // Coinbase Wallet fix
            if (result['isCipher']) {
                if (this.verifyInjectedProvider('isToshi')) {
                    result['isCipher'] = false;
                    result['isToshi'] = true;
                }
            }
            if (fallbackProvider) {
                result['isWeb3'] = true;
            }
        }

        return result;
    }

    verifyInjectedProvider(check) {
        return window.ethereum
            ? window.ethereum[check] || (window.web3 && window.web3.currentProvider)
                ? window.web3
                    ? window.web3.currentProvider[check]
                    : true
                : false
            : window.web3 && window.web3.currentProvider
                ? window.web3.currentProvider[check]
                : false;
    }

    static _getEnv() {
        const rpcUrl = GLOBALS.RPC_URL;
        const chainId = GLOBALS.CHAIN_ID;
        if (_.isEmpty(rpcUrl)) {
            console.error('Invalid RPC-URL.  Make sure you have set the correct ENV VARs to connect to Web3; ("ETH_JSONRPC_URL").');
        }
        if (_.isEmpty(chainId)) {
            console.error('Invalid Chain-ID.  Make sure you have set the correct ENV VARs to connect to Web3; ("ETH_CHAIN_ID").');
        }
        return {rpcUrl, chainId};
    }
}
Wallet.__instance = null;

export default Wallet;
