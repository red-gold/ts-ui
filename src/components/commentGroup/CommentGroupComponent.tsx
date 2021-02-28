// - Import react components
import React, { Component } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Card, CardActions, CardHeader } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { teal } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import CommentListComponent from 'components/commentList/CommentListComponent';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { Comment } from 'core/domain/comments/comment';
import { ICommentGroupComponentProps } from './ICommentGroupComponentProps';
import { ICommentGroupComponentState } from './ICommentGroupComponentState';
import { connectCommentGroup } from './connectCommentGroup';
// - Import actions
// - Import app components

/**
 * Create component class
 */
export class CommentGroupComponent extends Component<ICommentGroupComponentProps, ICommentGroupComponentState> {
    static propTypes = {
        /**
         * If it's true comment box will be open
         */
        open: PropTypes.bool,
        /**
         * If it's true the comment is disable to write
         */
        disableComments: PropTypes.bool,
        /**
         * The post identifier which comment belong to
         */
        postId: PropTypes.string,
        /**
         * If it's true the post owner is the logged in user which this post be long to the comment
         */
        isPostOwner: PropTypes.bool,
        /**
         * Toggle on show/hide comment by passing callback from parent component
         */
        onToggleRequest: PropTypes.func,
        /**
         * The user identifier of the post owner which comment belong to
         */
        ownerPostUserId: PropTypes.string,
    };

    styles = {
        commentItem: {
            height: '60px',
            position: '',
            zIndex: '',
        },
        toggleShowList: {
            height: '60px',
            zIndex: 5,
        },
        writeCommentTextField: {
            width: '100%',
            fontWeight: 400,
            fontSize: '14px',
        },
        progressbar: {
            height: '1.5px',
            backgroundColor: 'rgb(245, 243, 243)',
            color: teal['A400'],
        },
        secondaryText: {
            fontSize: '13px',
            lineHeight: '20px',
            color: 'rgba(0,0,0,0.87)',
            fontWeight: 300,
            whiteSpace: 'pre-wrap',
        },
        primaryText: {
            fontSize: '13px',
            paddingRight: '10px',
            fontWeight: 400,
            color: 'rgba(0,0,0,0.87)',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        },
    };

    /**
     * Component constructor
     *
     */
    constructor(props: ICommentGroupComponentProps) {
        super(props);

        /**
         * Defaul state
         */
        this.state = {
            commentText: '',
            postDisable: true,
        };

        // Binding functions to `this`
        this.handlePostComment = this.handlePostComment.bind(this);
        this.clearCommentWrite = this.clearCommentWrite.bind(this);
        this.commentWriteBox = this.commentWriteBox.bind(this);
        this.loadCommentsList = this.loadCommentsList.bind(this);
    }

    /**
     * Clear comment text field
     */
    clearCommentWrite = () => {
        this.setState({
            commentText: '',
            postDisable: true,
        });
    };

    /**
     * Post comment
     */
    handlePostComment = () => {
        const { postId, fullName, avatar, uid, send } = this.props;
        const newComment = new Comment();
        newComment.postId = postId;
        newComment.text = this.state.commentText;
        newComment.ownerAvatar = avatar;
        newComment.ownerDisplayName = fullName;
        newComment.ownerUserId = uid;
        if (send) {
            send(Map(newComment));
        }

        this.clearCommentWrite();
    };

    /**
     * When comment text changed
     */
    handleChange = (event: any) => {
        const data = event.target.value;
        this.setState({ commentText: data });
        if (data.length === 0 || data.trim() === '') {
            this.setState({
                commentText: '',
                postDisable: true,
            });
        } else {
            this.setState({
                commentText: data,
                postDisable: false,
            });
        }
    };

    shouldComponentUpdate(nextProps: ICommentGroupComponentProps, nextState: ICommentGroupComponentState) {
        let shouldUpdate = false;

        if (!R.equals(this.state, nextState)) {
            shouldUpdate = true;
        } else if (nextProps.open !== this.props.open) {
            shouldUpdate = true;
        } else if (nextProps.disableComments !== this.props.disableComments) {
            shouldUpdate = true;
        } else if (nextProps.commentsRequestStatus !== this.props.commentsRequestStatus) {
            shouldUpdate = true;
        } else if (nextProps.comments !== this.props.comments) {
            shouldUpdate = true;
        }
        return shouldUpdate;
    }

    /**
     * Comment list box
     */
    commentWriteBox = () => {
        const { classes, postId, fullName, avatar, t } = this.props;
        if (!t) {
            return <div />;
        }
        return (
            <div>
                <Divider />
                <Paper key={postId + '-commentwrite'} elevation={0} className="animate2-top10">
                    <Card elevation={0}>
                        <CardHeader
                            className={classes.header}
                            avatar={<UserAvatar fullName={fullName} fileName={avatar} size={24} />}
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
                                    value={this.state.commentText}
                                    onChange={this.handleChange}
                                    className={classes.textField}
                                    fullWidth={true}
                                />
                            }
                        ></CardHeader>
                        <CardActions className={classes.postButton}>
                            <Button color="primary" disabled={this.state.postDisable} onClick={this.handlePostComment}>
                                {t('comment.postButton')}
                            </Button>
                        </CardActions>
                    </Card>
                </Paper>
            </div>
        );
    };

    /**
     * Loading Comments listItem
     *
     */
    loadCommentsList = () => {
        const { postId, open } = this.props;
        const comments: Map<string, Map<string, any>> = this.props.comments || Map({});
        const showComments =
            comments && comments.size > 0 ? (
                <Paper
                    elevation={0}
                    style={open ? { display: 'block', padding: '0px 0px' } : { display: 'none', padding: '12px 16px' }}
                >
                    <CommentListComponent
                        comments={comments}
                        isPostOwner={this.props.isPostOwner}
                        disableComments={this.props.disableComments}
                        postId={postId}
                    />
                </Paper>
            ) : (
                ''
            );
        return showComments;
    };

    /**
     * Reneder component DOM
     *
     */
    render() {
        const { postId, open, comments, commentsRequestStatus } = this.props;

        const commentProgress = <LinearProgress style={this.styles.progressbar} variant="indeterminate" />;

        /**
         * Return Elements
         */
        return (
            <div key={postId + '-comments-group'}>
                {comments && comments.size > 0 && <Divider />}
                <div style={open ? { display: 'block' } : { display: 'none' }}>
                    <Paper
                        elevation={0}
                        className="animate-top"
                        style={!open ? { display: 'block' } : { display: 'none' }}
                    >
                        <div style={{ position: 'relative', height: '60px' }}>
                            <Button
                                style={this.styles.toggleShowList}
                                fullWidth={true}
                                onClick={this.props.onToggleRequest}
                            >
                                {' '}
                            </Button>
                        </div>
                    </Paper>
                </div>

                {open
                    ? commentsRequestStatus === ServerRequestStatusType.Sent
                        ? commentProgress
                        : this.loadCommentsList()
                    : ''}
                {!this.props.disableComments && open ? this.commentWriteBox() : ''}
            </div>
        );
    }
}

export default connectCommentGroup(CommentGroupComponent as any);
