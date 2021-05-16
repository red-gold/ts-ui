import { Theme } from '@material-ui/core/styles/createTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: '#a5792a',
    },
    flex: {
        flex: 1,
    },
    avatar: {
        margin: 5,
        cursor: 'pointer',
    },
    pageTitle: {
        color: theme.palette.common.white,
        borderLeftColor: theme.palette.common.white,
    },
    appIcon: {
        height: '40px !important',
        width: '40px !important',
        'margin-left': '10px !important',
    },
    searchBox: {},
    fullBox: {
        flex: 1,
    },
    searchButton: {
        color: 'rgb(255, 255, 255)',
    },
    smallSearchBox: {
        marginRight: 25,
    },
    appBar: {
        'z-index': theme.zIndex.drawer + 1 + ' !important',
    },
}));
