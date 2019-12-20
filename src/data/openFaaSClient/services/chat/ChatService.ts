// - Import react components
import { ChatRoom } from 'core/domain/chat/chatRoom';
import { Message } from 'core/domain/chat/message';
import { SocialError } from 'core/domain/common';
import { IChatService } from 'core/services/chat';
import { fromJS, Map } from 'immutable';
import { injectable } from 'inversify';
import io from 'socket.io-client';

/**
 * Firbase userSetting service
 */
@injectable()
export class ChatService implements IChatService {

  socket: any = null

  /**
   * Constructor
   */
  constructor() {
    this.removeHistoryRoom = this.removeHistoryRoom.bind(this)
    this.removeMessagesByBatch = this.removeMessagesByBatch.bind(this)
    this.romveMessages = this.romveMessages.bind(this)
  }


  /**
   * Connect to websocket server
   */
  public wsConnect = (url: string, accessKey: string, uid: string, callback: Function) => {
    this.socket = io(url, {
      query: `accessKey=${accessKey}&uid=${uid}`
    });

    this.socket.on('connect', () => {
      console.log(`ws is connected.`);
      callback({ signal: "status", data: "Connected" })
    });

    this.socket.on('disconnect', () => {
      console.log(`ws is disconnected.`);
      callback({signal: "status", data: "Disconnected" })
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log(`reconnecting #${attemptNumber} ...`);
      callback({signal: "status", data: "Reconnecting" })

    });

    this.socket.on('dispatch', (action: any) => {
      console.log(`dispatch: `, action);
      if (action) {
      callback({signal: "dispatch", data: action })
      } else {
        throw new SocialError('emptyActionError', 'Empty action fired on dispatch from websocket server!');
      }
    });

    this.socket.on('dispatch-list', (actionList: any) => {
      console.log(`dispatch action list: `, actionList);
      if (actionList && actionList.length) {
        for (let index = 0; index < actionList.length; index++) {
          const action = actionList[index];
         callback({signal: "dispatch", data: action })
        }
      } else {
        throw new SocialError('emptyActionListError', 'Empty action list fired on dispatch from websocket server!');

      }
    });

    return this.socket.close
  }


  /**
   * Create chat request
   */
  public createChatRquest = (recUserId: string) => {
    if (this.socket) {
      this.socket.emit('request-chat', { recUserId })
    } else {
      throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
    }
  }

  /**
   * Cancel chat request
   */
  public cancelChatRquest = (recUserId: string) => {
    if (this.socket) {
      this.socket.emit('cancel-chat', { recUserId })
    } else {
      throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
    }
  }

  /**
   * Ignore chat request
   */
  public ignoreChatRquest = (reqUserId: string) => {
    if (this.socket) {
      this.socket.emit('ignore-chat', { reqUserId })
    } else {
      throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
    }
  }

  /**
   * Accept chat request
   */
  public acceptChatRquest = (reqUserId: string) => {
    if (this.socket) {
      this.socket.emit('accept-chat', { reqUserId })
    } else {
      throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
    }
  }

  /**
   * Close chat
   */
  public closeChat = (userId: string) => {
    if (this.socket) {
      this.socket.emit('close-chat', { userId })
    } else {
      throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
    }
  }

  /**
   * Join a chat room
   */
  public joinChatRoom = (roomId: string) => {
    if (this.socket) {
      this.socket.emit('join-chat', { roomId })
    } else {
      throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
    } 
  }

  /**
   * Join a chat room
   */
  public createChatMessage = (message: Message ) => {
    if (this.socket) {
      this.socket.emit('chatroom-message', {message})
    } else {
      throw new SocialError('nullSocketError', 'There is no connection bound to socket!');
    } 
  }
  


  // ************************ //
  // ** Old implementation ** //TODO: Remove unused functions
  // ************************ //


  /**
   * Create chat room
   */
  public createChatRoom = (chatRoom: ChatRoom) => {
    return 'Not implemented' as any
  }

  /**
   * Get chat room
   */
  public getPeerChatRoom = (firstUserId: string, secondUserId: string) => {
    return 'Not implemented' as any
  }

  /**
   * Set chat language
   */
  public setChatLangauge = (uid: string, input: string, output: string, roomId: string) => {
    return 'Not implemented' as any
  }

  /**
   * Get chat messages
   */
  public subscribeChatMessages = (chatRoomId: string,
    callback: (messages: Map<string, any>) => void) => {
    return 'Not implemented' as any
  }

  /**
   * Get chat messages
   */
  public getChatMessages = (chatRoomId: string) => {
    return 'Not implemented' as any
  }

  /**
   * Remove chat room history
   */
  * removeHistoryRoom(chatRoomId: string) {
    yield 'Not implemented' as any
  }

  * removeMessagesByBatch(refList: any) {
    yield 'Not implemented' as any
  }

  * romveMessages(refs: any[]) {
    yield 'Not implemented' as any
  }

}