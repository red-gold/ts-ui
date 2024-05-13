import { SnackbarProvider } from 'notistack';
import infoFill from '@mui/icons-material/InfoRounded';
import alertCircleFill from '@mui/icons-material/ErrorRounded';
import alertTriangleFill from '@mui/icons-material/ReportProblemRounded';
import checkmarkCircle2Fill from '@mui/icons-material/CheckCircleOutlineRounded';
// material
import { makeStyles, createStyles } from '@mui/styles';
import { alpha, Theme } from '@mui/material/styles';
import { Box, SvgIcon } from '@mui/material';
import React from 'react';

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
