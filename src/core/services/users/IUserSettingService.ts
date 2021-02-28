import { UserSetting } from 'core/domain/users/userSetting';
import { Map } from 'immutable';
/**
 * User setting interface
 */
export interface IUserSettingService {
    updateUserSetting: (userSetting: UserSetting) => Promise<void>;
    getUserSettings: () => Promise<Map<string, Map<string, any>>>;
}
