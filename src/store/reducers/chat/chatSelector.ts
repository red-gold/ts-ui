import { List, Map } from 'immutable';
import { ChatMessageModel } from 'models/chat/chatMessageModel';
import { createSelector } from 'reselect';
import { User } from 'core/domain/users';
import { authorizeSelector } from 'store/reducers/authorize';
import { userSelector } from 'store/reducers/users/userSelector';

const getCallingUsers: (state: Map<string, any>) => Map<string, any> = (state: Map<string, any>) => {
    const callingUsers: Map<string, any> = state.getIn(['chat', 'calling'], Map({}))
    return callingUsers   
}

const getChatRequests: (state: Map<string, any>) => Map<string, any> = (state: Map<string, any>) => {
    const chatRequests: Map<string, any> = state.getIn(['chat', 'requests'], Map({}))
    return chatRequests   
}

const getChatConnections: (state: Map<string, any>) => Map<string, any> = (state: Map<string, any>) => {
    const chatConnections: Map<string, any> = state.getIn(['chat', 'connect'], Map({}))
    return chatConnections   
}

const getCurrentChat: (state: Map<string, any>) => string = (state: Map<string, any>) => {
    const currentChat: string = state.getIn(['chat', 'currentChat'])
    return currentChat
}

const getMessages: (state: Map<string, any>, props: any) => Map<string, any> = (state: Map<string, any>, props: any) => {
    const messages = state.getIn(['chat', 'messages'], Map({}))
    return messages
}

const selectCurrentChatRoom = () => {
    return createSelector(
        [getCurrentChat, getChatConnections],
        (currentChat, connections) => {
            return connections.getIn([currentChat, 'roomId'])
        }
    )
}

const selectCallingUsers = () => {
    return createSelector(
        [getCallingUsers],
        (callingUsers) => callingUsers
    )
}

const selectChatRequests = () => {
    return createSelector(
        [getChatRequests],
        (chatRequest) => chatRequest
    )
}

const selectChatConnections = () => {
    return createSelector(
        [getChatConnections],
        (chatConnections) => chatConnections
    )
}

const selectCurrentChat = () => {
    return createSelector(
        [getCurrentChat],
        (currentChat) => currentChat
    )
}

const selectCurrentReceiver = () => {
    return createSelector(
        [getCurrentChat, userSelector.getUsers],
        (currentChat, users) => {
           return users.get(currentChat, Map({}))
        }
    )
}

const selectCurrentMessages = () => {
    return createSelector(
        [getMessages, getCurrentChat, getChatConnections, authorizeSelector.getAuthedUser, userSelector.getUserProfileById],
        (messages,currentChat, connections, currentAuthed, receiverUser) => {
            const roomId = connections.getIn([currentChat, 'roomId'])
            const mes = messages.get(roomId, List()).valueSeq().map((message: Map<string, any>) => (
           new ChatMessageModel(
            message.get('id'),
            message.get('senderId') === currentAuthed.get('uid') ? true : false,
            receiverUser.toJS() as User,
            message.get('type'),
            message.get('message'),
            message.get('creationDate'),
            message.get('translateMessage'),
            message.get('loading'),
          ))
        )
        .sort((a: any, b: any) => a.creationDate - b.creationDate)
        return mes
    }
    )
}

export const chatSelector = {
    getChatRequests,
    getCallingUsers,
    getChatConnections,
    selectCurrentReceiver,
    selectCurrentMessages,
    selectCurrentChatRoom,
    selectCurrentChat,
    selectCallingUsers,
    selectChatRequests,
    selectChatConnections
}