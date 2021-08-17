import { Map, List as ImuList } from 'immutable';
import { connect } from 'react-redux';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { WithTranslation, withTranslation } from 'react-i18next';
import { IChatProps, IDispatchProps, IOwnProps, IStateProps } from './IChatProps';
import { chatStyles } from './chatStyles';
import { userSelector } from 'redux/reducers/users/userSelector';
import { withStyles } from '@material-ui/styles';
import { chatSelector } from 'redux/reducers/chat/chatSelector';
import { Message } from 'core/domain/chat/message';
import * as chatActions from 'redux/actions/chatActions';
import { serverSelector } from 'redux/reducers/server/serverSelector';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { ServerRequestStatusType } from 'redux/actions/serverRequestStatusType';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        queryMessage: (requestId: string, roomId: string, page: number, lte: number, gte: number) =>
            dispatch(chatActions.queryMessages(requestId, roomId, page, lte, gte)),
        sendMessage: (message: Message) => dispatch(chatActions.dbCreateChatMessage(message)),
        closeRoom: (roomId: string) => dispatch(chatActions.closeActiveChatRoom(roomId)),
        updateReadMessageMeta: (roomId: string, messageId: string, readCount: number, messageCreatedDate: number) =>
            dispatch(chatActions.updateReadMessageMeta(roomId, messageId, readCount, messageCreatedDate)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectUsers = userSelector.selectUsers();
    const selectUserProfileById = userSelector.selectUserProfileById();
    const selectCurrentMessages = chatSelector.selectMessages();
    const selectChatConnections = chatSelector.selectChatConnections();
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectRequest = serverSelector.selectRequest();
    const selectHasMoreOldMessages = chatSelector.selectHasMoreOldMessages();
    const selectHasMoreNewMessages = chatSelector.selectHasMoreNewMessages();

    const mapStateToProps = (state: Map<string, any>, ownProps: IOwnProps) => {
        const { room } = ownProps;
        const roomId: string = room.get('objectId');
        const connections = selectChatConnections(state);
        const users = selectUsers(state);
        const currentUser = selectCurrentUser(state);
        const members: ImuList<string> = room.get('members');
        const receiverUserId: string = members.filter((memberId) => currentUser.get('userId') !== memberId).first();
        const receiverUser: Map<string, any> | Map<string, unknown> = selectUserProfileById(state, {
            userId: receiverUserId,
        });
        const oldQueryMessageRequestId = StringAPI.createServerRequestId(ServerRequestType.QueryOldMessages, roomId);
        const oldQueryMessageRequest = selectRequest(state, { requestId: oldQueryMessageRequestId });

        const newQueryMessageRequestId = StringAPI.createServerRequestId(ServerRequestType.QueryNewMessages, roomId);
        const newQueryMessageRequest = selectRequest(state, { requestId: newQueryMessageRequestId });

        const hasMoreOldMessages = selectHasMoreOldMessages(state, { roomId });
        const hasMoreNewMessages = selectHasMoreNewMessages(state, { roomId });
        const messages = selectCurrentMessages(state, { roomId });

        return {
            receiverUser,
            currentUser,
            messages,
            roomId,
            connections,
            users,
            oldQueryMessageStatus: oldQueryMessageRequest.get('status', ServerRequestStatusType.NoAction),
            newQueryMessageStatus: newQueryMessageRequest.get('status', ServerRequestStatusType.NoAction),
            oldQueryMessageRequestId,
            newQueryMessageRequestId,
            hasMoreOldMessages,
            hasMoreNewMessages,
        };
    };
    return mapStateToProps;
};

export const connectChat = (component: React.ComponentType<IChatProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(chatStyles)(translateWrapper));
};
