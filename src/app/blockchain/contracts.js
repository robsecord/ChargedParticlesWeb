// App Components
import { ContractFactory } from './contract-factory';

// Contract Data
import ChargedParticlesData from './contracts/ChargedParticles';
import ChargedParticlesEscrowData from './contracts/ChargedParticlesEscrow';

const ChargedParticles       = ContractFactory.create({name: ChargedParticlesData.contractName,       abi: ChargedParticlesData.abi});
const ChargedParticlesEscrow = ContractFactory.create({name: ChargedParticlesEscrowData.contractName, abi: ChargedParticlesEscrowData.abi});

const _contractMap = {ChargedParticles, ChargedParticlesEscrow};
const getContractByName = (contractName) => {
    return _contractMap[contractName];
};

export {
    getContractByName,
    ChargedParticles,
    ChargedParticlesEscrow,
}
