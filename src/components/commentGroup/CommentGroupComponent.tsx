import React from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import CommentListComponent from 'components/commentList/CommentListComponent';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { ICommentGroupProps } from './ICommentGroupProps';
import CommentInput from 'components/commentInput';
import { teal } from '@material-ui/core/colors';
import { useStyles } from './commentGroupStyles';
import * as commentActions from 'store/actions/commentActions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { Map } from 'immutable';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { commentSelector } from 'store/reducers/comments/commentSelector';

const LoadMoreRoot = styled('div')({
    textAlign: 'center',
});

const selectCurrentUser = authorizeSelector.selectCurrentUser();
const selectRequest = serverSelector.selectRequest();
const selectEditorStatus = commentSelector.selectEditorStatus();
const selectHasMoreData = commentSelector.selectHasMoreData();

export function CommentGroupComponent(props: ICommentGroupProps) {
    const [commentPage, setCommentPage] = React.useState(1);

    const classes = useStyles();
    const { t } = useTranslation();
    const { postId, comments, open } = props;

    // Dispatcher
    const dispatch = useDispatch();
    const send = (newComment: Map<string, any>) => {
        dispatch(commentActions.dbAddComment(newComment));
    };
    const loadComments = () => {
        dispatch(commentActions.dbFetchComments(postId, commentPage, 10));
        setCommentPage(commentPage + 1);
    };

    // Selectors
    const requestId = StringAPI.createServerRequestId(ServerRequestType.CommentGetComments, postId);
    const currentUser = useSelector((state: Map<string, any>) => selectCurrentUser(state));
    const commentsRequest = useSelector((state: Map<string, any>) => selectRequest(state, { requestId: requestId }));
    const commentsRequestStatus: ServerRequestStatusType = commentsRequest.get(
        'status',
        ServerRequestStatusType.NoAction,
    );
    const editorStatus = useSelector((state: Map<string, any>) => selectEditorStatus(state, { postId }));
    const hasMoreDate = useSelector((state: Map<string, any>) => selectHasMoreData(state, { postId }));

    /**
     * Loading Comments listItem
     *
     */
    const loadCommentsList = () => {
        const { postId } = props;
        const showComments =
            comments.size > 0 ? (
                <Paper
                    elevation={0}
                    style={open ? { display: 'block', padding: '10px 0px' } : { display: 'none', padding: '12px 16px' }}
                >
                    {hasMoreDate && commentsRequestStatus !== ServerRequestStatusType.Sent && (
                        <LoadMoreRoot>
                            <Button sx={{ color: 'text.secondary', textTransform: 'initial' }} onClick={loadComments}>
                                {t('comment.loadMoreComment')}
                            </Button>
                        </LoadMoreRoot>
                    )}
                    <CommentListComponent
                        comments={comments}
                        isPostOwner={props.isPostOwner}
                        disableComments={props.disableComments}
                        postId={postId}
                        editorStatus={editorStatus}
                    />
                </Paper>
            ) : (
                ''
            );
        return showComments;
    };

    const commentProgress = (
        <LinearProgress
            sx={{ height: '1.5px', backgroundColor: 'rgb(245, 243, 243)', color: teal['A400'] }}
            variant="indeterminate"
        />
    );

    /**
     * Return Elements
     */
    return (
        <div key={postId + '-comments-group'}>
            {comments && comments.size > 0 && <Divider />}
            <div style={open ? { display: 'block' } : { display: 'none' }}>
                <Paper elevation={0} className="animate-top" style={!open ? { display: 'block' } : { display: 'none' }}>
                    <div style={{ position: 'relative', height: '60px' }}>
                        <Button className={classes.toggleShowList} fullWidth={true} onClick={props.onToggleRequest}>
                            {' '}
                        </Button>
                    </div>
                </Paper>
            </div>
            {commentsRequestStatus === ServerRequestStatusType.Sent && commentProgress}
            {open && loadCommentsList()}
            {!props.disableComments && open ? (
                <CommentInput currentUser={currentUser} postId={postId} send={send} />
            ) : (
                ''
            )}
        </div>
    );
}

export default CommentGroupComponent;
