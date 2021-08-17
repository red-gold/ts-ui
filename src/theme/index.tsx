import React, { useMemo } from 'react';
// material
import { CssBaseline } from '@material-ui/core';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@material-ui/core/styles';
// hooks
import useSettings from '../hooks/useSettings';
//
import shape from './shape';
import palette from './palette';
import typography from './typography';
import GlobalStyles from './globalStyles';
import shadows from './shadows';
import { Shadows } from '@material-ui/core/styles/shadows';

// ----------------------------------------------------------------------

export interface ThemeConfigProps {
    children: React.ReactNode;
}

export default function ThemeConfig({ children }: ThemeConfigProps) {
    const { themeMode, themeDirection } = useSettings();
    const isLight = themeMode === 'light';

    const themeOptions: any = useMemo(
        () => ({
            palette: isLight ? { ...palette.light, mode: 'light' } : { ...palette.dark, mode: 'dark' },
            shape,
            typography,
            direction: themeDirection,
            shadows: (isLight ? shadows.light : shadows.dark) as Shadows,
        }),
        [isLight, themeDirection],
    );

    const theme = createTheme(themeOptions);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
