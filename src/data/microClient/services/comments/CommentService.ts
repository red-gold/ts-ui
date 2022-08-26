import { Comment } from 'core/domain/comments/comment';
import { SocialError } from 'core/domain/common/socialError';
import { ICommentService } from 'core/services/comments/ICommentService';
import { Map, fromJS } from 'immutable';
import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { throwNoValue } from 'utils/errorHandling';

/**
 * Firbase comment service
 */
@injectable()
export class CommentService implements ICommentService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    /**
     * Add comment
     */
    public addComment = async (comment: Comment) => {
        try {
            const result = await this._httpService.post('comments', comment);
            return result.objectId;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Get comments
     */
    public getComments = async (postId: string, page?: number, limit?: number) => {
        try {
            const resultSearch = await this._httpService.get(
                `comments?postId=${postId}&page=${(page || 0) + 1}&limit=${limit}`,
            );
            const commentCount = resultSearch ? resultSearch.length : 0;
            let parsedData: Map<string, any> = Map({});
            let commentIds: Map<string, boolean> = Map({});
            if (resultSearch) {
                resultSearch.forEach((comment: any) => {
                    const commentID = throwNoValue(comment.objectId, 'comment.objectId');
                    parsedData = parsedData.set(
                        commentID,
                        fromJS({ ...comment, id: comment.objectId, creationDate: comment.created_date }),
                    );
                    commentIds = commentIds.set(commentID, true);
                });
            }

            return {
                comments: parsedData,
                ids: commentIds,
                newLastCommentId: commentCount > 0 ? resultSearch[0].objectId : '',
                hasMore: !(commentCount < (limit || 10)),
            };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Update comment
     */
    public updateComment = async (comment: Comment) => {
        try {
            await this._httpService.put('comments', { ...comment, objectId: comment.id });
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Delete comment
     *
     * @memberof CommentService
     */
    public deleteComment = async (commentId: string, postId: string) => {
        try {
            await this._httpService.delete(`comments/id/${commentId}/post/${postId}`);
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };
}
