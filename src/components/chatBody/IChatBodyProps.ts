import { User } from 'core/domain/users/user';
import { ChatMessageModel } from 'models/chat/chatMessageModel';

export interface IChatBodyProps {
    /**
     * Translate to locale string
     */
    t?: (state: any) => any;

    /**
     * Chat messages
     */
    chatMessages: ChatMessageModel[];

    /**
     * Styles
     */
    classes?: any;

    /**
     * Current user
     */
    currentUser: User;
}
