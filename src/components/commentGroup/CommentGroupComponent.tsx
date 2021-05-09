// - Import react components
import React, { Component } from 'react';
import * as R from 'ramda';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import CommentListComponent from 'components/commentList/CommentListComponent';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { ICommentGroupProps } from './ICommentGroupProps';
import { ICommentGroupState } from './ICommentGroupState';
import { connectCommentGroup } from './connectCommentGroup';
import { WithTranslation } from 'react-i18next';
import CommentInput from 'components/commentInput';

export class CommentGroupComponent extends Component<ICommentGroupProps & WithTranslation, ICommentGroupState> {
    constructor(props: ICommentGroupProps & WithTranslation) {
        super(props);

        /**
         * Defaul state
         */
        this.state = {
            commentText: '',
            postDisable: true,
        };

        // Binding functions to `this`
        this.loadCommentsList = this.loadCommentsList.bind(this);
    }

    shouldComponentUpdate(nextProps: ICommentGroupProps, nextState: ICommentGroupState) {
        let shouldUpdate = false;

        if (!R.equals(this.state, nextState)) {
            shouldUpdate = true;
        } else if (nextProps.open !== this.props.open) {
            shouldUpdate = true;
        } else if (nextProps.disableComments !== this.props.disableComments) {
            shouldUpdate = true;
        } else if (nextProps.commentsRequestStatus !== this.props.commentsRequestStatus) {
            shouldUpdate = true;
        } else if (!nextProps.comments.equals(this.props.comments)) {
            shouldUpdate = true;
        } else if (!nextProps.editorStatus.equals(this.props.editorStatus)) {
            shouldUpdate = true;
        }
        return shouldUpdate;
    }

    /**
     * Loading Comments listItem
     *
     */
    loadCommentsList = () => {
        const { postId, open, editorStatus, comments } = this.props;
        const showComments =
            comments.size > 0 ? (
                <Paper
                    elevation={0}
                    style={open ? { display: 'block', padding: '10px 0px' } : { display: 'none', padding: '12px 16px' }}
                >
                    <CommentListComponent
                        comments={comments}
                        isPostOwner={this.props.isPostOwner}
                        disableComments={this.props.disableComments}
                        postId={postId}
                        editorStatus={editorStatus}
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
        const { postId, open, comments, commentsRequestStatus, classes, currentUser, send, t } = this.props;

        const commentProgress = <LinearProgress className={classes.progressbar} variant="indeterminate" />;

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
                                className={classes.toggleShowList}
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
                {!this.props.disableComments && open ? (
                    <CommentInput currentUser={currentUser} postId={postId} send={send} t={t} />
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default connectCommentGroup(CommentGroupComponent);
