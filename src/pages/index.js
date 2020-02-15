// Frameworks
import React from 'react';
import classNames from 'classnames';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Rimble UI
import {
    Heading,
    Text,
    Icon
} from 'rimble-ui';

// Layout Components
import Layout from '../layout/layout';
import SEO from '../components/seo';
import { ParticleText } from '../components/ParticleText';

// Custom Theme
import useRootStyles from '../layout/styles/root.styles';


const DarkPaper = withStyles({
    root: {
        color: '#eee',
        backgroundColor: '#191919',
    }
})(Paper);


const StyledButton = withStyles({
    root: {
        background: 'linear-gradient(45deg, #ff006c 30%, #ff417d 90%)',
        borderRadius: 7,
        border: 0,
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: '100',
        height: 60,
        padding: '0 30px',
    },
    label: {
        textTransform: 'capitalize',
    },
})(Button);


// Static Route
const IndexPage = () => {
    const rootClasses = useRootStyles();

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

    return (
        <Layout noHeader={true}>
            <SEO title="Welcome" keywords={[`ethereum`, `defi`, `nft`, `charged particles`]}/>

            <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                className={rootClasses.heroContainer}
            >
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={rootClasses.heroHeader}
                >
                    <ParticleText
                        width={600}
                        height={220}
                        fontSize={100}
                        lineHeight={110}
                        text="CHARGED\nPARTICLES"
                    />

                    <Heading as={"h3"} className={rootClasses.glowTitle}>
                        DeFi NFTs that earn you Interest!
                    </Heading>

                    <Text.p className={rootClasses.glowTitle}>
                        &#709;
                    </Text.p>
                </Grid>
            </Grid>

            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                className={rootClasses.heroMargin}
            >
                <StyledButton size="large" as="a" href="/app/">Enter Particle Accelerator</StyledButton>
            </Grid>

            <hr/>

            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
            >
                <DarkPaper className={classNames(rootClasses.heroPadding, rootClasses.heroMargin)} elevation={2}>
                    <Heading as={"h4"} className={rootClasses.glowHeader}>
                        What are Charged Particles?
                    </Heading>
                    <Text.p>
                        <strong>Charged Particles</strong> are Interest-bearing Non-Fungible Tokens (DeFi NFTs) that are minted with an underlying asset and accrue interest over time, giving the Token a "Charge".
                    </Text.p>
                    <Text.p>
                        The amount of interest earned from the token represents the "Charge" that the Particle has amassed.
                    </Text.p>
                    <pre>
                        <u><strong>Particle Value = </strong></u><br/>
                        <strong>Intrinsic Value</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(underlying asset, ie. Dai)<br/>
                        <strong>+ Speculative Value</strong>&nbsp;(non-fungible rarity)<br/>
                        <strong>+ Interest Value</strong>&nbsp;&nbsp;&nbsp;&nbsp;(ie. Chai, rDai, cDai, aToken, yToken, and more!)<br/>
                    </pre>

                    <Heading as={"h4"} className={rootClasses.glowHeader}>
                        Value Appreciation
                    </Heading>
                    <Text.p>
                        Imagine a Babe Ruth rookie card stuffed with $1 and earning interest since 1916!<br/>
                        Or a piece of digital-art holding $10 and constantly appreciating in value!
                    </Text.p>

                    <Heading as={"h4"} className={rootClasses.glowHeader}>
                        Ownership
                    </Heading>
                    <Text.p>
                        Charged Particles are Yours! They are standard, non-custodial NFTs, held in your wallet, and can be "discharged" at any time, collecting any accrued interest from the token.
                    </Text.p>
                    <Text.p>
                        They can also be burned to reclaim the underlying asset + interest in full, destroying the token.
                    </Text.p>
                    <Text.p>
                        And just like any other NFT, you may trade, transfer or sell your Charged Particles!  You can even discharge the interest to a different address - a friend? a donation? You're in Charge!
                    </Text.p>

                    <Heading as={"h4"} className={rootClasses.glowHeader}>
                        Custom Token Mechanics
                    </Heading>
                    <Text.p>
                        Charged Particles introduce unique token mechanics allowing Smart Contracts and/or Dapps to decide how to handle a specific token based on the level of "Charge" that token has.
                    </Text.p>
                    <Text.p>
                        Imagine an NFT that represents a Sword - the power of that sword could be dependant on the amount of "Charge" the token has. Or perhaps certain items can only be used once they reach a certain level of charge. Discharging the particle resets the in-game token mechanics.
                    </Text.p>
                    <Text.p>
                        Other possibilities include battling over the "charge" of a particle - the winner earns the interest from their competitor's particles.
                    </Text.p>

                    <Heading as={"h4"} className={rootClasses.glowHeader}>
                        Particle Accelerator
                    </Heading>
                    <Text.p>
                        Our Particle Accelerator is a Public Particle Creation &amp; Minting Station!<br/>
                        You may Create your own Type of NFT and then allow anyone to Mint your Type of NFT, or keep them private so only you can mint them.
                    </Text.p>
                    <Text.p>
                        You may also browse Public Particles created by others and Mint the ones you like!
                    </Text.p>
                    <Text.p>
                        Minting Particles requires funding them with the underlying asset token (ie. DAI) to give the Particle its "Initial Mass".<br/>
                        Minted Particles will accrue interest over time giving the Particle its "Charge".
                    </Text.p>

                    <Heading as={"h4"} className={rootClasses.glowHeader}>
                        Open-Source Flavors
                    </Heading>
                    <Text.p>
                        Charged Particles currently come in 2 flavors:
                    </Text.p>
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

                    <Heading as={"h4"} className={rootClasses.glowHeader}>
                        Research &amp; Development
                    </Heading>
                    <Text.p>
                        We are currently researching other token flavors (ie. ERC-998) as well as a plethora of different funding mechanisms using various interest-bearing tokens, such as; cDai, rDai, pDai, xDai, aTokens, yTokens, DeFiZaps, TokenSets and Real-Estate Rental Income from RealT.
                    </Text.p>

                    <Heading as={"h4"} className={rootClasses.glowHeader}>
                        Community
                    </Heading>
                    <Text.p>
                        Did we miss anything?  Shoot us a message, share your ideas or just join in on the fun at our Discord Community!
                        <Button
                            size="small"
                            onClick={_gotoDiscord}
                            color="primary"
                        >
                            Charged Particles Discord&nbsp;
                            <Icon name="Launch" size="12" />
                        </Button>
                    </Text.p>
                </DarkPaper>
            </Grid>
        </Layout>
    );
};

export default IndexPage;
