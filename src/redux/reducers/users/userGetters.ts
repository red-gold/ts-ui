import { Map } from 'immutable';

const getUserProfileById: (state: Map<string, any>, { userId }: { userId: string }) => Map<string, any> = (
    state: Map<string, any>,
    { userId }: { userId: string },
) => {
    let userProfile: Map<string, any> = state.getIn(['user', 'entities', userId], Map({}));
    const id = userProfile.get('id');
    if (id) {
        userProfile = userProfile.set('userId', id);
    }
    return userProfile;
};

const getUsers = (state: Map<string, any>): any => {
    return state.getIn(['user', 'entities'], Map({})) as Map<string, any>;
};

const getUserBySocialName = (state: Map<string, any>, props: { socialName: string }) =>
    (state.getIn(['user', 'entities']) as Map<string, any>)
        .filter((user) => user.get('socialName') === props.socialName)
        .first(Map({}));

const getFindPeople = (state: Map<string, any>) => {
    const users: Map<string, boolean> = state.getIn(['user', 'findPeople', 'list'], Map({}));
    return users;
};

const getSearchPeople = (state: Map<string, any>) => {
    const users: Map<string, boolean> = state.getIn(['user', 'search', 'list'], Map({}));
    return users;
};

const getUserSuggestions = (state: Map<string, any>) => {
    const users: Map<string, boolean> = state.getIn(['user', 'suggestions', 'list'], Map({}));
    return users;
};

const hasMoreFindPeople = (state: Map<string, any>) => {
    return state.getIn(['user', 'findPeople', 'hasMoreData'], true);
};

const getFindPeoplePage = (state: Map<string, any>): any => {
    return state.getIn(['user', 'findPeople', 'page'], 0);
};

const hasMoreSearchPeople = (state: Map<string, any>) => {
    return state.getIn(['user', 'search', 'hasMoreData'], true);
};

const getAlbumPosts = (state: Map<string, any>, props: { userId: string }) => {
    const posts: Map<string, boolean> = state.getIn(['user', 'album', props.userId, 'list'], Map({}));
    return posts;
};

const getPosts = (state: Map<string, any>) => {
    return state.getIn(['post', 'entities'], Map({})) as Map<string, any>;
};

const hasMoreAlbum = (state: Map<string, any>, props: { userId: string }) => {
    return state.getIn(['user', 'album', props.userId, 'hasMoreData'], true);
};

const getAlbumLastPageRequest = (state: Map<string, any>, props: { userId: string }) => {
    return state.getIn(['user', 'album', props.userId, 'lastPageRequest'], 0);
};

const getAlbumLatPostId = (state: Map<string, any>, props: { userId: string }) => {
    return state.getIn(['user', 'album', props.userId, 'lastPostId'], '');
};

const getSearchKey = (state: Map<string, any>) => {
    return state.getIn(['user', 'searchKey']);
};

const getUserLoaded = (state: Map<string, any>) => {
    return state.getIn(['user', 'loaded']);
};

const getOpenEditProfile = (state: Map<string, any>) => {
    return state.getIn(['user', 'openEditProfile']);
};

export const userGetters = {
    getUserProfileById,
    getSearchKey,
    getAlbumLastPageRequest,
    getUsers,
    getAlbumLatPostId,
    getUserLoaded,
    getUserSuggestions,
    getFindPeoplePage,
    getFindPeople,
    getSearchPeople,
    hasMoreFindPeople,
    hasMoreSearchPeople,
    getAlbumPosts,
    getPosts,
    hasMoreAlbum,
    getOpenEditProfile,
    getUserBySocialName,
};
