// Frameworks
import React from 'react';
import * as _ from 'lodash';

// App Components
import { GLOBALS } from '../../utils/globals';
import IPFS from '../../utils/ipfs';

// Contract Data
import { ChargedParticles } from '../blockchain/contracts';


// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema
// https://docs.opensea.io/docs/metadata-standards
const tokenMetadata = {
    'description'       : '',
    'external_url'      : '',
    'animation_url'     : '',
    'youtube_url'       : '',
    'image'             : '',
    'name'              : '',
    'symbol'            : '',
    'decimals'          : 18,
    'background_color'  : 'FFF',
    'properties'        : {},
    'attributes'        : [],   // OpenSea
};


const ContractHelpers = {};



ContractHelpers.saveMetadata = ({ particleData, onProgress }) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Save Image File to IPFS
            onProgress('Saving Image to IPFS..');
            const imageFileUrl = await IPFS.saveImageFile({fileBuffer: particleData.iconBuffer});
            console.log('imageFileUrl', imageFileUrl);

            // Generate Token Metadata
            const metadata          = {...tokenMetadata};
            metadata.name           = particleData.name;
            metadata.symbol         = particleData.symbol;
            metadata.description    = particleData.desc;
            metadata.external_url   = `${GLOBALS.ACCELERATOR_URL}${GLOBALS.ACCELERATOR_ROOT}/type/{id}`;
            metadata.image          = imageFileUrl;
            // metadata.properties = {};
            // metadata.attributes = [];

            // Save Metadata to IPFS
            onProgress('Saving Metadata to IPFS..');
            const jsonFileUrl = await IPFS.saveJsonFile({jsonObj: metadata});
            console.log('jsonFileUrl', jsonFileUrl, metadata);

            resolve({imageFileUrl, jsonFileUrl});
        }
        catch (err) {
            reject(err);
        }
    });
};


ContractHelpers.createParticle = ({ from, particleData, onProgress, payWithIons = false}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ethPrice = GLOBALS.CREATE_PARTICLE_PRICE.ETH.NFT;
            const {jsonFileUrl} = await ContractHelpers.saveMetadata({particleData, onProgress});

            // Is Series or Collection?
            particleData.isSeries = particleData.classification === 'series';

            // Create Particle on Blockchain
            onProgress('Creating Blockchain Transaction..');
            const chargedParticles = ChargedParticles.instance();
            const tx = {from, value: ethPrice};
            const args = [
                jsonFileUrl,                // string memory _uri,
                particleData.symbol,        // string memory _symbol,
                particleData.isPrivate,     // bool _isPrivate,
                particleData.isSeries,      // bool _isSeries,
                particleData.assetPair,     // string _assetPairId,
                particleData.supply,        // uint256 _maxSupply,
                particleData.creatorFee,    // uint256 _creatorFee
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

ContractHelpers.createPlasma = ({ from, particleData, onProgress, payWithIons = false}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ethPrice = GLOBALS.CREATE_PARTICLE_PRICE.ETH.FT;

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
                particleData.ethPerToken,   // uint256 _ethPerToken,
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

export { ContractHelpers, tokenMetadata };
