import { ChatActionType } from 'constants/chatActionType';
import { ChatRoom } from 'core/domain/chat/chatRoom';
import { ChatRoomType } from 'core/domain/chat/ChatRoomType';
import { IChatService } from 'core/services/chat';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map } from 'immutable';
import { Channel, eventChannel } from 'redux-saga';
import { all, call, cancelled, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { provider } from 'socialEngine';
import * as chatActions from 'store/actions/chatActions';
import * as globalActions from 'store/actions/globalActions';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { chatSelector } from 'store/reducers/chat/chatSelector';
import config from 'config'
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';

/**
 * Get service providers
 */
const chatService: IChatService = provider.get<IChatService>(SocialProviderTypes.ChatService)
const authService: IAuthorizeService = provider.get<IAuthorizeService>(SocialProviderTypes.AuthorizeService)

/***************************** Subroutines ************************************/




function subscribeWSConnect(url: string, accessKey: string, uid: string ) {  
  return eventChannel<any>((emmiter) => {
      const unsubscribe = chatService.wsConnect(url,accessKey,uid, 
        (message: any ) => {
           emmiter(message)
       })
       return () => {
           unsubscribe()
       }
   })
}

/**
 * Reading websocket connection 
 */
function* asyncWSConnect(action: any) {
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  let accessKey = yield select(authorizeSelector.getAccessToken)
  if (accessKey === '') {
    accessKey = yield call(authService.getAccessToken)
  }
  yield put(globalActions.showMessage('Connecting...'))

   const channelSubscription: Channel<any> =  yield call(subscribeWSConnect, config.websocket.url,accessKey,uid)
   try {    
       while (true) {
          let message: any = yield take(channelSubscription)
          if (message) {
            switch (message.signal) {
              case 'status':
                yield put(globalActions.showMessage(message.data))
                break;
              case 'dispatch':
                yield put(message.data)
                break;
            
              default:
                yield put(globalActions.showMessage('Unknown SIGNAL.'))

                break;
            }
          } else {
            yield put(globalActions.showMessage('Channel received undefied message from WS!'))
          }
      }
    } finally {
      if (yield cancelled()) {
          channelSubscription.close()
        } 
    }
  
}


function* dispatcher(action: any) {
  yield put(action)
}




  // ************************ //
  // ** Old implementation ** //TODO: Remove unused functions
  // ************************ //

/**
 * Creating channel event and subscribing chat service
 */
function subscribeChatMessage(chatRoomId: string) {  
  return eventChannel<Map<string, any>>((emmiter) => {
      const unsubscribe = chatService.subscribeChatMessages(chatRoomId, 
        (messages: Map<string, any> ) => {
           emmiter(messages)
       })
       return () => {
           unsubscribe()
       }
   })
}

/**
 * On database fetch
 */
function* dbFetchChatMessages(chatRoomId: string) {
   const channelSubscription: Channel<Map<string, any>> =  yield call(subscribeChatMessage, chatRoomId)
   try {    
       while (true) {
          let messages: Map<string, any> = yield take(channelSubscription)
          
          if (messages) {
            yield put(chatActions.addChatRoomMessages(messages, chatRoomId))
          }
      }
    } finally {
      if (yield cancelled()) {
          channelSubscription.close()
        } 
    }
  
}

/**
 * Fetch chat messages once
 */
function* dbFetchChatMessageOnce(chatRoomId: string) {

    try {
      const messages = yield call(chatService.getChatMessages, chatRoomId )
      if (messages) {
        yield put(chatActions.addChatRoomMessages(messages, chatRoomId))
      }
    } catch (error) {
      yield put(globalActions.showMessage(error.message))
    }
}

/**
 * Create chat message
 */
function* dbCreateChatMessage(action: { type: ChatActionType, payload: any }) {
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    const { payload } = action
    try {
      yield fork(chatService.createChatMessage, payload )
      yield put(chatActions.addChatRoomMessages(Map({[payload.id]: Map({...payload, loading: true})}), payload.chatRoomId) )

    } catch (error) {
      yield put(globalActions.showMessage('chatSaga/dbCreateChatMessage : ' + error.message))
    }
  }
}


/**
 * Set chat room  language
 */
function* setChatLanguage(uid: string, input: string, output: string, roomId: string) {
    try {
       yield call(chatService.setChatLangauge, uid, input,output, roomId)
       yield put(chatActions.setCurrentChat('room'))
    } catch (error) {
      yield put(globalActions.showMessage('chatSaga/dbGetPeerChatRoom : ' + error.message))

    }
}

/**
 * Active peer chat room
 */
function* activePeerChatRoom(receiverId: string) {
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
  try {
      let chatRoom: Map<string, any> = yield call(chatService.getPeerChatRoom, uid, receiverId )
      if (chatRoom) {
        yield put(chatActions.setCurrentChat('chatRoom'))
      } else {
        const newChatRoom = new ChatRoom(
          '0',
          ChatRoomType.Peer,
          {
            [uid]: true,
            [receiverId]: true
          },
          uid,
          false,
        )
        if (!newChatRoom.lastMessage) {
          delete newChatRoom.lastMessage
        }
        if (!newChatRoom.speech) {
          delete newChatRoom.speech
        }
        if (!newChatRoom.translation) {
          delete newChatRoom.translation
        }
        if (!newChatRoom.userStatus) {
          delete newChatRoom.userStatus
        }

         chatRoom = yield call(chatService.createChatRoom, newChatRoom )
        yield put(chatActions.setCurrentChat('chatRoom'))
      }
      const chatRoomId = chatRoom.get('id')
      yield call(dbFetchChatMessageOnce, chatRoomId)
      yield call(dbFetchChatMessages, chatRoomId)
  } catch (error) {
    yield put(globalActions.showMessage('chatSaga/activePeerChatRoom : ' + error.message))

  }
}
}

/******************************************************************************/
/******************************* WATCHERS *************************************/
/******************************************************************************/

/**
 * Remove chat room message history
 */
function* dbRemoveRoomHistory(action: { type: ChatActionType, payload: any }) {
  const {roomId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(chatService.removeHistoryRoom, roomId)
      yield put(chatActions.removeChatHistory(roomId))
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Watch active peer chat room
 */
function* watchActivePeerChatRoom(action: { type: ChatActionType, payload: any }) {
  const {receiverId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(activePeerChatRoom, receiverId)
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Watch chat messages
 */
function* watchChatMessages(action: { type: ChatActionType, payload: any }) {
  const {receiverId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(dbFetchChatMessages as any, uid, receiverId)
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Watch chat messages
 */
function* watchSetLanguage(action: { type: ChatActionType, payload: any }) {
  const {input, output, roomId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(setChatLanguage, uid, input, output, roomId)
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}


/**
 * Watch create chat request
 */
function* watchCreateChatRequest(action: any) {
  const {recUserId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(chatService.createChatRquest, recUserId)
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Watch cancel chat request
 */
function* watchCancelChatRequest(action: any) {
  const {recUserId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(chatService.cancelChatRquest, recUserId)
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Watch ignore chat request
 */
function* watchIgnoreChatRequest(action: any) {
  const {reqUserId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(chatService.ignoreChatRquest, reqUserId)
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Watch accept chat request
 */
function* watchAcceptChatRequest(action: any) {
  const {reqUserId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(chatService.acceptChatRquest, reqUserId)
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Watch join chatroom
 */
function* watchJoinChatroom(action: any) {
  const {roomId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    try {
      yield call(chatService.joinChatRoom, roomId)
    } catch (error) {
      yield put(globalActions.showMessage(error.message))

    }
  }
}

/**
 * Watch set user offline
 */
function* watchSetUserOffline(action: any) {
  const {roomId} = action.payload
  let authedUser: Map<string, any> = yield select(authorizeSelector.getAuthedUser)
  const uid = authedUser.get('uid')
  if (uid) {
    yield put(globalActions.showMessage('User is offline!'))
  }
}

export default function* chatSaga() {
    yield all([
      takeLatest(ChatActionType.DB_CREATE_CHAT_MESSAGE, dbCreateChatMessage),
      takeLatest(ChatActionType.DB_SUBSCRIBE_CHAT_MESSAGE, watchChatMessages),
      takeLatest(ChatActionType.ACTIVE_PEER_CHAT_ROOM, watchActivePeerChatRoom),
      takeLatest(ChatActionType.WS_CONNECT, asyncWSConnect),
      takeLatest(ChatActionType.ASYNC_CREATE_CHAT_REQUEST, watchCreateChatRequest),
      takeLatest(ChatActionType.ASYNC_CANCEL_CHAT_REQUEST, watchCancelChatRequest),
      takeLatest(ChatActionType.ASYNC_IGNORE_CHAT_REQUEST, watchIgnoreChatRequest),
      takeLatest(ChatActionType.ASYNC_ACCEPT_CHAT_REQUEST, watchAcceptChatRequest),
      takeLatest(ChatActionType.ASYNC_JOIN_CHAT_ROOM, watchJoinChatroom),
      takeLatest(ChatActionType.SET_USER_OFFLINE, watchSetUserOffline),
      takeLatest(ChatActionType.DB_REMOVE_CHAT_HISTORY, dbRemoveRoomHistory),
      takeLatest(ChatActionType.DB_SET_CHAT_LANGUAGE, watchSetLanguage),
    ])
  }
  