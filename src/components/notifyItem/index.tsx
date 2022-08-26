import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import SvgClose from '@mui/icons-material/Close';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import React from 'react';
import classNames from 'classnames';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Button from '@mui/material/Button';
import useTheme from '@mui/material/styles/useTheme';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import StringAPI from 'api/StringAPI';
import { useStyles } from './notifyItemStyles';
import { INotifyItemProps } from './INotifyItemProps';

export function NotifyItemComponent(props: INotifyItemProps) {
    const classes = useStyles();
    const navigate = useNavigate();
    const theme = useTheme();

    const { description, fullName, avatar, isSeen, id, notifierUserId, url, deleteNotify } = props;
    const handleSeenNotify = (event: any) => {
        event.preventDefault();

        const { seenNotify, id, url, isSeen, closeNotify } = props;

        if (id) {
            if (!isSeen) {
                seenNotify(id);
            }
            closeNotify();
            navigate(url);
        }
    };

    const handleDeleteNotify = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        deleteNotify(id);
    };

    return (
        <Button
            key={notifierUserId}
            className={classNames(classes.listItem, { [classes.notSeen]: !isSeen })}
            component={'a'}
            onClick={handleSeenNotify}
            fullWidth
            href={url}
        >
            <ListItemAvatar>
                <UserAvatar displayName={fullName} size={40} src={avatar} />
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
                        {StringAPI.capitalizeFirstLetter(description)}
                    </Typography>
                }
            />
            <ListItemSecondaryAction className={classes.closeButton}>
                <div onClick={handleDeleteNotify}>
                    <SvgClose className={classes.closeIcon} style={{ cursor: 'pointer' }} />
                </div>
            </ListItemSecondaryAction>
        </Button>
    );
}

export default NotifyItemComponent;
