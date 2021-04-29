// - Import react components
import { Message } from 'core/domain/chat/message';
import { SocialError } from 'core/domain/common/socialError';
import { IChatService } from 'core/services/chat/IChatService';
import { injectable } from 'inversify';
import { io } from 'socket.io-client';
import { log } from 'utils/log';

/**
 * Firbase userSetting service
 */
@injectable()
export class ChatService implements IChatService {
    socket: any = null;

    /**
     * Constructor
     */
    constructor() {
        this.removeHistoryRoom = this.removeHistoryRoom.bind(this);
        this.removeMessagesByBatch = this.removeMessagesByBatch.bind(this);
        this.romveMessages = this.romveMessages.bind(this);
    }

    /**
     * Connect to websocket server
     */
    public wsConnect = (url: string, uid: string, callback: Function) => {
        this.socket = io(url, {
            query: { uid },
            withCredentials: true,
        });

        this.socket.on('connect', () => {
            log.info(`ws is connected.`);
            callback({ signal: 'status', data: 'Connected' });
        });

        this.socket.on('disconnect', () => {
            log.info(`ws is disconnected.`);
            callback({ signal: 'status', data: 'Disconnected' });
        });

        this.socket.on('reconnect', (attemptNumber: number) => {
            log.info(`reconnecting #${attemptNumber} ...`);
            callback({ signal: 'status', data: 'Reconnecting' });
        });

        this.socket.on('dispatch', (action: any) => {
            log.info(`dispatch: `, action);
            if (action) {
                callback({ signal: 'dispatch', data: action });
            } else {
                throw new SocialError('emptyActionError', 'Empty action fired on dispatch from websocket server!');
            }
        });

        this.socket.on('dispatch-list', (actionList: any) => {
            log.info(`dispatch action list: `, actionList);
            if (actionList && actionList.length) {
                for (let index = 0; index < actionList.length; index++) {
                    const action = actionList[index];
                    callback({ signal: 'dispatch', data: action });
                }
            } else {
                throw new SocialError(
                    'emptyActionListError',
                    'Empty action list fired on dispatch from websocket server!',
                );
            }
        });

        return this.socket.close;
    };

    /**
     * Create chat request
     */
    public createChatRquest = (recUserId: string) => {
        if (this.socket) {
            this.socket.emit('request-chat', { recUserId });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Cancel chat request
     */
    public cancelChatRquest = (recUserId: string) => {
        if (this.socket) {
            this.socket.emit('cancel-chat', { recUserId });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Ignore chat request
     */
    public ignoreChatRquest = (reqUserId: string) => {
        if (this.socket) {
            this.socket.emit('ignore-chat', { reqUserId });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Accept chat request
     */
    public acceptChatRquest = (reqUserId: string) => {
        if (this.socket) {
            this.socket.emit('accept-chat', { reqUserId });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Close chat
     */
    public closeChat = (userId: string) => {
        if (this.socket) {
            this.socket.emit('close-chat', { userId });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Join a chat room
     */
    public joinChatRoom = (roomId: string) => {
        if (this.socket) {
            this.socket.emit('join-chat', { roomId });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Join a chat room
     */
    public createChatMessage = (message: Message) => {
        if (this.socket) {
            this.socket.emit('chatroom-message', message);
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Join a chat room
     */
    public requestActiveRoom = (peerUserId: string) => {
        if (this.socket) {
            this.socket.emit('request-active-room', { peerUserId });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Open room
     */
    public openRoom = (roomId: string) => {
        if (this.socket) {
            this.socket.emit('open-room', { roomId });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Query room messages
     */
    public queryRoomMessages = (requestId: string, roomId: string, page: number, lte: number, gte: number) => {
        if (this.socket) {
            this.socket.emit('query-room-messages', { requestId, roomId, page, lte, gte });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    /**
     * Update read message meta
     */
    public updateReadMessageMeta = (
        roomId: string,
        messageId: string,
        readCount: number,
        messageCreatedDate: number,
    ) => {
        if (this.socket) {
            this.socket.emit('read-message-meta', { roomId, messageId, readCount, messageCreatedDate });
        } else {
            throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
        }
    };

    // ************************ //
    // ** Old implementation ** //TODO: Remove unused functions
    // ************************ //

    /**
     * Create chat room
     */
    public createChatRoom = () => {
        return 'Not implemented' as any;
    };

    /**
     * Get chat room
     */
    public getPeerChatRoom = () => {
        return 'Not implemented' as any;
    };

    /**
     * Set chat language
     */
    public setChatLangauge = () => {
        return 'Not implemented' as any;
    };

    /**
     * Get chat messages
     */
    public subscribeChatMessages = () => {
        return 'Not implemented' as any;
    };

    /**
     * Get chat messages
     */
    public getChatMessages = () => {
        return 'Not implemented' as any;
    };

    /**
     * Remove chat room history
     */
    *removeHistoryRoom() {
        yield 'Not implemented' as any;
    }

    *removeMessagesByBatch() {
        yield 'Not implemented' as any;
    }

    *romveMessages() {
        yield 'Not implemented' as any;
    }
}
