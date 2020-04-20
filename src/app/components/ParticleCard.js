// Frameworks
import React from 'react';
import { navigate } from 'gatsby';
import window from 'global';
import * as _ from 'lodash';

// App Components
import DisplayContractValue from './DisplayContractValue';
import ContentSplitter from './ContentSplitter';
import TokenTypeBadge from './TokenTypeBadge';
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';
import { VerifiedParticleTypes } from '../../utils/verified';

// Data Context for State
import { useWalletContext } from '../contexts/wallet';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImageIcon from '@material-ui/icons/Image';
import YouTubeIcon from '@material-ui/icons/YouTube';
import LaunchIcon from '@material-ui/icons/Launch';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import InfoIcon from '@material-ui/icons/Info';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';
const useCustomStyles = makeStyles(theme => ({
    flatPanel: {
        position: 'relative',
        padding: '10px 10px 0',
    },
    flatPanelHeader: {
        padding: 8,
    },
    flatPanelDetails: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px 18px 10px',
    },
    flatPanelFooter: {
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        justifyContent: 'flex-end'
    },
    columnThirds: {
        flexBasis: '33.33%',
    },
    columnTwoThirds: {
        flexBasis: '66.66%',
    },
    columnQuarters: {
        flexBasis: '25%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    titleHeading: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
    },
    content: {
        fontSize: theme.typography.pxToRem(15),
        marginBottom: '1rem',
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    particleIcon: {
        marginRight: 20,
    },
    summary: {
        position: 'relative',
    },
    details: {
        alignItems: 'center',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    externalLinkIcon: {
        fontSize: 12,
        margin: '-5px 0 0 2px',
    },
    verifiedIcon: {
        color: theme.palette.success.main,
        marginLeft: 10,
    }
}));


const ParticleCard = ({ particle, noFooter = false, expansionPanel = false }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();

    const [ walletState ] = useWalletContext();
    const { connectedAddress } = walletState;

    const id = particle.typeId;
    const verification = _.get(VerifiedParticleTypes, id, {verified: false});
    const asExpansionPanel = expansionPanel !== false;
    const hasYoutubeUrl = !_.isEmpty(particle.youtube_url);
    const hasAnimationUrl = !_.isEmpty(particle.animation_url);
    const type = particle.isNF ? 'Particle' : 'Plasma';

    let particleIcon = particle.image;
    if (particle.isSeries) {
        particleIcon = particle.icon;
    }

    const _openMetadata = () => {
        window.open(particle.uri);
    };

    const _openTokenList = () => {
        console.log('TODO..');
    };

    const _openMint = () => {
        navigate(`${GLOBALS.ACCELERATOR_ROOT}/mint/${id}`);
    };

    const _getHeader = () => {
        return (
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <div className={customClasses.columnThirds}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Avatar alt={particle.name} src={particleIcon} className={customClasses.particleIcon} />
                        <Typography className={customClasses.heading}>
                            {particle.symbol} - {particle.name}
                        </Typography>
                        {
                            verification.verified && (
                                <Tooltip title={`Verified ${type}`} aria-label={`Verified ${type}`} TransitionComponent={Zoom} arrow>
                                    <VerifiedUserIcon
                                        fontSize={'small'}
                                        className={customClasses.verifiedIcon}
                                    />
                                </Tooltip>
                            )
                        }
                    </Grid>
                </div>
                <div className={classes.columnThirds}>
                    <TokenTypeBadge
                        typeData={particle}
                    />
                </div>
            </Grid>
        );
    };

    const _getLeftContent = () => {
        return (
            <Box px={2}>
                <Typography component={'p'} className={customClasses.titleHeading}>Description:</Typography>
                <Typography component={'p'} className={customClasses.content}>{particle.description}</Typography>

                <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                >
                    <Box mt={-1} component="span">
                        <IconButton
                            color={'secondary'}
                            disabled={!particle.isNF}
                        >
                            <ImageIcon
                                fontSize="large"
                            />
                        </IconButton>
                    </Box>
                    <Box mt={-1} component="span">
                        <IconButton
                            color={'secondary'}
                            disabled={!hasYoutubeUrl}
                        >
                            <YouTubeIcon
                                fontSize="large"
                            />
                        </IconButton>
                    </Box>
                    <Box mt={-1} component="span">
                        <IconButton
                            color={'secondary'}
                            disabled={!hasAnimationUrl}
                        >
                            <PermMediaIcon
                                fontSize="large"
                            />
                        </IconButton>
                    </Box>
                </Grid>
            </Box>
        );
    };

    const _getRightContent = () => {
        return (
            <Box px={2}>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="center"
                >
                    <Grid item xs={12} sm={6}>
                        <Typography className={customClasses.titleHeading}>Price per Token:</Typography>
                        <Typography component={'div'} className={customClasses.content}>
                            <DisplayContractValue
                                contractName="ChargedParticles"
                                method="getMintingFee"
                                methodArgs={[particle.typeId]}
                                formatValue={Helpers.toEtherWithLocalePrecise(6)}
                                defaultValue={'0'}
                            />
                            &nbsp; ETH
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography className={customClasses.titleHeading}>In Circulation:</Typography>
                        <Typography component={'div'} className={customClasses.content}>
                            <DisplayContractValue
                                contractName="ChargedParticles"
                                method="getTotalMinted"
                                methodArgs={[particle.typeId]}
                                formatValue={Helpers.toEtherWithLocale}
                                defaultValue={'0'}
                            />
                            &nbsp;of&nbsp;
                            <DisplayContractValue
                                contractName="ChargedParticles"
                                method="getMaxSupply"
                                methodArgs={[particle.typeId]}
                                formatValue={Helpers.toEtherWithLocale}
                                defaultValue={'0'}
                            />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="center"
                >
                    <Grid item xs={12} sm={6}>
                        {
                            particle.isNF && (
                                <>
                                    <Typography className={customClasses.titleHeading}>Asset Type:</Typography>
                                    <Typography className={customClasses.content}>{particle.assetPairId}</Typography>
                                </>
                            )
                        }
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography className={customClasses.titleHeading}>My balance:</Typography>
                        <Typography component={'div'} className={customClasses.content}>
                            {
                                !_.isEmpty(connectedAddress) && (
                                    <>
                                        <DisplayContractValue
                                            contractName="ChargedParticlesERC1155"
                                            method="balanceOf"
                                            methodArgs={[connectedAddress, particle.typeId]}
                                            formatValue={Helpers.toEtherWithLocale}
                                            defaultValue={'0'}
                                        />
                                        &nbsp; {particle.symbol}
                                    </>
                                )
                            }
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    const _getBody = () => {
        return (
            <ContentSplitter
                iconLeft={() => (<InfoIcon fontSize="large" color="disabled" />)}
                iconRight={() => (<OfflineBoltIcon fontSize="large" color="disabled" />)}
                contentLeft={_getLeftContent}
                contentRight={_getRightContent}
            />
        );
    };

    const _getFooter = () => {
        return (
            <>
                <Button size="small" onClick={_openMetadata}>
                    Metadata
                    <LaunchIcon className={customClasses.externalLinkIcon} />
                </Button>
                <Button size="small" onClick={_openTokenList}>Token List</Button>
                <Button size="small" onClick={_openMint} color="primary">Mint</Button>
            </>
        );
    };


    const _getExpansionPanel = () => {
        return (
            <ExpansionPanel
                expanded={expansionPanel.expanded}
                onChange={(event, isExpanded) => expansionPanel.onChange(event, isExpanded, id)}
                TransitionProps={{ unmountOnExit: true }}
            >
                <ExpansionPanelSummary
                    className={customClasses.summary}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${id}-content`}
                    id={`${id}-header`}
                >
                    {_getHeader()}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={customClasses.details}>
                    {_getBody()}
                </ExpansionPanelDetails>
                {
                    !noFooter && (
                        <>
                            <Divider />
                            <ExpansionPanelActions>
                                {_getFooter()}
                            </ExpansionPanelActions>
                        </>
                    )
                }
            </ExpansionPanel>
        );
    };


    const _getFlatPanel = () => {
        return (
            <Paper className={customClasses.flatPanel}>
                <div className={customClasses.flatPanelHeader}>
                    {_getHeader()}
                </div>
                <div className={customClasses.flatPanelDetails}>
                    {_getBody()}
                </div>
                {
                    !noFooter && (
                        <>
                            <Divider />
                            <div className={customClasses.flatPanelFooter}>
                                {_getFooter()}
                            </div>
                        </>
                    )
                }
            </Paper>
        );
    };


    if (asExpansionPanel) {
        return _getExpansionPanel();
    }
    return _getFlatPanel();
};

export default ParticleCard;
