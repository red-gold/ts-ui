import {Map} from 'immutable'
import { UserRegisterModel } from 'models/users'
export interface ISignupComponentProps {

  /**
   * Display error
   */
  showError?: (message: string) => any

    /**
     * Register user
     */
  register?: (data: UserRegisterModel, captchaVerifier: string) => any

    /**
     * Login
     */
  loginPage?: () => any

  /**
   * Signup request status
   */
  signupRequest?: Map<string, any>

  /**
   * Styles
   */
  classes?: any

  /**
   * Translate to locale string
   */
  t?: (state: any, param?: {}) => any
}
