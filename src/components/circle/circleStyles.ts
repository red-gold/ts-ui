// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createTheme';

export const useStyles = makeStyles((theme: Theme) => ({
    userListItem: {
        backgroundColor: '#e2e2e2',
    },
    rightIconMenu: {
        display: 'block',
        position: 'absolute',
        top: '0px',
        right: '12px',
    },
    settingOverlay: {
        background: 'rgba(0,0,0,0.12)',
    },
    settingContent: {
        maxWidth: '400px',
    },
    listMenu: {
        color: 'rgba(0,0,0,0.87)',
        fontSize: '16px',
        marginRight: '8px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    root: {
        width: '100%',
        paddingRight: '0px',
        backgroundColor: theme.palette.background.paper,
    },
    popperOpen: {
        zIndex: 10,
    },
    popperClose: {
        pointerEvents: 'none',
        zIndex: 0,
    },
    dialogPaper: {
        minWidth: 400,
    },
    fullPageXs: {
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100%',
            margin: 0,
            overflowY: 'auto',
        },
    },
}));
