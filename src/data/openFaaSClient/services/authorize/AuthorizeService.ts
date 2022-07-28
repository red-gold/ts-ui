import { OAuthType } from 'core/domain/authorize/oauthType';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { inject, injectable } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { AuthAPI } from 'api/AuthAPI';
import jwtDecode from 'jwt-decode';
import { log } from 'utils/log';
import { SocialError } from 'core/domain/common/socialError';
import config from 'config/index';
import { UserRegisterModel } from 'models/users/userRegisterModel';

/**
 * Authorize service
 */
@injectable()
export class AuthorizeService implements IAuthorizeService {
    @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService;
    // eslint-disable-next-line
    constructor() {}

    /**
     * Login the user
     */
    public login = async (email: string, password: string) => {
        try {
            const form = new FormData();
            form.append('username', email);
            form.append('password', password);
            form.append('responseType', 'spa');

            const headers = { 'Content-Type': 'multipart/form-data' };
            const result = await this._httpService.post('auth/login', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Whether user is loged in or not
     */
    public isLoggedin = () => {
        return this.getUserAuthCookie() !== null;
    };

    /**
     * Get user auth cookie
     */
    public getUserAuthCookie = () => {
        const payload = AuthAPI.readCookie('pa');
        return {
            payload,
        };
    };

    /**
     * Get user auth
     */
    public getUserAuth = () => {
        const cookie = this.getUserAuthCookie();
        if (cookie) {
            const token = `.${cookie.payload}.`;
            const decodedToken = jwtDecode(token);

            if (this.isJwtExpired(decodedToken)) {
                log.error('[Authrize Service] Token is expired ', decodedToken);
                return null;
            }

            return decodedToken;
        }
        return null;
    };

    /**
     * Get access token
     */
    public getAccessToken = () => {
        const cookie = this.getUserAuthCookie();
        if (cookie.payload === null) {
            throw new Error('Cookie payload is null!');
        }
        if (cookie) {
            return `.${cookie.payload}.`;
        }
        return null;
    };

    /**
     * Get user from token
     */
    public getUserFromToken = (token: string) => {
        return jwtDecode(token);
    };

    /**
     *
     * @param decodedToken Decoded JWT token
     * @returns Is token expired
     */
    public isJwtExpired = (decodedToken: any) => {
        let isJwtExpired = false;
        const { exp } = decodedToken;
        const currentTime = new Date().getTime() / 1000;

        if (currentTime > exp) isJwtExpired = true;

        return isJwtExpired;
    };

    /**
     * Login user by token
     */
    public async loginByToken() {
        return ' Not implemented!' as any;
    }

    /**
     * Logs out the user
     */
    public logout = () => {
        AuthAPI.eraseCookie('he');
        AuthAPI.eraseCookie('pa');
        AuthAPI.eraseCookie('si');
    };

    /**
     * Register a user
     */
    public getUserRegisterToken = async (user: UserRegisterModel) => {
        try {
            const form = new FormData();
            form.append('fullName', user.fullName);
            form.append('email', user.email);
            form.append('newPassword', user.password);
            form.append('verifyType', 'emv');
            form.append('g-recaptcha-response', user.verifier);
            form.append('responseType', 'spa');

            const headers = { 'Content-Type': 'multipart/form-data' };
            const result = await this._httpService.post('auth/signup', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Verify user register code
     */
    public verifyUserRegisterCode = async (code: string, registerToken: string) => {
        try {
            const form = new FormData();
            form.append('code', code);
            form.append('verificaitonSecret', registerToken);
            form.append('responseType', 'spa');

            const headers = { 'Content-Type': 'multipart/form-data' };
            const result = await this._httpService.post('auth/signup/verify', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Change password
     */
    public changePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
        try {
            return this._httpService.put('auth/password/change', { currentPassword, newPassword, confirmPassword });
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Register a user
     */
    public registerUser = async () => {
        return ' Not implemented!' as any;
    };

    /**
     * Whether user is login or not
     */
    public isUserUserVerified() {
        return ' Not implemented!' as any;
    }

    /**
     * Update user password
     */
    public updatePassword: (newPassword: string, confirmPassword: string) => Promise<void> = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Get id token
     */
    public getUserClaim = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Reset user password
     */
    public resetPassword: (email: string) => Promise<void> = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Send verfication email to user email
     */
    public sendEmailVerification = async () => {
        return ' Not implemented!' as any;
    };

    public loginWithOAuth: (type: OAuthType) => Promise<any> = () => {
        const resource = `${window.location.href  }`;
        window.location.href = `${config.gateway.github_oauth_url  }?r=${resource}`;
        return Promise.resolve(null);
    };

    /**
     * Send sms verfication
     */
    public sendSmsVerification = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Send email verfication
     */
    public sendResetPasswordVerification = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Confirm phone code verfication
     */
    public confirmVerificationPhone = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Confirm email code verfication
     */
    public confirmVerificationEmail = async () => {
        return ' Not implemented!' as any;
    };

    /**
     * Confirm reset password code
     */
    public confirmResetPassword = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Store user information
     */
    private storeUserInformation = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Store user provider information
     */
    private storeUserProviderData = () => {
        return ' Not implemented!' as any;
    };
}
