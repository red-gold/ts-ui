import FollowDialogComponent from 'components/followDialog/FollowDialogComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';

import React from 'react';

import { IUserItemProps } from './IUserItemProps';
import ListItem from '@material-ui/core/ListItem';
import { useStyles } from './userItemStyles';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from 'react-router';

export function UserItem(props: IUserItemProps) {
    const navigate = useNavigate();
    const classes = useStyles();

    /**
     * Handle click on item
     */
    const handleClick = () => {
        const { onClick, user } = props;
        if (onClick) {
            onClick(user);
        }
    };

    /**
     * Handle go to profile
     */
    const goToProfile = () => {
        const { user, disableProfile } = props;
        if (disableProfile) {
            return;
        }
        const userId = user.get('userId');
        navigate(`/${userId}`);
    };

    const { user, follow } = props;

    return (
        <ListItem onClick={handleClick}>
            <div className={classes.root}>
                <span onClick={goToProfile} className={classes.avatar}>
                    <UserAvatar fullName={user.get('fullName')} fileName={user.get('avatar')} size={30} />
                </span>
                <Typography
                    className={classes.name}
                    onClick={goToProfile}
                    style={{ cursor: 'pointer' }}
                    variant="body1"
                >
                    {user.get('fullName')}
                </Typography>
                {follow && <FollowDialogComponent user={user} />}
            </div>
        </ListItem>
    );
}

export default UserItem;
