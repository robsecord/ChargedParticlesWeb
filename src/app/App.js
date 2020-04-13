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
import NetworkContextProvider from './contexts/network';
import WalletContextProvider from './contexts/wallet';
import TransactionContextProvider from './contexts/transaction';
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
                <NetworkContextProvider>
                    <WalletContextProvider>
                        <TransactionContextProvider>
                            <UserInputContextProvider>
                                {children}
                            </UserInputContextProvider>
                        </TransactionContextProvider>
                    </WalletContextProvider>
                </NetworkContextProvider>
            </LocalStorageContextProvider>
        </RootContextProvider>
    );
}

function AppUpdaters() {
    return (
        <>
            <LocalStorageContextUpdater />
        </>
    );
}

function App() {
    return (
        <ThemeProvider theme={{...rimbleTheme, ...theme}}>
            <AppContexts>
                <AppLayout>
                    <AppUpdaters />
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
