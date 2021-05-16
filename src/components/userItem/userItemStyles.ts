import { Theme } from '@material-ui/core/styles/createTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        height: 254,
        width: 243,
        margin: 10,
        textAlign: 'center',
        minWidth: 230,
        maxWidth: '257px',
    },
    dialogContent: {
        paddingTop: '5px',
        padding: '0px 5px 5px 5px',
    },
    circleName: {
        fontSize: '1rem',
    },
    space: {
        height: 20,
    },
    fullPageXs: {
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100%',
            margin: 0,
            overflowY: 'auto',
        },
    },
    avatar: {
        minWidth: 45,
        flexShrink: 0,
        cursor: 'pointer',
    },
    root: {
        display: 'flex',
        width: '100%',
        justifyContent: 'start',
        alignItems: 'center',
    },
    name: {
        flex: 1,
        overflow: 'hidden',
        padding: 5,
        minWidth: 0,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}));
