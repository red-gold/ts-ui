import PropTypes from 'prop-types';
import React, { createContext } from 'react';
// hooks
import useLocalStorage from '../hooks/useLocalStorage';
// theme
import palette from '../theme/palette';

// ----------------------------------------------------------------------

const PRIMARY_COLOR = [
    // DEFAULT
    {
        name: 'default',
        ...palette.light.primary,
    },
    // PURPLE
    {
        name: 'purple',
        lighter: '#EBD6FD',
        light: '#B985F4',
        main: '#7635dc',
        dark: '#431A9E',
        darker: '#200A69',
        contrastText: '#fff',
    },
    // CYAN
    {
        name: 'cyan',
        lighter: '#D1FFFC',
        light: '#76F2FF',
        main: '#1CCAFF',
        dark: '#0E77B7',
        darker: '#053D7A',
        contrastText: palette.light.grey[800],
    },
    // BLUE
    {
        name: 'blue',
        lighter: '#CCDFFF',
        light: '#6697FF',
        main: '#0045FF',
        dark: '#0027B7',
        darker: '#00137A',
        contrastText: '#fff',
    },
    // ORANGE
    {
        name: 'orange',
        lighter: '#FEF4D4',
        light: '#FED680',
        main: '#fda92d',
        dark: '#B66816',
        darker: '#793908',
        contrastText: palette.light.grey[800],
    },
    // RED
    {
        name: 'red',
        lighter: '#FFE3D5',
        light: '#FFC1AC',
        main: '#FF3030',
        dark: '#B71833',
        darker: '#7A0930',
        contrastText: '#fff',
    },
];

SetColor.propTypes = {
    themeColor: PropTypes.oneOf(['default', 'purple', 'cyan', 'blue', 'orange', 'red']),
};

function SetColor(themeColor: string) {
    let color;
    const DEFAULT = PRIMARY_COLOR[0];
    const PURPLE = PRIMARY_COLOR[1];
    const CYAN = PRIMARY_COLOR[2];
    const BLUE = PRIMARY_COLOR[3];
    const ORANGE = PRIMARY_COLOR[4];
    const RED = PRIMARY_COLOR[5];

    switch (themeColor) {
        case 'purple':
            color = PURPLE;
            break;
        case 'cyan':
            color = CYAN;
            break;
        case 'blue':
            color = BLUE;
            break;
        case 'orange':
            color = ORANGE;
            break;
        case 'red':
            color = RED;
            break;
        default:
            color = DEFAULT;
    }
    return color;
}

const initialState: {
    themeMode: 'light' | 'dark';
    themeDirection: 'ltr' | 'rtl';
    themeColor: 'default' | 'purple' | 'cyan' | 'blue' | 'orange' | 'red';
    themeStretch: boolean;
    onChangeMode: any;
    onChangeDirection: any;
    onChangeColor: any;
    onToggleStretch: () => void;
    setColor: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
        contrastText: string;
        name: string;
    };
    colorOption: Array<{ name: string; value: string }>;
} = {
    themeMode: 'light',
    themeDirection: 'ltr',
    themeColor: 'default',
    themeStretch: false,
    onChangeMode: () => {},
    onChangeDirection: () => {},
    onChangeColor: () => {},
    onToggleStretch: () => {},
    setColor: PRIMARY_COLOR[0],
    colorOption: [],
};

const SettingsContext = createContext(initialState);

export interface SettingsProviderProps {
    children?: React.ReactNode;
}

function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useLocalStorage('settings', {
        themeMode: 'light',
        themeDirection: 'ltr',
        themeColor: 'default',
        themeStretch: false,
    });

    const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            themeMode: event.target.value,
        });
    };

    const onChangeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            themeDirection: event.target.value,
        });
    };

    const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            themeColor: event.target.value,
        });
    };

    const onToggleStretch = () => {
        setSettings({
            ...settings,
            themeStretch: !settings.themeStretch,
        });
    };

    return (
        <SettingsContext.Provider
            value={{
                ...settings,
                // Mode
                onChangeMode,
                // Direction
                onChangeDirection,
                // Color
                onChangeColor,
                setColor: SetColor(settings.themeColor),
                colorOption: PRIMARY_COLOR.map((color) => ({
                    name: color.name,
                    value: color.main,
                })),
                // Stretch
                onToggleStretch,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export { SettingsProvider, SettingsContext };
