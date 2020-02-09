// Frameworks
import React, { useContext, useState, useEffect } from 'react';

// Data Context for State
import { WalletContext } from '../stores/wallet.store';

// Contract Data
import {
    ChargedParticles,
    ChargedParticlesEscrow
} from '../blockchain/contracts';


// Swap Route
const View = () => {
    const [walletState] = useContext(WalletContext);
    const { allReady, connectedAddress } = walletState;

    const [peerCount, setPeerCount] = useState(0);
    const [contractOwner, setContractOwner] = useState('0x0');

    useEffect(() => {
        if (allReady) {
            (async () => {
                const cp = ChargedParticles.instance();

                const peers = await cp.getNetworkPeerCount();
                setPeerCount(peers);

                const owner = await cp.callContractFn('owner');
                setContractOwner(owner);
            })();
        }
    }, [allReady, setPeerCount, setContractOwner]);

    const _getAccountData = () => {
        if (!allReady) { return 'Not Connected'; }
        return (
            <div>
                <span>Account Address: </span>
                {connectedAddress}
            </div>
        );
    };

    const _getContractOwner = () => {
        if (!allReady) { return ''; }

        return (
            <div>
                <span>Contract Owner: </span>
                {contractOwner}
            </div>
        );
    };

    const _getPeerCount = () => {
        if (!allReady) { return ''; }
        return (
            <div>
                <span>Peer Count: </span>
                {peerCount}
            </div>
        );
    };

    return (
        <>
            <h2>View Existing Particles!</h2>
            {_getPeerCount()}
            {_getAccountData()}
            {_getContractOwner()}
        </>
    )
};

export default View;
