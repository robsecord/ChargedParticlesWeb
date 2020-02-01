// Frameworks
import * as _ from 'lodash';

class IWalletBase {
    constructor(type, dispatch) {
        this.type = type;
        this.dispatchState = dispatch;

        this.web3 = null;
        this.provider = null;
    }

    static isEnabled() {
        return true;
    }

    async prepare() {
        // Get Default Account if already Connected
        await this.changeUserAccount();
        this._hookCommonEvents();
    }

    async connect() {
        return await this.changeUserAccount();
    }

    async disconnect() {
        this.dispatchState({type: 'LOGOUT'});
    }

    async changeUserAccount() {
        const payload = {
            networkId   : 0,
            type        : '',
            name        : '',
            address     : '',
            balance     : 0,
        };
        this.dispatchState({type: 'ALL_READY', payload: false});
        this.dispatchState({type: 'CONNECTED_ACCOUNT', payload});
        console.log('cleared state');

        const accounts = await this.web3.eth.getAccounts();
        if (_.isEmpty(accounts)) { return; }

        const address = _.first(accounts) || '';

        // console.log('>>>>>  this.web3.eth', this.web3.eth);
        // console.log('>>>>>  accounts', accounts);
        // console.log('>>>>>  address', address);
        // console.log('>>>>>  coinbase', await this.web3.eth.getCoinbase());

        payload.networkId = _.parseInt(this.provider.networkVersion, 10);
        payload.type = this.type;
        payload.address = address;
        payload.name = _.join([..._.slice(address, 0, 6), '...', ..._.slice(address, -4)], '');
        payload.balance = await this.web3.eth.getBalance(address);

        this.dispatchState({type: 'CONNECTED_ACCOUNT', payload});


        setTimeout(() => {
            this.dispatchState({type: 'ALL_READY', payload: true});
            console.log('set ready state');
        }, 1);

        return payload;
    }

    getChainName(chainId) {
        if (chainId === '1') { return 'mainnet'; }
        if (chainId === '3') { return 'ropsten'; }
        if (chainId === '42') { return 'kovan'; }
        return 'localhost';
    }

    _hookCommonEvents() {
        const _changeAccount = async () => {
            await this.changeUserAccount();
        };
        this.provider.on('accountsChanged', _changeAccount);
        this.provider.on('networkChanged', _changeAccount);
    }
}

export default IWalletBase;
