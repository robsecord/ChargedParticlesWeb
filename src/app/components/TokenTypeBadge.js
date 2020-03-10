// Frameworks
import React from 'react';
import * as _ from 'lodash';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import CollectionsIcon from '@material-ui/icons/Collections';
import FiberSmartRecordIcon from '@material-ui/icons/FiberSmartRecord';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';
const useCustomStyles = makeStyles(theme => ({
    typeBadge: {
        position: 'absolute',
        top: 20,
        right: 30,
    },
    iconContainer: {
        position: 'relative',
        top: 2,
        left: 0,
    },
    plasmaIcon: {
        transform: 'rotate(180deg)',
    }
}));


const TokenTypeBadge = ({ typeData }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();

    const isNonFungible = typeData.classification !== 'plasma';
    const fungibility = isNonFungible ? 'Non-fungible' : 'Fungible';

    console.log('typeData', typeData);

    const _getIconTooltip = () => {
        const tooltip = [typeData.isPrivate ? 'Private' : 'Public'];
        tooltip.push(_.startCase(typeData.classification));
        return tooltip.join(' ');
    };

    const _getIconByClass = () => {
        switch (typeData.classification) {
            case 'series':
                return (<CollectionsIcon />);
            case 'collection':
                return (<BurstModeIcon />);
            default:
                return (<FiberSmartRecordIcon className={customClasses.plasmaIcon}/>);
        }
    };

    const _getIcons = () => {
        const accessType = typeData.isPrivate ? <LockIcon /> : <PublicIcon />;
        const type = _getIconByClass();
        return (
            <Tooltip title={_getIconTooltip()} aria-label={_getIconTooltip()} TransitionComponent={Zoom} arrow>
                <div className={customClasses.iconContainer}>
                    {accessType}
                    {type}
                </div>
            </Tooltip>
        );
    };

    return (
        <>
            <Chip
                className={customClasses.typeBadge}
                color={typeData.isPrivate ? 'default' : 'secondary'}
                icon={_getIcons()}
                label={fungibility}
            />
        </>
    );
};

export default TokenTypeBadge;
