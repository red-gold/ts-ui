import React from 'react';
import { useRoutes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { socialTheme } from 'config/socialTheme';
import routes from 'routes/index';
import { useSelector } from 'react-redux';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';

const theme = createTheme(socialTheme);

const App = () => {
    const isLoggedIn = useSelector(authorizeSelector.selectUserAuthStatus());
    const routing = useRoutes(routes(isLoggedIn));

    return <ThemeProvider theme={theme}>{routing}</ThemeProvider>;
};

export default App;
