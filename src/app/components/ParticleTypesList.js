// Frameworks
import React, { useState, useEffect } from 'react';
import useLocalStorage from 'react-use-localstorage';
import fetch from 'cross-fetch';
import classNames from 'classnames';
import window from 'global';
import * as _ from 'lodash';

// App Components
import { Helpers } from '../../utils/helpers';
import { GLOBALS } from '../../utils/globals';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';
import YouTubeIcon from '@material-ui/icons/YouTube';
import LaunchIcon from '@material-ui/icons/Launch';
import PermMediaIcon from '@material-ui/icons/PermMedia';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';

const useCustomStyles = makeStyles(theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
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
    details: {
        alignItems: 'center',
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
    columnSpacer: {
        paddingRight: 20,
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
    }
}));

let fetchedParticles = {};

// List of Particle Types
const ParticleTypesList = ({ owner, transactions, allowCache }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();

    const [ expandedRow, setExpandedRow ] = React.useState(false);

    const [ particleCache, setParticleCache ] = useLocalStorage(`CP_PTC_${owner}`, '{}');
    const [ particleData, setParticleData ] = useState({});

    let isMounted = true;
    let _delayNextEffect = false;
    useEffect(() => {
        if (allowCache) {
            const allData = {...particleData};
            const cacheData = JSON.parse(particleCache);

            _.forEach(cacheData, particle => {
                const id = particle.typeId;
                if (_.isEmpty(allData[id]) && !fetchedParticles[id]) {
                    allData[id] = particle;
                }
            });

            if (!_.isEqual(particleData, allData)) {
                setParticleData(allData);
                _delayNextEffect = true;
            }
        }
    }, [allowCache, particleCache, particleData, setParticleData]);

    useEffect(() => {
        const particleTxs = [];
        if (!_delayNextEffect) {
            _.forEach(_cleanTransactions(transactions), tx => {
                const id = tx.typeId;
                const particle = particleData[id];
                if (_.isEmpty(particle) && !fetchedParticles[id]) {
                    particleTxs.push(tx);
                }
            });

            if (_.size(particleTxs)) {
                _fetchParticleData(particleTxs);
            }
        }

        return () => {
            fetchedParticles = {};
            isMounted = false;
        };
    }, [transactions, particleData, setParticleData]);

    const updateParticleCache = (allData) => {
        if (allowCache) {
            setParticleCache(JSON.stringify(allData));
        }
    };

    const _toggleExpandedRow = panel => (event, isExpanded) => {
        setExpandedRow(isExpanded ? panel : false);
    };

    const _cleanTransactions = (transactions) => {
        return _.map(transactions, tx => ({
            creator         : tx._owner,
            typeId          : tx._particleTypeId || tx._plasmaTypeId,
            uri             : tx._uri,
            isPrivate       : tx._isPrivate,
            maxSupply       : tx._maxSupply,
            isNF            : _.isUndefined(tx._plasmaTypeId),

            // Specific to Particles (ERC-721)
            assetPairId     : tx._assetPairId || '',
            creatorFee      : tx._creatorFee || 0,

            // Specific to Plasma (ERC-20)
            ethPerToken     : tx._ethPerToken || 0,
            initialMint     : tx._initialMint || 0,
            mintReceiver    : tx._mintReceiver || '',
        }));
    };

    const _getJson = (particleTx) => {
        return new Promise(async (resolve, reject) => {
            const res = await fetch(particleTx.uri);
            if (res.status >= 400) {
                reject('Failed to acquire Particle Type Data');
            }
            const json = await res.json();
            resolve({...particleTx, ...json});
        });
    };

    const _fetchParticleData = (particleTxs) => {
        // Load Particle Data
        const requests = _.map(particleTxs, particleTx => _getJson(particleTx));
        Promise.all(requests)
            .then((particles) => {
                if (!isMounted) { return; }

                // Update Particle Data
                const allData = {...particleData};
                _.forEach(particles, particle => {
                    const id = particle.typeId;
                    allData[id] = particle;
                    fetchedParticles[id] = true;
                });
                setParticleData(allData);
                updateParticleCache(allData);
            })
            .catch(console.error);
    };

    const _openMetadata = (particle) => () => {
        window.open(particle.uri);
    };

    const _openTokenList = () => {

    };

    const _openMint = () => {

    };


    const _getExpansionRow = (particle) => {
        const id = particle.typeId;

        let inCirculation = _.parseInt(particle.initialMint || 0, 10) / GLOBALS.ETH_UNIT;

        let maxSupply = _.parseInt(particle.maxSupply, 10) / GLOBALS.ETH_UNIT;
        if (maxSupply <= 0) { maxSupply = 'Unlimited'; }

        let ethPerToken = 0;
        if (!particle.isNF) {
            ethPerToken = Helpers.toEther(particle.ethPerToken);
        }

        const hasYoutubeUrl = !_.isEmpty(particle.youtube_url);
        const hasAnimationUrl = !_.isEmpty(particle.animation_url);

        return (
            <ExpansionPanel
                key={id}
                expanded={expandedRow === id}
                onChange={_toggleExpandedRow(id)}
                TransitionProps={{ unmountOnExit: true }}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${id}-content`}
                    id={`${id}-header`}
                >
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
                                <Avatar alt={particle.name} src={particle.image} className={customClasses.particleIcon} />
                                <Typography className={customClasses.heading}>
                                    {particle.symbol} - {particle.name}
                                </Typography>
                            </Grid>
                        </div>
                        <div className={classes.columnThirds}>
                            <Chip
                                color={particle.isPrivate ? 'default' : 'secondary'}
                                icon={particle.isPrivate ? <LockIcon /> : <PublicIcon />}
                                label={particle.isNF ? 'Non-fungible' : 'Fungible'}
                            />
                        </div>
                    </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={customClasses.details}>
                    <div className={customClasses.columnTwoThirds}>

                        <Typography className={customClasses.titleHeading}>Description:</Typography>
                        <Typography className={customClasses.content}>{particle.description}</Typography>

                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography className={customClasses.titleHeading}>In Circulation:</Typography>
                                <Typography className={customClasses.content}>{inCirculation} of {maxSupply}</Typography>
                            </Box>
                            <Box>
                                <Box mr={3} component="span">
                                    <YouTubeIcon
                                        fontSize="large"
                                        color={hasYoutubeUrl ? 'primary' : 'disabled'}
                                    />
                                </Box>
                                <Box mr={3} component="span">
                                    <PermMediaIcon
                                        fontSize="large"
                                        color={hasAnimationUrl ? 'primary' : 'disabled'}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </div>
                    <div className={classNames(customClasses.columnThirds, customClasses.helper)}>
                        {
                            particle.isNF
                                ? (
                                    <>
                                        <Typography className={customClasses.titleHeading}>Asset Type:</Typography>
                                        <Typography className={customClasses.content}>{particle.assetPairId}</Typography>
                                    </>
                                )
                                : (
                                    <>
                                        <Typography className={customClasses.titleHeading}>Price per Token:</Typography>
                                        <Typography className={customClasses.content}>{ethPerToken} ETH</Typography>
                                    </>
                                )
                        }
                        <Typography className={customClasses.titleHeading}>My balance:</Typography>
                        <Typography className={customClasses.content}>### {particle.symbol}</Typography>
                    </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button size="small" onClick={_openMetadata(particle)}>
                        Metadata
                        <LaunchIcon className={customClasses.externalLinkIcon} />
                    </Button>
                    <Button size="small" onClick={_openTokenList(particle)}>Token List</Button>
                    <Button size="small" onClick={_openMint(particle)} color="primary">Mint</Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    };

    const _getRows = () => {
        let first = null;
        const rest = _.map(particleData, particle => {
            if (particle.typeId === GLOBALS.ION_TOKEN_ID) {
                first = _getExpansionRow(particle);
                return;
            }
            return _getExpansionRow(particle);
        });
        return _.compact([first, ...rest]);
    };


    // Display Types
    return (
        <>
            {_getRows()}
        </>
    );
};

export default ParticleTypesList;
