import { Map } from 'immutable';

export interface ILangSettingProps {
    /**
     * User settings
     */
    userSettings: Map<string, any>;

    /**
     * Update user setting
     */
    updateUserSetting: (type: string, setting: object) => any;
}
