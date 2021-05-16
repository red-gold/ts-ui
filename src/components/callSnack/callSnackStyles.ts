import { makeStyles, Theme } from '@material-ui/core';

export const cllSnackStyles = makeStyles((theme: Theme) => ({
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
}));
