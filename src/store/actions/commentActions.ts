// - Import react components
import { CommentActionType } from 'constants/commentActionType';
import { Map } from 'immutable';
import { Comment } from 'core/domain/comments/comment';

/* _____________ CRUD DB _____________ */

/**
 *  Add comment to database
 */
export const dbAddComment = (newComment: Map<string, any>): any => {
    return {
        type: CommentActionType.ASYNC_ADD_NEW_COMMENT,
        payload: { newComment },
    };
};

/**
 * Get all comments from database
 */
export const dbFetchComments = (ownerUserId: string, postId: string, page: number, limit: number): any => {
    return {
        type: CommentActionType.DB_FETCH_COMMENTS,
        payload: { postId, ownerUserId, page, limit },
    };
};

/**
 * Update a comment from database
 */
export const dbUpdateComment = (comment: Map<string, any>): any => {
    return {
        type: CommentActionType.ASYNC_UPDATE_COMMENT,
        payload: { comment },
    };
};

/**
 * Delete a comment from database
 */
export const dbDeleteComment = (id?: string | null, postId?: string): any => {
    return {
        type: CommentActionType.ASYNC_DELETE_COMMENT,
        payload: { postId, id },
    };
};

/* _____________ CRUD State _____________ */

/**
 * Add comment
 * @param {Comment} data
 */
export const addComment = (comment: Map<string, any>): any => {
    return {
        type: CommentActionType.ADD_COMMENT,
        payload: comment,
    };
};

/**
 * Update comment
 */
export const updateComment = (comment: Map<string, any>): any => {
    return {
        type: CommentActionType.UPDATE_COMMENT,
        payload: { comment },
    };
};

/**
 * Add comment list
 */
export const addCommentList = (postId: string, entities: Map<string, any>): any => {
    return {
        type: CommentActionType.ADD_COMMENT_LIST,
        payload: { postId, entities },
    };
};

/**
 * Delete a comment
 */
export const deleteComment = (id: string, postId: string): any => {
    return { type: CommentActionType.DELETE_COMMENT, payload: { id, postId } };
};

/**
 * Set the post has more comments
 */
export const hasMoreComments = (postId: string): any => {
    return {
        type: CommentActionType.HAS_MORE_COMMENTS,
        payload: { postId },
    };
};

/**
 * Set the post has no more comments
 */
export const notMoreComments = (postId: string): any => {
    return {
        type: CommentActionType.NO_MORE_COMMENTS,
        payload: { postId },
    };
};

/**
 * Clear all data
 */
export const clearAllData = (): any => {
    return {
        type: CommentActionType.CLEAR_ALL_DATA_COMMENT,
    };
};

export const openCommentEditor = (postId: string, commentId: string): any => {
    return {
        type: CommentActionType.OPEN_COMMENT_EDITOR,
        payload: { postId, commentId },
    };
};

export const closeCommentEditor = (postId: string, commentId: string): any => {
    return {
        type: CommentActionType.CLOSE_COMMENT_EDITOR,
        payload: { postId, commentId },
    };
};
