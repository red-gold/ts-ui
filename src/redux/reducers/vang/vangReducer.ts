import { VangActionType } from 'constants/vangActionType';
import { List, Map } from 'immutable';

import { IVangAction } from './IVangAction';

const setCurrentChat = (state: Map<string, any>, payload: any) => {
    const { userId } = payload;
    return state.setIn(['currentChat'], userId).set('chatOpen', true);
};

/**
 * Add plain chatroom messages
 */
const addPlainChatRoomMessages = (state: Map<string, any>, payload: any) => {
    const { messages, roomId } = payload;

    let messageList: Map<string, any> = Map({});
    if (messages && messages.length) {
        messages.forEach((message: any) => {
            messageList = messageList.set(message.objectId, Map({ ...message }));
        });
    }
    return state.mergeIn(['messages', roomId], messageList);
};

/**
 * Add chatroom messages
 */
const addChatRoomMessages = (state: Map<string, any>, payload: any) => {
    const { messages, chatRoomId } = payload;
    const oldData = state.getIn(['messages', chatRoomId], Map({})) as Map<string, Map<string, any>>;
    const newData = oldData.merge(messages);
    return state.setIn(['messages', chatRoomId], newData);
};

/**
 * Set chat room
 */
const setChatRoom = (state: Map<string, any>, payload: any) => {
    const { data, roomId } = payload;
    return state.setIn(['room', roomId], data);
};

/**
 * Add active chat room
 */
const addActiveChatRoom = (state: Map<string, any>, payload: any) => {
    const { roomId } = payload;
    return state.setIn(['room', 'active', roomId], true);
};

/**
 * Close active chat room
 */
const closeActiveChatRoom = (state: Map<string, any>, payload: any) => {
    const { roomId } = payload;
    return state.setIn(['room', 'active', roomId], false);
};

/**
 * Close all active chat rooms
 */
const closeAllActiveChatRooms = (state: Map<string, any>) => {
    return state.setIn(['room', 'active'], Map());
};

/**
 * Add chat room
 */
const addChatRoom = (state: Map<string, any>, payload: Map<string, any>) => {
    const objectId = payload.get('objectId');
    return state.setIn(['room', 'entities', objectId], payload);
};

/**
 * Add chat rooms
 */
const addChatRooms = (state: Map<string, any>, payload: Map<string, any>) => {
    return state.mergeIn(['room', 'entities'], payload).setIn(['room', 'loaded'], true);
};

/**
 * Increase room message count
 */
const increaseRoomMessageCount = (state: Map<string, any>, payload: any) => {
    const { roomId, amount } = payload;
    const messageCount = state.getIn(['room', 'entities', roomId, 'messageCount'], 0);
    return state.setIn(['room', 'entities', roomId, 'messageCount'], amount + messageCount);
};

/**
 * Set room first message fetched
 */
const setRoomFirstMessageFetched = (state: Map<string, any>, payload: any) => {
    const { roomId, message } = payload;
    return state.setIn(['room', 'firstMessage', roomId], message);
};

/**
 * Set room last message fetched
 */
const setRoomLastMessage = (state: Map<string, any>, payload: any) => {
    const { roomId, message } = payload;
    return state.setIn(['room', 'entities', roomId, 'lastMessage'], message);
};

/**
 * Vang reducer
 */
// eslint-disable-next-line default-param-last
export const vangReducer = (state = Map({ chatOpen: false, recentChatOpen: false }), action: IVangAction) => {
    const { payload } = action;
    switch (action.type) {
        case VangActionType.SET_CHAT_ROOM:
            return setChatRoom(state, payload);

        case VangActionType.ADD_ACTIVE_ROOM:
            return addActiveChatRoom(state, payload);

        case VangActionType.SET_ROOM_FIRST_MESSAGE_FETCHED:
            return setRoomFirstMessageFetched(state, payload);

        case VangActionType.SET_ROOM_LAST_MESSAGE:
            return setRoomLastMessage(state, payload);

        case VangActionType.UPDATE_ROOM_USER_READ_META:
            return state
                .setIn(['room', 'entities', payload.roomId, 'readCount', payload.userId], payload.readCount)
                .setIn(['room', 'entities', payload.roomId, 'readDate', payload.userId], payload.readDate);

        case VangActionType.HAS_MORE_MESSAGES:
            return state.setIn(['hasMoreData', payload.roomId, payload.type], true);

        case VangActionType.NO_MORE_MESSAGES:
            return state.setIn(['hasMoreData', payload.roomId, payload.type], false);

        case VangActionType.ADD_ROOMS:
            return addChatRooms(state, payload);

        case VangActionType.CLOSE_ACTIVE_ROOM:
            return closeActiveChatRoom(state, payload);

        case VangActionType.CLOSE_ALL_ACTIVE_ROOM:
            return closeAllActiveChatRooms(state);

        case VangActionType.CHAT_SET_PEER_ACTIVE:
            let deactiveUsers = state.getIn(['room', 'entities', payload.roomId, 'deactiveUsers']) as List<string>;
            const index = deactiveUsers.findIndex((id) => id === payload.userId);
            if (index > -1) {
                deactiveUsers = deactiveUsers.delete(index);
            }
            return state.setIn(['room', 'entities', payload.roomId, 'deactiveUsers'], deactiveUsers);

        case VangActionType.ADD_ROOM:
            return addChatRoom(state, payload);

        case VangActionType.ADD_CHAT_ROOM_MESSAGES:
            return addChatRoomMessages(state, payload);

        case VangActionType.ADD_PLAIN_CHAT_ROOM_MESSAGES:
            return addPlainChatRoomMessages(state, payload);

        case VangActionType.INCREASE_ROOM_MESSAGE_COUNT:
            return increaseRoomMessageCount(state, payload);

        case VangActionType.REMOVE_CHAT_HISTORY:
            const { roomId } = payload;
            return state.removeIn(['messages', roomId]);

        case VangActionType.CLOSE_CHAT:
            return state.set('chatOpen', false);

        case VangActionType.OPEN_RECENT_CHAT:
            return state.set('recentChatOpen', true);

        case VangActionType.CLOSE_RECENT_CHAT:
            return state.set('recentChatOpen', false);

        case VangActionType.ADD_CHAT_REQUEST:
            return state.setIn(['requests', payload.userId], true);

        case VangActionType.REMOVE_CHAT_REQUEST:
            return state.deleteIn(['requests', payload.userId]);

        case VangActionType.ADD_CHAT_CALLING:
            return state.setIn(['calling', payload.userId], true);

        case VangActionType.REMOVE_CHAT_CALLING:
            return state.deleteIn(['calling', payload.userId]);

        case VangActionType.ADD_CHAT_CONNECT:
            return state.setIn(['connect', payload.userId], Map(payload.room));

        case VangActionType.REMOVE_CHAT_CONNECT:
            return state.deleteIn(['connect', payload.userId]);

        case VangActionType.SET_CURRENT_CHAT:
            return setCurrentChat(state, payload);

        case VangActionType.CLEAR_ALL_CHAT_MESSAGE:
            return Map({});

        default:
            return state;
    }
};
