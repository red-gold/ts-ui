import React from 'react';
import { useNavigate } from 'react-router-dom';
import useBus from 'use-bus';
import ThemeConfig from 'theme';
import ThemeLocalization from 'components/ThemeLocalization';
import Router from 'routes/index';
import NotistackProvider from 'components/NotistackProvider';
import LoadingScreen from 'components/LoadingScreen';
import useAuth from 'hooks/useAuth';

const App = () => {
    const navigate = useNavigate();
    useBus('@@ui/navigate', (action) => navigate(action.payload.url), []);
    const { isInitialized } = useAuth();
    return (
        <ThemeConfig>
            <ThemeLocalization>
                <NotistackProvider>{isInitialized ? <Router /> : <LoadingScreen />}</NotistackProvider>
            </ThemeLocalization>
        </ThemeConfig>
    );
};

export default App;
