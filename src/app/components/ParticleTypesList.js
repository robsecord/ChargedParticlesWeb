// Frameworks
import React, { useState, useEffect } from 'react';
import useLocalStorage from 'react-use-localstorage';
import fetch from 'cross-fetch';
import classNames from 'classnames';
import * as _ from 'lodash';

// App Components
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
}));

const fetchedParticles = {};

// List of Particle Types
const ParticleTypesList = ({ owner, transactions }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();

    const [ expandedRow, setExpandedRow ] = React.useState(false);

    const [ particleData, setParticleData ] = useLocalStorage(`CP_PTC_${owner}`, '{}');
    const [ particleCache, setParticleCache ] = useState({});
    // particleCache = {
    //     '__particleTypeId__': {
    //          particleTypeId
    //          uri
    //          isNF
    //          isPrivate
    //          assetPairId
    //          maxSupply
    //          description
    //          external_url
    //          animation_url
    //          youtube_url
    //          image
    //          name
    //          decimals
    //          background_color
    //          properties
    //          attributes
    //     }
    // }
    const updateParticleCache = (cacheData) => {
        setParticleData(JSON.stringify(cacheData));
    };
    let _delayNextEffect = false;
    useEffect(() => {
        const newParticleData = JSON.parse(particleData);
        if (!_.isEqual(particleCache, newParticleData)) {
            setParticleCache(newParticleData);
            _delayNextEffect = true;
        }
    }, [particleData, particleCache, setParticleCache]);

    useEffect(() => {
        const particleTxs = [];
        if (!_delayNextEffect) {
            _.forEach(_cleanTransactions(transactions), tx => {
                const id = tx.particleTypeId;
                const particle = particleCache[id];
                if (_.isEmpty(particle) && !fetchedParticles[id]) {
                    particleTxs.push(tx);
                }
            });

            if (_.size(particleTxs)) {
                _fetchParticleData(particleTxs);
            }
        }
    }, [transactions, particleCache, updateParticleCache]);

    const _toggleExpandedRow = panel => (event, isExpanded) => {
        setExpandedRow(isExpanded ? panel : false);
    };

    const _cleanTransactions = (transactions) => {
        return _.map(transactions, tx => {
            return {
                particleTypeId  : tx._typeId,
                uri             : tx._uri,
                isNF            : tx._isNF,
                isPrivate       : tx._isPrivate,
                assetPairId     : tx._assetPairId,
                maxSupply       : tx._maxSupply,
            };
        });
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
                // Update Particle Cache
                const cacheData = {...particleCache};
                _.forEach(particles, particle => {
                    const id = particle.particleTypeId;
                    cacheData[id] = particle;
                    fetchedParticles[id] = true;
                });
                updateParticleCache(cacheData);
            })
            .catch(console.error);
    };


    const _getExpansionRow = (particle) => {
        const id = particle.particleTypeId;

        let maxSupply = _.parseInt(particle.maxSupply, 10) / GLOBALS.ETH_UNIT;
        if (maxSupply <= 0) { maxSupply = 'Unlimited'; }

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
                                    {particle.name}
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
                                <Typography className={customClasses.content}>123 of {maxSupply}</Typography>
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
                        <Typography variant="caption">
                            Select your destination of choice
                            <br />
                            <a href="#secondary-heading-and-columns" className={customClasses.link}>
                                Learn more
                            </a>
                        </Typography>
                    </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button size="small">Token List</Button>
                    <Button size="small" color="primary">Mint</Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    };


    // Display Particle Types
    return (
        <>
            {_.map(particleCache, particle => _getExpansionRow(particle))}
        </>
    );
};

export default ParticleTypesList;
