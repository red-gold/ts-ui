// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { createStyles, makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(() =>
    createStyles({
        skeletonRoot: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }),
);
