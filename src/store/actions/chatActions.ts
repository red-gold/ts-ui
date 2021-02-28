import { ChatActionType } from 'constants/chatActionType';
import { Message } from 'core/domain/chat/message';
import { Map } from 'immutable';

/**
 * Fetch chat message subscribe
 */
export const dbSubscribeChatMessage = (chatRoomId: string) => {
    return {
        type: ChatActionType.DB_SUBSCRIBE_CHAT_MESSAGE,
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
        type: ChatActionType.DB_FETCH_CHAT_MESSAGE_ONCE,
        payload: {
            chatRoomId,
        },
    };
};

/**
 * Create chat message on server
 */
export const dbCreateChatMessage = (message: Message) => {
    return {
        type: ChatActionType.DB_CREATE_CHAT_MESSAGE,
        payload: message,
    };
};

/**
 * Set chat language on server
 */
export const dbSetChatLanguage = (input: string, output: string, roomId: string) => {
    return {
        type: ChatActionType.DB_SET_CHAT_LANGUAGE,
        payload: { input, output, roomId },
    };
};

/**
 * Create chat room on server
 */
export const dbCreateChatRoom = (message: Message) => {
    return {
        type: ChatActionType.DB_CREATE_CHAT_ROOM,
        payload: message,
    };
};

/**
 * Fetch peer chatroom
 */
export const dbFetchPeerChatRoom = (chatRoomId: string) => {
    return {
        type: ChatActionType.DB_FETCH_PEER_CHAT_ROOMS,
        payload: {
            chatRoomId,
        },
    };
};

/**
 * Add chat messages
 */
export const addChatRoomMessages = (messages: Map<string, any>, chatRoomId: string) => {
    return {
        type: ChatActionType.ADD_CHAT_ROOM_MESSAGES,
        payload: { messages, chatRoomId },
    };
};

/**
 * Add plain chat messages
 */
export const addPlainChatRoomMessages = (messages: any, roomId: string) => {
    return {
        type: ChatActionType.ADD_PLAIN_CHAT_ROOM_MESSAGES,
        payload: { messages, roomId },
    };
};

/**
 * Active peer chat room
 */
export const activePeerChatRoom = (receiverId: string) => {
    return {
        type: ChatActionType.ACTIVE_PEER_CHAT_ROOM,
        payload: { receiverId },
    };
};

/**
 * Websocket connect
 */
export const wsConnect = () => {
    return {
        type: ChatActionType.WS_CONNECT,
        payload: {},
    };
};

/**
 * Async create chat request
 */
export const asyncCreateChatRequest = (recUserId: string) => {
    return {
        type: ChatActionType.ASYNC_CREATE_CHAT_REQUEST,
        payload: { recUserId },
    };
};

/**
 * Async cancel chat request
 */
export const asyncCancelChatRequest = (recUserId: string) => {
    return {
        type: ChatActionType.ASYNC_CANCEL_CHAT_REQUEST,
        payload: { recUserId },
    };
};

/**
 * Async ignore chat request
 */
export const asyncIgnoreChatRequest = (reqUserId: string) => {
    return {
        type: ChatActionType.ASYNC_IGNORE_CHAT_REQUEST,
        payload: { reqUserId },
    };
};

/**
 * Async accept chat request
 */
export const asyncAcceptChatRequest = (reqUserId: string) => {
    return {
        type: ChatActionType.ASYNC_ACCEPT_CHAT_REQUEST,
        payload: { reqUserId },
    };
};

/**
 * Async join chatroom
 */
export const asyncJoinChatroom = (roomId: string) => {
    return {
        type: ChatActionType.ASYNC_JOIN_CHAT_ROOM,
        payload: { roomId },
    };
};

/**
 * Set current chat information
 */
export const setCurrentChat = (userId: string) => {
    return {
        type: ChatActionType.SET_CURRENT_CHAT,
        payload: { userId },
    };
};

/**
 * Close chat window
 */
export const closeChat = () => {
    return {
        type: ChatActionType.CLOSE_CHAT,
    };
};

/**
 * Open chat window
 */
export const openChat = () => {
    return {
        type: ChatActionType.OPEN_CHAT,
    };
};

/**
 * Close recent chat window
 */
export const closeRecentChat = () => {
    return {
        type: ChatActionType.CLOSE_RECENT_CHAT,
    };
};

/**
 * Open recent chat window
 */
export const openRecentChat = () => {
    return {
        type: ChatActionType.OPEN_RECENT_CHAT,
    };
};

/**
 * Remove chat history
 */
export const removeChatHistory = (roomId: string) => {
    return { type: ChatActionType.REMOVE_CHAT_HISTORY, payload: { roomId } };
};

/**
 * Remove chat history on server
 */
export const dbRemoveChatHistory = (roomId: string) => {
    return { type: ChatActionType.DB_REMOVE_CHAT_HISTORY, payload: { roomId } };
};

/**
 * Add chat request
 */
export const addChatRequest = (userId: string) => {
    return {
        type: ChatActionType.ADD_CHAT_REQUEST,
        payload: { userId },
    };
};

/**
 * Remove chat request
 */
export const removeChatRequest = (userId: string) => {
    return {
        type: ChatActionType.REMOVE_CHAT_REQUEST,
        payload: { userId },
    };
};

/**
 * Add chat calling
 */
export const addChatCalling = (userId: string) => {
    return {
        type: ChatActionType.ADD_CHAT_CALLING,
        payload: { userId },
    };
};

/**
 * Remove chat calling
 */
export const removeChatCalling = (userId: string) => {
    return {
        type: ChatActionType.REMOVE_CHAT_CALLING,
        payload: { userId },
    };
};

/**
 * Add chat connect
 */
export const addChatConnect = (userId: string, room: object) => {
    return {
        type: ChatActionType.ADD_CHAT_CONNECT,
        payload: { userId, room },
    };
};

/**
 * Remove chat connect
 */
export const removeChatConnect = (userId: string) => {
    return {
        type: ChatActionType.REMOVE_CHAT_CONNECT,
        payload: { userId },
    };
};

/**
 * Clear all data
 */
export const clearAllChat = () => {
    return { type: ChatActionType.CLEAR_ALL_CHAT_MESSAGE };
};
