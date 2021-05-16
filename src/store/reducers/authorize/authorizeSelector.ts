import { Map } from 'immutable';
import { createSelector } from 'reselect';
import { userGetters } from '../users/userGetters';

const getCurrentUser = (state: Map<any, string>) => {
    const uid = state.getIn(['authorize', 'uid']);
    const email = state.getIn(['authorize', 'email']);
    return userGetters.getUserProfileById(state, { userId: uid }).set('email', email);
};

const getAuthedUser = (state: Map<any, string>) => {
    return state.getIn(['authorize']) as Map<string, any>;
};

const getSignupStep = (state: Map<any, string>) => {
    return state.getIn(['authorize', 'ui', 'signupStep'], 0);
};

const getUserRegisterToken = (state: Map<any, string>) => {
    return state.getIn(['authorize', 'ui', 'registerToken'], '');
};

const getUserAuthStatus = (state: Map<any, string>): boolean => {
    return state.getIn(['authorize', 'authed'], false);
};

// Selectros //

const selectCurrentUser = () => {
    return createSelector([getCurrentUser], (currentUser) => currentUser);
};

const selectAuthedtUser = () => {
    return createSelector([getAuthedUser], (authedUser) => authedUser);
};

const selectSignupStep = () => {
    return createSelector([getSignupStep], (step) => step);
};

const selectUserRegisterToken = () => {
    return createSelector([getUserRegisterToken], (token) => token);
};

const selectUserAuthStatus = () => {
    return createSelector([getUserAuthStatus], (status) => status);
};

export const authorizeSelector = {
    getCurrentUser,
    getAuthedUser,
    getSignupStep,
    getUserRegisterToken,
    getUserAuthStatus,
    selectCurrentUser,
    selectSignupStep,
    selectUserRegisterToken,
    selectAuthedtUser,
    selectUserAuthStatus,
};
