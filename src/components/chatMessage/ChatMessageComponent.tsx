
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import moment from 'moment/moment';
import React, { Component } from 'react';
import { emojify } from 'react-emojione';
import { WithTranslation, withTranslation } from 'react-i18next';

import { chatMessageStyles } from './chatMessageStyles';
import { IChatMessageProps } from './IChatMessageProps';
import { IChatMessageState } from './IChatMessageState';

const emojiOptions = {
    style: {
        height: 20,
        margin: 2,
    },
};

export class ChatMessageComponent extends Component<IChatMessageProps & WithTranslation, IChatMessageState> {
    /**
     * Component constructor
     */
    constructor(props: IChatMessageProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { me, text, avatar, ownerName, updatedDate, classes, loading } = this.props;

        const loadingElement = (
            <div className={classNames('simile-loading', classes.loading)}>
                <div className="leftEye"></div>
                <div className="rightEye"></div>
                <div className="mouth"></div>
            </div>
        );
        return (
            <div className={classes.root}>
                <div className={classNames(classes.messageRoot, { [classes.messageRootRight]: me })}>
                    {!me && (
                        <UserAvatar
                            className={classes.messageAvatar}
                            fullName={ownerName}
                            size={30}
                            fileName={avatar}
                        />
                    )}
                    <div className={classes.messageBox}>
                        <Typography className={classNames(classes.updatedDate, { me: me })} noWrap variant={'caption'}>
                            {moment(updatedDate).local().fromNow()}
                        </Typography>
                        <div className={classNames(classes.messageText, { [classes.messageTextRight]: me })}>
                            <Typography variant={'body2'}>{emojify(text, emojiOptions)}</Typography>
                            {loading ? loadingElement : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(ChatMessageComponent);

export default withStyles(chatMessageStyles as any)(translateWrapper as any);
