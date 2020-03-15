import {Map} from 'immutable'

// - Import action types
import { UserSettingActionType } from 'constants/userSettingActionType'

// - Import domain

// - Import actions

/**
 * Fetch user setting
 */
export const dbFetchUserSetting = () => {
  return { 
    type: UserSettingActionType.DB_FETCH_USER_SETTING,
  }

}

/**
 * Update user setting on server
 */
export const dbUpdateUserSetting = (type: string, setting: object) => {
  return { 
    type: UserSettingActionType.DB_UPDATE_USER_SETTING,
    payload: {type, setting}    
  }

}

/**
 * Set user setting
 */
export const setUserSetting = (userSetting: Map<string, any>) => {
  return { 
    type: UserSettingActionType.SET_USER_SETTING, payload: userSetting
  }

}

/**
 * Update user setting
 */
export const updateUserSetting = (key: string, userSetting: Map<string, any>) => {
  return { 
    type: UserSettingActionType.UPDATE_USER_SETTING, payload: {key, data: userSetting}
  }

}

/**
 * Get user setting
 */
export const getUserSetting = () => {
  return { 
    type: UserSettingActionType.SET_USER_SETTING
  }

}

/**
 * Clear all data
 */
export const clearAllUserSetting = () => {
  return { type: UserSettingActionType.CLEAR_ALL_USER_SETTING }
}
