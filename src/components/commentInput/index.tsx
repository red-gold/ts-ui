// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import Button from '@material-ui/core/Button/Button';
import Card from '@material-ui/core/Card/Card';
import CardActions from '@material-ui/core/CardActions/CardActions';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import Divider from '@material-ui/core/Divider/Divider';
import TextField from '@material-ui/core/TextField/TextField';
import { UserAvatarComponent } from 'components/userAvatar/UserAvatarComponent';
import React from 'react';
import { ICommentInputProps } from './ICommentInputProps';
import { Comment } from 'core/domain/comments/comment';
import { Map } from 'immutable';
import { useStyles } from './commentInputStyles';

function CommentInput(props: ICommentInputProps) {
    const { postId, currentUser, send, t } = props;
    const [commentText, setCommentText] = React.useState<string>('');
    const [postDisable, setPostDisable] = React.useState(true);
    const classes = useStyles();

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
    return (
        <div>
            <Divider />
            <Card elevation={0}>
                <CardHeader
                    className={classes.header}
                    avatar={
                        <UserAvatarComponent
                            fullName={currentUser.get('fullName')}
                            fileName={currentUser.get('avatar')}
                            size={24}
                        />
                    }
                    subheader={
                        <TextField
                            autoFocus
                            placeholder={t('comment.addCommentPlaceholder')}
                            multiline
                            rowsMax="4"
                            InputProps={{
                                disableUnderline: true,
                                autoFocus: true,
                                fullWidth: true,
                            }}
                            value={commentText}
                            onChange={handleChange}
                            className={classes.textField}
                            fullWidth={true}
                        />
                    }
                ></CardHeader>
                <CardActions className={classes.postButton}>
                    <Button color="primary" disabled={postDisable} onClick={handlePostComment}>
                        {t('comment.postButton')}
                    </Button>
                </CardActions>
            </Card>
            {/* </Paper> */}
        </div>
    );
}

export default CommentInput;
