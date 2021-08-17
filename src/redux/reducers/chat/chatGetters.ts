// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { List, Map } from 'immutable';

const getCallingUsers: (state: Map<string, any>) => Map<string, any> = (state: Map<string, any>) => {
    const callingUsers: Map<string, any> = state.getIn(['chat', 'calling'], Map({}));
    return callingUsers;
};

const getChatRequests: (state: Map<string, any>) => Map<string, any> = (state: Map<string, any>) => {
    const chatRequests: Map<string, any> = state.getIn(['chat', 'requests'], Map({}));
    return chatRequests;
};

const getChatConnections: (state: Map<string, any>) => Map<string, any> = (state: Map<string, any>) => {
    const chatConnections: Map<string, any> = state.getIn(['chat', 'connect'], Map({}));
    return chatConnections;
};

const getCurrentChat: (state: Map<string, any>) => string = (state: Map<string, any>) => {
    const currentChat: string = state.getIn(['chat', 'currentChat']);
    return currentChat;
};

const getActiveRooms = (state: Map<string, any>) => {
    const activeRooms: Map<string, boolean> = state.getIn(['chat', 'room', 'active'], Map({}));
    return activeRooms;
};

const getRooms = (state: Map<string, any>) => {
    const activeRooms: Map<string, Map<string, any>> = state.getIn(['chat', 'room', 'entities'], Map({}));
    return activeRooms;
};

const getRoom = (state: Map<string, any>, { roomId }: { roomId: string }) => {
    const activeRooms = state.getIn(['chat', 'room', 'entities', roomId], Map({}));
    return activeRooms;
};

const getRoomLoaded = (state: Map<string, any>) => {
    const activeRooms = state.getIn(['chat', 'room', 'loaded'], false);
    return activeRooms;
};

const getMessages: (state: Map<string, any>, props: { roomId: string }) => Map<string, any> = (
    state: Map<string, any>,
    { roomId },
) => {
    const messages = state.getIn(['chat', 'messages', roomId], List([]));
    return messages;
};

const getChatOpen = (state: Map<string, any>) => {
    return state.getIn(['chat', 'chatOpen']);
};

const getHasMoreOldMessages = (state: Map<string, any>, { roomId }: { roomId: string }) => {
    return state.getIn(['chat', 'hasMoreData', roomId, 'old'], true) as boolean;
};

const getHasMoreNewMessages = (state: Map<string, any>, { roomId }: { roomId: string }) => {
    return state.getIn(['chat', 'hasMoreData', roomId, 'new'], true) as boolean;
};

const isRoomActive = (state: Map<string, any>, { roomId }: { roomId: string }) => {
    const activeRooms: Map<string, boolean> = state.getIn(['chat', 'room', 'active'], Map({}));

    return activeRooms
        .filter((roomIsActive) => roomIsActive === true)
        .keySeq()
        .includes(roomId);
};

const getDeactivePeerIds = (state: Map<string, any>, { roomId }: { roomId: string }) => {
    return state.getIn(['chat', 'room', 'entities', roomId, 'deactiveUsers'], false) as Array<string>;
};

export const chatGetters = {
    getChatRequests,
    getCallingUsers,
    getChatConnections,
    getRooms,
    getRoom,
    getRoomLoaded,
    getCurrentChat,
    getActiveRooms,
    getMessages,
    getChatOpen,
    getHasMoreOldMessages,
    getHasMoreNewMessages,
    isRoomActive,
    getDeactivePeerIds,
};
