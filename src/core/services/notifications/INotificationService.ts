import { Notification } from 'core/domain/notifications/notification';

/**
 * Notification service interface
 *
 * @export
 * @interface INotificationService
 */
export interface INotificationService {
    addNotification: (notification: Notification) => Promise<void>;
    getNotifications: () => any;
    deleteNotification: (notificationId: string, userId: string) => Promise<void>;
    setSeenNotification: (notificationId: string) => Promise<void>;
    setSeenAllNotifications: () => Promise<any>;
}
