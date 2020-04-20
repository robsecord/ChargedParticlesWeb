// App Components
import { ContractFactory } from './contract-factory';

// Contract Data
import ChargedParticlesData from './contracts/ChargedParticles';
import ChargedParticlesEscrowData from './contracts/ChargedParticlesEscrow';
import ChargedParticlesERC1155Data from './contracts/ChargedParticlesERC1155';
import DaiAbi from './contracts/dai';

// Charged Particles Contracts
const ChargedParticles       = ContractFactory.create({name: ChargedParticlesData.contractName,       abi: ChargedParticlesData.abi});
const ChargedParticlesEscrow = ContractFactory.create({name: ChargedParticlesEscrowData.contractName, abi: ChargedParticlesEscrowData.abi});
const ChargedParticlesERC1155 = ContractFactory.create({name: ChargedParticlesERC1155Data.contractName, abi: ChargedParticlesERC1155Data.abi});

// Asset Token Contracts
const DAI = ContractFactory.create({name: 'DAI', abi: DaiAbi});


// Helpers
const _contractMap = {
    ChargedParticles,
    ChargedParticlesEscrow,
    ChargedParticlesERC1155,
    DAI
};
const getContractByName = (contractName) => {
    return _contractMap[contractName];
};

export {
    getContractByName,
    ChargedParticles,
    ChargedParticlesEscrow,
    ChargedParticlesERC1155,
    DAI,
}
