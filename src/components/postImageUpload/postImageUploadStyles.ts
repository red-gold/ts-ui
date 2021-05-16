import { makeStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

export const useStyles = makeStyles((theme: any) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        marginTop: 30,
    },
    ImageList: {
        flexWrap: 'nowrap',
        width: '100%',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
        position: 'absolute',
        top: '0px',
        right: '0px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing(4),
        marginBottom: 20,
        backgroundColor: theme.palette.background.default,
    },
    paper: {
        minHeight: '500px',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            borderRadius: 0,
            margin: 0,
        },
    },
    information: {
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    tile: {
        borderRadius: 8,
        border: '1px solid #0000001a',
    },
    img: {
        objectFit: 'cover',
        borderRadius: 8,
        border: '1px solid #0000001a',
    },
    imgRoot: {
        position: 'relative',
    },
}));
