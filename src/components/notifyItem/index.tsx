// - Import react components
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import SvgClose from '@material-ui/icons/Close';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import React, { Component } from 'react';
import classNames from 'classnames';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { INotifyItemProps } from './INotifyItemProps';
import { INotifyItemState } from './INotifyItemState';
import { notifyItemStyles } from './notifyItemStyles';
import { Button } from '@material-ui/core';

/**
 * Create component class
 */
export class NotifyItemComponent extends Component<INotifyItemProps, INotifyItemState> {
    /**
     * Component constructor
     *
     */
    constructor(props: INotifyItemProps) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
        this.handleSeenNotify = this.handleSeenNotify.bind(this);
    }

    handleSeenNotify = (event: any) => {
        event.preventDefault();
        const { seenNotify, id, url, goTo, isSeen, closeNotify } = this.props;

        if (id) {
            if (!isSeen) {
                seenNotify(id);
            }
            closeNotify();
            goTo(url);
        }
    };

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { description, fullName, avatar, isSeen, id, notifierUserId, url, deleteNotify, classes } = this.props;
        return (
            <Button
                key={notifierUserId}
                className={classNames(classes.listItem, { [classes.notSeen]: !isSeen })}
                component={'a'}
                onClick={this.handleSeenNotify}
                fullWidth
                href={url}
            >
                <ListItemAvatar>
                    <UserAvatar fullName={fullName} size={40} fileName={avatar} />
                </ListItemAvatar>
                <ListItemText className={classes.itemText} primary={fullName} secondary={description} />
                <ListItemSecondaryAction className={classes.closeButton}>
                    <div onClick={() => deleteNotify(id)}>
                        <SvgClose className={classes.closeIcon} style={{ cursor: 'pointer' }} />
                    </div>
                </ListItemSecondaryAction>
            </Button>
        );
    }
}

// - Connect component to redux store
export default withStyles(notifyItemStyles)(NotifyItemComponent);
