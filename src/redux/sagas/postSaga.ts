import { PostAPI } from 'api/PostAPI';
import { PostActionType } from 'constants/postActionType';
import { UserActionType } from 'constants/userActionType';
import type { IPostService } from 'core/services/posts/IPostService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map, fromJS } from 'immutable';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { provider } from 'socialEngine';
import { FileResult } from 'models/files/fileResult';
import * as globalActions from 'redux/actions/globalActions';
import * as postActions from 'redux/actions/postActions';
import * as serverActions from 'redux/actions/serverActions';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import * as userActions from 'redux/actions/userActions';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { circleSelector } from 'redux/reducers/circles/circleSelector';
import { postSelector } from 'redux/reducers/posts/postSelector';
import config from 'config';
import { Post } from 'core/domain/posts/post';
import { Album } from 'core/domain/imageGallery/album';
import { DialogType } from 'models/common/dialogType';
import { implementPromiseAction } from '@adobe/redux-saga-promise';
import { uploadImage } from './gallerySaga';
import { userGetters } from '../reducers/users/userGetters';

/**
 * Get service providers
 */
const postService: IPostService = provider.get<IPostService>(SocialProviderTypes.PostService);

/** *************************** Subroutines *********************************** */

/**
 * Fetch posts for stream
 */
function* dbFetchPostStream(userId: string, lastPostId: string, page: number, limit: number, searchKey: string) {
    const followingUsers: Map<string, any> = yield select(circleSelector.getFollowingUsers);
    const followingIds = followingUsers
        .keySeq()
        .map((key) => `${key}`)
        .toArray();
    followingIds.push(`${userId}`);

    const postResult: {
        posts: Map<string, any>;
        ids: Map<string, boolean>;
        newLastPostId: string;
        hasMore: boolean;
    } = yield call(postService.searchPosts, '', followingIds.join(), lastPostId, page, limit, searchKey);

    if (!postResult.hasMore) {
        yield put(postActions.notMoreDataStream());
    }

    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const streamServerRequest = PostAPI.createFetchStreamRequest(authedUser.get('uid'));
    streamServerRequest.status = ServerRequestStatusType.OK;
    yield put(serverActions.sendRequest(streamServerRequest));
    // Store last post Id
    yield put(postActions.lastPostStream(postResult.newLastPostId));
    yield put(postActions.addPosts(postResult.posts));
    yield put(postActions.addStreamPosts(postResult.ids));
}

/**
 * Search posts on server
 */
function* dbSearchPost(
    query: string,
    userId: string,
    lastPostId: string,
    page: number,
    limit: number,
    searchKey: string,
) {
    const followingUsers: Map<string, any> = yield select(circleSelector.getFollowingUsers);
    const followingIds = followingUsers
        .keySeq()
        .map((key) => `${key}`)
        .toArray();
    followingIds.push(`${userId}`);

    const postResult: {
        posts: Map<string, any>;
        ids: Map<string, boolean>;
        newLastPostId: string;
        hasMore: boolean;
    } = yield call(postService.searchPosts, query, followingIds.join(), lastPostId, page, limit, searchKey);
    if (!postResult.hasMore) {
        yield put(postActions.notMorePostSearch());
    }
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const streamServerRequest = PostAPI.createSearchPostRequest(authedUser.get('uid'));
    streamServerRequest.status = ServerRequestStatusType.OK;
    yield put(serverActions.sendRequest(streamServerRequest));
    // Store last post Id
    yield put(postActions.lastPostSearch(postResult.newLastPostId));
    yield put(postActions.addPosts(postResult.posts));
    yield put(postActions.addSearchPosts(postResult.ids, page === 0));
}

/**
 * Fetch posts for user profile
 */
function* dbFetchPostByUserId(userId: string, lastPostId: string, page: number, limit: number, searchKey: string) {
    const postResult: {
        posts: Map<string, any>;
        ids: Map<string, boolean>;
        newLastPostId: string;
        hasMore: boolean;
    } = yield call(postService.getPostsByUserId, userId, lastPostId, page, limit, searchKey);
    if (!postResult.hasMore) {
        yield put(postActions.notMoreDataProfile(userId));
    }

    const profilePostsRequest = PostAPI.createFetchPostUserRequest(userId);
    profilePostsRequest.status = ServerRequestStatusType.OK;
    yield put(serverActions.sendRequest(profilePostsRequest));
    // Store last post Id
    yield put(postActions.lastPostProfile(userId, postResult.newLastPostId));

    yield put(postActions.addPosts(postResult.posts));
    yield put(userActions.addProfilePosts(userId, postResult.ids));
}

/**
 * Fetch album posts for user profile
 */
function* dbFetchAlbumPosts(userId: string, lastPostId: string, page: number, limit: number, searchKey: string) {
    const postResult: {
        posts: Map<string, any>;
        ids: Map<string, boolean>;
        newLastPostId: string;
        hasMore: boolean;
    } = yield call(postService.getAlbumPosts, userId, lastPostId, page, limit, searchKey);
    if (!postResult.hasMore) {
        yield put(userActions.notMoreDataAlbum(userId));
    }

    const profileAlbumsRequest = PostAPI.createFetchAlbumRequest(userId);
    profileAlbumsRequest.status = ServerRequestStatusType.OK;
    yield put(serverActions.sendRequest(profileAlbumsRequest));
    // Store last post Id
    yield put(userActions.lastPostAlbum(userId, postResult.newLastPostId));

    yield put(postActions.addPosts(postResult.posts));
    yield put(userActions.addProfileAlbums(userId, postResult.ids));
}

/**
 * Get post search key
 */
function* getPostSearchKey() {
    try {
        const searchKey: string = yield call(postService.getSearchKey);
        yield put(postActions.setPostSearchKey(searchKey));
    } catch (error: any) {
        yield put(globalActions.showMessage(error.message));
    }
}

/** *************************************************************************** */
/** ***************************** WATCHERS ************************************ */
/** *************************************************************************** */

/**
 * Fetch posts from server
 */
function* watchFetchPostStream(action: { type: PostActionType; payload: any }) {
    yield call(implementPromiseAction, action, function* () {
        const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
        const { payload } = action;
        const { page, limit } = payload;
        const uid = authedUser.get('uid');
        try {
            const lastPostId: string = yield select(postSelector.getStreamLastPostId);
            yield call(dbFetchPostStream, uid, lastPostId, page, limit, '');
        } catch (error: any) {
            yield put(globalActions.showMessage(error.message));
            yield put(postActions.notMoreDataStream());
            throw error;
        }
    });
}

/**
 * Get post by URL key
 */
function* getPostByURLKey(action: Record<string, any>) {
    yield call(implementPromiseAction, action, function* () {
        const { urlKey } = action.payload;
        const post: Post = yield call(postService.getPostByURLKey, urlKey);
        yield put(postActions.addPost(fromJS(post) as Map<string, any>));
    });
}

/**
 * Watch search post
 */
function* watchSearchPost(action: { type: PostActionType; payload: any }) {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    yield call(implementPromiseAction, action, function* () {
        const { payload } = action;
        const { query, page, limit } = payload;
        const uid = authedUser.get('uid');
        try {
            const lastPostId: string = yield select(postSelector.getSearchLastPostId);

            if (uid) {
                yield put(globalActions.showTopLoading());

                yield call(dbSearchPost, query, uid, lastPostId, page, limit, '');
            }
        } catch (error: any) {
            yield put(globalActions.showMessage(error.message));
            yield put(postActions.notMorePostSearch());
            throw error;
        } finally {
            yield put(globalActions.hideTopLoading());
        }
    });
}

/**
 * Watch delete post
 */
function* watchDeletePost(action: { type: PostActionType; payload: any }) {
    yield call(implementPromiseAction, action, function* () {
        const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
        const { payload } = action;
        const { id } = payload;
        const uid = authedUser.get('uid');
        try {
            yield put(globalActions.showTopLoading());
            yield call(postService.deletePost, id);
            yield put(postActions.deletePost(uid, id));
            yield put(userActions.decreasePostCountUser(uid));
        } catch (error: any) {
            yield put(globalActions.showMessage(error.message));
            yield put(postActions.notMorePostSearch());
            throw error;
        } finally {
            yield put(globalActions.hideTopLoading());
        }
    });
}

/**
 * Watch update post
 */
function* watchUpdatePost(action: {
    type: PostActionType;
    payload: {
        post: Map<string, any>;
        filesToUpload: {
            src: string;
            file: any;
            fileName: string;
        }[];
    };
}) {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const postUpdateRequest = PostAPI.createUpdatePostRequest(authedUser.get('uid'));
    yield put(serverActions.sendRequest(postUpdateRequest));
    const { payload } = action;
    const { post, filesToUpload } = payload;
    yield call(implementPromiseAction, action, function* () {
        try {
            let updatedPost = post;
            let uploadedFiles: FileResult[] = [];
            if (filesToUpload && filesToUpload.length) {
                uploadedFiles = yield all(
                    filesToUpload.map((item) =>
                        call(uploadImage, item.file, config.data.imageFolderPath, item.fileName),
                    ),
                );

                updatedPost = post.mergeIn(
                    ['album', 'photos'],
                    uploadedFiles.map((item) => item.fileURL),
                );
            }

            yield call(postService.updatePost, updatedPost.toJS() as unknown as Post);
            yield put(globalActions.closeDialog(DialogType.PostWrite));
            yield put(postActions.updatePost(updatedPost));
            postUpdateRequest.status = ServerRequestStatusType.OK;
            yield put(serverActions.sendRequest(postUpdateRequest));
        } catch (error: any) {
            postUpdateRequest.status = ServerRequestStatusType.Error;
            yield put(serverActions.sendRequest(postUpdateRequest));
            yield put(globalActions.showMessage(error.message));
        }
    });
}

/**
 * Watch create post
 */
function* watchCreatePost(action: {
    type: PostActionType;
    payload: {
        post: Post;
        filesToUpload: {
            src: string;
            file: any;
            fileName: string;
        }[];
    };
}) {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    const postUpdateRequest = PostAPI.createUpdatePostRequest(uid);
    yield put(serverActions.sendRequest(postUpdateRequest));
    const { payload } = action;
    const { post, filesToUpload } = payload;
    yield call(implementPromiseAction, action, function* () {
        try {
            const updatedPost = post;
            let uploadedFiles: FileResult[] = [];
            if (filesToUpload && filesToUpload.length) {
                uploadedFiles = yield all(
                    filesToUpload.map((item) =>
                        call(uploadImage, item.file, config.data.imageFolderPath, item.fileName),
                    ),
                );

                const photoURLs = uploadedFiles.map((item) => item.fileURL);
                if (post.album && post.album.photos) {
                    post.album.photos.push(...photoURLs);
                } else {
                    post.album = new Album();
                    post.album.photos.push(...photoURLs);
                }
            }

            const postKey: string = yield call(postService.addPost, updatedPost);

            yield put(globalActions.closeDialog(DialogType.PostWrite));
            yield put(
                postActions.addPost(
                    fromJS({
                        ...post,
                        id: postKey,
                    }) as Map<string, any>,
                ),
            );
            yield put(postActions.addStreamPosts(Map({ [postKey]: true })));
            yield put(userActions.increasePostCountUser(uid));

            postUpdateRequest.status = ServerRequestStatusType.OK;
            yield put(serverActions.sendRequest(postUpdateRequest));
        } catch (error: any) {
            postUpdateRequest.status = ServerRequestStatusType.Error;
            yield put(serverActions.sendRequest(postUpdateRequest));
            yield put(globalActions.showMessage(error.message));
        }
    });
}

/**
 * Fetch posts by user identifier from server
 */
function* watchFetchPostByUserId(action: { type: PostActionType; payload: any }) : any{
    yield call(implementPromiseAction, action, function* () {
        const { payload } = action;
        const { page, limit, userId } = payload;
        const profilePostsRequest = PostAPI.createFetchPostUserRequest(userId);
        yield put(serverActions.sendRequest(profilePostsRequest));

        try {
            yield select(postSelector.getProfileLastPostRequest, { userId });
            const lastPostId: string = yield select(postSelector.getProfileLatPostId, { userId });

            yield call(dbFetchPostByUserId, userId, lastPostId, page, limit, '');
        } catch (error: any) {
            yield put(globalActions.showMessage(error.message));
            throw error;
        }
    });
}

/**
 * Fetch album posts by user identifier from server
 */
function* watchFetchAlbumPosts(action: { type: PostActionType; payload: any }) {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const albumPostsPostsRequest = PostAPI.createFetchAlbumRequest(authedUser.get('uid'));
    yield put(serverActions.sendRequest(albumPostsPostsRequest));

    const { payload } = action;
    const { limit, userId, page } = payload;
    try {
        yield select(userGetters.getAlbumLastPageRequest, { userId });
        const lastPostId: string = yield select(userGetters.getAlbumLatPostId, { userId });

        const uid = authedUser.get('uid');
        if (uid) {
            yield call(dbFetchAlbumPosts, userId, lastPostId, page, limit, '');
        }
    } catch (error: any) {
        yield put(globalActions.showMessage(error.message));
    }
}

/**
 * Disable post comment
 */
function* watchDisableComment({ payload }: Record<string, any>) {
    const { postId, status } = payload;

    try {
        yield call(postService.disableComment, postId, status);
    } catch (error: any) {
        yield put(globalActions.showMessage(error.message));
    }
}

/**
 * Disable post sharing
 */
function* watchDisableSharing({ payload }: Record<string, any>) {
    const { postId, status } = payload;

    try {
        yield call(postService.disableSharing, postId, status);
    } catch (error: any) {
        yield put(globalActions.showMessage(error.message));
    }
}

export default function* postSaga() {
    yield all([
        takeEvery(postActions.fetchStreamPosts, watchFetchPostStream),
        takeEvery(postActions.fetchPostByURLKey, getPostByURLKey),
        takeEvery(postActions.fetchSearchPosts, watchSearchPost),
        takeEvery(postActions.dbUpdatePost, watchUpdatePost),
        takeEvery(postActions.dbAddPost, watchCreatePost),
        takeEvery(postActions.dbDeletePost, watchDeletePost),
        takeEvery(postActions.dbGetPostsByUserId, watchFetchPostByUserId),
        takeEvery(UserActionType.DB_GET_ALBUM_POST_BY_USER_ID, watchFetchAlbumPosts),
        takeLatest(PostActionType.DB_GET_POST_SEARCH_KEY, getPostSearchKey),
        takeLatest(PostActionType.POST_DISABLE_COMMENT, watchDisableComment),
        takeLatest(PostActionType.POST_DISABLE_SHARING, watchDisableSharing),
    ]);
}
