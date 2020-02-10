// Frameworks
import * as _ from 'lodash';

// Internals
import { GLOBALS } from '../../utils/globals';

// Wallets
import CoinbaseWallet from './coinbase';
import FortmaticWallet from './fortmatic';
import TorusWallet from './torus';
// import PortisWallet from './portis';
// import UportWallet from './uport';
import AuthereumWallet from './authereum';
import BitskiWallet from './bitski';
import SquareLinkWallet from './squarelink';
import ArkaneWallet from './arkane';
import WalletConnectWallet from './walletconnect';
import MetamaskWallet from './metamask';
import NativeWallet from './native';


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
        return (Wallet.typeMap()[type].wallet).isEnabled();
    }

    async prepare(type = GLOBALS.WALLET_TYPE_COINBASE) {
        const walletData = Wallet.typeMap()[type];
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
        return (Wallet.typeMap()[type]).name || 'Unknown';
    }

    getWeb3() {
        if (!this.wallet) { return; }
        return this.wallet.web3;
    }

    getProvider() {
        if (!this.wallet) { return; }
        return this.wallet.provider;
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

    static typeMap() {
        return _.merge({}, GLOBALS.WALLET_TYPE_SETTINGS, {
            [GLOBALS.WALLET_TYPE_COINBASE]      : {wallet: CoinbaseWallet},
            [GLOBALS.WALLET_TYPE_WALLETCONNECT] : {wallet: WalletConnectWallet},
            [GLOBALS.WALLET_TYPE_FORTMATIC]     : {wallet: FortmaticWallet},
            [GLOBALS.WALLET_TYPE_TORUS]         : {wallet: TorusWallet},
            // [GLOBALS.WALLET_TYPE_PORTIS]        : {wallet: PortisWallet},
            // [GLOBALS.WALLET_TYPE_UPORT]         : {wallet: UportWallet},
            [GLOBALS.WALLET_TYPE_AUTHEREUM]     : {wallet: AuthereumWallet},
            [GLOBALS.WALLET_TYPE_BITSKI]        : {wallet: BitskiWallet},
            [GLOBALS.WALLET_TYPE_SQUARELINK]    : {wallet: SquareLinkWallet},
            [GLOBALS.WALLET_TYPE_ARKANE]        : {wallet: ArkaneWallet},
            [GLOBALS.WALLET_TYPE_METAMASK]      : {wallet: MetamaskWallet},
            [GLOBALS.WALLET_TYPE_NATIVE]        : {wallet: NativeWallet},
        });
    }
}
Wallet.__instance = null;

export default Wallet;
