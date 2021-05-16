// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        '&.inprogress': {
            position: 'relative',
        },
    },
    ImageList: {
        padding: '10px 10px',
        overflowY: 'hidden',
    },
    icon: {
        color: '#ffffffcf',
    },
    header: {
        padding: '10px 0',
        textAlign: 'center',
    },
    uploadInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0,
    },
    inprogress: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: '#ffffff82',
        zIndex: 2,
    },
    tile: {
        borderRadius: 8,
        border: '1px solid #0000001a',
    },
    tileHeader: {
        textTransform: 'capitalize',
        marginLeft: '15px',
    },
    body: {
        overflowY: 'auto',
        padding: '0px 19px',
        height: 360,
        [theme.breakpoints.down('sm')]: {
            height: 'calc(100% - 50px)',
            margin: 0,
        },
    },
}));
