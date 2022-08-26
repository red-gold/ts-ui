import { AuthorizeActionType } from 'constants/authorizeActionType';
import { Map } from 'immutable';

import { AuthorizeState } from './AuthorizeState';
import { IAuthorizeAction } from './IAuthorizeAction';

// - Import action types
/**
 *  Authorize reducer
 * @param {object} state
 * @param {object} action
 */
// eslint-disable-next-line default-param-last
export const authorizeReducer = (state = Map(new AuthorizeState() as any), action: IAuthorizeAction) => {
    const { payload } = action;
    switch (action.type) {
        case AuthorizeActionType.LOGIN:
            return state.update(() => payload);

        case AuthorizeActionType.LOGOUT:
            return state.set('uid', 0).set('authed', false).set('guest', true).set('isVerifide', false);
        case AuthorizeActionType.SIGNUP:
            return state.set('uid', payload.userId);
        case AuthorizeActionType.SET_USER_REGISTER_TOKEN:
            return state.setIn(['ui', 'registerToken'], payload.token);
        case AuthorizeActionType.SET_LOGIN:
            return state.setIn(['ui', 'isLoggedin'], payload.status);
        case AuthorizeActionType.SET_SIGNUP_STEP:
            return state.setIn(['ui', 'signupStep'], payload.step);
        default:
            return state;
    }
};
