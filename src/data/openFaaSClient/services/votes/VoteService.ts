import { SocialError } from 'core/domain/common/socialError';
import { Vote } from 'core/domain/votes/vote';
import { IVoteService } from 'core/services/votes/IVoteService';
import { injectable, inject } from 'inversify';
import { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map } from 'immutable';

/**
 * Firbase vote service
 */
@injectable()
export class VoteService implements IVoteService {
    @inject(SocialProviderTypes.Httpervice) private _httpService: IHttpService;

    /**
     * Add vote
     */
    public addVote = async (vote: Vote) => {
        try {
            const result = await this._httpService.post('votes', vote);
            return result.objectId;
        } catch (error) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Get votes
     */
    public getVotes = async (postId: string, page: number, limit: number) => {
        try {
            const result = await this._httpService.get(`votes?postId=${postId}&page=${page}&limit=${limit}`);
            let parsedData: Map<string, Map<string, any>> = Map({});
            result.forEach((vote: any) => {
                const parsedVote = {
                    id: vote.objectId,
                    creationDate: vote['created_date'],
                };
                parsedData = parsedData.set(vote.objectId, Map(parsedVote));
            });
            return parsedData;
        } catch (error) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Delete vote
     */
    public deleteVote = async (userId: string, postId: string) => {
        try {
            await this._httpService.delete(`votes/post/${postId}`);
        } catch (error) {
            throw new SocialError(error.code, error.message);
        }
    };
}
