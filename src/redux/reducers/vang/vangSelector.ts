import { List, Map } from 'immutable';
import { createSelector } from 'reselect';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { userGetters } from '../users/userGetters';
import { vangGetters } from './vangGetters';

// Selectros //

const selectCurrentChatRoom = () => {
    return createSelector([vangGetters.getCurrentChat, vangGetters.getChatConnections], (currentChat, connections) => {
        return connections.getIn([currentChat, 'roomId']);
    });
};

const selectRoom = () => {
    return createSelector([vangGetters.getRoom], (room) => room);
};

const selectCallingUsers = () => {
    return createSelector([vangGetters.getCallingUsers], (callingUsers) => callingUsers);
};

const selectChatRequests = () => {
    return createSelector([vangGetters.getChatRequests], (chatRequest) => chatRequest);
};

const selectChatConnections = () => {
    return createSelector([vangGetters.getChatConnections], (chatConnections) => chatConnections);
};

const selectCurrentChat = () => {
    return createSelector([vangGetters.getCurrentChat], (currentChat) => currentChat);
};

const selectCurrentReceiver = () => {
    return createSelector([vangGetters.getCurrentChat, userGetters.getUsers], (currentChat, users) => {
        return users.get(currentChat, Map({}));
    });
};

const selectChatOpen = () => {
    return createSelector([vangGetters.getChatOpen], (open) => open);
};

const selectRoomLoaded = () => {
    return createSelector([vangGetters.getRoomLoaded], (loaded) => loaded);
};

const selectChatRooms = () => {
    return createSelector([vangGetters.getRooms], (rooms) => rooms);
};

const selectActiveRooms = () => {
    return createSelector([vangGetters.getActiveRooms, vangGetters.getRooms], (activeRooms, rooms) => {
        let mappedRooms: List<Map<string, any>> = List([]);
        activeRooms.forEach((exist, roomId) => {
            if (exist) {
                const existPost = rooms.get(roomId);
                if (existPost) {
                    mappedRooms = mappedRooms.push(existPost);
                }
            }
        });
        if (mappedRooms.isEmpty()) {
            return List([]);
        }
        return mappedRooms;
    });
};

const selectMessages = () => {
    return createSelector([vangGetters.getMessages, authorizeSelector.getAuthedUser], (messages, currentAuthed) => {
        return messages
            .map((message: Map<string, any>) =>
                message.set('isCurrentUser', currentAuthed.get('uid') === message.get('ownerUserId')),
            )
            .sort((a, b) => a.get('createdDate') - b.get('createdDate'));
    });
};

const selectContacts = () => {
    return createSelector(
        [vangGetters.getRooms, userGetters.getUsers, authorizeSelector.getAuthedUser],
        (rooms, users, currentAuthed) => {
            let contacts: List<Map<string, any>> = List([]);
            const uid = currentAuthed.get('uid');
            rooms.forEach((room) => {
                const roomId: string = room.get('objectId');
                const roomType: number = room.get('type');
                const members: List<string> = room.get('members');
                const currentUserReadCount = room.getIn(['readCount', uid], 0) as number;
                if (roomType === 0 && currentUserReadCount > 0) {
                    members.forEach((userId) => {
                        let user = users.get(userId);
                        if (userId !== uid && user) {
                            user = user.set('roomId', roomId);
                            contacts = contacts.push(user);
                        }
                    });
                }
            });
            return contacts;
        },
    );
};

const selectRoomList = () => {
    return createSelector(
        [vangGetters.getRooms, userGetters.getUsers, authorizeSelector.getAuthedUser],
        (rooms, users, currentAuthed) => {
            let contacts: List<Map<string, any>> = List([]);
            const uid = currentAuthed.get('uid');
            rooms.forEach((room) => {
                const roomId: string = room.get('objectId');
                const lastMessage: string = room.get('lastMessage');
                const roomType: number = room.get('type');
                const roomMessageCount = room.get('messageCount', 0);
                const currentUserReadCount = room.getIn(['readCount', uid], 0) as number;
                const unreadCount: number = roomMessageCount - currentUserReadCount;
                const members: List<string> = room.get('members');
                if (roomType === 0 && roomMessageCount > 0) {
                    members.forEach((userId) => {
                        let user = users.get(userId);
                        if (userId !== uid && user) {
                            user = user.set('roomId', roomId);
                            user = user.set('lastMessage', lastMessage);
                            user = user.set('unreadCount', unreadCount);
                            contacts = contacts.push(user);
                        }
                    });
                }
            });
            return contacts.sort((a, b) => b.get('unreadCount') - a.get('unreadCount'));
        },
    );
};

const selectUnreadRoomsCount = () => {
    return createSelector([vangGetters.getRooms, authorizeSelector.getAuthedUser], (rooms, currentAuthed) => {
        const uid = currentAuthed.get('uid');
        let unreadRoomsCount = 0;
        rooms.forEach((room) => {
            const unreadCount: number = room.get('messageCount', 0) - (room.getIn(['readCount', uid], 0) as number);
            if (unreadCount > 0) {
                ++unreadRoomsCount;
            }
        });
        return unreadRoomsCount;
    });
};

const selectHasMoreOldMessages = () => {
    return createSelector([vangGetters.getHasMoreOldMessages], (status) => status);
};

const selectHasMoreNewMessages = () => {
    return createSelector([vangGetters.getHasMoreNewMessages], (status) => status);
};

export const vangSelector = {
    selectCurrentReceiver,
    selectRoom,
    selectMessages,
    selectCurrentChatRoom,
    selectCurrentChat,
    selectCallingUsers,
    selectChatRequests,
    selectChatOpen,
    selectRoomLoaded,
    selectChatRooms,
    selectChatConnections,
    selectActiveRooms,
    selectContacts,
    selectRoomList,
    selectUnreadRoomsCount,
    selectHasMoreOldMessages,
    selectHasMoreNewMessages,
};
