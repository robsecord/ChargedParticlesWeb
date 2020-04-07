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
    'background_color'  : 'FFF',    // TODO
    'properties'        : {},       // TODO - OpenSea
    'attributes'        : [],       // TODO - OpenSea
};


const ContractHelpers = {};



ContractHelpers.saveMetadata = ({ particleData, onProgress }) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Generate Token Metadata
            const jsonMetadata          = {...tokenMetadata};
            jsonMetadata.name           = particleData.name;
            jsonMetadata.symbol         = particleData.symbol;
            jsonMetadata.description    = particleData.desc;
            jsonMetadata.external_url   = `${GLOBALS.ACCELERATOR_URL}${GLOBALS.ACCELERATOR_ROOT}/type/{id}`;
            // jsonMetadata.properties = {};
            // jsonMetadata.attributes = [];

            // Save Image File(s) to IPFS
            onProgress('Saving Image(s) to IPFS..');
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
            onProgress('Saving Metadata to IPFS..');
            const jsonFileUrl = await IPFS.saveJsonFile({jsonObj: jsonMetadata});
            console.log('jsonFileUrl', jsonFileUrl, jsonMetadata);

            resolve({jsonFileUrl, jsonMetadata});
        }
        catch (err) {
            reject(err);
        }
    });
};


ContractHelpers.createParticle = ({from, particleData, onProgress, payWithIons = false}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ethPrice = 0;
            if (!payWithIons) {
                ethPrice = GLOBALS.CREATE_PARTICLE_PRICE.ETH.NFT;
            }

            // Is Series or Collection?
            particleData.isSeries = particleData.classification === 'series';
            particleData.accessType = (particleData.isPrivate ? 2 : 1) | (particleData.isSeries ? 4 : 8);

            const {jsonFileUrl} = await ContractHelpers.saveMetadata({particleData, onProgress});

            // Create Particle on Blockchain
            onProgress('Creating Blockchain Transaction..');
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

            console.log('tx', tx);
            console.log('args', args);

            // // Submit Transaction and wait for Receipt
            chargedParticles.sendContractTx('createParticle', tx, args, (err, transactionHash) => {
                if (err) {
                    return reject(err);
                }
                resolve({tx, args, transactionHash});
            });
        }
        catch (err) {
            reject(err);
        }
    });
};

ContractHelpers.createPlasma = ({from, particleData, onProgress, payWithIons = false}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ethPrice = 0;
            if (!payWithIons) {
                ethPrice = GLOBALS.CREATE_PARTICLE_PRICE.ETH.FT;
            }
            const {jsonFileUrl} = await ContractHelpers.saveMetadata({particleData, onProgress});

            // Create Plasma on Blockchain
            onProgress('Creating Blockchain Transaction..');
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

            console.log('tx', tx);
            console.log('args', args);

            // // Submit Transaction and wait for Receipt
            chargedParticles.sendContractTx('createPlasma', tx, args, (err, transactionHash) => {
                if (err) {
                    return reject(err);
                }
                resolve({tx, args, transactionHash});
            });
        }
        catch (err) {
            reject(err);
        }
    });
};

ContractHelpers.mintParticle = () => {

};

ContractHelpers.mintPlasma = () => {

};

ContractHelpers.readContractValue = async (contractName, method, ...args) => {
    const contract = getContractByName(contractName);
    if (!contract) {
        throw new Error(`[ContractHelpers.readContractValue] Invalid Contract Name: ${contractName}`);
    }
    return await contract.instance().callContractFn(method, ...args);
};

export { ContractHelpers, tokenMetadata };
