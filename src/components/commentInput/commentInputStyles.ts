// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createStyles, makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(() =>
    createStyles({
        header: {
            padding: '2px 3px 3px 10px !important',
        },
        textField: {
            fontWeight: 400,
            fontSize: '14px',
        },
        postButton: {
            flexDirection: 'row-reverse',
        },
    }),
);
