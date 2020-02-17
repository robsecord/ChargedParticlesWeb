
import * as _ from 'lodash';

const RECEIPT_WATCH_INTERVAL = 1000;

export const ContractFactory = {

    create({name, abi}) {
        let _instance;
        let _utils;

        function _createInstance({logger}) {
            return Object.create(_.assignIn({}, ContractFactory.objInterface, {
                contractReady: false,
                contractName: name,
                contractAddress: null,
                contractAbi: abi,
                contract: null,
                web3: null,
                log: logger || console.log,
            }));
        }

        function _connect() {
            if (!_utils) {
                throw new Error(`Contract Instance for "${name}" has not been prepared!`);
            }
            _instance = _createInstance(_utils);
            _instance.connectToContract(_utils);
        }

        return {
            prepare: ({web3, address, logger}) => {
                _utils = {web3, address, logger};
            },
            reconnect: _connect,
            instance: () => {
                if (!_instance) {
                    _connect();
                }
                return _instance;
            }
        };
    },

    objInterface: {
        getNetworkId() {
            return this.web3.eth.net.getId();
        },

        getNetworkType() {
            return this.web3.eth.net.getNetworkType();
        },

        getNetworkPeerCount() {
            return this.web3.eth.net.getPeerCount();
        },

        connectToContract({web3, address}) {
            this.web3 = web3;
            this.contractAddress = address;
            if (_.isEmpty(address)) {
                this.contractReady = false;
                return;
            }
            this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
            this.contractReady = (this.contract instanceof this.web3.eth.Contract);
        },

        isReady() {
            return this.contractReady;
        },

        getEventsFromContract(eventName, eventOptions) {
            return this.contract.getPastEvents(eventName, eventOptions);
        },

        callContractFn(contractMethod, ...args) {
            if (!this.contractReady) {
                return Promise.reject(`Web3 Provider not ready (calling "${this.contractName}->${contractMethod}")`);
            }
            return this.contract.methods[contractMethod](...args).call();
        },

        sendContractTx(contractMethod, tx, args, callback) {
            if (!this.contractReady) {
                return Promise.reject(`Web3 Provider not ready (calling "${this.contractName}->${contractMethod}")`);
            }
            this.contract.methods[contractMethod](...args).send(tx, callback);
        },

        tryContractTx(contractMethod, tx, ...args) {
            if (!this.contractReady) {
                return Promise.reject(`Web3 Provider not ready (calling "${this.contractName}->${contractMethod}")`);
            }
            return this.contract.methods[contractMethod](...args).send(tx);
        },

        getReceipt(hash) {
            return this.web3.eth.getTransactionReceipt(hash);
        },

        getTransactionReceipt(hash) {
            return new Promise((resolve, reject) => {
                const _getReceipt = () => {
                    this.getReceipt(hash)
                        .then(receipt => {
                            if (receipt === null) {
                                // Try again in X seconds
                                setTimeout(() => {
                                    _getReceipt();
                                }, RECEIPT_WATCH_INTERVAL);
                                return;
                            }
                            resolve(receipt);
                        })
                        .catch(reject);
                };
                _getReceipt();
            });
        }
    }
};
