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

// Data Contexts
import RootContextProvider from './contexts/root';
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/local-storage';
import WalletContextProvider, { Updater as WalletContextUpdater } from './contexts/wallet';
import NetworkContextProvider, { Updater as NetworkContextUpdater } from './contexts/network';
import TransactionContextProvider, { Updater as TransactionContextUpdater } from './contexts/transaction';
import UserInputContextProvider from './contexts/user-input';

// Page Templates
import AppLayout from './layout/AppLayout';
import Create from './pages/Create';
import Mint from './pages/Mint';
import Manage from './pages/Manage';
import Market from './pages/Market';


function AppContexts({ children }) {
    return (
        <RootContextProvider>
            <LocalStorageContextProvider>
                <WalletContextProvider>
                    <NetworkContextProvider>
                        <TransactionContextProvider>
                            <UserInputContextProvider>
                                {children}
                            </UserInputContextProvider>
                        </TransactionContextProvider>
                    </NetworkContextProvider>
                </WalletContextProvider>
            </LocalStorageContextProvider>
        </RootContextProvider>
    );
}

function AppUpdaters() {
    return (
        <>
            <LocalStorageContextUpdater />
            <WalletContextUpdater />
            <NetworkContextUpdater />
            <TransactionContextUpdater />
        </>
    );
}

function App() {
    return (
        <ThemeProvider theme={{...rimbleTheme, ...theme}}>
            <AppContexts>
                <AppUpdaters />
                <AppLayout>
                    <Router>
                        <Market path={GLOBALS.ACCELERATOR_ROOT} />
                        <Create path={`${GLOBALS.ACCELERATOR_ROOT}/create`} />
                        <Mint path={`${GLOBALS.ACCELERATOR_ROOT}/mint`} />
                        <Mint path={`${GLOBALS.ACCELERATOR_ROOT}/mint/:typeId`} />
                        <Manage path={`${GLOBALS.ACCELERATOR_ROOT}/manage`} />
                    </Router>
                </AppLayout>
            </AppContexts>
        </ThemeProvider>
    );
}

export default App;
