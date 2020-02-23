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

        let bridge = 'https://bridge.walletconnect.org';
        let infuraId = GLOBALS.INFURA_ID;
        let qrcode = true;

        this.provider = new WalletConnectProvider({
            bridge,
            infuraId,
            qrcode,
            chainId
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
        await this.provider.close();

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

        // this.provider.on('close', async (code, reason) => {
        //     console.log('wallet-connect closed');
        //     console.log('code', code);
        //     console.log('reason', reason);
        //     // await this.disconnect();
        // });
    }
}

export default WalletConnectWallet;
