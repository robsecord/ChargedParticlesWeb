// Frameworks
import React from 'react';
import * as _ from 'lodash';

// Internals
import { GLOBALS } from '../../utils/globals';

// Wallets
import CoinbaseWallet from './coinbase';
import FortmaticWallet from './fortmatic';
import TorusWallet from './torus';
import PortisWallet from './portis';
import AuthereumWallet from './authereum';
import SquareLinkWallet from './squarelink';
import ArkaneWallet from './arkane';
import WalletConnectWallet from './walletconnect';
import MetamaskWallet from './metamask';

// Vendor Logos
// import WalletConnectLogo from '../../images/vendor/walletconnect.svg';
import PortisLogo from '../../images/vendor/portis.svg';
import TorusLogo from '../../images/vendor/torus.svg';
import SquarelinkLogo from '../../images/vendor/squarelink.svg';
import FortmaticLogo from '../../images/vendor/fortmatic.svg';
import ArkaneLogo from '../../images/vendor/arkane.svg';
import AuthereumLogo from '../../images/vendor/authereum.svg';

import MetaMaskLogo from '../../images/vendor/metamask.svg';
import SafeLogo from '../../images/vendor/safe.svg';
import TrustLogo from '../../images/vendor/trust.svg';
import CoinbaseLogo from '../../images/vendor/coinbase.svg';
import CipherLogo from '../../images/vendor/cipher.svg';
import imTokenLogo from '../../images/vendor/imtoken.svg';
import StatusLogo from '../../images/vendor/status.svg';
import OperaLogo from '../../images/vendor/opera.svg';



const WalletProviders = {
    // [GLOBALS.WALLET_TYPE_COINBASE]      : {
    //     name: 'Coinbase WalletLink',
    //     type: 'qr',
    //     check: '',
    //     className: 'coinbaseWalletlink',
    //     wallet: CoinbaseWallet,
    //     logo: (),
    //     options: {}
    // },
    [GLOBALS.WALLET_TYPE_WALLETCONNECT] : {
        name: 'Wallet Connect',
        type: 'qr',
        check: 'isWalletConnect',
        className: 'walletConnect',
        wallet: WalletConnectWallet,
        logo: (<img alt={'Wallet Connect'} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzAwcHgiIGhlaWdodD0iMTg1cHgiIHZpZXdCb3g9IjAgMCAzMDAgMTg1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0OS4zICg1MTE2NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+V2FsbGV0Q29ubmVjdDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJ3YWxsZXRjb25uZWN0LWxvZ28tYWx0IiBmaWxsPSIjM0I5OUZDIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8cGF0aCBkPSJNNjEuNDM4NTQyOSwzNi4yNTYyNjEyIEMxMTAuMzQ5NzY3LC0xMS42MzE5MDUxIDE4OS42NTA1MywtMTEuNjMxOTA1MSAyMzguNTYxNzUyLDM2LjI1NjI2MTIgTDI0NC40NDgyOTcsNDIuMDE5Njc4NiBDMjQ2Ljg5Mzg1OCw0NC40MTQwODY3IDI0Ni44OTM4NTgsNDguMjk2MTg5OCAyNDQuNDQ4Mjk3LDUwLjY5MDU5OSBMMjI0LjMxMTYwMiw3MC40MDYxMDIgQzIyMy4wODg4MjEsNzEuNjAzMzA3MSAyMjEuMTA2MzAyLDcxLjYwMzMwNzEgMjE5Ljg4MzUyMSw3MC40MDYxMDIgTDIxMS43ODI5MzcsNjIuNDc0OTU0MSBDMTc3LjY2MTI0NSwyOS4wNjY5NzI0IDEyMi4zMzkwNTEsMjkuMDY2OTcyNCA4OC4yMTczNTgyLDYyLjQ3NDk1NDEgTDc5LjU0MjMwMiw3MC45Njg1NTkyIEM3OC4zMTk1MjA0LDcyLjE2NTc2MzMgNzYuMzM3MDAxLDcyLjE2NTc2MzMgNzUuMTE0MjIxNCw3MC45Njg1NTkyIEw1NC45Nzc1MjY1LDUxLjI1MzA1NjEgQzUyLjUzMTk2NTMsNDguODU4NjQ2OSA1Mi41MzE5NjUzLDQ0Ljk3NjU0MzkgNTQuOTc3NTI2NSw0Mi41ODIxMzU3IEw2MS40Mzg1NDI5LDM2LjI1NjI2MTIgWiBNMjgwLjIwNjMzOSw3Ny4wMzAwMDYxIEwyOTguMTI4MDM2LDk0LjU3NjkwMzEgQzMwMC41NzM1ODUsOTYuOTcxMyAzMDAuNTczNTk5LDEwMC44NTMzOCAyOTguMTI4MDY3LDEwMy4yNDc3OTMgTDIxNy4zMTc4OTYsMTgyLjM2ODkyNyBDMjE0Ljg3MjM1MiwxODQuNzYzMzUzIDIxMC45MDczMTQsMTg0Ljc2MzM4IDIwOC40NjE3MzYsMTgyLjM2ODk4OSBDMjA4LjQ2MTcyNiwxODIuMzY4OTc5IDIwOC40NjE3MTQsMTgyLjM2ODk2NyAyMDguNDYxNzA0LDE4Mi4zNjg5NTcgTDE1MS4xMDc1NjEsMTI2LjIxNDM4NSBDMTUwLjQ5NjE3MSwxMjUuNjE1NzgzIDE0OS41MDQ5MTEsMTI1LjYxNTc4MyAxNDguODkzNTIxLDEyNi4yMTQzODUgQzE0OC44OTM1MTcsMTI2LjIxNDM4OSAxNDguODkzNTE0LDEyNi4yMTQzOTMgMTQ4Ljg5MzUxLDEyNi4yMTQzOTYgTDkxLjU0MDU4ODgsMTgyLjM2ODkyNyBDODkuMDk1MDUyLDE4NC43NjMzNTkgODUuMTMwMDEzMywxODQuNzYzMzk5IDgyLjY4NDQyNzYsMTgyLjM2OTAxNCBDODIuNjg0NDEzMywxODIuMzY5IDgyLjY4NDM5OCwxODIuMzY4OTg2IDgyLjY4NDM4MjcsMTgyLjM2ODk3IEwxLjg3MTk2MzI3LDEwMy4yNDY3ODUgQy0wLjU3MzU5NjkzOSwxMDAuODUyMzc3IC0wLjU3MzU5NjkzOSw5Ni45NzAyNzM1IDEuODcxOTYzMjcsOTQuNTc1ODY1MyBMMTkuNzkzNjkyOSw3Ny4wMjg5OTggQzIyLjIzOTI1MzEsNzQuNjM0NTg5OCAyNi4yMDQyOTE4LDc0LjYzNDU4OTggMjguNjQ5ODUzMSw3Ny4wMjg5OTggTDg2LjAwNDgzMDYsMTMzLjE4NDM1NSBDODYuNjE2MjIxNCwxMzMuNzgyOTU3IDg3LjYwNzQ3OTYsMTMzLjc4Mjk1NyA4OC4yMTg4NzA0LDEzMy4xODQzNTUgQzg4LjIxODg3OTYsMTMzLjE4NDM0NiA4OC4yMTg4ODc4LDEzMy4xODQzMzggODguMjE4ODk2OSwxMzMuMTg0MzMxIEwxNDUuNTcxLDc3LjAyODk5OCBDMTQ4LjAxNjUwNSw3NC42MzQ1MzQ3IDE1MS45ODE1NDQsNzQuNjM0NDQ0OSAxNTQuNDI3MTYxLDc3LjAyODc5OCBDMTU0LjQyNzE5NSw3Ny4wMjg4MzE2IDE1NC40MjcyMjksNzcuMDI4ODY1MyAxNTQuNDI3MjYyLDc3LjAyODg5OSBMMjExLjc4MjE2NCwxMzMuMTg0MzMxIEMyMTIuMzkzNTU0LDEzMy43ODI5MzIgMjEzLjM4NDgxNCwxMzMuNzgyOTMyIDIxMy45OTYyMDQsMTMzLjE4NDMzMSBMMjcxLjM1MDE3OSw3Ny4wMzAwMDYxIEMyNzMuNzk1NzQsNzQuNjM1NTk2OSAyNzcuNzYwNzc4LDc0LjYzNTU5NjkgMjgwLjIwNjMzOSw3Ny4wMzAwMDYxIFoiIGlkPSJXYWxsZXRDb25uZWN0Ij48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=" />),
        options: {}
    },
    [GLOBALS.WALLET_TYPE_FORTMATIC]     : {
        name: 'Fortmatic',
        type: 'web',
        check: 'isFortmatic',
        className: 'fortmatic',
        wallet: FortmaticWallet,
        logo: (<FortmaticLogo />),
        options: {
            uniqueId: process.env.GATSBY_FORTMATIC_APIKEY
        }
    },
    [GLOBALS.WALLET_TYPE_TORUS]         : {
        name: 'Torus',
        type: 'web',
        check: 'isTorus',
        className: 'torus',
        wallet: TorusWallet,
        logo: (<TorusLogo />),
        isDisabled: true,
        options: {}
    },
    [GLOBALS.WALLET_TYPE_PORTIS]        : {
        name: 'Portis',
        type: 'web',
        check: 'isPortis',
        className: 'portis',
        wallet: PortisWallet,
        logo: (<PortisLogo />),
        options: {
            uniqueId: process.env.GATSBY_PORTIS_DAPP_ID
        }
    },
    [GLOBALS.WALLET_TYPE_AUTHEREUM]     : {
        name: 'Authereum',
        type: 'web',
        check: 'isAuthereum',
        className: 'authereum',
        wallet: AuthereumWallet,
        logo: (<AuthereumLogo />),
        options: {}
    },
    [GLOBALS.WALLET_TYPE_SQUARELINK]    : {
        name: 'SquareLink',
        type: 'web',
        check: 'isSquarelink',
        className: 'squareLink',
        wallet: SquareLinkWallet,
        logo: (<SquarelinkLogo />),
        isDisabled: true,
        options: {
            uniqueId: process.env.GATSBY_SQUARELINK_DAPP_ID
        }
    },
    [GLOBALS.WALLET_TYPE_ARKANE]        : {
        name: 'Arkane',
        type: 'web',
        check: 'isArkane',
        wallet: ArkaneWallet,
        className: 'arkane',
        logo: (<ArkaneLogo />),
        isDisabled: true,
        options: {
            uniqueId: process.env.GATSBY_ARKANE_CLIENT_ID
        }
    },
    [GLOBALS.WALLET_TYPE_METAMASK]      : {
        name: 'MetaMask',
        type: 'native',
        check: 'isMetaMask',
        className: 'metamask',
        wallet: MetamaskWallet,
        logo: (<MetaMaskLogo />),
        options: {}
    },
};

export { WalletProviders };
