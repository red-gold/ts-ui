import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import React from 'react';
import { Helmet } from 'react-helmet';
import MasterLoading from 'components/masterLoading';
import SendFeedback from 'components/sendFeedback';
import config from 'config';

import CallSnackComponent from 'components/callSnack';
// redux selectors
import { globalSelector } from 'redux/reducers/global/globalSelector';
import { chatSelector } from 'redux/reducers/chat/chatSelector';
import { userSelector } from 'redux/reducers/users/userSelector';
import { useDispatch, useSelector } from 'redux/store';
// actions
import * as globalActions from 'redux/actions/globalActions';
import * as chatActions from 'redux/actions/chatActions';
// selctors
const selectProgress = globalSelector.selectProgress();
const selectFeedbackStatus = globalSelector.selectFeedbackStatus();
const selectCallingUsers = chatSelector.selectCallingUsers();
const selectChatRequests = chatSelector.selectChatRequests();
const selectGlobal = globalSelector.selectGlobal();
const selectUsers = userSelector.selectUsers();
const selectAllDataLoaded = globalSelector.selectAllDataLoaded();

// ----------------------------------------------------------------------

export interface MasterProps {
    children?: React.ReactNode;
}

export default function Master({ children }: MasterProps) {
    // dispatchers
    const dispatch = useDispatch();

    const cancelCalling = (userId: string) => dispatch(chatActions.asyncIgnoreChatRequest(userId));
    const cancelChatRequest = (userId: string) => dispatch(chatActions.asyncCancelChatRequest(userId));
    const acceptChat = (userId: string) => dispatch(chatActions.asyncAcceptChatRequest(userId));
    const hideMessage = () => dispatch(globalActions.hideMessage());
    // state selectors
    const progress = useSelector(selectProgress);
    const sendFeedbackStatus = useSelector(selectFeedbackStatus);
    const callingUsers = useSelector(selectCallingUsers);
    const chatRequests = useSelector(selectChatRequests);
    const global = useSelector(selectGlobal);
    const users = useSelector(selectUsers);

    const getChatRequestsElms = () => {
        const elements: any[] = [];
        if (chatRequests && users && cancelChatRequest) {
            chatRequests.forEach((value, userId) => {
                elements.push(
                    <CallSnackComponent
                        key={`chat-request-${userId}`}
                        avatarURL={users.getIn([userId, 'avatar'], '')}
                        title={users.getIn([userId, 'fullName'])}
                        subtitle="Dialing ..."
                        onClose={(userId) => {
                            cancelChatRequest(userId);
                        }}
                        userId={userId}
                        soundURL={
                            'https://raw.githubusercontent.com/red-gold/red-gold-web/master/website/static/media/notification_sound.mp3'
                        }
                        onConnect={() => {}}
                    />,
                );
            });
        }
        return elements;
    };

    const getCallingUsersElms = () => {
        const elements: any[] = [];
        if (callingUsers && users && cancelCalling && acceptChat) {
            callingUsers.forEach((value, userId) => {
                elements.push(
                    <CallSnackComponent
                        key={`chat-request-${userId}`}
                        avatarURL={users.getIn([userId, 'avatar'], '')}
                        title={users.getIn([userId, 'fullName'])}
                        subtitle="Calling ..."
                        onClose={(userId) => {
                            cancelCalling(userId);
                        }}
                        userId={userId}
                        soundURL={
                            'https://raw.githubusercontent.com/red-gold/red-gold-web/master/website/static/media/notification_sound.mp3'
                        }
                        onConnect={(userId) => {
                            acceptChat(userId);
                        }}
                    />,
                );
            });
        }
        return elements;
    };

    const header = (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{config.header.title}</title>
            {config.header.meta && config.header.meta.length > 0
                ? config.header.meta.map((metaData) => (
                      <meta key={metaData.name} name={metaData.name} content={metaData.content} />
                  ))
                : ''}
        </Helmet>
    );
    return (
        <>
            {header}
            {sendFeedbackStatus ? <SendFeedback /> : ''}
            <div className="master__progress" style={{ display: progress.get('visible') ? 'block' : 'none' }}>
                <LinearProgress variant="determinate" value={progress.get('percent', 0)} />
            </div>
            <div
                className="master__loading animate-fading2"
                style={{ display: global.get('showTopLoading') ? 'flex' : 'none' }}
            >
                <div className="title">Loading ... </div>
            </div>
            {progress.get('visible') ? <MasterLoading /> : ''}

            {children}
            {getCallingUsersElms()}
            {getChatRequestsElms()}
            <Snackbar
                open={global.get('messageOpen')}
                message={global.get('message')}
                onClose={hideMessage}
                autoHideDuration={4000}
                style={{ left: '1%', transform: 'none' }}
            />
        </>
    );
}
