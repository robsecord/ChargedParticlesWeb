
// Material UI
import { makeStyles } from '@material-ui/core/styles';

// Internals
import { GLOBALS } from '../../../utils/globals';

export default makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('md')]: {
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

        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0,
            paddingRight: 0,
        },
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

    loadingContainer: {
        margin: '2rem 0',
    },
    loadingPaper: {
        padding: '1rem 1.5rem',

        '& span': {
            marginLeft: '1.4rem',
            fontSize: '1.15rem',
            lineHeight: '2rem',
            verticalAlign: 'super',
            fontFamily: 'Roboto, Courier, monospace',
        }
    },

    simpleModal: {
        position: 'absolute',
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
        width: theme.spacing(60),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        borderRadius: '5px',
        padding: theme.spacing(4),
        outline: 'none',
    },
}));
