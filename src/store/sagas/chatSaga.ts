import { ChatActionType } from 'constants/chatActionType';
import { IChatService } from 'core/services/chat/IChatService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { fromJS, Map } from 'immutable';
import { Channel, eventChannel } from 'redux-saga';
import { all, call, cancelled, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { provider } from 'socialEngine';
import * as userActions from 'store/actions/userActions';
import * as chatActions from 'store/actions/chatActions';
import * as serverActions from 'store/actions/serverActions';
import * as globalActions from 'store/actions/globalActions';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import config from 'config';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import moment from 'moment/moment';
import { initServerRequest } from 'utils/serverUtil';
import { ServerRequestType } from 'constants/serverRequestType';
import { playNotify } from 'utils/audio';
import { chatGetters } from '../reducers/chat/chatGetters';
import { addBadge } from 'utils/badge';

/**
 * Get service providers
 */
const chatService: IChatService = provider.get<IChatService>(SocialProviderTypes.ChatService);
const authService: IAuthorizeService = provider.get<IAuthorizeService>(SocialProviderTypes.AuthorizeService);

/***************************** Subroutines ************************************/

function subscribeWSConnect(url: string, accessKey: string, uid: string) {
    return eventChannel<any>((emmiter) => {
        const unsubscribe = chatService.wsConnect(url, accessKey, uid, (message: any) => {
            emmiter(message);
        });
        return () => {
            unsubscribe();
        };
    });
}

/**
 * Reading websocket connection
 */
function* asyncWSConnect() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    let accessKey: string = yield select(authorizeSelector.getAccessToken);
    if (accessKey === '') {
        accessKey = yield call(authService.getAccessToken);
    }
    yield put(globalActions.showMessage('Connecting...'));

    const channelSubscription: Channel<any> = yield call(
        subscribeWSConnect,
        config.gateway.websocket_url,
        accessKey,
        uid,
    );
    try {
        while (true) {
            const message: any = yield take(channelSubscription);
            if (message) {
                switch (message.signal) {
                    case 'status':
                        yield put(globalActions.showMessage(message.data));
                        break;
                    case 'dispatch':
                        yield put(message.data);
                        break;

                    default:
                        yield put(globalActions.showMessage('Unknown SIGNAL.'));

                        break;
                }
            } else {
                yield put(globalActions.showMessage('Channel received undefied message from WS!'));
            }
        }
    } finally {
        if (yield cancelled()) {
            channelSubscription.close();
        }
    }
}

/**
 * Create chat message
 */
function* dbCreateChatMessage(action: { type: ChatActionType; payload: any }) {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        const { payload } = action;
        try {
            yield fork(chatService.createChatMessage, payload);
            const now = moment().utc().valueOf();
            let messages: Map<string, Map<string, any>> = Map({});

            const newMessage: Map<string, any> = Map({
                ...payload,
                loading: true,
                updatedDate: now,
                createdDate: now,
                ownerUserId: uid,
            });
            messages = messages.set(payload.objectId, newMessage);
            yield put(chatActions.increaseRoomMessageCount(payload.roomId, 1));
            yield put(chatActions.addChatRoomMessages(messages, payload.roomId));
        } catch (error) {
            yield put(globalActions.showMessage('chatSaga/dbCreateChatMessage : ' + error.message));
        }
    }
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

/**
 * Watch active peer chat room
 */
function* watchActivePeerChatRoom(action: { type: ChatActionType; payload: any }) {
    const { peerUserId } = action.payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            yield call(chatService.requestActiveRoom, peerUserId);
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Watch create chat request
 */
function* watchCreateChatRequest(action: any) {
    const { recUserId } = action.payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            yield call(chatService.createChatRquest, recUserId);
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Watch cancel chat request
 */
function* watchCancelChatRequest(action: any) {
    const { recUserId } = action.payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            yield call(chatService.cancelChatRquest, recUserId);
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Watch ignore chat request
 */
function* watchIgnoreChatRequest(action: any) {
    const { reqUserId } = action.payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            yield call(chatService.ignoreChatRquest, reqUserId);
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Watch accept chat request
 */
function* watchAcceptChatRequest(action: any) {
    const { reqUserId } = action.payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            yield call(chatService.acceptChatRquest, reqUserId);
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Watch join chatroom
 */
function* watchJoinChatroom(action: any) {
    const { roomId } = action.payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            yield call(chatService.joinChatRoom, roomId);
        } catch (error) {
            yield put(globalActions.showMessage(error.message));
        }
    }
}

/**
 * Watch set user offline
 */
function* watchSetUserOffline() {
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        yield put(globalActions.showMessage('User is offline!'));
    }
}

/**
 * Watch set active room
 */
function* watchSetActiveRoom(action: any) {
    const { payload } = action;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        const { room, messages, users } = payload;
        yield put(chatActions.addChatRoom(fromJS(room)));
        yield put(userActions.addPeopleInfo(fromJS(users)));
        yield put(chatActions.addActiveChatRoom(room.objectId));
        if (messages) {
            yield put(chatActions.addPlainChatRoomMessages(messages, room.objectId));
        }
    }
}

/**
 * Watch set room entities
 */
function* watchSetRoomEntities(action: any) {
    const { payload } = action;
    const { rooms } = payload;

    yield put(chatActions.addChatRooms(fromJS(rooms)));
}

/**
 * Watch open room
 */
function* watchOpenRoom(action: any) {
    const { payload } = action;
    const { roomId } = payload;
    // yield call(chatService.openRoom, roomId);
    yield put(chatActions.addActiveChatRoom(roomId));
}

/**
 * Watch update read message meta
 */
function* watchUpdateReadMessageMeta(action: any) {
    const { payload } = action;
    const { roomId, messageId, readCount, messageCreatedDate } = payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    yield put(chatActions.updateRoomUserReadMeta(roomId, uid, readCount, messageCreatedDate));
    yield call(chatService.updateReadMessageMeta, roomId, messageId, readCount, messageCreatedDate);
}

/**
 * Watch add room messages
 */
function* watchAddRoomMessages(action: any) {
    const { payload } = action;
    const { messages, roomId, requestId } = payload;

    if (requestId) {
        const [requestType, roomId] = requestId.split(':');
        if (requestType === ServerRequestType.QueryOldMessages && messages === null) {
            yield put(chatActions.setNoMoreMessages(roomId, 'old'));
        }
        if (requestType === ServerRequestType.QueryNewMessages && messages === null) {
            yield put(chatActions.setNoMoreMessages(roomId, 'new'));
        }

        yield put(serverActions.okRequest(requestId));
    }

    if (messages) {
        yield put(chatActions.addPlainChatRoomMessages(messages, roomId));
    }
}

/**
 * Watch add room new messages
 */
function* watchAddRoomNewMessages(action: any) {
    const { payload } = action;
    const { messages, roomId } = payload;
    yield put(chatActions.addPlainChatRoomMessages(messages, roomId));

    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    // Only increase room message count for new messages which come from other users
    // we increase room message count for the owner in createMessage function for the owner to sync message count
    // before updating current user read message meta

    const otherUsersMessages = messages.filter((message: any) => {
        return message.ownerUserId !== uid;
    });
    const sortedMessages = (messages as Array<any>).sort((a, b) => b.createdDate - a.createdDate);
    const lastMessage = sortedMessages[0];
    yield put(chatActions.increaseRoomMessageCount(roomId, otherUsersMessages.length));
    yield put(
        chatActions.setRoomLastMessage(
            roomId,
            Map({
                createdDate: lastMessage.createdDate,
                ownerId: lastMessage.ownerUserId,
                text: lastMessage.text,
            }),
        ),
    );

    const isRoomActive: boolean = yield select(chatGetters.isRoomActive, { roomId });

    if (!isRoomActive) {
        playNotify();
        addBadge(1);
    }
}

/**
 * Watch add room messages
 */
function* watchQueryRoomMessages(action: any) {
    const { payload } = action;
    const { requestId, roomId, page, lte, gte } = payload;

    yield put(serverActions.sendRequest(initServerRequest(ServerRequestType.QueryMessages, requestId)));
    yield call(chatService.queryRoomMessages, requestId, roomId, page, lte, gte);
}

/**
 * Watch add room activated
 */
function* watchRoomActivated(action: any) {
    const { payload } = action;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        const { room, users } = payload;
        yield put(chatActions.addChatRoom(fromJS(room)));
        yield put(userActions.addPeopleInfo(fromJS(users)));
    }
}

export default function* chatSaga() {
    yield all([
        takeLatest(ChatActionType.ROOM_ACTIVATED, watchRoomActivated),
        takeLatest(ChatActionType.QUERY_MESSAGE, watchQueryRoomMessages),
        takeLatest(ChatActionType.SG_ADD_ROOM_MESSAGES, watchAddRoomMessages),
        takeLatest(ChatActionType.SG_ADD_ROOM_NEW_MESSAGES, watchAddRoomNewMessages),
        takeLatest(ChatActionType.UPDATE_READ_MESSAGE_META, watchUpdateReadMessageMeta),
        takeLatest(ChatActionType.OPEN_ROOM, watchOpenRoom),
        takeLatest(ChatActionType.DB_CREATE_CHAT_MESSAGE, dbCreateChatMessage),
        takeLatest(ChatActionType.ACTIVE_PEER_CHAT_ROOM, watchActivePeerChatRoom),
        takeLatest(ChatActionType.WS_CONNECT, asyncWSConnect),
        takeLatest(ChatActionType.ASYNC_CREATE_CHAT_REQUEST, watchCreateChatRequest),
        takeLatest(ChatActionType.ASYNC_CANCEL_CHAT_REQUEST, watchCancelChatRequest),
        takeLatest(ChatActionType.ASYNC_IGNORE_CHAT_REQUEST, watchIgnoreChatRequest),
        takeLatest(ChatActionType.ASYNC_ACCEPT_CHAT_REQUEST, watchAcceptChatRequest),
        takeLatest(ChatActionType.ASYNC_JOIN_CHAT_ROOM, watchJoinChatroom),
        takeLatest(ChatActionType.SET_USER_OFFLINE, watchSetUserOffline),
        takeLatest(ChatActionType.SET_ACTIVE_ROOM, watchSetActiveRoom),
        takeLatest(ChatActionType.SET_ROOM_ENTITIES, watchSetRoomEntities),
    ]);
}
