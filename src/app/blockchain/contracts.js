// App Components
import { ContractFactory } from './contract-factory';

// Contract Data
import ChargedParticlesData from './contracts/ChargedParticles';
import ChargedParticlesEscrowData from './contracts/ChargedParticlesEscrow';


const ChargedParticles       = ContractFactory.create({name: ChargedParticlesData.contractName,       abi: ChargedParticlesData.abi});
const ChargedParticlesEscrow = ContractFactory.create({name: ChargedParticlesEscrowData.contractName, abi: ChargedParticlesEscrowData.abi});

export {
    ChargedParticles,
    ChargedParticlesEscrow,
}
