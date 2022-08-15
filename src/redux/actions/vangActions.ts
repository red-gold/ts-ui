import { VangActionType } from 'constants/vangActionType';
import { Map } from 'immutable';

/**
 * Fetch chat message subscribe
 */
export const dbSubscribeChatMessage = (chatRoomId: string) => {
    return {
        type: VangActionType.DB_SUBSCRIBE_CHAT_MESSAGE,
        payload: {
            chatRoomId,
        },
    };
};

/**
 * Fetch chat message
 */
export const dbFetchChatMessageOnce = (chatRoomId: string) => {
    return {
        type: VangActionType.DB_FETCH_CHAT_MESSAGE_ONCE,
        payload: {
            chatRoomId,
        },
    };
};

/**
 * Set chat language on server
 */
export const dbSetChatLanguage = (input: string, output: string, roomId: string) => {
    return {
        type: VangActionType.DB_SET_CHAT_LANGUAGE,
        payload: { input, output, roomId },
    };
};

/**
 * Fetch peer chatroom
 */
export const dbFetchPeerChatRoom = (chatRoomId: string) => {
    return {
        type: VangActionType.DB_FETCH_PEER_CHAT_ROOMS,
        payload: {
            chatRoomId,
        },
    };
};

/**
 * Add chat messages
 */
export const addChatRoomMessages = (messages: Map<string, Map<string, any>>, chatRoomId: string) => {
    return {
        type: VangActionType.ADD_CHAT_ROOM_MESSAGES,
        payload: { messages, chatRoomId },
    };
};

/**
 * Add plain chat messages
 */
export const addPlainChatRoomMessages = (messages: any, roomId: string) => {
    return {
        type: VangActionType.ADD_PLAIN_CHAT_ROOM_MESSAGES,
        payload: { messages, roomId },
    };
};

/**
 * Add plain chat messages
 */
export const increaseRoomMessageCount = (roomId: string, amount: number) => {
    return {
        type: VangActionType.INCREASE_ROOM_MESSAGE_COUNT,
        payload: { roomId, amount },
    };
};

/**
 * Active peer chat room
 */
export const activePeerChatRoom = (peerUserId: string) => {
    return {
        type: VangActionType.ACTIVE_PEER_CHAT_ROOM,
        payload: { peerUserId },
    };
};

/**
 * Set peer user active status to active
 */
export const setPeerActive = (roomId: string, userId: string) => {
    return {
        type: VangActionType.CHAT_SET_PEER_ACTIVE,
        payload: { roomId, userId },
    };
};

/**
 * Set active chat room
 */
export const setActiveChatRoom = (payload: any) => {
    return {
        type: VangActionType.SET_ACTIVE_ROOM,
        payload,
    };
};

/**
 * Add active chat room
 */
export const addActiveChatRoom = (roomId: string) => {
    return {
        type: VangActionType.ADD_ACTIVE_ROOM,
        payload: { roomId },
    };
};

/**
 * Close active chat room
 */
export const closeActiveChatRoom = (roomId: string) => {
    return {
        type: VangActionType.CLOSE_ACTIVE_ROOM,
        payload: { roomId },
    };
};

/**
 * Close all active chat rooms
 */
export const closeAllActiveChatRooms = () => {
    return {
        type: VangActionType.CLOSE_ALL_ACTIVE_ROOM,
    };
};

/**
 * Add active chat room
 */
export const addChatRoom = (payload: any) => {
    return {
        type: VangActionType.ADD_ROOM,
        payload,
    };
};

/**
 * Add active chat rooms
 */
export const addChatRooms = (payload: any) => {
    return {
        type: VangActionType.ADD_ROOMS,
        payload,
    };
};

/**
 * Active chat room
 */
export const activeChatRoom = (roomId: string) => {
    return {
        type: VangActionType.ACTIVE_CHAT_ROOM,
        payload: { roomId },
    };
};

/**
 * Websocket connect
 */
export const wsConnect = () => {
    return {
        type: VangActionType.WS_START,
        payload: {},
    };
};

/**
 * Websocket disconnect
 */
export const wsDisconnect = () => {
    return {
        type: VangActionType.WS_DISCONNECT,
        payload: {},
    };
};

/**
 * Async create chat request
 */
export const asyncCreateChatRequest = (recUserId: string) => {
    return {
        type: VangActionType.ASYNC_CREATE_CHAT_REQUEST,
        payload: { recUserId },
    };
};

/**
 * Query messages
 */
export const queryMessages = (requestId: string, roomId: string, page: number, lte: number, gte: number) => {
    return {
        type: VangActionType.QUERY_MESSAGE,
        payload: { requestId, roomId, page, lte, gte },
    };
};

/**
 * Set chat room
 */
export const setChatRoom = (roomId: string, data: Map<string, any>) => {
    return {
        type: VangActionType.SET_CHAT_ROOM,
        payload: { roomId, data },
    };
};

/**
 * Set chat room first message fetched
 */
export const setRoomFirstMessageFetched = (roomId: string, message: Map<string, any>) => {
    return {
        type: VangActionType.SET_ROOM_FIRST_MESSAGE_FETCHED,
        payload: { roomId, message },
    };
};

/**
 * Set chat room last message fetched
 */
export const setRoomLastMessage = (roomId: string, message: Map<string, any>) => {
    return {
        type: VangActionType.SET_ROOM_LAST_MESSAGE,
        payload: { roomId, message },
    };
};

/**
 * Set has more messages for room
 */
export const setHasMoreMessages = (roomId: string, type: string) => {
    return {
        type: VangActionType.HAS_MORE_MESSAGES,
        payload: { roomId, type },
    };
};

/**
 * Set no more messages for room
 */
export const setNoMoreMessages = (roomId: string, type: string) => {
    return {
        type: VangActionType.NO_MORE_MESSAGES,
        payload: { roomId, type },
    };
};

/**
 * Update read message meta
 */
export const updateReadMessageMeta = (
    roomId: string,
    messageId: string,
    readCount: number,
    messageCreatedDate: number,
) => {
    return {
        type: VangActionType.UPDATE_READ_MESSAGE_META,
        payload: { roomId, messageId, readCount, messageCreatedDate },
    };
};

/**
 * Update room user read meta
 */
export const updateRoomUserReadMeta = (roomId: string, userId: string, readCount: number, readDate: number) => {
    return {
        type: VangActionType.UPDATE_ROOM_USER_READ_META,
        payload: { roomId, userId, readCount, readDate },
    };
};

/**
 * Async cancel chat request
 */
export const asyncCancelChatRequest = (recUserId: string) => {
    return {
        type: VangActionType.ASYNC_CANCEL_CHAT_REQUEST,
        payload: { recUserId },
    };
};

/**
 * Async ignore chat request
 */
export const asyncIgnoreChatRequest = (reqUserId: string) => {
    return {
        type: VangActionType.ASYNC_IGNORE_CHAT_REQUEST,
        payload: { reqUserId },
    };
};

/**
 * Async accept chat request
 */
export const asyncAcceptChatRequest = (reqUserId: string) => {
    return {
        type: VangActionType.ASYNC_ACCEPT_CHAT_REQUEST,
        payload: { reqUserId },
    };
};

/**
 * Async join chatroom
 */
export const asyncJoinChatroom = (roomId: string) => {
    return {
        type: VangActionType.ASYNC_JOIN_CHAT_ROOM,
        payload: { roomId },
    };
};

/**
 * Set current chat information
 */
export const setCurrentChat = (userId: string) => {
    return {
        type: VangActionType.SET_CURRENT_CHAT,
        payload: { userId },
    };
};

/**
 * Close chat window
 */
export const closeChat = () => {
    return {
        type: VangActionType.CLOSE_CHAT,
    };
};

/**
 * Open room
 */
export const openRoom = (roomId: string) => {
    return {
        type: VangActionType.OPEN_ROOM,
        payload: { roomId },
    };
};

/**
 * Close recent chat window
 */
export const closeRecentChat = () => {
    return {
        type: VangActionType.CLOSE_RECENT_CHAT,
    };
};

/**
 * Open recent chat window
 */
export const openRecentChat = () => {
    return {
        type: VangActionType.OPEN_RECENT_CHAT,
    };
};

/**
 * Remove chat history
 */
export const removeChatHistory = (roomId: string) => {
    return { type: VangActionType.REMOVE_CHAT_HISTORY, payload: { roomId } };
};

/**
 * Remove chat history on server
 */
export const dbRemoveChatHistory = (roomId: string) => {
    return { type: VangActionType.DB_REMOVE_CHAT_HISTORY, payload: { roomId } };
};

/**
 * Add chat request
 */
export const addChatRequest = (userId: string) => {
    return {
        type: VangActionType.ADD_CHAT_REQUEST,
        payload: { userId },
    };
};

/**
 * Remove chat request
 */
export const removeChatRequest = (userId: string) => {
    return {
        type: VangActionType.REMOVE_CHAT_REQUEST,
        payload: { userId },
    };
};

/**
 * Add chat calling
 */
export const addChatCalling = (userId: string) => {
    return {
        type: VangActionType.ADD_CHAT_CALLING,
        payload: { userId },
    };
};

/**
 * Remove chat calling
 */
export const removeChatCalling = (userId: string) => {
    return {
        type: VangActionType.REMOVE_CHAT_CALLING,
        payload: { userId },
    };
};

/**
 * Add chat connect
 */
export const addChatConnect = (userId: string, room: object) => {
    return {
        type: VangActionType.ADD_CHAT_CONNECT,
        payload: { userId, room },
    };
};

/**
 * Remove chat connect
 */
export const removeChatConnect = (userId: string) => {
    return {
        type: VangActionType.REMOVE_CHAT_CONNECT,
        payload: { userId },
    };
};

/**
 * Clear all data
 */
export const clearAllChat = () => {
    return { type: VangActionType.CLEAR_ALL_CHAT_MESSAGE };
};
