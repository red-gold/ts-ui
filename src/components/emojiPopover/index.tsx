// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EmojiIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import { Picker } from 'emoji-mart';
import { IEmojiProps } from './IEmojiPopover';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';

const EmojiPickerRoot = styled('div')({
    overflow: 'hidden',
    boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 20px 40px -4px',
});
export default function EmojiPopover(props: IEmojiProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div style={{ position: 'relative' }}>
                <IconButton oaria-describedby={id} type="button" onClick={handleOpen}>
                    <EmojiIcon />
                </IconButton>
                <Popper
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
                                emojiSize={22}
                                style={{ maxWidth: 332 }}
                                onSelect={props.onSelect}
                                showPreview={false}
                                custom={[]}
                            />
                        )}
                    </EmojiPickerRoot>
                </Popper>
            </div>
        </ClickAwayListener>
    );
}
