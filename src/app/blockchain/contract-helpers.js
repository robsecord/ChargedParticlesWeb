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
    'decimals'          : 18,
    'background_color'  : 'FFF',
    'properties'        : {},
    'attributes'        : [],   // OpenSea
};


const ContractHelpers = {};


ContractHelpers.createParticleWithEth = ({ from, particleData, onProgress }) => {
    return new Promise(async (resolve) => {

        const ethPrice = particleData.isNonFungible ? '70000000000000' : '35000000000000';

        // Save Image File to IPFS
        onProgress('Saving Image to IPFS..');
        const imageFileUrl = await IPFS.saveImageFile({fileBuffer: particleData.particleIconBuffer});
        console.log('imageFileUrl', imageFileUrl);

        // Generate Token Metadata
        const metadata = {...tokenMetadata};
        metadata.name = particleData.particleName;
        metadata.description = particleData.particleDesc;
        metadata.external_url = `${GLOBALS.ACCELERATOR_URL}${GLOBALS.ACCELERATOR_ROOT}/type/{id}`;
        metadata.image = imageFileUrl;
        // metadata.properties = {};
        // metadata.attributes = [];

        // Save Metadata to IPFS
        onProgress('Saving Metadata to IPFS..');
        const jsonFileUrl = await IPFS.saveJsonFile({jsonObj: metadata});
        console.log('jsonFileUrl', jsonFileUrl);

        // Create Particle on Blockchain
        onProgress('Creating Blockchain Transaction..');
        const chargedParticles = ChargedParticles.instance();
        const tx = {from, value: ethPrice};
        const args = [
            jsonFileUrl,                            // string memory _uri,
            particleData.isNonFungible,             // bool _isNF,
            particleData.isPrivate,                 // bool _isPrivate,
            particleData.particleAssetPair,         // string _assetPairId,
            `${particleData.particleSupply}`,       // uint256 _maxSupply,
            `${particleData.particleCreatorFee}`,   // uint16 _creatorFee
        ];

        // // Submit Transaction and wait for Receipt
        chargedParticles.sendContractTx('createParticleWithEther', tx, args, (err, transactionHash) => {
            if (err) {
                return reject(err);
            }
            resolve({tx, args, transactionHash});
        });
    });
};


export { ContractHelpers, tokenMetadata };
