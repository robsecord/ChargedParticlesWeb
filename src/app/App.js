import React from 'react';
import { Router } from '@reach/router';

// Common
import { GLOBALS } from '../utils/globals';

// Data Store
import RootStore from './stores/root.store';
import WalletStore from './stores/wallet.store';
import TransactionStore from './stores/transaction.store';

// Page Templates
import AppLayout from './layout/AppLayout';
import Create from './pages/Create';
import Mint from './pages/Mint';
import Manage from './pages/Manage';
import Market from './pages/Market';

function App() {
    return (
        <RootStore>
            <WalletStore>
                <TransactionStore>
                    <AppLayout>
                        <Router>
                            <Market path={GLOBALS.ACCELERATOR_ROOT} />
                            <Create path={`${GLOBALS.ACCELERATOR_ROOT}/create`} />
                            <Mint path={`${GLOBALS.ACCELERATOR_ROOT}/mint`} />
                            <Mint path={`${GLOBALS.ACCELERATOR_ROOT}/mint/:typeId`} />
                            <Manage path={`${GLOBALS.ACCELERATOR_ROOT}/manage`} />
                        </Router>
                    </AppLayout>
                </TransactionStore>
            </WalletStore>
        </RootStore>
    );
}

export default App;
