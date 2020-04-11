import React from 'react';
import { Router } from '@reach/router';

// Material UI
import { ThemeProvider } from '@material-ui/core/styles';

// Rimble UI
import { theme as rimbleTheme } from 'rimble-ui';

// Custom Styles
import '../layout/styles/overrides.css';
import theme from '../layout/styles/root.theme';

// Common
import { GLOBALS } from '../utils/globals';

// Data Store
import RootStore from './stores/root.store';
import NetworkStore from './stores/network.store';
import WalletStore from './stores/wallet.store';
import TransactionStore from './stores/transaction.store';
import UserInputStore from './stores/user-input.store';

// Page Templates
import AppLayout from './layout/AppLayout';
import Create from './pages/Create';
import Mint from './pages/Mint';
import Manage from './pages/Manage';
import Market from './pages/Market';


function Stores({ children }) {
    return (
        <RootStore>
            <NetworkStore>
                <WalletStore>
                    <TransactionStore>
                        <UserInputStore>
                            {children}
                        </UserInputStore>
                    </TransactionStore>
                </WalletStore>
            </NetworkStore>
        </RootStore>
    );
}

function Updaters() {
    return (
        <>
            {/*<LocalStorageContextUpdater />*/}
            {/*<ApplicationContextUpdater />*/}
            {/*<TransactionContextUpdater />*/}
            {/*<BalancesContextUpdater />*/}
        </>
    );
}

function App() {
    return (
        <ThemeProvider theme={{...rimbleTheme, ...theme}}>
            <Stores>
                <AppLayout>
                    <Updaters />
                    <Router>
                        <Market path={GLOBALS.ACCELERATOR_ROOT} />
                        <Create path={`${GLOBALS.ACCELERATOR_ROOT}/create`} />
                        <Mint path={`${GLOBALS.ACCELERATOR_ROOT}/mint`} />
                        <Mint path={`${GLOBALS.ACCELERATOR_ROOT}/mint/:typeId`} />
                        <Manage path={`${GLOBALS.ACCELERATOR_ROOT}/manage`} />
                    </Router>
                </AppLayout>
            </Stores>
        </ThemeProvider>
    );
}

export default App;
