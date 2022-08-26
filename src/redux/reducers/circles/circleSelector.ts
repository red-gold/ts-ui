import { List, Map } from 'immutable';
import { createSelector } from 'reselect';

const getFollowingUsers = (state: Map<string, any>) => {
    return state.getIn(['circle', 'userTies']) as Map<string, any>;
};

const getCirclesLoaded = (state: Map<string, any>) => {
    return state.getIn(['circle', 'loaded']) as boolean;
};

const getSettingOpen = (state: Map<string, any>, { circleId }: { circleId: string }): boolean => {
    return state.getIn(['circle', 'openSetting', circleId], false) as boolean;
};

// Selectors //

const selectFollowingIds = () => {
    return createSelector([getFollowingUsers], (followingUsers: Map<string, any>) => followingUsers.keySeq().toArray());
};

const selectCirclesLoaded = () => {
    return createSelector([getCirclesLoaded], (loaded: boolean) => loaded);
};

const selectSettingOpen = () => {
    return createSelector([getSettingOpen], (open: boolean) => open);
};

const selectCircleUsers = () => {
    return createSelector(
        [getFollowingUsers, (state: Map<string, any>, { circleId }: { circleId: string }) => circleId],
        (followingUsers, circleId) => {
            let usersOfCircle: Map<string, any> = Map({});
            followingUsers.forEach((userTie, userTieId) => {
                const theUserTie: Map<string, any> = userTie;
                const circleList = theUserTie.getIn(['circleIdList']) as List<string>;
                if (circleList.indexOf(circleId) > -1) {
                    usersOfCircle = usersOfCircle.set(userTieId, theUserTie);
                }
            });
            return usersOfCircle;
        },
    );
};

export const circleSelector = {
    getFollowingUsers,
    getCirclesLoaded,
    selectFollowingIds,
    selectCirclesLoaded,
    selectCircleUsers,
    selectSettingOpen,
};
