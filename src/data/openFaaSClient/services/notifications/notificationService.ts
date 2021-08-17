import { SocialError } from 'core/domain/common/socialError';
import { INotificationService } from 'core/services/notifications/INotificationService';
import { injectable, inject } from 'inversify';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { IHttpService } from 'core/services/webAPI/IHttpService';
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

    public getNotifications = async () => {
        try {
            const result = await this._httpService.get(`notifications`);

            let parsedData: Record<string, Record<string, any>> = {};
            if (result && result.length && result.length > 0) {
                result.forEach((notification: any) => {
                    parsedData = { ...parsedData, [notification.objectId]: notification };
                });
            }
            return parsedData;
        } catch (error) {
            throw new SocialError(error.code, error.message);
        }
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

    public setSeenAllNotifications = async () => {
        try {
            await this._httpService.put(`notifications/seenall`);
        } catch (error) {
            throw new SocialError(error.code, error.message);
        }
    };
}
