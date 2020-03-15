import { VoteActionType } from 'constants/voteActionType';
import { Vote } from 'core/domain/votes';
import {Map} from 'immutable'
// - Import action types
// - Import domain
// - Import actions
/**
 * Get service providers
 */

/* _____________ CRUD DB _____________ */

/**
 *  Add vote to database
 */
export const dbAddVote = (postId: string,ownerPostUserId: string) => {
  return { type: VoteActionType.ASYNC_ADD_NEW_VOTE, payload: {postId, ownerPostUserId} }
}


/**
 * Delete a vote from database
 */
export const dbDeleteVote = (postId: string, ownerPostUserId: string) => {
  return { type: VoteActionType.ASYNC_DELETE_VOTE, payload: {postId, ownerPostUserId} }
}

/**
 * Add a vote
 * @param {Vote} vote
 */
export const addVote = (vote: Map<string, any>) => {
  return { type: VoteActionType.ADD_VOTE, payload: vote }

}

/**
 * delete a vote
 * @param {string} id vote identifier
 * @param {string} postId post identifier which vote on
 */
export const deleteVote = (userId: string, postId: string) => {
  return { type: VoteActionType.DELETE_VOTE, payload: {userId, postId} }

}

/**
 * Ad a list of vote
 * @param {[postId:string]: {[voteId: string]: Vote}} votes a list of vote
 */
export const addVoteList = (votes: {[postId: string]: {[voteId: string]: Vote}}) => {
  return { type: VoteActionType.ADD_VOTE_LIST, payload: votes }

}

/**
 * Clear all data
 */
export const clearAllvotes = () => {
  return { type: VoteActionType.CLEAR_ALL_DATA_VOTE }
}
