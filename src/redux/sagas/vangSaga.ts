import { VangActionType } from 'constants/vangActionType';
import { IVangService } from 'core/services/vang/IVangService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { fromJS, Map } from 'immutable';
import { Channel, eventChannel, Task } from 'redux-saga';
import { all, call, cancel, cancelled, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { provider } from 'socialEngine';
import * as userActions from 'redux/actions/userActions';
import * as vangActions from 'redux/actions/vangActions';
import * as serverActions from 'redux/actions/serverActions';
import * as globalActions from 'redux/actions/globalActions';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import config from 'config';
import { initServerRequest } from 'utils/serverUtil';
import { ServerRequestType } from 'constants/serverRequestType';
import { playNotify } from 'utils/audio';
import { addBadge } from 'utils/badge';
import { vangGetters } from '../reducers/vang/vangGetters';

/**
 * Get service providers
 */
const vangService: IVangService = provider.get<IVangService>(SocialProviderTypes.VangService);

/** *************************** Subroutines *********************************** */

function subscribeWSConnect(url: string, uid: string) {
    return eventChannel<any>((emmiter) => {
        vangService.wsConnect(url, uid, (message: any) => {
            emmiter(message);
        });
        return () => {
            vangService.wsDisconnect();
        };
    });
}

/**
 * Reading websocket connection
 */
function* asyncWSConnect() {
    const authedUser: Record<string, any> = yield select(authorizeSelector.getAuthedUser);
    const { uid } = authedUser;

    const channelSubscription: Channel<any> = yield call(subscribeWSConnect, config.gateway.websocket_url, uid);
    try {
        while (true) {
            const message: { signal: any; data: any } = yield take(channelSubscription);
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
        const isCancel: boolean = yield cancelled();
        if (isCancel) {
            channelSubscription.close();
        }
    }
}

/**
 * Start websocket
 */
function* asyncWSStart() {
    // starts the task in the background
    const bgSyncTask: Task = yield fork(asyncWSConnect);

    // wait for the user stop action
    yield take(VangActionType.WS_DISCONNECT);
    // user clicked stop. cancel the background task
    // this will cause the forked bgSync task to jump into its finally block
    yield cancel(bgSyncTask);
}

/** *************************************************************************** */
/** ***************************** WATCHERS ************************************ */
/** *************************************************************************** */

/**
 * Watch join chatroom
 */
function* watchJoinChatroom(action: any) {
    const { roomId } = action.payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    if (uid) {
        try {
            yield call(vangService.joinChatRoom, roomId);
        } catch (error: any) {
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
        yield put(vangActions.addChatRoom(fromJS(room)));
        yield put(userActions.addPeopleInfo(fromJS(users) as Map<string, Map<string, any>>));
        yield put(vangActions.openRoom(room.objectId));
        if (messages) {
            yield put(vangActions.addPlainChatRoomMessages(messages, room.objectId));
        }
    }
}

/**
 * Watch set room entities
 */
function* watchSetRoomEntities(action: any) {
    const { payload } = action;
    const { rooms } = payload;

    yield put(vangActions.addChatRooms(fromJS(rooms)));
}

/**
 * Watch open room
 */
function* watchOpenRoom(action: any) {
    const { payload } = action;
    const { roomId } = payload;
    yield put(vangActions.closeAllActiveChatRooms());
    yield put(vangActions.addActiveChatRoom(roomId));
}

/**
 * Watch update read message meta
 */
function* watchUpdateReadMessageMeta(action: any) {
    const { payload } = action;
    const { roomId, messageId, readCount, messageCreatedDate } = payload;
    const authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser);
    const uid = authedUser.get('uid');
    yield put(vangActions.updateRoomUserReadMeta(roomId, uid, readCount, messageCreatedDate));
    yield call(vangService.updateReadMessageMeta, roomId, messageId, readCount, messageCreatedDate);
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
            yield put(vangActions.setNoMoreMessages(roomId, 'old'));
        }
        if (requestType === ServerRequestType.QueryNewMessages && messages === null) {
            yield put(vangActions.setNoMoreMessages(roomId, 'new'));
        }

        yield put(serverActions.okRequest(requestId));
    }

    if (messages) {
        yield put(vangActions.addPlainChatRoomMessages(messages, roomId));
    }
}

/**
 * Watch add room new messages
 */
function* watchAddRoomNewMessages(action: any) {
    const { payload } = action;
    const { messages, roomId } = payload;
    yield put(vangActions.addPlainChatRoomMessages(messages, roomId));

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
    yield put(vangActions.increaseRoomMessageCount(roomId, otherUsersMessages.length));
    yield put(
        vangActions.setRoomLastMessage(
            roomId,
            Map({
                createdDate: lastMessage.createdDate,
                ownerId: lastMessage.ownerUserId,
                text: lastMessage.text,
            }),
        ),
    );

    const isRoomActive: boolean = yield select(vangGetters.isRoomActive, { roomId });

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
    yield call(vangService.queryRoomMessages, requestId, roomId, page, lte, gte);
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
        yield put(vangActions.addChatRoom(fromJS(room)));
        yield put(userActions.addPeopleInfo(fromJS(users) as Map<string, Map<string, any>>));
    }
}

/**
 * Watch request active peer room
 */
function* requestActivePeerRoom(action: any) {
    const { roomId } = action.payload;
    const result: Record<string, any> = yield call(vangService.getActivePeerRoom, roomId);

    yield put(vangActions.addChatRoom(fromJS(result)));
}

export default function* chatSaga() {
    yield all([
        takeLatest(VangActionType.ROOM_ACTIVATED, watchRoomActivated),
        takeLatest(VangActionType.QUERY_MESSAGE, watchQueryRoomMessages),
        takeLatest(VangActionType.SG_ADD_ROOM_MESSAGES, watchAddRoomMessages),
        takeLatest(VangActionType.SG_ADD_ROOM_NEW_MESSAGES, watchAddRoomNewMessages),
        takeLatest(VangActionType.UPDATE_READ_MESSAGE_META, watchUpdateReadMessageMeta),
        takeLatest(VangActionType.OPEN_ROOM, watchOpenRoom),
        takeLatest(VangActionType.WS_START, asyncWSStart),
        takeLatest(VangActionType.ASYNC_JOIN_CHAT_ROOM, watchJoinChatroom),
        takeLatest(VangActionType.SET_USER_OFFLINE, watchSetUserOffline),
        takeLatest(VangActionType.SET_ACTIVE_ROOM, watchSetActiveRoom),
        takeLatest(VangActionType.SET_ROOM_ENTITIES, watchSetRoomEntities),
        takeLatest(VangActionType.CHAT_REQUEST_ACTIVE_PEER_ROOM, requestActivePeerRoom),
    ]);
}
