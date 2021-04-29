import { AuthorizeActionType } from 'constants/authorizeActionType';
import { LoginUser } from 'core/domain/authorize/loginUser';
import { UserClaim } from 'core/domain/authorize/userClaim';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { AuthAPI } from 'api/AuthAPI';
import { SignupStepEnum } from 'models/authorize/signupStepEnum';
import { provider } from '../../socialEngine';
import * as authorizeActions from 'store/actions/authorizeActions';
import * as globalActions from 'store/actions/globalActions';
import * as serverActions from 'store/actions/serverActions';
import { Map } from 'immutable';
import { ServerRequestStatusType } from '../actions/serverRequestStatusType';
import { authorizeSelector } from '../reducers/authorize/authorizeSelector';
import * as userActions from '../actions/userActions';

/**
 * Get service providers
 */
const authorizeService: IAuthorizeService = provider.get<IAuthorizeService>(SocialProviderTypes.AuthorizeService);

/**
 * On login user
 */
function* onLoginUser(userClaim: UserClaim) {
    yield put(
        authorizeActions.login(
            new LoginUser(
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

/**
 * On logout user
 */
function* onLogoutUser() {
    yield call(authorizeService.logout);
    yield put(authorizeActions.logout());
    yield put(globalActions.clearLoadedData());
}

/**
 * Fetch user register token
 */
function* fetchUserRegisterToken(action: any) {
    const { user, captchaVerifier } = action.payload;
    const signupRequest = AuthAPI.createSignupRequest(user.email);
    yield put(serverActions.sendRequest(signupRequest));
    try {
        const token = yield call(authorizeService.getUserRegisterToken, user, captchaVerifier);
        signupRequest.status = ServerRequestStatusType.OK;
        yield put(serverActions.sendRequest(signupRequest));

        yield put(authorizeActions.setUserRegisterToken(token));
        yield put(authorizeActions.setSignupStep(SignupStepEnum.VerifyCode));
    } catch (error) {
        signupRequest.status = ServerRequestStatusType.Error;
        yield put(serverActions.sendRequest(signupRequest));
        yield put(globalActions.showMessage(error.message));
    }
}

/**
 * Set logged in user status
 */
function* setLoggedin() {
    yield put(authorizeActions.setUserLoginStatus(authorizeService.isLoggedin()));
}

/**
 * Verify user register code
 */
function* verifyUserRegisterCode(action: any) {
    const { code } = action.payload;
    const signupRequest = AuthAPI.createSignupRequest(code);
    yield put(serverActions.sendRequest(signupRequest));
    try {
        const registerToken = yield select(authorizeSelector.getUserRegisterToken);
        const response = yield call(authorizeService.verifyUserRegisterCode, code, registerToken);
        signupRequest.status = ServerRequestStatusType.OK;
        yield put(serverActions.sendRequest(signupRequest));
        yield call(authorizeService.loginByToken, response.token);
    } catch (error) {
        signupRequest.status = ServerRequestStatusType.Error;
        yield put(serverActions.sendRequest(signupRequest));
        yield put(globalActions.showMessage(error.message));
    }
}

/**
 * On auth state change
 */
function* onAuthStateChanged() {
    const userAuth = authorizeService.getUserAuth();
    if (userAuth) {
        const { claim } = userAuth;
        yield call(onLoginUser, claim);
        const userProfile = Map({
            avatar: claim.avatar,
            fullName: claim.displayName,
            uid: claim.uid,
            email: claim.email,
        });
        yield put(userActions.addUserInfo(claim.uid, userProfile));
        yield put(globalActions.loadInitialData());
    } else {
        yield call(onLogoutUser);
    }
    yield put(globalActions.defaultDataEnable());
}

export default function* authorizeSaga() {
    yield all([
        takeLatest(AuthorizeActionType.ASYNC_SET_LOGIN, setLoggedin),
        takeLatest(AuthorizeActionType.SUBSCRIBE_AUTH_STATE_CHANGE, onAuthStateChanged),
        takeLatest(AuthorizeActionType.ASYNC_FETCH_USER_REGISTER_TOKEN, fetchUserRegisterToken),
        takeLatest(AuthorizeActionType.ASYNC_VERITY_USER_REGISTER_CODE, verifyUserRegisterCode),
    ]);
}
