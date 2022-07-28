import { Comment } from 'core/domain/comments/comment';

export type postComments = { [postId: string]: { [commentId: string]: Comment } };
export type comments = { [commentId: string]: Comment };
