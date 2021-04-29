import { Message } from 'core/domain/chat/message';

/**
 * Chat interface
 */
export interface IChatService {
    wsConnect: (url: string, uid: string, callback: Function) => Function;

    createChatRquest: (recUserId: string) => void;

    cancelChatRquest: (recUserId: string) => void;

    ignoreChatRquest: (reqUserId: string) => void;

    acceptChatRquest: (reqUserId: string) => void;

    closeChat: (userId: string) => void;

    joinChatRoom: (roomId: string) => void;

    requestActiveRoom: (peerUserId: string) => void;

    createChatMessage: (message: Message) => void;

    openRoom: (roomId: string) => void;

    queryRoomMessages: (requestId: string, roomId: string, page: number, lte: number, gte: number) => void;

    updateReadMessageMeta: (roomId: string, messageId: string, readCount: number, messageCreatedDate: number) => void;
}
