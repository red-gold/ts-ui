import i18next from 'i18next';
import { Map } from 'immutable';

export interface ICommentInputProps {
    postId: string;
    send: (newComment: Map<string, any>) => void;
    currentUser: Map<string, any>;
    t: i18next.TFunction;
}
