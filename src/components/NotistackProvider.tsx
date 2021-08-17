import React from 'react';
import { SnackbarProvider } from 'notistack5';
import infoFill from '@material-ui/icons/InfoRounded';
import alertCircleFill from '@material-ui/icons/ErrorRounded';
import alertTriangleFill from '@material-ui/icons/ReportProblemRounded';
import checkmarkCircle2Fill from '@material-ui/icons/CheckCircleOutlineRounded';
// material
import { makeStyles, createStyles } from '@material-ui/styles';
import { alpha, Theme } from '@material-ui/core/styles';
import { Box, SvgIcon } from '@material-ui/core';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme: Theme) => {
    const isLight = theme.palette.mode === 'light';

    const createStyle = {
        color: `${theme.palette.text.primary} !important`,
        backgroundColor: `${theme.palette.background.paper} !important`,
    };

    return createStyles({
        containerRoot: {
            pointerEvents: 'unset',
            '& .MuiCollapse-wrapperInner': {
                width: '100%',
            },
        },
        contentRoot: {
            width: '100%',
            padding: theme.spacing(1.5),
            margin: theme.spacing(0.25, 0),
            boxShadow: theme.shadows[8],
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.grey[isLight ? 0 : 800],
            backgroundColor: theme.palette.grey[isLight ? 900 : 0],
        },
        message: {
            padding: 0,
            fontWeight: theme.typography.fontWeightMedium,
        },
        action: {
            marginRight: -4,
            '& svg': {
                width: 20,
                height: 20,
                opacity: 0.48,
                '&:hover': { opacity: 1 },
            },
        },
        info: { ...createStyle },
        success: { ...createStyle },
        warning: { ...createStyle },
        error: { ...createStyle },
    });
});

// ----------------------------------------------------------------------

export interface SnackbarIconProps {
    icon: typeof SvgIcon;
    color: string;
}

function SnackbarIcon({ icon: Icon, color }: SnackbarIconProps) {
    return (
        <Box
            component="span"
            sx={{
                mr: 1.5,
                width: 40,
                height: 40,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
                color: `${color}.main`,
                bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
            }}
        >
            <Icon width={24} height={24} />
        </Box>
    );
}

export interface NotistackProviderProps {
    children?: React.ReactNode;
}

export default function NotistackProvider({ children }: NotistackProviderProps) {
    const classes = useStyles();

    return (
        <SnackbarProvider
            dense
            maxSnack={5}
            // preventDuplicate
            autoHideDuration={3000}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            iconVariant={{
                success: <SnackbarIcon icon={checkmarkCircle2Fill} color="success" />,
                error: <SnackbarIcon icon={infoFill} color="error" />,
                warning: <SnackbarIcon icon={alertTriangleFill} color="warning" />,
                info: <SnackbarIcon icon={alertCircleFill} color="info" />,
            }}
            classes={
                {
                    containerRoot: classes.containerRoot,
                    contentRoot: classes.contentRoot,
                    message: classes.message,
                    action: classes.action,
                    variantInfo: classes.info,
                    variantSuccess: classes.success,
                    variantWarning: classes.warning,
                    variantError: classes.error,
                } as any
            }
        >
            {children}
        </SnackbarProvider>
    );
}
