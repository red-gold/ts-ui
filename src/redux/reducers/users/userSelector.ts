import { Map, List } from 'immutable';
import { createSelector } from 'reselect';
import { PostAPI } from 'api/PostAPI';
import { userGetters } from './userGetters';

/****************************
 * Selectors
 ***************************/
const selectFindPeoplePage = () => {
    return createSelector([userGetters.getFindPeoplePage], (page) => page);
};
const selectLastAlbumPage = () => {
    return createSelector([userGetters.getAlbumLastPageRequest], (page) => page);
};

const selectMoreAlbum = () => {
    return createSelector([userGetters.hasMoreAlbum], (moreAlbum) => moreAlbum);
};

const selectMoreFindPeople = () => {
    return createSelector([userGetters.hasMoreFindPeople], (hasMoreFindPeople) => hasMoreFindPeople);
};

const selectMoreSearchPeople = () => {
    return createSelector([userGetters.hasMoreSearchPeople], (hasMoreSearchPeople) => hasMoreSearchPeople);
};

const selectProfileBySocialName = () => {
    return createSelector([userGetters.getUserBySocialName], (userProfile: Map<string, any>) =>
        userProfile.isEmpty()
            ? Map({})
            : userProfile.set('id', userProfile.get('objectId')).set('displayName', userProfile.get('fullName')),
    );
};

const selectAlbumPosts = () => {
    return createSelector([userGetters.getAlbumPosts, userGetters.getPosts], (albumPosts, posts) => {
        let mappedPosts: List<Map<string, any>> = List([]);
        albumPosts.forEach((exist, postId) => {
            if (exist) {
                const existPost = posts.get(postId);
                if (existPost) {
                    mappedPosts = mappedPosts.push(existPost);
                }
            }
        });
        if (mappedPosts.isEmpty()) {
            return List([]);
        }

        return PostAPI.sortImuObjectsDate(mappedPosts);
    });
};

const selectUserSuggestions = () => {
    return createSelector([userGetters.getUserSuggestions, userGetters.getUsers], (people, entities) => {
        let mappedPeople: List<Map<string, any>> = List([]);
        people.forEach((exist, userId) => {
            if (exist) {
                mappedPeople = mappedPeople.push(entities.get(userId));
            }
        });
        if (mappedPeople.isEmpty()) {
            return List([]);
        }
        return PostAPI.sortImuObjectsDate(mappedPeople);
    });
};

const selectFindPeople = () => {
    return createSelector([userGetters.getFindPeople, userGetters.getUsers], (people, entities) => {
        let mappedPeople: List<Map<string, any>> = List([]);
        people.forEach((exist, userId) => {
            if (exist) {
                mappedPeople = mappedPeople.push(entities.get(userId));
            }
        });
        if (mappedPeople.isEmpty()) {
            return List([]);
        }
        return PostAPI.sortImuObjectsDate(mappedPeople);
    });
};

const selectSearchPeople = () => {
    return createSelector([userGetters.getSearchPeople, userGetters.getUsers], (people, entities) => {
        let mappedPeople: List<Map<string, any>> = List([]);
        people.forEach((exist, userId) => {
            if (exist) {
                mappedPeople = mappedPeople.push(entities.get(userId));
            }
        });
        if (mappedPeople.isEmpty()) {
            return List([]);
        }
        return PostAPI.sortImuObjectsDate(mappedPeople);
    });
};

const selectUsers = () => {
    return createSelector([userGetters.getUsers], (users) => users);
};

const selectUserProfileById = () => {
    return createSelector([userGetters.getUserProfileById], (userProfile) => userProfile);
};

const selectUserLoaded = () => {
    return createSelector([userGetters.getUserLoaded], (loaded: boolean) => loaded);
};

const selectOpenEditProfile = () => {
    return createSelector([userGetters.getOpenEditProfile], (open: boolean) => open);
};

export const userSelector = {
    selectAlbumPosts,
    selectLastAlbumPage,
    selectMoreAlbum,
    selectUserProfileById,
    selectMoreFindPeople,
    selectFindPeople,
    selectMoreSearchPeople,
    selectSearchPeople,
    selectUsers,
    selectFindPeoplePage,
    selectUserLoaded,
    selectUserSuggestions,
    selectOpenEditProfile,
    selectProfileBySocialName,
};
