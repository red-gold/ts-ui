import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createTheme';

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        minWidth: 275,
    },
    listRoot: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    progress: {
        display: 'flex',
        justifyContent: 'center',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));
