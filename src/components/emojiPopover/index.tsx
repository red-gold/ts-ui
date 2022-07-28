// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import EmojiIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import { experimentalStyled as styled } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import { EmojiData } from 'emoji-mart';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { IEmojiProps } from './IEmojiPopover';

const EmojiPickerRoot = styled('div')({
    overflow: 'hidden',
    boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 20px 40px -4px',
});

const CustomPopper = styled(Popper)({
    zIndex: 1,
});

export default function EmojiPopover(props: IEmojiProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEmojiSelect = (emoji: EmojiData) => {
        props.onSelect(emoji);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div style={{ position: 'relative' }}>
                <IconButton oaria-describedby={id} type="button" onClick={handleOpen}>
                    <EmojiIcon />
                </IconButton>
                <CustomPopper
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    placement="bottom-end"
                    disablePortal={false}
                    modifiers={[
                        {
                            name: 'flip',
                            enabled: true,
                            options: {
                                altBoundary: true,
                                rootBoundary: 'document',
                                padding: 8,
                            },
                        },
                        {
                            name: 'preventOverflow',
                            enabled: true,
                            options: {
                                altAxis: true,
                                altBoundary: true,
                                tether: true,
                                rootBoundary: document,
                                padding: 8,
                            },
                        },
                    ]}
                >
                    <EmojiPickerRoot>
                        {open && (
                            <Picker
                                native
                                data={data}
                                emojiSize={22}
                                style={{ maxWidth: 332 }}
                                onEmojiSelect={handleEmojiSelect}
                                showPreview={false}
                                custom={[]}
                            />
                        )}
                    </EmojiPickerRoot>
                </CustomPopper>
            </div>
        </ClickAwayListener>
    );
}
