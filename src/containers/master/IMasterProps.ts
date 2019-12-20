import {Map} from 'immutable'
import { UserClaim } from 'core/domain/authorize/userClaim'
export interface IMasterProps {
    /**
     * Close gloal message
     */
  closeMessage: Function
    /**
     * Show progress bar information
     */
  progress: any
    /**
     * Login a user
     */
  login: (user: UserClaim) => any
    /**
     * Global state
     */
  global: any
    /**
     * Set flag {false} which user data has not loaded
     */
  defaultDataDisable: Function
    /**
     * Logout current user
     */
  logout: Function
    /**
     * Clear user date from store
     */
  clearData: Function
    /**
     * Prepare default data for a guest user
     */
  loadDataGuest: Function
    /**
     * Set flag {true} which all user data has loaded
     */
  defaultDataEnable: Function
    /**
     * Load user data into store
     */
  loadData: Function
    /**
     * If all data from all entities are loaded {true} if not {false}
     */
  loaded: Boolean
    /**
     * If current user is guest {true} if no
     */
  guest: Boolean
    /**
     * If current user is authed {true} if not {false}
     */
  authed: Boolean
    /**
     * Authed user identifier
     */
  uid: string

  callingUsers?: Map<string, any>
  
  chatRequests?: Map<string, any>
  users?: Map<string, any>

  cancelCalling?: (userId: string) =>  any

  cancelChatRequest?: (userId: string) => any

  acceptChat?: (userId: string) => any

  isLoggedin: boolean

  /**
   * Show master loading
   */
  showMasterLoading?: () => any

  /**
   * Hide master loading
   */
  hideMasterLoading?: () => any

  /**
   * Whether send feesback box is visible
   */
  sendFeedbackStatus?: boolean

  /**
   * Hide global message
   */
  hideMessage?: () => any

  /**
   * Subscibe auth state change
   */
  subscribeAuthStateChange?: () => any

}
