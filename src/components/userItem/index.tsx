import FollowDialogComponent from 'components/user/FollowButton';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';

import React from 'react';

import { IUserItemProps } from './IUserItemProps';
import ListItem from '@material-ui/core/ListItem';
import { useStyles } from './userItemStyles';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from 'react-router';
import { PATH_MAIN } from 'routes/paths';

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
        navigate(PATH_MAIN.user.profile.replace(':socialName', user.get('socialName')));
    };

    const { user, follow } = props;

    return (
        <ListItem onClick={handleClick}>
            <div className={classes.root}>
                <span onClick={goToProfile} className={classes.avatar}>
                    <UserAvatar displayName={user.get('fullName')} src={user.get('avatar')} size={30} />
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
