import { SocialError } from 'core/domain/common/socialError';
import type { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { IVangService } from 'core/services/vang/IVangService';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { inject, injectable } from 'inversify';
import { io, Socket } from 'socket.io-client';
import { log } from 'utils/log';

/**
 * Vang service
 */
@injectable()
export class VangService implements IVangService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    @inject(SocialProviderTypes.AuthorizeService) private _authorizeService: IAuthorizeService;

    socket: Socket | null = null;

    constructor() {
        this.wsConnect = this.wsConnect.bind(this);
        this.wsDisconnect = this.wsDisconnect.bind(this);
    }

    /**
     * Connect to websocket server
     */
    public wsConnect = (url: string, uid: string, callback: Function) => {
        const accessToken = this._authorizeService.getAccessToken();
        this.socket = io(url, {
            query: { uid },
            withCredentials: true,
            auth: { token: accessToken },
            transports: ['websocket'],
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
    };

    /**
     * Close connection to websocket server
     */
    public wsDisconnect = () => {
        return this.socket?.close();
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
    public requestActiveRoom = (payload: { peerUserId?: string; socialName?: string; responseActionType?: string }) => {
        if (this.socket) {
            this.socket.emit('request-active-room', payload);
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

    // API CALL //

    /**
     * Updare post
     */
    public getActivePeerRoom = (roomId: string) => {
        try {
            return this._httpService.get(`vang/active-room/${roomId}`);
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };
}
