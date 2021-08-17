import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import SvgClose from '@material-ui/icons/Close';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import React from 'react';
import classNames from 'classnames';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import { INotifyItemProps } from './INotifyItemProps';
import Button from '@material-ui/core/Button';
import useTheme from '@material-ui/core/styles/useTheme';
import { useStyles } from './notifyItemStyles';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from 'react-router';
import StringAPI from 'api/StringAPI';

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
