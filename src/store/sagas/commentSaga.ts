import CommentAPI from 'api/CommentAPI';
import { CommentActionType } from 'constants/commentActionType';
import { ICommentService } from 'core/services/comments/ICommentService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map } from 'immutable';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { provider } from '../../socialEngine';
import * as commentActions from 'store/actions/commentActions';
import * as serverActions from 'store/actions/serverActions';
import * as globalActions from 'store/actions/globalActions';
import * as postActions from 'store/actions/postActions';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { postSelector } from '../reducers/posts/postSelector';
import moment from 'moment/moment';

/**
 * Get service providers
 */
const commentService: ICommentService = provider.get<ICommentService>(SocialProviderTypes.CommentService);

/***************************** Subroutines ************************************/

/**
 * Fetch comments from the server
 */
function* dbFetchComments(action: any) {
    const { payload } = action;
    const { postId, page, limit } = payload;

    const getCommentsRequest = CommentAPI.createGetCommentsRequest(postId);
    yield put(serverActions.sendRequest(getCommentsRequest));
    try {
        const commentResult: {
            comments: Map<string, any>;
            ids: Map<string, boolean>;
            newLastCommentId: string;
            hasMore: boolean;
        } = yield call(commentService.getComments, postId, page, limit);

        if (!commentResult.hasMore) {
            yield put(commentActions.notMoreComments(postId));
        }
        yield put(commentActions.addCommentList(postId, commentResult.comments));
        getCommentsRequest.status = ServerRequestStatusType.OK;
        yield put(serverActions.sendRequest(getCommentsRequest));
    } catch (error) {
        getCommentsRequest.status = ServerRequestStatusType.Error;
        yield put(serverActions.sendRequest(getCommentsRequest));
    }
}

/**
 * Send comment to server
 */
function* asyncSaveComment(action: any) {
    const { payload } = action;
    const { newComment } = payload;
    const postId = newComment.get('postId');
    yield put(globalActions.showTopLoading());

    // Select target post from local store
    const post: Map<string, any> = yield select(postSelector.getPost, { postId });

    try {
        const newCommentId: string = yield call(commentService.addComment, newComment.toJS());
        const savedComment = newComment.set('objectId', newCommentId).set('creationDate', moment().utc().valueOf());
        yield put(commentActions.addComment(savedComment));

        // Update post comment counter in local store
        const counter = Number(post.get('commentCounter', 0)) + 1;

        const commentPost = post.set('commentCounter', counter);
        yield put(postActions.updatePostComments(commentPost));

        yield put(globalActions.hideTopLoading());
    } catch (error) {
        // Update post comment counter in local store
        const counter = Number(post.get('commentCounter', 0)) - 1;

        const commentPost = post.set('commentCounter', counter);
        yield put(postActions.updatePostComments(commentPost));
        yield put(globalActions.showMessage(error.message));
        yield put(globalActions.hideTopLoading());
    }
}

/**
 * Async update comment on server
 */
function* asyncUpdateComment(action: any) {
    const { payload } = action;
    const { comment } = payload;

    yield put(globalActions.showTopLoading());

    try {
        yield call(commentService.updateComment, comment.toJS());
        yield put(commentActions.updateComment(comment));
        yield put(commentActions.closeCommentEditor(comment.get('postId'), comment.get('objectId')));
        yield put(globalActions.hideTopLoading());
    } catch (error) {
        yield put(globalActions.showMessage(error.message));
        yield put(globalActions.hideTopLoading());
    }
}

/**
 * Async delete comment on server
 */
function* asyncDeleteComment(action: any) {
    const { payload } = action;
    const { id, postId } = payload;

    yield put(globalActions.showTopLoading());

    // Select target post from local store
    const post: Map<string, any> = yield select(postSelector.getPost, { postId });

    try {
        yield call(commentService.deleteComment, id, postId);
        yield put(commentActions.deleteComment(id, postId));

        // Update post comment counter in local store
        const counter = Number(post.get('commentCounter', 0)) - 1;

        const commentPost = post.set('commentCounter', counter);
        yield put(postActions.updatePostComments(commentPost));
        yield put(globalActions.hideTopLoading());
    } catch (error) {
        // Update post comment counter in local store
        const counter = Number(post.get('commentCounter', 0)) + 1;

        const commentPost = post.set('commentCounter', counter);
        yield put(postActions.updatePostComments(commentPost));
        yield put(globalActions.showMessage(error.message));
        yield put(globalActions.hideTopLoading());
    }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/
export default function* commentSaga() {
    yield all([
        takeEvery(CommentActionType.DB_FETCH_COMMENTS, dbFetchComments),
        takeEvery(CommentActionType.ASYNC_ADD_NEW_COMMENT, asyncSaveComment),
        takeEvery(CommentActionType.ASYNC_UPDATE_COMMENT, asyncUpdateComment),
        takeEvery(CommentActionType.ASYNC_DELETE_COMMENT, asyncDeleteComment),
    ]);
}
