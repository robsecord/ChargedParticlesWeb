// Frameworks
import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


function TabPanel(props) {
    const { children, group, value, index, boxSpacing, boxSpacingX, boxSpacingY, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`${group}-tabpanel-${index}`}
            aria-labelledby={`${group}-tab-${index}`}
            {...other}
        >
            {value === index && <Box px={boxSpacingX || boxSpacing} py={boxSpacingY || boxSpacing}>{children}</Box>}
        </Typography>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    group: PropTypes.string.isRequired,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    boxSpacing: PropTypes.number,
    boxSpacingX: PropTypes.number,
    boxSpacingY: PropTypes.number,
};

export default TabPanel;
