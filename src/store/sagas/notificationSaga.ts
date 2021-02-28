import { NotificationActionType } from 'constants/notificationActionType';
import { INotificationService } from 'core/services/notifications/INotificationService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map } from 'immutable';
import { Channel, eventChannel } from 'redux-saga';
import { all, call, cancelled, put, select, take, takeLatest } from 'redux-saga/effects';
import { provider } from '../../socialEngine';
import * as notificatioActions from 'store/actions/notifyActions';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';

/**
 * Get service providers
 */
const notificationService: INotificationService = provider.get<INotificationService>(
    SocialProviderTypes.NotificationService,
);

/***************************** Subroutines ************************************/
/**
 * Creating channel event and subscribing notification service
 */
function subscribeNotification(userId: string) {
    return eventChannel<Map<string, Map<string, any>>>((emmiter) => {
        const unsubscribe = notificationService.getNotifications(
            userId,
            (notifications: Map<string, Map<string, any>>) => {
                emmiter(notifications);
            },
        );
        return () => {
            unsubscribe();
        };
    });
}

/**
 * On auth state change
 */
function* dbFetchNotification() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    const channelSubscription: Channel<Map<string, Map<string, any>>> = yield call(subscribeNotification, uid);

    try {
        while (true) {
            const notifications: Map<string, Map<string, any>> = yield take(channelSubscription);

            yield put(notificatioActions.addNotifyList(notifications));
        }
    } finally {
        if (yield cancelled()) {
            channelSubscription.close();
        }
    }
}

export default function* notificationSga(): any {
    yield all([takeLatest(NotificationActionType.DB_FETCH_NOTIFICATIONS, dbFetchNotification)]);
}
