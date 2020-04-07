// Frameworks
import React from 'react';
import { navigate } from 'gatsby';
import classNames from 'classnames';
import styled from 'styled-components';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';

// Rimble UI
import {
    Heading,
    Icon
} from 'rimble-ui';

// Layout Components
import Layout from '../layout/layout';
import SEO from '../components/seo';
import { ParticleText } from '../components/ParticleText';
import { GLOBALS } from '../utils/globals';

// Custom Theme
import useLandingStyles from '../layout/styles/landing.styles';


const DarkPaper = withStyles(theme => ({
    root: {
        width: '100%',
        color: '#eee',
        backgroundColor: '#191919',
    }
}))(Paper);


const StyledButton = withStyles(theme => ({
    root: {
        height: 60,
        padding: '0 30px',
        background: 'linear-gradient(45deg, #ff006c 30%, #ff417d 90%)',
        borderRadius: 7,
        border: 0,
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: '100',

        [theme.breakpoints.down('sm')]: {
            fontSize: '1.15rem',
            padding: '0 20px',
        },
    },
    label: {
        textTransform: 'capitalize',
    },
}))(Button);


const LrgScreen = styled(Hidden).attrs(props => ({
    xsDown: true,
    implementation: 'css',
}))`
  display: inline;
`;


const StyledPre = styled.pre`
  width: 100%;
  padding: 10px 0;
  overflow: scroll;
`;


// Static Route
const IndexPage = () => {
    const classes = useLandingStyles();

    const _gotoGithub = (ercType) => () => {
        let url = '';
        if (ercType === 'erc721') {
            url = 'https://github.com/robsecord/ChargedParticlesEth/blob/master/variations/erc721/ChargedParticlesCHAI.sol';
        } else {
            url = 'https://github.com/robsecord/ChargedParticlesEth/blob/master/variations/erc1155/ChargedParticlesCHAI.sol';
        }
        window.open(url);
    };

    const _gotoDiscord = () => {
        window.open('https://discord.gg/Syh3gjz');
    };

    const _gotoApp = (evt) => {
        evt.preventDefault();
        navigate(`${GLOBALS.ACCELERATOR_ROOT}`);
    };

    return (
        <Layout noHeader={true}>
            <SEO />

            <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                className={classes.heroContainer}
            >
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.heroHeader}
                >
                    <ParticleText
                        width={600}
                        height={220}
                        fontSize={100}
                        lineHeight={110}
                        text="CHARGED\nPARTICLES"
                    />

                    <Heading as={"h3"} className={classNames(classes.glowTitle, classes.centerAlign)}>
                        DeFi NFTs that earn you Interest!
                    </Heading>

                    <p className={classes.glowTitle}>
                        &#709;
                    </p>
                </Grid>
            </Grid>

            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.heroMargin}
            >
                <StyledButton
                    size="large"
                    as="a"
                    href="#"
                    onClick={_gotoApp}
                >Enter Particle Accelerator</StyledButton>
            </Grid>

            <hr/>

            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
            >
                <DarkPaper className={classNames(classes.heroPadding, classes.heroMargin)} elevation={2}>
                    <Heading as={"h4"} className={classes.glowHeader}>
                        What are Charged Particles?
                    </Heading>
                    <p>
                        <strong>Charged Particles</strong> are Interest-bearing Non-Fungible Tokens (DeFi NFTs) that are minted with an underlying asset and accrue interest over time, giving the Token a "Charge".
                    </p>
                    <p>
                        The amount of interest earned from the token represents the "Charge" that the Particle has amassed.
                    </p>
                    <StyledPre>
                        <u><strong>Particle Value = </strong></u><br/>
                        <strong>Intrinsic Value</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<LrgScreen>underlying asset, </LrgScreen>ie. Dai)<br/>
                        <strong>+ Speculative Value</strong>&nbsp;(<LrgScreen>non-fungible </LrgScreen>rarity)<br/>
                        <strong>+ Interest Value</strong>&nbsp;&nbsp;&nbsp;&nbsp;(ie. Chai<LrgScreen>, rDai, cDai, aToken, yToken, and more!</LrgScreen>)<br/>
                    </StyledPre>

                    <Heading as={"h4"} className={classes.glowHeader}>
                        NFT Value Appreciation
                    </Heading>
                    <p>
                        Imagine a Babe Ruth rookie card stuffed with $1 and earning interest since 1916!<br/>
                        Or a piece of digital-art holding $10 and constantly appreciating in value!
                    </p>

                    <Heading as={"h4"} className={classes.glowHeader}>
                        Ownership
                    </Heading>
                    <p>
                        Charged Particles are Yours! They are standard, non-custodial NFTs, held in your wallet, and can be "discharged" at any time, collecting any accrued interest from the token.
                    </p>
                    <p>
                        They can also be burned to reclaim the underlying asset + interest in full, destroying the token.
                    </p>
                    <p>
                        And just like any other NFT, you may trade, transfer or sell your Charged Particles!  You can even discharge the interest to a different address - a friend? a donation? You're in Charge!
                    </p>

                    <Heading as={"h4"} className={classes.glowHeader}>
                        Custom Token Mechanics
                    </Heading>
                    <p>
                        Charged Particles introduce unique token mechanics allowing Smart Contracts and/or Dapps to decide how to handle a specific token based on the level of "Charge" that token has.
                    </p>
                    <p>
                        Imagine an NFT that represents a Sword - the power of that sword could be dependant on the amount of "Charge" the token has. Or perhaps certain items can only be used once they reach a certain level of charge. Discharging the particle resets the in-game token mechanics.
                    </p>
                    <p>
                        Other possibilities include battling over the "charge" of a particle - the winner earns the interest from their competitor's particles.
                    </p>

                    <Heading as={"h4"} className={classes.glowHeader}>
                        Particle Accelerator
                    </Heading>
                    <p>
                        Our Particle Accelerator is a Public Particle Creation &amp; Minting Station!<br/>
                        You may Create your own Type of NFT and then allow anyone to Mint your Type of NFT, or keep them private so only you can mint them.
                    </p>
                    <p>
                        You may also browse Public Particles created by others and Mint the ones you like!
                    </p>
                    <p>
                        Minting Particles requires funding them with the underlying asset token (ie. DAI) to give the Particle its "Initial Mass".<br/>
                        Minted Particles will accrue interest over time giving the Particle its "Charge".
                    </p>

                    <Heading as={"h4"} className={classes.glowHeader}>
                        Decentralized
                    </Heading>
                    <p>Hosted on <strong>IPFS</strong>, with an <strong>ENS</strong> domain, using <strong>dFuse.io</strong> for transaction streaming.</p>
                    <p>Fully open-source on <strong>Github</strong>.</p>
                    <p>Aragon Agent <strong>DAO</strong>.</p>
                    <p>Completely <strong>Client-Side</strong> app that you can run locally. Provide your own API keys for increased speed &amp; custom query caching.</p>
                    <ul>
                        <li><strong>No KYC</strong>.</li>
                        <li><strong>No sign-up</strong>.</li>
                        <li><strong>No tracking</strong>.</li>
                    </ul>
                    <p>Connect your wallet &amp; go!</p>

                    <Heading as={"h4"} className={classes.glowHeader}>
                        Open-Source Flavors
                    </Heading>
                    <p>
                        Charged Particles currently come in 2 flavors:
                    </p>
                    <ul>
                        <li>
                            <Button
                                size="small"
                                onClick={_gotoGithub('erc721')}
                                color="primary"
                            >
                                ERC-721&nbsp;
                                <Icon name="Launch" size="12" />
                            </Button>
                        </li>
                        <li>
                            <Button
                                size="small"
                                onClick={_gotoGithub('erc1155')}
                                color="primary"
                            >
                                ERC-1155&nbsp;
                                <Icon name="Launch" size="12" />
                            </Button>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <a href="https://github.com/robsecord/ChargedParticlesEth" target="_new">https://github.com/robsecord/ChargedParticlesEth</a>
                        </li>
                        <li>
                            <a href="https://github.com/robsecord/ChargedParticlesWeb" target="_new">https://github.com/robsecord/ChargedParticlesWeb</a>
                        </li>
                    </ul>

                    <Heading as={"h4"} className={classes.glowHeader}>
                        Research &amp; Development
                    </Heading>
                    <p>
                        We are currently researching other token flavors (ie. ERC-998) as well as a plethora of different funding mechanisms using various interest-bearing tokens, such as; cDai, rDai, pDai, xDai, aTokens, yTokens, DeFiZaps, TokenSets and Real-Estate Rental Income from RealT.
                    </p>

                    <Heading as={"h4"} className={classes.glowHeader}>
                        Community
                    </Heading>
                    <p>
                        Did we miss anything?  Shoot us a message, share your ideas or just join in on the fun at our Discord Community!
                        <Button
                            size="small"
                            onClick={_gotoDiscord}
                            color="primary"
                        >
                            Charged Particles Discord&nbsp;
                            <Icon name="Launch" size="12" />
                        </Button>
                    </p>
                </DarkPaper>
            </Grid>
        </Layout>
    );
};

export default IndexPage;
