// hooks
import React from 'react';
import { Avatar } from '@mui/material';
import useAuth from '../hooks/useAuth';
//
import createAvatar from '../utils/createAvatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
    const user = useAuth().user || { avatar: undefined, displayName: '' };
    return (
        <Avatar
            src={user.avatar}
            alt={user.displayName}
            color={user.avatar ? 'default' : createAvatar(user.displayName).color}
            {...other}
        >
            {createAvatar(user.displayName).name}
        </Avatar>
    );
}
