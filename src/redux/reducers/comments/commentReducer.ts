import { CommentActionType } from 'constants/commentActionType';
import { Map } from 'immutable';

import { CommentState } from './CommentState';
import { ICommentAction } from './ICommentAction';

// - Import domain
// - Import action types
/**
 * Comment reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line default-param-last
export const commentReducer = (state = Map(new CommentState() as any), action: ICommentAction) => {
    const { payload } = action;
    switch (action.type) {
        /* _____________ CRUD _____________ */
        case CommentActionType.ADD_COMMENT:
            return state.setIn(['postComments', payload.get('postId'), payload.get('objectId')], payload);

        case CommentActionType.ADD_COMMENT_LIST:
            return state.mergeIn(['postComments', payload.postId], payload.entities).set('loaded', true);

        case CommentActionType.UPDATE_COMMENT:
            return state.updateIn(
                ['postComments', payload.comment.get('postId'), payload.comment.get('objectId'), 'text'],
                () => payload.comment.get('text'),
            );

        case CommentActionType.DELETE_COMMENT:
            return state.deleteIn(['postComments', payload.postId, payload.id]);

        case CommentActionType.CLOSE_COMMENT_EDITOR:
            return state.setIn(['editorStatus', payload.postId, payload.commentId], false);

        case CommentActionType.OPEN_COMMENT_EDITOR:
            return state.setIn(['editorStatus', payload.postId, payload.commentId], true);

        case CommentActionType.HAS_MORE_COMMENTS:
            return state.setIn(['ui', 'posts', payload.postId, 'hasMoreData'], true);

        case CommentActionType.NO_MORE_COMMENTS:
            return state.setIn(['ui', 'posts', payload.postId, 'hasMoreData'], false);

        case CommentActionType.CLEAR_ALL_DATA_COMMENT:
            return Map(new CommentState() as any);
        default:
            return state;
    }
};
