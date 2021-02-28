import { LoginUser } from 'core/domain/authorize/loginUser';
import { OAuthType } from 'core/domain/authorize/oauthType';
import { UserClaim } from 'core/domain/authorize/userClaim';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { inject, injectable } from 'inversify';
import { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { AuthAPI } from 'api/AuthAPI';
import jwtDecode from 'jwt-decode';
import { SocialError } from 'core/domain/common/socialError';

// - Import react components
/**
 * Firbase authorize service
 */
@injectable()
export class AuthorizeService implements IAuthorizeService {
    @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService;
    // eslint-disable-next-line
    constructor() {}
    /**
     * Login the user
     */
    public login = () => {
        return ' Not implemented!' as any;
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
        const authCookie = AuthAPI.readCookie('pa');
        if (authCookie) {
            return authCookie;
        }
        return null;
    };

    /**
     * Get user auth
     */
    public getUserAuth = () => {
        const userAuthCookie = this.getUserAuthCookie();
        if (userAuthCookie) {
            return jwtDecode(`_.${userAuthCookie}._`);
        }
        return null;
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
        AuthAPI.eraseCookie('pa');
    };

    /**
     * Register a user
     */
    public getUserRegisterToken = async () => {
        return ' Not implemented!' as any;
    };

    /**
     * Get access token
     */
    public getAccessToken = async () => {
        try {
            const token = await this._httpService.get(`actions/room/access-key`);
            return token.accessKey;
        } catch (error) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Verify user register code
     */
    public verifyUserRegisterCode = async () => {
        return ' Not implemented!' as any;
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
     * On user authorization changed event
     */
    public onAuthStateChanged: (callBack: (user: UserClaim) => void) => any = () => {
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

    public loginWithOAuth: (type: OAuthType) => Promise<LoginUser> = () => {
        return ' Not implemented!' as any;
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
