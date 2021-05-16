import { createBrowserHistory } from 'history';
import { fromJS } from 'immutable';
import jwtDecode from 'jwt-decode';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware, { END } from 'redux-saga';
import thunk from 'redux-thunk';
import { rootReducer } from 'store/reducers/rootReducer';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const token = localStorage.getItem('red-gold.scure.token');
let uid = '';
let authed = false;
if (token) {
    uid = (jwtDecode(token) as any)['user_id'];
    authed = true;
}
// - initial state
const initialState = {
    authorize: {
        authed: authed,
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
    composeEnhancers(applyMiddleware(thunk, sagaMiddleware)),
);

export default { store, runSaga: sagaMiddleware.run, close: () => store.dispatch(END), history };
