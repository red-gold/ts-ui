import grey from '@mui/material/colors/grey';

import { createStyles } from '@mui/material';

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
