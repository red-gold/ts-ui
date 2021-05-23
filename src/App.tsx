import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { socialTheme } from 'config/socialTheme';
import routes from 'routes/index';
import { useSelector } from 'react-redux';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { useNavigate, useRoutes } from 'react-router-dom';
import useBus from 'use-bus';

const theme = createTheme(socialTheme);

const App = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector(authorizeSelector.selectUserAuthStatus());
    const routing = useRoutes(routes(isLoggedIn));
    useBus('@@ui/navigate', (action) => navigate(action.payload.url), []);

    return <ThemeProvider theme={theme}>{routing}</ThemeProvider>;
};

export default App;
