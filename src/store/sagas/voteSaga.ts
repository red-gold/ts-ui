import { VoteActionType } from 'constants/voteActionType';
import { IVoteService } from 'core/services/votes/IVoteService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map } from 'immutable';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { provider } from '../../socialEngine';
import * as voteActions from 'store/actions/voteActions';
import * as postActions from 'store/actions/postActions';
import * as globalActions from 'store/actions/globalActions';
import { authorizeSelector } from '../reducers/authorize/authorizeSelector';
import moment from 'moment/moment';
import { Vote } from 'core/domain/votes/vote';
import { postSelector } from '../reducers/posts/postSelector';
import { log } from 'utils/log';

/**
 * Get service providers
 */
const voteService: IVoteService = provider.get<IVoteService>(SocialProviderTypes.VoteService);

/***************************** Subroutines ************************************/

/**
 * Send vote to server
 */
function* asyncSaveVote(action: any) {
    const { payload } = action;
    const { ownerPostUserId, postId } = payload;
    yield put(globalActions.showTopLoading());
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid: string = authedUser.get('uid', '0');
    const newVote: Vote = {
        postId: postId,
        creationDate: moment.utc().valueOf(),
        ownerDisplayName: authedUser.get('fullName'),
        ownerAvatar: authedUser.get('avatar'),
        ownerUserId: uid,
        receiverId: ownerPostUserId,
    };

    // Select target post from local store
    const post: Map<string, any> = yield select(postSelector.getPost, { postId });
    try {
        // Update post score in local store
        const score = Number(post.get('score', 0)) + 1;

        const votedPost = post.set('score', score).setIn(['votes', uid], true);
        yield put(postActions.updatePostVotes(votedPost));

        // Save vote on server
        const newVoteId = yield call(voteService.addVote, newVote);
        newVote.id = newVoteId;
        yield put(voteActions.addVote(Map({ ...newVote })));

        yield put(globalActions.hideTopLoading());
    } catch (error) {
        log.error('error', error);

        const score = post.get('score', 0) - 1;
        const votedPost = post.set('score', score).setIn(['votes', uid], false);

        yield put(postActions.updatePostVotes(votedPost));
        yield put(globalActions.showMessage(error.message));
        yield put(globalActions.hideTopLoading());
    }
}

/**
 * Async delete vote on server
 */
function* asyncDeleteVote(action: any) {
    const { payload } = action;
    const { ownerPostUserId, postId } = payload;

    yield put(globalActions.showTopLoading());
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid: string = authedUser.get('uid', '0');

    // Select target post from local store
    const post: Map<string, any> = yield select(postSelector.getPost, { postId });
    try {
        // Update post score in local store
        const score = Number(post.get('score', 0)) - 1;
        const votedPost = post.set('score', score).setIn(['votes', uid], false);
        yield put(postActions.updatePostVotes(votedPost));

        // Save vote on server
        yield call(voteService.deleteVote, ownerPostUserId, postId);
        yield put(voteActions.deleteVote(ownerPostUserId, postId));

        yield put(globalActions.hideTopLoading());
    } catch (error) {
        const score = post.get('score', 0) + 1;
        const votedPost = post.set('score', score).setIn(['votes', uid], true);

        yield put(postActions.updatePostVotes(votedPost));
        yield put(globalActions.showMessage(error.message));
        yield put(globalActions.hideTopLoading());
    }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/
export default function* voteSaga() {
    yield all([
        takeLatest(VoteActionType.ASYNC_ADD_NEW_VOTE, asyncSaveVote),
        takeLatest(VoteActionType.ASYNC_DELETE_VOTE, asyncDeleteVote),
    ]);
}
