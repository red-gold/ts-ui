// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        closeButton: {
            color: 'black',
            top: 20,
            right: 6,
        },
        closeIcon: {
            width: 25,
            height: 25,
            '&:hover': {
                color: '#868686',
            },
        },
        listItem: {
            padding: '12px 20px !important',
            '&::not(:last-child)': {
                marginBottom: 1,
            },
        },
        itemGutter: {
            paddingLeft: 15,
        },
        description: {
            color: 'rgba(0,0,0,0.54)',
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%,',
        },
        userName: {
            color: 'rgba(0,0,0,0.87)',
            fontSize: 16,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
        },
        itemText: {
            marginLeft: 10,
            color: theme.palette.common.black,
        },
    }),
);
