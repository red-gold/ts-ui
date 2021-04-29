import { Map } from 'immutable';
import { createSelector } from 'reselect';

const getFollowingUsers = (state: Map<string, any>) => {
    return state.getIn(['circle', 'userTies']);
};

const getCirclesLoaded = (state: Map<string, any>) => {
    return state.getIn(['circle', 'loaded']);
};

// Selectors //

const selectFollowingIds = () => {
    return createSelector([getFollowingUsers], (followingUsers: Map<string, any>) => followingUsers.keySeq().toArray());
};

const selectCirclesLoaded = () => {
    return createSelector([getCirclesLoaded], (loaded: boolean) => loaded);
};

export const circleSelector = {
    getFollowingUsers,
    getCirclesLoaded,
    selectFollowingIds,
    selectCirclesLoaded,
};
