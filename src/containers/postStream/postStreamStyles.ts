/* eslint-disable no-useless-computed-key */

export const postStreamStyles = (theme: any) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(0, 3),
    },

    container: {
        maxWidth: 1200,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        lineHeight: 0,
        position: 'relative',
        boxPack: 'center',
        WebkitJustifyContent: 'center',
        justifyContent: 'center',
        display: 'flex',
        margin: '0 auto',
        padding: '10px 0',
        width: '100%',
        ['@media (min-width: 440px)']: {
            width: '90%',
        },
        ['@media only screen and (min-width: 860px)']: {
            width: '90%',
        },
        ['@media (min-width: 1600px)']: {
            width: '94%',
        },
        ['@media (max-width: 440px)']: {
            width: 'calc(100% - 16px)',
            margin: '0 8px',
        },
    },
    spaceBox: {
        height: 24,
    },
    gridCell: {
        [theme.breakpoints.down('sm')]: {
            maxWidth: '100% !important',
            width: '100%',
        },
    },
});
