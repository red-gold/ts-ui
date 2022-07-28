import React, { createContext, useEffect, useReducer } from 'react';
import { Map } from 'immutable';
// utils

import { provider } from 'socialEngine';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { IUserService } from 'core/services/users/IUserService';
import * as userActions from 'redux/actions/userActions';
import * as globalActions from 'redux/actions/globalActions';
import * as authorizeActions from 'redux/actions/authorizeActions';
import { UserModel } from 'models/users/UserModel';
import { useDispatch } from 'redux/store';
import JwtDecode from 'jwt-decode';
import { OAuthType } from 'core/domain/authorize/oauthType';
import { UserClaim } from 'core/domain/authorize/userClaim';
import { isValidToken } from '../utils/jwt';
// ----------------------------------------------------------------------

const authorizeService: IAuthorizeService = provider.get<IAuthorizeService>(SocialProviderTypes.AuthorizeService);
const userService: IUserService = provider.get<IUserService>(SocialProviderTypes.UserService);

const initialState: {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: UserModel | null;
} = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    INITIALIZE: (state: Record<string, any>, action: Record<string, any>) => {
        const { isAuthenticated, user } = action.payload;
        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state: Record<string, any>, action: Record<string, any>) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state: Record<string, any>) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state: Record<string, any>, action: Record<string, any>) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    UPDATE_PROFILE: (state: Record<string, any>, action: Record<string, any>) => {
        const { user } = action.payload;

        return {
            ...state,
            user,
        };
    },
};

const reducer = (state: Record<string, any>, action: Record<string, any>) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
    ...initialState,
    method: 'telar',
    login: (email: string, password: string) => Promise.resolve(),
    verifyRegisterCode: (code: string) => Promise.resolve(),
    fetchRegisterToken: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        recaptchVerifier: string,
    ) => Promise.resolve(),
    loginWithGithub: () => Promise.resolve(),
    loginWithGoogle: () => Promise.resolve(),
    loginWithFaceBook: () => Promise.resolve(),
    loginWithTwitter: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    resetPassword: (email: string) => Promise.resolve(),
    changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise.resolve(),
    updateProfile: (model: userActions.UpdateUserProfilePayload) => Promise.resolve(),
    updateSocialInfo: (model: userActions.UpdateProfileSocialPayload) => Promise.resolve(),
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const dispatchStore = useDispatch();
    const initializeUser = async (claim: UserClaim, user: Record<string, any>) => {
        dispatchStore(authorizeActions.asyncSetUserLogin(claim));
        dispatchStore(userActions.addUserInfo(user.objectId, Map({ ...user, userId: user.objectId })));

        await dispatchStore(globalActions.loadInitialData());
        dispatch({
            type: 'INITIALIZE',
            payload: {
                isAuthenticated: true,
                user,
            },
        });
    };
    const initializeAuth = async () => {
        try {
            const accessToken = authorizeService.getAccessToken();
            if (accessToken && isValidToken(accessToken)) {
                const userAuth: any = JwtDecode(accessToken);
                const { displayName, email } = userAuth.claim;
                const user = await userService.getCurrentUserProfile();
                user.displayName = displayName;
                user.email = email;
                user.id = user.objectId;
                user.about = user.tagLine;
                user.phoneNumber = user.phone;

                await initializeUser(userAuth.claim, user);
            } else {
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[Context] Authenticated ', err);
            dispatch({
                type: 'INITIALIZE',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    };
    useEffect(() => {
        initializeAuth();
    }, []);

    const loginWithGithub = () => {
        return dispatchStore<any>(authorizeActions.dbLoginWithOAuth(OAuthType.GITHUB));
    };

    const login = async (email: string, password: string) => {
        const { user, redirect } = await authorizeService.login(email, password);
        const mappedUser = {
            ...user,
            displayName: user.fullName,
            id: user.objectId,
            email: user.email,
            about: user.tagLine,
            phoneNumber: user.phone,
        };
        await initializeUser(
            {
                uid: user.objectId,
                emailVerified: user.emailVerified,
                providerId: 'telar',
                displayName: user.fullName,
                email: user.email,
                avatar: user.avatar,
                phoneVerified: user.phoneVerified,
            },
            mappedUser,
        );

        dispatch({
            type: 'LOGIN',
            payload: {
                user: mappedUser,
            },
        });
    };

    const fetchRegisterToken = (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        recaptchVerifier: string,
    ) => {
        return dispatchStore(
            authorizeActions.fetchUserRegisterToken({
                fullName: `${firstName} ${lastName}`,
                email,
                password,
                verifier: recaptchVerifier,
            }),
        );
    };

    const verifyRegisterCode = (code: string) => {
        return dispatchStore(authorizeActions.asyncVerifyUserRegisterCode(code));
    };

    const logout = async () => {
        dispatchStore(authorizeActions.asyncLogout());
        dispatch({ type: 'LOGOUT' });
    };

    const changePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
        return dispatchStore(authorizeActions.changePassword(currentPassword, newPassword, confirmPassword));
    };
    const resetPassword = () => {};

    const updateProfile = async (profile: userActions.UpdateUserProfilePayload) => {
        const updatedProfile = await dispatchStore(userActions.updateUserProfile(profile));
        dispatch({
            type: 'UPDATE_PROFILE',
            payload: {
                user: { ...initialState.user, ...updatedProfile },
            },
        });
    };

    const updateSocialInfo = async (info: userActions.UpdateProfileSocialPayload) =>
        dispatchStore(userActions.updateProfileSocial(info));

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'telar',
                loginWithGithub,
                login,
                logout,
                fetchRegisterToken,
                verifyRegisterCode,
                changePassword,
                resetPassword,
                updateProfile,
                updateSocialInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
