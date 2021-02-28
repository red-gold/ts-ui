import { Map } from 'immutable';
import { createSelector } from 'reselect';

/****************************
 * Get from store
 ***************************/
const getNotifications = (state: Map<string, any>) => {
    return state.getIn(['notify', 'userNotifies'], Map({}));
};

/****************************
 * Selectors
 ***************************/
const selectNotifications = () => {
    return createSelector([getNotifications], () => {});
};

export const postSelector = {
    getNotifications,
    selectNotifications,
};
