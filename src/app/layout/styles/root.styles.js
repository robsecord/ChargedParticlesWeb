
// Material UI
import { makeStyles } from '@material-ui/core/styles';

// Internals
import { GLOBALS } from '../../../utils/globals';

export default makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: GLOBALS.SIDEMENU_WIDTH,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: GLOBALS.SIDEMENU_WIDTH,
        // borderRight: `1px solid ${theme.palette.primary.main}`,
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },

    appBar: {
        // top: 'auto',
        // bottom: 0,
        // [theme.breakpoints.up('sm')]: {
        //     top: 0,
        //     bottom: 'auto',
        //     // width: `calc(100% - ${GLOBALS.SIDEMENU_WIDTH}px)`,
        //     // marginLeft: GLOBALS.SIDEMENU_WIDTH,
        // },
        zIndex: 2000,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },

    sidemenu: {
        ...theme.mixins.toolbar,
    },

    tabBar: {
        flexGrow: 1,
        width: '100%',
        // backgroundColor: theme.palette.background.paper,
    },
}));
