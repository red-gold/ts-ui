import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import React, { Component } from 'react';
import classNames from 'classnames';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';

import { IRoomItemProps } from './IRoomItemProps';
import { IRoomItemState } from './IRoomItemState';
import { roomItemStyles } from './roomItemStyles';
import { Button } from '@material-ui/core';

export class RoomItemComponent extends Component<IRoomItemProps, IRoomItemState> {
    constructor(props: IRoomItemProps) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
        this.handleOpenRoom = this.handleOpenRoom.bind(this);
    }

    handleOpenRoom = (event: any) => {
        event.preventDefault();
        const { openRoom, room, closeRoomList } = this.props;
        const roomId: string = room.get('roomId');
        openRoom(roomId);
        closeRoomList();
    };

    render() {
        const { avatar, fullName, classes, room } = this.props;
        const roomId: string = room.get('objectId');
        const unreadCount: string = room.get('unreadCount');
        const lastMessageText = room.getIn(['lastMessage', 'text'], '');
        return (
            <Button
                key={`room-item-${roomId}`}
                className={classNames(classes.listItem)}
                onClick={this.handleOpenRoom}
                fullWidth
                component={'a'}
            >
                <ListItemAvatar>
                    <UserAvatar fullName={fullName} size={40} fileName={avatar} />
                </ListItemAvatar>
                <ListItemText
                    className={classes.itemText}
                    primary={fullName}
                    secondary={
                        <Typography variant="body2" noWrap>
                            {lastMessageText}
                        </Typography>
                    }
                />

                <Badge badgeContent={unreadCount} color="secondary"></Badge>
            </Button>
        );
    }
}

// - Connect component to redux store
export default withStyles(roomItemStyles)(RoomItemComponent);
