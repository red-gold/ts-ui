import { Map } from 'immutable';
import React from 'react';
import { connect } from 'react-redux';
import { ServerRequestStatusType } from 'store/actions/serverRequestStatusType';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';
import { serverSelector } from 'store/reducers/server/serverSelector';
import { ICommentGroupProps, IDispatchProps, IOwnProps, IStateProps } from './ICommentGroupProps';
import * as commentActions from 'store/actions/commentActions';
import StringAPI from 'api/StringAPI';
import { ServerRequestType } from 'constants/serverRequestType';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/styles/withStyles/withStyles';
import { commentGroupStyles } from './commentGroupStyles';
import { commentSelector } from 'store/reducers/comments/commentSelector';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        send: (newComment: Map<string, any>) => {
            dispatch(commentActions.dbAddComment(newComment));
        },
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectRequest = serverSelector.selectRequest();
    const selectEditorStatus = commentSelector.selectEditorStatus();
    const mapStateToProps = (state: Map<string, any>, ownProps: IOwnProps) => {
        const { postId } = ownProps;
        const requestId = StringAPI.createServerRequestId(ServerRequestType.CommentGetComments, postId);
        const currentUser = selectCurrentUser(state);
        const commentsRequest = selectRequest(state, { requestId: requestId });
        const commentsRequestStatus: ServerRequestStatusType = commentsRequest.get(
            'status',
            ServerRequestStatusType.NoAction,
        );
        const editorStatus = selectEditorStatus(state, { postId });
        return {
            commentsRequestStatus,
            currentUser,
            editorStatus,
        };
    };
    return mapStateToProps;
};

export const connectCommentGroup = (component: React.ComponentType<ICommentGroupProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);
    return connect<IStateProps, IDispatchProps, IOwnProps, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(commentGroupStyles)(translateWrapper));
};
