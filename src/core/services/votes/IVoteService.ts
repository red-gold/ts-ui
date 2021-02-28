import { Map } from 'immutable';
import { Vote } from 'core/domain/votes/vote';

/**
 * Vote service interface
 *
 * @export
 * @interface IVoteService
 */
export interface IVoteService {
    addVote: (vote: Vote) => Promise<string>;
    getVotes: (postId: string, page: number, limit: number) => Promise<Map<string, Map<string, any>>>;
    deleteVote: (userId: string, postId: string) => Promise<void>;
}
