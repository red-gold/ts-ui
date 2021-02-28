import { Map } from 'immutable';
import { Comment } from 'core/domain/comments/comment';

/**
 * Comment service interface
 *
 * @export
 * @interface ICommentService
 */
export interface ICommentService {
    addComment: (comment: Comment) => Promise<string>;
    getComments: (
        postId: string,
        page?: number,
        limit?: number,
    ) => Promise<{ comments: Map<string, any>; ids: Map<string, boolean>; newLastCommentId: string; hasMore: boolean }>;
    updateComment: (comment: Comment) => Promise<void>;
    deleteComment: (commentId: string, postId: string) => Promise<void>;
}
