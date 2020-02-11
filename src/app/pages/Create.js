// Frameworks
import React, { useState, useEffect, useContext } from 'react';
import { Buffer } from 'buffer';
import styled from 'styled-components'
import * as _ from 'lodash';

// App Components
import ChargedParticlesLogo from '../../images/logo/cp-logo.128x128.png';
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';
import IPFS from '../../utils/ipfs';

// Contract Data
import { ChargedParticles } from '../blockchain/contracts';

// Data Context for State
import { RootContext } from '../stores/root.store';
import { WalletContext } from '../stores/wallet.store';

// Rimble UI
import NetworkIndicator from '@rimble/network-indicator';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// Rimble UI
import {
    Avatar,
    Box,
    Button,
    Field,
    Flex,
    Form,
    Heading,
    Input,
    Textarea,
    Slider,
} from 'rimble-ui';

const ShadowCheckbox = styled(Form.Check)`
  pointer-events: none;
`;

const FileInput = styled(Input)`
  & + button {
    .button-text {
      display: inline-block;
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const useCustomStyles = makeStyles(theme => ({
    formControl: {
        width: '100%'
    },
}));

const customFeeSettings = {
    'higher': {min: 1, max: 20, step: 0.1},
    'lower': {min: 0, max: 1, step: 0.01},
};

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema
// https://docs.opensea.io/docs/metadata-standards
const tokenMetadata = {
    'description'       : '',
    'external_url'      : '',
    'animation_url'     : '',
    'youtube_url'       : '',
    'image'             : '',
    'name'              : '',
    'decimals'          : 18,
    'background_color'  : 'FFF',
    'properties'        : {},
    'attributes'        : [],   // OpenSea
};

// Create Route
const Create = () => {
    const classes = useCustomStyles();
    const [ rootState ] = useContext(RootContext);
    const { connectionWarning } = rootState;
    const [ walletState ] = useContext(WalletContext);
    const { allReady, networkId, connectedAddress } = walletState;

    const [formValidated, setFormValidated] = useState(false);

    const [particleName,        setParticleName]        = useState('');
    const [particleSymbol,      setParticleSymbol]      = useState('');
    const [particleIcon,        setParticleIcon]        = useState('');
    const [particleIconBuffer,  setParticleIconBuffer]  = useState('');
    const [particleIconUrl,     setParticleIconUrl]     = useState(ChargedParticlesLogo);
    const [particleCreator,     setParticleCreator]     = useState('');
    const [particleDesc,        setParticleDesc]        = useState('');
    const [particleSupply,      setParticleSupply]      = useState(0);
    const [particleAssetPair,   setParticleAssetPair]   = useState('chai');
    const [particleCreatorFee,  setParticleCreatorFee]  = useState(0.25);
    const [creatorFeeMode,      setCreatorFeeMode]      = useState('lower');
    const [isNonFungible,       setNonFungible]         = useState(true);

    useEffect(() => {
        if (allReady && _.isEmpty(particleCreator)) {
            setParticleCreator(connectedAddress);
        }
    }, [allReady]);

    useEffect(() => {
        validateForm();
    }, [
        setFormValidated,
        particleName,
        particleIcon,
        particleCreator,
        particleDesc,
    ]);

    const validateForm = () => {
        const conditions = [
            _.isEmpty(connectionWarning),
            !_.isEmpty(particleName),
            !_.isEmpty(particleIcon),
            !_.isEmpty(particleCreator),
            !_.isEmpty(particleDesc),
        ];
        setFormValidated(_.every(conditions, Boolean));
    };

    const validateInput = evt => {
        evt.target.parentNode.classList.add('was-validated');
    };

    const updateParticleName = evt => {
        setParticleName(evt.target.value);
        validateInput(evt);
    };

    const updateParticleSymbol = evt => {
        setParticleSymbol(_.toUpper(evt.target.value));
        validateInput(evt);
    };

    const updateParticleCreator = evt => {
        setParticleCreator(evt.target.value);
        validateInput(evt);
    };

    const updateParticleIcon = evt => {
        setParticleIcon(evt.target.value);
        validateInput(evt);

        const file = evt.target.files[0];
        if (_.isUndefined(file)) { return; }

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setParticleIconBuffer(Buffer(reader.result));
        };
    };

    const updateParticleDesc = evt => {
        setParticleDesc(evt.target.value);
        validateInput(evt);
    };

    const updateParticleSupply = evt => {
        setParticleSupply(evt.target.value);
        validateInput(evt);
    };

    const updateParticleAssetPair = evt => {
        setParticleAssetPair(evt.target.value);
    };

    const updateParticleCreatorFee = evt => {
        setParticleCreatorFee(evt.target.value);
        validateInput(evt);
    };

    const toggleNonFungible = (evt, expanded) => {
        setNonFungible(expanded);
    };

    const toggleHigherFees = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        setParticleCreatorFee(customFeeSettings.lower.max);
        setCreatorFeeMode(creatorFeeMode === 'lower' ? 'higher' : 'lower');
    };

    const handleSubmit = async evt => {
        evt.preventDefault();
        try {
            const imageFileUrl = await IPFS.saveImageFile({fileBuffer: particleIconBuffer});
            setParticleIconUrl(imageFileUrl);

            tokenMetadata.name = particleName;
            tokenMetadata.description = particleDesc;
            tokenMetadata.external_url = `${GLOBALS.ACCELERATOR_URL}${GLOBALS.ACCELERATOR_ROOT}/type/{id}`;
            tokenMetadata.image = imageFileUrl;
            // tokenMetadata.properties = {};
            // tokenMetadata.attributes = [];

            console.log('Token Metadata:', tokenMetadata);

            const jsonFileUrl = await IPFS.saveJsonFile({jsonObj: tokenMetadata});
            console.log('Token Metadata URI:', jsonFileUrl);

            const assetPair = Helpers.toBytes16(particleAssetPair);
            const maxSupply = particleSupply * GLOBALS.ETH_UNIT;
            const creatorFee = particleCreatorFee * GLOBALS.DEPOSIT_FEE_MODIFIER / 100;

            const chargedParticles = ChargedParticles.instance();
            const tx = {from: connectedAddress};
            const args = [
                jsonFileUrl,        // string memory _uri,
                isNonFungible,      // bool _isNF,
                true,               // bool _isPrivate, // TODO
                assetPair,          // bytes16 _assetPairId,
                `${maxSupply}`,     // uint256 _maxSupply,
                `${creatorFee}`,    // uint16 _creatorFee
            ];
            const txReceipt = await chargedParticles.tryContractTx('createParticleWithEther', tx, ...args);

            console.log('openPack - transaction sent;');
            console.log('  txReceipt', txReceipt);
            console.log('  tx', tx);
            console.log('  args', args);


            // return {txReceipt, params: {tx, args}, type: 'CreateParticle'};
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Heading as={"h2"} mt={30}>Create a new Particle Type</Heading>

            <Box p={4}>
                <Form onSubmit={handleSubmit} validated={formValidated}>
                    <Flex mx={-3} flexWrap={"wrap"}>
                        <Box width={[1, 1, 1/2]} pr={3}>
                            <Field label="Name" width={1}>
                                <Input
                                    id="particleTypeName"
                                    type="text"
                                    required
                                    onChange={updateParticleName}
                                    value={particleName}
                                    width={1}
                                />
                            </Field>
                        </Box>

                        <Box width={[1, 1, 1/2]} pl={3}>
                            <Field label="Symbol" width={1}>
                                <Input
                                    id="particleTypeSymbol"
                                    type="text"
                                    maxLength={16}
                                    required
                                    onChange={updateParticleSymbol}
                                    value={particleSymbol}
                                    width={1}
                                />
                            </Field>
                        </Box>
                    </Flex>

                    <Flex mx={-3} flexWrap={"wrap"}>
                        <Box width={1}>
                            <Field label="Creator" width={1}>
                                <Input
                                    id="particleTypeCreator"
                                    type="text"
                                    required
                                    placeholder="connect your wallet"
                                    onChange={updateParticleCreator}
                                    value={particleCreator}
                                    width={1}
                                />
                            </Field>
                        </Box>
                    </Flex>

                    <Flex mx={-3} flexWrap={"wrap"}>
                        <Box width={1}>
                            <Field label="Description" width={1}>
                                <Textarea
                                    id="particleTypeDesc"
                                    rows={4}
                                    width={1}
                                    required
                                    onChange={updateParticleDesc}
                                />
                            </Field>
                        </Box>
                    </Flex>

                    <Flex mx={-3} flexWrap={"wrap"}>
                        <Box width={[1, 1, 1/2]} pr={3}>
                            <Flex mx={-3} flexWrap={"wrap"}>
                                <Box width={[1/5]} pr={3}>
                                    <Field label="&nbsp;">
                                        <Avatar
                                            required
                                            mt={1} ml={3}
                                            size="medium"
                                            bg="#eee"
                                            src={particleIconUrl}
                                        />
                                    </Field>
                                </Box>

                                <Box width={[4/5]} pr={3}>
                                    <Field label="Icon">
                                        <FileInput
                                            id="particleTypeIcon"
                                            type="file"
                                            required
                                            onChange={updateParticleIcon}
                                            value={particleIcon}
                                            accept="image/png, image/jpeg, image/jpg, image/gif"
                                        />
                                    </Field>
                                </Box>
                            </Flex>
                        </Box>

                        <Box width={[1, 1, 1/2]} pl={3}>
                            <Field label="Max-Supply" width={1}>
                                <Input
                                    id="particleTypeSupply"
                                    type="number"
                                    min={0}
                                    max={1e27}
                                    onChange={updateParticleSupply}
                                    value={particleSupply}
                                    width={1}
                                />
                            </Field>
                        </Box>
                    </Flex>

                    <Flex mx={-3} mb={30} flexWrap={"wrap"}>
                        <Box width={1}>
                            <ExpansionPanel defaultExpanded onChange={toggleNonFungible} mx={-5}>
                                <ExpansionPanelSummary>
                                    <Heading as={"h4"}>
                                        <ShadowCheckbox
                                            checked={isNonFungible}
                                            readOnly
                                            required
                                            label="Non-Fungible"
                                        />
                                    </Heading>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Box width={[1, 1, 1/2]} pr={3}>
                                        <Field label="Asset-Interest Pair" width={1}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <Select
                                                    width={1}
                                                    value={particleAssetPair}
                                                    onChange={updateParticleAssetPair}
                                                >
                                                    <MenuItem value={'chai'}>DAI - CHAI</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Field>
                                    </Box>

                                    <Box width={[1, 1, 1/2]} pl={3}>
                                        <Flex flexWrap={"wrap"}>
                                            <Field label="Deposit Fee (as %)" width={1/2} pr={3}>
                                                <Input
                                                    id="particleTypeCreatorFee"
                                                    type="number"
                                                    required
                                                    min={customFeeSettings[creatorFeeMode].min}
                                                    max={customFeeSettings[creatorFeeMode].max}
                                                    step={customFeeSettings[creatorFeeMode].step}
                                                    value={particleCreatorFee}
                                                    onChange={updateParticleCreatorFee}
                                                    width={1}
                                                />
                                            </Field>
                                            <Field label="&nbsp;" width={1/2} pl={3}>
                                                <Button.Text
                                                    required
                                                    onClick={toggleHigherFees}
                                                >
                                                    {creatorFeeMode === 'higher' ? 'lower' : 'higher'}
                                                </Button.Text>
                                            </Field>
                                        </Flex>

                                        <Slider
                                            min={customFeeSettings[creatorFeeMode].min}
                                            max={customFeeSettings[creatorFeeMode].max}
                                            step={customFeeSettings[creatorFeeMode].step}
                                            required
                                            width={1}
                                            value={particleCreatorFee}
                                            onChange={updateParticleCreatorFee}
                                        />
                                    </Box>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Box>
                    </Flex>

                    <Box width={1}>
                        <Flex mx={-3} mb={30} flexWrap={"wrap"}>
                            <Button type="submit" disabled={!formValidated} mr={3}>
                                Create Particle
                            </Button>
                            <NetworkIndicator
                                currentNetwork={networkId}
                                requiredNetwork={_.parseInt(GLOBALS.CHAIN_ID, 10)}
                            />
                        </Flex>
                    </Box>
                </Form>
            </Box>

        </>
    )
};

export default Create;
