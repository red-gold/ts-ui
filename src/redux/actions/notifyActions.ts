import { NotificationActionType } from 'constants/notificationActionType';
import { User } from 'core/domain/users/user';
import { Map } from 'immutable';
import moment from 'moment/moment';
import { SocialError } from 'core/domain/common/socialError';
import { Notification } from 'core/domain/notifications/notification';
import { INotificationService } from 'core/services/notifications/INotificationService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import * as globalActions from 'redux/actions/globalActions';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { createPromiseAction } from '@adobe/redux-saga-promise';
import { provider } from '../../socialEngine';

/**
 * Get service providers
 */
const notificationService: INotificationService = provider.get<INotificationService>(
    SocialProviderTypes.NotificationService,
);

/* _____________ CRUD DB _____________ */

/**
 *  Add notificaition to database
 */
export const dbAddNotification = (newNotify: Notification) => {
    return (dispatch: any, getState: Function) => {
        const state: Map<string, any> = getState();
        const currentUset = authorizeSelector.getCurrentUser(state);
        const notify: Notification = {
            isSeen: false,
            description: newNotify.description,
            url: newNotify.url,
            notifierUserId: newNotify.notifierUserId,
            notifierProfile: Map(currentUset).toJS() as User,
            notifyRecieverUserId: newNotify.notifyRecieverUserId,
            emailNotification: newNotify.emailNotification === true,
            type: newNotify.type,
            creationDate: moment.utc().valueOf(),
        };

        return notificationService
            .addNotification(notify)
            .then(() => {
                dispatch(addNotify());
            })
            .catch((error: SocialError) => dispatch(globalActions.showMessage(error.message)));
    };
};

/**
 * Get all notificaitions from database
 */
export const dbGetNotifications: () => any = createPromiseAction(NotificationActionType.DB_FETCH_NOTIFICATIONS);

/**
 * Delete a notificaition from database
 * @param  {string} id of notificaition
 */
export const dbDeleteNotification = (id: string) => {
    return (dispatch: any, getState: Function) => {
        // Get current user id
        const state: Map<string, any> = getState();
        const uid = state.getIn(['authorize', 'uid']) as string;

        return notificationService
            .deleteNotification(id, uid)
            .then(() => {
                dispatch(deleteNotify(id));
            })
            .catch((error: SocialError) => dispatch(globalActions.showMessage(error.message)));
    };
};

/**
 * Make seen a notificaition
 * @param  {string} id of notificaition
 */
export const dbSeenNotification: (id: string) => any = createPromiseAction(
    NotificationActionType.SG_SEEN_NOTIFICATION,
    (id: string) => ({
        id,
    }),
);

/**
 * Make seen all notificaitions
 */
export const dbSeenAllNotifications: () => any = createPromiseAction(NotificationActionType.SG_SEEN_ALL_NOTIFICATIONS);

/**
 * Add notificaition
 */
export const addNotify = () => {
    return {
        type: NotificationActionType.ADD_NOTIFY,
    };
};

/**
 * Add notificaition list
 */
export const addNotifyList = (userNotifies: Record<string, Record<string, any>>) => {
    return {
        type: NotificationActionType.ADD_NOTIFY_LIST,
        payload: userNotifies,
    };
};

/**
 * Add plain notificaition list
 */
export const addPlainNotifyList = (userNotifies: any) => {
    return {
        type: NotificationActionType.ADD_PLAIN_NOTIFY_LIST,
        payload: userNotifies,
    };
};

/**
 * Delete a notificaition
 * @param  {string} id of notificaition
 */
export const deleteNotify = (id: string) => {
    return { type: NotificationActionType.DELETE_NOTIFY, payload: id };
};

/**
 * Change notificaition to has seen status
 * @param  {string} id of notificaition
 */
export const seenNotify = (id: string) => {
    return { type: NotificationActionType.SEEN_NOTIFY, payload: id };
};

/**
 * Change all notificaitions to seen
 */
export const seenAllNotifications = () => {
    return { type: NotificationActionType.SEEN_ALL_NOTIFICATIONS };
};

/**
 * Clear all data
 */
export const clearAllNotifications = () => {
    return {
        type: NotificationActionType.CLEAR_ALL_DATA_NOTIFY,
    };
};
