import grey from '@material-ui/core/colors/grey';

import { createStyles } from '@material-ui/core';
export const postWriteButtonStyles = () =>
    createStyles({
        postWritePrimaryText: {
            color: grey[400],
            cursor: 'text',
        },
        postWtireItem: {
            fontWeight: 200,
        },
    });
