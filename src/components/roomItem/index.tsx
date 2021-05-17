import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import classNames from 'classnames';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/core/styles/useTheme';
import { IRoomItemProps } from './IRoomItemProps';
import { Button } from '@material-ui/core';
import { useStyles } from './roomItemStyles';

export function RoomItemComponent(props: IRoomItemProps) {
    const classes = useStyles();
    const theme = useTheme();

    const handleOpenRoom = (event: any) => {
        event.preventDefault();
        const { openRoom, room, closeRoomList } = props;
        const roomId: string = room.get('roomId');
        openRoom(roomId);
        closeRoomList();
    };

    const { avatar, fullName, room } = props;
    const roomId: string = room.get('objectId');
    const unreadCount: string = room.get('unreadCount');
    const lastMessageText = room.getIn(['lastMessage', 'text'], '');
    return (
        <Button
            key={`room-item-${roomId}`}
            className={classNames(classes.listItem)}
            onClick={handleOpenRoom}
            fullWidth
            component={'a'}
        >
            <ListItemAvatar>
                <UserAvatar fullName={fullName} size={40} fileName={avatar} />
            </ListItemAvatar>
            <ListItemText
                className={classes.itemText}
                primary={
                    <Typography
                        sx={{ textTransform: 'capitalize', color: theme.palette.text.primary }}
                        variant="subtitle1"
                        noWrap
                    >
                        {fullName}
                    </Typography>
                }
                secondary={
                    <Typography
                        sx={{ textTransform: 'none', color: theme.palette.text.secondary }}
                        variant="body2"
                        noWrap
                    >
                        {lastMessageText}
                    </Typography>
                }
            />

            <Badge badgeContent={unreadCount} color="secondary"></Badge>
        </Button>
    );
}

export default RoomItemComponent;
