// Frameworks
import * as _ from 'lodash';
import toHex from 'to-hex';

// App Components
import Wallet from '../app/wallets';
import ChargedParticlesData from '../app/blockchain/contracts/ChargedParticles';
import { ContractHelpers } from '../app/blockchain/contract-helpers';
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
    const web3 = Wallet.instance().getWeb3();
    if (!web3) { return value; }
    return web3.utils.fromWei(value, 'ether');
};

Helpers.toEtherWithLocale = (value, precision = 0) => {
    if (_.indexOf(value, ',') > -1) { return value; }
    return parseFloat(Helpers.toEther(value)).toLocaleString(void(0), {minimumFractionDigits: precision, maximumFractionDigits: precision});
};
Helpers.toEtherWithLocalePrecise = (precision) => (value) => Helpers.toEtherWithLocale(value, precision);

Helpers.toAscii = (str) => {
    const web3 = Wallet.instance().getWeb3();
    if (!web3) { return str; }
    return web3.utils.hexToAscii(str);
};

Helpers.toBytes16 = (str) => {
    const web3 = Wallet.instance().getWeb3();
    if (!web3) { return str; }
    return web3.utils.utf8ToHex(str);
};

Helpers.toBigNumber = (str) => {
    const web3 = Wallet.instance().getWeb3();
    if (!web3) { return str; }
    return new web3.utils.BN(str);
};

Helpers.toHex = (str) => {
    return toHex(str);
};

Helpers.keccak = ({type, value}) => {
    const web3 = Wallet.instance().getWeb3();
    if (!web3) { return value; }
    return web3.utils.soliditySha3({type, value});
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

Helpers.getJson = (txData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(txData.uri);
            if (res.status >= 400) {
                reject('Failed to acquire Particle Type Data');
            }
            const json = await res.json();
            resolve({...txData, ...json});
        }
        catch (err) {
            reject(err);
        }
    });
};

Helpers.fetchParticleMetadata = (particleTxs, existingParticleData = {}) => {
    return new Promise((resolve, reject) => {
        // Load Particle Data
        const requests = _.map(particleTxs, particleTx => Helpers.getJson(particleTx));
        Promise.all(requests)
            .then((particles) => {
                // Update Particle Data
                const allData = {...existingParticleData};
                _.forEach(particles, particle => {
                    allData[particle.typeId] = particle;
                });
                resolve(allData);
            })
            .catch(reject);
    });
};


Helpers.readContractValues = (methodCalls) => {
    return new Promise(async (resolve, reject) => {
        const requests = _.map(methodCalls, methodCall => {
            return ContractHelpers.readContractValue(methodCall.contract, methodCall.method, ...methodCall.args);
        });
        Promise.all(requests)
            .then((responses) => {
                const result = {};
                _.forEach(methodCalls, (methodCall, index) => {
                    result[methodCall.as] = responses[index];
                });
                resolve(result);
            })
            .catch(reject);
    });
};

Helpers.fetchParticleContractData = (particleTxs, methodCalls, existingParticleData = {}) => {
    return new Promise((resolve, reject) => {
        // Read Particle Data
        const requests = _.map(particleTxs, particleTx => {
            const calldata = _.map(methodCalls, methodCall => ({
                ...methodCall,
                args: _.map(methodCall.fields, field => particleTx[field])
            }));
            return Helpers.readContractValues(calldata);
        });
        Promise.all(requests)
            .then((particles) => {
                // Update Particle Data
                const allData = {...existingParticleData};
                _.forEach(particleTxs, (particleTx, txIndex) => {
                    allData[particleTx.typeId] = particles[txIndex];
                });
                resolve(allData);
            })
            .catch(reject);
    });
};

Helpers.cleanCommonTxnFields = (transactions) => {
    return _.compact(_.map(transactions, tx => {
        if (_.isEmpty(tx)) { return; }
        return {
            creator         : tx._owner,
            typeId          : tx._particleTypeId || tx._plasmaTypeId,
            uri             : tx._uri,
            isPrivate       : tx._isPrivate,
            mintFee         : tx._mintFee || '0',
            isNF            : _.isUndefined(tx._plasmaTypeId),

            // Specific to Particles (ERC-721)
            isSeries        : tx._isSeries || false,
            assetPairId     : tx._assetPairId || '',
            energizeFee     : tx._energizeFee || '0',

            // Specific to Plasma (ERC-20)
            initialMint     : tx._initialMint || '0',
        };
    }));
};

