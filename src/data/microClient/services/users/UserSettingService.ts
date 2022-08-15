import { SocialError } from 'core/domain/common/socialError';
import { IUserSettingService } from 'core/services/users/IUserSettingService';
import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { UserSetting } from 'core/domain/users/userSetting';
import { Map } from 'immutable';

/**
 * Firbase userSetting service
 */
@injectable()
export class UserSettingService implements IUserSettingService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    public updateUserSetting = async (userSetting: UserSetting) => {
        try {
            await this._httpService.put('setting', userSetting);
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getUserSettings = async () => {
        try {
            const result = await this._httpService.get(`setting`);
            let parsedData: Map<string, Map<string, any>> = Map({});
            Object.keys(result).forEach((key: any) => {
                const userSetting = result[key] as Array<any>;
                let mappedSetting = Map({});
                userSetting.forEach((setting) => {
                    mappedSetting = mappedSetting.set(setting.name, Map(setting));
                });
                parsedData = parsedData.set(key, mappedSetting);
            });
            return parsedData;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };
}
