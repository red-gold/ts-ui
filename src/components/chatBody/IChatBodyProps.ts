import { Map } from 'immutable';
import { ServerRequestModel } from 'models/server/serverRequestModel';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
export interface IChatBodyProps {
    /**
     * Translate to locale string
     */
    t?: (state: any) => any;

    chatMessages: Map<string, Map<string, any>>;

    classes?: any;

    currentUser: Map<string, any>;

    room: Map<string, any>;

    oldQueryMessageStatus: ServerRequestStatusType;

    oldQueryMessageRequestId: string;

    hasMoreOldMessages: boolean;

    newQueryMessageStatus: ServerRequestStatusType;

    newQueryMessageRequestId: string;

    hasMoreNewMessages: boolean;

    receiverUser: Map<string, any>;
    handleReadMessage: (message: Map<string, any>) => void;
    queryMessage: (requestId: string, roomId: string, page: number, lte: number, gte: number) => any;
}
