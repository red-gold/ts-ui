import { AuthorizeActionType } from 'constants/authorizeActionType';
import { Map } from 'immutable';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { AuthAPI } from 'api/AuthAPI';
import { SignupStepEnum } from 'models/authorize/signupStepEnum';
import * as authorizeActions from 'redux/actions/authorizeActions';
import * as globalActions from 'redux/actions/globalActions';
import * as serverActions from 'redux/actions/serverActions';
import * as vangActions from 'redux/actions/vangActions';

import { UserClaim } from 'core/domain/authorize/userClaim';
import { AuthorizeState } from 'models/authorize/authorizeState';
import { implementPromiseAction } from '@adobe/redux-saga-promise';
import { ServerRequestStatusType } from '../actions/serverRequestStatusType';
import { authorizeSelector } from '../reducers/authorize/authorizeSelector';
import * as userActions from '../actions/userActions';
import { provider } from '../../socialEngine';

/**
 * Get service providers
 */
const authorizeService: IAuthorizeService = provider.get<IAuthorizeService>(SocialProviderTypes.AuthorizeService);

/**
 * On logout user
 */
function* onLogoutUser() {
    yield put(vangActions.wsDisconnect());
    yield call(authorizeService.logout);
    yield put(authorizeActions.logout());
    yield put(globalActions.clearLoadedData());
}

/**
 * Change password
 */
function* changePassword(action: any) {
    yield call(implementPromiseAction, action, function* () {
        const { currentPassword, newPassword, confirmPassword } = action.payload;
        yield call(authorizeService.changePassword, currentPassword, newPassword, confirmPassword);
    });
}

/**
 * Fetch user register token
 */
function* fetchUserRegisterToken(action: any) {
    yield call(implementPromiseAction, action, function* () {
        const { user } = action.payload;
        const signupRequest = AuthAPI.createSignupRequest(user.email);
        yield put(serverActions.sendRequest(signupRequest));
        try {
            const result: { token: string } = yield call(authorizeService.getUserRegisterToken, user);
            signupRequest.status = ServerRequestStatusType.OK;
            yield put(serverActions.sendRequest(signupRequest));

            yield put(authorizeActions.setUserRegisterToken(result.token));
            yield put(authorizeActions.setSignupStep(SignupStepEnum.VerifyCode));
        } catch (error: any) {
            signupRequest.status = ServerRequestStatusType.Error;
            yield put(serverActions.sendRequest(signupRequest));
            throw error;
        }
    });
}

/**
 * Set logged in user status
 */
function* setLoggedin(action: any) {
    const { userClaim }: { userClaim: UserClaim } = action.payload;
    if (userClaim) {
        yield put(
            authorizeActions.login(
                new AuthorizeState(
                    userClaim.uid,
                    userClaim.emailVerified,
                    userClaim.providerId,
                    userClaim.displayName,
                    userClaim.email,
                    userClaim.avatar,
                    userClaim.phoneVerified,
                ),
            ),
        );
    }
    yield put(authorizeActions.setUserLoginStatus(authorizeService.isLoggedin()));
}

/**
 * Verify user register code
 */
function* verifyUserRegisterCode(action: any) {
    yield call(implementPromiseAction, action, function* () {
        const { code } = action.payload;
        const signupRequest = AuthAPI.createSignupRequest(code);
        yield put(serverActions.sendRequest(signupRequest));
        try {
            const registerToken: string = yield select(authorizeSelector.getUserRegisterToken);
            const response: { token: string } = yield call(
                authorizeService.verifyUserRegisterCode,
                code,
                registerToken,
            );
            signupRequest.status = ServerRequestStatusType.OK;
            yield put(serverActions.sendRequest(signupRequest));
            yield call(authorizeService.loginByToken, response.token);
        } catch (error: any) {
            signupRequest.status = ServerRequestStatusType.Error;
            yield put(serverActions.sendRequest(signupRequest));
            throw error;
        }
    });
}

/**
 * On auth state change
 */
function* onAuthStateChanged() {
    const userAuth = authorizeService.getUserAuth();
    if (userAuth) {
        const { claim } = userAuth;
        const userProfile = {
            avatar: claim.avatar,
            fullName: claim.displayName,
            uid: claim.uid,
            email: claim.email,
        };
        yield put(userActions.addUserInfo(claim.uid, Map({ ...userProfile })));
        yield put(globalActions.loadInitialData());
    } else {
        yield call(onLogoutUser);
    }
    yield put(globalActions.defaultDataEnable());
}

export default function* authorizeSaga() {
    yield all([
        takeLatest(AuthorizeActionType.ASYNC_SET_LOGIN, setLoggedin),
        takeLatest(AuthorizeActionType.ASYNC_LOGOUT, onLogoutUser),
        takeLatest(AuthorizeActionType.SUBSCRIBE_AUTH_STATE_CHANGE, onAuthStateChanged),
        takeLatest(authorizeActions.changePassword, changePassword),
        takeLatest(authorizeActions.fetchUserRegisterToken, fetchUserRegisterToken),
        takeLatest(authorizeActions.asyncVerifyUserRegisterCode, verifyUserRegisterCode),
    ]);
}
