import { PostAPI } from 'api/PostAPI';
import { List, Map } from 'immutable';
import { createSelector } from 'reselect';

/****************************
 * Get from store
 ***************************/
const getPost = (state: Map<string, any>, props: { postId: string }) => {
    return state.getIn(['post', 'entities', props.postId], Map({}));
};

const getPostByURLKey = (state: Map<string, any>, props: { urlKey: string }) =>
    state
        .getIn(['post', 'entities'], Map({}))
        .filter((post: Map<string, any>) => post.get('urlKey') === props.urlKey)
        .first();

const hasMorePostStream = (state: Map<string, any>) => {
    return state.getIn(['post', 'stream', 'hasMoreData'], true);
};

const hasMorePostSearch = (state: Map<string, any>) => {
    return state.getIn(['post', 'search', 'hasMoreData'], true);
};

const hasMorePostProfile = (state: Map<string, any>, props: { userId: string }) => {
    const posts: boolean = state.getIn(['user', 'post', props.userId, 'hasMoreData'], true);
    return posts;
};

const getPostStream = (state: Map<string, any>) => {
    const posts: Map<string, boolean> = state.getIn(['post', 'stream', 'list'], Map({}));
    return posts;
};

const searchPosts = (state: Map<string, any>) => {
    const posts: Map<string, boolean> = state.getIn(['post', 'search', 'list'], Map({}));
    return posts;
};

const getProfilePosts = (state: Map<string, any>, props: { userId: string }) => {
    const posts: Map<string, boolean> = state.getIn(['user', 'post', props.userId, 'list'], Map({}));
    return posts;
};

const getPosts = (state: Map<string, any>) => {
    return state.getIn(['post', 'entities'], Map({})) as Map<string, any>;
};

const getInstagramPosts = (state: Map<string, any>) => {
    return state.getIn(['post', 'instagram'], Map({}));
};

const getStreamPage = (state: Map<string, any>) => {
    return state.getIn(['post', 'stream', 'lastPageRequest'], 0);
};

const getStreamLastPostId = (state: Map<string, any>) => {
    return state.getIn(['post', 'stream', 'lastPostId'], '');
};

const getSearchLastPostId = (state: Map<string, any>) => {
    return state.getIn(['post', 'search', 'lastPostId'], '');
};

const getProfileLastPostRequest = (state: Map<string, any>, props: { userId: string }) => {
    return state.getIn(['user', 'post', props.userId, 'lastPageRequest'], 0);
};

const getProfileLatPostId = (state: Map<string, any>, props: { userId: string }) => {
    return state.getIn(['user', 'post', props.userId, 'lastPostId'], '');
};

const getSearchKey = (state: Map<string, any>) => {
    return state.getIn(['post', 'searchKey']);
};

const getPostWriteModel = (state: Map<string, any>) => {
    return (state.getIn(['post', 'ui', 'postWrite', 'model']) as Map<string, any>) || undefined;
};

/****************************
 * Selectors
 ***************************/

const selectPostWriteModel = () => {
    return createSelector([getPostWriteModel], (model) => model);
};
// Select post by URL key with profile
const selectPostByURLKeyWithProfile = () => {
    return createSelector([getPostByURLKey], (post: Map<string, any>) => {
        if (!post) {
            return Map({});
        }
        const photos: List<string> = post.getIn(['album', 'photos']) || List([]);
        if (photos.size === 1) {
            post = post.set('media', photos.first());
        }
        if (post.get('thumbnail') !== '') {
            post = post.set('media', post.get('thumbnail'));
        }

        const votes: Map<string, any> = post.get('votes', Map({}));
        let mappedVotes: Map<string, any> = Map({});
        votes
            .filter((avatar) => !!avatar)
            .forEach((avatar, key) => {
                mappedVotes = mappedVotes.set(key, avatar);
            });
        post = post.set('votes', mappedVotes);
        return post;
    });
};

const selectPost = () => {
    return createSelector([getPost], (post) => post);
};
const selectStreamPage = () => {
    return createSelector([getStreamPage], (page) => page);
};
const selectHasMorePostStream = () => {
    return createSelector([hasMorePostStream], (hasMorePost) => hasMorePost);
};
const selectHasMorePostSeach = () => {
    return createSelector([hasMorePostSearch], (hasMorePost) => hasMorePost);
};
const selectHasMorePostProfile = () => {
    return createSelector([hasMorePostProfile], (hasMorePost) => hasMorePost);
};

const selectStreamPosts = () => {
    return createSelector([getPostStream, getPosts], (postStream, posts) => {
        let mappedPosts: List<Map<string, any>> = List([]);
        postStream.forEach((exist, postId) => {
            let existPost: Map<string, any> = posts.get(postId);
            if (exist && existPost) {
                const photos: List<string> = existPost.getIn(['album', 'photos']) || List([]);
                if (photos.size === 1) {
                    existPost = existPost.set('media', photos.first());
                }
                if (existPost.get('thumbnail') !== '') {
                    existPost = existPost.set('media', existPost.get('thumbnail'));
                }

                const votes: Map<string, any> = existPost.get('votes', Map({}));
                let mappedVotes: Map<string, any> = Map({});
                votes
                    .filter((avatar) => !!avatar)
                    .forEach((avatar, key) => {
                        mappedVotes = mappedVotes.set(key, avatar);
                    });
                existPost = existPost.set('votes', mappedVotes);

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

const selectSearchPosts = () => {
    return createSelector([searchPosts, getPosts], (searchPosts, posts) => {
        let mappedPosts: List<Map<string, any>> = List([]);
        searchPosts.forEach((exist, postId) => {
            let existPost: Map<string, any> = posts.get(postId);
            if (exist && existPost) {
                const photos: List<string> = existPost.getIn(['album', 'photos']) || List([]);
                if (photos.size === 1) {
                    existPost = existPost.set('media', photos.first());
                }
                if (existPost.get('thumbnail') !== '') {
                    existPost = existPost.set('media', existPost.get('thumbnail'));
                }

                const votes: Map<string, any> = existPost.get('votes', Map({}));
                let mappedVotes: Map<string, any> = Map({});
                votes
                    .filter((avatar) => !!avatar)
                    .forEach((avatar, key) => {
                        mappedVotes = mappedVotes.set(key, avatar);
                    });
                existPost = existPost.set('votes', mappedVotes);

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

const selectProfilePosts = () => {
    return createSelector([getProfilePosts, getPosts], (profilePosts, posts) => {
        let mappedPosts: List<Map<string, any>> = List([]);
        profilePosts.forEach((exist, postId) => {
            let existPost: Map<string, any> = posts.get(postId);
            if (exist && existPost) {
                const photos: List<string> = existPost.getIn(['album', 'photos']) || List([]);
                if (photos.size === 1) {
                    existPost = existPost.set('media', photos.first());
                }
                if (existPost.get('thumbnail') !== '') {
                    existPost = existPost.set('media', existPost.get('thumbnail'));
                }

                const votes: Map<string, any> = existPost.get('votes', Map({}));
                let mappedVotes: Map<string, any> = Map({});
                votes
                    .filter((avatar) => !!avatar)
                    .forEach((avatar, key) => {
                        mappedVotes = mappedVotes.set(key, avatar);
                    });
                existPost = existPost.set('votes', mappedVotes);

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

export const postSelector = {
    getPost,
    getStreamPage,
    getStreamLastPostId,
    getSearchKey,
    getProfileLastPostRequest,
    getSearchLastPostId,
    getProfileLatPostId,
    getInstagramPosts,
    selectPostWriteModel,
    selectPost,
    selectHasMorePostStream,
    selectHasMorePostSeach,
    selectHasMorePostProfile,
    selectSearchPosts,
    selectStreamPosts,
    selectProfilePosts,
    selectStreamPage,
    selectPostByURLKeyWithProfile,
};
