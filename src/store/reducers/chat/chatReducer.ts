// - Import react components
import { ChatActionType } from 'constants/chatActionType';
import { Map } from 'immutable';

import { IChatAction } from './IChatAction';


const setCurrentChat = (state: any, payload: any) => {
  const {  userId } = payload
  return state.setIn(['currentChat'], userId)
  .set('chatOpen', true)
}


const addPlainChatRoomMessages = (state: Map<string, any>, payload: any) => {
  let messageList: Map<string, any> = Map({})
  const {messages, roomId} = payload
  if (messages && messages.length) {
    messages.forEach((message: any) => {
      
      messageList = messageList.set(message.id, Map({...message}))
    });
  }
  return state.mergeIn(['messages', roomId], messageList)

}

/**
 * Chat actions
 */
export let chatReducer = (state = Map({chatOpen: false, recentChatOpen: false }), action: IChatAction) => {
  let { payload } = action
  switch (action.type) {

    case ChatActionType.ADD_CHAT_ROOM_MESSAGES:
      const { messages, chatRoomId } = payload
      return state.mergeIn(['messages', chatRoomId], messages)

    case ChatActionType.ADD_PLAIN_CHAT_ROOM_MESSAGES: return addPlainChatRoomMessages(state, payload)

    case ChatActionType.REMOVE_CHAT_HISTORY:
      const { roomId } = payload
      return state.removeIn(['messages', roomId])

    case ChatActionType.OPEN_CHAT:
      return state.set('chatOpen', true)

    case ChatActionType.CLOSE_CHAT:
      return state.set('chatOpen', false)

    case ChatActionType.OPEN_RECENT_CHAT:
      return state.set('recentChatOpen', true)

    case ChatActionType.CLOSE_RECENT_CHAT:
      return state.set('recentChatOpen', false)

    case ChatActionType.ADD_CHAT_REQUEST:
      return state.setIn(['requests', payload.userId], true)

    case ChatActionType.REMOVE_CHAT_REQUEST:
      return state.deleteIn(['requests', payload.userId])

    case ChatActionType.ADD_CHAT_CALLING:
      return state.setIn(['calling', payload.userId], true)

    case ChatActionType.REMOVE_CHAT_CALLING:
      return state.deleteIn(['calling', payload.userId])

    case ChatActionType.ADD_CHAT_CONNECT:
      return state.setIn(['connect', payload.userId], Map(payload.room))

    case ChatActionType.REMOVE_CHAT_CONNECT:
      return state.deleteIn(['connect', payload.userId])

    case ChatActionType.SET_CURRENT_CHAT: return setCurrentChat(state,payload)

    case ChatActionType.CLEAR_ALL_CHAT_MESSAGE:
      return Map({})

    default:
      return state
  }
}
