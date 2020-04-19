// Frameworks
import * as _ from 'lodash';

// App Components
import { ContractHelpers } from './contract-helpers';

const _fetchedParticles = {};
const _contractMethodCalls = [
    {contract: 'ChargedParticles', method: 'uri',                as: 'tokenUri',    fields: ['typeId']},
    {contract: 'ChargedParticles', method: 'getMaxSupply',       as: 'maxSupply',   fields: ['typeId']},
    {contract: 'ChargedParticles', method: 'getTotalMinted',     as: 'totalMinted', fields: ['typeId']},
    {contract: 'ChargedParticles', method: 'getMintingFee',      as: 'mintFee',     fields: ['typeId']},
    {contract: 'ChargedParticles', method: 'getTypeTokenBridge', as: 'tokenBridge', fields: ['typeId']},
];


export const ParticleHelpers = {};

// particles = array of objects with at least {typeId}
ParticleHelpers.getParticleData = async (particles = []) => {
    const promises = _.map(particles, particle => {
        return new Promise(async (resolve, reject) => {
            if (!_.isEmpty(_fetchedParticles[particle.typeId])) {
                return resolve(_fetchedParticles[particle.typeId]);
            }

            // Fetch Particle Data from IPFS + Contract
            try {
                const contractData = await ParticleHelpers.fetchCommonContractData(particle);
                const metadata = await ParticleHelpers.getJson(contractData.tokenUri);

                const loadedParticle = {
                    ...particle,
                    ...metadata,
                    ...contractData,
                };
                _fetchedParticles[particle.typeId] = loadedParticle;
                resolve(loadedParticle);
            }
            catch (err) {
                reject(err);
            }
        });
    });

    const particleResults = await Promise.all(promises);
    const particlesById = {};
    _.forEach(particleResults, particleData => {
        particlesById[particleData.typeId] = particleData;
    });
    return particlesById;
};


ParticleHelpers.getJson = (tokenUri) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(tokenUri);
            if (res.status >= 400) {
                return reject('Failed to acquire Particle Type Data');
            }
            resolve(await res.json());
        }
        catch (err) {
            reject(err);
        }
    });
};

ParticleHelpers.readContractValues = (methodCalls) => {
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

ParticleHelpers.fetchCommonContractData = async (particle) => {
    // Read Particle Data
    const calldata = _.map(_contractMethodCalls, methodCall => ({
        ...methodCall,
        args: _.map(methodCall.fields, field => particle[field])
    }));
    return await ParticleHelpers.readContractValues(calldata);
};

ParticleHelpers.cleanCommonTxnFields = (transactions) => {
    return _.compact(_.map(transactions, tx => {
        if (_.isEmpty(tx)) { return; }
        return {
            creator         : tx._owner,
            typeId          : tx._particleTypeId || tx._plasmaTypeId,
            particleTypeId  : tx._particleTypeId || '',
            plasmaTypeId    : tx._plasmaTypeId || '',
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
