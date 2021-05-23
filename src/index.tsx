// Import external components refrence
import 'reflect-metadata';
import './socialEngine';
import './styles/app.css';
import 'locales/i18n';
import 'typeface-roboto';

import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import * as authorizeActions from 'store/actions/authorizeActions';
import * as userSettingActions from 'store/actions/userSettingActions';
import * as globalActions from 'store/actions/globalActions';
import configureStore from 'store/configureStore';
import rootSaga from 'store/sagas/rootSaga';

import i18n from './locales/i18n';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import App from 'App';

// import 'moment/locale/es'

/**
 * Execute startup functions
 */
configureStore.runSaga(rootSaga);
// Set user current language from cookie
configureStore.store.dispatch(userSettingActions.SetCurrentLangFromCookie());

// Set default data
// tslint:disable-next-line:no-empty
configureStore.store.subscribe(() => {});
configureStore.store.dispatch(authorizeActions.asyncSetUserLoginStatus());
// - Initialize languages
configureStore.store.dispatch(authorizeActions.subcribeAuthorizeStateChange());
configureStore.store.dispatch(globalActions.initLocale());
// Needed for onClick
// http://stackoverflow.com/a/34015469/988941
try {
    injectTapEventPlugin();
} catch (e) {}

ReactDOM.render(
    <Provider store={configureStore.store}>
        <I18nextProvider i18n={i18n}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </I18nextProvider>
    </Provider>,
    document.getElementById('app') as HTMLElement,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
