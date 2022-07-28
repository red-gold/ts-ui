import { createBrowserHistory } from 'history';
import { fromJS } from 'immutable';
import jwtDecode from 'jwt-decode';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { END } from 'redux-saga';
import thunk from 'redux-thunk';
import { rootReducer } from 'redux/reducers/rootReducer';
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { promiseMiddleware } from '@adobe/redux-saga-promise';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const token = localStorage.getItem('red-gold.scure.token');
let uid = '';
let authed = false;
if (token) {
    uid = (jwtDecode(token) as any).user_id;
    authed = true;
}
// - initial state
const initialState = {
    authorize: {
        authed,
        guest: !authed,
        uid,
    },
};

// - Config and create store of redux
const composeEnhancers = composeWithDevTools({
    // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
});
const store: Store<any> = createStore(
    rootReducer(),
    fromJS(initialState),
    composeEnhancers(applyMiddleware(thunk, promiseMiddleware, sagaMiddleware)),
);
const useSelector = useReduxSelector;

const useDispatch = () => useReduxDispatch();

const runSaga = sagaMiddleware.run;
const close = () => store.dispatch(END);
export { store, useSelector, useDispatch, runSaga, close };
