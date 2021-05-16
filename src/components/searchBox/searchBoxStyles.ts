import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: '#a5792a',
    },
    flex: {
        flex: 1,
    },
    pageTitle: {
        color: theme.palette.common.white,
        borderLeftColor: theme.palette.common.white,
    },
    appIcon: {
        width: 40,
        height: 40,
        marginLeft: 10,
    },
    searchInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: theme.palette.common.white + ' !important',
        padding: 5,
        borderRadius: 4,
    },
    searchField: {
        'margin-left': '20px !important',
        maxWidth: 720,
    },
    searchIcon: {
        marginLeft: 0,
        marginRight: 9,
        color: theme.palette.common.white,
    },
    searchButton: {},
    searchItemIcon: {
        width: 18,
        height: 18,
        color: theme.palette.common.black,
    },
    searchList: {
        maxHeight: 384,
        maxWidth: 820,
        top: 47,
        position: 'absolute',
        right: 0,
        left: 0,
        zIndex: 1,
        outline: 'none',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
    },
    searchIconRoot: {
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.white,
        marginRight: 0,
    },
    listItem: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 16,
        paddingRight: 16,
    },
    searchItemText: {
        fontWeight: 400,
        paddingLeft: 6,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: theme.palette.common.black,
        display: 'block',
    },
    noDisplay: {
        display: 'none',
    },
}));
