import React from 'react';
// material
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
// hooks
import useLocales from '../hooks/useLocales';

// ----------------------------------------------------------------------

export interface ThemeLocalizationProps {
    children?: React.ReactNode;
}

export default function ThemeLocalization({ children }: ThemeLocalizationProps) {
    const defaultTheme = useTheme();
    const { currentLang } = useLocales();

    const theme = createTheme(defaultTheme, currentLang?.systemValue);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
