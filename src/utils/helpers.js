// Frameworks
import * as _ from 'lodash';

// App Components
import Wallet from '../app/wallets';
import ChargedParticlesData from '../app/blockchain/contracts/ChargedParticles';
import { GLOBALS } from './globals';

export const Helpers = {};

Helpers.getFriendlyPrice = (tokenType, isNft) => {
    tokenType = _.toUpper(tokenType);
    const pricing = GLOBALS.CREATE_PARTICLE_PRICE[tokenType];
    if (_.isUndefined(pricing)) { return false; }
    const weiPrice = _.parseInt(pricing[isNft ? 'NFT' : 'FT'], 10);
    return `${weiPrice / GLOBALS.ETH_UNIT}`;
};

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
        case 3:
            return 'ropsten';
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

Helpers.decodeLog = ({eventName, logEntry}) => {
    const wallet = Wallet.instance();
    const eventData = _.find(ChargedParticlesData.abi, {type: 'event', name: eventName});
    const eventAbi = _.get(eventData, 'inputs', []);
    if (_.isEmpty(eventAbi)) { return false; }
    return wallet.getWeb3().eth.abi.decodeLog(eventAbi, logEntry.data, logEntry.topics.slice(1));
};
