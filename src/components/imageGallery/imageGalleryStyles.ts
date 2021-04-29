// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';

export const imageGalleryStyles = (theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
        },
        gridList: {
            width: 500,
            height: 450,
            overflowY: 'auto',
        },
        uploadButton: {
            verticalAlign: 'middle',
            fontWeight: 400,
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
        deleteImage: {
            marginLeft: '5px',
            cursor: 'pointer',
            color: 'white',
        },
        addImage: {
            marginRight: '5px',
            cursor: 'pointer',
            color: 'white',
        },
        fullPageXs: {
            [theme.breakpoints.down('xs')]: {
                width: '100%',
                height: '100%',
                margin: 0,
                overflowY: 'auto',
            },
        },
        dialogTitle: {
            padding: 0,
        },
        dialogContentRoot: {
            maxHeight: 400,
            minWidth: 500,
            [theme.breakpoints.down('xs')]: {
                maxHeight: '100%',
                minWidth: '100%',
            },
        },
        fixedDownStickyXS: {
            [theme.breakpoints.down('xs')]: {
                position: 'fixed',
                bottom: 0,
                right: 0,
                background: 'white',
                width: '100%',
            },
        },
        bottomPaperSpace: {
            height: 16,
            [theme.breakpoints.down('xs')]: {
                height: 90,
            },
        },
        box: {
            padding: '0px 24px 0px',
            display: 'flex',
        },
        bottomTextSpace: {
            marginBottom: 15,
        },
        dayPicker: {
            width: '100%',
            padding: '13px 0px 8px',
        },
    });
