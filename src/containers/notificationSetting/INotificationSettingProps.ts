import { Map } from 'immutable';

export interface INotificationSettingProps {
    /**
     * Styles
     */
    classes?: any;

    /**
     * Notification setting
     */
    userSettings: Map<string, any>;

    /**
     * Update user setting
     */
    updateUserSetting: (type: string, setting: object) => any;
}
