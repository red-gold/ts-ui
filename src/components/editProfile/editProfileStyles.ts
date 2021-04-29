// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createStyles } from '@material-ui/styles';

export const editProfileStyles = () =>
    createStyles({
        avatar: {
            border: '2px solid rgb(255, 255, 255)',
        },
        paper: {
            width: '90%',
            height: '100%',
            margin: '0 auto',
            display: 'block',
        },
        title: {
            padding: '24px 24px 20px 24px',
            font: '500 20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
            display: 'flex',
            wordWrap: 'break-word',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            flexGrow: 1,
        },
        actions: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '24px 24px 20px',
        },
        updateButton: {
            marginLeft: '10px',
        },
        dialogGallery: {
            width: '',
            maxWidth: '530px',
            borderRadius: '4px',
        },
        iconButtonSmall: {},
        box: {
            marginBottom: 10,
        },
    });
