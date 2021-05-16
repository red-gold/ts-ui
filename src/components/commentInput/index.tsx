// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Button from '@material-ui/core/Button/Button';
import React from 'react';
import { ICommentInputProps } from './ICommentInputProps';
import { Comment } from 'core/domain/comments/comment';
import { Map } from 'immutable';
import { useTranslation } from 'react-i18next';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

import EmojiPopover from 'components/emojiPopover';

const AvatarRoot = styled('div')({
    width: 40,
});

const CommentEdit = styled('div')({
    display: 'flex',
    outline: 'none',
    flex: 'auto',
    flexGrow: 1,
    paddingRight: 10,
    padding: 16,
    width: '100%',
});

function CommentInput(props: ICommentInputProps) {
    const { t } = useTranslation();

    const { postId, currentUser, send } = props;
    const [commentText, setCommentText] = React.useState<string>('');
    const [postDisable, setPostDisable] = React.useState(true);

    /**
     * When comment text changed
     */
    const handleChange = (event: any) => {
        const data = event.target.value;

        if (data.length === 0 || data.trim() === '') {
            setCommentText('');
            setPostDisable(true);
        } else {
            setCommentText(data);
            setPostDisable(false);
        }
    };

    /**
     * Clear comment text field
     */
    const clearCommentWrite = () => {
        setCommentText('');
        setPostDisable(true);
    };

    /**
     * Post comment
     */
    const handlePostComment = () => {
        const newComment = new Comment();
        newComment.postId = postId;
        newComment.text = commentText;
        newComment.ownerAvatar = currentUser.get('avatar');
        newComment.ownerDisplayName = currentUser.get('fullName');
        newComment.ownerUserId = currentUser.get('userId');
        newComment.score = 0;

        send(Map(newComment));

        clearCommentWrite();
    };

    /**
     * Handle select emoji
     */
    const handleSelectEmoji = (emoji: any) => {
        setCommentText(commentText + emoji.native);
    };

    return (
        <CommentEdit>
            <AvatarRoot>
                <UserAvatar
                    fullName={currentUser.get('fullName', '')}
                    fileName={currentUser.get('avatar', '')}
                    size={30}
                    style={{ width: 40 }}
                />
            </AvatarRoot>
            <div style={{ width: '100%' }}>
                <FormControl fullWidth>
                    <OutlinedInput
                        sx={{ padding: '10.5px 14px' }}
                        placeholder={t('comment.addCommentPlaceholder')}
                        autoFocus
                        value={commentText}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        maxRows="3"
                        minRows="1"
                        endAdornment={
                            <InputAdornment position="end">
                                <EmojiPopover onSelect={handleSelectEmoji} />
                            </InputAdornment>
                        }
                    />
                </FormControl>

                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <Button color="primary" disabled={postDisable} onClick={handlePostComment}>
                        {' '}
                        {t('comment.postButton')}{' '}
                    </Button>
                </div>
            </div>
        </CommentEdit>
    );
}

export default CommentInput;
