import { Message } from 'core/domain/chat/message';
import { Map } from 'immutable';
import { ChatRoom } from 'core/domain/chat/chatRoom';

/**
 * Chat interface
 */
export interface IChatService {
    wsConnect: (url: string, accessKey: string, uid: string, callback: Function) => Function;

    createChatRquest: (recUserId: string) => void;

    cancelChatRquest: (recUserId: string) => void;

    ignoreChatRquest: (reqUserId: string) => void;

    acceptChatRquest: (reqUserId: string) => void;

    closeChat: (userId: string) => void;

    joinChatRoom: (roomId: string) => void;

    createChatMessage: (message: Message) => void;

    // ************************ //
    // ** Old implementation ** //TODO: Remove unused functions
    // ************************ //
    /**
     * Create chat room
     */
    createChatRoom: (chatRoom: ChatRoom) => Promise<Map<string, any>>;

    /**
     * Get chat room
     */
    getPeerChatRoom: (firstUserId: string, secondUserId: string) => Promise<Map<string, any>>;

    /**
     * Set chat room language
     */
    setChatLangauge: (uid: string, input: string, output: string, roomId: string) => Promise<void>;
    /**
     * Get chat message
     */
    subscribeChatMessages: (chatRoomId: string, callback: (messages: Map<string, any>) => void) => any;

    /**
     * Get chat message
     */
    getChatMessages: (chatRoomId: string) => Promise<Map<string, any>>;

    /**
     * Remove chat room message history
     */
    removeHistoryRoom: (chatRoomId: string) => any;
}
