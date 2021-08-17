import React from 'react';
// material
import Avatar from '@material-ui/core/Avatar';
// utils
import createAvatar from 'utils/createAvatar';
//
import { IUserAvatarProps } from './IUserAvatarProps';

const defaultSize = 40;
export function UserAvatarComponent(props: IUserAvatarProps) {
    const { src, displayName, size, ...other } = props;

    return (
        <Avatar
            src={src}
            alt={displayName}
            sx={{ width: size || defaultSize, height: size || defaultSize }}
            color={src ? 'default' : createAvatar(displayName || '').color}
            {...other}
        >
            {createAvatar(displayName || '').name}
        </Avatar>
    );
}
export default UserAvatarComponent;
