// Frameworks
import React from 'react';
import clsx from 'clsx';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const drawerOpenWidth = '90%';
const drawerClosedWidth = 60;
const drawerHeight = 200;

const useCustomStyles = makeStyles(theme => ({
    contentSplitterContainer: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        overflowX: 'hidden',
    },
    drawer: {
        width: drawerOpenWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        position: 'absolute',
        width: drawerOpenWidth,
        height: drawerHeight,
    },
    drawerOpen: {
        width: drawerOpenWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: drawerClosedWidth,

        // [theme.breakpoints.up('sm')]: {
        //     width: theme.spacing(9) + 1,
        // },
    },

    contentContainer: {
        overflowX: 'hidden',
        minWidth: 300,
        height: drawerHeight,
    },
    contentContainerRight: {
        width: drawerOpenWidth,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
    icon: {
        float: 'left',
        width: 40,
        height: '100%',
    },
    content: {
        marginLeft: 50,
    },
}));


const ContentSplitter = ({ iconLeft, iconRight, contentLeft, contentRight }) => {
    const customClasses = useCustomStyles();

    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        !open && setOpen(true);
    };

    const handleDrawerClose = () => {
        open && setOpen(false);
    };

    return (
        <div className={customClasses.contentSplitterContainer}>
            <Drawer
                variant="permanent"
                className={clsx(customClasses.drawer, {
                    [customClasses.drawerOpen]: open,
                    [customClasses.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx(customClasses.drawerPaper, {
                        [customClasses.drawerOpen]: open,
                        [customClasses.drawerClose]: !open,
                    }),
                }}
            >
                <div className={customClasses.contentContainer}>
                    <div className={customClasses.icon} onClick={handleDrawerOpen}>
                        {iconLeft()}
                    </div>
                    <div className={customClasses.content}>
                        {contentLeft()}
                    </div>
                </div>
            </Drawer>
            <div className={clsx(customClasses.contentContainer, customClasses.contentContainerRight)}>
                <div className={customClasses.icon} onClick={handleDrawerClose}>
                    {iconRight()}
                </div>
                <div className={customClasses.content}>
                    {contentRight()}
                </div>
            </div>
        </div>
    );
};

export default ContentSplitter;
