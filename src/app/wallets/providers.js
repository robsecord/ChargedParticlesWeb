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
import NativeWallet from './native';

// Vendor Logos
import WalletConnectLogo from "../../images/vendor/walletconnect-circle.svg";
import PortisLogo from "../../images/vendor/portis.svg";
import TorusLogo from "../../images/vendor/torus.svg";
import SquarelinkLogo from "../../images/vendor/squarelink.svg";
import FortmaticLogo from "../../images/vendor/fortmatic.svg";
import ArkaneLogo from "../../images/vendor/arkane.svg";
import AuthereumLogo from "../../images/vendor/authereum.svg";

import MetaMaskLogo from "../../images/vendor/metamask.svg";
import SafeLogo from "../../images/vendor/safe.svg";
import TrustLogo from "../../images/vendor/trust.svg";
import CoinbaseLogo from "../../images/vendor/coinbase.svg";
import CipherLogo from "../../images/vendor/cipher.svg";
import imTokenLogo from "../../images/vendor/imtoken.svg";
import StatusLogo from "../../images/vendor/status.svg";
import OperaLogo from "../../images/vendor/opera.svg";



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
        logo: (<WalletConnectLogo />),
        isDisabled: true,
        options: {}
    },
    [GLOBALS.WALLET_TYPE_FORTMATIC]     : {
        name: 'Fortmatic',
        type: 'web',
        check: 'isFortmatic',
        className: 'fortmatic',
        wallet: FortmaticWallet,
        logo: (<FortmaticLogo />),
        isDisabled: true,
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
        isDisabled: true,
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
        isDisabled: true,
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
