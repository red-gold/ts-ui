// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createStyles, makeStyles } from '@mui/styles';

export const useStyles = makeStyles(() =>
    createStyles({
        noDisplay: {
            display: 'none',
        },
        playVideo: {
            position: 'absolute',
            right: '45%',
            top: '45%',
            cursor: 'pointer',
            backgroundColor: '#f1efeca3',
            borderRadius: '50%',
            padding: 0,
        },
        playIcon: {
            width: 60,
            height: 60,
            fill: 'red',
        },
    }),
);
