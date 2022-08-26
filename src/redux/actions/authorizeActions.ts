import { Map } from 'immutable';
import { AuthorizeActionType } from 'constants/authorizeActionType';
import { OAuthType } from 'core/domain/authorize/oauthType';
import { LoginUser } from 'core/domain/authorize/loginUser';
import { SocialError } from 'core/domain/common/socialError';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { SocialProviderTypes } from 'core/socialProviderTypes';

import { UserRegisterModel } from 'models/users/userRegisterModel';
import { SignupStepEnum } from 'models/authorize/signupStepEnum';
import * as globalActions from 'redux/actions/globalActions';
import config from 'config';
import { UserClaim } from 'core/domain/authorize/userClaim';
import { AuthorizeState } from 'models/authorize/authorizeState';
import { createPromiseAction } from '@adobe/redux-saga-promise';
import { provider } from '../../socialEngine';

/**
 * Loing user
 */
export const login = (user: AuthorizeState) => {
    return {
        type: AuthorizeActionType.LOGIN,
        payload: Map({ ...user }),
    };
};

/**
 * Change password
 */
export const changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
) => any = createPromiseAction(
    AuthorizeActionType.AUTHRORIZE_CHANGE_PASSWORD,
    (currentPassword: string, newPassword: string, confirmPassword: string) => ({
        currentPassword,
        newPassword,
        confirmPassword,
    }),
);

/**
 * Fetch user registeration token
 */
export const fetchUserRegisterToken: (user: UserRegisterModel) => any = createPromiseAction(
    AuthorizeActionType.ASYNC_FETCH_USER_REGISTER_TOKEN,
    (user: UserRegisterModel) => ({
        user,
    }),
);

/**
 * Set user registeration token
 */
export const setUserRegisterToken = (token: string) => {
    return {
        type: AuthorizeActionType.SET_USER_REGISTER_TOKEN,
        payload: { token },
    };
};

/**
 * Async set user login status
 */
export const asyncSetUserLogin = (userClaim?: UserClaim) => {
    return {
        type: AuthorizeActionType.ASYNC_SET_LOGIN,
        payload: { userClaim },
    };
};

/**
 * Set user login status
 */
export const setUserLoginStatus = (status: boolean) => {
    return {
        type: AuthorizeActionType.SET_LOGIN,
        payload: { status },
    };
};

/**
 * Async set user login status
 */
export const asyncSetUserLoginStatus = () => {
    return {
        type: AuthorizeActionType.ASYNC_SET_LOGIN,
        payload: {},
    };
};

/**
 * Verify user registeration code
 */
export const asyncVerifyUserRegisterCode: (
    code: string,
) => any = createPromiseAction(AuthorizeActionType.ASYNC_VERITY_USER_REGISTER_CODE, (code: string) => ({ code }));

/**
 * Logout user
 */
export const logout = () => {
    return { type: AuthorizeActionType.LOGOUT };
};

/**
 * Async logout user
 */
export const asyncLogout = () => {
    return { type: AuthorizeActionType.ASYNC_LOGOUT };
};

/**
 * User registeration call
 * @param user  for registering
 */
export const signup = (user: UserRegisterModel) => {
    return {
        type: AuthorizeActionType.SIGNUP,
        payload: { ...user },
    };
};

/**
 * Update user's password
 */
export const updatePassword = () => {
    return { type: AuthorizeActionType.UPDATE_PASSWORD };
};

/**
 * Set signup component step
 */
export const setSignupStep = (step: SignupStepEnum) => {
    return {
        type: AuthorizeActionType.SET_SIGNUP_STEP,
        payload: { step },
    };
};

/**
 * Subscribe authorize state change
 */
export const subcribeAuthorizeStateChange = () => {
    return { type: AuthorizeActionType.SUBSCRIBE_AUTH_STATE_CHANGE };
};

/**
 * Get service providers
 */
const authorizeService: IAuthorizeService = provider.get<IAuthorizeService>(SocialProviderTypes.AuthorizeService);

/* _____________ CRUD DB _____________ */

/**
 * Log out user in server
 */
export const dbLogout = () => {
    return (dispatch: any) => {
        authorizeService.logout();
        localStorage.removeItem('red-gold.scure.token');
        dispatch(logout());
    };
};

/**
 * Send email verification
 */
export const dbSendEmailVerfication = (value: any) => {
    return (dispatch: any) => {
        dispatch(globalActions.showNotificationRequest());

        return authorizeService
            .sendEmailVerification(value)
            .then(() => {
                // Send email verification successful.
                dispatch(globalActions.showNotificationSuccess());
                // dispatch(push('/'));
            })
            .catch((error: SocialError) => {
                // An error happened.
                dispatch(globalActions.showMessage(error.code));
            });
    };
};

/**
 * Change user's password
 * @param {string} newPassword
 */
export const dbUpdatePassword = (newPassword: string, confirmPassword: string) => {
    return (dispatch: any) => {
        dispatch(globalActions.showNotificationRequest());

        return authorizeService
            .updatePassword(newPassword, confirmPassword)
            .then(() => {
                // Update successful.
                dispatch(globalActions.showNotificationSuccess());
                dispatch(updatePassword());
                dispatch(dbLogout());
            })
            .catch((error: SocialError) => {
                // An error happened.
                switch (error.code) {
                    case 'auth/requires-recent-login':
                        dispatch(globalActions.showMessage(error.code));
                        dispatch(dbLogout());
                        break;
                    default:
                }
            });
    };
};

/**
 * Reset user's password
 * @param {string} newPassword
 */
export const dbResetPassword = (email: string) => {
    return (dispatch: any) => {
        dispatch(globalActions.showNotificationRequest());

        return authorizeService
            .resetPassword(email)
            .then(() => {
                // Reset password successful.
                dispatch(globalActions.showNotificationSuccess());
                // dispatch(push('/login'));
            })
            .catch((error: SocialError) => {
                // An error happened.
                dispatch(globalActions.showMessage(error.code));
            });
    };
};

/**
 * Login user with OAuth
 */
export const dbLoginWithOAuth = (type: OAuthType) => {
    return (dispatch: any) => {
        return authorizeService.loginWithOAuth(type).then((result: LoginUser) => {
            // Send email verification successful.
            // dispatch(login(result));
            // dispatch(push('/'));
        });
    };
};
