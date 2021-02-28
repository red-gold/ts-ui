// - Import react components
import { Card, CardHeader } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classNames from 'classnames';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import moment from 'moment/moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { ICommentComponentProps } from './ICommentComponentProps';
import { ICommentComponentState } from './ICommentComponentState';
import { connectComment } from './connectComment';
import { defaultNoValue } from 'utils/errorHandling';
import { WithTranslation } from 'react-i18next';

/**
 * Create component class
 */
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
     * Fields
     */
    buttonMenu = null;

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

    /**
     * Component constructor
     *
     */
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

    componentDidMount() {
        const { commentOwner, isCommentOwner, getUserInfo } = this.props;
        if (!isCommentOwner && !commentOwner && getUserInfo) {
            getUserInfo();
        }
    }

    /**
     * Reneder component DOM
     *
     */
    render() {
        /**
         * Comment object from props
         */
        const { comment, classes, t, editorStatus } = this.props;

        const { openMenu, anchorEl } = this.state;
        if (!t || !comment) {
            return <div />;
        }
        const rightIconMenu = (
            <div className={classes.menuRoot}>
                {this.props.isCommentOwner && (
                    <IconButton
                        buttonRef={(node: any) => {
                            this.buttonMenu = node;
                        }}
                        aria-owns={defaultNoValue(openMenu, false) ? 'comment-menu' : ''}
                        aria-haspopup="false"
                        onClick={this.handleCommentMenu}
                    >
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
                                    this.handleDelete(evt, comment.get('id', '0'), comment.get('postId', '0'))
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
                <NavLink to={`/${userId}`}>
                    {' '}
                    <span style={this.styles.author as any}>{comment.get('ownerDisplayName', 'Loading...')}</span>
                </NavLink>
                <span
                    style={{
                        fontWeight: 400,
                        fontSize: '8px',
                    }}
                >
                    {moment(comment.get('creationDate', 0)).local().fromNow()}
                </span>
            </div>
        );
        const userId = comment.get('ownerUserId');
        const commentBody = (
            <div style={{ outline: 'none', flex: 'auto', flexGrow: 1 }}>
                {editorStatus ? (
                    <TextareaAutosize
                        placeholder={t('comment.updateCommentPlaceholder')}
                        autoFocus
                        rowsMax="4"
                        value={this.state.text}
                        onChange={this.handleOnChange}
                        className={classes.textField}
                    />
                ) : (
                    <div className={classNames('animate2-top10', classes.commentBody)}>{this.state.text}</div>
                )}

                <div style={{ display: editorStatus ? 'flex' : 'none', flexDirection: 'row-reverse' }}>
                    <Button
                        color="primary"
                        disabled={this.state.editDisabled}
                        style={{ float: 'right', clear: 'both', zIndex: 5, margin: '0px 5px 5px 0px', fontWeight: 400 }}
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
        );
        return (
            <div className="animate-top" key={comment.get('id', '0')}>
                <Paper
                    elevation={0}
                    className="animate2-top10"
                    style={{ position: 'relative', padding: '', display: !this.state.display ? 'block' : 'none' }}
                >
                    <Card elevation={0}>
                        <CardHeader
                            className={classes.header}
                            title={editorStatus ? '' : <Author />}
                            subheader={commentBody}
                            avatar={
                                <NavLink to={`/${userId}`}>
                                    <UserAvatar
                                        fullName={comment.get('ownerDisplayName', '')}
                                        fileName={comment.get('ownerAvatar', '')}
                                        size={24}
                                    />
                                </NavLink>
                            }
                            action={
                                (!this.props.isCommentOwner && !this.props.isPostOwner && this.props.disableComments) ||
                                editorStatus
                                    ? ''
                                    : rightIconMenu
                            }
                        ></CardHeader>
                    </Card>
                </Paper>
            </div>
        );
    }
}

export default connectComment(CommentComponent as any);
