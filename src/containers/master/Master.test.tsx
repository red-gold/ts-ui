import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'reflect-metadata';
import 'typeface-roboto';
// import 'moment/locale/es'
import 'locales/i18n';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from 'locales/i18n';

// - Actions
import * as globalActions from 'redux/actions/globalActions';

// - Import app components
// import { App } from 'components/AWS'
// App css
import 'styles/app.css';

/**
 * Execute startup functions
 */
import 'socialEngine';
import rootSaga from 'redux/sagas/rootSaga';
import * as authorizeActions from 'redux/actions/authorizeActions';


describe('renders without crashing', () => {
    test('Master Componet', () => {
    
    });
});
