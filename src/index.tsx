// Import external components refrence
import 'reflect-metadata';
import './socialEngine';
import './styles/app.css';
import i18n from 'locales/i18n';
import 'typeface-roboto';

import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import * as authorizeActions from 'redux/actions/authorizeActions';
import * as userSettingActions from 'redux/actions/userSettingActions';
import * as globalActions from 'redux/actions/globalActions';
import { store, runSaga } from 'redux/store';
import rootSaga from 'redux/sagas/rootSaga';

import App from 'App';
import { AuthProvider } from 'contexts/JWTContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// import 'moment/locale/es'

/**
 * Execute startup functions
 */
runSaga(rootSaga);
// Set user current language from cookie
store.dispatch(userSettingActions.SetCurrentLangFromCookie());

// Set default data
// tslint:disable-next-line:no-empty
store.subscribe(() => {});
store.dispatch(authorizeActions.asyncSetUserLogin());
// - Initialize languages
store.dispatch(globalActions.initLocale());
// Needed for onClick
// http://stackoverflow.com/a/34015469/988941
try {
    injectTapEventPlugin();
} catch (e) {}
const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </I18nextProvider>
    </Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
