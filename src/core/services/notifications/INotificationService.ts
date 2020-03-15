import {Map} from 'immutable'

import { Notification } from 'core/domain/notifications'

/**
 * Notification service interface
 *
 * @export
 * @interface INotificationService
 */
export interface INotificationService {
  addNotification: (notification: Notification) => Promise<void>
  getNotifications: (userId: string, callback: (resultNotifications: Map<string,Map<string,any>>) => void) => any
  deleteNotification: (notificationId: string, userId: string) => Promise<void>
  setSeenNotification: (notificationId: string, userId: string, notification: Notification) => Promise<void>
}
