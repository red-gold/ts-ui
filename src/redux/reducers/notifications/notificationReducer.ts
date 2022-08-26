import { NotificationActionType } from 'constants/notificationActionType';
import { Map } from 'immutable';

import { INotificationAction } from './INotificationAction';
import { NotificationState } from './NotificationState';

const addPlainNotifyList = (state: Map<string, any>, payload: any) => {
    let notifyListMap: Map<string, Map<string, any>> = Map({});
    Object.keys(payload).forEach((item) => {
        notifyListMap = notifyListMap.set(item, Map({ ...payload[item] }));
    });

    return state.mergeIn(['userNotifies'], notifyListMap).set('loaded', true);
};

/**
 * Notify actions
 */
export const notificationReducer = (
    // eslint-disable-next-line default-param-last
    state = Map(new NotificationState() as any) as Map<string, any>,
    action: INotificationAction,
) => {
    const { payload } = action;
    switch (action.type) {
        /* _____________ CRUD _____________ */
        case NotificationActionType.ADD_NOTIFY:
            return state;

        case NotificationActionType.ADD_NOTIFY_LIST:
            return state.set('userNotifies', payload).set('loaded', true);

        case NotificationActionType.ADD_PLAIN_NOTIFY_LIST:
            const newState = addPlainNotifyList(state, payload);
            return newState;

        case NotificationActionType.SEEN_NOTIFY:
            return state.setIn(['userNotifies', payload, 'isSeen'], true).set('loaded', true);

        case NotificationActionType.DELETE_NOTIFY:
            return state.deleteIn(['userNotifies', payload]);

        case NotificationActionType.CLEAR_ALL_DATA_NOTIFY:
            return Map(new NotificationState() as any);

        default:
            return state;
    }
};
