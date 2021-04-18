import { createStyles } from '@material-ui/styles';

export const homeHeaderStyles = createStyles((theme: any) => ({
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
        height: 40,
        width: 40,
        marginLeft: 10,
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
}));
