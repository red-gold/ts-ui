import {Map} from 'immutable'

export interface INotificationSettingProps {
  /**
   * Styles
   */
  classes?: any

  /**
   * Translate to locale string
   */
  t?: (state: any, param?: {}) => any

  /**
   * Notification setting
   */
  notificationSetting: Map<string, any>

  /**
   * Update user setting
   */
  updateUserSetting?: (type: string, setting: object) => any

}
