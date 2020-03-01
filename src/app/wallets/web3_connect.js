// Frameworks
import * as _ from 'lodash';
import Web3 from 'web3';
import Web3Connect from 'web3connect';

// Vendors
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Squarelink from "squarelink";
import Torus from "@toruslabs/torus-embed";
import Arkane from "@arkane-network/web3-arkane-provider";
import Authereum from "authereum";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";

// Internals
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';


class Wallet {
    constructor() {
        this.web3 = null;
        this.web3Connect = null;
        this.provider = null;
        this.dispatchState = null;

        this.providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: _.last(GLOBALS.RPC_URL.split('/'))
                }
            },
            portis: {
                package: Portis,
                options: {
                    id: process.env.GATSBY_PORTIS_DAPP_ID
                }
            },
            fortmatic: {
                package: Fortmatic,
                options: {
                    key: process.env.GATSBY_FORTMATIC_APIKEY
                }
            },
            squarelink: {
                package: Squarelink,
                options: {
                    id: process.env.GATSBY_SQUARELINK_DAPP_ID
                }
            },
            // torus: {
            //     package: Torus, // required
            //     options: {
            //         enableLogging: false, // optional
            //         buttonPosition: "bottom-left", // optional
            //         buildEnv: "production", // optional
            //         showTorusButton: true, // optional
            //         enabledVerifiers: {
            //             // optional
            //             google: false // optional
            //         }
            //     }
            // },
            arkane: {
                package: Arkane,
                options: {
                    clientId: process.env.GATSBY_ARKANE_CLIENT_ID
                }
            },
            // authereum: {
            //     package: Authereum, // required
            //     options: {}
            // },
            // burnerconnect: {
            //     package: BurnerConnectProvider, // required
            //     options: {}
            // },
        };
    }

    static instance() {
        if (!Wallet.__instance) {
            Wallet.__instance = new Wallet();
        }
        return Wallet.__instance;
    }

    init({walletDispatch}) {
        this.dispatchState = walletDispatch;
    }

    async prepare() {
        const network = Helpers.getNetworkName(GLOBALS.CHAIN_ID);
        this.web3Connect = new Web3Connect.Core({
            network,
            cacheProvider   : false,
            providerOptions : this.providerOptions
        });
        // if (this.web3Connect.cachedProvider) {
        //     await this.connect();
        // }
    }

    async connect() {
        this.provider = await this.web3Connect.connect();
        this.web3 = this.initWeb3();
        await this.subscribeProvider();
        return await this.changeUserAccount();
    }

    async disconnect() {
        this.web3Connect.clearCachedProvider();
    }

    static getName(type) {
    }

    getWeb3() {
        return this.web3;
    }

    getProvider() {
        return this.provider;
    }

    async changeUserAccount() {
        const payload = {
            networkId   : 0,
            type        : '',
            name        : '',
            address     : '',
            balance     : 0,
        };
        this.dispatchState({type: 'ALL_READY', payload: false});
        this.dispatchState({type: 'CONNECTED_ACCOUNT', payload});

        const accounts = await this.web3.eth.getAccounts();
        if (_.isEmpty(accounts)) { return; }

        const address = _.first(accounts) || '';

        console.log('>>>>>  this.web3.eth', this.web3.eth);
        console.log('>>>>>  accounts', accounts);
        console.log('>>>>>  address', address);
        console.log('>>>>>  coinbase', await this.web3.eth.getCoinbase());

        payload.networkId = _.parseInt(this.provider.networkVersion, 10);
        payload.type = 'web3connect';//this.web3Connect.getInjectedProviderName();
        payload.address = address;
        payload.name = _.join([..._.slice(address, 0, 6), '...', ..._.slice(address, -4)], '');
        payload.balance = 0; // await this.web3.eth.getBalance(address);

        console.log('>>>>>  payload', payload);

        this.dispatchState({type: 'CONNECTED_ACCOUNT', payload});

        setTimeout(() => {
            this.dispatchState({type: 'ALL_READY', payload: true});
        }, 1);

        return payload;
    }

    async subscribeProvider() {
        this.provider.on('close', () => this.resetApp());

        this.provider.on('accountsChanged', async (accounts) => {
            // await this.setState({ address: accounts[0] });
            // await this.getAccountAssets();
            console.log('accountsChanged');
        });

        this.provider.on('chainChanged', async (chainId) => {
            // const { web3 } = this.state;
            // const networkId = await web3.eth.net.getId();
            // await this.setState({ chainId, networkId });
            // await this.getAccountAssets();
            console.log('chainChanged');
        });

        this.provider.on('networkChanged', async (networkId) => {
            // const { web3 } = this.state;
            // const chainId = await web3.eth.chainId();
            // await this.setState({ chainId, networkId });
            // await this.getAccountAssets();
            console.log('networkChanged');
        })
    }

    initWeb3() {
        const web3 = new Web3(this.provider);

        web3.eth.extend({
            methods: [
                {
                    name: 'chainId',
                    call: 'eth_chainId',
                    outputFormatter: web3.utils.hexToNumber
                }
            ]
        });
        return web3
    }

}
Wallet.__instance = null;

export default Wallet;
