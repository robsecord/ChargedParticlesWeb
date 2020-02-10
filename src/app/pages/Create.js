// Frameworks
import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import * as _ from 'lodash';

// Data Context for State
import { WalletContext } from '../stores/wallet.store';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// Rimble UI
import {
    Box,
    Button,
    Field,
    Flex,
    Form,
    Heading,
    Input,
    Textarea,
    Slider,
} from "rimble-ui";

const ShadowCheckbox = styled(Form.Check)`
  pointer-events: none;
`;

const FileInput = styled(Input)`
  & + button {
    .button-text {
      display: inline-block;
      max-width: 300px;
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


// Create Route
const Create = () => {
    const classes = useCustomStyles();
    const [walletState] = useContext(WalletContext);
    const { allReady, connectedAddress } = walletState;

    const [formValidated, setFormValidated] = useState(false);

    const [particleName, setParticleName] = useState('');
    const [particleIcon, setParticleIcon] = useState('');
    const [particleCreator, setParticleCreator] = useState('');
    const [particleDesc, setParticleDesc] = useState('');
    const [particleSupply, setParticleSupply] = useState(0);
    const [particleAssetPair, setParticleAssetPair] = useState('chai');
    const [particleCreatorFee, setParticleCreatorFee] = useState(0);
    const [isNonFungible, setNonFungible] = useState(true);

    const refAssetPairSelect = useRef();
    const [selectLabelWidth, setSelectLabelWidth] = useState(0);

    useEffect(() => {
        const { current } = refAssetPairSelect;
        const offsetWidth = ReactDOM.findDOMNode(current).offsetWidth;
        setSelectLabelWidth(offsetWidth);
    }, []);

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

    const updateParticleCreator = evt => {
        setParticleCreator(evt.target.value);
        validateInput(evt);
    };

    const updateParticleIcon = evt => {
        setParticleIcon(evt.target.value);
        validateInput(evt);
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

    const handleSubmit = e => {
        e.preventDefault();
        console.log('Submitted valid form');
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
                            <Field label="Creator" width={1}>
                                <Input
                                    id="particleTypeCreator"
                                    type="text"
                                    required
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
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel
                                                ref={refAssetPairSelect}
                                                htmlFor="particleTypeAssetPairId"
                                            >
                                                Asset-Interest Pair
                                            </InputLabel>
                                            <Select
                                                value={particleAssetPair}
                                                onChange={updateParticleAssetPair}
                                                input={
                                                    <OutlinedInput
                                                        labelWidth={selectLabelWidth}
                                                        name="particleTypeAssetPair"
                                                        id="particleTypeAssetPairId"
                                                    />
                                                }
                                            >
                                                <MenuItem value={'chai'}>DAI - CHAI</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box width={[1, 1, 1/2]} pl={3}>
                                        <Field label="Deposit Fee" width={1}>
                                            <>
                                                <Slider
                                                    min={"0"}
                                                    max={"1"}
                                                    step={"0.01"}
                                                    required
                                                    width={2/4}
                                                    value={particleCreatorFee}
                                                    onChange={updateParticleCreatorFee}
                                                />
                                                <Input
                                                    id="particleTypeCreatorFee"
                                                    type="number"
                                                    required
                                                    min={0}
                                                    max={20}
                                                    step={0.01}
                                                    value={particleCreatorFee}
                                                    onChange={updateParticleCreatorFee}
                                                    width={1/4}
                                                />
                                            </>
                                        </Field>
                                    </Box>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Box>
                    </Flex>

                    <Box width={1}>
                        <Button type="submit" disabled={!formValidated}>
                            Create Particle
                        </Button>
                    </Box>
                </Form>
            </Box>

        </>
    )
};

export default Create;
