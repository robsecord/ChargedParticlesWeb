// Frameworks
import React, { useContext } from 'react';

// Data Context for State
import { WalletContext } from '../stores/wallet.store';


// Swap Route
const View = () => {
    const [walletState] = useContext(WalletContext);
    const { allReady } = walletState;

    const _getAccountData = () => {
        if (!allReady) { return 'Not Connected'; }
        return (
            <div>
                <span>Account Address: </span>
                [Account Address here..]
            </div>
        );
    };

    const _getContractOwner = () => {
        if (!allReady) { return ''; }
        return (
            <div>
                <span>Contract Owner: </span>
                [Owner Address here..]
            </div>
        );
    };

    return (
        <>
            <h2>View Existing Particles!</h2>
            {_getAccountData()}
            {_getContractOwner()}
        </>
    )
};

export default View;
