import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        formControl: {
            margin: theme.spacing(1) + ' !important',
            minWidth: '320px !important',
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        headerCaption: {
            marginLeft: 10,
        },
        cardActions: {
            justifyContent: 'flex-end',
        },
    }),
);
