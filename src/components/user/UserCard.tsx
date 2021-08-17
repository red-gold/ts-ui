import React from 'react';
import FollowButton from 'components/user/FollowButton';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { PATH_MAIN } from 'routes/paths';
import { Map } from 'immutable';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Stack, Link, Typography, CardProps, styled } from '@material-ui/core';

// ----------------------------------------------------------------------

const Gap = styled('div')(() => ({
    height: '1.5rem',
}));

// ----------------------------------------------------------------------

export interface UserCardProps extends CardProps {
    user: Map<string, any>;
}

export default function UserCard({ user, ...other }: UserCardProps) {
    return (
        <Card {...other}>
            <Stack display="flex" justifyContent="center" alignItems="center">
                <UserAvatar displayName={user.get('fullName')} src={user.get('avatar')} size={90} />
                <Link
                    to={PATH_MAIN.user.profile.replace(':socialName', user.get('socialName'))}
                    variant="subtitle1"
                    color="text.primary"
                    sx={{ mt: 4 }}
                    component={RouterLink}
                >
                    <Typography variant="subtitle1" align="center">
                        {user.get('fullName')}
                    </Typography>
                </Link>
                <Gap />
                <FollowButton user={user} />
            </Stack>
        </Card>
    );
}
