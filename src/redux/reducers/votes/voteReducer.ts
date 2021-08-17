import { VoteActionType } from 'constants/voteActionType';
import { Map } from 'immutable';

import { IVoteAction } from './IVoteAction';
import { VoteState } from './VoteState';

// - Import action types
// Import domain
/**
 * Vote actions
 */
export const voteReducer = (state = Map(new VoteState() as any), action: IVoteAction) => {
    const { payload } = action;
    switch (action.type) {
        /* _____________ CRUD _____________ */
        case VoteActionType.ADD_VOTE:
            return state.setIn(['postVotes', payload.get('postId'), payload.get('ownerUserId')], payload);

        case VoteActionType.ADD_VOTE_LIST:
            return state.set('postVotes', payload).set('loaded', true);

        case VoteActionType.DELETE_VOTE:
            return state.deleteIn(['postVotes', payload.postId, payload.userId]);

        case VoteActionType.CLEAR_ALL_DATA_VOTE:
            return Map(new VoteState() as any);

        default:
            return state;
    }
};
