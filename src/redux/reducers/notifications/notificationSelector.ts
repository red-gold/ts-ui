import { Map } from 'immutable';
import { createSelector } from 'reselect';

/** **************************
 * Get from store
 ************************** */
const getNotifications = (state: Map<string, any>) => {
    return state.getIn(['notify', 'userNotifies'], Map({})) as Map<string, Map<string, any>>;
};

/** **************************
 * Selectors
 ************************** */
const selectNotifications = () => {
    return createSelector([getNotifications], (notifications) => notifications);
};

const selectNotificationsCount = () => {
    return createSelector([getNotifications], (notifications) =>
        notifications.filter((notification) => !notification.get('isSeen', false)).count(),
    );
};

export const notificationSelector = {
    getNotifications,
    selectNotifications,
    selectNotificationsCount,
};
