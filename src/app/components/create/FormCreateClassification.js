// Frameworks
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as _ from 'lodash';

// Material UI
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { red } from '@material-ui/core/colors';

import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckIcon from '@material-ui/icons/Check';

const useCustomStyles = makeStyles(theme => ({
    root: {
        minWidth: 200,
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
        left: '53%',
        width: itemSpecs.w,
        height: itemSpecs.h,
        border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
        background: theme.palette.background.paper,
        borderRadius: itemSpecs.r,
        transform: 'translateX(-50%)',

        '&::before': {
            display: 'block',
            position: 'absolute',
            top: (itemSpecs.b * 2),
            right: (itemSpecs.b * 2),
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
            top: (itemSpecs.b * 2) + 10,
            right: (itemSpecs.b * 2) + 10,
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
        left: '53%',
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
            right: itemSpecs.b + 10,
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
            right: (itemSpecs.b * 10),
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
            left: '53%',
            width: itemSpecs.w - 5,
            height: itemSpecs.w - 5,
            marginTop: 10,
            marginBottom: 25,
            border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
            background: theme.palette.background.paper,
            borderRadius: '50%',
            transform: 'translateX(-50%)',

            '&::before': {
                display: 'block',
                position: 'absolute',
                top: (itemSpecs.b * 2),
                right: (itemSpecs.b * 2),
                width: itemSpecs.w - 5,
                height: itemSpecs.w - 5,
                border: `${itemSpecs.b}px dashed ${itemSpecs.c2}`,
                background: theme.palette.background.paper,
                borderRadius: '50%',
                content: '" "',
            },

            '&::after': {
                display: 'block',
                position: 'absolute',
                top: (itemSpecs.b * 2) + 10,
                right: (itemSpecs.b * 2) + 10,
                width: itemSpecs.w,
                height: itemSpecs.w,
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
            info: 'A single, unique NFT with multiple copies, each having their own Mass and generating a Charge. ERC721-compatible.',
            bullets: [
                'One unique item',
                'Many copies',
                'Max supply',
            ],
        },
        {
            type: 'collection',
            title: 'Collection',
            content: (<CollectionOption/>),
            info: 'A collection of unique NFTs, single copy, each having their own Mass and generating a Charge. ERC721-compatible.',
            bullets: [
                'Many unique items',
                'One copy of each',
                'No max supply',
            ],
        },
        {
            type: 'plasma',
            title: 'Plasma',
            content: (<PlasmaOption/>),
            info: 'A bag of fungible tokens which hold no mass and generate no charge.  ERC20-compatible.',
            bullets: [
                'Many tokens',
                'You set the price',
                'Max supply',
            ],
        },
    ];
};


const FormCreateClasification = ({ back, next, onUpdate }) => {
    const customClasses = useCustomStyles();
    const [expanded, setExpanded] = useState(-1);
    const types = getTypes();

    const handleExpandClick = (index) => () => {
        setExpanded(expanded === index ? -1 : index);
    };

    const _selectClassifiation = (index) => (evt) => {
        onUpdate({classification: types[index].type});
        next();
    };

    const _getCardForType = (index) => {
        const isExpanded = (expanded === index);
        return (
            <Grid item sm={12} md={4}>
                <Card className={customClasses.root} variant="outlined">
                    <CardActionArea onClick={_selectClassifiation(index)}>
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {types[index].content}
                            </Typography>
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
                    {_.map(types[index].bullets, (bullet) => (
                        <ListItem>
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

export default FormCreateClasification;
