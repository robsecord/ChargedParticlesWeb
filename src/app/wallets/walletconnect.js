// Frameworks
import Web3 from 'web3';
// import WalletConnect from "@walletconnect/browser";
// import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from '@walletconnect/web3-provider';

import IWalletBase from './base';
import { GLOBALS } from '../../utils/globals';

class WalletConnectWallet extends IWalletBase {
    constructor(siteTitle, siteLogo, dispatch) {
        super(GLOBALS.WALLET_TYPE_WALLETCONNECT, siteTitle, siteLogo, dispatch);
    }

    async prepare({rpcUrl, chainId}) {
        // Initialize WalletConnect
        // this.walletConnector = new WalletConnect({
        //     bridge: 'https://bridge.walletconnect.org'
        // });

        this.provider = new WalletConnectProvider({
            infuraId: GLOBALS.INFURA_ID
        });

        this.web3 = new Web3(this.provider);

        // await this.connect();
        this.hookCustomEvents();
        this._hookCommonEvents();
    }

    async connect() {
        // Check if connection is already established
        // if (this.walletConnector.connected) { return; }

        // create new session
        // await this.walletConnector.createSession();

        // display QR Code modal
        // const uri = this.walletConnector.uri;
        // WalletConnectQRCodeModal.open(uri, () => {
        //     console.log('QR Code Modal closed');
        // });

        await this.provider.enable();
        return await super.connect();
    }

    async disconnect() {
        // Disconnect WalletConnect
        // if (this.walletConnector) {
        //     await this.walletConnector.killSession();
        // }

        // Disconnect Base
        await super.disconnect();
    }

    hookCustomEvents() {
        // this.walletConnector.on('connect', async (error, payload) => {
        //     if (error) { throw error; }
        //     console.log('walletConnector connect');
        //
        //     // Close QR Code Modal
        //     WalletConnectQRCodeModal.close();
        //
        //     // Get provided accounts and chainId
        //     const { accounts } = payload.params[0];
        //     await this.changeUserAccount(accounts);
        // });
        //
        // this.walletConnector.on('session_update', async (error, payload) => {
        //     if (error) { throw error; }
        //     console.log('walletConnector session_update');
        //     const { accounts } = payload.params[0];
        //     await this.changeUserAccount(accounts);
        // });
        //
        // this.walletConnector.on('disconnect', async (error, payload) => {
        //     if (error) { throw error; }
        //     console.log('walletConnector disconnect');
        //     delete this.walletConnector;
        //     await super.disconnect();
        // });

        this.provider.on('close', async (code, reason) => {
            await this.disconnect();
        });
    }
}

export default WalletConnectWallet;
