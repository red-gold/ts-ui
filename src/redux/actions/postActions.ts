// - Import domain
import { PostActionType } from 'constants/postActionType';
import { fromJS, Map } from 'immutable';
import { SocialError } from 'core/domain/common/socialError';
import { Post } from 'core/domain/posts/post';
import { IPostService } from 'core/services/posts/IPostService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { provider } from '../../socialEngine';
import * as globalActions from 'redux/actions/globalActions';
import { createPromiseAction } from '@adobe/redux-saga-promise';
import { PhotoGalleryFile } from 'models/gallery/photoGalleryFile';

const postService: IPostService = provider.get<IPostService>(SocialProviderTypes.PostService);

/* _____________ CRUD DB _____________ */

/**
 * Add a normal post
 */
export const dbAddPost: (post: Post, filesToUpload: PhotoGalleryFile[]) => any = createPromiseAction(
    PostActionType.SG_CREATE_POST,
    (post: Post, filesToUpload: PhotoGalleryFile[]) => ({
        post,
        filesToUpload,
    }),
);

/**
 * Update a post on database
 */
export const dbUpdatePost: (post: Map<string, any>, filesToUpload: PhotoGalleryFile[]) => any = createPromiseAction(
    PostActionType.SG_UPDATE_POST,
    (post: Post, filesToUpload: PhotoGalleryFile[]) => ({
        post,
        filesToUpload,
    }),
);

/**
 * Delete a post from database
 */
export const dbDeletePost: (id: string) => any = createPromiseAction(PostActionType.SG_DELETE_POST, (id: string) => ({
    id,
}));

/**
 * Get all user posts from data base
 */
export const fetchStreamPosts: (
    page: number,
    limit: number,
) => any = createPromiseAction(PostActionType.FETCH_STREAM_POSTS, (page = 0, limit = 10) => ({ page, limit }));

/**
 * Fetch post by URL key
 */
export const fetchPostByURLKey: (urlKey: string) => any = createPromiseAction(
    PostActionType.POST_FETCH_BY_URL_KEY,
    (urlKey: string) => ({
        urlKey,
    }),
);

/**
 * Search posts
 */
export const fetchSearchPosts: (query: string, page: number, limit: number) => any = createPromiseAction(
    PostActionType.DB_SEARCH_POST,
    (query = '', page = 0, limit = 10) => ({
        query,
        page,
        limit,
    }),
);

/**
 * Reset post search
 */
export const resetSearchPost = () => {
    return {
        type: PostActionType.POST_RESET_SEARCH,
    };
};

/**
 * Get all user posts from data base
 */
export const dbGetPostsByUserId: (userId: string, page?: number, limit?: number) => any = createPromiseAction(
    PostActionType.DB_GET_POST_BY_USER_ID,
    (userId: string, page = 0, limit = 10) => ({
        userId,
        page,
        limit,
    }),
);

/**
 * Get all user posts from data base
 */
export const dbGetPostById = (uid: string, postId: string) => {
    return (dispatch: any) => {
        if (uid) {
            return postService
                .getPostById(postId)
                .then((post: Post) => {
                    dispatch(addPost(fromJS(post)));
                })
                .catch((error: SocialError) => {
                    dispatch(globalActions.showMessage(error.message));
                });
        }
    };
};

/**
 * Get post key
 */
export const dbGetPostSearchKey = () => {
    return {
        type: PostActionType.DB_GET_POST_SEARCH_KEY,
    };
};

/* _____________ CRUD State _____________ */

/**
 * Set post search key
 */
export const setPostSearchKey = (searchKey: string) => {
    return {
        type: PostActionType.SET_POST_SEARCH_KEY,
        payload: { searchKey },
    };
};

/**
 * Add a normal post
 */
export const addPost = (post: Map<string, any>) => {
    return {
        type: PostActionType.ADD_POST,
        payload: { post },
    };
};

/**
 * Update a post
 */
export const updatePost = (post: Map<string, any>) => {
    return {
        type: PostActionType.UPDATE_POST,
        payload: { post },
    };
};

/**
 * Update the comments of post
 */
export const updatePostComments = (post: Map<string, any>) => {
    return {
        type: PostActionType.UPDATE_POST_COMMENTS,
        payload: { post },
    };
};

/**
 * Update the votes of post
 */
export const updatePostVotes = (post: Map<string, any>) => {
    return {
        type: PostActionType.UPDATE_POST_VOTES,
        payload: { post },
    };
};

/**
 * Delete a post
 */
export const deletePost = (uid: string, id: string) => {
    return {
        type: PostActionType.DELETE_POST,
        payload: { uid, id },
    };
};

/**
 * Add a list of post
 */
export const addPosts = (entities: Map<string, any>) => {
    return {
        type: PostActionType.ADD_LIST_POST,
        payload: { entities },
    };
};

/**
 * Add a list of post for stream
 */
export const addStreamPosts = (postIds: Map<string, boolean>) => {
    return {
        type: PostActionType.ADD_LIST_STREAM_POST,
        payload: { postIds },
    };
};

/**
 * Add a list of post for search
 */
export const addSearchPosts = (postIds: Map<string, any>, overwrite: boolean) => {
    return {
        type: PostActionType.ADD_LIST_SEARCH_POST,
        payload: { postIds },
        meta: {
            overwrite,
        },
    };
};

/**
 * Add a list of instagram post
 */
export const addInstagramPosts = (posts: Map<string, any>) => {
    return {
        type: PostActionType.ADD_LIST_POST_INSTAGRAM,
        payload: { posts },
    };
};

/**
 * Clea all data in post store
 */
export const clearAllData = () => {
    return {
        type: PostActionType.CLEAR_ALL_DATA_POST,
    };
};

/**
 * Add a post with image
 */
export const addImagePost = (uid: string, post: Map<string, any>) => {
    return {
        type: PostActionType.ADD_IMAGE_POST,
        payload: { uid, post },
    };
};

/**
 * Set stream has more data to show
 */
export const hasMoreDataStream = () => {
    return {
        type: PostActionType.HAS_MORE_DATA_STREAM,
    };
};

/**
 * Set stream has no data any more to show
 */
export const notMoreDataStream = () => {
    return {
        type: PostActionType.NOT_MORE_DATA_STREAM,
    };
};

/**
 * Set search posts has more data to show
 */
export const hasMorePostSearch = () => {
    return {
        type: PostActionType.HAS_MORE_POST_SEARCH,
    };
};

/**
 * Set search has no data any more to show
 */
export const notMorePostSearch = () => {
    return {
        type: PostActionType.NO_MORE_POST_SEARCH,
    };
};

/**
 * Set last page request of stream
 */
export const setPageStream = (page: number) => {
    return {
        type: PostActionType.SET_PAGE_STREAM,
        payload: { page },
    };
};

/**
 * Increase page count of stream
 */
export const increasePageStream = () => {
    return {
        type: PostActionType.INCREASE_PAGE_STREAM,
    };
};

/**
 * Set last post identification of stream
 */
export const lastPostStream = (lastPostId: string) => {
    return {
        type: PostActionType.LAST_POST_STREAM,
        payload: { lastPostId },
    };
};

/**
 * Set last post identification of search
 */
export const lastPostSearch = (lastPostId: string) => {
    return {
        type: PostActionType.LAST_POST_SEARCH,
        payload: { lastPostId },
    };
};

/**
 * Set profile posts has more data to show
 */
export const hasMoreDataProfile = () => {
    return {
        type: PostActionType.HAS_MORE_DATA_PROFILE,
    };
};

/**
 * Set profile posts has not data any more to show
 */
export const notMoreDataProfile = (userId: string) => {
    return {
        type: PostActionType.NOT_MORE_DATA_PROFILE,
        payload: { userId },
    };
};

/**
 * Set last page request of profile posts
 */
export const requestPageProfile = (userId: string, page: number) => {
    return {
        type: PostActionType.REQUEST_PAGE_PROFILE,
        payload: { userId, page },
    };
};

/**
 * Set last post identification of profile posts
 */
export const lastPostProfile = (userId: string, lastPostId: string) => {
    return {
        type: PostActionType.LAST_POST_PROFILE,
        payload: { userId, lastPostId },
    };
};

/**
 * Set post write dialog model to edit
 */
export const setPostWriteModel = (model: Map<string, any> | null) => {
    return {
        type: PostActionType.SET_POST_WRITE_MODEL,
        payload: { model },
    };
};

/**
 * Disable comment
 */
export const disableComment = (postId: string, status: boolean) => {
    return {
        type: PostActionType.POST_DISABLE_COMMENT,
        payload: { postId, status },
    };
};

/**
 * Disable sharing
 */
export const disableSharing = (postId: string, status: boolean) => {
    return {
        type: PostActionType.POST_DISABLE_SHARING,
        payload: { postId, status },
    };
};
