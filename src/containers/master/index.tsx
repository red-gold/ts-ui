import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import MasterLoading from 'components/masterLoading';
import SendFeedback from 'components/sendFeedback';
import config from 'config';
import MasterRouter from 'routes/MasterRouter';

import { IMasterProps } from './IMasterProps';
import { IMasterState } from './IMasterState';
import CallSnackComponent from 'components/callSnack';
import { connectMaster } from './connectMaster';
import { log } from 'utils/log';

// - Create Master component class
export class MasterComponent extends Component<IMasterProps, IMasterState> {
    static isPrivate = true;

    // Constructor
    constructor(props: IMasterProps) {
        super(props);

        this.state = {
            loading: true,
            authed: false,
            dataLoaded: false,
            isVerifide: false,
        };

        // Binding functions to `this`
        this.handleMessage = this.handleMessage.bind(this);
    }

    // Handle click on message
    handleMessage = () => {
        this.props.closeMessage();
    };

    getChatRequestsElms = () => {
        const elements: any[] = [];
        const { chatRequests, users, cancelChatRequest } = this.props;
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

    getCallingUsersElms = () => {
        const elements: any[] = [];
        const { callingUsers, users, cancelCalling, acceptChat } = this.props;
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

    componentDidCatch(error: any, info: any) {
        log.info('===========Catched by React componentDidCatch==============');
        log.info(error, info);
        log.info('====================================');
    }

    componentDidMount() {
        const { authed } = this.props;
        if (!authed) {
            window.location.href = config.gateway.gateway_url + '/auth/login';
        }
    }

    /**
     * Render app DOM component
     */
    public render() {
        const { progress, global, uid, sendFeedbackStatus, hideMessage } = this.props;

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
            <div id="master">
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
                {progress.visible ? <MasterLoading /> : ''}
                <MasterRouter data={{ uid }} />
                {this.getCallingUsersElms()}
                {this.getChatRequestsElms()}
                <Snackbar
                    open={this.props.global.get('messageOpen')}
                    message={this.props.global.get('message')}
                    onClose={hideMessage}
                    autoHideDuration={4000}
                    style={{ left: '1%', transform: 'none' }}
                />
            </div>
        );
    }
}

// - Connect commponent to redux store
export default connectMaster(MasterComponent as any);
