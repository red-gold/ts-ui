import { Theme } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';

export const cllSnackStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            maxWith: 900,
            minWidth: 346,
            margin: '30px auto',
            padding: 20,
        },
        disableComponent: {
            opacity: '0.2',
            'pointer-events': 'none',
        },
    }),
);
