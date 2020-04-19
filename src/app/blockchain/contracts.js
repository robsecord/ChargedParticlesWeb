// App Components
import { ContractFactory } from './contract-factory';

// Contract Data
import ChargedParticlesData from './contracts/ChargedParticles';
import ChargedParticlesEscrowData from './contracts/ChargedParticlesEscrow';
import DaiAbi from './contracts/dai';

// Charged Particles Contracts
const ChargedParticles       = ContractFactory.create({name: ChargedParticlesData.contractName,       abi: ChargedParticlesData.abi});
const ChargedParticlesEscrow = ContractFactory.create({name: ChargedParticlesEscrowData.contractName, abi: ChargedParticlesEscrowData.abi});

// Asset Token Contracts
const DAI = ContractFactory.create({name: 'DAI', abi: DaiAbi});


// Helpers
const _contractMap = {ChargedParticles, ChargedParticlesEscrow, DAI};
const getContractByName = (contractName) => {
    return _contractMap[contractName];
};

export {
    getContractByName,
    ChargedParticles,
    ChargedParticlesEscrow,
    DAI,
}
