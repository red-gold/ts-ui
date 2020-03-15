import {Map} from 'immutable'

/**
 * Vote state
 *
 * @export
 * @class VoteState
 */
export class VoteState {

    /**
     * The list of posts vote
     */
  postVotes: Map<string,Map<string, any>> = Map({})

    /**
     * If posts vote are loaded {true} or not {false}
     *
     * @type {Boolean}
     * @memberof VoteState
     */
  loaded: Boolean = false
}
