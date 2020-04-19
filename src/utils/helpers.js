// Frameworks
import Web3 from 'web3';
import * as _ from 'lodash';
import toHex from 'to-hex';

// App Components
import Wallet from '../app/wallets';
import ChargedParticlesData from '../app/blockchain/contracts/ChargedParticles';
import { GLOBALS } from './globals';

export const Helpers = {};

Helpers.now = () => {
    return (new Date()).getTime();
};

Helpers.sleep = (delay = 0) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
};

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

Helpers.toEther = (value) => {
    if (!_.isString(value)) {
        value = value.toLocaleString('fullwide', {useGrouping: false});
    }
    return Web3.utils.fromWei(value, 'ether');
};

Helpers.toEtherWithLocale = (value, precision = 0) => {
    if (_.indexOf(value, ',') > -1) { return value; }
    return parseFloat(Helpers.toEther(value)).toLocaleString(void(0), {minimumFractionDigits: precision, maximumFractionDigits: precision});
};
Helpers.toEtherWithLocalePrecise = (precision) => (value) => Helpers.toEtherWithLocale(value, precision);

Helpers.toAscii = (str) => {
    return Web3.utils.hexToAscii(str);
};

Helpers.toBytes16 = (str) => {
    return Web3.utils.utf8ToHex(str);
};

Helpers.toBigNumber = (str) => {
    return new Web3.utils.BN(str);
};

Helpers.toHex = (str) => {
    return toHex(str);
};

Helpers.keccak = ({type, value}) => {
    return Web3.utils.soliditySha3({type, value});
};

Helpers.keccakStr = (str) => {
    return Helpers.keccak({type: 'string', value: str});
};

Helpers.decodeLog = ({eventName, logEntry}) => {
    const web3 = Wallet.instance().getWeb3();
    if (!web3) { return null; }
    const eventData = _.find(ChargedParticlesData.abi, {type: 'event', name: eventName});
    const eventAbi = _.get(eventData, 'inputs', []);
    if (_.isEmpty(eventAbi)) { return false; }
    return web3.eth.abi.decodeLog(eventAbi, logEntry.data, logEntry.topics.slice(1));
};
