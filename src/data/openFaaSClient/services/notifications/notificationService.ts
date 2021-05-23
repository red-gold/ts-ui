import { SocialError } from 'core/domain/common/socialError';
import { INotificationService } from 'core/services/notifications/INotificationService';
import { injectable, inject } from 'inversify';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { IHttpService } from 'core/services/webAPI/IHttpService';
import { Map } from 'immutable';

/**
 * Firbase notification service
 *
 * @export
 */
@injectable()
export class NotificationService implements INotificationService {
    @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService;
    public addNotification = () => {
        return ' Not implemented!' as any;
    };

    public getNotifications = (
        userId: string,
        callback: (resultNotifications: Map<string, Map<string, any>>) => void,
    ) => {
        this._httpService
            .get(`notifications?page=1`)
            .then((result) => {
                let parsedData: Map<string, Map<string, any>> = Map({});
                if (result && result.length && result.length > 0) {
                    result.forEach((notification: any) => {
                        parsedData = parsedData.set(notification.objectId, Map(notification));
                    });
                    callback(parsedData);
                }
            })
            .catch((error) => {
                throw new SocialError(error.code, error.message);
            });
    };

    public deleteNotification = async (notificationId: string) => {
        try {
            await this._httpService.delete(`notifications/id/${notificationId}`);
        } catch (error) {
            throw new SocialError(error.code, error.message);
        }
    };

    public setSeenNotification = async (notificationId: string) => {
        try {
            await this._httpService.put(`notifications/seen/${notificationId}`);
        } catch (error) {
            throw new SocialError(error.code, error.message);
        }
    };
}
