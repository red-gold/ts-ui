import { Map } from 'immutable';

export interface ICodeVerificationProps {
    /**
     * Display error
     */
    showError?: (message: string) => any;

    /**
     * Register user
     */
    verifyRegister?: (code: string) => any;

    /**
     * Login
     */
    loginPage?: () => any;

    /**
     * Signup request status
     */
    signupRequest?: Map<string, any>;

    /**
     * Styles
     */
    classes?: any;

    /**
     * Translate to locale string
     */
    t?: (state: any, param?: {}) => any;
}
