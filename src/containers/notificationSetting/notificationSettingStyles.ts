import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    notification: {
        [theme.breakpoints.down('xs')]: {
            marginTop: 25,
        },
    },
    headerCaption: {
        marginLeft: 10,
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
}));
