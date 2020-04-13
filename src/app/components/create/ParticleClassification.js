// Frameworks
import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import * as _ from 'lodash';

// Data Context for State
import { RootContext } from '../../contexts/root';

// Material UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';

const useCustomStyles = makeStyles(theme => ({
    root: {
        minWidth: 200,
    },
    cardContent: {
        padding: 22,
    },
    cardTitle: {
        marginLeft: 10,
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));


const itemSpecs = {w: 100, h: 130, b: 3, r: 5, c1: '#ccc', c2: '#999'};

const SeriesOption = withStyles(theme => ({
    root: {
        position: 'relative',
        left: '45%',
        top: 14,
        width: itemSpecs.w,
        height: itemSpecs.h,
        border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
        background: theme.palette.background.paper,
        borderRadius: itemSpecs.r,
        transform: 'translateX(-50%)',

        '&::before': {
            display: 'block',
            position: 'absolute',
            top: -12,
            right: -12,
            width: itemSpecs.w,
            height: itemSpecs.h,
            border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
            background: theme.palette.background.paper,
            borderRadius: itemSpecs.r,
            content: '" "',
        },

        '&::after': {
            display: 'block',
            position: 'absolute',
            top: -21,
            right: -21,
            width: itemSpecs.w,
            height: itemSpecs.h,
            border: `${itemSpecs.b}px solid ${itemSpecs.c1}`,
            background: theme.palette.background.paper,
            borderRadius: itemSpecs.r,
            content: '" "',
        }
    }
}))(Paper);

const CollectionOption = withStyles(theme => ({
    root: {
        position: 'relative',
        left: '45%',
        width: itemSpecs.w,
        height: itemSpecs.h,
        border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
        background: theme.palette.background.paper,
        borderRadius: itemSpecs.r,
        transform: 'translateX(-50%)',

        '&::before': {
            display: 'block',
            position: 'absolute',
            top: -itemSpecs.b,
            right: -18,
            width: itemSpecs.w,
            height: itemSpecs.h,
            border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
            background: theme.palette.background.paper,
            borderRadius: itemSpecs.r,
            content: '" "',
        },

        '&::after': {
            display: 'block',
            position: 'absolute',
            top: -itemSpecs.b,
            right: -34,
            width: itemSpecs.w,
            height: itemSpecs.h,
            border: `${itemSpecs.b}px solid ${itemSpecs.c1}`,
            background: theme.palette.background.paper,
            borderRadius: itemSpecs.r,
            content: '" "',
        }
    }
}))(Paper);

const PlasmaOption = withStyles(theme => ({
    root: {
        '&, &:last-child': {
            position: 'relative',
            top: 0,
            left: '42%',
            width: itemSpecs.w + 15,
            height: itemSpecs.w + 15,
            marginTop: 10,
            marginBottom: 6,
            border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
            background: theme.palette.background.paper,
            borderRadius: '50%',
            transform: 'translateX(-50%)',

            '&::before': {
                display: 'block',
                position: 'absolute',
                top: -3,
                right: -18,
                width: itemSpecs.w + 15,
                height: itemSpecs.w + 15,
                border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
                background: theme.palette.background.paper,
                borderRadius: '50%',
                content: '" "',
            },

            '&::after': {
                display: 'block',
                position: 'absolute',
                top: -6,
                right: -39,
                width: itemSpecs.w + 20,
                height: itemSpecs.w + 20,
                border: `${itemSpecs.b}px solid ${itemSpecs.c1}`,
                background: theme.palette.background.paper,
                borderRadius: '50%',
                content: '" "',
            }
        }
    }
}))(Paper);

const getTypes = () => {
    return [
        {
            type: 'series',
            title: 'Series',
            content: (<SeriesOption/>),
            info: 'A single, unique NFT with multiple copies, each having their own Mass and generating a Charge.',
            bullets: [
                'One unique item',
                'Many copies',
                'Max supply',
                'ERC-721 Compatible',
            ],
        },
        {
            type: 'collection',
            title: 'Collection',
            content: (<CollectionOption/>),
            info: 'A collection of unique NFTs, single copy, each having their own Mass and generating a Charge.',
            bullets: [
                'Many unique items',
                'One copy of each',
                'No max supply',
                'ERC-721 Compatible',
            ],
        },
        {
            type: 'plasma',
            title: 'Plasma',
            content: (<PlasmaOption/>),
            info: 'A bag of fungible tokens which hold no mass and generate no charge.',
            bullets: [
                'Many tokens',
                'You set the price',
                'Max supply',
                'ERC-20 Compatible',
            ],
        },
    ];
};


const ParticleClassification = ({ next }) => {
    const customClasses = useCustomStyles();
    const [, rootDispatch] = useContext(RootContext);
    const [expanded, setExpanded] = useState(-1);
    const types = getTypes();

    const handleExpandClick = (index) => () => {
        setExpanded(expanded === index ? -1 : index);
    };

    const _selectClassification = (index) => (evt) => {
        rootDispatch({type: 'UPDATE_CREATION_DATA', payload: {classification: types[index].type}});
        next();
    };

    const _getCardForType = (index) => {
        const isExpanded = (expanded === index);
        return (
            <Grid item sm={12} md={4} key={index}>
                <Card className={customClasses.root} variant="outlined">
                    <CardActionArea onClick={_selectClassification(index)}>
                        <CardContent className={customClasses.cardContent}>
                            {types[index].content}
                        </CardContent>
                    </CardActionArea>
                    <CardActions disableSpacing>
                        <Typography className={customClasses.cardTitle} variant="h5" component="h3">
                            {types[index].title}
                        </Typography>
                        <IconButton
                            className={clsx(customClasses.expand, {
                                [customClasses.expandOpen]: isExpanded,
                            })}
                            onClick={handleExpandClick(index)}
                            aria-expanded={isExpanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {types[index].info}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
                <List dense={true}>
                    {_.map(types[index].bullets, (bullet, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <CheckIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={bullet} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        );
    };

    return (
        <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="flex-start"
            spacing={3}
        >
            {
                _.map(types, (type, index) => {
                    return _getCardForType(index);
                })
            }
        </Grid>
    )
};

export default ParticleClassification;
