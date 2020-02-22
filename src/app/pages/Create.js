// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import * as _ from 'lodash';

// App Components
import FormCreateParticle from '../components/FormCreateParticle.js';
import Transactions from '../blockchain/transactions';
import { ContractHelpers } from '../blockchain/contract-helpers.js';

// Data Context for State
import { WalletContext } from '../stores/wallet.store';

// Material UI
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

// Rimble UI
import {
    Box,
    Flex,
    Loader,
    Heading,
} from 'rimble-ui';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';


// Create Route
const Create = () => {
    const classes = useRootStyles();
    const [ walletState ] = useContext(WalletContext);
    const { connectedAddress } = walletState;
    const [ isSubmitting, setSubmitting ] = useState(false);
    const [ txData, setTxData ] = useState({});
    const [ loadingProgress, setLoadingProgress ] = useState('');

    useEffect(() => {
        if (isSubmitting && !_.isEmpty(txData)) {
            const { transactionHash } = txData;
            console.log('CreateParticle - transaction sent;');
            console.log('  txData', txData);
            // txData = {
            //     "txReceipt": {
            //         "blockHash": "0x4803d2fac723d06a26de69bbb3469b7e0313a80a0fef7c178766b912df9a0804",
            //         "blockNumber": 16713927,
            //         "contractAddress": null,
            //         "cumulativeGasUsed": 214502,
            //         "from": "0xbd04a07082fd5f2c2769de5e5572d2fe668de6d9",
            //         "gasUsed": 214502,
            //         "logsBloom": "...",
            //         "root": null,
            //         "status": true,
            //         "to": "0x894a2a04f5dab4322ab74c21116da238f3a9b0fc",
            //         "transactionHash": "0x17668bb3d05c1caf5e7624014582d420dd276d02c463aa8d22747b98ecfe7331",
            //         "transactionIndex": 0,
            //         "events": {
            //             "TransferSingle": {
            //                 "address": "0x894a2A04f5DAb4322AB74c21116Da238F3A9b0Fc",
            //                 "blockHash": "0x4803d2fac723d06a26de69bbb3469b7e0313a80a0fef7c178766b912df9a0804",
            //                 "blockNumber": 16713927,
            //                 "logIndex": 0,
            //                 "removed": false,
            //                 "transactionHash": "0x17668bb3d05c1caf5e7624014582d420dd276d02c463aa8d22747b98ecfe7331",
            //                 "transactionIndex": 0,
            //                 "transactionLogIndex": "0x0",
            //                 "type": "mined",
            //                 "id": "log_93de07cd",
            //                 "returnValues": {
            //                     "0": "0xBD04A07082fD5F2C2769dE5e5572d2fe668dE6D9",
            //                     "1": "0x0000000000000000000000000000000000000000",
            //                     "2": "0x0000000000000000000000000000000000000000",
            //                     "3": "57896044618658097711785492504343953927655839433583097410118915826251869454336",
            //                     "4": "0",
            //                     "_operator": "0xBD04A07082fD5F2C2769dE5e5572d2fe668dE6D9",
            //                     "_from": "0x0000000000000000000000000000000000000000",
            //                     "_to": "0x0000000000000000000000000000000000000000",
            //                     "_id": "57896044618658097711785492504343953927655839433583097410118915826251869454336",
            //                     "_amount": "0"
            //                 },
            //                 "event": "TransferSingle",
            //                 "signature": "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
            //                 "raw": {...}
            //             },
            //             "URI": {
            //                 "address": "0x894a2A04f5DAb4322AB74c21116Da238F3A9b0Fc",
            //                 "blockHash": "0x4803d2fac723d06a26de69bbb3469b7e0313a80a0fef7c178766b912df9a0804",
            //                 "blockNumber": 16713927,
            //                 "logIndex": 1,
            //                 "removed": false,
            //                 "transactionHash": "0x17668bb3d05c1caf5e7624014582d420dd276d02c463aa8d22747b98ecfe7331",
            //                 "transactionIndex": 0,
            //                 "transactionLogIndex": "0x1",
            //                 "type": "mined",
            //                 "id": "log_00e806da",
            //                 "returnValues": {
            //                     "0": "https://ipfs.io/ipfs/QmR95kwsEcG7ty3roRFDEPt7rmPv4AjizCMt3RYukaGMgD",
            //                     "1": "57896044618658097711785492504343953927655839433583097410118915826251869454336",
            //                     "_uri": "https://ipfs.io/ipfs/QmR95kwsEcG7ty3roRFDEPt7rmPv4AjizCMt3RYukaGMgD",
            //                     "_type": "57896044618658097711785492504343953927655839433583097410118915826251869454336"
            //                 },
            //                 "event": "URI",
            //                 "signature": "0x6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b",
            //                 "raw": {...}
            //             },
            //             "ParticleTypeCreated": {
            //                 "address": "0x894a2A04f5DAb4322AB74c21116Da238F3A9b0Fc",
            //                 "blockHash": "0x4803d2fac723d06a26de69bbb3469b7e0313a80a0fef7c178766b912df9a0804",
            //                 "blockNumber": 16713927,
            //                 "logIndex": 2,
            //                 "removed": false,
            //                 "transactionHash": "0x17668bb3d05c1caf5e7624014582d420dd276d02c463aa8d22747b98ecfe7331",
            //                 "transactionIndex": 0,
            //                 "transactionLogIndex": "0x2",
            //                 "type": "mined",
            //                 "id": "log_9fd91619",
            //                 "returnValues": {
            //                     "0": "57896044618658097711785492504343953927655839433583097410118915826251869454336",
            //                     "1": "https://ipfs.io/ipfs/QmR95kwsEcG7ty3roRFDEPt7rmPv4AjizCMt3RYukaGMgD",
            //                     "2": true,
            //                     "3": true,
            //                     "4": "chai",
            //                     "5": "0",
            //                     "_particleTypeId": "57896044618658097711785492504343953927655839433583097410118915826251869454336",
            //                     "_uri": "https://ipfs.io/ipfs/QmR95kwsEcG7ty3roRFDEPt7rmPv4AjizCMt3RYukaGMgD",
            //                     "_isNF": true,
            //                     "_isPrivate": true,
            //                     "_assetPairId": "chai",
            //                     "_maxSupply": "0"
            //                 },
            //                 "event": "ParticleTypeCreated",
            //                 "signature": "0xc201e7d2252eddeae969c897081b09a2442f097cb2b71d5257d1b22b26f265da",
            //                 "raw": {...}
            //             }
            //         }
            //     },
            //     "params": {
            //         "tx": {
            //             "from": "0xbd04a07082fd5f2c2769de5e5572d2fe668de6d9",
            //             "value": "0x3faa25226000",
            //             "data": "...",
            //             "gasPrice": "0x218711a00",
            //             "to": "0x894a2a04f5dab4322ab74c21116da238f3a9b0fc"
            //         },
            //         "args": [
            //             "https://ipfs.io/ipfs/QmR95kwsEcG7ty3roRFDEPt7rmPv4AjizCMt3RYukaGMgD",
            //             true,
            //             true,
            //             "chai",
            //             "0",
            //             "25"
            //         ]
            //     },
            //     "type": "CreateParticle"
            // }

            // dFuse - watch transaction
            (async () => {
                const transactions = Transactions.instance();
                await transactions.streamTransaction({transactionHash});
            })();

            setLoadingProgress('Transaction created, monitoring has begun in background');
            setTimeout(() => {
                // All Done, clean up
                setSubmitting(false);
                setTxData({});
            }, 3000);

            // Redirect to Manage Screen
            // ...
        }
    }, [isSubmitting, txData, setSubmitting, setTxData]);

    const handleSubmit = async ({formData}) => {
        let txReceipt;
        try {
            setSubmitting(true);

            const {tx, args, transactionHash} = await ContractHelpers.createParticleWithEth({
                from: connectedAddress,
                particleData: formData,
                onProgress: setLoadingProgress
            });
            txReceipt = transactionHash;
            setTxData({transactionHash, params: {tx, args}, type: 'CreateParticle'});
        }
        catch (err) {
            if (_.isUndefined(txReceipt)) {
                setLoadingProgress('Transaction cancelled by user..');
                setTimeout(() => {
                    setSubmitting(false);
                }, 3000);
            } else {
                console.error(err);
            }
        }
    };

    return (
        <>
            <FormCreateParticle
                onSubmitForm={handleSubmit}
            />

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={isSubmitting}
            >
                <div className={classes.simpleModal}>
                    <Flex flexWrap={"wrap"}>
                        <Box width={1/4}>
                            <Loader size="80px" />
                        </Box>
                        <Box width={3/4} pl={10}>
                            <Typography variant="h6" id="modal-title">
                                Creating Particle!
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                {loadingProgress}
                            </Typography>
                        </Box>
                    </Flex>
                </div>
            </Modal>
        </>
    )
};

export default Create;
