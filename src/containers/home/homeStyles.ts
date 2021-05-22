import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

const drawerWidth = 256;
export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        minheight: '100%',
        marginTop: theme.spacing(3),
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        // overflowY: 'auto'
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawerHeader: {
        padding: 10,
        marginLeft: 10,
    },
    drawerPaper: {
        maxWidth: drawerWidth,
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            position: 'relative',
            height: '100%',
        },
    },
    drawerPaperLarge: {
        width: `${drawerWidth}px !important`,
        'z-index': `${theme.zIndex.drawer} !important`,
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            height: '100%',
        },
        backgroundColor: '#fafafa !important',
    },
    menu: {
        height: '100%',
    },
    content: {
        backgroundColor: 'transparent',
        width: '100%',
        flexGrow: 1,
        paddingTop: 15,
        padding: theme.spacing(1),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflow: 'auto',
        overflowX: 'hidden',
        minHeight: '100%',
        paddingBottom: 80,
        marginTop: 44,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 44,
            paddingTop: 15,
        },
        [theme.breakpoints.down('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 44,
            paddingTop: 15,
        },
    },
    'content-left': {
        marginLeft: 0,
    },
    'content-right': {
        marginRight: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        marginLeft: 0,
        [theme.breakpoints.up('md')]: {
            marginLeft: drawerWidth,
        },
    },
    'contentShift-right': {
        marginRight: 0,
        [theme.breakpoints.up('md')]: {
            marginRight: drawerWidth,
        },
    },
    logo: {
        width: '100% !important',
        height: '2em !important',
        display: 'inline-block !important',
        fontSize: '17px !important',
        transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important',
        'user-select': 'none !important',
        flexShrink: 0,
    },
    info: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 24,
        marginTop: 80,
        '& > p': {
            padding: 10,
            backgroundColor: '#aed6ff36',
            borderRadius: 8,
            fontSize: 12,
        },
    },
    heartSymbol: {
        color: 'red',
    },
}));
