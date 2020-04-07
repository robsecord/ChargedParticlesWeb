// Frameworks
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

// Custom Styles
import useRootStyles from '../layout/styles/root.styles';
const useCustomStyles = makeStyles(theme => ({
    colorViewer: {
        display: 'block',
        width: 90,
        height: 30,
        marginTop: 4,
        border: `1px solid ${theme.palette.grey[300]}`,
        boxShadow: `inset 0 0 0 4px ${theme.palette.background.paper}`,
        borderRadius: theme.shape.borderRadius,
    }
}));


const ColorInput = ({ id, initialColor, disableAlpha = true, onChange }) => {
    const classes = useRootStyles();
    const customClasses = useCustomStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [color, setColor] = useState(initialColor);

    const open = Boolean(anchorEl);
    const elementId = open ? `${id}-popover` : undefined;

    const _handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const _handleClose = () => {
        setAnchorEl(null);
    };

    const _handleColorChange = (color) => {
        const rgba = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
        setColor(rgba);
        onChange({hex: color.hex, rgba});
    };

    return (
        <Grid container spacing={3} className={classes.gridRow}>
            <Grid item xs={7}>
                <Button aria-describedby={elementId} variant="outlined" color="default" onClick={_handleClick}>
                    Background Color
                </Button>
                <Popover
                    id={elementId}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={_handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <ChromePicker
                        color={initialColor}
                        disableAlpha={disableAlpha}
                        onChangeComplete={_handleColorChange}
                    />
                </Popover>
            </Grid>
            <Grid item xs={5}>
                <div
                    className={customClasses.colorViewer}
                    style={{backgroundColor: color}}
                >
                    &nbsp;
                </div>
            </Grid>
        </Grid>
    )
};

export default ColorInput;
