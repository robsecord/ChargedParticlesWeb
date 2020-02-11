// Frameworks
import * as _ from 'lodash';

// App Components
import Wallet from '../app/wallets';

export const Helpers = {};

Helpers.getBlockieOptions = (walletData, opts = {}) => {
    const defaultOptions = {
        size        : 15,
        scale       : 2,
        seed        : walletData.connectedAddress,
        color       : `#${walletData.connectedAddress.slice(2, 8)}`,
        bgcolor     : `#${walletData.connectedAddress.slice(12, 18)}`,
        spotcolor   : `#${walletData.connectedAddress.slice(22, 28)}`,
    };
    return {...defaultOptions, ...opts};
};

Helpers.getNetworkName = (networkId) => {
    switch (_.parseInt(networkId, 10)) {
        case 1:
            return 'mainnet';
        case 42:
            return 'kovan';
        default:
            return 'development';
    }
};

Helpers.toBytes16 = (str) => {
    const wallet = Wallet.instance();
    return wallet.getWeb3().utils.utf8ToHex(str);
};
