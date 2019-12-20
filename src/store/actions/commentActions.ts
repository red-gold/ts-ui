// - Import react components
import { CommentActionType } from 'constants/commentActionType';
import { User } from 'core/domain/users';
import { Map } from 'immutable';
import moment from 'moment/moment';
import { Comment } from 'core/domain/comments';
import { SocialError } from 'core/domain/common';
import { ICommentService } from 'core/services/comments';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { provider } from '../../socialEngine';
import * as globalActions from 'store/actions/globalActions';
import { userSelector } from 'store/reducers/users/userSelector';

// - Import domain
// - Import action types
// - Import actions
/**
 * Get service providers
 */
const commentService: ICommentService = provider.get<ICommentService>(SocialProviderTypes.CommentService)

/* _____________ CRUD DB _____________ */

/**
 *  Add comment to database
 */
export const dbAddComment = ( newComment: Map<string, any>) => {
  return {
    type: CommentActionType.ASYNC_ADD_NEW_COMMENT,
    payload: {newComment}
  }
}

/**
 * Get all comments from database
 */
export const dbFetchComments = (ownerUserId: string, postId: string, page: number, limit: number) => {
  return {
    type: CommentActionType.DB_FETCH_COMMENTS,
    payload: {postId, ownerUserId, page, limit}
  }
}

/**
 * Update a comment from database
 */
export const dbUpdateComment = (comment: Map<string, any>) => {
  return {
    type: CommentActionType.ASYNC_UPDATE_COMMENT,
    payload: {comment}
  }
}

/**
 * Delete a comment from database
 */
export const dbDeleteComment = (id?: string | null, postId?: string) => {
  return {
    type: CommentActionType.ASYNC_DELETE_COMMENT,
    payload: {postId, id}
  }

}

/* _____________ CRUD State _____________ */

/**
 * Add comment
 * @param {Comment} data
 */
export const addComment = (comment: Map<string, any>) => {

  return {
    type: CommentActionType.ADD_COMMENT,
    payload: comment
  }
}

/**
 * Update comment
 */
export const updateComment = (comment: Map<string, any>) => {

  return {
    type: CommentActionType.UPDATE_COMMENT,
    payload: { comment }
  }
}

/**
 * Add comment list
 */
export const addCommentList = (postId: string, entities: Map<string, any>) => {

  return {
    type: CommentActionType.ADD_COMMENT_LIST,
    payload: {postId, entities}
  }
}

/**
 * Delete a comment
 */
export const deleteComment = (id: string, postId: string) => {
  return { type: CommentActionType.DELETE_COMMENT, payload: { id, postId } }

}


/**
 * Set the post has more comments
 */
export const hasMoreComments = (postId: string) => {
  return {
    type: CommentActionType.HAS_MORE_COMMENTS,
    payload: {postId}
  }
}

/**
 * Set the post has no more comments
 */
export const notMoreComments = (postId: string) => {
  return {
    type: CommentActionType.NO_MORE_COMMENTS,
    payload: {postId}
  }
}

/**
 * Clear all data
 */
export const clearAllData = () => {
  return {
    type: CommentActionType.CLEAR_ALL_DATA_COMMENT
  }
}

export const openCommentEditor = (comment: Comment) => {

  return {
    type: CommentActionType.OPEN_COMMENT_EDITOR,
    payload: comment
  }
}

export const closeCommentEditor = (postId: string, id: string) => {

  return {
    type: CommentActionType.CLOSE_COMMENT_EDITOR,
    payload: {postId, id}
  }
}
