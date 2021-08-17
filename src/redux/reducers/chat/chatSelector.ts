import { List, Map } from 'immutable';
import { createSelector } from 'reselect';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { userGetters } from '../users/userGetters';
import { chatGetters } from './chatGetters';

// Selectros //

const selectCurrentChatRoom = () => {
    return createSelector([chatGetters.getCurrentChat, chatGetters.getChatConnections], (currentChat, connections) => {
        return connections.getIn([currentChat, 'roomId']);
    });
};

const selectRoom = () => {
    return createSelector([chatGetters.getRoom], (room) => room);
};

const selectCallingUsers = () => {
    return createSelector([chatGetters.getCallingUsers], (callingUsers) => callingUsers);
};

const selectChatRequests = () => {
    return createSelector([chatGetters.getChatRequests], (chatRequest) => chatRequest);
};

const selectChatConnections = () => {
    return createSelector([chatGetters.getChatConnections], (chatConnections) => chatConnections);
};

const selectCurrentChat = () => {
    return createSelector([chatGetters.getCurrentChat], (currentChat) => currentChat);
};

const selectCurrentReceiver = () => {
    return createSelector([chatGetters.getCurrentChat, userGetters.getUsers], (currentChat, users) => {
        return users.get(currentChat, Map({}));
    });
};

const selectChatOpen = () => {
    return createSelector([chatGetters.getChatOpen], (open) => open);
};

const selectRoomLoaded = () => {
    return createSelector([chatGetters.getRoomLoaded], (loaded) => loaded);
};

const selectChatRooms = () => {
    return createSelector([chatGetters.getRooms], (rooms) => rooms);
};

const selectActiveRooms = () => {
    return createSelector([chatGetters.getActiveRooms, chatGetters.getRooms], (activeRooms, rooms) => {
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
    return createSelector([chatGetters.getMessages, authorizeSelector.getAuthedUser], (messages, currentAuthed) => {
        return messages
            .map((message: Map<string, any>) =>
                message.set('isCurrentUser', currentAuthed.get('uid') === message.get('ownerUserId')),
            )
            .sort((a, b) => a.get('createdDate') - b.get('createdDate'));
    });
};

const selectContacts = () => {
    return createSelector(
        [chatGetters.getRooms, userGetters.getUsers, authorizeSelector.getAuthedUser],
        (rooms, users, currentAuthed) => {
            let contacts: List<Map<string, any>> = List([]);
            const uid = currentAuthed.get('uid');
            rooms.forEach((room) => {
                const roomId: string = room.get('objectId');
                const roomType: number = room.get('type');
                const members: List<string> = room.get('members');
                const currentUserReadCount = room.getIn(['readCount', uid], 0);
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
        [chatGetters.getRooms, userGetters.getUsers, authorizeSelector.getAuthedUser],
        (rooms, users, currentAuthed) => {
            let contacts: List<Map<string, any>> = List([]);
            const uid = currentAuthed.get('uid');
            rooms.forEach((room) => {
                const roomId: string = room.get('objectId');
                const lastMessage: string = room.get('lastMessage');
                const roomType: number = room.get('type');
                const roomMessageCount = room.get('messageCount', 0);
                const currentUserReadCount = room.getIn(['readCount', uid], 0);
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
    return createSelector([chatGetters.getRooms, authorizeSelector.getAuthedUser], (rooms, currentAuthed) => {
        const uid = currentAuthed.get('uid');
        let unreadRoomsCount = 0;
        rooms.forEach((room) => {
            const unreadCount: number = room.get('messageCount', 0) - room.getIn(['readCount', uid], 0);
            if (unreadCount > 0) {
                ++unreadRoomsCount;
            }
        });
        return unreadRoomsCount;
    });
};

const selectHasMoreOldMessages = () => {
    return createSelector([chatGetters.getHasMoreOldMessages], (status) => status);
};

const selectHasMoreNewMessages = () => {
    return createSelector([chatGetters.getHasMoreNewMessages], (status) => status);
};

export const chatSelector = {
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
