import { Map } from 'immutable';
import { Message } from 'core/domain/chat/message';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';
import { Breakpoint } from '@material-ui/core/styles';

export type IChatProps = IOwnProps & IDispatchProps & IStateProps;

export interface IOwnProps {
    /**
     * Styles
     */
    classes?: any;
    /**
     * Current chat room
     */
    room: Map<string, any>;
    /**
     * Whether window chat is open
     */
    open: boolean;

    /**
     * Window width
     */
    width?: Breakpoint;
}

export interface IStateProps {
    /**
     * Current user
     */
    currentUser: Map<string, any>;

    /**
     * Receiver user info
     */
    receiverUser: Map<string, any>;

    /**
     * Connections
     */
    connections: Map<string, any>;

    /**
     * Users
     */
    users: Map<string, any>;

    /**
     * Chat messages
     */
    messages: Map<string, Map<string, any>>;

    oldQueryMessageStatus: ServerRequestStatusType;

    oldQueryMessageRequestId: string;

    hasMoreOldMessages: boolean;

    newQueryMessageStatus: ServerRequestStatusType;

    newQueryMessageRequestId: string;

    hasMoreNewMessages: boolean;
}

export interface IDispatchProps {
    sendMessage: (message: Message) => any;
    closeRoom: (roomId: string) => any;
    updateReadMessageMeta: (roomId: string, messageId: string, readCount: number, messageCreatedDate: number) => any;
    queryMessage: (requestId: string, roomId: string, page: number, lte: number, gte: number) => any;
}
