// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface IRightMenuProps {
    onOpenMenu: React.MouseEventHandler<any> | undefined;
    onToggleComments: React.MouseEventHandler<any> | undefined;
    onToggleSharing: React.MouseEventHandler<any> | undefined;
    disableComments: boolean;
    disableSharing: boolean;
    menuAnchorEl: any;
    onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export default function RightIconMenu({
    onOpenMenu,
    disableComments,
    disableSharing,
    menuAnchorEl,
    onClose,
    onToggleComments,
    onToggleSharing,
}: IRightMenuProps) {
    const { t } = useTranslation();

    return (
        <>
            <Tooltip id="tooltip-icon" title={t('post.moreTooltip') as string} placement="bottom-start">
                <IconButton onClick={onOpenMenu}>
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
            <Menu
                open={!!menuAnchorEl}
                anchorEl={menuAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={onClose}
            >
                <MenuItem onClick={onToggleComments} style={{ fontSize: '14px' }}>
                    {!disableComments ? t('post.disableComments') : t('post.enableComments')}{' '}
                </MenuItem>
                <MenuItem onClick={onToggleSharing} style={{ fontSize: '14px' }}>
                    {!disableSharing ? t('post.disableSharing') : t('post.enableSharing')}
                </MenuItem>
            </Menu>
        </>
    );
}
