import { useTheme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import React from 'react';

import { IUserAvatarProps } from './IUserAvatarProps';

export function UserAvatarComponent(props: IUserAvatarProps) {
    const theme = useTheme();
    const { fileName, fullName, style, size, onClick, className } = props;

    return (
        <>
            {fileName && fileName !== '' && fileName !== 'noImage' ? (
                <Avatar
                    variant="rounded"
                    className={className || ''}
                    src={fileName ? fileName : ' '}
                    style={{
                        ...style,
                        backgroundColor: theme.palette.common.white,
                        width: size || 36,
                        height: size || 36,
                    }}
                    onClick={onClick}
                />
            ) : (
                <Avatar
                    variant="rounded"
                    className={className || ''}
                    style={{ ...style, width: size || 36, height: size || 36 }}
                    onClick={onClick}
                >
                    {fullName ? fullName.slice(0, 1) : ''}
                </Avatar>
            )}
        </>
    );
}
export default UserAvatarComponent;
