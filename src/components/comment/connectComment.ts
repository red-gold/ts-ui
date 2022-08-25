import React from 'react';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@mui/styles/withStyles/withStyles';
import * as commentActions from 'redux/actions/commentActions';
import * as userActions from 'redux/actions/userActions';
import { userSelector } from 'redux/reducers/users/userSelector';
import { Map } from 'immutable';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { ICommentComponentProps } from './ICommentComponentProps';
import { commentStyles } from './commentStyles';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: ICommentComponentProps) => {
    return {
        delete: (id: string | null, postId: string) => dispatch(commentActions.dbDeleteComment(id, postId)),
        update: (comment: Map<string, any>) => {
            dispatch(commentActions.dbUpdateComment(comment));
        },
        openEditor: () =>
            dispatch(
                commentActions.openCommentEditor(ownProps.comment.get('postId'), ownProps.comment.get('objectId')),
            ),
        closeEditor: () =>
            dispatch(
                commentActions.closeCommentEditor(ownProps.comment.get('postId'), ownProps.comment.get('objectId')),
            ),
        getUserInfo: () => dispatch(userActions.fetchProfileById(ownProps.comment.get('ownerUserId'))),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectUserProfileById = userSelector.selectUserProfileById();

    const mapStateToProps = (state: Map<string, any>, ownProps: ICommentComponentProps) => {
        const commentOwnerId = ownProps.comment.get('ownerUserId');
        const currentUser = selectCurrentUser(state);
        const uid = currentUser.get('userId');
        return {
            uid,
            avatar: ownProps.comment.get('ownerAvatar'),
            fullName: currentUser.get('ownerDisplayName', 'loading...'),
            isCommentOwner: uid === commentOwnerId,
            commentOwner: selectUserProfileById(state, { userId: commentOwnerId }),
        };
    };
    return mapStateToProps;
};

// - Connect component to redux store

export const connectComment = (component: React.ComponentType<ICommentComponentProps & WithTranslation>) => {
    const translateWrapper = withTranslation('translations')(component);

    return connect<{}, {}, any, any>(
        makeMapStateToProps,
        mapDispatchToProps,
    )(withStyles(commentStyles as any)(translateWrapper as any));
};
