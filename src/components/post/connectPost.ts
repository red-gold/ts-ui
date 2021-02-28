import { push } from 'connected-react-router';
import { Map } from 'immutable';
import { ComponentType } from 'react';
import { connect } from 'react-redux';
import * as commentActions from 'store/actions/commentActions';
import * as globalActions from 'store/actions/globalActions';
import * as postActions from 'store/actions/postActions';
import * as voteActions from 'store/actions/voteActions';

import { IPostComponentProps } from './IPostComponentProps';
import { commentSelector } from 'store/reducers/comments/commentSelector';
import { authorizeSelector } from 'store/reducers/authorize/authorizeSelector';

/**
 * Map dispatch to props
 */
const mapDispatchToProps = (dispatch: any, ownProps: IPostComponentProps) => {
    const { post } = ownProps;
    return {
        vote: () => dispatch(voteActions.dbAddVote(post.get('id'), post.get('ownerUserId'))),
        unvote: () => dispatch(voteActions.dbDeleteVote(post.get('id'), post.get('ownerUserId'))),
        delete: (id: string) => dispatch(postActions.dbDeletePost(id)),
        toggleDisableComments: (status: boolean) => {
            dispatch(postActions.dbUpdatePost(post.set('disableComments', status), (x: any) => x));
        },
        toggleSharingComments: (status: boolean) => {
            dispatch(postActions.dbUpdatePost(post.set('disableSharing', status), (x: any) => x));
        },
        goTo: (url: string) => dispatch(push(url)),
        setHomeTitle: (title: string) => dispatch(globalActions.setHeaderTitle(title || '')),
        getPostComments: (ownerUserId: string, postId: string, page: number, limit: number) =>
            dispatch(commentActions.dbFetchComments(ownerUserId, postId, page, limit)),
    };
};

/**
 * Map state to props
 */
const makeMapStateToProps = () => {
    const selectCurrentUser = authorizeSelector.selectCurrentUser();
    const selectComments = commentSelector.selectPostComments();

    const mapStateToProps = (state: Map<string, any>, ownProps: IPostComponentProps) => {
        const commentList = selectComments(state, { postId: ownProps.post.get('id') });
        const currentUser = selectCurrentUser(state);
        const uid = currentUser.get('userId');

        const voteCount = ownProps.post.get('score', 0);
        const currentUserVote = ownProps.post.getIn(['votes', uid], false);

        return {
            commentList,
            avatar: ownProps.post.get('ownerAvatar', ''),
            fullName: ownProps.post.get('ownerDisplayName', ''),
            voteCount,
            currentUserVote,
            isPostOwner: uid === ownProps.post.get('ownerUserId'),
        };
    };
    return mapStateToProps;
};

export const connectPost = (component: ComponentType<IPostComponentProps>) =>
    connect<{}, {}, any, any>(makeMapStateToProps, mapDispatchToProps)(component as any);
