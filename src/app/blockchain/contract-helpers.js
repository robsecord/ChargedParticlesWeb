// Frameworks
import React from 'react';
import * as _ from 'lodash';

// App Components
import { GLOBALS } from '../../utils/globals';
import IPFS from '../../utils/ipfs';

// Contract Data
import {
    getContractByName,
    ChargedParticles
} from '../blockchain/contracts';


// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema
// https://docs.opensea.io/docs/metadata-standards
const tokenMetadata = {
    'description'       : '',
    'external_url'      : '',
    'animation_url'     : '',       // TODO
    'youtube_url'       : '',       // TODO
    'icon'              : '',
    'image'             : '',
    'name'              : '',
    'symbol'            : '',
    'decimals'          : 18,
    'background_color'  : 'FFF',
    'attributes'        : [],
};

const _contractErrorHandler = (methodName, txDispatch) => (err, txProof) => {
    const msg = _.get(err, 'message', err.toString());
    if (_.isEmpty(txProof) && /denied transaction signature/i.test(msg)) {
        txDispatch({type: 'CLEAR_STREAM'});
        return;
    }

    const errorMsg = [`[${methodName}]`];
    if (/gateway timeout/i.test(msg)) {
        errorMsg.push('Failed to save Image and/or Metadata to IPFS!');
    } else {
        errorMsg.push('An unexpected error has occurred!');
        console.error(err);
    }

    console.info(`[${methodName}] ${msg}`);
    txDispatch({
        type: 'STREAM_ERROR',
        payload: {streamError: errorMsg.join(' ')}
    });
};


const ContractHelpers = {};

ContractHelpers.readContractValue = async (contractName, method, ...args) => {
    const contract = getContractByName(contractName);
    if (!contract) {
        throw new Error(`[ContractHelpers.readContractValue] Invalid Contract Name: ${contractName}`);
    }
    return await contract.instance().callContractFn(method, ...args);
};

ContractHelpers.saveMetadata = ({ particleData, txDispatch }) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Generate Token Metadata
            const jsonMetadata            = {...tokenMetadata};
            jsonMetadata.name             = particleData.name;
            jsonMetadata.symbol           = particleData.symbol;
            jsonMetadata.description      = particleData.desc;
            jsonMetadata.external_url     = `${GLOBALS.ACCELERATOR_URL}${GLOBALS.ACCELERATOR_ROOT}/type/{id}`;

            if (_.has(jsonMetadata, 'backgroundColor')) {
                jsonMetadata.background_color = particleData.backgroundColor.replace('#', '');
            }

            // Rich Metadata from Custom Attributes
            jsonMetadata.attributes = _.map(particleData.attributes || [], attr => {
                const options = {
                    'trait_type' : attr.name,
                    'value'      : attr.value,
                };
                if (attr.type !== 'properties') {
                    options.value = parseFloat(attr.value);
                }
                if (!_.isEmpty(attr.maxValue)) {
                    options['max_value'] = parseFloat(attr.maxValue);
                }
                if (attr.type === 'stats') {
                    options['display_type'] = 'number';
                }
                if (attr.type === 'boost_number') {
                    options['display_type'] = 'boost_number';
                }
                if (attr.type === 'boost_percentage') {
                    options['display_type'] = 'boost_percentage';
                }
                return options;
            });

            // Save Image File(s) to IPFS
            txDispatch({
                type: 'STREAM_TRANSITION', payload: {
                    streamTransitions: [{to: 'CREATE', transition: 'IPFS_IMG'}]
                }
            });
            if (particleData.isSeries) {
                // Icon
                jsonMetadata.icon = await IPFS.saveImageFile({fileBuffer: particleData.iconBuffer});

                // Image
                jsonMetadata.image = await IPFS.saveImageFile({fileBuffer: particleData.imageBuffer});
            } else {
                // Icon as Image
                jsonMetadata.image = await IPFS.saveImageFile({fileBuffer: particleData.iconBuffer});
            }

            // Save Metadata to IPFS
            txDispatch({
                type: 'STREAM_TRANSITION', payload: {
                    streamTransitions: [{to: 'CREATE', transition: 'IPFS_META'}]
                }
            });
            const jsonFileUrl = await IPFS.saveJsonFile({jsonObj: jsonMetadata});

            resolve({jsonFileUrl, jsonMetadata});
        }
        catch (err) {
            reject(err);
        }
    });
};


ContractHelpers.createParticle = ({from, particleData, txDispatch, payWithIons = false}) => {
    return new Promise(async (resolve) => {
        const handleError = _contractErrorHandler('createParticle', txDispatch);
        let transactionHash = '';

        try {
            txDispatch({type: 'BEGIN_TX'});

            let ethPrice = 0;
            if (!payWithIons) {
                ethPrice = GLOBALS.CREATE_PARTICLE_PRICE.ETH.NFT;
            }

            // Is Series or Collection?
            particleData.isSeries = particleData.classification === 'series';
            particleData.accessType = (particleData.isPrivate ? 2 : 1) | (particleData.isSeries ? 4 : 8);

            const {jsonFileUrl} = await ContractHelpers.saveMetadata({particleData, txDispatch});

            // Update Transition State
            txDispatch({
                type: 'STREAM_TRANSITION', payload: {
                    streamTransitions: [{to: 'CREATE', transition: 'TX_PROMPT'}]
                }
            });

            // Create Particle on Blockchain
            const chargedParticles = ChargedParticles.instance();
            const tx = {from, value: ethPrice};
            const args = [
                from,                       // address _creator,
                jsonFileUrl,                // string memory _uri,
                particleData.symbol,        // string memory _symbol,
                particleData.accessType,    // uint8 _accessType,
                particleData.assetPair,     // string _assetPairId,
                particleData.supply,        // uint256 _maxSupply,
                particleData.mintFee,       // uint256 _mintFee,
                particleData.energizeFee,   // uint256 _energizeFee,
                payWithIons,                // bool _payWithIons
            ];

            // console.log('tx', tx);
            // console.log('args', args);

            // Submit Transaction and wait for Receipt
            chargedParticles.sendContractTx('createParticle', tx, args, (err, txHash) => {
                transactionHash = txHash;
                if (err) {
                    handleError(err, transactionHash);
                    return resolve({transactionHash});
                }
                txDispatch({type: 'SUBMIT_TX', payload: {transactionHash}});
                resolve({tx, args, transactionHash});
            });
        }
        catch (err) {
            handleError(err, transactionHash);
            resolve({transactionHash});
        }
    });
};

ContractHelpers.createPlasma = ({from, particleData, txDispatch, payWithIons = false}) => {
    return new Promise(async (resolve) => {
        const handleError = _contractErrorHandler('createPlasma', txDispatch);
        let transactionHash = '';

        try {
            txDispatch({type: 'BEGIN_TX'});

            let ethPrice = 0;
            if (!payWithIons) {
                ethPrice = GLOBALS.CREATE_PARTICLE_PRICE.ETH.FT;
            }
            const {jsonFileUrl} = await ContractHelpers.saveMetadata({particleData, txDispatch});

            // Update Transition State
            txDispatch({
                type: 'STREAM_TRANSITION', payload: {
                    streamTransitions: [{to: 'CREATE', transition: 'TX_PROMPT'}]
                }
            });

            // Create Plasma on Blockchain
            const chargedParticles = ChargedParticles.instance();
            const tx = {from, value: ethPrice};
            const args = [
                from,                       // address _creator,
                jsonFileUrl,                // string memory _uri,
                particleData.symbol,        // string memory _symbol,
                particleData.isPrivate,     // bool _isPrivate,
                particleData.supply,        // uint256 _maxSupply,
                particleData.mintFee,       // uint256 _mintFee,
                particleData.amountToMint,  // uint256 _initialMint,
                payWithIons                 // bool _payWithIons
            ];

            // console.log('tx', tx);
            // console.log('args', args);

            // Submit Transaction and wait for Receipt
            chargedParticles.sendContractTx('createPlasma', tx, args, (err, txHash) => {
                transactionHash = txHash;
                if (err) {
                    handleError(err, transactionHash);
                    return resolve({transactionHash});
                }
                txDispatch({type: 'SUBMIT_TX', payload: {transactionHash}});
                resolve({tx, args, transactionHash});
            });
        }
        catch (err) {
            handleError(err, transactionHash);
            resolve({transactionHash});
        }
    });
};

ContractHelpers.mintParticle = () => {

};

ContractHelpers.mintPlasma = () => {

};

export { ContractHelpers, tokenMetadata };
