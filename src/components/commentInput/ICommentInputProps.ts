import { Map } from 'immutable';

export interface ICommentInputProps {
    postId: string;
    send: (newComment: Map<string, any>) => void;
    currentUser: Map<string, any>;
}
