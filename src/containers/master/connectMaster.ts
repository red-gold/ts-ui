import { connect } from 'react-redux';

import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { Map } from 'immutable';
import { IMasterProps } from './IMasterProps';

// - Import actions
import * as globalActions from 'store/actions/globalActions';
import * as authorizeActions from 'store/actions/authorizeActions';
import * as chatActions from 'store/actions/chatActions';
import { ComponentType } from 'react';
import { globalSelector } from 'store/reducers/global/globalSelector';
import { chatSelector } from 'store/reducers/chat/chatSelector';
import { userSelector } from 'store/reducers/users/userSelector';

// - Map dispatch to props
const mapDispatchToProps = (dispatch: any) => {
    return {
        defaultDataDisable: () => {
            dispatch(globalActions.defaultDataDisable());
        },
        defaultDataEnable: () => {
            dispatch(globalActions.defaultDataEnable());
        },
        closeMessage: () => {
            dispatch(globalActions.hideMessage());
        },
        loadDataGuest: () => {
            dispatch(globalActions.loadDataGuest());
        },
        cancelCalling: (userId: string) => dispatch(chatActions.asyncIgnoreChatRequest(userId)),
        cancelChatRequest: (userId: string) => dispatch(chatActions.asyncCancelChatRequest(userId)),
        acceptChat: (userId: string) => dispatch(chatActions.asyncAcceptChatRequest(userId)),
        showMasterLoading: () => dispatch(globalActions.showMasterLoading()),
        hideMasterLoading: () => dispatch(globalActions.hideMasterLoading()),
        hideMessage: () => dispatch(globalActions.hideMessage()),
        logout: () => dispatch(authorizeActions.dbLogout()),
    };
};

const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectAuthedtUser();
    const selectProgress = globalSelector.selectProgress();
    const selectFeedbackStatus = globalSelector.selectFeedbackStatus();
    const selectCallingUsers = chatSelector.selectCallingUsers();
    const selectChatRequests = chatSelector.selectChatRequests();
    const selectGlobal = globalSelector.selectGlobal();
    const selectUsers = userSelector.selectUsers();
    const selectAllDataLoaded = globalSelector.selectAllDataLoaded();

    const mapStateToProps = (state: Map<string, any>) => {
        const dataLoaded: boolean = selectAllDataLoaded(state);
        const currentUser = selectCurrentUser(state);
        const uid = currentUser.get('userId');
        const guest = currentUser.get('guest');
        const authed = currentUser.get('authed');
        const progress = selectProgress(state);
        const sendFeedbackStatus = selectFeedbackStatus(state);
        const callingUsers = selectCallingUsers(state);
        const chatRequests = selectChatRequests(state);
        const global = selectGlobal(state);
        const users = selectUsers(state);
        return {
            sendFeedbackStatus,
            progress,
            guest,
            uid,
            authed,
            global,
            callingUsers,
            chatRequests,
            users,
            dataLoaded,
        };
    };
    return mapStateToProps;
};

export const connectMaster = (component: ComponentType<IMasterProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
