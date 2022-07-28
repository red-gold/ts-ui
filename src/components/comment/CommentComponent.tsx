import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FormControl from '@mui/material/FormControl';
import { NavLink } from 'react-router-dom';
import { defaultNoValue } from 'utils/errorHandling';
import { WithTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import EmojiPopover from 'components/emojiPopover';
import ListItemText from '@mui/material/ListItemText';
import { experimentalStyled as styled } from '@mui/material/styles';
import { PATH_MAIN } from 'routes/paths';
import { connectComment } from './connectComment';
import { ICommentComponentState } from './ICommentComponentState';
import { ICommentComponentProps } from './ICommentComponentProps';

const CommentPreview = styled('div')({
    display: 'flex',
});

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

export class CommentComponent extends Component<ICommentComponentProps & WithTranslation, ICommentComponentState> {
    static propTypes = {
        /**
         * Comment object
         */
        comment: PropTypes.object,
        /**
         * If it's true the post owner is the logged in user which this post be long to the comment
         */
        isPostOwner: PropTypes.bool,
        /**
         * If it's true the comment is disable to write
         */
        disableComments: PropTypes.bool,
    };

    /**
     * DOM styles
     *
     *
     * @memberof CommentComponent
     */
    styles = {
        author: {
            fontSize: '10px',
            paddingRight: '10px',
            fontWeight: 400,
            color: 'rgba(0,0,0,0.87)',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        },
        textarea: {
            fontWeight: 400,
            fontSize: '14px',
            border: 'none',
            width: '100%',
            outline: 'none',
            resize: 'none',
        },
        cancel: {
            float: 'right',
            clear: 'both',
            zIndex: 5,
            margin: '0px 5px 5px 0px',
            fontWeight: 400,
        },
    };

    /**
     * Fields
     *
     * @type {*}
     * @memberof CommentComponent
     */
    textareaRef: any;

    divCommentRef: any;

    inputText: any;

    divComment: any;

    constructor(props: ICommentComponentProps & WithTranslation) {
        super(props);

        this.textareaRef = (i: any) => {
            this.inputText = i;
        };
        this.divCommentRef = (i: any) => {
            this.divComment = i;
        };

        // Defaul state
        this.state = {
            /**
             * Comment text
             */
            text: this.props.comment.get('text', ''),
            /**
             * Comment text to match edit with new comment that is edited
             */
            initialText: this.props.comment.get('text', ''),
            /**
             * If comment text dosn't take any change it will be true
             */
            editDisabled: true,
            /**
             * If it's true the post owner is the logged in user which this post be long to the comment
             */
            isPostOwner: false,
            /**
             * The anchor of comment menu element
             */
            openMenu: false,
            /**
             * Anchor element
             */
            anchorEl: null,
            emojiOpen: false,
        };

        // Binding functions to `this`
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdateComment = this.handleUpdateComment.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleCancelEdit = this.handleCancelEdit.bind(this);
        this.handleEditComment = this.handleEditComment.bind(this);
    }

    /**
     * Handle show edit comment
     * @param  {event} evt is an event passed by clicking on edit button
     */
    handleEditComment = () => {
        this.setState({ openMenu: false });
        const { openEditor } = this.props;
        if (openEditor) {
            openEditor();
        }
    };

    /**
     * Handle cancel edit
     * @param  {event} evt is an event passed by clicking on cancel button
     */
    handleCancelEdit = () => {
        const { closeEditor } = this.props;
        const { initialText } = this.state;
        if (initialText) {
            this.setState({
                text: initialText,
            });
        }
        if (closeEditor) {
            closeEditor();
        }
    };

    /**
     * Handle toggle emoji
     */
    handleToggleEmoji = () => {
        if (this.state.emojiOpen) {
            this.handleCloseEmojiMenu();
        } else {
            this.handleOpenEmojiMenu();
        }
    };

    /**
     * Handle open emoji menu
     */
    handleOpenEmojiMenu = () => {
        this.setState({ emojiOpen: true });
    };

    /**
     * Handle close emoji menu
     */
    handleCloseEmojiMenu = () => {
        this.setState({ emojiOpen: false });
    };

    /**
     * Handle edit comment
     */
    handleUpdateComment = () => {
        const { comment } = this.props;
        const updateComment = comment.set('text', this.state.text);
        const { update } = this.props;
        if (update) {
            update(updateComment);
        }
        this.setState({
            initialText: this.state.text,
        });
    };

    /**
     * Handle select emoji
     */
    handleSelectEmoji = (emoji: any) => {
        this.setState((prevState) => {
            const { text } = prevState;
            return { text: text + emoji.native, editDisabled: false };
        });
    };

    /**
     * When comment text changed
     */
    handleOnChange = (evt: any) => {
        const data = evt.target.value;
        if (data.length === 0 || data.trim() === '' || data.trim() === this.state.initialText) {
            this.setState({
                text: data,
                editDisabled: true,
            });
        } else {
            this.setState({
                text: data,
                editDisabled: false,
            });
        }
    };

    /**
     * Delete a comment
     */
    handleDelete = (evt: any, id?: string | null, postId?: string) => {
        if (this.props.delete) {
            this.props.delete(id, postId);
        }
    };

    /**
     * Handle comment menu
     */
    handleCommentMenu = (event: any) => {
        this.setState({ openMenu: true, anchorEl: event.currentTarget });
    };

    /**
     * Handle close request for comment menu
     */
    handleCloseCommentMenu = () => {
        this.setState({ openMenu: false });
    };

    render() {
        /**
         * Comment object from props
         */
        const { comment, classes, t, editorStatus } = this.props;

        const { openMenu, anchorEl } = this.state;

        const rightIconMenu = (
            <div className={classes.menuRoot}>
                {this.props.isCommentOwner && (
                    <IconButton onClick={this.handleCommentMenu}>
                        <MoreVertIcon className={classes.moreIcon} />
                    </IconButton>
                )}
                <Popover
                    open={defaultNoValue(openMenu, false)}
                    anchorEl={anchorEl}
                    anchorReference={'anchorEl'}
                    anchorPosition={{ top: 0, left: 0 }}
                    onClose={this.handleCloseCommentMenu}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <MenuList role="menu">
                        {/* <MenuItem className={classes.rightIconMenuItem}>{t!('comment.replyButton')}</MenuItem> */}
                        {this.props.isCommentOwner ? (
                            <MenuItem className={classes.rightIconMenuItem} onClick={this.handleEditComment}>
                                {t('comment.editButton')}
                            </MenuItem>
                        ) : (
                            ''
                        )}
                        {this.props.isCommentOwner || this.props.isPostOwner ? (
                            <MenuItem
                                className={classes.rightIconMenuItem}
                                onClick={(evt: any) =>
                                    this.handleDelete(evt, comment.get('objectId'), comment.get('postId'))
                                }
                            >
                                {t('comment.deleteButton')}
                            </MenuItem>
                        ) : (
                            ''
                        )}
                    </MenuList>
                </Popover>
            </div>
        );

        const Author = () => (
            <div>
                <NavLink to={PATH_MAIN.user.profile.replace(':socialName', comment.get('socialName'))}>
                    {' '}
                    <Typography component="span" variant="subtitle2" sx={{ color: '#212b36' }}>
                        {comment.get('ownerDisplayName', 'Loading...')}
                    </Typography>
                </NavLink>
                <Typography component="span" variant="caption" sx={{ color: '#919eab', marginLeft: 2 }}>
                    {moment(comment.get('creationDate', 0)).local().fromNow()}
                </Typography>
            </div>
        );

        const commentEdit = (
            <CommentEdit>
                <AvatarRoot>
                    <UserAvatar
                        displayName={comment.get('ownerDisplayName', '')}
                        src={comment.get('ownerAvatar', '')}
                        size={30}
                    />
                </AvatarRoot>
                <div style={{ width: '100%' }}>
                    <FormControl fullWidth>
                        <OutlinedInput
                            sx={{ padding: '10.5px 14px' }}
                            placeholder={t('comment.updateCommentPlaceholder')}
                            autoFocus
                            value={this.state.text}
                            onChange={this.handleOnChange}
                            fullWidth
                            multiline
                            maxRows="3"
                            minRows="1"
                            endAdornment={
                                <InputAdornment position="end">
                                    <EmojiPopover onSelect={this.handleSelectEmoji} />
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <Button
                            color="primary"
                            disabled={this.state.editDisabled}
                            style={{
                                float: 'right',
                                clear: 'both',
                                zIndex: 5,
                                margin: '0px 5px 5px 0px',
                                fontWeight: 400,
                            }}
                            onClick={this.handleUpdateComment}
                        >
                            {' '}
                            {t('comment.updateButton')}{' '}
                        </Button>
                        <Button color="primary" style={this.styles.cancel as any} onClick={this.handleCancelEdit}>
                            {' '}
                            {t('comment.cancelButton')}{' '}
                        </Button>
                    </div>
                </div>
            </CommentEdit>
        );

        const commentPreview = (
            <CommentPreview>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar sx={{ minWidth: '40px' }}>
                        <NavLink to={PATH_MAIN.user.profile.replace(':socialName', comment.get('socialName'))}>
                            <UserAvatar
                                displayName={comment.get('ownerDisplayName', '')}
                                src={comment.get('ownerAvatar', '')}
                                size={30}
                            />
                        </NavLink>
                    </ListItemAvatar>
                    <ListItemText
                        sx={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f4f6f8' }}
                        secondaryTypographyProps={{ component: 'span' }}
                        primary={<Author />}
                        secondary={
                            <>
                                <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="#637381">
                                    {this.state.text}
                                </Typography>
                            </>
                        }
                    />
                </ListItem>
                {(!this.props.isCommentOwner && !this.props.isPostOwner && this.props.disableComments) || editorStatus
                    ? '$'
                    : rightIconMenu}
            </CommentPreview>
        );
        return editorStatus ? commentEdit : commentPreview;
    }
}

export default connectComment(CommentComponent as any);
