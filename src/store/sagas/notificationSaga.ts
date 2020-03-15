import { NotificationActionType } from 'constants/notificationActionType';
import { UserClaim } from 'core/domain/authorize/userClaim';
import { INotificationService } from 'core/services';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { fromJS, Map } from 'immutable';
import { Channel, eventChannel } from 'redux-saga';
import { all, call, cancelled, put, select, take, takeLatest } from 'redux-saga/effects';
import { Notification } from 'core/domain/notifications';
import { provider } from '../../socialEngine';
import * as notificatioActions from 'store/actions/notifyActions';
import * as userActions from 'store/actions/userActions';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { userSelector } from 'store/reducers/users/userSelector';

/**
 * Get service providers
 */
const notificationService: INotificationService = provider.get<INotificationService>(SocialProviderTypes.NotificationService)

/***************************** Subroutines ************************************/
/**
 * Creating channel event and subscribing notification service
 */
function subscribeNotification(userId: string) {
  return eventChannel<Map<string, Map<string, any>>>((emmiter) => {
    const unsubscribe = notificationService.getNotifications(userId, (notifications: Map<string, Map<string, any>>) => {

      emmiter(notifications)
    })
    return () => {
      unsubscribe()
    }
  })
}

/**
 * On auth state change
 */
function* dbFetchNotification() {
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  const channelSubscription: Channel<Map<string, Map<string, any>>> = yield call(subscribeNotification, uid)

  try {
    while (true) {
      let notifications: Map<string, Map<string, any>> = yield take(channelSubscription)

      yield put(notificatioActions.addNotifyList(notifications))

    }
  } finally {
    if (yield cancelled()) {
      channelSubscription.close()
    }
  }

}

export default function* notificationSga() {
  yield all([
    takeLatest(NotificationActionType.DB_FETCH_NOTIFICATIONS, dbFetchNotification)
  ])
}
