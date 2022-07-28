import { INotificationService } from 'core/services/notifications/INotificationService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as notificatioActions from 'redux/actions/notifyActions';
import { implementPromiseAction } from '@adobe/redux-saga-promise';
import { fromJS } from 'immutable';
import { provider } from '../../socialEngine';

/**
 * Get service providers
 */
const notificationService: INotificationService = provider.get<INotificationService>(
    SocialProviderTypes.NotificationService,
);

/** *************************** Subroutines *********************************** */

/**
 * On auth state change
 */
function* dbFetchNotification(action: any) {
    yield call(implementPromiseAction, action, function* () {
        const notifications: Record<string, any> = yield call(notificationService.getNotifications);
        yield put(notificatioActions.addNotifyList(fromJS(notifications)));
    });
}

function* seenNotification(action: any) {
    yield call(implementPromiseAction, action, function* () {
        const { id } = action.payload;
        yield call(notificationService.setSeenNotification, id);
        yield put(notificatioActions.seenNotify(id));
    });
}

function* seenAllNotifications(action: any) {
    yield call(implementPromiseAction, action, function* () {
        yield call(notificationService.setSeenAllNotifications);
        yield put(notificatioActions.seenAllNotifications());
    });
}

export default function* notificationSga(): any {
    yield all([
        takeLatest(notificatioActions.dbGetNotifications, dbFetchNotification),
        takeLatest(notificatioActions.dbSeenNotification, seenNotification),
        takeLatest(notificatioActions.dbSeenAllNotifications, seenAllNotifications),
    ]);
}
